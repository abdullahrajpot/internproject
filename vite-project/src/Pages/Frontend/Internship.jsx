import React, { useState } from 'react';
import { Briefcase, Code, Palette, Database, Globe, Smartphone, Brain, Rocket } from 'lucide-react';
import { sendApplicationEmail } from '../../services/emailService';

const Internship = () => {
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    university: '',
    graduationYear: '',
    skills: '',
    experience: '',
    motivation: '',
    portfolio: ''
  });

  const domains = [
    {
      id: 1,
      name: 'Frontend Development',
      icon: <Code className="w-8 h-8" />,
      description: 'Build beautiful and responsive user interfaces using modern technologies like React, Vue, and Angular.',
      skills: ['HTML/CSS', 'JavaScript', 'React', 'Vue.js', 'Angular'],
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-gradient-to-br from-orange-500 to-red-500'
    },
    {
      id: 2,
      name: 'Backend Development',
      icon: <Database className="w-8 h-8" />,
      description: 'Develop robust server-side applications and APIs using Node.js, Python, and other backend technologies.',
      skills: ['Node.js', 'Python', 'Java', 'SQL', 'MongoDB'],
      color: 'from-orange-400 to-orange-600',
      bgColor: 'bg-gradient-to-br from-orange-400 to-orange-600'
    },
    {
      id: 3,
      name: 'UI/UX Design',
      icon: <Palette className="w-8 h-8" />,
      description: 'Create intuitive and engaging user experiences through thoughtful design and user research.',
      skills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping', 'User Research'],
      color: 'from-orange-600 to-red-600',
      bgColor: 'bg-gradient-to-br from-orange-600 to-red-600'
    },
    {
      id: 4,
      name: 'Mobile Development',
      icon: <Smartphone className="w-8 h-8" />,
      description: 'Build native and cross-platform mobile applications for iOS and Android platforms.',
      skills: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase'],
      color: 'from-orange-500 to-yellow-500',
      bgColor: 'bg-gradient-to-br from-orange-500 to-yellow-500'
    },
    {
      id: 5,
      name: 'Data Science',
      icon: <Brain className="w-8 h-8" />,
      description: 'Analyze complex data sets and build machine learning models to drive business insights.',
      skills: ['Python', 'R', 'TensorFlow', 'Pandas', 'SQL'],
      color: 'from-red-500 to-orange-500',
      bgColor: 'bg-gradient-to-br from-red-500 to-orange-500'
    },
    {
      id: 6,
      name: 'DevOps',
      icon: <Rocket className="w-8 h-8" />,
      description: 'Manage infrastructure, deployment pipelines, and ensure smooth software delivery.',
      skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Linux'],
      color: 'from-orange-600 to-red-700',
      bgColor: 'bg-gradient-to-br from-orange-600 to-red-700'
    },
    {
      id: 7,
      name: 'Full Stack Development',
      icon: <Globe className="w-8 h-8" />,
      description: 'Develop complete web applications from frontend to backend with modern technologies.',
      skills: ['MERN Stack', 'LAMP Stack', 'MEAN Stack', 'REST APIs', 'GraphQL'],
      color: 'from-yellow-500 to-orange-600',
      bgColor: 'bg-gradient-to-br from-yellow-500 to-orange-600'
    },
    {
      id: 8,
      name: 'Product Management',
      icon: <Briefcase className="w-8 h-8" />,
      description: 'Lead product strategy, roadmap planning, and cross-functional team coordination.',
      skills: ['Agile', 'Scrum', 'Product Strategy', 'User Stories', 'Analytics'],
      color: 'from-orange-700 to-red-800',
      bgColor: 'bg-gradient-to-br from-orange-700 to-red-800'
    }
  ];

  const handleCardClick = (domain) => {
    setSelectedDomain(domain);
    setShowForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const result = await sendApplicationEmail(formData, selectedDomain);
      
      if (result.success) {
        alert(result.message);
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert('An error occurred while submitting your application. Please try again.');
    }
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      university: '',
      graduationYear: '',
      skills: '',
      experience: '',
      motivation: '',
      portfolio: ''
    });
    setShowForm(false);
    setSelectedDomain(null);
  };

  const closeForm = () => {
    setShowForm(false);
    setSelectedDomain(null);
  };

  const iconStyle = { color: '#fb923c', width: '2.5rem', height: '2.5rem' };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-red-600 text-white py-20 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-orange-400 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-20 right-20 w-16 h-16 bg-red-400 rounded-full opacity-30 animate-bounce"></div>
          <div className="absolute bottom-10 left-1/4 w-12 h-12 bg-orange-300 rounded-full opacity-25 animate-ping"></div>
          <div className="absolute bottom-20 right-1/3 w-24 h-24 bg-red-300 rounded-full opacity-20 animate-pulse"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent animate-float">
              Internship Opportunities
            </h1>
            <p className="text-xl md:text-2xl text-orange-100 max-w-3xl mx-auto leading-relaxed">
              Kickstart your career with hands-on experience in cutting-edge technologies
            </p>
            <div className="mt-8">
              <div className="inline-flex items-center space-x-2 bg-black bg-opacity-30 px-6 py-3 rounded-full animate-pulse-glow">
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                <span className="text-orange-200 font-medium">Live Opportunities</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-black bg-opacity-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <div className="text-4xl md:text-5xl font-bold text-orange-500 mb-2 animate-pulse-glow">50+</div>
              <div className="text-gray-300 text-lg">Internship Positions</div>
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: '400ms' }}>
              <div className="text-4xl md:text-5xl font-bold text-orange-500 mb-2 animate-pulse-glow">8</div>
              <div className="text-gray-300 text-lg">Different Domains</div>
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: '600ms' }}>
              <div className="text-4xl md:text-5xl font-bold text-orange-500 mb-2 animate-pulse-glow">100%</div>
              <div className="text-gray-300 text-lg">Remote Friendly</div>
            </div>
          </div>
        </div>
      </div>

      {/* Domains Grid */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Choose Your Domain
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Select from our diverse range of internship opportunities and start your journey
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {domains.map((domain, index) => (
            <div
              key={domain.id}
              onClick={() => handleCardClick(domain)}
              className="group cursor-pointer transform transition-all duration-500 hover:scale-110 hover:rotate-1 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`${domain.bgColor} p-8 rounded-3xl text-white h-full flex flex-col justify-between relative overflow-hidden shadow-2xl hover:shadow-orange-500/25 transition-all duration-500`}>
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
                </div>
                
                <div className="relative z-10">
                  <div className="mb-6 flex items-center justify-center">
                    <span className="bg-white bg-opacity-90 p-3 rounded-2xl inline-block animate-float shadow-lg">
                      {React.cloneElement(domain.icon, { style: iconStyle })}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-orange-200 transition-colors duration-300">{domain.name}</h3>
                  <p className="text-orange-100 text-sm mb-6 leading-relaxed">{domain.description}</p>
                </div>
                
                <div className="mt-auto relative z-10">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {domain.skills.slice(0, 3).map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="bg-white bg-opacity-80 text-xs px-3 py-1 rounded-full backdrop-blur-sm border border-orange-200 shadow-sm text-orange-700 font-semibold"
                        aria-label={skill}
                      >
                        {skill}
                      </span>
                    ))}
                    {domain.skills.length > 3 && (
                      <span className="bg-white bg-opacity-80 text-xs px-3 py-1 rounded-full backdrop-blur-sm border border-orange-200 shadow-sm text-orange-700 font-semibold" aria-label={`+${domain.skills.length - 3} more`}>
                        +{domain.skills.length - 3} more
                      </span>
                    )}
                  </div>
                  <div className="text-center mt-2">
                    <span className="inline-block bg-white bg-opacity-90 px-6 py-3 rounded-xl text-sm font-bold text-orange-600 group-hover:bg-orange-500 group-hover:text-white group-hover:scale-105 transition-all duration-300 backdrop-blur-sm border border-orange-300 shadow-md cursor-pointer" aria-label="Apply Now">
                      Apply Now
                    </span>
                  </div>
                </div>
                
                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Application Form Modal */}
      {showForm && selectedDomain && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-orange-500/20 shadow-2xl">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    Apply for {selectedDomain.name}
                  </h2>
                  <div className="flex items-center space-x-2">
                    <div className={`w-4 h-4 rounded-full ${selectedDomain.bgColor}`}></div>
                    <span className="text-orange-300 text-sm">Fill out the form below to apply</span>
                  </div>
                </div>
                <button
                  onClick={closeForm}
                  className="text-gray-400 hover:text-orange-400 text-3xl transition-colors duration-300 hover:scale-110"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group">
                    <label className="block text-sm font-medium text-orange-300 mb-3 group-focus-within:text-orange-400 transition-colors duration-300">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 hover:border-orange-400"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="group">
                    <label className="block text-sm font-medium text-orange-300 mb-3 group-focus-within:text-orange-400 transition-colors duration-300">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 hover:border-orange-400"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="group">
                    <label className="block text-sm font-medium text-orange-300 mb-3 group-focus-within:text-orange-400 transition-colors duration-300">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 hover:border-orange-400"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div className="group">
                    <label className="block text-sm font-medium text-orange-300 mb-3 group-focus-within:text-orange-400 transition-colors duration-300">
                      University/College
                    </label>
                    <input
                      type="text"
                      name="university"
                      value={formData.university}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 hover:border-orange-400"
                      placeholder="Enter your university name"
                    />
                  </div>

                  <div className="group">
                    <label className="block text-sm font-medium text-orange-300 mb-3 group-focus-within:text-orange-400 transition-colors duration-300">
                      Expected Graduation Year
                    </label>
                    <input
                      type="number"
                      name="graduationYear"
                      value={formData.graduationYear}
                      onChange={handleInputChange}
                      min="2024"
                      max="2030"
                      className="w-full px-4 py-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 hover:border-orange-400"
                      placeholder="2024"
                    />
                  </div>

                  <div className="group">
                    <label className="block text-sm font-medium text-orange-300 mb-3 group-focus-within:text-orange-400 transition-colors duration-300">
                      Portfolio/Projects Link
                    </label>
                    <input
                      type="url"
                      name="portfolio"
                      value={formData.portfolio}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 hover:border-orange-400"
                      placeholder="GitHub, Behance, or personal website"
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-medium text-orange-300 mb-3 group-focus-within:text-orange-400 transition-colors duration-300">
                    Technical Skills *
                  </label>
                  <textarea
                    name="skills"
                    value={formData.skills}
                    onChange={handleInputChange}
                    required
                    rows="3"
                    className="w-full px-4 py-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 hover:border-orange-400 resize-none"
                    placeholder="List your technical skills, programming languages, tools, etc."
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-medium text-orange-300 mb-3 group-focus-within:text-orange-400 transition-colors duration-300">
                    Relevant Experience
                  </label>
                  <textarea
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 hover:border-orange-400 resize-none"
                    placeholder="Describe any relevant projects, internships, or work experience"
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-medium text-orange-300 mb-3 group-focus-within:text-orange-400 transition-colors duration-300">
                    Why are you interested in this internship? *
                  </label>
                  <textarea
                    name="motivation"
                    value={formData.motivation}
                    onChange={handleInputChange}
                    required
                    rows="4"
                    className="w-full px-4 py-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 hover:border-orange-400 resize-none"
                    placeholder="Tell us about your motivation, career goals, and what you hope to learn from this internship"
                  />
                </div>

                <div className="flex gap-6 pt-6">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 px-8 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-500/25"
                  >
                    Submit Application
                  </button>
                  <button
                    type="button"
                    onClick={closeForm}
                    className="flex-1 bg-gray-800 text-gray-300 py-4 px-8 rounded-xl font-semibold hover:bg-gray-700 hover:text-white transition-all duration-300 border border-gray-700 hover:border-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Internship; 