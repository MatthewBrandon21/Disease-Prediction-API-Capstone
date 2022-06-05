import React, { useState, useEffect } from 'react';
import Footer from './Footer';
import Navbar from './Navbar';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { GiMagnifyingGlass } from 'react-icons/gi';
import { FaTimesCircle } from 'react-icons/fa';

const DiseasesDetail = () => {
  const [name, setName] = useState('');
  const [diseaseName, setDiseaseName] = useState('');
  const [other_name, setOther_name] = useState('');
  const [description, setDescription] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [image, setImage] = useState('');
  const [drugs, setDrugs] = useState([]);
  const [file, setFile] = useState('');
  const [token, setToken] = useState('');
  const [expired, setExpired] = useState('');
  const navigate = useNavigate();
  const { slug } = useParams();
  const parse = require('html-react-parser');

  useEffect(() => {
    refreshToken();
    getDiseasesBySlug();
    getDrugBydiseases();
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

  const getDiseasesBySlug = async () => {
    const response = await axiosJWT.get(
      `http://localhost:5000/admin/diseases/${slug}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setDiseaseName(response.data.name);
    setOther_name(response.data.other_name);
    setDescription(response.data.description);
    setExcerpt(response.data.excerpt);
    setImage(response.data.img);
  };

  const getDrugBydiseases = async () => {
    const response = await axiosJWT.get(
      `http://localhost:5000/diseases-drugs/diseases/${slug}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setDrugs(response.data);
  };

  const deleteDrug = async (slug) => {
    await axiosJWT.delete(
      `http://localhost:5000/admin/diseases-drugs/${slug}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    getDrugBydiseases();
  };

  return (
    <>
      <Navbar />
      <section className='mx-6 mt-6' style={{ minHeight: '100vh' }}>
        <section className='section is-medium'>
          <div className='columns'>
            <div className='column'>
              <h1 className='title'>
                {diseaseName} <span className='is-size-5'>({other_name})</span>
              </h1>
              <h2 className='subtitle'>{excerpt}</h2>
              <Link to={`/diseases-edit/${slug}`} className='button is-primary'>
                Edit Disease
              </Link>
            </div>
            <div className='column'>
              <figure class='image is-16by9 is-640x360'>
                <img src={image} alt={diseaseName} />
              </figure>
            </div>
          </div>
        </section>
        <div className='container mt-5'>{parse(description)}</div>
        <div className='container mt-6'>
          {' '}
          <h2 className='has-text-centered is-size-4 has-text-weight-bold'>
            Drugs list
          </h2>
          <p className='has-text-centered'>{`(${drugs.length} data)`}</p>
          <div className='container m-3 has-text-right has-text-centered-mobile'>
            <Link
              to={`/diseases-drugs-add/${slug}`}
              className='button is-primary'
            >
              Add Drug
            </Link>
          </div>
        </div>
        <div className='container mt-5'>
          {drugs.length === 0 ? (
            'No drugs found'
          ) : (
            <table className='table is-striped is-fullwidth is-hoverable mt-6 mb-6'>
              <thead>
                <tr>
                  <th>Disease</th>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tfoot>
                <tr>
                  <th>Disease</th>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Action</th>
                </tr>
              </tfoot>
              <tbody>
                {drugs.map((drug, index) => (
                  <tr key={drug.id}>
                    <td>{drug.diseases_name}</td>
                    <td>{drug.name}</td>
                    <td>{drug.slug}</td>
                    <td>
                      <Link
                        to={`/drugs-details/${drug.slug}`}
                        className='button is-info m-1'
                      >
                        <GiMagnifyingGlass />
                      </Link>
                      <button
                        onClick={() => deleteDrug(drug.slug)}
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

export default DiseasesDetail;
