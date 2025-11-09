import { axiosInstance } from './axiosClient';

export const register = async (user) => {
  return await axiosInstance.post('/auth/register', user);
};

export const login = async (user) => {
  return await axiosInstance.post('/auth/login', user);
};
