import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from 'src/repositories/messages/messages.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesEntity } from 'src/repositories/messages/messages.entity';

@Module({
    imports: [TypeOrmModule.forFeature([MessagesEntity])],
    providers: [MessagesService],
    controllers: [MessagesController],
})
export class MessagesModule {}
