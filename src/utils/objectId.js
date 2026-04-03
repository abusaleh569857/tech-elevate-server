import { ObjectId } from "mongodb";

import createHttpError from "./httpError.js";

const toObjectId = (value) => {
  if (!ObjectId.isValid(value)) {
    throw createHttpError(400, "Invalid resource id.");
  }

  return new ObjectId(value);
};

export { toObjectId };
