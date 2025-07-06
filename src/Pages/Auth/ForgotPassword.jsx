import React from 'react';
import { Input } from 'antd';
import { Link } from 'react-router-dom';
import { CloseOutlined, LeftOutlined, MailOutlined } from '@ant-design/icons';

export default function ForgotPassword() {
  return (
    <div className="relative h-screen w-full flex justify-center items-center bg-[#111827] overflow-hidden">
    
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-orange-500 rounded-full opacity-20 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-orange-500 rounded-full opacity-20 blur-3xl pointer-events-none"></div>

      <form className="relative border border-gray-300 text-gray-700 py-6 px-8 bg-white rounded-2xl w-[350px] shadow-lg">
        <Link
          to="/auth"
          className="absolute top-4 left-5 text-gray-600 text-lg hover:text-orange-500 transition"
        >
          <LeftOutlined />
        </Link>
        <Link
          to="/"
          className="absolute top-4 right-5 text-gray-600 text-lg hover:text-orange-500 transition"
        >
          <CloseOutlined />
        </Link>

      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Forgot Password
        </h1>

        <div className="mb-6">
          <label htmlFor="email" className="text-sm font-medium block mb-1">
            Email address
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            style={{ height: '40px', borderRadius: '12px' }}
            suffix={<MailOutlined style={{ color: '#aaa' }} />}
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white w-full py-3 rounded-full font-semibold transition-transform duration-300 hover:scale-105 shadow-md"
          >
            Send
          </button>
        </div>

        <p className="text-sm text-center text-gray-600 mt-6">
          Don't have an account?{' '}
          <Link to="/auth/register" className="text-orange-500 font-medium">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
