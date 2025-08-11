import 'react-router';
import { createRequestHandler } from '@react-router/express';
import type express from 'express';
import webSocketAdapter from 'express-ws';
import handleStatusSocket from './api/status';
import apiPaths from 'common/api-paths';

export function enhanceExpress(expressApplication: express.Express) {
  const { app } = webSocketAdapter(expressApplication);

  app.ws(apiPaths.status, handleStatusSocket);

  app.use(
    createRequestHandler({
      build: () => import('virtual:react-router/server-build'),
    }),
  );
}
