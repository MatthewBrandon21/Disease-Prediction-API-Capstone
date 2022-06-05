import React, { useState, useEffect } from 'react';
import Footer from './Footer';
import Navbar from './Navbar';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { useNavigate, useParams } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const EditDrugs = () => {
  const [name, setName] = useState('');
  const [drugName, setDrugName] = useState('');
  const [other_name, setOther_name] = useState('');
  const [description, setDescription] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [image, setImage] = useState('');
  const [file, setFile] = useState('');
  const [token, setToken] = useState('');
  const [expired, setExpired] = useState('');
  const navigate = useNavigate();
  const { slug } = useParams();

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

  const UpdateDrug = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', drugName);
    formData.append('other_name', other_name);
    formData.append('description', description);
    formData.append('excerpt', excerpt);
    await axiosJWT.patch(
      `http://localhost:5000/admin/drugs/${slug}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'content-type': 'multipart/form-data',
        },
      }
    );
    navigate('/drugs');
  };

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

  const handleFile = (e) => {
    let file = e.target.files[0];
    setFile(file);
    console.log(file);
  };

  return (
    <>
      <Navbar />
      <section className='mx-6 mt-6' style={{ minHeight: '100vh' }}>
        <div className='container mt-5'>
          <h1 className='has-text-centered is-size-3 has-text-weight-bold'>
            Edit Drug
          </h1>
          <div>
            <form onSubmit={UpdateDrug}>
              <div className='field'>
                <label className='label'>Name</label>
                <input
                  className='input'
                  type='text'
                  placeholder='Name'
                  value={drugName}
                  onChange={(e) => setDrugName(e.target.value)}
                />
              </div>
              <div className='field'>
                <label className='label'>English Name</label>
                <input
                  className='input'
                  type='text'
                  placeholder='English Name'
                  value={other_name}
                  onChange={(e) => setOther_name(e.target.value)}
                />
              </div>
              <div className='field'>
                <label className='label'>Description</label>
                <CKEditor
                  editor={ClassicEditor}
                  data={description}
                  onChange={(event, editor) => setDescription(editor.getData())}
                />
                <label className='label mt-3'>Preview Description</label>
                <textarea
                  className='input'
                  type='text'
                  placeholder='Description'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className='field'>
                <label className='label'>Excerpt</label>
                <input
                  className='input'
                  type='text'
                  placeholder='Excerpt'
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                />
              </div>
              <div className='field'>
                <label className='label'>Old Photo</label>
                <figure class='image is-16by9 is-640x360'>
                  <img src={image} alt='haha' />
                </figure>
              </div>
              <div className='field'>
                <label className='label'>Image</label>
                <input
                  type='file'
                  name='file'
                  onChange={(e) => handleFile(e)}
                />
              </div>
              <div className='field  mt-6'>
                <button className='button is-danger'>Update</button>
              </div>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default EditDrugs;
