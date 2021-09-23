const express = require('express');
const router = express.Router()
const {decode} = require('../middleware/jwt')

const customer = require('../controller/customer.controller')

router.get('/customers', decode,customer.getAll);
router.get("/customers/:customerId", decode, customer.findOne);
router.post("/customers", customer.create);
router.post("/login", customer.login);
router.put("/customers/:customerId",decode, customer.update);
router.delete("/customers/:customerId",decode, customer.delete);
router.delete("/customers",decode, customer.deleteAll);


module.exports =router;