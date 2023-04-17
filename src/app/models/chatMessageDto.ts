export class ChatMessageDto {
    user: string;
    message: string;

    constructor(user: string, message: string){
        this.user = user;
        this.message = message;
    }

    getUser() {
        return this.user;
    }

    getMessage() {
        return this.message
    }
}
