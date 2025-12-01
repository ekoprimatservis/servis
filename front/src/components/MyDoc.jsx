import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Font
} from "@react-pdf/renderer";
import { formatPhoneNumber, applyDiscount, formatLandLinePhone } from "../helper/calculations";

Font.register({
    family: 'Roboto',
    fonts: [
        {
            src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf',
            fontWeight: 400,
        },
        {
            src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf',
            fontWeight: 700,
        },
    ],
});


const styles = StyleSheet.create({
    page: {
        padding: 20,
        fontSize: 10,
        fontFamily: 'Roboto',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    companyInfo: {
        width: '50%',
        paddingLeft: 30,
    },
    clientInfo: {
        width: '50%',
        alignItems: 'flex-end',
        fontSize: 14,
    },
    boldUnderline: {
        fontWeight: 'bold',
        textDecoration: 'underline',
        // paddingBottom: 10,
    },
    boldLarge: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    table: {
        marginTop: 20,
        borderTop: '1px solid #000',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 4,
    },
    headerRow: {
        fontWeight: 'bold',
        borderBottom: '1px solid #000',
        paddingBottom: 6,
    },
    summary: {
        marginTop: 30,
        width: '50%',
        alignSelf: 'flex-end',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    footer: {
        marginTop: 40,
        textAlign: 'center',
        fontSize: 8,
    },
});


export const MyDoc = ({ data, id, companyInfo }) => {
    const client = data?.client_id?.data?.attributes;
    const articles = data?.bill_articles?.data || [];
    const additionalId = articles?.[0]?.attributes?.bill?.data?.attributes?.additionalId;

    return (

        <Document title={`Bill-${id}`}>
            <Page size="A5" style={styles.page}>
                <View style={styles.header}>
                    <View style={styles.companyInfo}>
                        {/* <Text style={{ fontWeight: 'bold' }}>{companyInfo?.companyAddress}</Text>
                        <Text>{companyInfo?.postalCode} {companyInfo?.cityName}</Text>
                        <Text>{formatLandLinePhone(companyInfo?.phoneNumber) || '\n'}</Text>
                        <Text>{formatPhoneNumber(companyInfo?.mobileNumber) || '\n'}</Text>
                        <Text>{companyInfo?.email || '\n'}</Text>
                        <Text>Šifra Tepiha:</Text>
                        <Text style={styles.boldLarge}>{additionalId}</Text> */}
                    </View>

                    <View style={styles.clientInfo}>
                        <Text style={styles.boldUnderline}>Klijent:</Text>
                        {!isNaN(client?.surname) ? <>
                            <Text>{client?.name}</Text>
                            <Text>PIB: {client?.surname}</Text>
                        </> : <Text>{client?.name} {client?.surname}</Text>}
                        <Text>{client?.address} {client?.addressNumber}</Text>
                        <Text>{client?.entrance?`ulaz:${client?.entrance}`:null} {client?.floor?`sprat:${client?.floor}`:null} {client?.apartment?`stan:${client?.apartment}`:null}</Text>
                        <Text>{client?.city}</Text>
                        {client?.mobile ? <>
                            <Text style={{ textDecoration: 'underline' }}>Telefon:</Text>
                            <Text style={styles.boldLarge}>{formatPhoneNumber(client?.mobile)}</Text>
                        </> : null}
                    </View>
                </View>

                <View style={styles.table}>
                    <View style={[styles.row, styles.headerRow]}>
                        <Text style={{ width: '25%' }}>Artikal</Text>
                        <Text style={{ width: '15%' }}>Dim.</Text>
                        <Text style={{ width: '15%' }}>Kol.</Text>
                        <Text style={{ width: '10%' }}>Cena</Text>
                        <Text style={{ width: '20%' }}>Ukupno</Text>
                    </View>
                    {articles.map((row, i) => {
                        const article = row?.attributes?.article?.data?.attributes;
                        return (
                            <View key={i} style={styles.row} wrap={false}>
                                <Text style={{ width: '25%' }}>{article?.name}</Text>
                                <Text style={{ width: '15%' }}>{`${row.attributes.height} x ${row.attributes.width}`}</Text>
                                <Text style={{ width: '15%' }}>{(row.attributes.height * row.attributes.width).toFixed(2)}</Text>
                                <Text style={{ width: '10%' }}>{row.attributes?.articlePrice}.00</Text>
                                <Text style={{ width: '20%' }}>{(row.attributes.price).toFixed(2)}</Text>
                            </View>
                        );
                    })}
                </View>

                {data?.discount ? (
                    <View style={{ ...styles.summary, marginTop: '5%', borderTop: 0 }}>
                        <Text>POPUST</Text>
                        <Text>{`${data.discount}%`}</Text>
                    </View>
                ) : null}

                <View style={{ ...styles.summary, marginTop: data?.discount ? '0' : '5%', width:'70%'}}>
                    <Text style={{...styles.clientInfo, width:550, whiteSpace:'no-wrap'}}>UKUPNO ZA NAPLATU</Text>
                    <Text style={{...styles.clientInfo, width:350 ,whiteSpace:'no-wrap'}}>{`${applyDiscount(articles, data.discount)} RSD`}</Text>
                </View>

                {/* <View style={styles.footer}>
                    <Text>{companyInfo?.footerText || ''}</Text>
                </View> */}
            </Page>
        </Document>

    );
};