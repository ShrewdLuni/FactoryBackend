import express from "express";
import { InsertUserSchema, UserFromDatabase, UsersFromDatabase, type DatabaseUser, type User } from "schemas/users";
import { getUsers, updateUserById } from "services/users";

export const getUsersController = async (req: express.Request, res: express.Response ) => {
  try {
    const databaseUsers: DatabaseUser[] = await getUsers();
    const users: User[] = UsersFromDatabase.parse(databaseUsers)
    return res.status(200).json(users);
  } catch (error) {
    console.log(error)
    return res.sendStatus(500);
  }
}

export const updateUserController = async (req: express.Request, res: express.Response) => {
  try {
    if (req.params.id == undefined) {
      return res.status(400).json({message: "Invalid data was provided"})
    }
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({message: "Invalid data was provided"})
    }
    const data = InsertUserSchema.parse(req.body); 
    const result = await updateUserById(id, data)
    const user = UserFromDatabase.parse(result); 
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500);
  }
}
