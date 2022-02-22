import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import { LoginRouter } from "./routes/Login.js";
import { SignUpRouter } from "./routes/SignUp.js";
import { AddFriendRouter } from "./Routes/Friends Channel/AddFriend.js";
import { FriendsExpensesRouter } from "./Routes/Friends Channel/FriendsExpenses.js";
import { AddGroupRouter } from "./Routes/Group Channel/AddGroups.js";
import { GroupExpensesRouter } from "./Routes/Group Channel/GroupExpenses.js";
import { GetFriendsRouter } from "./Routes/Friends Channel/GetFriends.js";
import { GetGroupsRouter } from "./Routes/Group Channel/GetGroups.js";
import { GetFriendsExpensesRouter } from "./Routes/Friends Channel/GetFriendsExpenses.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 9000;
const MONGO_URL = process.env.MONGO_URL;

app.use(cors());
app.use(express.json());

// SIGN UP
app.use("/sign-up", SignUpRouter);

// LOGIN
app.use("/login", LoginRouter);

// ADD FRIEND
app.use("/add-friends", AddFriendRouter);

// GET FRIENDS
app.use("/get-friends", GetFriendsRouter);

// ADD EXPENSE BETWEEN FRIENDS
app.use("/add-friends-expenses/", FriendsExpensesRouter);

// GET FRIENDS EXPENSES
app.use("/get-friends-expenses", GetFriendsExpensesRouter);

// ADD GROUPS
app.use("/add-groups", AddGroupRouter);

// ADD GROUPS EXPENSE
app.use("/add-groups-expenses", GroupExpensesRouter);

// GET GROUPS
app.use("/get-groups", GetGroupsRouter);

// CREATING MONGO CONNECTION
async function CreateConnection() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  console.log("Mongo DB Connected");
  return client;
}

export const client = await CreateConnection();

app.get("/", (req, res) => {
  res
    .status(200)
    .send(`<h1 style="text-align: center" >WELCOME TO SPLITWISE</h1>`);
});

app.listen(PORT, () => {
  console.log("Server Started in", PORT);
});
