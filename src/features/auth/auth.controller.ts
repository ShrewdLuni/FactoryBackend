import express from "express";
import { Controller } from "abstract/controller";
import { AuthInsertSchema, AuthLoginSchema, AuthRegisterSchema, type Auth, type AuthInsert } from "./auth.schema";
import { AuthService } from "./auth.service";
import { asyncHandler, HttpError } from "utils/errorHandler";

export class AuthController extends Controller<Auth, AuthInsert, AuthService> {
  constructor(service: AuthService = new AuthService()) {
    super(service, AuthInsertSchema);
  }

  register = asyncHandler(async (req: express.Request, res: express.Response) => {
    const data = AuthRegisterSchema.parse(req.body);
    const result = await this.service.register(data);
    res.status(200).json(result);
  });

  login = asyncHandler(async (req: express.Request, res: express.Response) => {
    const data = AuthLoginSchema.parse(req.body);
    const token = await this.service.login(data);
    res.cookie("token", token, { httpOnly: true, maxAge: 16 * 60 * 60 * 1000 });
    res.status(200).json("Success!");
  });

  logout = asyncHandler(async (_req: express.Request, res: express.Response) => {
    res.clearCookie("token", { httpOnly: true });
    res.status(200).json({ message: "Logged out successfully" });
  });

  whoami = asyncHandler(async (req: express.Request, res: express.Response) => {
    if (!req.userId) throw new HttpError(401, `Invalid data, you must provide userId`);
    const result = await this.service.whoami(req.userId);
    res.status(200).json(result);
  });
}
