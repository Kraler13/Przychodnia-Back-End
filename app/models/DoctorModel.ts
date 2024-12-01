import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export interface IDoctor {
  email: string;
  password: string;
}

export interface IDoctorDocument extends IDoctor, mongoose.Document {
  _id: mongoose.Types.ObjectId;
  generateAuthToken(): string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const doctorSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
  },
  password: {
    type: String,
    required: true,
    minlength: [6, "Password must be at least 6 characters long"],
  },
});

doctorSchema.pre("save", async function (next) {
  const doctor = this;
  if (!doctor.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    doctor.password = await bcrypt.hash(doctor.password, salt);
    next();
  } catch (err) {
    next(err as mongoose.CallbackError);
  }
});

doctorSchema.methods.generateAuthToken = function (): string {
  const doctor = this as IDoctorDocument;
  const token = jwt.sign(
    { _id: doctor._id, role: "doctor" },
    process.env.TOKEN_KEY || "defaultSecretKey",
    { expiresIn: "1h" }
  );
  return token;
};

doctorSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

doctorSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  },
});

const Doctor = mongoose.model<IDoctorDocument>("Doctor", doctorSchema);

export default Doctor;