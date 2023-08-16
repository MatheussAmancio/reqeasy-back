module.exports = {
    jwt: {
        secret: process.env.SECRET_KEY,
        expiresIn: "1d"
    }
}