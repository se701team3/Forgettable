import express from 'express';
import cors from 'cors';
import routes from './routes';
import middleware from './utils/middleware';

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());
app.use(middleware.authHandler);
app.use(middleware.paginationHandler);
app.use('/api', routes);
app.use(middleware.errorHandler);

export default app;
