export class HashPassUseCase {
    bcrypt: any
    constructor(bcrypt: any) {
        this.bcrypt = bcrypt
    }

    async execute(password: string) {
        return await this.bcrypt.hash(password, 10)
    }
}