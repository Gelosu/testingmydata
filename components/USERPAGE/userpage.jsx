"use client"

import styles from './userpage_module.css';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function UserPage() {
  const [USERNAME, setUSERNAME] = useState('');
  const [userData, setUserData] = useState([]);
  const [updatedUsername, setUpdatedUsername] = useState('');
  const [updatedPassword, setUpdatedPassword] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    userpage();
    fetchUserData();
  }, []);

  const userpage = () => {
    axios({
      method: 'get',
      withCredentials: true,
      url: 'http://localhost:3001/userpage'
    })
      .then((res) => {
        if (res.data.USERNAME) {
          setUSERNAME(res.data.USERNAME);
        } else {
          console.log('Username not found');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchUserData = () => {
    axios({
      method: 'get',
      withCredentials: true,
      url: 'http://localhost:3001/allUserData'
    })
      .then((res) => {
        if (res.data) {
          setUserData(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteUser = (TUPCID) => {
    axios({
      method: 'delete',
      withCredentials: true,
      url: `http://localhost:3001/userData/${TUPCID}`
    })
      .then((res) => {
        console.log(res.data);
        fetchUserData();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const updateUser = (TUPCID) => {
    const updatedUser = {
      USERNAME: updatedUsername,
      PASSWORD: updatedPassword
    };

    axios({
      method: 'put',
      withCredentials: true,
      url: `http://localhost:3001/updateUserData/${TUPCID}`,
      data: updatedUser
    })
      .then((res) => {
        console.log(res.data);
        fetchUserData();
        setUpdatedUsername('');
        setUpdatedPassword('');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const filteredUsers = userData.filter((user) =>
    user.USERNAME.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.log}>
      <h1>ADMIN DATABASE </h1>
      <h2>WELCOME TO THIS PAGE...</h2>
      <h3>ADMIN: {USERNAME}</h3>

      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search by Username"
      />

      <h5>ALL DATA IN MYSQL:</h5>
      {filteredUsers.map((user, index) => (
        <div key={index}>
          <p>TUPCID: {user.TUPCID}</p>
          <p>USERNAME: {user.USERNAME}</p>
          <p>PASSWORD: {user.PASSWORD}</p>
          <p>ROLE: {user.ROLES}</p> 
          <input
            type="text"
            value={updatedUsername}
            onChange={(e) => setUpdatedUsername(e.target.value)}
            placeholder="Update Username"
          />
          <input
            type="password"
            value={updatedPassword}
            onChange={(e) => setUpdatedPassword(e.target.value)}
            placeholder="Update Password"
          />
          <button onClick={() => updateUser(user.TUPCID)}>Update</button>
          <button onClick={() => deleteUser(user.TUPCID)}>Delete</button>
          <hr />
        </div>
      ))}
      <a href="/">Logout</a>
    </div>
  );
}
