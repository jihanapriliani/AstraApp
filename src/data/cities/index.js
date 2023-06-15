import firebase from "../../config/firebase";
import cities from './cities.json';

const tableCities = firebase.database().ref("cities");

export default putCitiesToFirebase = () => {

    cities.forEach(city => {
        tableCities.push(cities)
            .then(data => console.log("data kota berhasil ditambahkan"))
            .catch(err => console.error("data kota gagal ditambahkan"))
    })

    return {};
}


