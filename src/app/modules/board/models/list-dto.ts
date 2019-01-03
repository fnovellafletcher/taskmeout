export class ListDto {

    constructor(
        public id: number,
        public id_user: number,
        public name: string,
        public updated_at: Date,
        public created_at: Date) {
    }
}
