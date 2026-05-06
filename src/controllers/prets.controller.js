import pretsModel from '../models/prets.model.js';
import livresModel from '../models/livres.model.js';

const ajouterPret = async (req, res) => {
    const livreId = req.params.livreId;
    const emprunteur = req.body.emprunteur;
    const dateRetour = req.body.date_retour;
    if (!livreId) {
        res.status(400);
        res.send({ erreur: "L'id du livre est obligatoire" });
        return;
    }
    if (parseInt(livreId) <= 0) {
        res.status(400);
        res.send({ erreur: "L'id doit être supérieur à 0" });
        return;
    }
    const champsManquants = [];
    if (emprunteur === undefined || emprunteur === null) {
        champsManquants.push('emprunteur');
    }
    if (dateRetour === undefined || dateRetour === null) {
        champsManquants.push('date_retour');
    }
    if (champsManquants.length > 0) {
        res.status(400);
        res.send({erreur: "Le format des données est invalide", champ_manquant: champsManquants});
        return;
    }

    try {
        const livre = await livresModel.getLivreById(livreId, req.bibliothequeId);
        if (livre === null) {
            res.status(404);
            res.send({ erreur: `Livre introuvable avec l'id ${livreId}` });
            return;
        }
        const nouveauId = await pretsModel.creerPret(livreId, emprunteur, dateRetour);
        res.status(201);
        res.send({ message: `Le prêt a été ajouté avec succès`, pret: {id: nouveauId, livre_id: parseInt(livreId), emprunteur: emprunteur, date_retour: dateRetour}});
    } catch (erreur) {
        console.log('Erreur : ', erreur);
        res.status(500);
        res.send({ erreur: "Echec lors de l'ajout du prêt" });
    }
};

const modifierPret = async (req, res) => {
    const pretId = req.params.pretId;
    const emprunteur = req.body.emprunteur;
    const dateRetour = req.body.date_retour;
    if (!pretId) {
        res.status(400);
        res.send({ erreur: "L'id du prêt est obligatoire" });
        return;
    }
    if (parseInt(pretId) <= 0) {
        res.status(400);
        res.send({ erreur: "L'id doit être supérieur à 0" });
        return;
    }
    const champsManquants = [];
    if (emprunteur === undefined || emprunteur === null) {
        champsManquants.push('emprunteur');
    }
    if (dateRetour === undefined || dateRetour === null) {
        champsManquants.push('date_retour');
    }
    if (champsManquants.length > 0) {
        res.status(400);
        res.send({ erreur: "Le format des données est invalide", champ_manquant: champsManquants});
        return;
    }

    try {
        const pret = await pretsModel.getPretById(pretId);
        if (pret === null) {
            res.status(404);
            res.send({ erreur: `Prêt introuvable avec l'id ${pretId}` });
            return;
        }
        await pretsModel.modifierPret(pretId, emprunteur, dateRetour);
        res.send({ message: `Le prêt id ${pretId} a été modifié avec succès` });
    } catch (erreur) {
        console.log('Erreur : ', erreur);
        res.status(500);
        res.send({ erreur: `Echec lors de la modification du prêt id ${pretId}` });
    }
};

const modifierStatutPret = async (req, res) => {
    const pretId = req.params.pretId;
    const statut = req.body.statut;
    if (!pretId) {
        res.status(400);
        res.send({ erreur: "L'id du prêt est obligatoire" });
        return;
    }
    if (parseInt(pretId) <= 0) {
        res.status(400);
        res.send({ erreur: "L'id doit être supérieur à 0" });
        return;
    }

    if (statut === undefined || statut === null) {
        res.status(400);
        res.send({ erreur: "Le champ statut est obligatoire" });
        return;
    }
    if (statut !== 'actif' && statut !== 'retourné') {
        res.status(400);
        res.send({ erreur: "Le statut doit être 'actif' ou 'retourné'" });
        return;
    }

    try {
        const pret = await pretsModel.getPretById(pretId);
        if (pret === null) {
            res.status(404);
            res.send({ erreur: `Prêt introuvable avec l'id ${pretId}` });
            return;
        }
        await pretsModel.modifierStatutPret(pretId, statut);
        res.send({ message: `Le statut du prêt id ${pretId} a été modifié avec succès` });
    } catch (erreur) {
        console.log('Erreur : ', erreur);
        res.status(500);
        res.send({ erreur: `Echec lors de la modification du statut du prêt id ${pretId}` });
    }
};

const supprimerPret = async (req, res) => {
    const pretId = req.params.pretId;
    if (!pretId) {
        res.status(400);
        res.send({ erreur: "L'id du prêt est obligatoire" });
        return;
    }
    if (parseInt(pretId) <= 0) {
        res.status(400);
        res.send({ erreur: "L'id doit être supérieur à 0" });
        return;
    }

    try {
        const pret = await pretsModel.getPretById(pretId);
        if (pret === null) {
            res.status(404);
            res.send({ erreur: `Prêt introuvable avec l'id ${pretId}` });
            return;
        }
        await pretsModel.supprimerPret(pretId);
        res.send({ message: `Le prêt id ${pretId} a été supprimé avec succès` });
    } catch (erreur) {
        console.log('Erreur : ', erreur);
        res.status(500);
        res.send({ erreur: `Echec lors de la suppression du prêt id ${pretId}` });
    }
};

export {ajouterPret, modifierPret, modifierStatutPret, supprimerPret};