DROP TABLE IF EXISTS products;

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
    description VARCHAR(255)
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

-- sudo service postgresql start
-- createdb tutorialnextjsshop
-- psql -d tutorialnextjsshop -f utils/setup.sql