import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' , skills: '' , number: '' , socials: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Message sent!');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-orange-500 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        className="bg-black rounded-2xl p-8 w-full max-w-2xl"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-orange-500">Contact Us</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            required
            className="w-full p-3 border-2 border-orange-500 rounded-xl focus:outline-none text-orange-500 outline-none"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
            required
            className="w-full p-3 border-2 border-orange-500 rounded-xl focus:outline-none outline-none text-orange-500"
          />
          <input
            type="number"
            name="number"
            value={formData.number}
            onChange={handleChange}
            placeholder="Active Phone Number"
            required
            className="w-full p-3 border-2 border-orange-500 rounded-xl focus:outline-none outline-none text-orange-500"
          />
          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="Whats skills you have?"
            required
            className="w-full p-3 border-2 border-orange-500 rounded-xl focus:outline-none outline-none text-orange-500"
          />
          <input
            type="url"
            name="socials"
            value={formData.socials}
            onChange={handleChange}
            placeholder="Your Social Profile (LinkedIn, GitHub, etc.) - optional"
            className="w-full p-3 border-2 border-orange-500 rounded-xl focus:outline-none outline-none text-orange-500"
            />
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell me about yourself"
            rows="5"
            required
            className="w-full p-3 border-2 border-orange-500 rounded-xl focus:outline-none text-orange-500 "
          ></textarea>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-black text-orange-500 py-3 rounded-xl font-semibold transition-colors border-2 border-orange-500 cursor-pointer" 
          >
            Send Message
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
}