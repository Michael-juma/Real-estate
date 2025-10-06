from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import validates
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

db = SQLAlchemy()

# ===========================================================
# USERS TABLE
# ===========================================================
class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20))
    role = db.Column(db.String(50), nullable=False)  # owner, tenant, buyer, agent, seller
    password_hash = db.Column(db.String(256), nullable=False)

    properties = db.relationship('Property', back_populates='owner', lazy=True)
    payments = db.relationship('Payment', back_populates='user', lazy=True)
    maintenances = db.relationship('Maintenance', back_populates='user', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

# ===========================================================
# PROPERTY TABLE
# ===========================================================
class Property(db.Model):
    __tablename__ = 'properties'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=False)
    location = db.Column(db.String(120), nullable=False)
    price = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(50), default="available")  # available, rented, sold
    property_type = db.Column(db.String(50), nullable=False)  # apartment, land, house, office

    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    owner = db.relationship('User', back_populates='properties')

    images = db.relationship('PropertyImage', back_populates='property', cascade="all, delete")
    payments = db.relationship('Payment', back_populates='property', lazy=True)
    maintenances = db.relationship('Maintenance', back_populates='property', lazy=True)

# ===========================================================
# PROPERTY IMAGES TABLE
# ===========================================================
class PropertyImage(db.Model):
    __tablename__ = 'property_images'

    id = db.Column(db.Integer, primary_key=True)
    image_url = db.Column(db.String(255), nullable=False)
    property_id = db.Column(db.Integer, db.ForeignKey('properties.id'))

    property = db.relationship('Property', back_populates='images')

# ===========================================================
# PAYMENT TABLE
# ===========================================================
class Payment(db.Model):
    __tablename__ = 'payments'

    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float, nullable=False)
    payment_type = db.Column(db.String(50), nullable=False)  # rent, purchase
    payment_date = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(50), default='completed')

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    property_id = db.Column(db.Integer, db.ForeignKey('properties.id'))

    user = db.relationship('User', back_populates='payments')
    property = db.relationship('Property', back_populates='payments')

# ===========================================================
# MAINTENANCE TABLE
# ===========================================================
class Maintenance(db.Model):
    __tablename__ = 'maintenances'

    id = db.Column(db.Integer, primary_key=True)
    issue = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text)
    cost = db.Column(db.Float, nullable=True)
    date_reported = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(50), default="pending")

    property_id = db.Column(db.Integer, db.ForeignKey('properties.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))  # who reported

    property = db.relationship('Property', back_populates='maintenances')
    user = db.relationship('User', back_populates='maintenances')
