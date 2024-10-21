import { Joi, Segments } from 'celebrate';

const orderValidator = {
  [Segments.BODY]: Joi.object().keys({
    items: Joi.array().items(Joi.string().required()).min(1).required(),
    total: Joi.number().required(),
    payment: Joi.string().valid('card', 'online').required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    address: Joi.string().required(),
  }),
};

export default orderValidator;
