export class AuditTrail {
    constructor(
        public field : String,
        public oldValue: String,
        public newValue: String,
        public id: Number,
        public date: Date
    ) {

    }
}