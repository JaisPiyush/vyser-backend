import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { UserService } from 'src/entities/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private userService: UserService) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException();
        }

        try {
            const app = this.getFirebaseApp();
            const decodedToken = await getAuth(app).verifyIdToken(token);
            await this.userService.login(decodedToken.uid);
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
