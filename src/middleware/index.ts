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
        const jwtResp = jwt.verify(token, authConfig.getJwt().secret);
        req.header.user = {
            id: Object.values(jwtResp)[0]
        }

        return next();
    } catch {

        return res.json({ message: "Not authenticated" }).status(401)
    }
}

export default doFilterAuth
