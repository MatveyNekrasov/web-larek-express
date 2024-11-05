import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { errors } from 'celebrate';

import NotFoundError from './errors/not-found-error';
import { DB_ADDRESS, PORT } from './utils/constants';
import productRouter from './routes/products';
import orderRouter from './routes/order';
import errorHandler from './middlewares/error-handler';
import { errorLogger, requestLogger } from './middlewares/logger';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(DB_ADDRESS);

app.use(cors());

app.use(requestLogger);

app.use(express.static(path.join(__dirname, './public')));

app.use('/product', productRouter);
app.use('/order', orderRouter);
app.use('*', (_req: Request, _res: Response, next: NextFunction) => next(new NotFoundError('Запрашиваемый ресурс не найден')));

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => { console.log(`listening on port ${PORT}`, DB_ADDRESS); });
