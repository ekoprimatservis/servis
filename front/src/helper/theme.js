export const theme = {
    primary: '#bad0c0',
    secondary: '#ebfaf1',
    dark: '#30723f'
}
const obj = {
    "date": null,
    "payed": true,
    "total": null,
    "articlesCount": null,
    "discount": 0,
    "createdAt": "2024-12-21T18:28:59.430Z",
    "updatedAt": "2024-12-26T10:34:49.842Z",
    "publishedAt": "2025-02-25T12:10:48.268Z",
    "pickup_date": "2024-12-24",
    "articles_location": 1,
    "additionalId": null,
    "client_id": {
        "data": {
            "id": 1,
            "attributes": {
                "name": "Butik",
                "surname": "11111",
                "city": "Beograd",
                "address": "Knez Mihajlova",
                "phone": "312545",
                "mobile": "381628768303",
                "email": "inbox@butik.com",
                "addressNumber": "12",
                "clientType": "Pravno",
                "createdAt": "2024-12-21T13:43:49.499Z",
                "updatedAt": "2024-12-21T13:47:43.304Z",
                "publishedAt": "2024-12-21T13:43:49.496Z"
            }
        }
    },
    "bill_articles": {
        "data": []
    }
}
export const backgroundRowColor = (obj) => {

    if (!obj?.additionalId && !obj?.payed) {
        return "#FF7F7F"  // red
    }
    else if (obj?.additionalId && !obj?.payed && obj.articles_location === 1 && !obj.transportReady) {
        return '#FFFF6E' // yellow
    }

    else if (!obj?.payed && obj.articles_location === 2) {
        return '#90D5FF' // orange #FFD580 is new blue
    }
    else if (obj.transportReady && obj?.additionalId && !obj?.payed) {
        return '#C5E1BA' // green
    }
    else if (obj?.payed && obj.articles_location === 2) {
        return '#D3D3D3' // gray
    }
    return "" // white
}