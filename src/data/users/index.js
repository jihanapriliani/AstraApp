import { getDatabase, ref, set } from "firebase/database";
import FIREBASE from '../../config/firebase';


const users = {
  "-NYfCiw76LhxvjdgXkyf": {
    "U9Lr6XSnhSSoiVvsQNFfXLXcvjk2" : {
      "email": "rifaldho.muhammad18@gmail.com",
      "fullname": "Rifaldho",
      "role": "Internship" 
    },
    "t4Pjn3cKi0YVQzE4X4vK2NwkDqT2" : {
      "email": "11211046@student.itk.ac.id",
      "fullname": "Jihan",
      "role": "Internship" 
    },
    "uoQP2xFdF8hQCLen5VxrZCDDyC42": {
      "email": "test1@test1.com",
      "fullname": "Tester 1",
      "role": "Tester" 
    },
    "Hf5B6GOQm0YeCAvRjJmTnQCViHi1": {
      "email": "test2@test2.com",
      "fullname": "Tester 1",
      "role": "Tester" 
    },
  }
}

export default putUsersToFirebase = () => {
    const database = getDatabase(FIREBASE);
    set(ref(database, 'Users'), users)
    .then(data => console.log(data))
    .catch(err => console.log(err))
    return {};
}


