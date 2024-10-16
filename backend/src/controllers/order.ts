import { Request, Response } from 'express';
import { faker } from '@faker-js/faker';

import orderSchema from '../models/order';
import Product from '../models/product';

const createOrder = async (req: Request, res: Response) => {
  const { total, items } = req.body;

  // Валидация входных данных
  const { error } = orderSchema.validate(req.body);
  if (error) {
    return res.status(400).send({ error: error.details[0].message });
  }

  try {
    // Подсчет количества каждого товара
    const itemCounts: { [key: string]: number } = {};
    items.forEach((itemId: string) => {
      itemCounts[itemId] = (itemCounts[itemId] || 0) + 1;
    });

    // Проверка существования товаров
    const products = await Product.find({ _id: { $in: items } });
    if (products.length !== Object.keys(itemCounts).length) {
      return res.status(400).send({ error: 'Один или несколько товаров не найдены' });
    }

    // Проверка, что все товары продаются
    for (let i = 0; i < products.length; i += 1) {
      if (products[i].price === null) {
        return res.status(400).send({ error: `Товар ${products[i].title} не для продажи` });
      }
    }

    // Подсчет общей суммы цен товаров
    const totalPrice = products.reduce((sum, product) => {
      const count = itemCounts[product._id.toString()];
      return sum + (product.price * count);
    }, 0);

    if (totalPrice !== total) {
      return res.status(400).send({ error: 'Ошибка в стоимости заказа' });
    }

    res.send({ id: faker.string.uuid(), total: totalPrice });
  } catch (err) {
    res.status(500).send({ error: 'Internal Server Error' });
  }
  return -1;
};

export default createOrder;
