import { Request, Response } from 'express';
import Product from '../models/product';

export const getProducts = (_req: Request, res: Response) => Product.find({})
  .then((products) => res.send({ items: products, total: products.length }));

export const createProduct = (req: Request, res: Response) => {
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
        res.status(409).send({ message: 'Товар с таким заголовком уже существует' });
      }

      if (err.name === 'ValidationError') {
        res.status(400).send({
          error: 'Bad Request',
          message: 'Validation failed',
          statusCode: 400,
          validation: {
            body: {
              keys: Object.keys(err.errors),
              message: err.message,
              source: 'body',
            },
          },
        });
      }

      res.send(err);
    });
};
