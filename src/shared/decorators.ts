import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User } from 'src/repositories/user/user.entity';

export const GetUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user as User;
    },
);
