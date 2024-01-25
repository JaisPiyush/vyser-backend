import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ErrorFilter } from './shared/error.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe());
    const httpAdapterHost = app.get(HttpAdapterHost);

    app.useGlobalFilters(new ErrorFilter(httpAdapterHost));
    await app.listen(3000);
}
bootstrap();
