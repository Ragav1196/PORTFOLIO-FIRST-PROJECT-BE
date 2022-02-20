import express from "express";
import { ErrorRes } from "../../Utilities/Errors.js";
import {
  GetFriendsChannel,
  AddFriendsExpense,
} from "../../Utilities/Functions/Friends.js";
import { GetName } from "../../Utilities/Functions/Users.js";

const router = express.Router();

router.route("/").post(async (req, res) => {
  const dataProvided = req.body;

  // TO GET USER DETAILS FROM THE DATABASE
  const user = await GetName(dataProvided.username.name);
  const friendFrmDB = await GetName(dataProvided.friendName.name);

  // TO THROW AN ERROR IF USER IS NOT PRESENT IN DATABASE
  if (!user) {
    const message = "Provided user name is not found";
    return ErrorRes(res, message, false);
  }

  // TO THROW AN ERROR IF FRIEND IS NOT PRESENT IN DATABASE
  if (!friendFrmDB) {
    const message = "Provided friend name is not found";
    return ErrorRes(res, message, false);
  }

  // TO CHECK IF THE A FRIEND CHANNEL EXIST BETWEEN THE PROVIDED USERNAMES
  const isFriendChannelExist = await GetFriendsChannel(
    user._id,
    friendFrmDB._id
  );

  // TO THROW AN ERROR IF A CHANNEL DOESN'T EXIST BETWEEN THEM
  if (!isFriendChannelExist) {
    const message = "Channel doesn't exists between these two friends";
    return ErrorRes(res, message, false);
  }

  // TO FIND WHO HAS TO RETURN THE AMOUNT
  let persnToRtnAmtId;
  if (dataProvided.persnToRtnAmt.name === user.name) {
    persnToRtnAmtId = user._id;
  } else {
    persnToRtnAmtId = friendFrmDB._id;
  }

  // TO ADD ALL THE EXPENSE DATA TO THE DATABASE
  const addExpense = await AddFriendsExpense(
    dataProvided.expenses,
    isFriendChannelExist._id,
    user._id,
    dataProvided.username,
    friendFrmDB._id,
    dataProvided.friendName,
    dataProvided.persnToRtnAmt,
    persnToRtnAmtId
  );

  // SENDING A SUCCESS RESPOND
  res.status(200).send({ addExpense });
});

export const FriendsExpensesRouter = router;
