export class CreateMessageDto {
    message: Record<string, any>;
    sender: string;
    receiver: string;
}

export class MessageDto {
    id: string;
    message: Record<string, any>;
    created_at: Date;
    sender: string;
    receiver: string;
}
