"use client"
import { useState } from "react";
import styles from "./register_module.css";
import axios from "axios";

export default function REGISTER() {
  const [registerTUPCID, setRegisterTUPCID] = useState("");
  const [registerUSERNAME, setRegisterUSERNAME] = useState("");
  const [registerPASSWORD, setRegisterPASSWORD] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  const register = () => {
    axios({
      method: "post",
      data: {
        TUPCID: registerTUPCID,
        USERNAME: registerUSERNAME,
        PASSWORD: registerPASSWORD,
        ROLES: selectedRole 
      },
      withCredentials: true,
      url: "http://localhost:3001/register"
    })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  return (
    <div className={styles.reg}>
      <h1>REGISTRATION PAGE</h1>
      <p>ROLE:</p>
      <select
        value={selectedRole}
        onChange={(e) => setSelectedRole(e.target.value)}
      >
        <option value="STUDENT">STUDENT</option>
        <option value="FACULTY">FACULTY</option>
        <option value="ADMIN">ADMIN</option>
      </select>
      <p>TUPC ID</p>
      <input
        type="text"
        name="TUPCID"
        onChange={(e) => setRegisterTUPCID(e.target.value)}
      ></input>
      <p>USERNAME</p>
      <input
        type="text"
        name="username"
        onChange={(e) => setRegisterUSERNAME(e.target.value)}
      ></input>
      <div></div>
      <p>PASSWORD</p>
      <input
        type="password"
        name="password"
        onChange={(e) => setRegisterPASSWORD(e.target.value)}
      ></input>
      <div></div>
      <p></p>
      <button onClick={register}>REGISTER</button>
      <p></p>
      <a href="/">BACK</a>
    </div>
  );
}
