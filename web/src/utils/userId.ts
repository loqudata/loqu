import { ulid } from "ulid";
// declare global

var loquUserID: string;

export function getUserID(): string {
  if (!loquUserID) {
    loquUserID = ulid();
  }
  console.log("userID", loquUserID);
  
  return loquUserID;
}
