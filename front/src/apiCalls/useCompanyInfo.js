import axios from 'axios'
const BASE_URL = import.meta.env.VITE_BASE_URL

export const editCompanyInfo = async (payload) => {
    try {
        const { data } = await axios.put(`${BASE_URL}api/company-info`,
            { data: payload }
        );
        return data
    } catch (err) {
        throw new Error(err)
    }
}

export const getCompanyInfo = async () => {
    try {
        const { data } = await axios.get(`${BASE_URL}api/company-info`);
        return data
    } catch (err) {
        console.log(err)
    }
}
