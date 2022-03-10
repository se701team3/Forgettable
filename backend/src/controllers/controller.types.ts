import {
  Request, Response, NextFunction, ParamsDictionary, Paths,
} from 'express';

export type POST = (
    req: Request<ParamsDictionary, {}, Paths.Hangouts.Post.RequestBody>, //eslint-disable-line
    res: Response< //eslint-disable-line
        | Paths.Hangouts.Post.Responses.$201
        | Paths.Hangouts.Post.Responses.$400
        | Paths.Hangouts.Post.Responses.$404
    >,
    next: NextFunction //eslint-disable-line
) => Promise<void>
