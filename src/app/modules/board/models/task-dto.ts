export class TaskDto {
    constructor(
        public id: number,
        public idlist: number,
        public task: string,
        public updated_at: Date,
        public created_at: Date) {
    }
}
