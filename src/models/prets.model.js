import pool from '../config/db_pg.js';

const getPretById = async (pretId) => {
    const requete = `SELECT * FROM prets WHERE id = $1 LIMIT 1`;
    const params = [pretId];

    try {
        const resultat = await pool.query(requete, params);
        if (resultat.rows.length === 0) {
            return null;
        }
        return resultat.rows[0];
    } catch (erreur) {
        console.log(`Erreur, code: ${erreur.code} : ${erreur.message}`);
        throw erreur;
    }
};

const creerPret = async (livreId, emprunteur, dateRetour) => {
    const requete = `INSERT INTO prets (livre_id, emprunteur, date_retour, statut) VALUES ($1, $2, $3, $4) RETURNING id`;
    const params = [livreId, emprunteur, dateRetour, 'actif'];

    try {
        const resultat = await pool.query(requete, params);
        return resultat.rows[0].id;
    } catch (erreur) {
        console.log(`Erreur, code: ${erreur.code} : ${erreur.message}`);
        throw erreur;
    }
};

const modifierPret = async (pretId, emprunteur, dateRetour) => {
    const requete = `UPDATE prets SET emprunteur = $1, date_retour = $2 WHERE id = $3`;
    const params = [emprunteur, dateRetour, pretId];

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

const modifierStatutPret = async (pretId, status) => {
    const requete = `UPDATE prets SET statut = $1 WHERE id = $2`;
    const params = [status, pretId];

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

const supprimerPret = async (pretId) => {
    const requete = `DELETE FROM prets WHERE id = $1`;
    const params = [pretId];

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

export default {getPretById, creerPret, modifierPret, modifierStatutPret, supprimerPret };