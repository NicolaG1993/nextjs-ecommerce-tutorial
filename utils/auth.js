import jwt from "jsonwebtoken";

export default function signToken(user) {
    return jwt.sign(
        {
            id: user.id,
            name: user.name,
            email: user.email,
            is_admin: user.is_admin,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "30d",
        }
    );
}
