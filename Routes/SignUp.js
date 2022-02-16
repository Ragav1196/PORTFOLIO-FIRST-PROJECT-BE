import express from "express";
import {
  GetName,
  GetEmail,
  GenerateHash,
  AddUser,
} from "../Utilities/FUNCTIONS/Users.js";

const router = express.Router();

// SIGN UP
router.route("/").post(async (req, res) => {
  const dataProvided = req.body;

  const nameFrmDB = await GetName(dataProvided.name);
  const emailFrmDB = await GetEmail(dataProvided.email);

  if (nameFrmDB && emailFrmDB) {
    res.status(400).send({ message: "Name and E-mail already exists" });
    return;
  }

  if (nameFrmDB) {
    res.status(400).send({ message: "Name already exists" });
    return;
  }

  if (emailFrmDB) {
    res.status(400).send({ message: "Email already exists" });
    return;
  }

  if (dataProvided.password.length < 8) {
    res.status(400).send({ message: "Password must be longer" });
    return;
  }

  if (
    !/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@!#%&]).{8,}$/g.test(
      dataProvided.password
    )
  ) {
    res.status(400).send({ message: "Password patter doesn't match" });
    return;
  }

  if (
    !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      dataProvided.email
    )
  ) {
    res.send(400).send({ message: "Email patter doesn't match" });
    return;
  }

  const hashedPassword = await GenerateHash(dataProvided.password);

  const result = await AddUser(
    dataProvided.name,
    dataProvided.email,
    hashedPassword
  );

  res.send(result);
});

export const SignUpRouter = router;
