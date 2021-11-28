/*
const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/finalproject"
);

*/

/*

1.recuperare lezione di psql da spiced
2.entrare via terminal e creare nuova table
3.collegare tabella al progetto

*/

const { Pool, Client } = require("pg");
const connectionString =
    process.env.DATABASE_URL ||
    "postgresql://postgres:postgres@localhost:5432/tutorialnextjsshop";
// "postgresql://user:secretpassword@database.server.com:3211/mydb";
//usiamo il db local in dev, ma per deploy ne dobbiamo usare uno hostato (su heroku probabilmente)

// const pool = new Pool({
//     connectionString,
// });

// pool.query("SELECT NOW()", (err, res) => {
//     console.log(err, res);
//     pool.end();
// });

const db = new Client({
    connectionString,
});
db.connect();

// db.query("SELECT NOW()", (err, res) => {
//     console.log(err, res);
//     db.end();
// });

module.exports.getAllProducts = () => {
    const myQuery = `SELECT * FROM products`;
    return db.query(myQuery);
};

module.exports.getProduct = (str) => {
    const myQuery = `SELECT * FROM products WHERE (slug = $1)`;
    const key = [str];
    return db.query(myQuery, key);
};

module.exports.addItem = (
    name,
    slug,
    category,
    image,
    price,
    brand,
    rating,
    numReviews,
    countInStock,
    description
) => {
    const myQuery = `INSERT INTO products (name, slug, category, image, price, brand, rating, numReviews, countInStock, description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
    const keys = [
        name,
        slug,
        category,
        image,
        price,
        brand,
        rating,
        numReviews,
        countInStock,
        description,
    ];
    return db.query(myQuery, keys);
}; // to check

// USERS
module.exports.getUser = (email) => {
    const myQuery = `SELECT * FROM users WHERE email = $1`;
    const key = [email];
    return db.query(myQuery, key);
};
module.exports.createUser = (name, email, password, isAdmin) => {
    const myQuery = `INSERT INTO users (name, email, password, is_admin) VALUES ($1, $2, $3, $4) RETURNING *`;
    const keys = [name, email, password, isAdmin];
    return db.query(myQuery, keys);
};

//ORDERS
module.exports.newOrder = ({
    userId,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    isPaid,
    isDelivered,
    paidAt,
    deliveredAt,
}) => {
    const myQuery = `INSERT INTO orders (userId, orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice, isPaid, isDelivered, paidAt, deliveredAt) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`;
    const keys = [
        userId,
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        isPaid,
        isDelivered,
        paidAt,
        deliveredAt,
    ];
    return db.query(myQuery, keys);
};

module.exports.getOrder = (orderId) => {
    const myQuery = `SELECT orders.*, users.name, users.email, users.is_admin, users.profile_pic_url
    FROM orders
    JOIN users 
    ON (orderId = $1 AND userId = users.id)
    ORDER BY createdAt ASC`;
    const key = [orderId];
    return db.query(myQuery, key);
}; // to check
// da user mi serve solo nome e email
