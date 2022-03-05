const express = require('express');
import api from './api'
const Router = express.Router();
Router.use('/api', api);

export default Router