import React, { useState, useEffect, useRef } from 'react';
import { ChevronUp, Users, Award, Target, Lightbulb, Shield, Star, TrendingUp } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const AboutUs = () => {
  const [isVisible, setIsVisible] = useState({});
  const observerRef = useRef(null);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({
              ...prev,
              [entry.target.id]: true
            }));
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach(el => observerRef.current.observe(el));

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const StatItem = ({ number, label, icon: Icon, delay = 0 }) => (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500/10 to-black/30 p-8 border border-orange-500/20 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/20">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
      <div className="relative z-10 text-center">
        <Icon className="mx-auto mb-4 h-8 w-8 text-orange-500" />
        <div className="text-4xl font-bold text-orange-500 mb-2">{number}</div>
        <div className="text-gray-300 text-lg">{label}</div>
      </div>
    </div>
  );

  const ValueCard = ({ title, description, icon: Icon }) => (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-black/80 to-orange-500/10 p-8 border border-orange-500/20 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/20">
      <div className="absolute inset-0 bg-gradient-to-45 from-transparent via-orange-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-600"></div>
      <div className="relative z-10">
        <Icon className="mb-4 h-8 w-8 text-orange-500" />
        <h3 className="text-xl font-semibold text-orange-500 mb-4">{title}</h3>
        <p className="text-gray-300 leading-relaxed">{description}</p>
      </div>
    </div>
  );

  const JourneySection = ({ title, content, imageSrc, reverse = false }) => (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${reverse ? 'lg:grid-flow-col-dense' : ''}`}>
      <div className={`${reverse ? 'lg:col-start-2' : ''}`}>
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500/10 to-black/50 p-10 border border-orange-500/20">
          <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-radial from-orange-500/10 to-transparent animate-spin-slow"></div>
          <div className="relative z-10">
            <h3 className="text-2xl font-semibold text-orange-500 mb-6">{title}</h3>
            <p className="text-gray-300 text-lg leading-relaxed">{content}</p>
          </div>
        </div>
      </div>
      <div className={`${reverse ? 'lg:col-start-1' : ''}`}>
        <div className="relative overflow-hidden rounded-2xl shadow-2xl group">
          <img
            src={imageSrc}
            alt={title}
            className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              e.target.src = `https://picsum.photos/800/600?random=${Math.floor(Math.random() * 100)}`;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cdefs%3E%3Cpattern id='grid' width='10' height='10' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 10 0 L 0 0 0 10' fill='none' stroke='%23ff4500' stroke-width='0.5'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100' height='100' fill='url(%23grid)'/%3E%3C/svg%3E")`,
        }}></div>
      </div>

      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-black via-red-900/20 to-black">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/5 to-transparent"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 text-center">
          {/* <p className="text-orange-500 text-lg font-medium mb-4 animate-fade-in">About Us</p> */}
          <h1 className="text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent animate-pulse-glow">
            Bringing Your Vision to Life<br />
            <span className="text-3xl md:text-5xl">with Expertise and Dedication</span>
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Hero Section */}
        <div className="relative my-16 h-[500px] rounded-3xl overflow-hidden bg-gradient-to-br from-orange-500 to-red-500">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1926&q=80"
            alt="Dynamic business team collaboration"
            className="absolute inset-0 w-full h-full object-cover opacity-85 transition-transform duration-500 hover:scale-105"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1926&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/75 via-black/40 to-orange-500/25"></div>
          <div className="relative z-10 h-full flex items-center justify-center">
            <div className="text-center max-w-4xl px-6">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white drop-shadow-2xl">
                Innovative Solutions for Modern Challenges
              </h2>
              <p className="text-lg md:text-xl text-white drop-shadow-lg font-medium">
                We combine cutting-edge technology with creative thinking to deliver exceptional results that exceed expectations and drive success.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div
          id="stats"
          data-animate
          className={`my-20 p-16 bg-gradient-to-br from-orange-500/10 to-transparent rounded-3xl backdrop-blur-sm border border-orange-500/20 transition-all duration-700 ${isVisible.stats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
            <StatItem number="100+" label="Projects Completed" icon={Target} />
            <StatItem number="15+" label="Years Experience" icon={TrendingUp} />
            <StatItem number="60+" label="Happy Clients" icon={Users} />
            <StatItem number="30+" label="Team Members" icon={Users} />
            <StatItem number="25+" label="Awards Won" icon={Award} />
          </div>
        </div>

        {/* Journey Section */}
        <div className="my-20">
          <div
            id="journey-title"
            data-animate
            className={`text-center mb-16 transition-all duration-700 ${isVisible['journey-title'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-orange-500 mb-4">
              The VisionCrafters Journey Story
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full"></div>
          </div>

          <div className="space-y-20">
            <div
              id="journey-1"
              data-animate
              className={`transition-all duration-700 delay-200 ${isVisible['journey-1'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
            >
              <JourneySection
                title="Inception Vision"
                content="VisionCrafters was born from a collective vision among leading consultants to transform the landscape of consultancy by combining innovative, sophisticated, and strategic thinking. Our journey began with a mission to provide superior resources, methodologies, and expertise to help our clients succeed in an increasingly competitive market."
                imageSrc="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
              />
            </div>

            <div
              id="journey-2"
              data-animate
              className={`transition-all duration-700 delay-300 ${isVisible['journey-2'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
            >
              <JourneySection
                title="Evolutionary Journey"
                content="What started as a small team of passionate consultants has evolved into a comprehensive organization with diverse expertise. Our commitment to continuous learning and adaptation has enabled us to stay ahead of industry trends and deliver cutting-edge solutions to our clients."
                imageSrc="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                reverse={true}
              />
            </div>

            <div
              id="journey-3"
              data-animate
              className={`transition-all duration-700 delay-400 ${isVisible['journey-3'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
            >
              <JourneySection
                title="Commitment to Excellence"
                content="At VisionCrafters, excellence is not just a goal but a fundamental pillar of our operations culture. Every project we undertake is approached with meticulous attention to detail, innovative problem-solving, and an unwavering commitment to delivering value that transforms businesses."
                imageSrc="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
              />
            </div>

            <div
              id="journey-4"
              data-animate
              className={`transition-all duration-700 delay-500 ${isVisible['journey-4'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
            >
              <JourneySection
                title="Client-Centric Approach"
                content="Our philosophy centers on developing genuine partnerships with our clients. We collaborate closely to understand their unique challenges, goals, and aspirations. This deep understanding allows us to craft customized solutions that not only meet immediate needs but also support long-term growth and success."
                imageSrc="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                reverse={true}
              />
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div
          id="values"
          data-animate
          className={`my-20 p-6 bg-gradient-to-br from-orange-500/5 to-black/80 rounded-3xl transition-all duration-700 ${isVisible.values ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-orange-500 mb-4">Our Core Values</h2>
            <div className="w-28 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ValueCard
              title="Innovation"
              description="We embrace cutting-edge technologies and creative approaches to solve complex challenges and deliver breakthrough solutions."
              icon={Lightbulb}
            />
            <ValueCard
              title="Integrity"
              description="We conduct our business with the highest ethical standards, ensuring transparency and trust in every interaction."
              icon={Shield}
            />
            <ValueCard
              title="Excellence"
              description="We strive for perfection in everything we do, setting high standards and consistently exceeding expectations."
              icon={Star}
            />
            <ValueCard
              title="Collaboration"
              description="We believe in the power of teamwork and partnership, working closely with our clients to achieve shared success."
              icon={Users}
            />
          </div>
        </div>
      </div>

      {/* Scroll to top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
      >
        <ChevronUp className="h-6 w-6" />
      </button>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { filter: drop-shadow(0 0 10px rgba(255, 107, 53, 0.5)); }
          50% { filter: drop-shadow(0 0 20px rgba(255, 107, 53, 0.8)); }
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default AboutUs;