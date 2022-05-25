import express from 'express';
import { getUsers, Register, Login, Logout } from '../controllers/Users.js';
import { verifyToken } from '../../middleware/VerifyToken.js';
import { refreshToken } from '../controllers/RefreshToken.js';
import {
  getAllDiseases,
  getAllDiseasesCategory,
  getDiseasesCategoryLink,
  getDiseaseBySlug,
} from '../controllers/Diseases.js';
import { getAllDrugs, getDrugBySlug } from '../controllers/Drugs.js';
import { Search, getDiseaseDrugBySlug } from '../controllers/Search.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Welcome to Disease Prediction API');
});
router.get('/users', verifyToken, getUsers);
router.post('/register', Register);
router.post('/login', Login);
router.get('/token', refreshToken);
router.delete('/logout', Logout);

router.get('/diseases', verifyToken, getAllDiseases);
router.get('/diseases-category', verifyToken, getAllDiseasesCategory);
router.get('/diseases-category/:slug', verifyToken, getDiseasesCategoryLink);
router.get('/diseases/:slug', verifyToken, getDiseaseBySlug);

router.get('/drugs', verifyToken, getAllDrugs);
router.get('/drugs/:slug', verifyToken, getDrugBySlug);

router.post('/search', verifyToken, Search);
router.get('/diseases-drugs/:slug', verifyToken, getDiseaseDrugBySlug);

export default router;
