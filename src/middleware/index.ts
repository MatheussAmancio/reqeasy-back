import jwt from 'jsonwebtoken';
import { AuthConfig } from "../config/auth";


async function doFilterAuth(req: any, res: any, next: any) {

    const authHeader = req.headers['authorization']
    if (!authHeader) {

        return res.json({ message: "Not authenticated" }).status(401)
    }

    const [, token] = authHeader.split(" ");

    try {
        const authConfig = new AuthConfig()
        //const bla = jwt.verify(token, authConfig.getJwt()!.secret!);
        const { sub: user_id } = jwt.verify(token, authConfig.getJwt()!.secret!);
        console.log("a")

        console.log(user_id)
        req.user = {
            id: user_id
        }
        console.log(req.user)
        return next();
    } catch {

        return res.json({ message: "Not authenticated" }).status(401)
    }
}

export default doFilterAuth
