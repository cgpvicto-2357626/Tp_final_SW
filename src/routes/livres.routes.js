import express from 'express';
import { listerLivres, trouverUnLivre, ajouterLivre, modifierLivre, modifierStatutLivre, supprimerLivre } from '../controllers/livres.controller.js';
import authentification from '../middlewares/auth.js';

const router = express.Router();

router.get('/', authentification, listerLivres);
router.get('/:id', authentification, trouverUnLivre);
router.post('/', authentification, ajouterLivre);
router.put('/:id', authentification, modifierLivre);
router.patch('/:id/statut', authentification, modifierStatutLivre);
router.delete('/:id', authentification, supprimerLivre);

export default router;