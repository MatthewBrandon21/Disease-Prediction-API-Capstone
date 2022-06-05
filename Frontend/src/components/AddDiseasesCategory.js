import React, { useState, useEffect } from 'react';
import Footer from './Footer';
import Navbar from './Navbar';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const AddDiseasesCategory = () => {
  const [name, setName] = useState('');
  const [diseaseCategoryName, setDiseaseCategoryName] = useState('');
  const [description, setDescription] = useState('');
  const [token, setToken] = useState('');
  const [expired, setExpired] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    refreshToken();
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

  const saveDiseaseCategory = async (e) => {
    e.preventDefault();
    await axiosJWT.post(
      'http://localhost:5000/admin/diseases-category',
      {
        name: diseaseCategoryName,
        description: description,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    navigate('/diseases-category');
  };

  return (
    <>
      <Navbar />
      <section className='mx-6 mt-6' style={{ minHeight: '100vh' }}>
        <div className='container mt-5'>
          <h1 className='has-text-centered is-size-3 has-text-weight-bold'>
            Add Disease Category
          </h1>
          <div>
            <form onSubmit={saveDiseaseCategory}>
              <div className='field'>
                <label className='label'>Name</label>
                <input
                  className='input'
                  type='text'
                  placeholder='Name'
                  required
                  value={diseaseCategoryName}
                  onChange={(e) => setDiseaseCategoryName(e.target.value)}
                />
              </div>
              <div className='field'>
                <label className='label'>Description</label>
                <textarea
                  className='input'
                  type='text'
                  placeholder='Description'
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className='field mt-6'>
                <button className='button is-danger'>Submit</button>
              </div>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default AddDiseasesCategory;
