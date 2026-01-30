import { validationResult } from 'express-validator';
import { NextFunction, Request, Response, } from 'express';
import { HttpStatus } from '../constants/statuses';


export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorsArray = errors.array();

    const errorsMessages = errorsArray.map((error) => {
      // Сужаем тип через проверку поля 'type'
      if (error.type === 'field') {
        return {
          message: error.msg,
          field: error.path // Теперь path доступен без any
        };
      }

      // Для всех остальных типов ошибок (редкие случаи)
      return {
        message: error.msg,
        field: 'unknown'
      };
    });

    res.status(HttpStatus.BadRequest_400).json({ errorsMessages });
    return;
  }

  next();
};
