import React, { useEffect, useState } from 'react';
import axios from 'axios';

function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [viewMode, setViewMode] = useState('list'); // list | details | update
    const [paymentMode, setPaymentMode] = useState('');
    const [status, setStatus] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = () => {
        axios.get('http://localhost:5000/orders/')
            .then((res) => setOrders(res.data))
            .catch((err) => console.error(err.response?.data || err.message));
    };

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setViewMode('details');
    };

    const handleUpdateView = (order) => {
        setSelectedOrder(order);
        setPaymentMode(order.paymentMode || 'Cash on Delivery');
        setStatus(order.status || 'pending');
        setViewMode('update');
    };

    const handleUpdateOrder = () => {
        axios.put(`http://localhost:5000/orders/update`, {
            orderId: selectedOrder._id,
            username: selectedOrder.recipient,
            email: selectedOrder.email,
            phone: selectedOrder.phone,
            address: selectedOrder.shippingAddress,
            pincode: selectedOrder.pincode,
            paymentMode,
            status
        })
            .then(() => {
                fetchOrders();
                setViewMode('list');
            })
            .catch((err) => console.error(err.response?.data || err.message));
    };

    const renderOrderList = () => (
        <div className="container mt-4">
            <h2 className="mb-4 fw-bold text-center">All Orders</h2>
            <div className="table-responsive">
                <table className="table table-striped table-hover align-middle">
                    <thead className="table-primary">
                        <tr>
                            <th>#</th>
                            <th>Recipient</th>
                            <th>Phone</th>
                            <th>Email</th>
                            <th>Address</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order, index) => (
                            <tr key={order._id}>
                                <td>{index + 1}</td>
                                <td>{order.recipient || 'N/A'}</td>
                                <td>{order.phone || 'N/A'}</td>
                                <td>{order.email || 'N/A'}</td>
                                <td>{order.shippingAddress || 'N/A'}</td>
                                <td>
                                    <button className="btn btn-info btn-sm me-2" onClick={() => handleViewDetails(order)}>Details</button>
                                    <button className="btn btn-primary btn-sm" onClick={() => handleUpdateView(order)}>Update</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderOrderDetails = () => (
        <div className="container mt-4">
            <button className="btn btn-secondary mb-3" onClick={() => setViewMode('list')}>← Back to Orders</button>
            <h2 className="fw-bold mb-3">Order Details</h2>
            <h5>Recipient: {selectedOrder.recipient}</h5>
            <p><strong>Phone:</strong> {selectedOrder.phone}</p>
            <p><strong>Email:</strong> {selectedOrder.email}</p>
            <p><strong>Address:</strong> {selectedOrder.shippingAddress}</p>
            <hr />
            <h5>Items:</h5>
            <ul className="list-group mb-3">
                {selectedOrder.items.map((item, index) => (
                    <li className="list-group-item d-flex justify-content-between align-items-center" key={index}>
                        {item.name} × {item.quantity}
                        <span className="fw-semibold">₹{item.price}</span>
                    </li>
                ))}
            </ul>
            <p><strong>GST:</strong> ₹{selectedOrder.gst}</p>
            <p><strong>Total Bill:</strong> ₹{selectedOrder.totalBill}</p>
            <p><strong>Payment Mode:</strong> {selectedOrder.paymentMode}</p>
            <p><strong>Status:</strong> <span className="badge bg-info text-dark">{selectedOrder.status}</span></p>
        </div>
    );

    const renderUpdateForm = () => (
        <div className="container mt-4">
            <button className="btn btn-secondary mb-3" onClick={() => setViewMode('list')}>← Back to Orders</button>
            <h2 className="fw-bold mb-3">Update Order</h2>
            <div className="mb-3">
                <label className="form-label">Payment Mode</label>
                <select className="form-select" value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)}>
                    <option value="Cash on Delivery">Cash on Delivery</option>
                    <option value="UPI">UPI</option>
                    <option value="Card">Card</option>
                </select>
            </div>
            <div className="mb-3">
                <label className="form-label">Order Status</label>
                <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>
            <button className="btn btn-success" onClick={handleUpdateOrder}>Update</button>
        </div>
    );

    return (
        <>
            {viewMode === 'list' && renderOrderList()}
            {viewMode === 'details' && selectedOrder && renderOrderDetails()}
            {viewMode === 'update' && selectedOrder && renderUpdateForm()}
        </>
    );
}

export default OrdersPage;
