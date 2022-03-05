const express = require('express')
const router = express.Router();

import personRouter from './person'

router.use('/person', personRouter)

export default router;