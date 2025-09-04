import { Response, Request } from "express";
import Team from "./../model/admin.model.ts";
import { sendAcceptanceEmail, sendRejectionEmail } from "../utils/emailService";
import userModel from "../model/user.model.ts";
import { compareHash, verifyJwt } from "../utils/hashPass.ts";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

interface User {
  username: string;
  password: string;
}

const AUTH_COOKIE = "token";
const SECRET = process.env.JWT_SECRET || "default_secret";

const getTeams = async (req: Request, res: Response): Promise<any> => {
  try {
    const tokens = req.cookies?.[AUTH_COOKIE];

    if (!tokens) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = await verifyJwt(tokens, SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    console.log("Fetching teams...");
    const teams = await Team.find();
    console.log("Teams found:", teams ? teams.length : 0);

    if (!teams || teams.length === 0) {
      console.log("No teams found");
      return res.status(404).json({ message: "No teams found" });
    }

    return res.status(200).json(teams);
  } catch (error) {
    console.error("Error fetching teams:", error);
    return res.status(500).json({ message: "Error fetching teams" });
  }
};

const acceptTeam = async (req: Request, res: Response): Promise<any> => {
  const tokens = req.cookies?.[AUTH_COOKIE];

  if (!tokens) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { teamName, actionedBy } = req.body;

  if (!teamName) {
    return res.status(404).json({ msg: "Team name not found" });
  }
  if (!actionedBy) {
    return res
      .status(400)
      .json({ msg: "Actioner name (acceptedBy) is required" });
  }

  const team = await Team.findOne({ teamName });

  if (!team) {
    return res.status(404).json({ msg: "Team not found" });
  }

  try {
    (team as any).registrationStatus = "approved";
    (team as any).actionedBy = actionedBy;
    await team.save();
    await sendAcceptanceEmail(
      team.leaderEmail,
      team.registrationNumber as string
    );
    return res
      .status(201)
      .json({ msg: "Team approved and notification email sent", team });
  } catch (error) {
    console.error("Error approving team or sending email:", error);
    return res.status(500).json({
      msg: "Failed to approve team or send notification email",
      error: error instanceof Error ? error.message : error,
    });
  }
};

const rejectTeam = async (req: Request, res: Response): Promise<any> => {

  const tokens = req.cookies?.[AUTH_COOKIE];

    if (!tokens) {
      return res.status(401).json({ message: "Unauthorized" });
    }

  const { teamName, reason, actionedBy } = req.body;

  if (!teamName) {
    return res.status(404).json({ msg: "Team name not found" });
  }
  if (!actionedBy) {
    return res
      .status(400)
      .json({ msg: "Actioner name (rejectedBy) is required" });
  }

  const team = await Team.findOne({ teamName });
  if (!team) {
    return res.status(404).json({ msg: "Team not found" });
  }
  try {
    (team as any).reason = reason || "Rejected by admin";
    (team as any).registrationStatus = "rejected";
    (team as any).actionedBy = actionedBy;
    await team.save();
    await sendRejectionEmail(team.leaderEmail, team.teamName);
    return res.status(201).json({ msg: "Team rejected", team });
  } catch (error) {
    return res.status(500).json({
      msg: "Failed to reject team",
      error: error instanceof Error ? error.message : error,
    });
  }
};

const getTeam = async (req: Request, res: Response): Promise<any> => {

  try {
    const total = await Team.countDocuments();
    const approved = await Team.countDocuments({
      registrationStatus: "approved",
    });
    const pending = await Team.countDocuments({
      registrationStatus: "pending",
    });
    const rejected = await Team.countDocuments({
      registrationStatus: "rejected",
    });
    return res.status(200).json({ total, approved, pending, rejected });
  } catch (error) {
    return res.status(500).json({
      msg: "Failed to get team counts",
      error: error instanceof Error ? error.message : error,
    });
  }
};

const login = async (req: Request, res: Response): Promise<any> => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ msg: "Username and password are required" });
  }

  try {
    const user = (await userModel.findOne({ username: username })) as User;
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (!(await compareHash(password, user.password))) {
      // Use Set-Cookie header to clear cookie on invalid login
      res.setHeader(
        "Set-Cookie",
        `${AUTH_COOKIE}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax${
          process.env.NODE_ENV === "production" ? "; Secure" : ""
        }`
      );
      return res.status(401).json({ msg: "Invalid Username or Password" });
    }

    const token = jwt.sign(
      { username: user.username, id: (user as any)._id },
      SECRET,
      { expiresIn: "1h" }
    );

    res.cookie(AUTH_COOKIE, token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
      sameSite: "none",
      secure:true,
      path: "/",
    });

    return res.status(200).json({ success: true, token });
  } catch (error) {
    return res.status(500).json({
      msg: "Login failed",
      error: error instanceof Error ? error.message : error,
    });
  }
};

const logout = async (req: Request, res: Response): Promise<any> => {
  res.setHeader(
    "Set-Cookie",
    `${AUTH_COOKIE}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax${
      process.env.NODE_ENV === "production" ? "; Secure" : ""
    }`
  );
  return res.status(200).json({ msg: "Logout successful" });
};

export default { getTeams, acceptTeam, getTeam, rejectTeam, login, logout };
