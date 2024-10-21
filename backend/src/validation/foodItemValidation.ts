// src/validations/foodItemValidation.ts
import { body } from 'express-validator';

export const foodItemValidationRules = () => {
  return [
    body('name').isString().notEmpty().withMessage('Name is required'),
    body('calories').isNumeric().withMessage('Calories must be a number'),
    body('macronutrients.carbohydrates')
      .isNumeric()
      .withMessage('Carbohydrates must be a number'),
    body('macronutrients.proteins')
      .isNumeric()
      .withMessage('Proteins must be a number'),
    body('macronutrients.fats')
      .isNumeric()
      .withMessage('Fats must be a number'),
  ];
};
