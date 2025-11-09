import { axiosInstance } from "./axiosClient";

export const improveText = async (text) => {
  const res = await axiosInstance.post("/ai/improve", { text });
  return res.data; // expects { improvedText }
};
