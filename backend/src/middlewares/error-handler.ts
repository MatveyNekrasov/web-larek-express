import { NextFunction, Request, Response } from 'express';

interface ICustomError extends Error {
  statusCode?: number;
}

const errorHandler = (err: ICustomError, _req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'Internal Server Error' : err.message;
  res.status(statusCode).send({ message });
  next();
};

export default errorHandler;
