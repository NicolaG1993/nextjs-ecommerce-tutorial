import { getUser } from "../../../utils/db";
import { bcrypt } from "bcryptjs";
import signToken from "../../../utils/auth";

export default async function handler(req, res) {
    const email = req.body.email;
    let user = await getUser(email);
    console.log("user:", user);
    user = user.rows[0];

    if (user) {
        if (req.body.password === user.password) {
            // if (user && bcrypt.compareSync(req.body.password, user.password)) {
            const token = signToken(user);
            res.send({
                id: user.id,
                name: user.name,
                email: user.email,
                is_admin: user.is_admin,
                profile_pic_url: user.profile_pic_url,
                token,
            });
        } else {
            res.status(401).send({ message: "Invalid password" });
        }
    } else {
        res.status(401).send({ message: "Invalid email" });
    }
}
