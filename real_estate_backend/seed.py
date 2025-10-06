from app import app
from models import db, User, Property, PropertyImage, Payment, Maintenance
from werkzeug.security import generate_password_hash
from datetime import datetime

with app.app_context():
    print("🧹 Clearing existing data...")
    db.drop_all()
    db.create_all()

    # =====================================================
    # USERS
    # =====================================================
    print("👤 Seeding users...")
    owner1 = User(
        full_name="John Doe",
        email="john@estate.com",
        phone="0712345678",
        role="owner",
        password_hash=generate_password_hash("password123")
    )
    tenant1 = User(
        full_name="Jane Smith",
        email="jane@tenant.com",
        phone="0723456789",
        role="tenant",
        password_hash=generate_password_hash("tenant123")
    )
    agent1 = User(
        full_name="Alice Agent",
        email="alice@agency.com",
        phone="0734567890",
        role="agent",
        password_hash=generate_password_hash("agent123")
    )
    buyer1 = User(
        full_name="Mark Buyer",
        email="mark@buyer.com",
        phone="0745678901",
        role="buyer",
        password_hash=generate_password_hash("buyer123")
    )
    seller1 = User(
        full_name="Sandra Seller",
        email="sandra@seller.com",
        phone="0756789012",
        role="seller",
        password_hash=generate_password_hash("seller123")
    )

    db.session.add_all([owner1, tenant1, agent1, buyer1, seller1])
    db.session.commit()

    # =====================================================
    # PROPERTIES
    # =====================================================
    print("🏘️ Seeding properties...")
    prop1 = Property(
        title="Luxury Apartment in Kilimani",
        description="A beautiful 3-bedroom apartment located in Kilimani, Nairobi, with modern finishes, a swimming pool, and ample parking space.",
        location="Kilimani, Nairobi",
        price=85000.00,
        status="available",
        property_type="apartment",
        owner_id=owner1.id
    )
    prop2 = Property(
        title="Beachfront Villa in Diani",
        description="A 5-bedroom luxury villa overlooking Diani beach. Includes private pool, garden, and beachfront access.",
        location="Diani, Mombasa",
        price=35000000.00,
        status="available",
        property_type="house",
        owner_id=owner1.id
    )
    prop3 = Property(
        title="Modern Office Space in Westlands",
        description="Spacious 10-room office with conference area, lounge, and parking. Perfect for startups or SMEs.",
        location="Westlands, Nairobi",
        price=150000.00,
        status="rented",
        property_type="office",
        owner_id=owner1.id
    )
    prop4 = Property(
        title="Prime Plot for Sale in Syokimau",
        description="A 1/8 acre plot with ready title deed and access road, ideal for residential development.",
        location="Syokimau, Machakos",
        price=4500000.00,
        status="available",
        property_type="land",
        owner_id=owner1.id
    )

    db.session.add_all([prop1, prop2, prop3, prop4])
    db.session.commit()

    # =====================================================
    # PROPERTY IMAGES
    # =====================================================
    print("🖼️ Seeding property images...")
    images = [
        PropertyImage(image_url="https://example.com/apartment1.jpg", property_id=prop1.id),
        PropertyImage(image_url="https://example.com/apartment2.jpg", property_id=prop1.id),
        PropertyImage(image_url="https://example.com/villa1.jpg", property_id=prop2.id),
        PropertyImage(image_url="https://example.com/villa2.jpg", property_id=prop2.id),
        PropertyImage(image_url="https://example.com/office1.jpg", property_id=prop3.id),
        PropertyImage(image_url="https://example.com/land1.jpg", property_id=prop4.id),
        PropertyImage(image_url="https://example.com/land2.jpg", property_id=prop4.id)
    ]
    db.session.add_all(images)
    db.session.commit()

    # =====================================================
    # PAYMENTS
    # =====================================================
    print("💰 Seeding payments...")
    payment1 = Payment(
        amount=85000.00,
        payment_type="rent",
        payment_date=datetime(2025, 10, 1),
        status="completed",
        user_id=tenant1.id,
        property_id=prop3.id
    )
    payment2 = Payment(
        amount=35000000.00,
        payment_type="purchase",
        payment_date=datetime(2025, 9, 20),
        status="completed",
        user_id=buyer1.id,
        property_id=prop2.id
    )
    payment3 = Payment(
        amount=4500000.00,
        payment_type="purchase",
        payment_date=datetime(2025, 9, 15),
        status="pending",
        user_id=buyer1.id,
        property_id=prop4.id
    )

    db.session.add_all([payment1, payment2, payment3])
    db.session.commit()

    # =====================================================
    # MAINTENANCE
    # =====================================================
    print("🧰 Seeding maintenance records...")
    maintenance1 = Maintenance(
        issue="Leaking pipe",
        description="Bathroom pipe leaking in master bedroom. Requires urgent repair.",
        cost=2500.00,
        status="in progress",
        property_id=prop1.id,
        user_id=tenant1.id
    )
    maintenance2 = Maintenance(
        issue="Broken window",
        description="Living room window shattered due to storm.",
        cost=4000.00,
        status="pending",
        property_id=prop3.id,
        user_id=tenant1.id
    )
    maintenance3 = Maintenance(
        issue="Garden light not working",
        description="Outdoor garden lights not turning on, needs electrician check.",
        cost=1200.00,
        status="completed",
        property_id=prop2.id,
        user_id=tenant1.id
    )

    db.session.add_all([maintenance1, maintenance2, maintenance3])
    db.session.commit()

    print("✅ Database seeded successfully with users, properties, images, payments, and maintenance records!")
