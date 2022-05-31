import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Drugs = () => {
  const [name, setName] = useState('');
  const [token, setToken] = useState('');
  const [expired, setExpired] = useState('');
  const [drugs, setDrugs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    refreshToken();
    getDrugs();
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

  const getDrugs = async () => {
    const response = await axiosJWT.get('http://localhost:5000/admin/drugs', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setDrugs(response.data);
  };

  return (
    <>
      <Navbar />
      <section style={{ minHeight: '100vh' }}>
        <div className='container mt-5'>
          <h1 className='has-text-centered is-size-3 has-text-weight-bold'>
            Drugs List
          </h1>
          <div class='container m-3 has-text-right has-text-centered-mobile'>
            <Link to='/drugs-add' class='button is-primary'>
              Add Drug
            </Link>
          </div>
          <table className='table is-striped is-fullwidth is-hoverable mt-6 mb-6'>
            <thead>
              <tr>
                <th>No</th>
                <th>Name</th>
                <th>Other Name</th>
                <th>Slug</th>
                <th>Action</th>
              </tr>
            </thead>
            <tfoot>
              <tr>
                <th>No</th>
                <th>Name</th>
                <th>Other Name</th>
                <th>Slug</th>
                <th>Action</th>
              </tr>
            </tfoot>
            <tbody>
              {drugs.map((drug, index) => (
                <tr key={drug.id}>
                  <th>{index + 1}</th>
                  <td>{drug.name}</td>
                  <td>{drug.other_name}</td>
                  <td>{drug.slug}</td>
                  <td>
                    <button className='button is-info m-1'>Details</button>
                    <button className='button is-danger m-1'>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Drugs;
