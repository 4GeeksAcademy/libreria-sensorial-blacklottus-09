import enum
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Integer, Text, Enum as SQLAlchemyEnum, ForeignKey, DateTime, func, Table
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from typing import List, Optional

db = SQLAlchemy()

product_tags_association = db.Table(
    'product_tags',
    db.Column('product_id', Integer, ForeignKey(
        'products.id'), primary_key=True),
    db.Column('tag_id', Integer, ForeignKey('tags.id'), primary_key=True)
)


class User(db.Model):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    # user info
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(200), nullable=False)
    salt: Mapped[str] = mapped_column(String(80), nullable=False, default="")
    avatar: Mapped[Optional[str]] = mapped_column(String(120), nullable=True)
    shipping_address: Mapped[str] = mapped_column(Text, nullable=True)
    # account status and roles
    is_active: Mapped[bool] = mapped_column(Boolean(), default=True)
    is_admin: Mapped[bool] = mapped_column(Boolean(), default=False)
    # verification and security
    verified_at: Mapped[Optional[datetime]
                        ] = mapped_column(DateTime, nullable=True)
    updated_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime, onupdate=func.now(), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), nullable=False)
    # relationships with other tables
    reviews = relationship("Review", back_populates="user")
    orders = relationship("Order", back_populates="user")

    def serialize(self):
        return {
            "id": self.id, "email": self.email, "name": self.name, "avatar": self.avatar,
            "is_active": self.is_active, "is_admin": self.is_admin,
            "verified_at": self.verified_at, "updated_at": self.updated_at, "created_at": self.created_at
        }


class ContactMessage(db.Model):
    __tablename__ = 'contact_message'
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(120), nullable=False)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[DateTime] = mapped_column(
        DateTime, server_default=func.now())

    def serialize(self):
        return {
            "id": self.id, "email": self.email, "name": self.name,
            "message": self.message,
        }


class Newsletter(db.Model):
    __tablename__ = 'newsletter'
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)

    def serialize(self):
        return {
            "id": self.id, "email": self.email,
        }


class Product (db.Model):
    __tablename__ = 'products'
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    price: Mapped[int] = mapped_column(Integer, nullable=False)
    stock_quantity: Mapped[int] = mapped_column(Integer, default=1)
    created_at: Mapped[DateTime] = mapped_column(
        DateTime, server_default=func.now())

    category_id: Mapped[int] = mapped_column(ForeignKey("categories.id"))
    category: Mapped["Category"] = relationship(back_populates="products")

    variants: Mapped[List["ProductVariant"]] = relationship(back_populates="product") 
    images: Mapped[List["ProductImage"]] = relationship(back_populates="product") 
    reviews: Mapped[List["Review"]] = relationship(back_populates="product") 
    tags: Mapped[List["Tag"]] = relationship(secondary=product_tags_association, back_populates="products")

    def serialize(self):
        return {
            "id": self.id, "name": self.name, "description": self.description, "created_at": self.created_at,
            "price": self.price, "stock_quantity":self.stock_quantity,
            "category": self.category.serialize() if self.category else None,
            "images": [image.serialize() for image in self.images],
            "variants": [variant.serialize() for variant in self.variants],
            "tags": [tag.serialize() for tag in self.tags],
            "average_rating": sum(r.rating for r in self.reviews) / len(self.reviews) if self.reviews else 0
        }


class ProductImage(db.Model):
    __tablename__ = 'product_images'
    id: Mapped[int] = mapped_column(primary_key=True)
    image_url: Mapped[str] = mapped_column(String(255), nullable=False)
    alt_text: Mapped[str] = mapped_column(String(255), nullable=False)

    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"))
    product: Mapped["Product"] = relationship(back_populates="images")

    def serialize(self):
        return {
            "id": self.id, "image_url": self.image_url, "alt_text": self.alt_text
        }


class ProductVariant(db.Model):
    __tablename__ = "product_variants"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[int] = mapped_column(String(120), nullable=False)
    description: Mapped[str] = mapped_column(Text)

    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"))
    product: Mapped["Product"] = relationship(back_populates="variants")

    def serialize(self):
        return {
            "id": self.id, "name": self.name, "description": self.description
        }


class Category (db.Model):
    __tablename__ = 'categories'
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[int] = mapped_column(String(120), nullable=False)

    parent_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("categories.id"))
    parent: Mapped["Category"] = relationship(
        remote_side=[id], back_populates="children")
    children: Mapped[List["Category"]] = relationship(back_populates="parent")
    products: Mapped[List["Product"]] = relationship(back_populates="category")

    def serialize(self):
        return {
            "id": self.id, "name": self.name, "parent_id": self.parent_id
        }


class Tag (db.Model):
    __tablename__ = 'tags'
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[int] = mapped_column(String(120), unique=True, nullable=False)

    products: Mapped[List["Product"]] = relationship(
        secondary=product_tags_association, back_populates="tags")

    def serialize(self):
        return {
            "id": self.id, "name": self.name
        }


class Review (db.Model):
    __tablename__ = 'reviews'
    id: Mapped[int] = mapped_column(primary_key=True)
    rating: Mapped[int] = mapped_column(Integer, nullable=False)
    comment: Mapped[Optional[str]] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now())

    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"))
    product: Mapped["Product"] = relationship(back_populates="reviews")

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    user: Mapped["User"] = relationship(back_populates="reviews")

    def serialize(self):
        return {
            "id": self.id, "rating": self.rating, "comment": self.comment,
            "created_at": self.created_at.isoformat(),
            "user_name": self.user.name if self.user else "Anónimo",
            "product_id": self.product_id, "user_id": self.user_id
        }


class OrderStatus (enum.Enum):
    pending = "pending"
    shipped = "shipped"
    delivered = "delivered"
    cancelled = "cancelled"


class Order(db.Model):
    __tablename__ = 'orders'
    id: Mapped[int] = mapped_column(primary_key=True)
    order_date: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now())
    total_amount: Mapped[int] = mapped_column(Integer, nullable=False)
    status: Mapped[OrderStatus] = mapped_column()

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    user: Mapped["User"] = relationship(back_populates="orders")
    items: Mapped[List["OrderItem"]] = relationship(back_populates="order")

    def serialize(self):
        return {
            "id": self.id, "order_date": self.order_date.isoformat(),
            "total_amount": self.total_amount, "status": self.status.value,
            "user_id": self.user_id, "items": [item.serialize() for item in self.items]
        }


class OrderItem(db.Model):
    __tablename__ = 'order_items'
    id: Mapped[int] = mapped_column(primary_key=True)
    quantity: Mapped[int] = mapped_column(Integer, default=1)
    price_per_unit: Mapped[int] = mapped_column(Integer, nullable=False)

    order_id: Mapped[int] = mapped_column(ForeignKey("orders.id"))
    order: Mapped["Order"] = relationship(back_populates="items")

    variant_id: Mapped[int] = mapped_column(ForeignKey("product_variants.id"))
    variant: Mapped["ProductVariant"] = relationship()

    def serialize(self):
        return {
            "id": self.id, "quantity": self.quantity, "price_per_unit": self.price_per_unit,
            "variant": self.variant.serialize() if self.variant else None
        }
