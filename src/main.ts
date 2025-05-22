import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api')
   app.enableCors({
    origin: 'http://localhost:5173',  // allow requests from this origin
    credentials: true,                // allow cookies and auth headers if needed
  });
  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('The API description')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('users') // Optional: adds grouping for endpoints
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  await app.listen(process.env.PORT ?? 3000,()=>{
    console.log("server is running on port 3000")
  });
}
bootstrap();
