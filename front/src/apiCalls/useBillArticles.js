import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const createBillArticle = async (payload) => {
  try {
    const { data } = await axios.post(`${BASE_URL}api/bill-article-copies`, {
      data: payload,
    });
    return data;
  } catch (err) {
    throw new Error(err);
  }
};

export const editBill = async (payload) => {
  const id = payload.id;
  delete payload.id;
  try {
    const { data } = await axios.put(`${BASE_URL}api/bill-copies/${id}`, {
      data: payload,
    });
    return data;
  } catch (err) {
    throw new Error(err);
  }
};

export const getBillArticles = async (id) => {
  try {
    const { data } = await axios.get(`${BASE_URL}api/bill-copies/${id}?populate=*`);
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const getBills = async (id) => {
  try {
    const { data } = await axios.get(`${BASE_URL}api/bill-copies?populate=*`);
    return data;
  } catch (err) {
    console.log(err);
  }
};
