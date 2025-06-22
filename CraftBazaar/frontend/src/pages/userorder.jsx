import axios from 'axios';
import React, { useEffect, useState } from 'react';

function UserOrders() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('userToken');
        axios
            .get('http://localhost:5000/orders/user', {
                headers: { Authorization: token },
            })
            .then((res) => setOrders(res.data))
            .catch((err) => console.error(err));
    }, []);

    return (
        <div className="container p-3">
            <h2 className="text-center mb-4">Your Orders</h2>
            {orders.length === 0 ? (
                <h5 className="text-center text-muted">No Orders Found</h5>
            ) : (
                orders.map((order, index) => (
                    <div key={order._id} className="card mb-3 shadow-sm">
                        <div className="card-body">
                            <h5>Order #{index + 1}</h5>
                            <p>Status: <strong>{order.status}</strong></p>
                            <p>Payment Mode: <strong>{order.paymentMode || 'N/A'}</strong></p>
                            <ul className="list-group mb-2">
                                {order.items.map((item, i) => (
                                    <li key={i} className="list-group-item d-flex justify-content-between">
                                        <div>{item.name} (x{item.quantity})</div>
                                        <div>₹ {(item.price * item.quantity).toFixed(2)}</div>
                                    </li>
                                ))}
                            </ul>
                            <div>Total Bill: ₹{order.totalBill.toFixed(2)}</div>
                            <small className="text-muted">Ordered on: {new Date(order.orderDate).toLocaleString()}</small>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default UserOrders;
