const express = require("express");
const router = express.Router();
const FormDataModel = require("../models/FormData");

router.post("/register", (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);

  FormDataModel.findOne({ email: email }).then((user) => {
    if (user) {
      res.json("Already registered");
    } else {
      FormDataModel.create(req.body)
        .then((log_reg_form) => res.json(log_reg_form))
        .catch((err) => res.json(err));
    }
  });
});

module.exports = router;
