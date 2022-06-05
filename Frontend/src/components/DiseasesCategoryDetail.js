import React, { useState, useEffect } from 'react';
import Footer from './Footer';
import Navbar from './Navbar';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { GiMagnifyingGlass } from 'react-icons/gi';
import { FaTimesCircle } from 'react-icons/fa';

const DiseasesCategoryDetail = () => {
  const [name, setName] = useState('');
  const [diseaseCategoryName, setDiseaseCategoryName] = useState('');
  const [description, setDescription] = useState('');
  const [diseases, setDiseases] = useState([]);
  const [token, setToken] = useState('');
  const [expired, setExpired] = useState('');
  const navigate = useNavigate();
  const { slug } = useParams();

  useEffect(() => {
    refreshToken();
    getDiseasesCategoryBySlug();
    getDiseasesBycategory();
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

  const getDiseasesCategoryBySlug = async () => {
    const response = await axiosJWT.get(
      `http://localhost:5000/admin/diseases-category/${slug}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setDiseaseCategoryName(response.data[0].name);
    setDescription(response.data[0].description);
  };

  const getDiseasesBycategory = async () => {
    const response = await axiosJWT.get(
      `http://localhost:5000/admin/diseases-category-link/${slug}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setDiseases(response.data);
  };

  const deleteDisease = async (id) => {
    await axiosJWT.delete(
      `http://localhost:5000/admin/diseases-category-link/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    getDiseasesBycategory();
  };

  return (
    <>
      <Navbar />
      <section className='mx-6 mt-6' style={{ minHeight: '100vh' }}>
        <section className='section is-medium'>
          <div className='columns'>
            <div className='column'>
              <h1 className='title'>{diseaseCategoryName}</h1>
              <h2 className='subtitle'>{description}</h2>
              <Link
                to={`/diseases-category-edit/${slug}`}
                className='button is-primary'
              >
                Edit Disease Category
              </Link>
            </div>
          </div>
        </section>
        <div className='container mt-6'>
          {' '}
          <h2 className='has-text-centered is-size-4 has-text-weight-bold'>
            Diseases list
          </h2>
          <p className='has-text-centered'>{`(${diseases.length} data)`}</p>
          <div className='container m-3 has-text-right has-text-centered-mobile'>
            <Link
              to={`/diseases-category-link-add/${slug}`}
              className='button is-primary'
            >
              Add Diseases
            </Link>
          </div>
        </div>
        <div className='container mt-5'>
          {diseases.length === 0 ? (
            'No disease found'
          ) : (
            <table className='table is-striped is-fullwidth is-hoverable mt-6 mb-6'>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tfoot>
                <tr>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Action</th>
                </tr>
              </tfoot>
              <tbody>
                {diseases.map((disease, index) => (
                  <tr key={disease.id}>
                    <td>{disease.disease_name}</td>
                    <td>{disease.disease_slug}</td>
                    <td>
                      <Link
                        to={`/diseases-details/${disease.disease_slug}`}
                        className='button is-info m-1'
                      >
                        <GiMagnifyingGlass />
                      </Link>
                      <button
                        onClick={() => deleteDisease(disease.id)}
                        className='button is-danger m-1'
                      >
                        <FaTimesCircle />
                      </button>
                    </td>
                  </tr>
                ))}{' '}
              </tbody>
            </table>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default DiseasesCategoryDetail;
