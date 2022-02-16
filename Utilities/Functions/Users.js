import { client } from "../../index.js";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";

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

export { GetName, GetEmail, GetId, GenerateHash, GenerateToken, AddUser };
