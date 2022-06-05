import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import _ from 'lodash';

const Users = () => {
  const [name, setName] = useState('');
  const [token, setToken] = useState('');
  const [expired, setExpired] = useState('');
  const [users, setUsers] = useState([]);
  const [filterUsers, setFilterUsers] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    refreshToken();
    getUsers();
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

  const getUsers = async () => {
    const response = await axiosJWT.get('http://localhost:5000/users', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setUsers(response.data);
  };

  const banUser = async (email) => {
    await axiosJWT.get(`http://localhost:5000/banuser/${email}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    getUsers();
  };

  const unbanUser = async (email) => {
    await axiosJWT.get(`http://localhost:5000/unbanuser/${email}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    getUsers();
  };

  const makeAdmin = async (email) => {
    await axiosJWT.get(`http://localhost:5000/makeadmin/${email}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    getUsers();
  };

  const makeUser = async (email) => {
    await axiosJWT.get(`http://localhost:5000/makeuser/${email}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    getUsers();
  };

  const filterData = (e) => {
    if (e.target.value !== '') {
      setSearch(e.target.value);
      const filterTable = users.filter(
        (o) =>
          o['name'].toLowerCase().includes(e.target.value.toLowerCase()) ||
          o['email'].toLowerCase().includes(e.target.value.toLowerCase()) ||
          o['username'].toLowerCase().includes(e.target.value.toLowerCase())
      );
      setFilterUsers([...filterTable]);
    } else {
      setSearch(e.target.value);
      setUsers([...users]);
    }
  };

  return (
    <>
      <Navbar />
      <section className='mx-6 mt-6' style={{ minHeight: '100vh' }}>
        <div className='container mt-5'>
          <h1 className='has-text-centered is-size-3 has-text-weight-bold'>
            User List
          </h1>
          <p className='has-text-centered'>{`(${users.length} data)`}</p>
          <input
            className='input m-4'
            type='text'
            placeholder='Search..'
            value={search}
            onChange={filterData}
          ></input>
          {!users ? (
            'No data found'
          ) : (
            <table className='table is-striped is-fullwidth is-hoverable mt-6 mb-6'>
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>email</th>
                  <th>username</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tfoot>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>email</th>
                  <th>username</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </tfoot>
              <tbody>
                {search.length > 0
                  ? filterUsers.map((user, index) => (
                      <tr key={user.id}>
                        <td>
                          <figure class='image is-64x64'>
                            <img
                              class='is-rounded'
                              src={user.img}
                              alt={user.name}
                            />
                          </figure>
                        </td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.username}</td>
                        <td>{user.role}</td>
                        <td>
                          {user.isactive === 1 ? (
                            <button
                              onClick={() => banUser(user.email)}
                              className='button is-warning m-1'
                            >
                              Ban
                            </button>
                          ) : (
                            <button
                              onClick={() => unbanUser(user.email)}
                              className='button is-danger m-1'
                            >
                              Unban
                            </button>
                          )}
                          {user.role === 'admin' ? (
                            <button
                              onClick={() => makeUser(user.email)}
                              className='button is-warning m-1'
                            >
                              Make User
                            </button>
                          ) : (
                            <button
                              onClick={() => makeAdmin(user.email)}
                              className='button is-danger m-1'
                            >
                              Make Admin
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  : users.map((user, index) => (
                      <tr key={user.id}>
                        <td>
                          <figure class='image is-64x64'>
                            <img
                              class='is-rounded'
                              src={user.img}
                              alt={user.name}
                            />
                          </figure>
                        </td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.username}</td>
                        <td>{user.role}</td>
                        <td>
                          {user.isactive === 1 ? (
                            <button
                              onClick={() => banUser(user.email)}
                              className='button is-warning m-1'
                            >
                              Ban
                            </button>
                          ) : (
                            <button
                              onClick={() => unbanUser(user.email)}
                              className='button is-danger m-1'
                            >
                              Unban
                            </button>
                          )}
                          {user.role === 'admin' ? (
                            <button
                              onClick={() => makeUser(user.email)}
                              className='button is-warning m-1'
                            >
                              Make User
                            </button>
                          ) : (
                            <button
                              onClick={() => makeAdmin(user.email)}
                              className='button is-danger m-1'
                            >
                              Make Admin
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Users;
