import React, { useState } from 'react';
import { Input } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { CloseOutlined, UserOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useAuth } from '../../Contexts/AuthContext';
import { toast } from "react-toastify";
// import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const { data } = await axios.post("http://localhost:5000/api/auth/login", {
        email: form.email,
        password: form.password
      });

      login(data.user, data.token);
      toast.success("Login successful!");
      navigate("/");
    } catch (err) {
      toast.error("Login failed!");
    }
  };

  return (
    <div className="relative h-screen w-full flex justify-center items-center bg-[#111827] overflow-hidden">
      <form onSubmit={handleSubmit} className="relative border border-gray-300 text-gray-700 py-6 px-8 bg-white rounded-2xl w-[350px] shadow-lg">
        <Link to="/" className="absolute top-4 right-5 text-gray-600 text-lg">
          <CloseOutlined />
        </Link>
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Login</h1>

        <div className="mb-4">
          <label htmlFor="email">Email</label>
          <Input name="email" type="email" value={form.email} onChange={handleChange} suffix={<UserOutlined />} />
        </div>

        <div className="mb-6">
          <label htmlFor="password">Password</label>
          <Input.Password name="password" value={form.password} onChange={handleChange} />
        </div>

        <button type="submit" className="bg-orange-500 text-white py-2 w-full rounded-full">Login</button>

        <p className="text-center mt-4 text-sm text-gray-600">
          Don't have an account? <Link to="/auth/register" className="text-orange-500 font-semibold">Register</Link>
        </p>
      </form>
    </div>
  );
}
