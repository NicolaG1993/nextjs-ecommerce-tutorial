import { getOrderHistory } from "../../../utils/db";
import { isAuth } from "../../../utils/auth";

async function handler(req, res) {
    console.log("req.body:", req.body);
    try {
        const data = await getOrderHistory(req.user.id);
        console.log("data🥶:", data.rows);
        res.send(data.rows);
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
}

export default isAuth(handler); //middleware
