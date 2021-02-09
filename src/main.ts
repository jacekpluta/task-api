import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';
declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);

  const serverConfig = config.get('server');

  if (process.env.NODE_ENV === 'dev') {
    app.enableCors();
  } else {
    app.enableCors({ origin: serverConfig.origin });
  }

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
