"use client"

import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './studentpage_module.css';

export default function STUDPAGE() {
  const [USERNAME, setUSERNAME] = useState('');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = () => {
    axios({
      method: 'get',
      withCredentials: true,
      url: 'http://localhost:3001/studpage'
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
    <div className={styles.studpage}>
      <h1>STUDENT PAGE</h1>
      <h2>WELCOME TO STUDENT PAGE....</h2>
      <h3>NAME: {USERNAME}</h3>
      <a href="/login">LOGOUT</a>
    </div>
  );
}
