import { NextFunction, Request, Response } from "express";

const asyncHandlers = (handler: any) => {
  return (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(handler(req, res, next)).catch((err) => next(err));
};

export { asyncHandlers };
