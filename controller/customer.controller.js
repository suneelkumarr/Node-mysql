require('dotenv').config();
const Customer = require("../model/customer.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
exports.create = async (req, res) => {
  try {
    //validate request
    if (!req.body) {
      res.status(400).send({ message: "Cannot be empty" });
    }

    // create a customer
    const customer = new Customer({
      email: req.body.email,
      name: req.body.name,
      active: req.body.active,
      password: req.body.password,
    });

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    customer.password = hashedPassword;

    Customer.create(customer, (err, data) => {
      if (err) {
        res
          .status(400)
          .send({
            message: err.message || "some error occured in save the details",
          });
      } else {
        res.send(data);
      }
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ success: false, error: error });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return  res.status(401).json({ err: "email not match" });
    }
    const user = Customer.findByEmail(req.body.email, async (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          return res.status(404).send({
            message: `Not found Customer with email ${req.body.email}.`,
          });
        } else {
          return res.status(500).send({
            message: "Error retrieving Customer with email " + req.body.email,
          });
        }
      } else {
        const auth = await Customer.matchPassword(password, data.password);
        console.log(password);
        console.log(data.password);
        if (!auth) {
           return res.status(401).json({ err: "password not match" });
        }
      const payload = {
        userId: data.id,
      };
      const token = jwt.sign({ payload }, process.env.SECRET_KEY, {
        expiresIn: "2h",
      });
      console.log(token);
      // save user token
      // user.token = token;
      // await user.save();


      Customer.update(data.id, {token}, (err, data) => {
        if (err) {
          res
            .status(400)
            .send({
              message: err.message || "some error occured in save the details",
            });
        } else {
          res.send(data);
        }
      });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: error });
  }
};

// Retrieve all Customers from the database.
exports.getAll = (req, res) => {
  Customer.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving customers.",
      });
    else res.send(data);
  });
};

// Find a single Customer with a customerId
exports.findOne = (req, res) => {
  Customer.findById(req.params.customerId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Customer with id ${req.params.customerId}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Customer with id " + req.params.customerId,
        });
      }
    } else res.send(data);
  });
};

// Update a Customer identified by the customerId in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  console.log(req.body);

  Customer.updateById(
    req.params.customerId,
    new Customer(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Customer with id ${req.params.customerId}.`,
          });
        } else {
          res.status(500).send({
            message: "Error updating Customer with id " + req.params.customerId,
          });
        }
      } else res.send(data);
    }
  );
};

// Delete a Customer with the specified customerId in the request
exports.delete = (req, res) => {
  Customer.remove(req.params.customerId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Customer with id ${req.params.customerId}.`,
        });
      } else {
        res.status(500).send({
          message: "Could not delete Customer with id " + req.params.customerId,
        });
      }
    } else res.send({ message: `Customer was deleted successfully!` });
  });
};

// Delete all Customers from the database.
exports.deleteAll = (req, res) => {
  Customer.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all customers.",
      });
    else res.send({ message: `All Customers were deleted successfully!` });
  });
};
