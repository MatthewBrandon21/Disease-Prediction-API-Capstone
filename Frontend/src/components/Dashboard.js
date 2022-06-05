import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [name, setName] = useState('');
  const [token, setToken] = useState('');
  const [expired, setExpired] = useState('');
  const [users, setUsers] = useState([]);
  const [diseases, setDiseases] = useState([]);
  const [drugs, setDrugs] = useState([]);
  const [diseasesCategory, setDiseasesCategory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    refreshToken();
    getUsers();
    getDiseases();
    getDrugs();
    getDiseasesCategory();
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.get('http://localhost:5000/token');
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
      setName(decoded.name);
      setExpired(decoded.exp);
    } catch (error) {
      if (error.response) {
        navigate('/');
      }
    }
  };

  const axiosJWT = axios.create();

  axiosJWT.interceptors.request.use(
    async (config) => {
      const currentDate = new Date();
      if (expired * 1000 < currentDate.getTime()) {
        const response = await axios.get('http://localhost:5000/token');
        config.headers.Authorization = `Bearer ${response.data.accessToken}`;
        setToken(response.data.accessToken);
        const decoded = jwt_decode(response.data.accessToken);
        setName(decoded.name);
        setExpired(decoded.exp);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const getUsers = async () => {
    const response = await axiosJWT.get('http://localhost:5000/users', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setUsers(response.data);
  };

  const getDiseases = async () => {
    const response = await axiosJWT.get(
      'http://localhost:5000/admin/diseases',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setDiseases(response.data);
  };

  const getDrugs = async () => {
    const response = await axiosJWT.get('http://localhost:5000/admin/drugs', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setDrugs(response.data);
  };

  const getDiseasesCategory = async () => {
    const response = await axiosJWT.get(
      'http://localhost:5000/admin/diseases-category',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setDiseasesCategory(response.data);
  };

  return (
    <>
      <Navbar />
      <section className='mx-6	mb-6' style={{ minHeight: '100vh' }}>
        <div className='container mt-6 has-text-centered'>
          <h1 className='is-size-3'>Welcome Back!</h1>
          <h2>{name}</h2>
        </div>
        <div className='container'>
          <div className='is-centered columns mt-6 has-text-centered'>
            <div className='column'>
              <div className='box has-background-info'>
                <h2 className='is-size-5 has-text-weight-bold'>
                  {users.length}
                </h2>
                <p>Users</p>
              </div>
            </div>
            <div className='column'>
              <div className='box has-background-success'>
                <h2 className='is-size-5 has-text-weight-bold'>
                  {diseases.length}
                </h2>
                <p>Diseases</p>
              </div>
            </div>
            <div className='column'>
              <div className='box has-background-warning'>
                <h2 className='is-size-5 has-text-weight-bold'>
                  {drugs.length}
                </h2>
                <p>Drugs</p>
              </div>
            </div>
            <div className='column'>
              <div className='box has-background-primary'>
                <h2 className='is-size-5 has-text-weight-bold'>
                  {diseasesCategory.length}
                </h2>
                <p>Diseases Category</p>
              </div>
            </div>
          </div>
          <div className='box mt-6'>
            <h2 className='is-size-5 has-text-weight-bold'>
              Api Documentation
            </h2>
            <a
              className='button mt-3'
              href='https://github.com/MatthewBrandon21/Disease-Prediction-API-Capstone'
            >
              {' '}
              Github{' '}
            </a>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Dashboard;
