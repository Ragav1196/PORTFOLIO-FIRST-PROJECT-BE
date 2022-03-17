import { client } from "../../index.js";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import { transporter } from "../../Packages Initializing/SendEmail.js";

// TO GET USER FROM DATABASE BASED ON THE NAME:
function GetName(name) {
  return client
    .db("Portfolio-First-Project")
    .collection("users")
    .findOne({ name: name });
}

// TO GET USER FROM DATABASE BASED ON THE EMAIL:
function GetEmail(email) {
  return client
    .db("Portfolio-First-Project")
    .collection("users")
    .findOne({ email: email });
}

// TO GET USER FROM DATABASE BASED ON THE ID
function GetId(id) {
  return client
    .db("Portfolio-First-Project")
    .collection("users")
    .findOne({ _id: ObjectId(id) });
}

// TO HASH THE PASSWORD:
async function GenerateHash(password) {
  const NO_OF_ROUNDS = 10;
  const salt = await bcrypt.genSalt(NO_OF_ROUNDS);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

// TO GENERATE TOKEN
function GenerateToken(user) {
  const tokenId = user;
  const token = jwt.sign({ id: tokenId }, process.env.SECRET_KEY);
  return token;
}

// TO ADD NEW USER TO DB:
function AddUser(name, email, hashedPassword) {
  return client
    .db("Portfolio-First-Project")
    .collection("users")
    .insertOne({ name, email, password: hashedPassword });
}

// TO UPDATE THE USER WITH THE TEMPORARY TOKEN AND ITS EXPIRY TIME
function ResetPwdLink(token, expireTime, email) {
  return client
    .db("Portfolio-First-Project")
    .collection("users")
    .updateOne(
      { email: email },
      { $set: { token: token, expireTime: expireTime } }
    );
}

// TO SEND AN EMAIL WITH A LINK FOR PASSWORD RESET
function SendMail(email, subject, content) {
  transporter
    .sendMail({
      to: email,
      from: "ragavofficial01@outlook.com",
      subject: subject,
      html: content,
    })
    .then((data) => console.log(data))
    .catch((err) => console.log(err));
}

// TO FIND THE USER USING THE TEMPORARY TOKEN
function FindUserWithTempToken(token) {
  return client
    .db("Portfolio-First-Project")
    .collection("users")
    .findOne({
      token: token,
      expireTime: { $gt: new Date().toString() },
    });
}

// TO UPDATE THE NEW PASSWORD IN THE DATABASE
function UpdatePassword(hashedPassword, token) {
  return client
    .db("Portfolio-First-Project")
    .collection("users")
    .updateOne(
      {
        token: token,
      },
      {
        $set: {
          password: hashedPassword,
        },
        $unset: { token: 1, expireTime: 1 },
      }
    );
}

export {
  GetName,
  GetEmail,
  GetId,
  GenerateHash,
  GenerateToken,
  AddUser,
  ResetPwdLink,
  SendMail,
  FindUserWithTempToken,
  UpdatePassword,
};
