import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateMessageDto } from 'src/repositories/messages/messages.dto';
import { MessagesService } from 'src/repositories/messages/messages.service';

@Controller('messages')
export class MessagesController {
    constructor(private messagesService: MessagesService) {}

    @Post()
    async create(@Body() messages: CreateMessageDto) {
        return await this.messagesService.create(messages);
    }

    @Get()
    async find(@Query('p1') p1: string, @Query('p2') p2: string) {
        return await this.messagesService.find(p1, p2);
    }
}
