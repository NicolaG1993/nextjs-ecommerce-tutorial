import { getProduct } from "../../../../utils/db";

export default async function handler(req, res) {
    const slug = req.query.id;
    console.log("slug:", slug);
    const data = await getProduct(slug);
    res.status(200).json(data);
}
