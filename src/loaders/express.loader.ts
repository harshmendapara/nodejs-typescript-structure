import express from 'express';
import helmet from 'helmet';
import config from '../config/config';
import routes from '../routes/index.route';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import * as path from 'path';
import * as fs from 'fs';
const swaggerDocument = YAML.load(path.resolve(__dirname, '../../', 'doc.yaml'));

export default ({ app }: { app: express.Application }) => {
  app.use(express.json());
  app.use(
    helmet({
      frameguard: {
        action: 'deny'
      },
      hidePoweredBy: true,
      xssFilter: true,
      noSniff: true,
      ieNoOpen: true,
      hsts: {
        maxAge: 7776000,
        force: true
      }
    })
  );
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    next();

    app.use(config.api.prefix, routes());
  });
};
