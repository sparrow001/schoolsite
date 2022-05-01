export class NotArray extends Error {
    constructor(place) {
        super("Not array for " + place);
        this.name = "NotArray"
    }
}