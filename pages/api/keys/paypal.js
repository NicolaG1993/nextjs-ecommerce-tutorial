import { isAuth } from "../../../utils/auth";

async function handler(req, res) {
    res.send(process.env.PAYPAL_CLIENT_ID || "sb");
}

export default isAuth(handler);
