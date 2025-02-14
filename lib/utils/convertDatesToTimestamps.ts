import { Timestamp } from "firebase/firestore";

function isTimestampLike(
  obj: unknown,
): obj is { _seconds: number; _nanoseconds: number } {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "_seconds" in obj &&
    "_nanoseconds" in obj
  );
}

function convertToTimestamp(obj: {
  _seconds: number;
  _nanoseconds: number;
}): Timestamp {
  return new Timestamp(obj._seconds, obj._nanoseconds);
}

function cleanupObject<T>(obj: T): T {
  if (Array.isArray(obj)) {
    return obj.map(cleanupObject) as unknown as T;
  }

  if (typeof obj === "object" && obj !== null) {
    if (isTimestampLike(obj)) {
      return convertToTimestamp(obj) as unknown as T;
    }

    const cleanedObject: unknown = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        cleanedObject[key] = cleanupObject(obj[key]);
      }
    }
    return cleanedObject;
  }

  return obj;
}

export { cleanupObject, convertToTimestamp };
