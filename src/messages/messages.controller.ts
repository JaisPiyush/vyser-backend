import { Body, Controller, Get, Post } from '@nestjs/common';
import {
    ChatbotMessage,
    CreateMessageDto,
} from 'src/repositories/messages/messages.dto';
import { MessagesService } from 'src/repositories/messages/messages.service';
import { User } from 'src/repositories/user/user.entity';
import { GetUser } from 'src/shared/decorators';

@Controller('messages')
export class MessagesController {
    constructor(private messagesService: MessagesService) {}

    @Post('save')
    async create(@Body() messages: CreateMessageDto, @GetUser() user: User) {
        messages.sender = user.id;
        return await this.messagesService.create(messages);
    }

    @Get()
    async find(@GetUser() user: User) {
        return { messages: await this.messagesService.find(user.id) };
    }

    @Post('detectIntent')
    async detectIntent(
        @Body('sessionId') sessionId: string,
        @Body('text') text: string,
    ) {
        return await this.messagesService.detectIntent(sessionId, text);
    }

    @Post()
    async detectIntentAndSaveMessages(
        @GetUser() user: User,
        @Body('sessionId') sessionId: string,
        @Body('text') text: string,
        @Body('message') message: ChatbotMessage,
    ) {
        return {
            messages: await this.messagesService.detectIntentAndSaveMessages(
                user,
                message,
                sessionId,
                text,
            ),
        };
    }
}
