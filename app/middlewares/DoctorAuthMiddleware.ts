import Doctor, { IDoctorDocument } from "../models/DoctorModel";
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface VerifiedToken extends JwtPayload {
  _id: string;
}

const DoctorAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies["AuthToken"];

  if (token) {
    try {
      const verified = jwt.verify(token, process.env.TOKEN_KEY || "defaultSecretKey") as VerifiedToken;
      Doctor.findById(verified._id)
        .then((user: IDoctorDocument | null) => {
          if (user) {
            res.locals.userId = user._id;
            next();
          } else {
            res.redirect("/user/login?loginRedirect=true");
          }
        })
        .catch((err) => {
          res.status(500).send(err);
        });
    } catch (err) {
      res.redirect("/user/login?loginRedirect=true");
    }
  } else {
    res.redirect("/user/login?loginRedirect=true");
  }
};

export default DoctorAuthMiddleware;