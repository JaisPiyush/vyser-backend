import { Module } from '@nestjs/common';
import { UserService } from 'src/repositories/user/user.service';
import { AuthGuard } from './auth.guard';

@Module({
    providers: [UserService, AuthGuard],
})
export class AuthModule {}
