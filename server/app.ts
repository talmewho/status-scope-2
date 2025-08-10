import 'react-router';
import { createRequestHandler } from '@react-router/express';
import type express from 'express';
import webSocketAdapter from 'express-ws';
import statusSocketHandler from './api/status';

declare module 'react-router' {
  interface AppLoadContext {
    VALUE_FROM_EXPRESS: string
  }
}

const webSocketPath = '/api/status';

export function enhanceExpress(expressApplication: express.Express) {
  const { app } = webSocketAdapter(expressApplication);

  app.ws(webSocketPath, statusSocketHandler);

  app.use(
    createRequestHandler({
      build: () => import('virtual:react-router/server-build'),
    }),
  );
}
