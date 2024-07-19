export class ResetPassword {
    constructor(
        public username: String,
        public phoneNumber: Number,
        public password: String,
        public confirmpassword: String
    ){

    }
}