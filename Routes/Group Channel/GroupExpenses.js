import express from "express";
import { ErrorRes } from "../../Utilities/Errors.js";
import {
  GetAllNames,
  addGrpExpense,
  GetGroupChannelById,
} from "../../Utilities/Functions/Groups.js";

const router = express.Router();

router.route("/:group_id").post(async (req, res) => {
  const { group_id } = req.params;
  const dataProvided = req.body;

  const membersName = dataProvided.friendsName.map((data) => data.name); //SEPERATING MEMBERS NAME ALONE
  const allMembers = [dataProvided.username.name, ...membersName]; //ADDING BOTH USERNAME AND FRIENDS NAME

  const membersIdFrmDB = await GetAllNames(allMembers); //GETTING MEMBERS ID FROM THE DB

  const NO_Friends = allMembers.length;
  const NO_FriendsFrmDB = membersIdFrmDB.length;

  // CHECKING IF THE MEMBERS ARE EXISTING IN THE DB OR NOT
  if (NO_Friends != NO_FriendsFrmDB) {
    const message = "Provided list of friends name is not found";
    return ErrorRes(res, message, false, false);
  }

  const membersIdArr = membersIdFrmDB.map((data) => data._id); //CREATING AN ARRAY OF MEMBERS ID
  const isGroupChannelExist = await GetGroupChannelById(group_id);

  // THROWING AN ERROR IF THE GROUP CHANNEL DOESN'T EXIST IN THE DB
  if (!isGroupChannelExist) {
    const message = "Group doesn't exists by that ID";
    return ErrorRes(res, message, false);
  }

  // COMBINING FRIENDS AND USERS EXPENSE DETAILS
  const membersExpenseDetails = [
    dataProvided.username,
    ...dataProvided.friendsName,
  ];

  // ADDING APPROPRIATE OBJECT ID TO THE MEMBERS
  membersExpenseDetails.map((data, i) => {
    data["_id"] = membersIdFrmDB[i]._id;
  });

  // TO ADD OBJECT ID TO THE MEMBERS IN THE "personToRtnAmt"
  let k = 0;
  allMembers.map((data, index) => {
    for (let i = k; i < dataProvided.persnToRtnAmt.length; i++) {
      if (data === dataProvided.persnToRtnAmt[i].name) {
        dataProvided.persnToRtnAmt[i]._id = membersIdArr[index];
        k = index;
        return;
      }
    }
  });

  await addGrpExpense(dataProvided, isGroupChannelExist._id);

  res.status(200).send({ message: "Expense added succesfully", Access: true });
});

export const GroupExpensesRouter = router;
