import {
    ExecutionContext,
    HttpException,
    createParamDecorator,
} from '@nestjs/common';
import { User } from 'src/repositories/user/user.entity';

export const GetUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user as User;
    },
);

export const GetSeller = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        if (request.seller === null || request.seller === undefined) {
            throw new HttpException('Seller not found', 404);
        }
        return request.seller;
    },
);
