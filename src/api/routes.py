import json
import os
import stripe
from sqlalchemy import or_
from sqlalchemy.sql import func
from flask import Flask, request, jsonify, url_for, Blueprint,  redirect

from api.models import (db, User, ContactMessage, Newsletter,
                        Product, ProductImage,
                        Category, Tag, Review, OrderStatus,
                        Order, OrderItem)
from api.utils import generate_sitemap, APIException, password_security_check, send_email
from api.decorators import admin_required
from flask_cors import CORS

from werkzeug.security import generate_password_hash, check_password_hash
from base64 import b64encode
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
import cloudinary.uploader as uploader

from datetime import timedelta

api = Blueprint('api', __name__)

CORS(api)


def set_password(password, salt):
    return generate_password_hash(f'{password}{salt}')


def check_password(pass_hash, password, salt):
    return check_password_hash(pass_hash, f'{password}{salt}')


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


@api.route('/register', methods=['POST'])
def handle_register():
    data_form = request.form
    data_files = request.files
    data = {
        "email": data_form.get("email", None),
        "name": data_form.get("name", None),
        "password": data_form.get("password", None),
        "avatar": data_files.get("avatar", None)
    }
    if data["email"] is None or data["name"] is None or data["password"] is None:
        return jsonify({"msg": "Para poder crearse una cuenta se necesita la información completa"}), 400
    user = User.query.filter_by(email=data["email"]).one_or_none()
    if user is not None:
        return jsonify({"msg": "Este usuario ya esta registrado"}), 400

    if password_security_check(data["password"]) == False:
        return jsonify({"msg": "Para poder crear el usuario se necesita una contraseña segura"}), 400
    salt = b64encode(os.urandom(32)).decode("utf-8")
    password = set_password(data["password"], salt)

    if data["avatar"] is not None:
        result_avatar = uploader.upload(data["avatar"])

        data["avatar"] = result_avatar["secure_url"]

    user = User()
    user.email = data["email"]
    user.name = data["name"]
    user.password = password
    user.salt = salt
    user.avatar = data["avatar"]
    try:
        db.session.add(user)
        db.session.commit()
        return jsonify("User created"), 201
    except Exception as error:
        db.session.rollback()
        return jsonify(f"Error: {error.args}"), 500


@api.route('/login', methods=['POST'])
def handle_login():
    data = request.json
    email = data.get("email", None)
    password = data.get("password", None)
    if email is None or password is None:
        return ({"msg": "Todos los campos son requeridos para iniciar sesion"}), 400

    else:

        user = User.query.filter_by(email=email).one_or_none()
        if user is None:
            return ({"msg": "Las credenciales de acceso son invalidas"}), 400
        else:
            if check_password(user.password, password, user.salt):
                additional_claims = {
                    "is_admin": user.is_admin, "purpose": "Login"}
                token = create_access_token(
                    identity=str(user.id),
                    additional_claims=additional_claims,
                    expires_delta=timedelta(hours=72))
                return jsonify({
                    "token": token,
                    "user": user.serialize()
                }), 200
            else:
                return ({"msg": "Las credenciales de acceso son invalidas"}), 400


@api.route('/get-all-users', methods=['GET'])
@jwt_required()
@admin_required()
def get_all_users():
    users = User.query.all()

    return jsonify(list(map(lambda item: item.serialize(), users))), 200


@api.route('/me', methods=['GET'])
@jwt_required()
def get_user():

    claims = get_jwt()
    if claims.get('purpose') != "Login":
        return jsonify({"msg": "Token inválido para esta operacion"}), 403
    user_id = get_jwt_identity()
    user = User.query.get(str(user_id))

    if user is None:
        return jsonify({"msg": "No se encontraron usuarios"})
    return jsonify(user.serialize())


@api.route('/me', methods=['PUT'])
@jwt_required()
def update_profile():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    data = request.json
    
    user.name = data.get('name', user.name)
    user.shipping_address = data.get('shipping_address', user.shipping_address)

    try:
        db.session.commit()
        return jsonify(user.serialize()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": f"Error al actualizar el perfil: {str(e)}"}), 500

@api.route('/me/avatar', methods=['POST'])
@jwt_required()
def upload_avatar():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    if 'avatar' not in request.files:
        return jsonify({"msg": "No se encontró el archivo del avatar"}), 400

    avatar_file = request.files['avatar']
    
    try:
        upload_result = uploader.upload(avatar_file)
        avatar_url = upload_result.get("secure_url")

        user.avatar = avatar_url
        db.session.commit()
        
        return jsonify({"avatar_url": avatar_url}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": f"Error al subir la imagen: {str(e)}"}), 500

@api.route('/forgot-password', methods=["POST"])
def forgot_password():
    body = request.json
    email = body.get("email")

    if not email:
        return jsonify({"msg": "El campo 'email' es requerido"}), 400

    user = User.query.filter_by(email=email).one_or_none()

    if user:
        additional_claims = {"purpose": "password_reset"}
        reset_token = create_access_token(
            identity=str(user.id),
            additional_claims=additional_claims,
            expires_delta=timedelta(hours=1)
        )

        reset_url = f'{os.getenv("FRONTEND_URL")}/recuperar-contraseña?token={reset_token}'

        message = f"""
            <div>
                <h1>Recupera tu contraseña</h1>
                <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
                <a href="{reset_url}" target="_blank">Restablecer Contraseña</a>
            </div>
        """

        data = {
            "subject": "Recuperación de contraseña",
            "to": email,
            "message": message
        }

        send_email(data.get("subject"), data.get("to"), data.get("message"))

    return jsonify({"msg": "Si tu correo está en nuestro sistema, recibirás un enlace."}), 200


@api.route('/reset-password', methods=["PUT"])
@jwt_required()
def handle_password_reset():
    claims = get_jwt()
    if claims.get('purpose') != "password_reset":
        return jsonify({"msg": "Token inválido para recuperación de contraseña"}), 403

    body = request.get_json()
    new_password = body.get("password")

    if not new_password:
        return jsonify({"msg": "Se requiere una nueva contraseña"}), 400

    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    user.password = set_password(new_password, user.salt)

    db.session.commit()

    return jsonify({"msg": "Contraseña actualizada exitosamente"}), 200


@api.route('/user-disable', methods=["PUT"])
@jwt_required()
@admin_required()
def disable_user():
    data = request.json
    user_id = data.get("user_id")

    if not user_id:
        return jsonify({"msg": "Se necesita el user id para proceder"}), 404

    user = User.query.get(str(user_id))
    user.is_active = False
    try:
        db.session.commit()
        return jsonify({"msg": f"el usuario {user.email} fue deshabilitado exitosamente"})
    except Exception as error:
        return jsonify({"msg", f"Hubo un error intente nuevamente y si el problema persiste contacte a soporte {error}"}), 404


@api.route('/user-enable', methods=["PUT"])
@jwt_required()
@admin_required()
def enable_user():
    data = request.json
    user_id = data.get("user_id")

    if not user_id:
        return jsonify({"msg": "Se necesita el user id para proceder"}), 404

    user = User.query.get(str(user_id))
    user.is_active = True
    try:
        db.session.commit()
        return jsonify({"msg": f"el usuario {user.email} fue re-habilitado exitosamente"})
    except Exception as error:
        return jsonify({"msg", f"Hubo un error intente nuevamente y si el problema persiste contacte a soporte {error}"}), 404


@api.route('/change-password', methods=["POST"])
@jwt_required()
def change_password():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    body = request.get_json()
    current_password = body.get("current_password")
    new_password = body.get("new_password")

    if not current_password or not new_password:
        return jsonify({"msg": "Se requiere la contraseña actual y la nueva contraseña"}), 400

    if not check_password(user.password, current_password, user.salt):
        return jsonify({"msg": "La contraseña actual es incorrecta"}), 401

    user.password = set_password(new_password, user.salt)
    db.session.commit()

    return jsonify({"msg": "Contraseña cambiada exitosamente"}), 200


@api.route('/contact-form', methods=["POST"])
def handle_Contact_Form():
    data = request.get_json()

    name = data.get('name')
    email = data.get('email')
    message = data.get('message')

    if not name or not email or not message:
        return jsonify({"msg": "Some fields are missing"}), 400

    try:
        new_message = ContactMessage(name=name, email=email, message=message)

        db.session.add(new_message)
        db.session.commit()

        success_response = {
            "msg": "Message received and saved successfully!",
            "status": "success",
            "data": {
                "id": new_message.id,
                "name": new_message.name,
                "email": new_message.email
            }
        }
        return jsonify(success_response), 200

    except Exception as error:
        db.session.rollback()
        return jsonify({"msg": f"Error saving the info in the database: {str(error)}"}), 500


@api.route('/contact-form', methods=["GET"])
@admin_required()
@jwt_required()
def getContactForm():
    try:
        all_messages = ContactMessage.query.all()

        messages_list = []
        for msg in all_messages:
            messages_list.append({
                "id": msg.id,
                "name": msg.name,
                "email": msg.email,
                "message": msg.message,
            })

        return jsonify(messages_list), 200

    except Exception as error:
        return jsonify({"msg": f"Error al recuperar mensajes de la base de datos: {error}"}), 500


@api.route('/newsletter', methods=['POST'])
def subscribe_newsletter():
    data = request.json
    email = data.get("email")

    if not email:
        return jsonify({"msg": "El email es requerido"}), 400

    new_subscription = Newsletter(email=email)

    try:
        db.session.add(new_subscription)
        db.session.commit()
        return jsonify({"msg": "¡Gracias por suscribirte!"}), 201
    except Exception as error:
        db.session.rollback()
        return jsonify({"msg": "Error al procesar la suscripción"}), 500


@api.route('/newsletter/suscriptions', methods=['GET'])
@jwt_required()
@admin_required()
def get_newsletter_suscriptors():
    try:
        subscriptions = Newsletter.query.all()
        return jsonify(list(map(lambda item: item.serialize(), subscriptions))), 200

    except Exception:
        return jsonify({"msg": "An internal error occurred"}), 500


@api.route('/products', methods=['POST'])
@jwt_required()
@admin_required()
def create_product():
    data = request.json
    name = data.get("name")
    description = data.get("description")
    category_id = data.get("category_id")
    price = data.get("price")
    stripe_price_id = data.get("stripe_price_id")

    stock_quantity = data.get("stock_quantity", 0)

    if not data or not name or not description or not category_id or not price:
        return jsonify({"msg": "Some fields are missing"}), 400

    new_product = Product(
        name=name,
        description=description,
        category_id=category_id,
        price=price,
        stock_quantity=stock_quantity,
        stripe_price_id=stripe_price_id
    )
    try:
        db.session.add(new_product)
        db.session.commit()
        return jsonify(new_product.serialize()), 201
    except Exception as error:
        db.session.rollback()
        return jsonify({"msg": f"Error creating product: {error}"}), 500


@api.route('/products', methods=['GET'])
def get_all_products():
    products = Product.query.all()

    return jsonify(list(map(lambda item: item.serialize(), products))), 200


@api.route('/products/<int:product_id>', methods=["GET"])
def get_product(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"msg": "Product not found"}), 404
    return jsonify(product.serialize()), 200


@api.route('/products/<int:product_id>', methods=['PUT'])
@jwt_required()
@admin_required()
def update_product(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"msg": "Producto no encontrado"}), 404

    data = request.json
    if not data:
        return jsonify({"msg": "No se recibieron datos"}), 400

    product.name = data.get("name", product.name)
    product.description = data.get("description", product.description)
    product.price = data.get("price", product.price)
    product.stock_quantity = data.get("stock_quantity", product.stock_quantity)
    product.category_id = data.get("category_id", product.category_id)
    product.stripe_price_id = data.get(
        "stripe_price_id", product.stripe_price_id)

    try:
        db.session.commit()
        return jsonify(product.serialize()), 200
    except Exception as error:
        db.session.rollback()
        return jsonify({"msg": f"Error al actualizar el producto: {error}"}), 500


@api.route('/products/<int:product_id>', methods=['DELETE'])
@jwt_required()
@admin_required()
def delete_product(product_id):
    product = Product.query.get(product_id)

    if not product:
        return jsonify({"msg": "Product not found"}), 404
    try:
        db.session.delete(product)
        db.session.commit()
        return jsonify({"msg": f"Produtct {product_id} deleted successfully"}), 200
    except Exception as error:
        db.session.rollback()
        return jsonify({"msg": f"Error  deleting the product {error}"}), 500


@api.route('/categories', methods=['POST'])
@jwt_required()
@admin_required()
def create_category():
    data = request.json
    name = data.get("name")
    parent_id = data.get("parent_id")

    if not name:
        return jsonify({"msg": "Category name is required"}), 400

    new_category = Category(
        name=name,
        parent_id=parent_id
    )
    try:
        db.session.add(new_category)
        db.session.commit()
        return jsonify(new_category.serialize()), 201
    except Exception as error:
        db.session.rollback()
        return jsonify({"msg": f"Error creating the category: {error}"}), 500


@api.route('/categories', methods=['GET'])
def get_all_categories():
    categories = Category.query.all()

    return jsonify(list(map(lambda item: item.serialize(), categories))), 200


@api.route('/categories/<int:category_id>', methods=['GET'])
def get_category(category_id):
    category = Category.query.get(category_id)

    if not category:
        return jsonify({"msg": "Category not found"}), 404

    return jsonify(category.serialize()), 200


@api.route('/categories/<int:category_id>', methods=['PUT'])
@jwt_required()
@admin_required()
def update_category(category_id):

    category = Category.query.get(category_id)
    if not category:
        return jsonify({"msg": "Category not found"}), 404

    data = request.json
    category.name = data.get("name", category.name)
    category.parent_id = data.get("parent_id", category.parent_id)
    try:
        db.session.commit()
        return jsonify(category.serialize()), 200
    except Exception as error:
        db.session.rollback()
        return jsonify({"msg": f"Error updating the category {error}"}), 500


@api.route('/categories/<int:category_id>', methods=['DELETE'])
@jwt_required()
@admin_required()
def delete_category(category_id):
    category = Category.query.get(category_id)
    if not category:
        return jsonify({"msg": "Category not found"}), 404

    if category.products:
        return jsonify({"msg": "Cannot delete category due to there are associated products"}), 400
    try:
        db.session.delete(category)
        db.session.commit()
        return jsonify({"msg": f"Category {category_id} deleted succesfuly"}), 200
    except Exception as error:
        db.session.rollback()
        return jsonify({"msg": f"Error deleting the category {error}"}), 500


@api.route('/products/<int:product_id>/images', methods=['POST'])
@jwt_required()
@admin_required()
def add_image_to_product(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"msg": "Product not found"}), 404

    if 'image_file' not in request.files:
        return jsonify({"msg": "No image file found in the request"}), 400

    image_file = request.files['image_file']
    alt_text = request.form.get("alt_text", f"Imagen de {product.name}")

    try:
        upload_result = uploader.upload(image_file)
        image_url = upload_result['secure_url']

        new_image = ProductImage(
            image_url=image_url,
            alt_text=alt_text,
            product_id=product.id
        )

        db.session.add(new_image)
        db.session.commit()
        return jsonify(new_image.serialize()), 201
    except Exception as error:
        db.session.rollback()
        return jsonify({"msg": f"Error al subir la imagen: {error}"}), 500


@api.route('/products/<int:product_id>/images', methods=['GET'])
def get_product_images(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"msg": "Product not found"}), 404

    images = product.images
    return jsonify(list(map(lambda item: item.serialize(), images))), 200


@api.route('/images/<int:image_id>', methods=['DELETE'])
@jwt_required()
@admin_required()
def delete_product_image(image_id):
    image = ProductImage.query.get(image_id)

    if not image:
        return jsonify({"msg": "Image not found"}), 404

    try:
        db.session.delete(image)
        db.session.commit()
        return jsonify({"msg": f"The image {image_id} deleted successfully"}), 200
    except Exception as error:
        db.session.rollback()
        return jsonify({"msg": f"Error deleting image {error}"}), 500


@api.route('/tags', methods=['POST'])
@jwt_required()
@admin_required()
def create_tag():
    data = request.json
    name = data.get("name")
    if not name:
        return jsonify({"msg": "Tag name is required"}), 400

    existing_tag = Tag.query.filter_by(name=name).first()
    if existing_tag:
        return jsonify({"msg": "Tag already exist"}), 409

    new_tag = Tag(name=name)

    try:
        db.session.add(new_tag)
        db.session.commit()
        return jsonify(new_tag.serialize()), 201
    except Exception as error:
        db.session.rollback()
        return jsonify({"msg": f"Error creating tag: {error}"}), 500


@api.route('/tags', methods=['GET'])
def get_all_tags():
    tags = Tag.query.all()

    return jsonify(list(map(lambda item: item.serialize(), tags))), 200


@api.route('/tags/<int:tag_id>', methods=['PUT'])
@jwt_required()
@admin_required()
def update_tag(tag_id):
    tag = Tag.query.get(tag_id)
    if not tag:
        return jsonify({"msg": "Etiqueta no encontrada"}), 404

    data = request.json
    tag.name = data.get('name', tag.name)
    db.session.commit()
    return jsonify(tag.serialize()), 200


@api.route('/tags/<int:tag_id>', methods=['DELETE'])
@jwt_required()
@admin_required()
def delete_tag(tag_id):
    tag = Tag.query.get(tag_id)
    if not tag:
        return jsonify({"msg": "Etiqueta no encontrada"}), 404

    db.session.delete(tag)
    db.session.commit()
    return jsonify({"msg": "Etiqueta eliminada"}), 200


@api.route('/products/<int:product_id>/tags/<int:tag_id>', methods=['POST'])
@jwt_required()
@admin_required()
def add_tag_to_product(product_id, tag_id):
    product = Product.query.get(product_id)
    tag = Tag.query.get(tag_id)

    if not product:
        return jsonify({"msg": "Product not found"}), 404
    if not tag:
        return jsonify({"msg": "Tag not found"}), 404

    product.tag.append(tag)

    try:
        db.session.commit()
        return jsonify(product.serialize()), 200
    except Exception as error:
        db.session.rollback()
    return jsonify({"msg": "An internal error occurred while adding the tag."}), 500


@api.route('/products/<int:product_id>/tags/<int:tag_id>', methods=['DELETE'])
@jwt_required()
@admin_required()
def remove_tag_from_product(product_id, tag_id):
    product = Product.query.get(product_id)
    tag = Tag.query.get(tag_id)

    if not product:
        return jsonify({"msg": "Product not found"}), 404
    if not tag:
        return jsonify({"msg": "Tag not found"}), 404

    if tag not in product.tags:
        return jsonify({"msg": "Tag is not associated with this product"}), 404

    product.tags.remove(tag)
    try:
        db.session.commit()
        return jsonify({"msg": "Tag removed from product successfully"}), 200
    except Exception as error:
        db.session.rollback()
        return jsonify({"msg": f"Error removing tag from product: {error}"}), 500


@api.route('/products/<int:product_id>/reviews', methods=['POST'])
@jwt_required()
def create_review(product_id):

    current_user_id = get_jwt_identity()

    product = Product.query.get(product_id)
    if not product:
        return jsonify({"msg": "Product not found"}), 404

    existing_review = Review.query.filter_by(
        product_id=product.id, user_id=current_user_id).first()
    if existing_review:
        return jsonify({"msg": "You have already reviewed this product"}), 409

    data = request.json
    rating_str = data.get("rating")

    if rating_str is None:
        return jsonify({"msg": "Rating is required"}), 400

    try:
        rating = int(rating_str)
    except ValueError:
        return jsonify({"msg": "Rating must be a valid integer"}), 400

    if rating < 1 or rating > 5:
        return jsonify({"msg": "Rating should be a number between 1 and 5"}), 400

    new_review = Review(
        rating=rating,
        title=data.get("title"),
        comment=data.get("comment"),
        product_id=product.id,
        user_id=current_user_id
    )

    try:
        db.session.add(new_review)
        db.session.commit()
        return jsonify(new_review.serialize()), 201
    except Exception as error:
        db.session.rollback()
        print(f"Error creating review: {error}")
        return jsonify({"msg": "An internal error occurred while creating the review", "details": str(error)}), 500


@api.route('/products/<int:product_id>/reviews', methods=['GET'])
def get_product_reviews(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"msg": "Product not found"}), 404

    reviews = [review.serialize() for review in product.reviews]
    return jsonify(reviews), 200


@api.route('/reviews/<int:review_id>', methods=['PUT'])
@jwt_required()
def update_review(review_id):
    current_user_id = get_jwt_identity()
    review = Review.query.get(review_id)

    if not review:
        return jsonify({"msg": "Review not found"}), 404

    if review.user_id != current_user_id:
        return jsonify({"msg": "Forbidden: You are not the author of this review"}), 403

    data = request.json
    review.rating = data.get("rating", review.rating)
    review.comment = data.get("comment", review.comment)

    try:
        db.session.commit()
        return jsonify(review.serialize()), 200
    except Exception as error:
        db.session.rollback()
        return jsonify({"msg": f"Error updating review: {error}"}), 500


@api.route('/reviews/<int:review_id>', methods=['DELETE'])
@jwt_required()
def delete_review(review_id):
    current_user_id = get_jwt_identity()

    review = Review.query.get(review_id)
    if not review:
        return jsonify({"msg": "Review not found"}), 404

    if review.user_id != current_user_id:
        return jsonify({"msg": "Forbidden: You are not the author of this review"}),  403

    try:
        db.session.delete(review)
        db.session.commit()
        return jsonify({"msg": "Review deleted successfully"}), 200
    except Exception as error:
        db.session.rollback()
        return jsonify({"msg": f"Error deleting review: {error}"}), 500


@api.route('/admin/reviews/<int:review_id>', methods=['DELETE'])
@jwt_required()
@admin_required()
def admin_delete_review(review_id):
    review = Review.query.get(review_id)
    if not review:
        return jsonify({"msg": "Review not found"}), 404

    try:
        db.session.delete(review)
        db.session.commit()
        return jsonify({"msg": "Review deleted by admin"}), 200
    except Exception as error:
        db.session.rollback()
        return jsonify({"msg": f"Error deleting review: {error}"}), 500


@api.route('/order/success', methods=['POST'])
@jwt_required()
def handle_payment_success():
    current_user_id = get_jwt_identity()
    session_id = request.json.get('session_id')

    if not session_id:
        return jsonify({"msg": "No se proporcionó el ID de sesión"}), 400

    try:
        checkout_session = stripe.checkout.Session.retrieve(
            session_id,
            expand=['line_items.data.price.product']
        )

        if checkout_session.payment_status != "paid":
            return jsonify({"msg": "El pago no fue completado o está pendiente"}), 400

        existing_order = Order.query.filter_by(
            stripe_session_id=session_id).first()
        if existing_order:
            return jsonify({"msg": "Esta orden ya fue procesada"}), 200

        line_items = checkout_session.line_items.data
        total_amount = checkout_session.amount_total / 100

        order_items_to_create = []
        for item in line_items:
            product_id = item.price.product.metadata.get('local_product_id')
            if not product_id:
                raise Exception(
                    "No se encontró el ID de producto local en los metadatos de Stripe.")

            product = Product.query.get(product_id)
            if not product:
                raise Exception(
                    f"Producto con ID {product_id} no encontrado en la base de datos.")

            quantity = item.quantity
            if product.stock_quantity < quantity:
                raise Exception(
                    f"Stock insuficiente para el producto {product.name}.")

            product.stock_quantity -= quantity

            order_items_to_create.append({
                "product_id": product_id,
                "quantity": quantity,
                "price_per_unit": product.price

            })

        new_order = Order(
            user_id=current_user_id,
            total_amount=total_amount,
            status='pending',
        )
        db.session.add(new_order)
        db.session.flush()

        for item_data in order_items_to_create:
            new_order_item = OrderItem(order_id=new_order.id, **item_data)
            db.session.add(new_order_item)

        db.session.commit()

        return jsonify(new_order.serialize()), 201
    except stripe.error.StripeError as e:
        return jsonify({"error": f"Error de Stripe: {str(e)}"}), 500
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


@api.route('/all-orders', methods=['GET'])
@jwt_required()
def get_user_orders():
    current_user_id = get_jwt_identity()
    user_orders = Order.query.filter_by(
        user_id=current_user_id).order_by(Order.order_date.desc()).all()
    results = [order.serialize() for order in user_orders]
    return jsonify(results), 200


@api.route('/orders', methods=['GET'])
@jwt_required()
@admin_required()
def get_all_orders():
    try:
        # Ordena por fecha para mostrar las más recientes primero
        orders = Order.query.order_by(Order.order_date.desc()).all()

        # Serializa cada orden en la lista
        results = [order.serialize() for order in orders]

        return jsonify(results), 200
    except Exception as e:
        return jsonify({"error": f"Ocurrió un error: {str(e)}"}), 500


@api.route('/orders/<int:order_id>', methods=['GET'])
@jwt_required()
def get_order_details(order_id):
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    order = Order.query.get(order_id)
    if not order:
        return jsonify({"msg": "Order not found"}), 404
    if order.user_id != current_user.id and not current_user.is_admin:
        return jsonify({"msg": "Forbidden"}), 403
    return jsonify(order.serialize()), 200


@api.route('/orders/<int:order_id>/status', methods=['PUT'])
@jwt_required()
@admin_required()
def update_order_status(order_id):
    order = Order.query.get(order_id)
    if not order:
        return jsonify({"msg": "Order not found"}), 404
    data = request.json
    new_status_str = data.get("status")
    try:
        new_status = OrderStatus(new_status_str)
    except ValueError:
        return jsonify({"msg": f"Invalid status: '{new_status_str}'"}), 400
    order.status = new_status
    try:
        db.session.commit()
        return jsonify(order.serialize()), 200
    except Exception as error:
        db.session.rollback()
        return jsonify({"msg": f"Error updating order status: {error}"}), 500


@api.route('/products/search', methods=['GET'])
def search_products():
    query = request.args.get('q')

    if not query:
        return jsonify({"msg": "A keyword is needed to search"}), 400

    search_term = f"%{query}%"

    products_found = Product.query.filter(
        or_(
            Product.name.ilike(search_term),
            Product.description.ilike(search_term)
        )
    ).all()

    if not products_found:
        return jsonify([]), 200
    results = [product.serialize() for product in products_found]
    return jsonify(results), 200


@api.route('/create-checkout-session', methods=['POST'])
@jwt_required()
def create_checkout_session():
    current_user_id = get_jwt_identity()
    cart_items = request.json
    line_items_for_stripe = []

    if not cart_items:
        return jsonify({"msg": "El carrito está vacío"}), 400

    try:
        for item in cart_items:
            product_id = item.get("product_id")
            quantity = item.get("quantity")

            product = Product.query.get(product_id)
            if not product:
                raise Exception(f"Producto con ID {product_id} no encontrado")

            if not product.stripe_price_id:
                raise Exception(
                    f"Producto '{product.name}' no está configurado para la venta.")

            line_items_for_stripe.append({
                "price": product.stripe_price_id,
                "quantity": quantity
            })

        checkout_session = stripe.checkout.Session.create(
            line_items=line_items_for_stripe,
            mode='payment',
            success_url=os.getenv(
                "FRONTEND_URL") + '/payment-success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url=os.getenv("FRONTEND_URL") + '/payment-canceled',
            metadata={
                'user_id': current_user_id,
                'cart_items': json.dumps(cart_items)
            }
        )

        return jsonify({"url": checkout_session.url}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400
