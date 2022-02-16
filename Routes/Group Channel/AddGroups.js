import express from "express";
import { client } from "../../index.js";
import { ErrorRes } from "../../Utilities/Errors.js";
import {
  AddGroups,
  GetAllNames,
  GetGroupChannel,
  AddGroupIdToUser,
} from "../../Utilities/Functions/Groups.js";
import { GenerateToken, GetName } from "../../Utilities/FUNCTIONS/Users.js";

const router = express.Router();

router
  .route("/")
  .post(async (req, res) => {
    const dataProvided = req.body;

    // VERIFYING DATABASE IF THE NAMES PROVIDED IN THE FRIEND LIST IS A EXISTING USER OR NOT
    const members = await GetAllNames(dataProvided.friendsList);
    const membersArr = members.map((mem) => mem._id);

    const NO_Friends = dataProvided.friendsList.length;
    const NO_FriendsFrmDB = membersArr.length;

    if (NO_Friends != NO_FriendsFrmDB) {
      const message = "Provided list of friends name is not found";
      return ErrorRes(res, message, false);
    }

    // CHECKING IF THE GROUP IS ALREADY EXISTING WITH THE SAME NAME AND MEMBERS
    const isGroupChannelExist = await GetGroupChannel(
      dataProvided.groupName,
      membersArr,
      NO_FriendsFrmDB
    );

    if (isGroupChannelExist) {
      const message = "Group already exists with provided members";
      return ErrorRes(res, message, false);
    }

    // ADDING GROUP TO THE DATABASE
    const Groups = await AddGroups(membersArr, dataProvided.groupName);

    // ADDING GROUP ID TO EVERY MEMBERS OF THE GROUP
    const addGrpIdToUser = await AddGroupIdToUser(
      membersArr,
      Groups.insertedId
    );

    //   GETTING TOKEN TO UPDATE IN THE FRONT END
    const Getuser = await GetName(dataProvided.friendsList[0]);
    const token = GenerateToken(Getuser);

    console.log(token);

    res.send({
      message: "Group added successfully",
      Token: token,
      Access: true,
    });
  })
  .delete(async (req, res) => {
    client
      .db("Portfolio-First-Project")
      .collection("groups-channel")
      .deleteMany({});

    client
      .db("Portfolio-First-Project")
      .collection("users")
      .updateMany({}, { $unset: { groups: 1 } });

    return res.send("all groups deleted");
  });
export const AddGroupRouter = router;
