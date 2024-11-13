const Joi = require('joi');

module.exports = Joi.object({
    comment  :Joi.string().required(),
    rating : Joi.number().required().min(1).max(5),
    created_at : Joi.string().allow("" , null)
}).required()