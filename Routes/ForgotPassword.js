import express from "express";
import crypto from "crypto";
import {
  GetEmail,
  ResetPwdLink,
  SendMail,
} from "../Utilities/Functions/Users.js";

const router = express.Router();

router.route("/").post((req, res) => {
  // TO CREATE A TOKEN USING THE INBUILT CRYPTO PACKAGE
  crypto.randomBytes(32, async (err, buffer) => {
    const token = buffer.toString("hex");

    const dataProvided = req.body;
    const emailFrmDB = await GetEmail(dataProvided.email);

    // TO THROUGH AN ERROR IF THE EMAIL IS NOT REGISTERED
    if (!emailFrmDB) {
      return res
        .status(422)
        .send({ message: "User doesn't exist with that E-mail" });
    }

    const email = emailFrmDB.email;

    // TO SET AN EXPIRE TIME FOR THE TOKEN
    const tokenExpire = new Date();
    tokenExpire.setMinutes(tokenExpire.getMinutes() + 10);

    // TO UPDATE THE USER WITH THE TEMPORARY TOKEN AND ITS EXPIRY TIME
    const result = await ResetPwdLink(token, tokenExpire.toString(), email);

    // TO SEND AN EMAIL WITH A LINK FOR PASSWORD RESET
    const subject = "Reset Password";
    const content = ` <h1>You requested for a password change</h1>
    <h3>Click on this <a href="http://localhost:3000/new-password/${token}">link</a> to reset your password</h3>
    `;

    SendMail(emailFrmDB.email, subject, content);
    res.send({ reponse: result, tokenExpire: tokenExpire.toString() });
  });
});

export const ForgotPasswordRouter = router;
