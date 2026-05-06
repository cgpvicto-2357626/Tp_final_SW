import express from 'express';
import { inscription, recupererCleApi } from '../controllers/bibliotheque.controller.js';

const router = express.Router();

router.post('/inscription', inscription);
router.post('/cle-api', recupererCleApi);

export default router;