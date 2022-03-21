import { Response } from 'express';

export interface PaginateableResponse extends Response {
    paginate: Function;
}
