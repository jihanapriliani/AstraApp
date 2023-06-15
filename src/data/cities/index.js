import { getDatabase, ref, set } from "firebase/database";
import FIREBASE from '../../config/firebase';


const cities = [
  {
    "id": "C01",
    "city": "Balikpapan" 
  },
  {
    "id": "C02",
    "city": "Berau" 
  },
  {
    "id": "C03",
    "city": "Nunukan" 
  },
  {
    "id": "C04",
    "city": "Bulungan" 
  },
  {
    "id": "C05",
    "city": "Paser" 
  },
  {
    "id": "C06",
    "city": "PPU" 
  },
  {
    "id": "C07",
    "city": "Tarakan" 
  }
]

export default putCitiesToFirebase = () => {
    const database = getDatabase(FIREBASE);
    set(ref(database, 'Cities'), cities)
    .then(data => console.log(data))
    .catch(err => console.log(err))
    return {};
}


