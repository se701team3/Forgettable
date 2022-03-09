import { Request, Response, ParamsDictionary, Paths } from 'express';

export type POST = (
    req: Request<ParamsDictionary, {}, Paths.Hangouts.Post.RequestBody>,
    res: Response<
        | Paths.Hangouts.Post.Responses.$201
        | Paths.Hangouts.Post.Responses.$400
        | Paths.Hangouts.Post.Responses.$404
    >
) => void