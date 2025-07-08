import enum
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import (String, Boolean, Integer, Text,
                        Enum as SQLAlchemyEnum, ForeignKey,
                        DateTime, func, Float)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from typing import List, Optional

db = SQLAlchemy()

product_tags_association = db.Table(
    'product_tags',
    db.Column('product_id', Integer, ForeignKey('products.id'), primary_key=True),
    db.Column('tag_id', Integer, ForeignKey('tags.id'), primary_key=True)
)


class User(db.Model):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(200), nullable=False)
    salt: Mapped[str] = mapped_column(String(80), nullable=False, default="")
    avatar: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    shipping_address: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean(), default=True)
    is_admin: Mapped[bool] = mapped_column(Boolean(), default=False)
    verified_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    updated_at: Mapped[Optional[datetime]] = mapped_column(DateTime, onupdate=func.now())
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    
    reviews: Mapped[List["Review"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    orders: Mapped[List["Order"]] = relationship(back_populates="user")

    def serialize(self):
        return {
            "id": self.id, "email": self.email, "name": self.name, "avatar": self.avatar,
            "is_active": self.is_active, "is_admin": self.is_admin
        }


class ContactMessage(db.Model):
    __tablename__ = 'contact_message'
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(120), nullable=False)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    def serialize(self):
        return {
            "id": self.id, "email": self.email, "name": self.name, "message": self.message,
        }


class Newsletter(db.Model):
    __tablename__ = 'newsletter'
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)

    def serialize(self):
        return {"id": self.id, "email": self.email}


class Product(db.Model):
    __tablename__ = 'products'
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    price: Mapped[float] = mapped_column(Float, nullable=False)
    stripe_price_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    stock_quantity: Mapped[int] = mapped_column(Integer, default=1)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    category_id: Mapped[Optional[int]] = mapped_column(ForeignKey("categories.id"))
    category: Mapped[Optional["Category"]] = relationship(back_populates="products")

    images: Mapped[List["ProductImage"]] = relationship(back_populates="product", cascade="all, delete-orphan")
    reviews: Mapped[List["Review"]] = relationship(back_populates="product", cascade="all, delete-orphan")
    tags: Mapped[List["Tag"]] = relationship(secondary=product_tags_association, back_populates="products")

    def serialize_simple(self):
        return {
            "id": self.id, "name": self.name, "price": self.price,
            "image_url": self.images[0].image_url if self.images else None
        }

    def serialize(self):
        num_reviews = len(self.reviews)
        avg_rating = sum(r.rating for r in self.reviews) / num_reviews if num_reviews > 0 else 0
        
        return {
            "id": self.id, "name": self.name, "description": self.description,
            "price": self.price , "stock_quantity": self.stock_quantity,
            "category": self.category.serialize() if self.category else None,
            "images": [image.serialize() for image in self.images],
            "tags": [tag.serialize() for tag in self.tags],
            "average_rating": avg_rating,
            "reviews": [review.serialize() for review in self.reviews],
            "stripe_price_id": self.stripe_price_id
        }


class ProductImage(db.Model):
    __tablename__ = 'product_images'
    id: Mapped[int] = mapped_column(primary_key=True)
    image_url: Mapped[str] = mapped_column(String(255), nullable=False)
    alt_text: Mapped[str] = mapped_column(String(255))

    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"))
    product: Mapped["Product"] = relationship(back_populates="images")

    def serialize(self):
        return {"id": self.id, "image_url": self.image_url, "alt_text": self.alt_text}


class Category(db.Model):
    __tablename__ = 'categories'
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)

    parent_id: Mapped[Optional[int]] = mapped_column(ForeignKey("categories.id"))
    parent: Mapped[Optional["Category"]] = relationship(remote_side=[id], back_populates="children")
    children: Mapped[List["Category"]] = relationship(back_populates="parent")
    products: Mapped[List["Product"]] = relationship(back_populates="category")

    def serialize(self):
        return {"id": self.id, "name": self.name, "parent_id": self.parent_id}


class Tag(db.Model):
    __tablename__ = 'tags'
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)

    products: Mapped[List["Product"]] = relationship(secondary=product_tags_association, back_populates="tags")

    def serialize(self):
        return {"id": self.id, "name": self.name}


class Review(db.Model):
    __tablename__ = 'reviews'
    id: Mapped[int] = mapped_column(primary_key=True)
    rating: Mapped[float] = mapped_column(Float, nullable=False)
    title: Mapped[Optional[str]] = mapped_column(String(200))
    comment: Mapped[Optional[str]] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"))
    product: Mapped["Product"] = relationship(back_populates="reviews")

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    user: Mapped["User"] = relationship(back_populates="reviews")

    def serialize(self):
        return {
            "id": self.id, "rating": self.rating, "comment": self.comment,
            "created_at": self.created_at.isoformat(), "title": self.title,
            "user_id": self.user_id,
            "user_name": self.user.name if self.user else "Anónimo",
            "user_avatar": self.user.avatar if self.user else None
        }


class OrderStatus(enum.Enum):
    pending = "pending"
    shipped = "shipped"
    delivered = "delivered"
    cancelled = "cancelled"


class Order(db.Model):
    __tablename__ = 'orders'
    id: Mapped[int] = mapped_column(primary_key=True)
    order_date: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    total_amount: Mapped[int] = mapped_column(Integer, nullable=False)
    status: Mapped[OrderStatus] = mapped_column(SQLAlchemyEnum(OrderStatus), default=OrderStatus.pending)
    stripe_session_id: Mapped[Optional[str]] = mapped_column(String(255), unique=True, nullable=True)

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    user: Mapped["User"] = relationship(back_populates="orders")
    items: Mapped[List["OrderItem"]] = relationship(back_populates="order", cascade="all, delete-orphan")

    def serialize(self):
        return {
            "id": self.id, "order_date": self.order_date.isoformat(),
            "total_amount": self.total_amount , "status": self.status.value,
            "user_id": self.user_id, "items": [item.serialize() for item in self.items],
            "user": self.user.serialize() if self.user else None
        }


class OrderItem(db.Model):
    __tablename__ = 'order_items'
    id: Mapped[int] = mapped_column(primary_key=True)
    quantity: Mapped[int] = mapped_column(Integer, default=1)
    price_per_unit: Mapped[int] = mapped_column(Integer, nullable=False)

    order_id: Mapped[int] = mapped_column(ForeignKey("orders.id"))
    order: Mapped["Order"] = relationship(back_populates="items")

    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"))
    product: Mapped["Product"] = relationship()

    def serialize(self):
        return {
            "id": self.id, "quantity": self.quantity,
            "price_per_unit": self.price_per_unit ,
            "product": self.product.serialize_simple() if self.product else None
        }