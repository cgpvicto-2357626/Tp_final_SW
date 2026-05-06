import express from 'express';
import { ajouterPret, modifierPret, modifierStatutPret, supprimerPret } from '../controllers/prets.controller.js';
import authentification from '../middlewares/auth.js';

const router = express.Router();

router.post('/livres/:livreId/prets', authentification, ajouterPret);
router.put('/prets/:pretId', authentification, modifierPret);
router.patch('/prets/:pretId/statut', authentification, modifierStatutPret);
router.delete('/prets/:pretId', authentification, supprimerPret);

export default router;