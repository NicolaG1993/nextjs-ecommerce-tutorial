DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS orders;

CREATE TABLE products(
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL CHECK (name != ''),
    slug VARCHAR NOT NULL CHECK (slug != ''),
    category VARCHAR NOT NULL CHECK (category != ''),
    image VARCHAR(255),
    price INT,
    brand VARCHAR NOT NULL CHECK (brand != ''),
    rating INT,
    numReviews INT,
    countInStock INT,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO products (name, slug, category, image, price, brand, rating, numReviews, countInStock, description)
VALUES ('Free Shirt', 'free-shirt', 'Shirts', '/images/shirt1.jpg', 70, 'Nike', 4.5, 10, 20, 'A popular shirt');

INSERT INTO products (name, slug, category, image, price, brand, rating, numReviews, countInStock, description)
VALUES ('Fit Shirt', 'fit-shirt', 'Shirts', '/images/shirt2.jpg', 40, 'Adidas', 4, 10, 20, 'A fit shirt');

INSERT INTO products (name, slug, category, image, price, brand, rating, numReviews, countInStock, description)
VALUES ('Polo', 'polo', 'Ralph Lauren', '/images/shirt3.jpg', 90, 'Nike', 4.8, 10, 20, 'A polo');

INSERT INTO products (name, slug, category, image, price, brand, rating, numReviews, countInStock, description)
VALUES ('Casual Shirt', 'casual-shirt', 'Shirts', '/images/shirt4.jpg', 60, 'Adidas', 4.5, 10, 20, 'A popular shirt');

INSERT INTO products (name, slug, category, image, price, brand, rating, numReviews, countInStock, description)
VALUES ('Sport Shirt', 'sport-shirt', 'Shirts', '/images/shirt5.jpeg', 30, 'Nike', 5, 10, 20, 'A sportive shirt');

INSERT INTO products (name, slug, category, image, price, brand, rating, numReviews, countInStock, description)
VALUES ('Basketball Shorts Adidas', 'basketball-shorts', 'Pants', '/images/pants1.jpg', 45, 'Adidas', 3.9, 10, 20, 'Some Basketball shorts');

INSERT INTO products (name, slug, category, image, price, brand, rating, numReviews, countInStock, description)
VALUES ('Casual Shoes', 'casual-shoes', 'Shoes', '/images/shoes1.jpg', 130, 'Nike', 4.1, 10, 20, 'Some casual shoes');


CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL CHECK (name != ''),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT false,
    profile_pic_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (name, email, password)
VALUES ('John Wayne', 'user1@example.com', 'xxx');
INSERT INTO users (name, email, password)
VALUES ('Giuseppe Verdi', 'user@example.com', 'xxx');
INSERT INTO users (name, email, password, is_admin)
VALUES ('Nicola Gaioni', 'admin@example.com', 'xxx', true);

CREATE TABLE orders(
    orderId SERIAL PRIMARY KEY,
    userId INT NOT NULL,
    orderItems TEXT[],
    shippingAddress JSON NOT NULL,
    paymentMethod VARCHAR NOT NULL,
    itemsPrice DECIMAL(12,2) NOT NULL,
    shippingPrice DECIMAL(12,2) NOT NULL,
    taxPrice DECIMAL(12,2) NOT NULL,
    totalPrice DECIMAL(12,2) NOT NULL,
    isPaid BOOLEAN DEFAULT false,
    isDelivered BOOLEAN DEFAULT false,
    paidAt TIMESTAMP,
    deliveredAt TIMESTAMP,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

INSERT INTO orders (userId, orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice, isPaid, isDelivered, paidAt, deliveredAt)
VALUES (
    1,
    array['{itemId: 1, quantity: 1}', '{itemId: 2, quantity: 1}'], 
    '{"fullName": "Nicola Gaioni", "address": "Via Porto 1", "city": "Cassone", "postalCode": "37010", "country": "Italy"}',
    'PayPal',
    15,
    0,
    0.5,
    15.5,
    true,
    false,
    '2020-06-22 19:10:25-07',
    null
);
-- '[{"itemId": 1, "quantity": 1}, {"itemId": "2", "quantity": "2"}]', 
-- '[{'name': 'Pants', 'quantity': 1, 'image': '', 'price': 10}, {'name': '', 'quantity': '', 'image': '', 'price': 5}]', 

--forse mi conviene salvare solo user id, e prenderlo successivamente quando mi serve 
-- {id: 3, name: 'Nicola Gaioni', email: 'admin@example.com'}, 
--forse mi conviene fare lo stesso con orderItems, salvare solo id e quantitá
-- poi prenderli da altra table e creare array nel momento che richiedo l'ordine (magari adirittura in client, e non via JOIN TABLE)
-- visto che non saprei come accedere ai valori




--devo settare bene i required, unique, default values e !=''
--devo inoltre testare tutti i "NOT NULL" e "CHECK", non sono sicuro che funzionino tutti, o quali siano richiesti


-- sudo service postgresql start
-- createdb tutorialnextjsshop
-- psql -d tutorialnextjsshop -f utils/setup.sql