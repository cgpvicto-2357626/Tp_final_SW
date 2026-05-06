import pool from '../config/db_pg.js';

const getLivres = async (bibliothequeId, tous) => {
    let requete = `SELECT * FROM livres WHERE bibliotheque_id = $1`;
    const params = [bibliothequeId];
    if (!tous) { // si tous est false, on ajoute le filtre pour seulement les livres disponibles
        requete += ` AND disponible = true`;
    }

    try {
        const resultat = await pool.query(requete, params);
        return resultat.rows;
    } catch (erreur) {
        console.log(`Erreur, code: ${erreur.code} : ${erreur.message}`);
        throw erreur;
    }
};

const getLivreById = async (id, bibliothequeId) => {
    const requete = `SELECT * FROM livres WHERE id = $1 AND bibliotheque_id = $2 LIMIT 1`;
    const params = [id, bibliothequeId];

    try {
        const resultat = await pool.query(requete, params);
        if (resultat.rows.length === 0) {
            return null;
        }
        const livre = resultat.rows[0];
        const requetePrets = `SELECT * FROM prets WHERE livre_id = $1`;
        // on recupere l'historique des prets pour ce livre
        const resultatPrets = await pool.query(requetePrets, [id]);
        livre.prets = resultatPrets.rows;
        return livre;
    } catch (erreur) {
        console.log(`Erreur, code: ${erreur.code} : ${erreur.message}`);
        throw erreur;
    }
};

const creerLivre = async (bibliothequeId, titre, auteur, isbn) => {
    const requete = `INSERT INTO livres (bibliotheque_id, titre, auteur, isbn) VALUES ($1, $2, $3, $4) RETURNING id`;
    const params = [bibliothequeId, titre, auteur, isbn];

    try {
        const resultat = await pool.query(requete, params);
        return resultat.rows[0].id;
    } catch (erreur) {
        console.log(`Erreur, code: ${erreur.code} : ${erreur.message}`);
        throw erreur;
    }
};

const modifierLivre = async (id, bibliothequeId, titre, auteur, isbn) => {
    const requete = `UPDATE livres SET titre = $1, auteur = $2, isbn = $3 WHERE id = $4 AND bibliotheque_id = $5`;
    const params = [titre, auteur, isbn, id, bibliothequeId];

    try {
        const resultat = await pool.query(requete, params);
        if (resultat.rowCount === 0) {
            return false;
        }
        return true;
    } catch (erreur) {
        console.log(`Erreur, code: ${erreur.code} : ${erreur.message}`);
        throw erreur;
    }
};

const modifierStatutLivre = async (id, bibliothequeId, disponible) => {
    const requete = `UPDATE livres SET disponible = $1 WHERE id = $2 AND bibliotheque_id = $3`;
    const params = [disponible, id, bibliothequeId];

    try {
        const resultat = await pool.query(requete, params);
        if (resultat.rowCount === 0) {
            return false;
        }
        return true;
    } catch (erreur) {
        console.log(`Erreur, code: ${erreur.code} : ${erreur.message}`);
        throw erreur;
    }
};

const supprimerLivre = async (id, bibliothequeId) => {
    const requete = `DELETE FROM livres WHERE id = $1 AND bibliotheque_id = $2`;
    const params = [id, bibliothequeId];

    try {
        const resultat = await pool.query(requete, params);
        if (resultat.rowCount === 0) {
            return false;
        }
        return true;
    } catch (erreur) {
        console.log(`Erreur, code: ${erreur.code} : ${erreur.message}`);
        throw erreur;
    }
};

export default {getLivres, getLivreById, creerLivre, modifierLivre, modifierStatutLivre, supprimerLivre };