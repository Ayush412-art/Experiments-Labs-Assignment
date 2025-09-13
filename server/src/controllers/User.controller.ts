import { Request, Response } from "express";
import user from "../models/User.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const user_login = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;
  try {
    //checking for the email in the mongodb
    const isUser = await user.findOne({ email });

    if (!isUser) {
      return res.status(404).json({ msg: "user not found ❌" });
    }
    //password checking'
    const match = await bcrypt.compare(password, isUser.password);

    if (!match) {
      return res.status(404).json({ msg: "incorrect password " });
    }
    const secret_key: any = process.env.SECRET_KEY;

    const token: string = jwt.sign(
      { email: isUser.email, role: "email" },
      secret_key,
      {
        expiresIn: "24h",
      }
    );
    if (token) {
      return res.status(200).json(token);
    }
  } catch (err) {
    console.error("Faild to login ❌ ", err);
    process.exit(1);
  }
};

const user_signup = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;

  try {
    //checking for dublicasy
    const is_user = await user.findOne({ email });

    if (is_user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashedPassword: any = await bcrypt.hash(password, 10);

    const new_user = new user({
      email: email,
      password: hashedPassword,
    
    });
    await new_user.save();

    return res.status(201).json({ msg: "user is created sucessfully" });
  } catch (err) {
    console.error("Faild to signup ❌ ", err);
    process.exit(1);
  }
};

export { user_login, user_signup };