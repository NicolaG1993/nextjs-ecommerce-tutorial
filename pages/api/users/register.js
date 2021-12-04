import { createUser } from "../../../utils/db";
import bcrypt from "bcryptjs";
import { signToken } from "../../../utils/auth";

export default async function handler(req, res) {
    const { name, email, password } = req.body;
    console.log("password:", req.body.password);
    const hashedPsw = bcrypt.hashSync(password);

    let user = await createUser(name, email, hashedPsw, false);
    // let user = await createUser(name, email, password, false);

    user = user.rows[0];

    console.log("user:", user);

    const token = signToken(user);
    res.send({
        id: user.id,
        name: user.name,
        email: user.email,
        is_admin: user.is_admin,
        profile_pic_url: user.profile_pic_url,
        token,
    });
}
