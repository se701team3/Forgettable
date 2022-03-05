import logger from "./logger";
import {NextFunction, Request, Response} from "express";

const errorHandler = (
    error: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    logger.error(error.message)
    if (error.name === "ValidationError") {
        return res.status(400).json({error: error.message})
    }
    next(error);
}

export default {
    errorHandler
}