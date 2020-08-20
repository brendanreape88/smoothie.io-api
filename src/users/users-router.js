const express = require("express");
const usersRouter = express.Router();
const UsersService = require("./users-service");

usersRouter.route("/users").get((req, res, next) => {
  UsersService.getUsers(req.app.get("db"))
    .then((users) => {
      res.json(users);
    })
    .catch(next);
});

module.exports = usersRouter;
