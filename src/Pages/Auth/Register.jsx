import React from 'react'
import { Input } from 'antd'
import { Link } from 'react-router-dom'
import { LeftOutlined ,CloseOutlined,UserOutlined,MailOutlined } from '@ant-design/icons';

export default function Register() {
  return (
    <div style={{ backgroundColor: ' #111827', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <form className='border border-gray-500 text-gray-700 py-5 px-10 ' style={{ backgroundColor: '#fff', height: '500px', borderRadius: "20px", width: '350px', position: "relative" }}>

        <Link style={{ position: 'absolute', top: '15px', left: '20px', fontSize: '16px', color: 'parrot' }} to='/auth'>
          <LeftOutlined />
        </Link>

        <Link to='/' style={{ position: 'absolute', top: '15px', right: '20px', fontSize: '16px', color: "parrot" }}>
          <CloseOutlined />
        </Link>


        <div className="mb-3">
          <h1 className="text-4xl text-center py-5 font-bold mb-3">Register</h1>
        </div>


        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <Input type="text" name='name' id="name" style={{ height: "35px", borderRadius: "15px" }} suffix={<UserOutlined style={{ color: '#aaa' }} />} />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <Input type="email" name='email' id="email" aria-describedby="emailHelp" style={{ height: "35px", borderRadius: "15px" }} suffix={<MailOutlined style={{ color: '#aaa' }} />}  />
        </div>

        <div className="mb-3" style={{ position: "relative" }}>
          <label htmlFor="password" className="form-label">Password</label>
          <Input.Password type="password" name='password' id="password" style={{ height: "35px", borderRadius: "15px" }} />
        </div>


        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">Cofirm Password</label>
          <Input.Password type="confirmPassword" name='confirmPassword' id="confirmPassword" style={{ height: "35px", borderRadius: "15px" }} />
        </div>

        <div className='text-center'>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-28 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-500/25 hover:shadow-xl">
            Login
          </button>
        </div>

        <div style={{
          position: "absolute", bottom: "20px", left: "50%", transform: "translateX(-50%)",
          width: "100%", textAlign: "center"
        }}>
          <p className='small text-center text-sm'>Already have an account? <Link to='/auth' style={{ color: 'black' }}>Login</Link></p>
        </div>
      </form>
    </div>
  )
}
