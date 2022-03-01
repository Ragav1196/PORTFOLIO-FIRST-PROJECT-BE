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

// TO GET THE GROUP CHANNEL BY NAME
function GetGroupChannelByName(name, members, arrLength) {
  return client
    .db("Portfolio-First-Project")
    .collection("groups-channel")
    .findOne({ name: name, members: { $size: arrLength, $all: members } });
}

// TO GET THE GROUP CHANNEL BY ID
function GetGroupChannelById(id, membersIdArr) {
  return client
    .db("Portfolio-First-Project")
    .collection("groups-channel")
    .findOne({
      _id: ObjectId(id),
      members: { $all: membersIdArr },
    });
}

// TO ADD GROUP ID TO EACH MEMBER OF THE GROUP
function AddGroupIdToUser(id, groupId) {
  return client
    .db("Portfolio-First-Project")
    .collection("users")
    .updateMany({ _id: { $in: id } }, { $push: { groups: groupId } });
}

// TO ADD GROUP EXPENSES
function addGrpExpense(data, groupId) {
  return client
    .db("Portfolio-First-Project")
    .collection("groups-channel")
    .updateOne(
      { _id: ObjectId(groupId) },
      {
        $push: {
          expenses: {
            _id: ObjectId(),
            description: data.expenses.description,
            totalAmount: data.expenses.totalAmount,
            amount: [data.username, ...data.friendsName],
            persnToRtnAmt: data.persnToRtnAmt,
          },
        },
      }
    );
}

// TO GET GROUP NAMES BY ID
function GetGroupName(GroupId) {
  return client
    .db("Portfolio-First-Project")
    .collection("groups-channel")
    .find({ _id: { $in: GroupId } })
    .toArray();
}

export {
  AddGroups,
  GetAllNames,
  GetGroupChannelByName,
  GetGroupChannelById,
  AddGroupIdToUser,
  addGrpExpense,
  GetGroupName,
};
