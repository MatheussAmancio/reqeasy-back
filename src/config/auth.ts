export class AuthConfig {

    getJwt() {
        return {
            secret: process.env.SECRET_KEY,
            expiresIn: "1d"
        }
    }
}

