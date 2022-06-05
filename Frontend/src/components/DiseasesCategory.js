import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { GiMagnifyingGlass } from 'react-icons/gi';
import { FaEdit } from 'react-icons/fa';
import { FaTimesCircle } from 'react-icons/fa';

const pageSize = 5;
const DiseasesCategory = () => {
  const [name, setName] = useState('');
  const [token, setToken] = useState('');
  const [expired, setExpired] = useState('');
  const [diseasesCategory, setDiseasesCategory] = useState([]);
  const [paginatedDiseasesCategory, setPaginatedDiseasesCategory] = useState(
    []
  );
  const [filterDiseasesCategory, setFilterDiseasesCategory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    refreshToken();
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
    setPaginatedDiseasesCategory(
      _(response.data).slice(0).take(pageSize).value()
    );
  };

  const deleteDiseaseCategory = async (slug) => {
    await axiosJWT.delete(
      `http://localhost:5000/admin/diseases-category/${slug}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    getDiseasesCategory();
  };

  const pageCount = diseasesCategory
    ? Math.ceil(diseasesCategory.length / pageSize)
    : 0;
  if (pageCount === 1) return null;
  const pages = _.range(1, pageCount + 1);

  const pagination = (pageNo) => {
    setCurrentPage(pageNo);
    const startIndex = (pageNo - 1) * pageSize;
    const paginatedDiseasesCategory = _(diseasesCategory)
      .slice(startIndex)
      .take(pageSize)
      .value();
    setPaginatedDiseasesCategory(paginatedDiseasesCategory);
  };

  const filterData = (e) => {
    if (e.target.value !== '') {
      setSearch(e.target.value);
      const filterTable = diseasesCategory.filter(
        (o) =>
          o['name'].toLowerCase().includes(e.target.value.toLowerCase()) ||
          o['slug'].toLowerCase().includes(e.target.value.toLowerCase())
      );
      setFilterDiseasesCategory([...filterTable]);
    } else {
      setSearch(e.target.value);
      setDiseasesCategory([...diseasesCategory]);
    }
  };

  return (
    <>
      <Navbar />
      <section className='mx-6 mt-6' style={{ minHeight: '100vh' }}>
        <div className='container mt-5'>
          <h1 className='has-text-centered is-size-3 has-text-weight-bold'>
            Diseases Category List
          </h1>
          <p className='has-text-centered'>{`(${diseasesCategory.length} data)`}</p>
          <div className='container m-3 has-text-right has-text-centered-mobile'>
            <Link to='/diseases-category-add' className='button is-primary'>
              Add Disease Category
            </Link>
          </div>
          <input
            className='input m-4'
            type='text'
            placeholder='Search..'
            value={search}
            onChange={filterData}
          ></input>
          {!paginatedDiseasesCategory ? (
            'No data found'
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
                {search.length > 0
                  ? filterDiseasesCategory.map((diseaseCategory, index) => (
                      <tr key={diseaseCategory.id}>
                        <td>{diseaseCategory.name}</td>
                        <td>{diseaseCategory.slug}</td>
                        <td>
                          <Link
                            to={`/diseases-category-details/${diseaseCategory.slug}`}
                            className='button is-info m-1'
                          >
                            <GiMagnifyingGlass />
                          </Link>
                          <Link
                            to={`/diseases-category-edit/${diseaseCategory.slug}`}
                            className='button is-warning m-1'
                          >
                            <FaEdit />
                          </Link>
                          <button
                            onClick={() =>
                              deleteDiseaseCategory(diseaseCategory.slug)
                            }
                            className='button is-danger m-1'
                          >
                            <FaTimesCircle />
                          </button>
                        </td>
                      </tr>
                    ))
                  : paginatedDiseasesCategory.map((diseaseCategory, index) => (
                      <tr key={diseaseCategory.id}>
                        <td>{diseaseCategory.name}</td>
                        <td>{diseaseCategory.slug}</td>
                        <td>
                          <Link
                            to={`/diseases-category-details/${diseaseCategory.slug}`}
                            className='button is-info m-1'
                          >
                            <GiMagnifyingGlass />
                          </Link>
                          <Link
                            to={`/diseases-category-edit/${diseaseCategory.slug}`}
                            className='button is-warning m-1'
                          >
                            <FaEdit />
                          </Link>
                          <button
                            onClick={() =>
                              deleteDiseaseCategory(diseaseCategory.slug)
                            }
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
          {search > 0 ? (
            <div></div>
          ) : (
            <nav
              className='pagination is-centered mb-6'
              role='navigation'
              aria-label='pagination'
            >
              <ul className='pagination-list'>
                {pages.map((page) => (
                  <li key={page} className='mb-3'>
                    <a
                      href='#pagination'
                      className={
                        page === currentPage
                          ? 'pagination-link is-current'
                          : 'pagination-link'
                      }
                      aria-label='Page 1'
                      aria-current='page'
                      onClick={() => pagination(page)}
                    >
                      {page}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
};

export default DiseasesCategory;
