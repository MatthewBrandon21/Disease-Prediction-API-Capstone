import express from 'express';
import Multer from 'multer';
import {
  getUsers,
  Register,
  Login,
  Logout,
  Update,
  UpdateProfilePicture,
  UpdatePassword,
} from '../controllers/Users.js';
import { verifyToken } from '../../middleware/VerifyToken.js';
import { verifyAdminToken } from '../../middleware/VerifyAdminToken.js';
import { refreshToken } from '../controllers/RefreshToken.js';
import {
  getAllDiseases,
  getAllDiseasesCategory,
  getDiseasesCategoryLink,
  getDiseaseBySlug,
  SearchDiseases,
} from '../controllers/Diseases.js';
import {
  getAllDrugs,
  getDrugBySlug,
  SearchDrugs,
} from '../controllers/Drugs.js';
import {
  adminGetAllDrugs,
  AdminGetDrugBySlug,
  AdminCreateDrug,
  AdminUpdateDrug,
  AdminDeleteDrug,
} from '../controllers/AdminDrugs.js';
import { Search, getDiseaseDrugBySlug } from '../controllers/Search.js';

const router = express.Router();

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.get('/', (req, res) => {
  res.send('Welcome to Disease Prediction API');
});
router.get('/users', verifyAdminToken, getUsers);
router.post('/user/update', verifyToken, Update);
router.post('/user/updatepassword', verifyToken, UpdatePassword);
router.post(
  '/user/update-profile-picture',
  multer.single('file'),
  verifyToken,
  UpdateProfilePicture
);
router.post('/register', Register);
router.post('/login', Login);
router.get('/token', refreshToken);
router.delete('/logout', Logout);

router.get('/diseases', verifyToken, getAllDiseases);
router.get('/diseases-category', verifyToken, getAllDiseasesCategory);
router.get('/diseases-category/:slug', verifyToken, getDiseasesCategoryLink);
router.get('/diseases/:slug', verifyToken, getDiseaseBySlug);
router.post('/diseases', verifyToken, SearchDiseases);

router.get('/drugs', verifyToken, getAllDrugs);
router.get('/drugs/:slug', verifyToken, getDrugBySlug);
router.post('/drugs', verifyToken, SearchDrugs);

router.post('/search', verifyToken, Search);
router.get('/diseases-drugs/:slug', verifyToken, getDiseaseDrugBySlug);

router.get('/admin/drugs', adminGetAllDrugs);
router.get('/admin/drugs/:slug', AdminGetDrugBySlug);
router.post('/admin/drugs', multer.single('file'), AdminCreateDrug);
router.patch('/admin/drugs/:slug', multer.single('file'), AdminUpdateDrug);
router.delete('/admin/drugs/:slug', AdminDeleteDrug);

router.get('*', function (req, res) {
  res.status(404).send('404 Not Found');
});

export default router;
