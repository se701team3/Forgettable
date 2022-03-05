import express from 'express';
import routes from './routes';
import mongoose from 'mongoose';
import config from "./utils/config";
import cors from 'cors'

mongoose.connect(config.MONGODB_URI)
    .then(()=>{
        console.log("connected to MongoDB")
    })
    .catch((err)=>{
        console.error("error connected to mongodb:", err.message)
    })

const app = express();
const port = 3000;

app.use(express.urlencoded({extended: false}))
app.use(cors())
app.use(express.json());
app.use('/', routes)

app.listen(port, ()=>console.log(`App server listening on port ${port}!`))