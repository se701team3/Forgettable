import express from 'express';
import { connect } from 'mongoose';
import cors from 'cors';
import routes from './routes';
import config from './utils/config';
import logger from './utils/logger';
import middleware from './utils/middleware';

connect(config.MONGODB_URI)
  .then(() => logger.info('connected to MongoDB'))
  .catch((err) => logger.error('error connecting to mongodb:', err.message));

const app = express();
const port = 5000;

app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());
app.use('/api', routes);
app.use(middleware.errorHandler);

app.listen(port, () => logger.info(`App server listening on port ${port}!`));
