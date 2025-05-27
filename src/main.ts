import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  if (process.env.NODE_ENV === 'DEV' || process.env.NODE_ENV === 'TEST') {
    app.enableCors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      allowedHeaders: 'Content-Type, Accept',
      credentials: true,
    });
    const config = new DocumentBuilder()
      .setTitle('Islands')
      .setDescription('The Islands API description')
      .setVersion('v1.0.0')
      .setContact('vanpipy', 'https://github.com/vanpipy', 'vanpipy@gmail.com')
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory);
  }
  await app.listen(3000, '0.0.0.0');
}
bootstrap();
