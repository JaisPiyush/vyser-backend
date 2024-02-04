export class CreateMessageDto {
    message: Record<string, any>;
    sender: string;
    receiver: string;
    created_at?: Date;
}

export class MessageDto {
    id: string;
    message: Record<string, any>;
    created_at: Date;
    sender: string;
    receiver: string;
}

export interface ChatbotMessageContext {
    payload: Record<string, any>;
    user: {
        id: string;
        isSentByUser: boolean;
    };
    actionId?: string;
    timestamp?: number;
}

export interface ChatbotMessageContent {
    type: 'text' | 'image' | 'chips';
    image?: {
        rawUrl: string;
        accessibilityText?: string;
    };
    options?: { title: string; actionId?: string }[];
    actionId?: string;
    text?: string;
}

export interface ChatbotMessage {
    richContent: ChatbotMessageContent[];
    context: ChatbotMessageContext;
}
