

export class RequestError {

    public message: string = 'An error occured on the server';
    public status: number = 500;

    constructor(status?: number, message?: string) {

        this.status = status || this.status;
        this.message = message || this.message;
    
    }

    toString(): string {

        return `${this.status} - ${this.message}`;
    
    }

}