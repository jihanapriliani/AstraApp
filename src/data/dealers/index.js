import { getDatabase, ref, set } from "firebase/database";
import FIREBASE from '../../config/firebase';


const dealers = {
    "C01": {
        "D0101": "ASTRA MOTOR - MT. HARYONO",
        "D0102": "ASTRA MOTOR - SUDIRMAN",
        "D0103": "ASTRA MOTOR - SEPINGGAN",
        "D0104": "ASTRA MOTOR - KILO",
        "D0105": "PT. HARAPAN UTAMA - KARANGJATI",
        "D0106": "PT. HARAPAN UTAMA - DAMAI",
        "D0107": "PT. HARAPAN UTAMA - RAJA MOTOR GUNUNG SARI",
        "D0108": "PT. DAYA ANUGRAH MANDIRI - BALIKPAPAN",
        "D0109": "PT. TUNAS DWIPA MATRA - BALIKPAPAN",
        "D0110": "PT. NUSANTARA SURYA SAKTI - BALIKPAPAN",
        "D0111": "CV. DAYA MAKMUR MANDIRI"
    },
    "C02": {
        "D0201": "ASTRA MOTOR - BERAU",
        "D0202": "CV. SUMBER JAYA ABADI MOTOR"
    },
    "C03": {
        "D0301": "ASTRA MOTOR - TANJUNG SELOR"
    },
    "C04": {
        "D0401": "PT. NUSANTARA SURYA SAKTI - NUNUKAN",
        "D0402": "DELAPAN JAYA"
    },
    "C05": {
        "D0501": "ASTRA MOTOR - TANAH GROGOT",
        "D0502": "ASTRA MOTOR - SIMPANG PAIT",
        "D0503": "PT. TUNAS DWIPA MATRA - TANAH GROGOT"
    },
    "C06": {
        "D0601": "ASTRA MOTOR - PENAJAM",
        "D0602": "PT. HARAPAN UTAMA - PETUNG",
        "D0603": "PT. DAYA ANUGRAH MANDIRI - PENAJAM"
    }, 
    "C07": {
        "D0701": "ASTRA MOTOR - TARAKAN",
        "D0702": "MOTOR MEGA TANO"
    }
}

export default putDealersToFirebase = () => {
    const database = getDatabase(FIREBASE);
    set(ref(database, 'Dealers'), dealers)
    .then(data => console.log(data))
    .catch(err => console.log(err))
    return {};
}

