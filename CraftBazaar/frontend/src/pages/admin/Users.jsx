import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Users() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get('http://localhost:5000/user/')
            .then((res) => {
                setUsers(res.data.users);
            })
            .catch((err) => {
                console.log(err);
                setError(err.response?.data?.Error || "Error fetching users");
            });
    }, []);

    return (
        <div className="container mt-5">
            <h2 className="mb-4 text-center fw-bold">Registered Users</h2>
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="row">
                {users.map((user) => (
                    <div key={user._id} className="col-md-4 mb-4">
                        <div className="card shadow-sm rounded border-0">
                            <div className="card-body">
                                <h5 className="card-title fw-semibold">{user.username}</h5>
                                <p className="card-text mb-1"><strong>Email:</strong> {user.email}</p>
                                <p className="card-text mb-1"><strong>Phone:</strong> {user.phone}</p>
                                {user.address && <p className="card-text"><strong>Address:</strong> {user.address}</p>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Users;
