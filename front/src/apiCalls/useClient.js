import axios from 'axios'
const BASE_URL = import.meta.env.VITE_BASE_URL


export const createClient = async (payload) => {
    try {
        const { data } = await axios.post(`${BASE_URL}api/clients`,
            { data: payload }
        );
        return data
    } catch (err) {
        throw new Error(err)
    }
}

export const editClient = async (payload) => {
    const id = payload.id
    delete payload.id
    try {
        const { data } = await axios.put(`${BASE_URL}api/clients/${id}`,
            { data: payload }
        );
        return data
    } catch (err) {
        throw new Error(err)
    }
}

export const getClient = async (id) => {
    try {
        const { data } = await axios.get(`${BASE_URL}api/clients/${id}`);
        return data
    } catch (err) {
        console.log(err)
    }
}

export const getClients = async (searchTerm, page, rowsPerPage) => {//[$or][name][$eqi]=${searchTerm}
    const url = `${BASE_URL}api/clients?pagination[page]=${page}&pagination[pageSize]=${rowsPerPage}${searchTerm ? `&filters[$or][0][name][$containsi]=${searchTerm}&filters[$or][1][surname][$containsi]=${searchTerm}` : ''}`
    try {
        const { data } = await axios.get(url);
        return data
    } catch (err) {
        console.log(err)
    }
}