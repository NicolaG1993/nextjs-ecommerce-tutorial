// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getAllProducts } from "../../utils/db";

export default async function handler(req, res) {
    const data = await getAllProducts();
    res.status(200).json(data);
}
