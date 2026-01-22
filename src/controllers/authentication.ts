import express from "express";
import { createAuthentication } from "services/authentication";
import {
  createUser,
  getUserByCode,
  getUserByUsername,
  getUserWithAuthByUsername,
  getUserWithAuthByCode,
  getUserById,
} from "services/users";
import { random, authentication } from "utils/authentication";
import { LoginSchema, RegisterSchema, UserFromDatabase} from "schemas/users";
import type { InsertAuthentication } from "schemas/authentication";
import jwt from "jsonwebtoken";

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { user, password } = RegisterSchema.parse(req.body);

    let existingUser;

    if (user.code) {
      existingUser = await getUserByCode(user.code);
    } else if (user.username) {
      existingUser = await getUserByUsername(user.username);
    } else {
      return res
        .status(401)
        .json({ message: "You must provide code or username" });
    }

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const addedUser = await createUser(user);

    const salt = random();
    const hash = authentication(salt, password);

    const authObject: InsertAuthentication = {
      userId: addedUser.id,
      salt,
      hash,
    };

    const addedAuth = await createAuthentication(authObject);

    console.log(addedUser, addedAuth);

    const result = UserFromDatabase.parse(addedUser)

    return res.status(200).json(result).end();
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Invalide data provided" });
  }
};

export const login = async (req: express.Request, res: express.Response) => {
  try {
    console.log(req.body);
    const { user, password } = LoginSchema.parse(req.body);
    console.log(user, password);

    if (!user.code && !user.username) {
      return res
        .status(401)
        .json({ message: "You must provide code or username" });
    }

    let existingUser;

    if (user.code) {
      existingUser = await getUserWithAuthByCode(user.code);
    } else {
      existingUser = await getUserWithAuthByUsername(user.username!);
    }

    if (!existingUser) {
      return res.status(401).json({ message: "User is not found" });
    }

    const expectedHash = authentication(existingUser.salt, password);

    if (expectedHash != existingUser.hash) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // const salt = random()
    // const sessionToken = authentication(salt, String(existingUser.id))
    // existingUser.sessionToken = sessionToken
    // await updateAuthentication(existingUser.id, {hash: existingUser.hash, salt: existingUser.salt, sessionToken: sessionToken})
    // res.cookie('shrewd-auth', existingUser.sessionToken)

    const token = jwt.sign(
      { userId: existingUser.id },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" },
    );
    res.cookie("token", token, { httpOnly: true, maxAge: 60 * 60 * 1000 });

    return res.status(200).json("Success!").end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const logout = async (req: express.Request, res: express.Response) => {
  res.clearCookie("token", { httpOnly: true });
  res.status(200).json({message: "Logged out successfully"}).end();
}

export const whoami = async (req: express.Request, res: express.Response) => {
  try {
    console.log("whoami called");
    if (!req.userId) return res.sendStatus(401);

    const user = await getUserById(req.userId!);

    if (!user) return res.sendStatus(404);

    const result = UserFromDatabase.parse(user);

    res.json(result);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};
