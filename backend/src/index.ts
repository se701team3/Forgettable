import express from 'express';
import { connect } from 'mongoose';
import cors from 'cors';
import routes from './routes';
import config from './utils/config';
import logger from './utils/logger';
import middleware from './utils/middleware';
import app from './server';

if (process.env.NODE_ENV !== 'test') {
  connect(config.MONGODB_URI)
    .then(() => logger.info('connected to MongoDB'))
    .catch((err) => logger.error('error connecting to mongodb:', err.message));
}

app.listen(config.PORT, () => logger.info(`App server listening on port ${config.PORT}!`));

export default app;
