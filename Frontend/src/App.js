import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AddDiseases from './components/AddDiseases';
import Dashboard from './components/Dashboard';
import Diseases from './components/Diseases';
import Drugs from './components/Drugs';
import EditDiseases from './components/EditDiseases';
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
        <Route path='/disease-categories' element={<Dashboard />}></Route>
        <Route path='/drugs' element={<Drugs />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
