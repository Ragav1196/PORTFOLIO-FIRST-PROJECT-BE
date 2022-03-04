import express from "express";
import { GetEmail, GenerateToken } from "../Utilities/FUNCTIONS/Users.js";
import bcrypt from "bcrypt";

const router = express.Router();

// LOGIN
router.route("/login").post(async (req, res) => {
  const dataProvided = req.body;

  // GETTING USER DATA FROM DATABASE
  const DataFrmDB = await GetEmail(dataProvided.email);

  // TO THROW AN ERROR IF USER IS NOT PRESENT IN THE DATABASE
  if (!DataFrmDB) {
    res.status(400).send({ message: "Invalid credentials", Access: false });
    return;
  }

  // VERIFYING IF BOTH PASSWORD FROM DATABASE AND ONE GIVEN BY USER IS SAME OR NOT
  const storedPassword = DataFrmDB.password;
  const isPasswordMatch = await bcrypt.compare(
    dataProvided.password,
    storedPassword
  );

  // TO SEND SUCCESS REPOSNSE TO THE FRONT END IF PASSWORD MATCHES
  if (isPasswordMatch) {
    // GENERATING TOKEN
    const token = GenerateToken(DataFrmDB);

    res.send({
      message: "Successfull login",
      token: token,
      Access: true,
    });
  }
  // TO SEND ERROR MESSAGE IF THE PASSWORS IS NOT A MATCH
  else {
    res.status(401).send({ message: "Invalid credentials", Access: false });
  }
});

export const LoginRouter = router;
