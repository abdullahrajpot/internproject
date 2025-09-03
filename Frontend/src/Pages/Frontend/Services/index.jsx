import { useState, useEffect } from 'react';
import { CaretRightOutlined } from '@ant-design/icons';
import bannerImage from '../../../assests/services.png'
import chatbotImage from '../../../assests/chatbot.png'
import webDevImage from '../../../assests/webDev.png'
import analyticImage from '../../../assests/analytic.png'
import mobileAppImage from '../../../assests/mobileApp.png'
import testingImage from '../../../assests/testing.png'
import { useLocation, useNavigate } from 'react-router-dom';
import { sendServiceOrderEmail } from '../../../services/emailService';
import { toast } from 'react-toastify';
import { useAuth } from '../../../Contexts/AuthContext';

function Services() {
    const {isAuthenticated} = useAuth();
    const navigate = useNavigate();
    const [rotation, setRotation] = useState({ x: 0, y: 0 });
    const { pathname } = useLocation();
    const [selectedService, setSelectedService] = useState(null);
    const [showOrderForm, setShowOrderForm] = useState(false);
    const [orderForm, setOrderForm] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    const handleMouseMove = (e) => {
        const bounds = e.currentTarget.getBoundingClientRect();
        const centerX = bounds.left + bounds.width / 2;
        const centerY = bounds.top + bounds.height / 2;

        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;

        const maxAngle = 20;
        const rotateY = (deltaX / bounds.width) * maxAngle;
        const rotateX = -(deltaY / bounds.height) * maxAngle;

        setRotation({ x: rotateX, y: rotateY });
    };

    const resetRotation = () => {
        setRotation({ x: 0, y: 0 });
    };

    const handleOrderInputChange = (e) => {
        const { name, value } = e.target;
        setOrderForm(prev => ({ ...prev, [name]: value }));
    };

    const handleOrderSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await sendServiceOrderEmail(orderForm, selectedService);
            alert(result.message);
        } catch (error) {
            alert('An error occurred while sending your order. Please try again.');
        }
        setOrderForm({ name: '', email: '', phone: '', message: '' });
        setShowOrderForm(false);
        setSelectedService(null);
    };

    const openOrderForm = (service) => {
              if (!isAuthenticated){
            toast.error('Please log in to request a service');
      navigate('/auth');
    return;    
    }
        setSelectedService(service);
        setShowOrderForm(true);
    };
    const closeOrderForm = () => {
        setShowOrderForm(false);
        setSelectedService(null);
    };

    const stats = [
        { icon: "https://s.w.org/images/core/emoji/15.1.0/svg/1f680.svg", value: "10+", label: "Projects Delivered" },
        { icon: "https://s.w.org/images/core/emoji/15.1.0/svg/1f30d.svg", value: "5+", label: "Countries Represented" },
        { icon: "https://s.w.org/images/core/emoji/15.1.0/svg/1f91d.svg", value: "5+", label: "Clients Served" },
        { icon: "https://s.w.org/images/core/emoji/15.1.0/svg/1f465.svg", value: "4+", label: "Team Members" },
        { icon: "https://s.w.org/images/core/emoji/15.1.0/svg/1f4ac.svg", value: "24/7", label: "Support Available" },
    ];

    const services = [
        {
            title: "Website Development",
            description: "Custom, responsive websites that look great and perform even better. Built for startups, creators, and businesses ready to scale.",
            button: "Get Started Today",
            image: webDevImage,
        },
        {
            title: "Mobile app Development",
            description: "Custom mobile app development for Android and iOS to bring your ideas to life with seamless performance and modern UI/UX.",
            button: "Lets Build",
            image: mobileAppImage,
        },
        {
            title: "Chatbot Development",
            description: "AI-powered chatbots for websites and apps to automate support, generate leads, and engage users 24/7.",
            button: "Boost Your Business",
            image: chatbotImage,
        },
        {
            title: "Data Analytics & Power BI",
            description: "Transform your raw data into rich, interactive dashboards with actionable insights using Power BI. Drive smarter decisions for growth.",
            button: "Unlock Insights",
            image: analyticImage,
        },
        {
            title: "Software Testing",
            description: "Comprehensive software testing services to ensure quality, performance, and bug-free user experiences.",
            button: "Test To Deliver",
            image: testingImage,
        },
    ];

    const industries = [
        { label: "Coaches & Consultants", color: "bg-gray-700/70", icon: "https://s.w.org/images/core/emoji/15.1.0/svg/1f468-200d-1f4bc.svg" },
        { label: "Local Service Businesses", color: "bg-gray-600/70", icon: "https://s.w.org/images/core/emoji/15.1.0/svg/1f3ea.svg" },
        { label: "Health & Wellness", color: "bg-green-800/70", icon: "https://s.w.org/images/core/emoji/15.1.0/svg/1f9d8-200d-2640-fe0f.svg" },
        { label: "E-commerce & Small Product Brands", color: "bg-amber-800/70", icon: "https://s.w.org/images/core/emoji/15.1.0/svg/1f6cd.svg" },
        { label: "Real Estate Agencies", color: "bg-lime-800/70", icon: "https://s.w.org/images/core/emoji/15.1.0/svg/1f3e0.svg" },
        { label: "Education & eLearning", color: "bg-indigo-800/70", icon: "https://s.w.org/images/core/emoji/15.1.0/svg/1f4da.svg" },
        { label: "Travel & Hospitality", color: "bg-purple-800/70", icon: "https://s.w.org/images/core/emoji/15.1.0/svg/2708.svg" },
        { label: "Finance / Insurance", color: "bg-emerald-800/70", icon: "https://s.w.org/images/core/emoji/15.1.0/svg/1f4b0.svg" },
        { label: "Healthcare", color: "bg-cyan-800/70", icon: "https://s.w.org/images/core/emoji/15.1.0/svg/2695.svg" },
        { label: "Logistics & Supply Chain", color: "bg-blue-800/70", icon: "https://s.w.org/images/core/emoji/15.1.0/svg/1f69b.svg" },
        { label: "SaaS & Tech Startups", color: "bg-slate-700/70", icon: "https://s.w.org/images/core/emoji/15.1.0/svg/1f4bb.svg" },
        { label: "Banking Service", color: "bg-neutral-700/70", icon: "https://s.w.org/images/core/emoji/15.1.0/svg/1f3e6.svg" },
    ];


    return (
        <>
            <div className="landing-container">
                <div className="text-content">
                    <h1><span role="img" aria-label="target">🎯</span> We Analyze, Strategize &<br />Deliver Digital Brilliance</h1>
                    <p>
                        From startup-ready websites to intelligent chatbots and business dashboards — we build what your brand needs to grow.
                    </p>
                    <a href="https://wa.me/923286990514" target="_blank" rel="noopener noreferrer" >
                        <button className="strategy-button">Get Strategy Call <CaretRightOutlined /></button>
                    </a>
                </div>
                <div className="image-content" onMouseMove={handleMouseMove} onMouseLeave={resetRotation}>
                    <img src={bannerImage} alt="Digital Strategy Visual" className="rotating-image" style={{ transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` }} />
                </div>
            </div>

            <div className="stats-dark-wrapper">
                <div className="animated-blobs">
                    <div className="blob blob1"></div>
                    <div className="blob blob2"></div>
                    <div className="blob blob3"></div>
                    <div className="blob blob4"></div>
                </div>

                <div className="stats-container">
                    {stats.map((stat, index) => (
                        <div className="stat-card animate-fade-in-up" key={index}>
                            <img
                                src={stat.icon}
                                alt={stat.label}
                                className="w-14 h-14 object-contain mx-auto"
                            />
                            <h2>{stat.value}</h2>
                            <p>{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            <section className="bg-[#111827] py-16 px-8">
                <div className="max-w-6xl mx-auto text-center">
                    <h3 className="text-orange-400 uppercase text-sm font-semibold mb-2">
                        What We're Great At
                    </h3>
                    <h2 className="text-white text-4xl font-bold mb-12">Our Expertise</h2>

                    <div className="grid gap-y-12 gap-x-8 md:grid-cols-2 lg:grid-cols-3">
                        {services.map((service, idx) => (
                            <div
                                key={idx}
                                className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 text-white flex flex-col transition duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/20"
                            >
                                <div className="flex flex-col items-center flex-grow">
                                    <div className="text-xl mb-6 transition-transform duration-300 group-hover:-rotate-6">
                                        <img
                                            src={service.image}
                                            alt={service.title}
                                            className="w-24 h-24 object-contain mx-auto"
                                        />
                                    </div>
                                    <h3 className="text-xl font-bold text-center mb-4">{service.title}</h3>
                                    <p className="text-gray-300 text-center flex-grow">{service.description}</p>
                                </div>

                                <button className="bg-orange-600 hover:bg-orange-700 transition-colors duration-300 w-full max-w-xs text-center px-6 py-2 rounded-full font-medium mt-6 self-center"
                                    onClick={() => openOrderForm(service)}>
                                    Request Service
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Order Modal */}
            {showOrderForm && selectedService && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-orange-500/20 shadow-2xl">
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-2">
                                        Request: {selectedService.title}
                                    </h2>
                                    <span className="text-orange-300 text-sm">Fill out the form to request this service</span>
                                </div>
                                <button
                                    onClick={closeOrderForm}
                                    className="text-gray-400 hover:text-orange-400 text-3xl transition-colors duration-300 hover:scale-110"
                                >
                                    ×
                                </button>
                            </div>
                            <form onSubmit={handleOrderSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-orange-300 mb-2">Full Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={orderForm.name}
                                        onChange={handleOrderInputChange}
                                        required
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 hover:border-orange-400"
                                        placeholder="Enter your full name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-orange-300 mb-2">Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={orderForm.email}
                                        onChange={handleOrderInputChange}
                                        required
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 hover:border-orange-400"
                                        placeholder="Enter your email"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-orange-300 mb-2">Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={orderForm.phone}
                                        onChange={handleOrderInputChange}
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 hover:border-orange-400"
                                        placeholder="Enter your phone number"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-orange-300 mb-2">Message *</label>
                                    <textarea
                                        name="message"
                                        value={orderForm.message}
                                        onChange={handleOrderInputChange}
                                        required
                                        rows="4"
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 hover:border-orange-400 resize-none"
                                        placeholder="Describe your requirements, goals, or any questions you have"
                                    />
                                </div>
                                <div className="flex gap-4 pt-2">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-500/25"
                                    >
                                        Send Request
                                    </button>
                                    <button
                                        type="button"
                                        onClick={closeOrderForm}
                                        className="flex-1 bg-gray-800 text-gray-300 py-3 px-6 rounded-xl font-semibold hover:bg-gray-700 hover:text-white transition-all duration-300 border border-gray-700 hover:border-gray-600"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <section className="bg-[#111827] text-white py-16 px-6">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div className="text-center md:text-left">
                        <h4 className="text-orange-400 uppercase font-semibold mb-2 tracking-wide">Industries We Work For</h4>
                        <h2 className="text-4xl font-bold leading-tight mb-4">Helping Businesses in All Domains</h2>
                        <p className="text-gray-300 mb-8">
                            Trusted by businesses worldwide, we deliver exceptional digital solutions tailored to your
                            industry needs. Our proven expertise helps companies grow and succeed in today's competitive
                            digital landscape.
                        </p>
                        <div className="text-xl font-bold mt-6">We Promise. We Deliver.</div>
                        <button className="mt-4 bg-gradient-to-r from-orange-500 to-red-500 px-6 py-2 rounded-full font-semibold hover:opacity-90 transition">
                            Let's Work Together →
                        </button>
                    </div>

                    {/* Right Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {industries.map((item, i) => (
                            <div key={i} className={`${item.color} rounded-2xl p-4 text-center flex flex-col items-center justify-center transition-transform duration-300 hover:scale-105 group`}>
                                <div className="mb-2 transition-transform duration-300 group-hover:scale-125">
                                    <img src={item.icon} alt={item.label} className="w-10 h-10 object-contain" />
                                </div>
                                <div className="text-sm font-medium">{item.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}

export default Services;