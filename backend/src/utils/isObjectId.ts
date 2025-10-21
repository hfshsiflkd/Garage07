import { Types } from "mongoose";
export const isObjectId = (v: string) => Types.ObjectId.isValid(v);
