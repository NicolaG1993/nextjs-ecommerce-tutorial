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
};
