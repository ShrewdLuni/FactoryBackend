import express from "express";
import { UsersFromDatabase, type DatabaseUser, type User } from "schemas/users";
import { getUsers } from "services/users";

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
