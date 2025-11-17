import axios from 'axios'
const BASE_URL = import.meta.env.VITE_BASE_URL


export const createExpense = async (payload) => {
    try {
        const { data } = await axios.post(`${BASE_URL}api/expenses`,
            { data: payload }
        );
        return data
    } catch (err) {
        throw new Error(err)
    }
}

export const deleteExpense = async (payload) => {
    const id = payload.id
    delete payload.id
    try {
        const { data } = await axios.delete(`${BASE_URL}api/expenses/${id}`,
            { data: payload }
        );
        return data
    } catch (err) {
        throw new Error(err)
    }
}

export const getExpenses = async (dateFrom, dateTo) => {
    const from = new Date(dateFrom.getFullYear(), dateFrom.getMonth(), 2);
    const to = new Date(dateTo.getFullYear(), dateTo.getMonth() + 1, 1);

    const fromFormated = from.toISOString().split('T')[0]
    const toFormated = to.toISOString().split('T')[0]

    //?filters[date][$between]=2025-03-07&filters[date][$between]=2025-04-07
    try {
        const { data } = await axios.get(`${BASE_URL}api/expenses?filters[date][$between]=${fromFormated}&filters[date][$between]=${toFormated}`);
        //?filters[date][$between]=${fromFormated}&filters[date][$between]=${toFormated}
        return data
    } catch (err) {
        console.log(err)
    }
}