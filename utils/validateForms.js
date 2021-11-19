const nameValidation = (fieldName, fieldValue) => {
    if (fieldValue.trim() === "") {
        return `${fieldName} is required`;
    }
    if (/[^a-zA-Z -]/.test(fieldValue)) {
        return "One or more characters are not allowed";
    }
    if (fieldValue.trim().length < 3) {
        return `${fieldName} must to be at least 3 characters long
`;
    }
    return null;
};

const emailValidation = (email) => {
    if (
        /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-]+$/.test(
            email
        )
    ) {
        return null;
    }
    if (email.trim() === "") {
        return "Email is required";
    }
    return "Please insert a valid email";
};

const passwordValidation = (password) => {
    if (password.trim().length < 6) {
        return "Password must to be at least 6 characters long";
    } else {
        return null;
    }
};

const requestedValue = (fieldValue) => {
    if (fieldValue.trim() === "") {
        return `Devi inserire qualcosa`;
    }
    return null;
};
const textValidation = (fieldValue) => {
    if (fieldValue.trim() === "") {
        return `Devi scriverci qualcosa`;
    }
    return null;
};

const numberValidation = (fieldName, fieldValue) => {
    if (fieldValue.trim() === "") {
        return `Il ${fieldName} è richiesto`;
    }
    if (/^\d+$/.test(fieldValue)) {
        return null;
    }
    return `${fieldName} deve essere un numero`;
};

// const ageValidation = (age) => {
//     if (!age) {
//         return "Age is required";
//     }
//     if (age < 18) {
//         return "Age must be at least 18";
//     }
//     if (age > 99) {
//         return "Age must be under 99";
//     }
//     return null;
// };

// const validate = {
//     firstName: (name) => nameValidation("First Name", name),
//     lastName: (name) => nameValidation("Last Name", name),
//     email: emailValidation,
//     age: ageValidation,
// };

module.exports = {
    nameValidation,
    emailValidation,
    passwordValidation,
    requestedValue,
    textValidation,
    numberValidation,
};

/*

1- prendere tutti i valori di form
2- prima di avviare submit il check deve gia essere fatto
3- in caso di errore gli allert vengono mostrati e nessuna richiesta o reload vengono eseguiti, il form resta invariato

2.1- l'oggetto viene inviato in una funzione che gestisce i vari elementi
2.2- ogni valore viene mandato alla validation adeguata (es. nome, number, email) 
2.3- ognuna di queste validation torna il valore, se corretto, oppure un errore + message
2.4- la funzione principale riceve i vari risultati e ricostruisce l'oggetto con i valori (forse non serve visto che vanno giá bene i valori del form stesso)
2.5- costruisce un secondo oggetto con gli errori, se presenti
2.6- in questo caso ritorna al component del form due cose: error = true & errorsObj
2.7- il form se non riceve error = true fa andare next(values), altrimenti no: mostra gli errori ai rispettivi input fields

2.1b.1- potrei evitare la funzione che gestisce l'oggetto, spedendo ogni input alla funzione corrispondente dal component, ricevendo per ognuna l'ok o l'errore
2.1b.2- poi nel component faccio un check degli errori prima di mavviare il submit

*/
