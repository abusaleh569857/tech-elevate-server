import jwt from "jsonwebtoken";

import { accessTokenSecret } from "../config/env.js";

export const generateAccessToken = ({ email }) =>
  jwt.sign({ email }, accessTokenSecret, { expiresIn: "10h" });
