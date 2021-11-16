DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;

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
VALUES ('Chelsea Campostrini', 'user@example.com', 'xxx');
INSERT INTO users (name, email, password, is_admin)
VALUES ('Nicola Gaioni', 'admin@example.com', 'xxx', true);


--devo settare bene i required, unique, default values e !=''


-- sudo service postgresql start
-- createdb tutorialnextjsshop
-- psql -d tutorialnextjsshop -f utils/setup.sql