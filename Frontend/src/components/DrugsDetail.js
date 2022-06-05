import React, { useState, useEffect } from 'react';
import Footer from './Footer';
import Navbar from './Navbar';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

const DrugsDetail = () => {
  const [name, setName] = useState('');
  const [drugName, setDrugName] = useState('');
  const [other_name, setOther_name] = useState('');
  const [description, setDescription] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [image, setImage] = useState('');
  const [token, setToken] = useState('');
  const [expired, setExpired] = useState('');
  const navigate = useNavigate();
  const { slug } = useParams();
  const parse = require('html-react-parser');

  useEffect(() => {
    refreshToken();
    getDrugsBySlug();
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

  const getDrugsBySlug = async () => {
    const response = await axiosJWT.get(
      `http://localhost:5000/admin/drugs/${slug}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setDrugName(response.data.name);
    setOther_name(response.data.other_name);
    setDescription(response.data.description);
    setExcerpt(response.data.excerpt);
    setImage(response.data.img);
  };

  return (
    <>
      <Navbar />
      <section className='mx-6 mt-6' style={{ minHeight: '100vh' }}>
        <section className='section is-medium'>
          <div className='columns'>
            <div className='column'>
              <h1 className='title'>
                {drugName} <span className='is-size-5'>({other_name})</span>
              </h1>
              <h2 className='subtitle'>{excerpt}</h2>
              <Link to={`/drugs-edit/${slug}`} className='button is-primary'>
                Edit Drug
              </Link>
            </div>
            <div className='column'>
              <figure class='image is-16by9 is-640x360'>
                <img src={image} alt={drugName} />
              </figure>
            </div>
          </div>
        </section>
        <div className='container mt-5 mb-6'>{parse(description)}</div>
      </section>
      <Footer />
    </>
  );
};

export default DrugsDetail;
