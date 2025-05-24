import { HttpError } from "./http";
import toast from "react-hot-toast";

export const handleMutationError = (error: HttpError) => {
  if (error.isHandled) return;

  if (error.response?.data?.errors) {
    const errors = error.response.data.errors;

    errors.forEach((valError) => {
      toast.error(
        `${valError.path.join(".")}: ${valError.message.toLowerCase()}`
      );
    });

    return;
  }

  toast.error(error.response?.data?.message || "Terjadi kesalahan teknis");
  console.error(error);
};
