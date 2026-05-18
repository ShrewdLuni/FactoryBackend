import { Service } from "abstract/service";
import { AuthRepository } from "./auth.repository";
import type { Auth, AuthInsert, AuthLookup, AuthRegister, AuthLogin } from "./auth.schema";
import { HttpError } from "utils/errorHandler";
import { authentication, random } from "utils/authentication";
import { UserRepository } from "features/users/user.repository";
import jwt from "jsonwebtoken";

export class AuthService extends Service<Auth, AuthInsert, AuthLookup, AuthRepository> {
  private userRepository: UserRepository;

  constructor(repo: AuthRepository = new AuthRepository(), userRepository: UserRepository = new UserRepository()){
    super(repo)
    this.userRepository = userRepository;
  }

  async register(data: AuthRegister) {
    const { user, password } = data

    const addedUser = await this.userRepository.create(user)

    const salt = random()
    const hash = authentication(salt, password)

    const authObject: AuthInsert = { user: { id: addedUser.id }, salt, hash}

    await this.repository.create(authObject);

    return addedUser;
  }

  async login(data: AuthLogin) {
    const { user, password } = data;
    if (!user.code && !user.username) throw new HttpError(401, "You must provide code or username");

    const { code, username } = user;

    const existingUser = code ? 
      await this.userRepository.find({ code }) : 
      username &&
      await this.userRepository.find({ username });

    if (!existingUser) throw new HttpError(401, "User is not found")

    const auth = await this.repository.find({ user_id: existingUser.id });

    if (!auth) throw new HttpError(401, "Auth is not found")

    const expectedHash = authentication(auth.salt, password);

    if(expectedHash !== auth.hash) throw new HttpError(401, "Invalid credentials");

    const token = jwt.sign({ userId: existingUser.id }, process.env.JWT_SECRET!, { expiresIn: "16h" });
    return token;
  }

  async whoami(id: number) {
    const user = await this.userRepository.find({ id })
    if (!user) throw new HttpError(404, `User with ID ${id} not found`)
    return user;
  }
}
