import { collections } from "../config/db.js";
import { USER_ROLES } from "../constants/user.js";
import createHttpError from "../utils/httpError.js";
import { toObjectId } from "../utils/objectId.js";

export const getUserByEmail = async (email) =>
  collections.users.findOne({ email });

export const getAllUsers = async () => collections.users.find().toArray();

export const upsertUserFromAuth = async ({
  name,
  email,
  photoURL,
  role = "user",
  isSubscribed = false,
  subscriptionDate = null,
}) => {
  if (!name || !email) {
    throw createHttpError(400, "Name and Email are required.");
  }

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    const updates = {
      name: name || existingUser.name,
      photoURL: photoURL || existingUser.photoURL,
    };

    await collections.users.updateOne({ email }, { $set: updates });

    return {
      statusCode: 200,
      payload: {
        message: "User data updated successfully.",
        userId: existingUser._id,
      },
    };
  }

  const newUser = {
    name,
    email,
    photoURL: photoURL || "",
    role,
    isSubscribed,
    subscriptionDate,
  };

  const result = await collections.users.insertOne(newUser);

  return {
    statusCode: 201,
    payload: {
      message: "User registered successfully.",
      userId: result.insertedId,
    },
  };
};

export const updateUserRole = async (id, role) => {
  if (!USER_ROLES.includes(role)) {
    throw createHttpError(400, "Invalid role provided.");
  }

  const userId = toObjectId(id);
  const updateResult = await collections.users.updateOne(
    { _id: userId },
    { $set: { role } }
  );

  if (!updateResult.matchedCount) {
    throw createHttpError(404, "User not found.");
  }

  return { role };
};

export const updateSubscription = async ({
  email,
  isSubscribed,
  subscriptionDate,
}) => {
  const result = await collections.users.updateOne(
    { email },
    {
      $set: {
        isSubscribed,
        subscriptionDate,
      },
    }
  );

  return result;
};
