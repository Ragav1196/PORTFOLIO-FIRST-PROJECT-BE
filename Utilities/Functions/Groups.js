import { client } from "../../index.js";
import { ObjectId } from "mongodb";

// TO ADD NEW GROUP
function AddGroups(membersList, groupName) {
  return client
    .db("Portfolio-First-Project")
    .collection("groups-channel")
    .insertOne({ name: groupName, members: membersList });
}

// TO GET AND VERIFY ALL NAMES PROVIDED FOR CREATING GROUP
function GetAllNames(frndsList) {
  return client
    .db("Portfolio-First-Project")
    .collection("users")
    .find({
      name: { $in: frndsList },
    })
    .project({ _id: 1 })
    .toArray();
}

// TO GET THE GROUP CHANNEL
function GetGroupChannel(name, members, arrLength) {
  return client
    .db("Portfolio-First-Project")
    .collection("groups-channel")
    .findOne({ name: name, members: { $size: arrLength, $all: members } });
}

// TO ADD GROUP ID TO EACH MEMBER OF THE GROUP
function AddGroupIdToUser(id, groupId) {
  return client
    .db("Portfolio-First-Project")
    .collection("users")
    .updateMany({ _id: { $in: id } }, { $push: { groups: groupId } });
}

// TO ADD GROUP EXPENSES
function addGrpExpense(data, groupId, membersFrmDB) {
  return client
    .db("Portfolio-First-Project")
    .collection("groups-channel")
    .updateOne(
      { _id: ObjectId(groupId) },
      {
        $push: {
          expenses: {
            _id: ObjectId(),
            category: data.category,
            amount: data.amount,
            paidBy: membersFrmDB[0]._id,
            membersInvloved: membersFrmDB,
          },
        },
      }
    );
}

// TO GROUP NAMES BY ID
function GetGroupName(GroupId) {
  return client
    .db("Portfolio-First-Project")
    .collection("groups-channel")
    .find({ _id: { $in: GroupId } })
    .project({ name: 1 })
    .toArray();
}

export {
  AddGroups,
  GetAllNames,
  GetGroupChannel,
  AddGroupIdToUser,
  addGrpExpense,
  GetGroupName,
};
