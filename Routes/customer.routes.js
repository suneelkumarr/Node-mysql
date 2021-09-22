const express = require('express');
const router = express.Router()

const customer = require('../controller/customer.controller')

router.get('/customers', customer.getAll);
router.get("/customers/:customerId", customer.findOne);
router.post("/customers", customer.create);
router.post("/login", customer.login);
router.put("/customers/:customerId", customer.update);
router.delete("/customers/:customerId", customer.delete);
router.delete("/customers", customer.deleteAll);


module.exports =router;