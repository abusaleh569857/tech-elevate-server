import jwt from "jsonwebtoken";

import { accessTokenSecret } from "../config/env.js";

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  jwt.verify(token, accessTokenSecret, (error, decoded) => {
    if (error) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    req.user = decoded;
    next();
  });
};

export default authenticateToken;
