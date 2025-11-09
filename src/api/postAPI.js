import { axiosInstance, axiosInstanceWithAuth } from './axiosClient';

export const getPosts = async () => {
  return await axiosInstanceWithAuth.get('/posts/getall');
};

export const getPostById = async (id) => {
  return await axiosInstanceWithAuth.get(`/posts/get/${id}`);
};

export const createPost = async (post) => {
  return await axiosInstanceWithAuth.post('/posts/create', post);
};

export const updatePost = async (id, post) => {
  return await axiosInstanceWithAuth.put(`/posts/update/${id}`, post);
};

export const deletePost = async (id) => {
  return await axiosInstanceWithAuth.delete(`/posts/delete/${id}`);
};
