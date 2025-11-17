import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const createBill = async (payload) => {
  try {
    const { data } = await axios.post(`${BASE_URL}api/bill-copies`, {
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

export const getBill = async (id) => {
  try {
    const { data } = await axios.get(
      `${BASE_URL}api/bill-copies/${id}?populate=deep,3`
    );
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const getBills = async (date, page, rowsPerPage, filter, nameSurnameSearch, addressSearch) => {
  let url = `${BASE_URL}api/bill-copies?pagination[page]=${page}&pagination[pageSize]=${rowsPerPage}&populate=*&filters[deletedFlag][$eq]=false`
  if (date) {
    const from = new Date(date.getFullYear(), date.getMonth(), 2);
    const to = new Date(date.getFullYear(), date.getMonth() + 1, 1);

    const fromFormated = from.toISOString().split('T')[0]
    const toFormated = to.toISOString().split('T')[0]
    url = `${url}&filters[date][$between]=${fromFormated}&filters[date][$between]=${toFormated}`
  }
  if (nameSurnameSearch) {
    url = `${url}&filters[$or][0][client_id][name][$containsi]=${nameSurnameSearch}&filters[$or][1][client_id][surname][$containsi]=${nameSurnameSearch}`
  }
  if (addressSearch) {
    url = `${url}&filters[$and][0][client_id][address][$containsi]=${addressSearch}`
  }
  //&filters[createdAt][$between]=2023-03-07&filters[createdAt][$between]=2025-04-07
  if (filter) {
    switch (filter) {
      case 'Narudzbina | Ima sifru | Transport': {
        url = `${url}&filters[articles_location][$eq]=1`
      }
        break;
      case 'Arhivirano': {
        url = `${url}&filters[payed][$eq]=true&filters[articles_location][$eq]=2`
        break;
      }
      case 'Isporuceno i neplaceno': {
        url = `${url}&filters[payed][$eq]=false&filters[articles_location][$eq]=2`
        break;
      }
      case 'Narudzbina': {
        url = `${url}&filters[additionalId][$null]=true&filters[payed][$eq]=false`
        break;
      }
      case 'Ima sifru': {
        url = `${url}&filters[additionalId][$notNull]=true&filters[payed][$eq]=false&filters[articles_location][$eq]=1&filters[transportReady][$eq]=false`
        break;
      }
      case 'Transport': {
        url = `${url}&filters[transportReady][$eq]=true&filters[additionalId][$notNull]=true&filters[payed][$eq]=false&filters[articles_location][$eq]=1`
        break;
      }
    }
  }

  try {
    const { data } = await axios.get(url);
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const getLastLawBill = async () => {
  let url = `${BASE_URL}api/bill-copies?populate=*`
  const date = new Date()
  const from = new Date(date.getFullYear(), date.getMonth(), 2);
  const to = new Date(date.getFullYear(), date.getMonth() + 1, 1);

  const fromFormated = from.toISOString().split('T')[0]
  const toFormated = to.toISOString().split('T')[0]
  url = `${url}&sort=createdAt:desc&pagination[limit]=1&filters[client_id][clientType][$eq]=Pravno`
  //&filters[createdAt][$between]=2023-03-07&filters[createdAt][$between]=2025-04-07
  try {
    const { data } = await axios.get(url);
    return data;
  } catch (err) {
    console.log(err);
  }
};
