import express from "express";
import { authenticationService } from "services/authentication";
import {
  createUser,
  getUserByCode,
  getUserByUsername,
  getUserWithAuthByUsername,
  getUserWithAuthByCode,
  getUserById,
} from "services/users";
import { random, authentication } from "utils/authentication";
import { DatabaseUserWithAuth, LoginSchema, RegisterSchema, UserFromDatabase, type DatabaseUser} from "schemas/users";
import type { InsertAuthentication } from "schemas/authentication";
import jwt from "jsonwebtoken";
import { asyncHandler, HttpError } from "utils/errorHandler";

export const register = asyncHandler(async (req: express.Request, res: express.Response) => {
  const { user, password } = RegisterSchema.parse(req.body);
  if (!user.code && !user.username) throw new HttpError(401, "You must provide code or username")

  const existingUser  = user.code ? await getUserByCode(user.code) : await getUserByUsername(user.username!);
  if (existingUser) throw new HttpError(409, "User already exists");

  const addedUser = await createUser(user);

  const salt = random();
  const hash = authentication(salt, password);

  const authObject: InsertAuthentication = {userId: addedUser.id, salt, hash};

  await authenticationService.create(authObject);

  const result = UserFromDatabase.parse(addedUser)
  res.status(200).json(result).end();
});

export const login = asyncHandler(async (req: express.Request, res: express.Response) => {
  const { user, password } = LoginSchema.parse(req.body);
  if (!user.code && !user.username) throw new HttpError(401, "You must provide code or username")

  const existingUser: DatabaseUserWithAuth = user.code ? await getUserWithAuthByCode(user.code) : await getUserWithAuthByUsername(user.username!);
  if (!existingUser) throw new HttpError(401, "User is not found")

  const expectedHash = authentication(existingUser.salt, password);
  if (expectedHash != existingUser.hash) throw new HttpError(401, "Invalid credentials")

  const token = jwt.sign({ userId: existingUser.id }, process.env.JWT_SECRET!,{ expiresIn: "1h" },);

  res.cookie("token", token, { httpOnly: true, maxAge: 60 * 60 * 1000 });
  res.status(200).json("Success!").end();
});

export const logout = asyncHandler(async (req: express.Request, res: express.Response) => {
  res.clearCookie("token", { httpOnly: true });
  res.status(200).json({message: "Logged out successfully"}).end();
});

export const whoami = asyncHandler(async (req: express.Request, res: express.Response) => {
  if (!req.userId) throw new HttpError(401, `Invalid data, you must provide userId`);
  const databaseResult = await getUserById(req.userId);
  if (!databaseResult) throw new HttpError(404, `User with ID ${req.userId} not found`);
  const result = UserFromDatabase.parse(databaseResult);
  res.status(200).json(result);
});
