import {
  getAllUsers as getAllUsersService,
  getUserByEmail,
  updateSubscription as updateSubscriptionService,
  updateUserRole as updateUserRoleService,
  upsertUserFromAuth,
} from "../services/user.service.js";

export const getUser = async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const user = await getUserByEmail(email);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json(user);
};

export const getAllUsers = async (req, res) => {
  const users = await getAllUsersService();
  res.json(users);
};

export const saveUser = async (req, res) => {
  const result = await upsertUserFromAuth(req.body);
  res.status(result.statusCode).json(result.payload);
};

export const updateUserRole = async (req, res) => {
  const result = await updateUserRoleService(req.params.id, req.body.role);
  res.json(result);
};

export const updateSubscription = async (req, res) => {
  const result = await updateSubscriptionService(req.body);
  res.status(200).json({ success: true, result });
};
