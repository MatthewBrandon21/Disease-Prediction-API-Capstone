import express from 'express';
import Multer from 'multer';
import {
  getUsers,
  Register,
  Login,
  AndroidLogin,
  Logout,
  Update,
  UpdateProfilePicture,
  UpdatePassword,
  LoginAdmin,
  banUser,
  unbanUser,
  MakeAdmin,
  MakeUser,
} from '../controllers/Users.js';
import { verifyToken } from '../../middleware/VerifyToken.js';
import { verifyAdminToken } from '../../middleware/VerifyAdminToken.js';
import { refreshToken } from '../controllers/RefreshToken.js';
import { refreshTokenAndroid } from '../controllers/RefreshTokenAndroid.js';
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
import {
  adminGetAllDiseases,
  AdminGetDiseaseBySlug,
  AdminCreateDisease,
  AdminUpdateDisease,
  AdminDeleteDisease,
} from '../controllers/AdminDiseases.js';
import {
  adminGetAllDiseasesCategory,
  adminGetDiseasesCategoryBySlug,
  adminGetDiseasesCategoryLink,
  adminCreateDiseasesCategory,
  adminCreateDiseasesCategoryLink,
  adminUpdateDiseasesCategory,
  adminUpdateDiseasesCategoryLink,
  adminDeleteDiseasesCategory,
  adminDeleteDiseasesCategoryLink,
} from '../controllers/AdminDiseasesCategory.js';
import {
  Search,
  getDiseaseDrugBySlug,
  DiseaseDrug_drug,
  DiseaseDrug_drugSpesific,
  adminCreateDiseasesDrugs,
} from '../controllers/Search.js';

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
router.post('/login-app', AndroidLogin);
router.post('/adminlogin', LoginAdmin);
router.get('/token', refreshToken);
router.post('/token-app', refreshTokenAndroid);
router.delete('/logout', Logout);

router.get('/banuser/:email', verifyAdminToken, banUser);
router.get('/unbanuser/:email', verifyAdminToken, unbanUser);
router.get('/makeadmin/:email', verifyAdminToken, MakeAdmin);
router.get('/makeuser/:email', verifyAdminToken, MakeUser);

router.get('/diseases', verifyToken, getAllDiseases);
router.get('/diseases-category', verifyToken, getAllDiseasesCategory);
router.get('/diseases-category/:slug', verifyToken, getDiseasesCategoryLink);
router.get('/diseases/:slug', getDiseaseBySlug);
router.post('/diseases', verifyToken, SearchDiseases);

router.get('/drugs', verifyToken, getAllDrugs);
router.get('/drugs/:slug', verifyToken, getDrugBySlug);
router.post('/drugs', verifyToken, SearchDrugs);

router.post('/search', verifyToken, Search);
router.get('/diseases-drugs/:slug', verifyToken, getDiseaseDrugBySlug);
router.get('/diseases-drugs-drug/', verifyToken, DiseaseDrug_drug);
router.get(
  '/diseases-drugs/diseases/:slug',
  verifyToken,
  DiseaseDrug_drugSpesific
);

router.get('/admin/drugs', verifyAdminToken, adminGetAllDrugs);
router.get('/admin/drugs/:slug', verifyAdminToken, AdminGetDrugBySlug);
router.post(
  '/admin/drugs',
  multer.single('file'),
  verifyAdminToken,
  AdminCreateDrug
);
router.patch(
  '/admin/drugs/:slug',
  multer.single('file'),
  verifyAdminToken,
  AdminUpdateDrug
);
router.delete('/admin/drugs/:slug', verifyAdminToken, AdminDeleteDrug);

router.get('/admin/diseases', verifyAdminToken, adminGetAllDiseases);
router.get('/admin/diseases/:slug', verifyAdminToken, AdminGetDiseaseBySlug);
router.post(
  '/admin/diseases',
  multer.single('file'),
  verifyAdminToken,
  AdminCreateDisease
);
router.patch(
  '/admin/diseases/:slug',
  multer.single('file'),
  verifyAdminToken,
  AdminUpdateDisease
);
router.delete('/admin/diseases/:slug', verifyAdminToken, AdminDeleteDisease);

router.get(
  '/admin/diseases-category',
  verifyAdminToken,
  adminGetAllDiseasesCategory
);
router.get(
  '/admin/diseases-category/:slug',
  verifyAdminToken,
  adminGetDiseasesCategoryBySlug
);
router.post(
  '/admin/diseases-category',
  verifyAdminToken,
  adminCreateDiseasesCategory
);
router.patch(
  '/admin/diseases-category/:slug',
  verifyAdminToken,
  adminUpdateDiseasesCategory
);
router.delete(
  '/admin/diseases-category/:slug',
  verifyAdminToken,
  adminDeleteDiseasesCategory
);

router.get(
  '/admin/diseases-category-link/:slug',
  verifyAdminToken,
  adminGetDiseasesCategoryLink
);
router.post(
  '/admin/diseases-category-link',
  verifyAdminToken,
  adminCreateDiseasesCategoryLink
);
router.patch(
  '/admin/diseases-category-link/:id',
  verifyAdminToken,
  adminUpdateDiseasesCategoryLink
);
router.delete(
  '/admin/diseases-category-link/:id',
  verifyAdminToken,
  adminDeleteDiseasesCategoryLink
);

router.post(
  '/admin/diseases-drugs',
  verifyAdminToken,
  adminCreateDiseasesDrugs
);

router.get('*', function (req, res) {
  res.status(404).send('404 Not Found');
});

export default router;
