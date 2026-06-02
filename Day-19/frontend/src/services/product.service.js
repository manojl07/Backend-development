import API from "../api/axios";

export const getProducts = async (params) => {
  const response = await API.get('/products', {params});

  return response.data;
};