import {NextFunction, Request, Response} from "express";
import PersonModel from '../models/person.model'

export const getRandomJson = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        res.json({"someString": "hello world"});
    } catch (e) {
        next(e)
    }
}

export const createPerson = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const {name, organisation} = req.body;
    try {
        await new PersonModel({name, organisation}).save()
        res.status(200).end()
    } catch (e) {
        next(e)
    }
}