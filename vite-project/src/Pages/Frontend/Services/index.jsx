import { useState } from 'react';
import { CaretRightOutlined } from '@ant-design/icons';
import bannerImage from '../../../assests/services.png'
import chatbotImage from '../../../assests/chatbot.png'
import webDevImage from '../../../assests/webDev.png'
import analyticImage from '../../../assests/analytic.png'

function Services() {
    const [rotation, setRotation] = useState({ x: 0, y: 0 });

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

    const stats = [
        { icon: "https://s.w.org/images/core/emoji/15.1.0/svg/1f680.svg", value: "200+", label: "Projects Delivered" },
        { icon: "https://s.w.org/images/core/emoji/15.1.0/svg/1f30d.svg", value: "10+", label: "Countries Represented" },
        { icon: "https://s.w.org/images/core/emoji/15.1.0/svg/1f91d.svg", value: "50+", label: "Clients Served" },
        { icon: "https://s.w.org/images/core/emoji/15.1.0/svg/1f465.svg", value: "100+", label: "Team Members" },
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
                    <button className="strategy-button">Get Strategy Call <CaretRightOutlined /></button>
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

            <section className="bg-[#111827] py-16 px-4">
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

                                <button className="bg-orange-600 hover:bg-orange-700 transition-colors duration-300 w-full max-w-xs text-center px-6 py-2 rounded-full font-medium mt-6 self-center">
                                    {service.button}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>



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