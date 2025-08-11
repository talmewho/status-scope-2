import 'react-router';
import { createRequestHandler } from '@react-router/express';
import type express from 'express';
import webSocketAdapter from 'express-ws';
import handleStatusSocket from './api/status';
import apiPaths from 'common/api-paths';
import handleMockStatus from './api/mock-status';
import configuration from './services/configuration';

export function enhanceExpress(expressApplication: express.Express) {
  const { app } = webSocketAdapter(expressApplication);

  app.ws(apiPaths.status, handleStatusSocket);

  if (!configuration.isProduction && configuration.shouldServeMockStatus) {
    app.get(apiPaths.mockStatus, handleMockStatus);
  }

  app.use(
    createRequestHandler({
      build: () => import('virtual:react-router/server-build'),
    }),
  );
}
