import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Diseases = () => {
  const [name, setName] = useState('');
  const [token, setToken] = useState('');
  const [expired, setExpired] = useState('');
  const [diseases, setDiseases] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    refreshToken();
    getDiseases();
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

  const deleteDisease = async (slug) => {
    await axiosJWT.delete(`http://localhost:5000/admin/diseases/${slug}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    getDiseases();
  };

  return (
    <>
      <Navbar />
      <section style={{ minHeight: '100vh' }}>
        <div className='container mt-5'>
          <h1 className='has-text-centered is-size-3 has-text-weight-bold'>
            Diseases List
          </h1>
          <div class='container m-3 has-text-right has-text-centered-mobile'>
            <Link to='/diseases-add' class='button is-primary'>
              Add Disease
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
              {diseases.map((disease, index) => (
                <tr key={disease.id}>
                  <th>{index + 1}</th>
                  <td>{disease.name}</td>
                  <td>{disease.other_name}</td>
                  <td>{disease.slug}</td>
                  <td>
                    <Link
                      to={`/diseases-edit/${disease.slug}`}
                      className='button is-info m-1'
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteDisease(disease.slug)}
                      className='button is-danger m-1'
                    >
                      Delete
                    </button>
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

export default Diseases;
