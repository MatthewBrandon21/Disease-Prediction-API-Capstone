import React, { useState, useEffect } from 'react';
import Footer from './Footer';
import Navbar from './Navbar';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { useNavigate, useParams } from 'react-router-dom';

const AddDiseasesCategoryLink = () => {
  const [name, setName] = useState('');
  const [diseaseName, setDiseaseName] = useState('');
  const [diseaseSlug, setDiseaseSlug] = useState('');
  const [diseaseCategorySlug, setDiseaseCategorySlug] = useState('');
  const [diseases, setDiseases] = useState([]);
  const [token, setToken] = useState('');
  const [expired, setExpired] = useState('');
  const navigate = useNavigate();
  const { slug } = useParams();

  useEffect(() => {
    refreshToken();
    setDiseaseCategorySlug(slug);
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

  const AddDiseaseCategory = async (e) => {
    e.preventDefault();
    await axiosJWT.post(
      `http://localhost:5000/admin/diseases-category-link`,
      {
        disease_name: diseaseName,
        disease_slug: diseaseSlug,
        disease_category_slug: diseaseCategorySlug,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    navigate(`/diseases-category-details/${slug}`);
  };

  const getDiseases = async () => {
    const response = await axiosJWT.get(
      `http://localhost:5000/admin/diseases`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setDiseases(response.data);
  };

  const onChangeDisesase = (e) => {
    diseases.map((disease, index) => {
      if (disease.slug === e) {
        setDiseaseName(disease.name);
      }
    });
    setDiseaseSlug(e);
  };

  return (
    <>
      <Navbar />
      <section className='mx-6 mt-6' style={{ minHeight: '100vh' }}>
        <div className='container mt-5'>
          <h1 className='has-text-centered is-size-3 has-text-weight-bold'>
            Add Disease Category Link : {diseaseCategorySlug}
          </h1>
          <div>
            <form onSubmit={AddDiseaseCategory}>
              <div className='field'>
                <label className='label'>Disease</label>
                <div className='select'>
                  <select onChange={(e) => onChangeDisesase(e.target.value)}>
                    {diseases.map((disease, index) => (
                      <option value={disease.slug} key={index}>
                        {disease.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className='field'>
                <label className='label'>Diseases Category Slug</label>
                <input
                  className='input'
                  type='text'
                  placeholder='Name'
                  value={diseaseCategorySlug}
                  disabled
                />
              </div>
              <div className='field  mt-6'>
                <button className='button is-danger'>Add</button>
              </div>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default AddDiseasesCategoryLink;
