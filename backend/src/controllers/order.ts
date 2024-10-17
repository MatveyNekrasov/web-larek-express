import { NextFunction, Request, Response } from 'express';
import { faker } from '@faker-js/faker';

import InternalServerError from '../errors/internal-server-error';
import Product from '../models/product';
import BadRequestError from '../errors/bad-request-error';

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  const { total, items } = req.body;

  try {
    // Подсчет количества каждого товара
    const itemCounts: { [key: string]: number } = {};
    items.forEach((itemId: string) => {
      itemCounts[itemId] = (itemCounts[itemId] || 0) + 1;
    });

    // Проверка существования товаров
    const products = await Product.find({ _id: { $in: items } });
    if (products.length !== Object.keys(itemCounts).length) {
      return next(new BadRequestError('Один или несколько товаров не найдены'));
    }

    // Проверка, что все товары продаются
    for (let i = 0; i < products.length; i += 1) {
      if (products[i].price === null) {
        return next(new BadRequestError(`Товар ${products[i].title} не для продажи`));
      }
    }

    // Подсчет общей суммы цен товаров
    const totalPrice = products.reduce((sum, product) => {
      const count = itemCounts[product._id.toString()];
      return sum + (product.price * count);
    }, 0);

    if (totalPrice !== total) {
      return next(new BadRequestError('Ошибка в стоимости заказа'));
    }

    res.send({ id: faker.string.uuid(), total: totalPrice });
  } catch (err) {
    return next(new InternalServerError('Internal Server Error'));
  }

  return -1;
};

export default createOrder;
