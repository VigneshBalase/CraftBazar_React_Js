import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login({ refresh }) {
    const [showLogin, setShowLogin] = useState(true);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [username, setUsername] = useState('');
    const [phone, setPhone] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confPass, setConfPass] = useState('');

    const [regError, setRegError] = useState('');
    const [logError, setLogError] = useState('');

    const navigator = useNavigate();

    function handleRegister(e) {
        e.preventDefault();

        if (newPass !== confPass) {
            setRegError("Passwords do not match");
            return;
        }

        const formData = {
            username,
            email,
            phone,
            password: newPass,
        };

        axios
            .post("http://localhost:5000/user/register", formData)
            .then((res) => {
                alert('Registration successful!');
                setShowLogin(true);
            })
            .catch((err) => {
                setRegError(err?.response?.data?.Error || 'Registration failed');
            });
    }

    function handleLogin(e) {
        e.preventDefault();

        const formData = {
            email,
            password,
        };

        axios
            .post("http://localhost:5000/user/login", formData)
            .then((res) => {
                localStorage.setItem('userToken', res.data.token);
                if (email === 'admin@gmail.com') {
                    navigator('/admin');
                    localStorage.setItem('role', 'admin');
                } else {
                    navigator('/');
                }
                refresh();
            })
            .catch((err) => {
                setLogError(err?.response?.data?.Error || 'Login failed');
            });
    }

    return (
        <div className="container mt-5" style={{ maxWidth: "480px" }}>
            {showLogin ? (
                <div className="container p-5 bg-primary text-white rounded">
                    <h2 className="text-center">Login</h2>
                    <hr />
                    <form onSubmit={handleLogin}>
                        <div className="mb-3">
                            <label className="form-label" htmlFor="login-email">Email</label>
                            <input className="form-control" type="email" id="login-email" onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label" htmlFor="login-password">Password</label>
                            <input className="form-control" type="password" id="login-password" onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        {logError && <div className="mb-3 text-danger">{logError}</div>}
                        <div className="d-flex justify-content-end">
                            <button className="btn btn-light" type="submit">Login</button>
                        </div>
                    </form>
                    <hr />
                    <div className="flex-acenter gap-3">
                        <p className="m-0">Don't have an account?</p>
                        <button className="btn btn-success" onClick={() => setShowLogin(false)}>Register</button>
                    </div>
                </div>
            ) : (
                <div className="container p-5 bg-primary text-white rounded">
                    <h2 className="text-center">Register</h2>
                    <hr />
                    <form onSubmit={handleRegister}>
                        <div className="mb-3">
                            <label className="form-label" htmlFor="reg-username">Username</label>
                            <input className="form-control" type="text" id="reg-username" onChange={(e) => setUsername(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label" htmlFor="reg-email">Email</label>
                            <input className="form-control" type="email" id="reg-email" onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label" htmlFor="reg-phone">Phone</label>
                            <input className="form-control" type="number" id="reg-phone" onChange={(e) => setPhone(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label" htmlFor="reg-password">New Password</label>
                            <input className="form-control" type="password" id="reg-password" onChange={(e) => setNewPass(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label" htmlFor="reg-conf-password">Confirm Password</label>
                            <input className="form-control" type="password" id="reg-conf-password" onChange={(e) => setConfPass(e.target.value)} required />
                        </div>
                        {regError && <div className="mb-3 text-danger">{regError}</div>}
                        <div className="d-flex justify-content-end">
                            <button className="btn btn-light" type="submit">Register</button>
                        </div>
                    </form>
                    <hr />
                    <div className="flex-acenter gap-3">
                        <p className="m-0">Already have an account?</p>
                        <button className="btn btn-primary" onClick={() => setShowLogin(true)}>Login</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Login;
