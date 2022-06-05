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

const pageSize = 30;
const Diseases = () => {
  const [name, setName] = useState('');
  const [token, setToken] = useState('');
  const [expired, setExpired] = useState('');
  const [diseases, setDiseases] = useState([]);
  const [paginatedDiseases, setPaginatedDiseases] = useState([]);
  const [filterDiseases, setFilterDiseases] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
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
    setPaginatedDiseases(_(response.data).slice(0).take(pageSize).value());
  };

  const deleteDisease = async (slug) => {
    await axiosJWT.delete(`http://localhost:5000/admin/diseases/${slug}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    getDiseases();
  };

  const pageCount = diseases ? Math.ceil(diseases.length / pageSize) : 0;
  if (pageCount === 1) return null;
  const pages = _.range(1, pageCount + 1);

  const pagination = (pageNo) => {
    setCurrentPage(pageNo);
    const startIndex = (pageNo - 1) * pageSize;
    const paginatedDiseases = _(diseases)
      .slice(startIndex)
      .take(pageSize)
      .value();
    setPaginatedDiseases(paginatedDiseases);
  };

  const filterData = (e) => {
    if (e.target.value !== '') {
      setSearch(e.target.value);
      const filterTable = diseases.filter(
        (o) =>
          o['name'].toLowerCase().includes(e.target.value.toLowerCase()) ||
          o['other_name']
            .toLowerCase()
            .includes(e.target.value.toLowerCase()) ||
          o['slug'].toLowerCase().includes(e.target.value.toLowerCase())
      );
      setFilterDiseases([...filterTable]);
    } else {
      setSearch(e.target.value);
      setDiseases([...diseases]);
    }
  };

  return (
    <>
      <Navbar />
      <section className='mx-6 mt-6' style={{ minHeight: '100vh' }}>
        <div className='container mt-5'>
          <h1 className='has-text-centered is-size-3 has-text-weight-bold'>
            Diseases List
          </h1>
          <p className='has-text-centered'>{`(${diseases.length} data)`}</p>
          <div className='container m-3 has-text-right has-text-centered-mobile'>
            <Link to='/diseases-add' className='button is-primary'>
              Add Disease
            </Link>
          </div>
          <input
            className='input m-4'
            type='text'
            placeholder='Search..'
            value={search}
            onChange={filterData}
          ></input>
          {!paginatedDiseases ? (
            'No data found'
          ) : (
            <table className='table is-striped is-fullwidth is-hoverable mt-6 mb-6'>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Other Name</th>
                  <th>Slug</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tfoot>
                <tr>
                  <th>Name</th>
                  <th>Other Name</th>
                  <th>Slug</th>
                  <th>Action</th>
                </tr>
              </tfoot>
              <tbody>
                {search.length > 0
                  ? filterDiseases.map((disease, index) => (
                      <tr key={disease.id}>
                        <td>{disease.name}</td>
                        <td>{disease.other_name}</td>
                        <td>{disease.slug}</td>
                        <td>
                          <Link
                            to={`/diseases-details/${disease.slug}`}
                            className='button is-info m-1'
                          >
                            <GiMagnifyingGlass />
                          </Link>
                          <Link
                            to={`/diseases-edit/${disease.slug}`}
                            className='button is-warning m-1'
                          >
                            <FaEdit />
                          </Link>
                          <button
                            onClick={() => deleteDisease(disease.slug)}
                            className='button is-danger m-1'
                          >
                            <FaTimesCircle />
                          </button>
                        </td>
                      </tr>
                    ))
                  : paginatedDiseases.map((disease, index) => (
                      <tr key={disease.id}>
                        <td>{disease.name}</td>
                        <td>{disease.other_name}</td>
                        <td>{disease.slug}</td>
                        <td>
                          <Link
                            to={`/diseases-details/${disease.slug}`}
                            className='button is-info m-1'
                          >
                            <GiMagnifyingGlass />
                          </Link>
                          <Link
                            to={`/diseases-edit/${disease.slug}`}
                            className='button is-warning m-1'
                          >
                            <FaEdit />
                          </Link>
                          <button
                            onClick={() => deleteDisease(disease.slug)}
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

export default Diseases;
