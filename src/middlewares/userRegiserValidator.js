const { Validator } = require("node-input-validator");

function userValidator(req, res, next) {
  const v = new Validator(req.body, {
    email: "required|email",
    password: "required",
    firstName: "required",
    lastName: "required",
    address: "required",
    city: "required",
    state: "required",
    postalCode: "required",
  });

  v.check().then((matched) => {
    if (!matched) {
      res.status(422).send(v.errors);
    } else {
      next()
    }
  });
}
module.exports = userValidator