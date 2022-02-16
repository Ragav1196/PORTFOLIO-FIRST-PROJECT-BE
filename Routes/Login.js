import express from "express";
import { GetEmail, GenerateToken } from "../Utilities/FUNCTIONS/Users.js";
import bcrypt from "bcrypt";

const router = express.Router();

// LOGIN
router.route("/").post(async (req, res) => {
  const dataProvided = req.body;
  const DataFrmDB = await GetEmail(dataProvided.email);

  if (!DataFrmDB) {
    res.status(400).send({ message: "Invalid credentials", Access: false });
    return;
  }

  const storedPassword = DataFrmDB.password;
  const isPasswordMatch = await bcrypt.compare(
    dataProvided.password,
    storedPassword
  );

  if (isPasswordMatch) {
    const token = GenerateToken(DataFrmDB);

    res.send({
      message: "Successfull login",
      token: token,
      Access: true,
    });
  } else {
    res.status(401).send({ message: "Invalid credentials", Access: false });
  }
});

export const LoginRouter = router;
