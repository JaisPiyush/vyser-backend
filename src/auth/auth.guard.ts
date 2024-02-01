import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { App, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { SellerService } from 'src/repositories/seller/seller.service';
import { UserService } from 'src/repositories/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
    private readonly firebaseApp: App;
    constructor(
        private userService: UserService,
        private sellerService: SellerService,
    ) {
        this.firebaseApp = this.getFirebaseApp();
    }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException();
        }

        try {
            const decodedToken = await getAuth(this.firebaseApp).verifyIdToken(
                token,
            );
            const user = await this.userService.login(decodedToken.uid);
            request['user'] = user;
            const seller = await this.sellerService.get(user.id);
            if (seller) {
                request['seller'] = seller;
            }
        } catch (e) {
            throw new UnauthorizedException();
        }
        return true;
    }

    getFirebaseApp() {
        const config = {
            apiKey: process.env.FIREBASE_API_KEY,
            authDomain: process.env.FIREBASE_AUTH_DOMAIN,
            projectId: process.env.FIREBASE_PROJECT_ID,
            appId: process.env.FIREBASE_APP_ID,
        };

        const app = initializeApp(config);
        return app;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] =
            (request.headers as any).authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
