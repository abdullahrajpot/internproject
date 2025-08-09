import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLocation } from "react-router-dom"
import AnimatedDivider from '../AnimatedDivider';
import { motion } from "framer-motion";
import Typewriter from 'typewriter-effect';
import LeftIcons from '../LeftSideIcons';
import {
  ClipboardList,
  Briefcase,
  DollarSign, 
  UserCircle,
  Star,
  Rocket,
  Clock,
  Globe,
} from 'lucide-react';

import {
  FaLaptopCode,
  FaGlobe,
  FaMobileAlt,
  FaLayerGroup,
  FaPaintBrush,
  FaLink
} from 'react-icons/fa';

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [openFAQ, setOpenFAQ] = useState(0); // Track which FAQ is open
  const videoRef = useRef(null);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 200);
  }, []);

  useEffect(() => {
    setIsVisible(true);
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log("Video autoplay prevented:", error);
      });
    }
  }, []);

  const imageUrls = [
  "https://img.freepik.com/free-vector/internship-job-illustration_23-2148722413.jpg",
  "https://i.pinimg.com/736x/0c/c2/25/0cc225973870ef500c1a07a8a8b260fa.jpg",
  "https://img.freepik.com/premium-vector/internship-job-concept-illustration_23-2148754784.jpg",
  "https://static.vecteezy.com/system/resources/previews/011/637/858/original/internship-flat-style-illustration-design-free-vector.jpg"
];

  const services = [
  {
    title: 'MERN Stack Development',
    description: 'Build powerful web applications using MongoDB, Express, React, and Node.js.',
    icon: <FaLaptopCode size={35} />,
  },
  {
    title: 'Web Development',
    description: 'Create fast, secure, and SEO-optimized websites using modern tech stacks.',
    icon: <FaGlobe size={35} />,
  },
  {
    title: 'Mobile App Development',
    description: 'Develop cross-platform mobile apps for Android & iOS with native performance.',
    icon: <FaMobileAlt size={35} />,
  },
  {
    title: 'Flutter Development',
    description: 'Craft beautiful, natively compiled apps for mobile, web, and desktop.',
    icon: <FaLayerGroup size={35} />,
  },
  {
    title: 'UI/UX Design',
    description: 'Design elegant user experiences with a focus on usability and visual appeal.',
    icon: <FaPaintBrush size={35} />,
  },
  {
    title: 'Backend API Integration',
    description: 'Connect your frontend with robust RESTful or GraphQL APIs for dynamic functionality.',
    icon: <FaLink size={35} />,
  }
];

  const faqs = [
  {
    question: "How do I apply for internships on your platform?",
    answer:
      "Simply create your profile, upload your resume, and browse through available internship opportunities. Click 'Apply Now' on any position that interests you. Our system will automatically match your skills with relevant opportunities and notify you of new openings.",
    icon: <ClipboardList size={24} />
  },
  {
    question: "What types of internships are available?",
    answer:
      "We offer internships across various fields including Software Development, Web Development, Mobile App Development, UI/UX Design, Digital Marketing, Data Science, and Business Development.",
    icon: <Briefcase size={24} />
  },
  {
    question: "Are the internships paid or unpaid?",
    answer:
      "We offer both paid and unpaid internship opportunities. Most of our partner companies provide stipends or compensation. Listings include all benefit details.",
    icon: <DollarSign size={24} />
  },
  {
    question: "How long do internships typically last?",
    answer:
      "Internships vary from 6 weeks to 6 months. Most are 8–12 weeks during summer or 3–6 months for semester-long programs.",
    icon: <Clock size={24} />
  },
  {
    question: "Do you provide mentorship during internships?",
    answer:
      "Yes! Each intern gets a dedicated mentor. You'll get regular feedback, support, and guidance throughout.",
    icon: <UserCircle size={24} />
  },
  {
    question: "Can international students apply?",
    answer:
      "Absolutely! We welcome international students. Some internships are remote or sponsor visas.",
    icon: <Globe size={24} />
  },
  {
    question: "What skills will I gain during the internship?",
    answer:
      "You'll develop technical and soft skills like teamwork, tools, and project management. Every internship prepares you for real-world roles.",
    icon: <Rocket size={24} />
  },
  {
    question: "How do you ensure quality internship experiences?",
    answer:
      "We vet companies carefully and maintain high standards. You get support, feedback, and a certificate upon successful completion.",
    icon: <Star size={24} />
  }
];

  return (
    <div className="relative text-white">
    <div className="relative min-h-screen overflow-hidden">
  {/* Video Background */}
  <div className="absolute inset-0">
    <video
      ref={videoRef}
      autoPlay
      muted
      loop
      playsInline
      className="w-full h-full object-cover"
    >
      <source
        src="https://videos.pexels.com/video-files/3129977/3129977-uhd_2560_1440_30fps.mp4"
        type="video/mp4"
      />
    </video>
    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-black/30" />
  </div>

  {/* Content Layout: Stack on mobile, side-by-side on larger screens */}
  <div className="relative z-10 flex flex-col-reverse sm:flex-row items-center justify-between min-h-screen px-4 sm:px-10">
    {/* LeftIcons: show below text on mobile, left side on larger screens */}
    <div className="w-full sm:w-1/2 flex items-center justify-center min-h-[250px] sm:min-h-screen">
      <LeftIcons />
    </div>

    {/* Hero Text */}
    <div
      className={`w-full sm:w-1/2 text-center sm:text-right max-w-xl transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
      }`}
    >
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight">
        <span className="block mt-4 ">Kickstart Your Career</span>
        <span className="block text-orange-500 mt-2">
          <Typewriter
            options={{
              strings: [
                'Web Development',
                'App Development',
                'UI/UX Design',
                'Machine Learning',
                'Data Science',
              ],
              autoStart: true,
              loop: true,
              pauseFor: 1500,
            }}
          />
        </span>
      </h1>

      <p className="text-base sm:text-lg md:text-xl text-gray-300 mt-3 sm:mt-6 mb-6 sm:mb-8 leading-relaxed">
        Find internships, follow curated roadmaps,
        <br className="hidden sm:inline" />
        and learn from free YouTube courses — all in one place.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center sm:justify-end">
        <button className="bg-orange-500 hover:bg-orange-600 text-white px-5 sm:px-6 py-3 rounded-full font-medium transition-all transform hover:scale-105">
          Get Started
        </button>
        <button className="border-2 border-white hover:bg-white/10 text-white px-5 sm:px-6 py-3 rounded-full font-medium transition-all transform hover:scale-105">
          Talk to a human
        </button>
      </div>
    </div>
  </div>
</div>
      <AnimatedDivider color="#ea580c" />

      {/* About Section */}
      <section className="relative text-white py-20 px-6 sm:px-12 overflow-hidden">

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="mb-4">
            <span className="bg-orange-600 text-white text-sm font-semibold px-4 py-1 rounded-full">
              🎯 Why Choose Us
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-white text-center">
            Why Choose <span className="text-orange-500">Our Internship Platform</span>
          </h2>

          <p className="text-gray-300 max-w-xl mx-auto text-center text-base sm:text-lg mt-4 leading-relaxed">
            We bridge the gap between learning and doing by helping students gain practical, career-ready skills through internships.
          </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6 px-4">
        {imageUrls.map((url, index) => (
          <motion.div
            key={index}
            className="overflow-hidden rounded-full w-45 h-45 mx-auto"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: index * 0.3 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <img
              src={url}
              alt={`Tech Banner ${index + 1}`}
              className="w-full h-auto object-cover"
            />
          </motion.div>
        ))}
      </div>

          <p className="text-gray-400 text-center max-w-3xl mx-auto mt-8 leading-relaxed text-base sm:text-lg">
            We believe talent shouldn't go unnoticed — our mission is to connect academic learning with the professional world.
            <br />
            Through partnerships with top mentors and organizations, we help students gain real-world experience, grow their confidence, and launch their careers.
            <br />
            <br />
          </p>
          <a
            href="#"
            className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-medium px-6 py-3 rounded-full shadow-md transition-transform transform hover:scale-105"
          >
            Join the Platform →
          </a>
        </div>
      </section>

      <AnimatedDivider color="#ea580c" />

      {/* Services Section */}
      <section className="text-white py-20 px-6 sm:px-12">
  <div className="max-w-7xl mx-auto">
    <div className="flex justify-between items-center mb-16">
      <h2 className="text-4xl font-bold">Services</h2>
      <button className="text-sm text-gray-400 hover:text-orange-500 transition-all duration-200">
        Show More →
      </button>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {services.map((service, index) => (
        <div
          key={index}
          className="relative bg-[#121212] hover:bg-[#181818] transition duration-500 rounded-2xl p-6 group border border-gray-800 hover:border-gray-700 transform hover:-translate-y-2 hover:shadow-lg flex flex-col"
        >
          {/* 3D Icon */}
          <div className="mb-6 flex justify-start">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <div className="relative">
                {/* Shadow/Base layer */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-600 to-gray-800 rounded-2xl transform translate-x-1 translate-y-1 opacity-30"></div>

                {/* Main icon container */}
                <div className="relative w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-400 rounded-2xl flex items-center justify-center shadow-xl transform group-hover:scale-105 transition-transform duration-300">
                  <div className="text-3xl text-gray-800 transform group-hover:rotate-3 transition-transform duration-300">
                    {service.icon}
                  </div>
                </div>

                {/* Highlight effect */}
                <div className="absolute top-2 left-2 w-16 h-8 bg-gradient-to-br from-white/20 to-transparent rounded-xl"></div>
              </div>
            </div>
          </div>

          {/* Title + Description */}
          <div className="flex-1 text-left">
            <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-orange-400 transition duration-300">
              {service.title}
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition duration-300">
              {service.description}
            </p>
          </div>

          {/* Subtle gradient overlay on hover */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-orange-500/0 via-transparent to-orange-600/0 group-hover:from-orange-500/5 group-hover:to-orange-600/5 transition-all duration-500 pointer-events-none"></div>

          {/* Glow effect on hover */}
          <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-br from-orange-500/0 to-orange-600/0 group-hover:from-orange-500/20 group-hover:to-orange-600/20 opacity-0 group-hover:opacity-100 transition-all duration-500 -z-10 blur-sm"></div>
        </div>
      ))}
    </div>
  </div>
</section>

      <AnimatedDivider color="#ea580c" />


      {/* FAQ Section */}
      <section className="relative text-white py-20 px-6 sm:px-12 overflow-hidden">
        <div className="absolute bottom-32 left-16 opacity-10">
          <div className="animate-float-reverse">
            <svg width="80" height="80" viewBox="0 0 80 80">
              <rect x="20" y="20" width="40" height="40" stroke="#f97316" strokeWidth="2" fill="none" transform="rotate(45 40 40)" />
            </svg>
          </div>
        </div>

        <div className="absolute top-1/3 left-10 opacity-8">
          <div className="animate-float">
            <svg width="60" height="60" viewBox="0 0 60 60">
              <polygon points="30,5 55,50 5,50" stroke="#f97316" strokeWidth="1.5" fill="none" />
            </svg>
          </div>
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          {/* Header */}
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="mb-4">
              <span className="bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-full inline-flex items-center gap-2 shadow-lg animate-bounce-slow">
                ⚡ Your questions answered
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 animate-fade-in-up">
              Frequently Asked <span className="text-orange-500">Questions</span>
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto animate-fade-in-up-delayed">
              Everything you need to know about our internship platform and how to get started with your career journey.
            </p>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4 mb-16">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className={`relative bg-[#1a1a1a] border border-gray-800/30 rounded-2xl overflow-hidden transition-all duration-500 hover:border-gray-700/50 hover:shadow-2xl transform hover:-translate-y-1 ${
            openFAQ === index
              ? 'border-orange-500/30 shadow-orange-500/10 shadow-xl bg-[#1f1f1f]'
              : ''
          } ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
          style={{ animationDelay: `${(index + 1) * 150}ms` }}
        >
          <button
            onClick={() => setOpenFAQ(openFAQ === index ? -1 : index)}
            className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-800/30 transition-all duration-300 group"
          >
            <div className="flex items-center gap-4 flex-1">
              <div
                className={`min-w-[3rem] min-h-[3rem] rounded-xl flex items-center justify-center text-xl transition-all duration-300 transform group-hover:scale-105 ${
                  openFAQ === index
                    ? 'bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/25'
                    : 'bg-gradient-to-br from-gray-700 to-gray-900 group-hover:from-gray-600 group-hover:to-gray-800'
                }`}
              >
                <span className="text-white">{faq.icon}</span>
              </div>
              <h3
                className={`text-lg sm:text-xl font-semibold transition-colors duration-300 ${
                  openFAQ === index
                    ? 'text-orange-400'
                    : 'text-white group-hover:text-orange-400'
                }`}
              >
                {faq.question}
              </h3>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <span
                className={`text-sm font-medium ${
                  openFAQ === index
                    ? 'text-orange-400'
                    : 'text-gray-400 group-hover:text-orange-400'
                }`}
              >
                {openFAQ === index ? 'Close' : 'Open'}
              </span>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 transform ${
                  openFAQ === index
                    ? 'bg-orange-500 rotate-180 shadow-lg shadow-orange-500/25'
                    : 'bg-gray-800 group-hover:bg-gray-700 group-hover:scale-105'
                }`}
              >
                <ChevronDown
                  className={`w-4 h-4 transition-colors duration-300 ${
                    openFAQ === index
                      ? 'text-white'
                      : 'text-gray-400 group-hover:text-orange-400'
                  }`}
                />
              </div>
            </div>
          </button>

          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              openFAQ === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="px-6 pb-6">
              <div className="ml-12 border-l-2 border-orange-500/20 pl-6 relative">
                <div className="absolute -left-1 top-0 w-2 h-8 bg-gradient-to-b from-orange-500 to-transparent rounded-full"></div>
                <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          </div>

          {openFAQ === index && (
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/5 via-transparent to-orange-600/5 pointer-events-none"></div>
          )}
        </div>
      ))}
    </div>

          {/* CTA Section */}
          <div className={`text-center p-8 bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-2xl border border-gray-700/30 relative overflow-hidden shadow-2xl transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-4 left-4 w-20 h-20 border-2 border-orange-500 rounded-full animate-pulse"></div>
              <div className="absolute bottom-4 right-4 w-16 h-16 border-2 border-orange-500 rounded-full animate-pulse"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-orange-500/30 rounded-full animate-spin-slow"></div>
            </div>

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-orange-600/5"></div>

            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-4 text-white">Still have questions?</h3>
              <p className="text-gray-300 mb-6 max-w-lg mx-auto">
                Can't find the answer you're looking for? Our support team is here to help you get started with your internship journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-500/25 hover:shadow-xl">
                  Contact Support
                </button>
                <button className="border-2 border-gray-600 hover:border-orange-500 hover:bg-orange-500/10 text-white px-8 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                  Schedule a Call
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Float Animation Keyframes */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        
        @keyframes float-delayed {
          0%, 100% { 
            transform: translateY(0) rotate(0deg) scale(1); 
          }
          50% { 
            transform: translateY(-15px) rotate(180deg) scale(1.1); 
          }
        }
        
        @keyframes float-reverse {
          0%, 100% { 
            transform: translateY(0) rotate(0deg); 
          }
          50% { 
            transform: translateY(15px) rotate(-180deg); 
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% { 
            transform: scale(1); 
            opacity: 0.2; 
          }
          50% { 
            transform: scale(1.1); 
            opacity: 0.3; 
          }
        }
        
        @keyframes bounce-slow {
          0%, 100% { 
            transform: translateY(0); 
          }
          50% { 
            transform: translateY(-5px); 
          }
        }
        
        @keyframes fade-in-up {
          0% { 
            opacity: 0; 
            transform: translateY(30px); 
          }
          100% { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes fade-in-up-delayed {
          0% { 
            opacity: 0; 
            transform: translateY(30px); 
          }
          100% { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes spin-slow {
          from { 
            transform: translate(-50%, -50%) rotate(0deg); 
          }
          to { 
            transform: translate(-50%, -50%) rotate(360deg); 
          }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        
        .animate-float-reverse {
          animation: float-reverse 7s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        
        .animate-fade-in-up-delayed {
          animation: fade-in-up-delayed 1s ease-out 0.2s forwards;
          opacity: 0;
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        /* Hover effects for FAQ items */
        .group:hover .animate-float {
          animation-duration: 3s;
        }
        
        /* Responsive adjustments */
        @media (max-width: 640px) {
          .animate-float-delayed,
          .animate-float-reverse {
            animation-duration: 4s;
          }
        }
      `}</style>
    </div>
  );
}