import { newOrder } from "../../../utils/db";
import { isAuth } from "../../../utils/auth";
async function handler(req, res) {
    console.log("req.body:", req.body);

    try {
        const data = await newOrder({ ...req.body, userId: req.user.id });
        // console.log("data🥶:", data.rows[0]);
        res.status(201).json(data.rows[0]);
    } catch (err) {
        if (err.name === "UnauthorizedError") {
            // jwt authentication error
            return res.status(401).json({ message: "Invalid Token" });
        }

        // default to 500 server error
        console.error("err: ", err);
        return res.status(500).json({ message: err.message });
    }
    //da testare

    //fare err status 500 , server error
    //ad esempio quando manca payment method o altri required values, oppure errori
    // fare try catch ?
}

export default isAuth(handler); //middleware
