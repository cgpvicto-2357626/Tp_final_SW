import { creerBibliotheque, getBibliothequeParCourriel } from '../models/bibliotheque.model.js';

const inscription = async (req, res) => {
    const nom = req.body.nom;
    const courriel = req.body.courriel;
    const password = req.body.password;
    const champsManquants = [];
    if (nom === undefined || nom === null) {
        champsManquants.push('nom');
    }
    if (courriel === undefined || courriel === null) {
        champsManquants.push('courriel');
    }
    if (password === undefined || password === null) {
        champsManquants.push('password');
    }
    if (champsManquants.length > 0) {
        res.status(400);
        res.send({erreur: "Le format des données est invalide", champ_manquant: champsManquants});
        return;
    }

    try {
        const cleApi = await creerBibliotheque(nom, courriel, password);
        res.status(201);
        res.send({ message: `La bibliothèque ${nom} a été créée avec succès`, cle_api: cleApi});
    } catch (erreur) {
        console.log('Erreur : ', erreur);
        res.status(500);
        res.send({ erreur: "Echec lors de la création de la bibliothèque" });
    }
};

const recupererCleApi = async (req, res) => {
    const courriel = req.body.courriel;
    const password = req.body.password;
    let nouvelleCle;
    if (req.query.nouvelle === 'true') {
        nouvelleCle = true; 
    } else {
        nouvelleCle = false; 
    }    
    const champsManquants = [];
    if (courriel === undefined || courriel === null) {
        champsManquants.push('courriel');
    }
    if (password === undefined || password === null) {
        champsManquants.push('password');
    }
    if (champsManquants.length > 0) {
        res.status(400);
        res.send({erreur: "Le format des données est invalide", champ_manquant: champsManquants});
        return;
    }

    try {
        const cleApi = await getBibliothequeParCourriel(courriel, password, nouvelleCle);
        if (cleApi === null) {
            res.status(401);
            res.send({ erreur: "Courriel ou mot de passe invalide" });
            return;
        }
        res.send({ cle_api: cleApi });
    } catch (erreur) {
        console.log('Erreur : ', erreur);
        res.status(500);
        res.send({ erreur: "Echec lors de la récupération de la clé api" });
    }
};

export {inscription, recupererCleApi};