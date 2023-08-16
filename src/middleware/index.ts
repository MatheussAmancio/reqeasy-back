import * as jwt from 'jsonwebtoken';
import { AuthenticationTokenGenerateError } from "../exceptions/AuthenticationTokenGenerateError";
import { AuthenticationTokenMissingException } from "../exceptions/AuthenticationTokenMissingException";


async function doFilterAuth(req: any, res: any, next: any) {

    const authHeader = req.headers['authorization']
    if (!authHeader) {
        throw new AuthenticationTokenMissingException();
    }

    const [, token] = authHeader.split(" ");

    try {
        const secret = process.env.SECRET_KEY || 'ASD!@AsD'
        const jwtVerify = jwt.verify(token, secret);

        return next();
    } catch {
        throw new AuthenticationTokenGenerateError();
    }
}

export default doFilterAuth
