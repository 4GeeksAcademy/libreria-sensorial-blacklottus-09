import os
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
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


expire_in_minutes = 10
expires_delta = timedelta(minutes=expire_in_minutes)


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
        "image": data_files.get("avatar", None)
    }
    # se verifica que la respuesta tenga los datos solicitados
    if data["email"] is None or data["name"] is None or data["password"] is None:
        return jsonify({"msg": "Para poder crearse una cuenta se necesita la información completa"}), 400
    # se valida que el correo no este guardado en la base de datos
    user = User.query.filter_by(email=data["email"]).one_or_none()
    if user is not None:
        return jsonify({"msg": "Este correo ya esta registrado"}), 400

    # usando la funcion que esta en utils se valida la seguridad de la contraseña
    if password_security_check(data["password"]) == False:
        return jsonify({"msg": "Para poder crear el usuario se necesita una contraseña segura"}), 400
    # se crea el salt
    salt = b64encode(os.urandom(32)).decode("utf-8")
    # se crea la contraseña
    password = set_password(data["password"], salt)

    # se valida si se recibio una imagen y si se hizo se sube a cloudinary
    if data["image"] is not None:
        result_image = uploader.upload(data["image"])

        data["image"] = result_image["secure_url"]

    # se crea una instancia de la clase User que esta vacia y se le asignan los datos
    user = User()
    user.email = data["email"]
    user.name = data["name"]
    user.password = password
    user.salt = salt
    user.avatar = data["image"]
    # se intenta guardar los datos si se completa se hace commit si no se regresa el mensaje de error
    try:
        db.session.add(user)
        db.session.commit()
        return jsonify("User created"), 201
    except Exception as error:
        db.session.rollback()
        return jsonify(f"Error: {error.args}"), 500


@api.route('/login', methods=['POST'])
def handle_login():
    # se crea un endpoint login que recibe los datos de inicio de sesion del usuario
    data = request.json
    email = data.get("email", None)
    password = data.get("password", None)
    # si no se recibieron datos se retorna que se necesita la info para proceder
    if email is None or password is None:
        return ({"msg": "Todos los campos son requeridos para iniciar sesion"}), 400

    else:
        # si si se recibieron datos se filtran los datos de la tabla User buscando por la clave email
        # si no se encuentra retorna false si se encuentra uno retorna true y se encuentra mas de uno
        # retorna false
        user = User.query.filter_by(email=email).one_or_none()
        if user is None:
            return ({"msg": "Las credenciales de acceso son invalidas"}), 400
        else:
            if check_password(user.password, password, user.salt):
                # se revisa si el password concuerda con el que esta en la base de datos y si es correcto se envia un token
                additional_claims = {"is_admin": user.is_admin, "purpose" : "Login"}
                token = create_access_token(identity=str(
                    user.id), additional_claims=additional_claims)
                return jsonify({"token": token}), 200
            else:
                return ({"msg": "Las credenciales de acceso son invalidas"}), 400


@api.route('/get-all-users', methods=['GET'])
@admin_required()
def get_all_users():
    # se crea un endpoint para traer los datos de todos los usuarios y se filtra la info
    users = User.query.all()

    return jsonify(list(map(lambda item: item.serialize(), users))), 200


@api.route('/me', methods=['GET'])
@jwt_required()
def get_user():

    claims = get_jwt()
    if claims.get('purpose') != "Login":
        return jsonify({"msg": "Token inválido para esta operacion"}), 403
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if user is None:
        return jsonify({"msg": "No se encontraron usuarios"})
    return jsonify(user.serialize())


@api.route('/forgot-password', methods=["POST"])
def forgot_password():

    body = request.json
    email = body.get("email")
    user = User.query.filter_by(email=email).one_or_none()

    if user:
        additional_claims = {"purpose": "password_reset"}
        reset_token = create_access_token(
            identity=(str(user.id)),
            additional_claims=additional_claims,
            expires_delta=timedelta(hours=1)
        )

    reset_url = f'{os.getenv("FRONTEND_URL")}/recuperar-contraseña?token={reset_token}'
    message = f"""
        <div>
            <h1>Recupera tu contraseña</h1>
            <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
            <a href="{reset_url}" target="_blank">Restablecer Contraseña</a>
            <p>Si no solicitaste esto, por favor ignora este correo.</p>
        </div>
    """
    data = {
        "subject": "Recuperación de contraseña",
        "to": email,
        "message": message
    }

    sended_email = send_email(
        data.get("subject"), data.get("to"), data.get("message"))

    if sended_email:
        return jsonify({"msg": "Si tu correo está en nuestro sistema, recibirás un enlace para recuperar la contraseña."}), 200
    else:
        return jsonify({"msg": "internal error"}), 500


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
    if password_security_check(new_password) == False:
        return jsonify({"msg": "La contraseña debe ser segura"}), 400

    user_id = get_jwt_identity()
    user = User.query.get(str(user_id))

    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    user.password = set_password(new_password, user.salt)
    db.session.commit()

    return jsonify({"msg": "Contraseña actualizada exitosamente"}), 200
