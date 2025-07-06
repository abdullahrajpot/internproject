import React from 'react'
import { Input } from 'antd'
import { Link } from 'react-router-dom'
import { CloseOutlined, UserOutlined } from '@ant-design/icons';
import { User } from 'lucide-react';


export default function Login() {
    return (
        <>

            <div
                className="relative h-screen w-full flex justify-center items-center bg-[#111827] overflow-hidden"
            >
                {/* Glowing Circles */}
                <div className="absolute -top-32 -left-32 w-96 h-96 bg-orange-500 rounded-full opacity-20 blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-orange-500 rounded-full opacity-20 blur-3xl pointer-events-none"></div>

                {/* Login Form */}
                <form className="relative border border-gray-300 text-gray-700 py-6 px-8 bg-white rounded-2xl w-[350px] shadow-lg">
                    <Link to="/" className="absolute top-4 right-5 text-gray-600 text-lg">
                        <CloseOutlined />
                    </Link>

                    <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Login</h1>

                    <div className="mb-4">
                        <label htmlFor="email" className="text-sm font-medium block mb-1">Email address</label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            style={{ height: '45px', borderRadius: '12px' }}
                            suffix={<UserOutlined style={{ color: '#aaa' }} />}
                        />
                    </div>

                    <div className="mb-4 relative">
                        <label htmlFor="password" className="text-sm font-medium block mb-1">Password</label>
                        <Link to="/auth/forgot-password" className="absolute right-0 top-0 text-sm">Forgot Password</Link>
                        <Input.Password
                            id="password"
                            name="password"
                            style={{ height: '45px', borderRadius: '12px' }}
                        />
                    </div>

                    <div className="text-center mt-6">
                        <button
                            type="submit"
                            className="bg-orange-500 hover:bg-orange-600 text-white w-full py-3 rounded-full font-semibold transition-transform duration-300 hover:scale-105 shadow-md"
                        >
                            Login
                        </button>
                    </div>

                    <p className="text-sm text-center text-gray-600 mt-6">
                        Don't have an account? <Link to="/auth/register" className="text-orange-500 font-medium">Register</Link>
                    </p>
                </form>
            </div>

        </>
    )
}
