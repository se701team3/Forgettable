import Person from '../../models/person'
import {Request, Response} from 'express'

const express = require("express");
const router = express.Router();

router.get('/', async (req: Request, res: Response)=>{
    res.json({"someString": "hello world"});
})


router.post('/', async (req: Request, res: Response)=>{
    const body = req.body;
    try {
        const newPerson = new Person({
            name: body.name,
            organisation: body.organisation,
        });

        await newPerson.save()
    } catch (e){
        console.error(e)
        await res.status(400).json({
            error: e.toString()
        })
    }
    res.status(200).end()
})

export default router