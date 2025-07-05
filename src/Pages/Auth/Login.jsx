import React from 'react'
import { Input } from 'antd'
import { Link } from 'react-router-dom'
import { CloseOutlined,UserOutlined  } from '@ant-design/icons';
import { User } from 'lucide-react';


export default function Login() {
    return (
        <div style={{ backgroundColor: ' #111827', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

            <form className='border border-gray-500 text-gray-700 py-5 px-10 ' style={{ backgroundColor: '#fff', height: '500px', borderRadius: "20px", width: '350px', position: "relative" }}>

                <Link to='/' style={{ position: 'absolute', top: '15px', right: '20px', fontSize: '16px', color: "parrot" }}>
                    <CloseOutlined />
                </Link>


                <div className="mb-3">
                    <h1 className="text-4xl text-center py-5 font-bold mb-3">Login</h1>
                </div>

                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <Input type="email" name='email' id="email" aria-describedby="emailHelp" style={{ height: "45px", borderRadius: "15px" }} suffix={<UserOutlined style={{ color: '#aaa' }} />}  />
                </div>

                <div className="mb-3" style={{ position: "relative" }}>
                    <Link to='/auth/forgot-password' className='text-sm' style={{ position: "absolute", right: "0", textDecoration: "none" }}>Forgot Password</Link>
                    <label htmlFor="password" className="form-label">Password</label>
                    <Input.Password type="password" name='password' id="password" style={{ height: "45px", borderRadius: "15px" }} />
                </div>

                <div className='text-center py-4'>
                    <button className="bg-orange-500 hover:bg-orange-600 text-white px-28 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-500/25 hover:shadow-xl">
                        Login
                    </button>
                </div>
                <div style={{ position: "absolute", bottom: "20px", left: "50%", transform: "translateX(-50%)", width: "100%", textAlign: "center" }}>
                    <p className='text-center text-sm '>Don't have an account? <Link to='/auth/register' style={{ color: 'black' }}>Register</Link></p>
                </div>
            </form>
        </div>
    )
}
