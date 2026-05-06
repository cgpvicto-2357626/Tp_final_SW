import pool from '../config/db_pg.js';
import bcrypt from 'bcrypt';

export const validationCle = async (cleApi) => {
    const requete = `SELECT * FROM bibliotheque WHERE cle_api = $1 LIMIT 1`;
    const params = [cleApi];
    
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

export const creerBibliotheque = async (nom, courriel, password) => {
    const motDePasseHashe = await bcrypt.hash(password, 12);
    const cleApi = crypto.randomUUID();
    const requete = `INSERT INTO bibliotheque (nom, courriel, password, cle_api) VALUES ($1, $2, $3, $4)`;
    const params = [nom, courriel, motDePasseHashe, cleApi];

    try {
        await pool.query(requete, params);
        return cleApi;
    } catch (erreur) {
        console.log(`Erreur, code: ${erreur.code} : ${erreur.message}`);
        throw erreur;
    }
};

export const getBibliothequeParCourriel = async (courriel, motDePasse, nouvelleCle = false) => {
    const requete = `SELECT * FROM bibliotheque WHERE courriel = $1 LIMIT 1`;
    const params = [courriel];

    try {
        const resultat = await pool.query(requete, params);
        if (resultat.rows.length === 0) {
            return null;
        }
        const mdpValide = await bcrypt.compare(motDePasse, resultat.rows[0].password);
        if (!mdpValide) {
            return null;
        }
        if (nouvelleCle) {
            const nouvelleCleApi = crypto.randomUUID();
            const requeteUpdate = `UPDATE bibliotheque SET cle_api = $1 WHERE courriel = $2`;
            await pool.query(requeteUpdate, [nouvelleCleApi, courriel]);
            return nouvelleCleApi;
        }
        return resultat.rows[0].cle_api;
    } catch (erreur) {
        console.log(`Erreur, code: ${erreur.code} : ${erreur.message}`);
        throw erreur;
    }
};