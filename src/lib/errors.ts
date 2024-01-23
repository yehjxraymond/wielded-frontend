import axios from "axios";

export const betterAxiosError = <T extends unknown[], R>(
  fn: (...args: T) => Promise<R>
) => {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || "An error occurred";
        throw new Error(message);
      }
      throw error;
    }
  };
};
