import express from "express";
import {
  GetName,
  GetEmail,
  GenerateHash,
  AddUser,
} from "../Utilities/Functions/Users.js";

const router = express.Router();

// SIGN UP
router.route("/").post(async (req, res) => {
  const dataProvided = req.body;

  // GETIING THE DATA FROM DB WITH THE USER PROVIDED DETAILS
  const nameFrmDB = await GetName(dataProvided.name);
  const emailFrmDB = await GetEmail(dataProvided.email);

  /* 
  TO THROW AN ERROR IF NAME AND EMAIL IS ALREADY PRESENT IN THE DATABASE AND IF EMAIL PATTERN AND
    PASSWORD PATTERN DOESN'T MATCH THE REQUIREMENT
 */
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

  // HASHING THE PASSWORD IF ALL THE CHECKS ARE PASSED
  const hashedPassword = await GenerateHash(dataProvided.password);

  // STORING THE NEW USER IN DATABSE
  const result = await AddUser(
    dataProvided.name,
    dataProvided.email,
    hashedPassword
  );

  // SENDING AN SUCCESS REPONSE TO THE FRONT END
  res.send(result);
});

export const SignUpRouter = router;
