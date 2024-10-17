import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { errors } from 'celebrate';

import { DB_ADDRESS, PORT } from './utils/constants';
import productRouter from './routes/products';
import orderRouter from './routes/order';
import errorHandler from './middlewares/error-handler';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(DB_ADDRESS);

app.use(cors());
app.use('/product', productRouter);
app.use('/order', orderRouter);

app.use(errors());
app.use(errorHandler);

app.use(express.static(path.join(__dirname, '../public')));
app.listen(PORT, () => { console.log(`listening on port ${PORT}`, DB_ADDRESS); });
