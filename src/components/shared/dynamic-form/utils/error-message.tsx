// utils/form-errors.ts
import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";

type ExtendedFieldError =
  | FieldError
  | Merge<FieldError, FieldErrorsImpl<any>>
  | undefined;

export const getErrorMessage = (error: ExtendedFieldError): string => {
  if (!error) return "";

  // Handle standard FieldError
  if ("message" in error && typeof error.message === "string") {
    return error.message;
  }

  // Handle merged errors
  if (typeof error === "object") {
    // Check for Zod union error format
    if (Array.isArray(error)) {
      return error.map((e) => getErrorMessage(e)).join(", ");
    }

    // Handle nested errors
    if ("message" in error && error.message) {
      if (typeof error.message === "string") return error.message;
      if (typeof error.message === "object") {
        return Object.values(error.message)
          .map((val) => getErrorMessage(val as ExtendedFieldError))
          .filter(Boolean)
          .join(", ");
      }
    }
  }

  return "Invalid value";
};
