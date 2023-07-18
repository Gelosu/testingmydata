"use client"

import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './profpage_module.css';

export default function PROFPAGE() {
  const [USERNAME, setUSERNAME] = useState('');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = () => {
    axios({
      method: 'get',
      withCredentials: true,
      url: 'http://localhost:3001/profpage'
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

  return (
    <div className={styles.profpage}>
      <h1>STUDENT PAGE</h1>
      <h2>WELCOME TO PROFESSOR  PAGE....</h2>
      <h3>NAME: {USERNAME}</h3>
      <a href="/login">LOGOUT</a>
    </div>
  );
}
