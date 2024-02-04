import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { MessagesEntity } from './messages.entity';
import { ChatbotMessage, CreateMessageDto } from './messages.dto';
import { GoogleCloudService } from 'src/shared/gc.service';
import { User } from '../user/user.entity';

@Injectable()
export class MessagesService {
    constructor(
        @InjectRepository(MessagesEntity)
        private messagesRepository: Repository<MessagesEntity>,
        private readonly googleCloudService: GoogleCloudService,
    ) {}

    async create(_message: CreateMessageDto): Promise<MessagesEntity> {
        const message = new MessagesEntity();
        Object.assign(message, _message);
        return this.messagesRepository.save(message);
    }

    async find(p1: string, maxResults: number = 10): Promise<MessagesEntity[]> {
        const options: FindManyOptions<MessagesEntity> = {
            where: [{ sender: p1 }, { receiver: p1 }],
            order: { created_at: 'DESC' },
            take: maxResults,
        };
        return (await this.messagesRepository.find(options)).reverse();
    }

    async detectIntent(sessionId: string, text: string) {
        return (await this.googleCloudService.detectIntent(
            sessionId,
            text,
        )) as ChatbotMessage;
    }

    async detectIntentAndSaveMessages(
        user: User,
        message: ChatbotMessage,
        sessionId: string,
        text: string,
    ) {
        message.context.user.id = user.id;
        message.context.user.isSentByUser = true;
        message.context.timestamp = Date.now();
        const intentResponse = await this.detectIntent(sessionId, text);
        intentResponse.context.user.isSentByUser = false;
        intentResponse.context.timestamp = Date.now();
        const savedUserMessage = await this.create({
            message: message,
            sender: user.id,
            receiver: intentResponse.context.user.id,
            created_at: new Date(message.context.timestamp),
        });

        const savedBotMessage = await this.create({
            message: intentResponse,
            sender: intentResponse.context.user.id,
            receiver: user.id,
            created_at: new Date(intentResponse.context.timestamp),
        });

        return [savedUserMessage, savedBotMessage];
    }
}
