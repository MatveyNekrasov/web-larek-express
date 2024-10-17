import { NextFunction, Request, Response } from 'express';
import ConflictError from '../errors/conflict-error';
import Product from '../models/product';
import InternalServerError from '../errors/internal-server-error';

export const getProducts = (_req: Request, res: Response) => Product.find({})
  .then((products) => res.send({ items: products, total: products.length }));

export const createProduct = (req: Request, res: Response, next: NextFunction) => {
  const {
    title, image, category, description, price,
  } = req.body;
  return Product.create({
    title, image, category, description, price,
  })
    .then((product) => res.status(200).send({
      title: product.title,
      image: product.image,
      category: product.category,
      description: product.description,
      price: product.price,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError('Товар с таким заголовком уже существует'));
      }

      return next(new InternalServerError('Internal Server Error'));
    });
};
