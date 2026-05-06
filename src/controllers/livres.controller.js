import livresModel from '../models/livres.model.js';

const listerLivres = async (req, res) => {
    // si le parametre tous=true est passe, on retourne tous les livres
    // sinon, on retourne seulement les livres disponibles
    const tous = req.query.tous === 'true';

    try {
        const livres = await livresModel.getLivres(req.bibliothequeId, tous);
        res.send({ livres: livres });
    } catch (erreur) {
        console.log('Erreur : ', erreur);
        res.status(500);
        res.send({ erreur: "Echec lors de la récupération des livres" });
    }
};

const trouverUnLivre = async (req, res) => {
    const id = req.params.id;
    if (!id) {
        res.status(400);
        res.send({ erreur: "L'id du livre est obligatoire" });
        return;
    }
    if (parseInt(id) <= 0) {
        res.status(400);
        res.send({ erreur: "L'id doit être supérieur à 0" });
        return;
    }

    try {
        const livre = await livresModel.getLivreById(id, req.bibliothequeId);

        if (livre === null) {
            res.status(404);
            res.send({ erreur: `Livre introuvable avec l'id ${id}` });
            return;
        }
        res.send(livre);
    } catch (erreur) {
        console.log('Erreur : ', erreur);
        res.status(500);
        res.send({ erreur: `Echec lors de la récupération du livre avec l'id ${id}` });
    }
};

const ajouterLivre = async (req, res) => {
    const titre = req.body.titre;
    const auteur = req.body.auteur;
    const isbn = req.body.isbn;
    const bibliothequeId = req.bibliothequeId;
    const champsManquants = [];
    if (titre === undefined || titre === null) {
        champsManquants.push('titre');
    }
    if (auteur === undefined || auteur === null) {
        champsManquants.push('auteur');
    }
    if (isbn === undefined || isbn === null) {
        champsManquants.push('isbn');
    }
    if (champsManquants.length > 0) {
        res.status(400);
        res.send({erreur: "Le format des données est invalide", champ_manquant: champsManquants});
        return;
    }

    try {
        const ajout = await livresModel.creerLivre(bibliothequeId, titre, auteur, isbn);
        res.status(201);
        res.send({message: `Le livre ${titre} a été ajouté avec succès`, livre: {id: ajout.id, titre: titre, auteur: auteur, isbn: isbn}});
    } catch (erreur) {
        console.log('Erreur : ', erreur);
        res.status(500);
        res.send({ erreur: `Echec lors de l'ajout du livre ${titre}` });
    }
};

const modifierLivre = async (req, res) => {
    const id = req.params.id;
    const titre = req.body.titre;
    const auteur = req.body.auteur;
    const isbn = req.body.isbn;
    const bibliothequeId = req.bibliothequeId;
    if (!id) {
        res.status(400);
        res.send({ erreur: "L'id du livre est obligatoire" });
        return;
    }
    if (parseInt(id) <= 0) {
        res.status(400);
        res.send({ erreur: "L'id doit être supérieur à 0" });
        return;
    }
    const champsManquants = [];
    if (titre === undefined || titre === null) {
        champsManquants.push('titre');
    }
    if (auteur === undefined || auteur === null) {
        champsManquants.push('auteur');
    }
    if (isbn === undefined || isbn === null) {
        champsManquants.push('isbn');
    }
    if (champsManquants.length > 0) {
        res.status(400);
        res.send({erreur: "Le format des données est invalide", champ_manquant: champsManquants});
        return;
    }

    try {
        const modifie = await livresModel.modifierLivre(id, bibliothequeId, titre, auteur, isbn);
        if (modifie === false) {
            res.status(404);
            res.send({ erreur: `Livre introuvable avec l'id ${id}` });
            return;
        }
        res.send({ message: `Le livre id ${id} a été modifié avec succès` });
    } catch (erreur) {
        console.log('Erreur : ', erreur);
        res.status(500);
        res.send({ erreur: `Echec lors de la modification du livre id ${id}` });
    }
};

const modifierStatutLivre = async (req, res) => {
    const id = req.params.id;
    const bibliothequeId = req.bibliothequeId;
    const disponible = req.body.disponible;
    if (!id) {
        res.status(400);
        res.send({ erreur: "L'id du livre est obligatoire" });
        return;
    }
    if (parseInt(id) <= 0) {
        res.status(400);
        res.send({ erreur: "L'id doit être supérieur à 0" });
        return;
    }
    if (disponible === undefined || disponible === null) {
        res.status(400);
        res.send({ erreur: "Le champ disponible est obligatoire" });
        return;
    }
    try {
        const modifieStatut = await livresModel.modifierStatutLivre(id, bibliothequeId, disponible);
        if (modifieStatut === false) {
            res.status(404);
            res.send({ erreur: `Livre introuvable avec l'id ${id}` });
            return;
        }
        res.send({ message: `Le statut du livre id ${id} a été modifié avec succès` });
    } catch (erreur) {
        console.log('Erreur : ', erreur);
        res.status(500);
        res.send({ erreur: `Echec lors de la modification du statut du livre id ${id}` });
    }
};

const supprimerLivre = async (req, res) => {
    const id = req.params.id;
    if (!id) {
        res.status(400);
        res.send({ erreur: "L'id du livre est obligatoire" });
        return;
    }
    if (parseInt(id) <= 0) {
        res.status(400);
        res.send({ erreur: "L'id doit être supérieur à 0" });
        return;
    }

    try {
        const supprime = await livresModel.supprimerLivre(id, req.bibliothequeId);
        if (supprime === false) {
            res.status(404);
            res.send({ erreur: `Livre introuvable avec l'id ${id}` });
            return;
        }
        res.send({ message: `Le livre id ${id} a été supprimé avec succès` });
    } catch (erreur) {
        console.log('Erreur : ', erreur);
        res.status(500);
        res.send({ erreur: `Echec lors de la suppression du livre id ${id}` });
    }
};

export {listerLivres, trouverUnLivre, ajouterLivre, modifierLivre, modifierStatutLivre, supprimerLivre};