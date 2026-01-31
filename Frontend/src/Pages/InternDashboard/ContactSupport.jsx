import React, { useRef, useState } from 'react';
import emailjs from 'emailjs-com';
import { FaCheckCircle } from 'react-icons/fa';

export default function ContactSupport() {
  const form = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const sendEmail = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    if (!agreedToTerms) {
      setSubmitMessage({ type: 'error', text: 'Please agree to the Terms of Use and Privacy Policy.' });
      setIsSubmitting(false);
      return;
    }

    try {
      await emailjs.sendForm(
        'YOUR_SERVICE_ID', // Replace with your EmailJS Service ID
        'YOUR_TEMPLATE_ID', // Replace with your EmailJS Template ID
        form.current,
        'YOUR_USER_ID' // Replace with your EmailJS User ID (Public Key)
      );
      setSubmitMessage({ type: 'success', text: 'Your message has been sent successfully!' });
      form.current.reset();
      setAgreedToTerms(false);
    } catch (error) {
      console.error('EmailJS Error:', error);
      setSubmitMessage({ type: 'error', text: 'Failed to send message. Please try again later.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-6 lg:p-12 font-sans poppins-font">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* Left Section - Contact Info and Features */}
        <div className="p-8 lg:p-16 flex flex-col justify-center bg-gray-100 rounded-l-3xl">
          <h2 className="text-sm text-blue-600 uppercase tracking-widest mb-2">Contact Us</h2>
          <h1 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
            Get in Touch with Us
          </h1>
          <p className="text-gray-600 mb-8 text-lg">
            We're here to help. Whether you're interested in learning more about our
            services or need support, we're happy to assist you.
          </p>

          <div className="space-y-4 mb-10">
            {['Reliable Delivery', 'Comprehensive Token & Digest', 'Customizable Notifications', 'Real-Time Updates', 'Seamless Integration']
              .map((feature, index) => (
                <div key={index} className="flex items-center text-lg text-gray-700">
                  <FaCheckCircle className="text-green-500 mr-3 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
          </div>

          <div className="mt-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">General Contact Info</h3>
            <p className="text-gray-600 mb-2">
              We're here to help. Whether you're interested in learning more about our
              services or need support, we're happy to assist you.
            </p>
            <p className="text-gray-700 text-lg mb-1">
              <strong className="text-blue-600">Phone:</strong> +1-415-555-0199
            </p>
            <p className="text-gray-700 text-lg mb-1">
              <strong className="text-blue-600">Email:</strong> contact@innovatech.com
            </p>
            <p className="text-gray-700 text-lg">
              <strong className="text-blue-600">Location:</strong> Future Tech Institute 123 Innovation Way, Suite 200 San Francisco, CA 94107
            </p>
          </div>
        </div>

        {/* Right Section - Contact Form */}
        <div className="p-8 lg:p-16 bg-white rounded-r-3xl flex flex-col justify-center">
          <form ref={form} onSubmit={sendEmail} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="Albert"
                  required
                />
              </div>
              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="Susanto"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                id="email"
                name="user_email"
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                placeholder="albert@susanto.com"
                required
              />
            </div>

            <div>
              <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
              <input
                type="text"
                id="company_name"
                name="company_name"
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                placeholder="Name company"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Which best describes you?</label>
              <select
                id="description"
                name="description"
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                required
              >
                <option value="">Select one</option>
                <option value="intern">Intern</option>
                <option value="customer">Customer</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea
                id="message"
                name="message"
                rows="5"
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                placeholder="Write your message..."
                required
              ></textarea>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms_agreement"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="terms_agreement" className="ml-2 block text-sm text-gray-600">
                I agree to Fireside <a href="#" className="text-blue-600 hover:underline">Terms of Use</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
              </label>
            </div>

            {submitMessage && (
              <div
                className={`p-3 rounded-lg text-center ${submitMessage.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                  }`}
              >
                {submitMessage.text}
              </div>
            )}

            <button
              type="submit"
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting || !agreedToTerms}
            >
              {isSubmitting ? 'Sending...' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}