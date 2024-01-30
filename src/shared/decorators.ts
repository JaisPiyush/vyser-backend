import {
    ExecutionContext,
    HttpException,
    createParamDecorator,
} from '@nestjs/common';
import { User } from 'src/repositories/user/user.entity';

export const GetUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        if (request.user === null || request.user === undefined) {
            throw new HttpException('Unauthorized', 401);
        }
        return request.user as User;
    },
);

export const GetSeller = createParamDecorator(
    (throwError: boolean = true, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        if (
            (request.seller === null || request.seller === undefined) &&
            throwError
        ) {
            throw new HttpException('Seller not found', 404);
        }
        return request.seller;
    },
);
