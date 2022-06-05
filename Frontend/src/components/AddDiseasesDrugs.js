import React, { useState, useEffect } from 'react';
import Footer from './Footer';
import Navbar from './Navbar';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { useNavigate, useParams } from 'react-router-dom';

const AddDiseasesDrugs = () => {
  const [name, setName] = useState('');
  const [diseaseName, setDiseaseName] = useState('');
  const [diseaseSlug, setDiseaseSlug] = useState('');
  const [drugName, setDrugName] = useState('');
  const [drugSlug, setDrugSlug] = useState('');
  const [drugs, setDrugs] = useState([]);
  const [token, setToken] = useState('');
  const [expired, setExpired] = useState('');
  const navigate = useNavigate();
  const { slug } = useParams();

  useEffect(() => {
    refreshToken();
    setDiseaseSlug(slug);
    getDiseases();
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

  const AddDiseaseCategory = async (e) => {
    e.preventDefault();
    await axiosJWT.post(
      `http://localhost:5000/admin/diseases-drugs`,
      {
        drugs_name: drugName,
        drugs_slug: drugSlug,
        diseases_name: diseaseName,
        diseases_slug: diseaseSlug,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    navigate(`/diseases-details/${slug}`);
  };

  const getDiseases = async () => {
    const response = await axiosJWT.get(
      `http://localhost:5000/admin/diseases/${slug}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setDiseaseName(response.data.name);
    setDiseaseSlug(response.data.slug);
  };

  const getDrugs = async () => {
    const response = await axiosJWT.get(`http://localhost:5000/admin/drugs`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setDrugs(response.data);
  };

  const onChangeDisesase = (e) => {
    drugs.map((drug, index) => {
      if (drug.slug === e) {
        setDrugName(drug.name);
      }
    });
    setDrugSlug(e);
  };

  return (
    <>
      <Navbar />
      <section className='mx-6 mt-6' style={{ minHeight: '100vh' }}>
        <div className='container mt-5'>
          <h1 className='has-text-centered is-size-3 has-text-weight-bold'>
            Add Drug to {diseaseName}
          </h1>
          <div>
            <form onSubmit={AddDiseaseCategory}>
              <div className='field'>
                <label className='label'>Drug</label>
                <div className='select'>
                  <select onChange={(e) => onChangeDisesase(e.target.value)}>
                    {drugs.map((drug, index) => (
                      <option value={drug.slug} key={index}>
                        {drug.name}
                      </option>
                    ))}
                  </select>
                </div>
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

export default AddDiseasesDrugs;
