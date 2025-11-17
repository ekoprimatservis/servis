import axios from 'axios'
const BASE_URL = import.meta.env.VITE_BASE_URL


export const createArticle = async (payload) => {
    try {
        const { data } = await axios.post(`${BASE_URL}api/articles`,
            { data: payload }
        );
        return data
    } catch (err) {
        throw new Error(err)
    }
}

export const editArticle = async (payload) => {
    const id = payload.id
    delete payload.id
    try {
        const { data } = await axios.put(`${BASE_URL}api/articles/${id}`,
            { data: payload }
        );
        return data
    } catch (err) {
        throw new Error(err)
    }
}

export const getArticle = async (id) => {
    try {
        const { data } = await axios.get(`${BASE_URL}api/articles/${id}`);
        return data
    } catch (err) {
        console.log(err)
    }
}

export const getArticles = async (page, rowsPerPage) => {
    try {
        const { data } = await axios.get(`${BASE_URL}api/articles?pagination[page]=${page}&pagination[pageSize]=${rowsPerPage}`);
        return data
    } catch (err) {
        console.log(err)
    }
}