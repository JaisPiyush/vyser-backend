import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { MessagesEntity } from './messages.entity';
import { CreateMessageDto } from './messages.dto';

@Injectable()
export class MessagesService {
    constructor(
        @InjectRepository(MessagesEntity)
        private messagesRepository: Repository<MessagesEntity>,
    ) {}

    async create(_message: CreateMessageDto): Promise<MessagesEntity> {
        const message = new MessagesEntity();
        Object.assign(message, _message);
        return this.messagesRepository.save(message);
    }

    async findMessages(
        p1: string,
        p2: string,
        maxResults: number = 10,
    ): Promise<MessagesEntity[]> {
        const options: FindManyOptions<MessagesEntity> = {
            where: [
                { sender: p1, receiver: p2 },
                { sender: p2, receiver: p1 },
            ],
            order: { created_at: 'DESC' },
            take: maxResults,
        };
        return await this.messagesRepository.find(options);
    }
}
