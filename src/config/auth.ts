export class AuthConfig {

    secret: string
    expiresIn: string

    constructor() {
        this.secret = process.env.SECRET_KEY || '@!%asTHSD!25%%$#'
        this.expiresIn = "1d"
    }

    getJwt() {
        return {
            secret: this.secret,
            expiresIn: this.expiresIn
        }
    }
}
