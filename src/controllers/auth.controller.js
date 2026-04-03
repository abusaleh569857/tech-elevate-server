import { generateAccessToken } from "../services/auth.service.js";

export const createJwtToken = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const token = generateAccessToken({ email });
  res.json({ token });
};
