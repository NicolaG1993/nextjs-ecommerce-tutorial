import { updateUser } from "../../../utils/db";
import { bcrypt } from "bcryptjs";
import { signToken, isAuth } from "../../../utils/auth";

async function handler(req, res) {
    let { id, name, email, password } = req.body;
    console.log("password:", req.body.password);

    if (name === "") {
        name = null;
    }
    if (email === "") {
        email = null;
    }
    if (password === "") {
        password = null;
    }
    if (password !== null) {
        password = bcrypt.hashSync(password);
    }

    // let user = await createUser(name, email, bcrypt.hashSync(password), false);
    let user = await updateUser(id, name, email, password);

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

export default isAuth(handler); //middleware
