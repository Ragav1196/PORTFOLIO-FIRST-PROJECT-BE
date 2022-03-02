import express from "express";
import { ErrorRes } from "../../Utilities/Errors.js";
import {
  GetGroupChannelById,
  GetMembersName,
} from "../../Utilities/Functions/Groups.js";

const router = express.Router();

router.route("/:id").get(async (req, res) => {
  const { id } = req.params; //GETTING GROUP ID

  // CHECKING IF THE GROUP EXISTS BY THAT ID
  const isGroupChannelExist = await GetGroupChannelById(id);

  const membersIdArr = isGroupChannelExist.members; // SEPERATING THE MEMBERS ID ARRAY 
  const membersDetails = await GetMembersName(membersIdArr); // GETTING MEMBERS NAMES

  const membersName = membersDetails.map((data) => data.name);//KEEPING ONLY THE NAME OF THE MEMBERS

  // THROWING AN ERROR IF THE GROUP DOESNT EXIST WITH THAT ID
  if (!isGroupChannelExist) {
    const message = "Group doesn't exists by that ID";
    return ErrorRes(res, message, false);
  }

  res.status(200).send({ isGroupChannelExist, members: membersName });
});

export const GetGroupExpensesRouter = router;
