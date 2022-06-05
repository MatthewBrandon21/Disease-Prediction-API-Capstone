import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AddDiseases from './components/AddDiseases';
import AddDiseasesCategory from './components/AddDiseasesCategory';
import AddDiseasesCategoryLink from './components/AddDiseasesCategoryLink';
import AddDiseasesDrugs from './components/AddDiseasesDrugs';
import AddDrugs from './components/AddDrugs';
import Dashboard from './components/Dashboard';
import Diseases from './components/Diseases';
import DiseasesCategory from './components/DiseasesCategory';
import DiseasesCategoryDetail from './components/DiseasesCategoryDetail';
import DiseasesDetail from './components/DiseasesDetail';
import Drugs from './components/Drugs';
import DrugsDetail from './components/DrugsDetail';
import EditDiseases from './components/EditDiseases';
import EditDiseasesCategory from './components/EditDiseasesCategory';
import EditDrugs from './components/EditDrugs';
import Login from './components/Login';
import Register from './components/Register';
import Users from './components/Users';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path='/' element={<Login />}></Route>
        <Route path='/register' element={<Register />}></Route>
        <Route path='/dashboard' element={<Dashboard />}></Route>
        <Route path='/users' element={<Users />}></Route>
        <Route path='/diseases' element={<Diseases />}></Route>
        <Route path='/diseases-add' element={<AddDiseases />}></Route>
        <Route path='/diseases-edit/:slug' element={<EditDiseases />}></Route>
        <Route
          path='/diseases-details/:slug'
          element={<DiseasesDetail />}
        ></Route>
        <Route path='/diseases-category' element={<DiseasesCategory />}></Route>
        <Route
          path='/diseases-category-add'
          element={<AddDiseasesCategory />}
        ></Route>
        <Route
          path='/diseases-category-edit/:slug'
          element={<EditDiseasesCategory />}
        ></Route>
        <Route
          path='/diseases-category-details/:slug'
          element={<DiseasesCategoryDetail />}
        ></Route>
        <Route
          path='/diseases-category-link-add/:slug'
          element={<AddDiseasesCategoryLink />}
        ></Route>
        <Route
          path='/diseases-drugs-add/:slug'
          element={<AddDiseasesDrugs />}
        ></Route>
        <Route path='/drugs' element={<Drugs />}></Route>
        <Route path='/drugs-add' element={<AddDrugs />}></Route>
        <Route path='/drugs-edit/:slug' element={<EditDrugs />}></Route>
        <Route path='/drugs-details/:slug' element={<DrugsDetail />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
