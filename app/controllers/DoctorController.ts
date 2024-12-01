import { Request, Response } from "express";
import Doctor, { IDoctorDocument } from "../models/DoctorModel";
import bcrypt from "bcrypt";

export const DoctorController = {
  signup: (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    const newDoctor = new Doctor({ name, email, password });

    newDoctor
      .save()
      .then((doctor) => {
        res.status(201).json({ message: "Doctor created successfully", success: true });
      })
      .catch((err) => {
        if (err.code === 11000) {
          res.status(400).json({ error: "Doctor already exists" });
        } else {
          res.status(500).json({ error: "An error occurred during signup", details: err });
        }
      });
  },

  login: (req: Request, res: Response) => {
    Doctor.findOne({ email: req.body.email })
      .then((doctor: IDoctorDocument | null) => {
        if (!doctor) {
          return res.status(400).json({ error: "Doctor not found" });
        }

        bcrypt.compare(req.body.password, doctor.password, (err, logged) => {
          if (err) {
            return res.status(500).json({ error: "Error during password comparison" });
          }

          if (logged) {
            const token = doctor.generateAuthToken();
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

export default DoctorController;