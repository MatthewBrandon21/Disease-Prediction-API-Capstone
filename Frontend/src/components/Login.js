import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope } from 'react-icons/fa';
import { FaLock } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const Auth = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/adminlogin', {
        email: email,
        password: password,
      });
      navigate('/dashboard');
    } catch (error) {
      if (error.response) {
        setMsg('Login failed');
      }
    }
  };

  return (
    <section className='hero has-background-dark is-fullheight is-fullwidth'>
      <div className='hero-body'>
        <div className='container'>
          <div className='columns is-centered'>
            <div className='column is-4-desktop'>
              <form onSubmit={Auth} className='box'>
                <h1 className='has-text-centered is-size-5'>
                  <strong>Diseases Prediction Admin Panel</strong>
                </h1>
                <p className='has-text-centered'>{msg}</p>
                <div className='field mt-5'>
                  <label className='label'>Email</label>
                  <p className='control has-icons-left has-icons-right'>
                    <input
                      type='text'
                      className='input'
                      placeholder='Email'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <span className='icon is-small is-left'>
                      <FaEnvelope />
                    </span>
                  </p>
                </div>
                <div className='field mt-5'>
                  <label className='label'>Password</label>
                  <p className='control has-icons-left'>
                    <input
                      type='password'
                      className='input'
                      placeholder='Password'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <span className='icon is-small is-left'>
                      <FaLock />
                    </span>
                  </p>
                </div>
                <div className='field mt-5'>
                  <button className='button is-info is-fullwidth'>Login</button>
                </div>
                <div className='field mt-5'>
                  <p className='has-text-centered'>
                    Don't have an account? <a href='/register'>Register</a>
                  </p>
                </div>
                <div className='field mt-5'>
                  <p className='has-text-centered is-size-7'>
                    Team C22-PS048 - Bangkit 2022
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
