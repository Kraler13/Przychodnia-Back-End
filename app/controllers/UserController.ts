import { Request, Response } from "express";
import User, { IUserDocument } from "../models/UserModel";
import bcrypt from "bcrypt";

export const UserController = {
  signup: (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    const newUser = new User({ name, email, password });

    newUser
      .save()
      .then((user) => {
        res.status(201).json({ message: "User created successfully", success: true });
      })
      .catch((err) => {
        if (err.code === 11000) {
          res.status(400).json({ error: "User already exists" });
        } else {
          res.status(500).json({ error: "An error occurred during signup", details: err });
        }
      });
  },

  login: (req: Request, res: Response) => {
    User.findOne({ email: req.body.email })
      .then((user: IUserDocument | null) => {
        if (!user) {
          return res.status(400).json({ error: "Doctor not found" });
        }

        bcrypt.compare(req.body.password, user.password, (err, logged) => {
          if (err) {
            return res.status(500).json({ error: "Error during password comparison" });
          }

          if (logged) {
            const token = user.generateAuthToken();
            res.status(200).json({ message: "Login successful", token });
          } else {
            return res.status(400).json({ error: "Invalid credentials" });
          }
        });
      })
      .catch((err) => {
        res.status(500).json({ error: "An error occurred during login", details: err });
      });
  },

  logout: (_req: Request, res: Response) => {
    res.status(200).json({ message: "Logout successful" });
  },
};

export default UserController;