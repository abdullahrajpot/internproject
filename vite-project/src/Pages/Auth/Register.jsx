import React, { useState } from 'react';
import { Input, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { UserOutlined, MailOutlined } from '@ant-design/icons';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log("registered")
    // Validation
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post("http://localhost:5000/api/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success("User Registered successful!");
      navigate("/");

    } catch (err) {
      console.error("Registration error:", err);
      toast.error("registration failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-screen w-full flex justify-center items-center bg-[#111827] overflow-hidden">
      <form onSubmit={handleSubmit} className="relative border border-gray-300 text-gray-700 py-6 px-8 bg-white rounded-2xl w-[350px] shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Register</h1>

        <div className="mb-4">
          <label htmlFor="name">Name</label>
          <Input 
            name="name" 
            type="text" 
            value={form.name} 
            onChange={handleChange} 
            suffix={<UserOutlined />}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email">Email</label>
          <Input 
            name="email" 
            type="email" 
            value={form.email} 
            onChange={handleChange} 
            suffix={<MailOutlined />}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password">Password</label>
          <Input.Password 
            name="password" 
            value={form.password} 
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <Input.Password 
            name="confirmPassword" 
            value={form.confirmPassword} 
            onChange={handleChange}
            required
          />
        </div>

        <button 
          type="submit" 
          className="bg-orange-500 text-white py-2 w-full rounded-full disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-center mt-4 text-sm text-gray-600">
          Already have an account? <Link to="/auth" className="text-orange-500 font-semibold">Login</Link>
        </p>
      </form>
    </div>
  );
}