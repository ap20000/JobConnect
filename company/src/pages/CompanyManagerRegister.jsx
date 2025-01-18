import React, { useState } from 'react';
import axios from 'axios';

const CompanyManagerRegister = () => {
    const [formData, setFormData] = useState({
        name: '',
        userName: '',
        email: '',
        password: '',
        location: '',
        
        companyRole: 'job_creator', // Only option is job creator
    });

    const { name, userName, email, password, location,  companyRole } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            const body = JSON.stringify(formData);

            const res = await axios.post("http://localhost:3001/user/register", body, config);

            console.log(res.data);
            alert('User registered successfully');
        } catch (err) {
            console.error(err.response.data);
            alert('Error registering user');
        }
    };

    return (
        <div>
            <h1>Register Company Manager</h1>
            <form onSubmit={onSubmit}>
                <div>
                    <label>Name</label>
                    <input type="text" name="name" value={name} onChange={onChange} required />
                </div>
                <div>
                    <label>Username</label>
                    <input type="text" name="userName" value={userName} onChange={onChange} required />
                </div>
                <div>
                    <label>Email</label>
                    <input type="email" name="email" value={email} onChange={onChange} required />
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" name="password" value={password} onChange={onChange} required />
                </div>
                <div>
                    <label>Location</label>
                    <input type="text" name="location" value={location} onChange={onChange} />
                </div>
                
                <div>
                    <label>Company Role</label>
                    <input type="text" name="companyRole" value={companyRole} readOnly />
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default CompanyManagerRegister;