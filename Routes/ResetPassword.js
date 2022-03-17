import express from "express";
import {
  FindUserWithTempToken,
  UpdatePassword,
} from "../Utilities/Functions/Users.js";
import bcrypt from "bcrypt";

const router = express.Router();

router.route("/").post(async (req, res) => {
  const dataProvided = req.body;

  const newPassword = dataProvided.password;
  const confirmPassword = dataProvided.confirmPassword;
  const token = dataProvided.token;

  // VERIFYING IF THE BOTH PASSWORD SAME OR NOT
  if (newPassword !== confirmPassword) {
    res.status(422).send({ message: "Passwords do not match", Access: false });
  }

  // VERIFYING IF THE TOKEN PROVIDED IS EXPIRED OR NOT
  const user = await FindUserWithTempToken(token);
  if (!user) {
    return res
      .status(422)
      .send({ message: "Try again session expired", Access: false });
  }

  // HASHING THE NEW PASSWORD
  bcrypt
    .hash(newPassword, 10)
    .then(async (hashedPassword) => {
      await UpdatePassword(hashedPassword, token);
      res
        .status(200)
        .send({ message: "Password successfully updated", Access: true });
    })
    .catch((err) => {
      console.log(err);
    });
});

export const ResetPasswordRouter = router;
