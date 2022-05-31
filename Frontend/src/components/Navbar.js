import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isActive, setisActive] = React.useState(false);
  const navigate = useNavigate();

  const Logout = async () => {
    try {
      await axios.delete('http://localhost:5000/logout');
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav
      className='navbar is-dark'
      role='navigation'
      aria-label='main navigation'
    >
      <div className='container'>
        <div className='navbar-brand'>
          <Link className='navbar-item' to='/dashboard'>
            <h1>
              <strong>Diseases Prediction</strong>
            </h1>
          </Link>

          <button
            onClick={() => {
              setisActive(!isActive);
            }}
            className={`navbar-burger burger ${isActive ? 'is-active' : ''}`}
            aria-label='menu'
            aria-expanded='false'
            data-target='navbarBasicExample'
          >
            <span aria-hidden='true'></span>
            <span aria-hidden='true'></span>
            <span aria-hidden='true'></span>
          </button>
        </div>

        <div
          id='navbarBasicExample'
          className={`navbar-menu has-text-centered-mobile ${
            isActive ? 'is-active' : ''
          }`}
        >
          <div className='navbar-start'>
            <Link to='/dashboard' className='navbar-item'>
              Home
            </Link>
            <Link to='/users' className='navbar-item'>
              Users
            </Link>
            <Link to='/diseases' className='navbar-item'>
              Diseases
            </Link>
            <Link to='/diseases' className='navbar-item'>
              Disease Categories
            </Link>
            <Link to='/drugs' className='navbar-item'>
              Drugs
            </Link>
          </div>

          <div className='navbar-end'>
            <div className='navbar-item'>
              <div className='buttons is-justify-content-center'>
                <button onClick={Logout} className='button is-danger'>
                  Log Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
