import React from 'react';
import { Home, Mail, Phone, MapPin, Calendar, FileText, Building, Clock, Facebook, Twitter, Linkedin, Info, Briefcase } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0a1f3d] text-gray-300 border-t border-[#123055]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Platform Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">InternHub</h3>
            <p className="text-sm text-gray-400">
              Empowering students through real-world internship opportunities. Bridge the gap between academia and industry.
            </p>
            <div className="flex space-x-3 mt-4">
              <a href="#" className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition">
                <Facebook className="w-4 h-4 text-white" />
              </a>
              <a href="#" className="w-9 h-9 bg-sky-400 rounded-full flex items-center justify-center hover:bg-sky-500 transition">
                <Twitter className="w-4 h-4 text-white" />
              </a>
              <a href="#" className="w-9 h-9 bg-blue-700 rounded-full flex items-center justify-center hover:bg-blue-800 transition">
                <Linkedin className="w-4 h-4 text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/" className="hover:text-cyan-400 flex items-center"><Home className="w-4 h-4 mr-2" />Home</a></li>
              <li><a href="/about" className="hover:text-cyan-400 flex items-center"><Info className="w-4 h-4 mr-2" />About</a></li>
              <li><a href="/services" className="hover:text-cyan-400 flex items-center"><Building className="w-4 h-4 mr-2" />Services</a></li>
              <li><a href="internship" className="hover:text-cyan-400 flex items-center"><Briefcase className="w-4 h-4 mr-2" />Browse Internships</a></li>
              <li><a href="/roadmap" className="hover:text-cyan-400 flex items-center"><Calendar className="w-4 h-4 mr-2" />Roadmap</a></li>
              <li><a href="#" className="hover:text-cyan-400 flex items-center"><Phone className="w-4 h-4 mr-2" />ContactUs</a></li>
            </ul>
          </div>

          {/* Student Resources */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Student Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-cyan-400">Enrollment Guide</a></li>
              <li><a href="#" className="hover:text-cyan-400">Forms & Documents</a></li>
              <li><a href="#" className="hover:text-cyan-400">Fee Structure</a></li>
              <li><a href="#" className="hover:text-cyan-400">Academic Support</a></li>
              <li><a href="#" className="hover:text-cyan-400">Career Guidance</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact Us</h4>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-center"><Mail className="w-4 h-4 mr-3 text-cyan-400" />info@internhub.edu</div>
              <div className="flex items-center"><Phone className="w-4 h-4 mr-3 text-cyan-400" />+92 300 7965044</div>
              <div className="flex items-start"><MapPin className="w-4 h-4 mr-3 mt-1 text-cyan-400" />University Campus, Faisalabad, Punjab, Pakistan</div>
              <div className="flex items-center"><Clock className="w-4 h-4 mr-3 text-cyan-400" />Mon - Fri: 9:00 AM - 5:00 PM</div>
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <div className="mt-10 pt-8 border-t border-[#123055]">
          <div className="bg-[#102542] rounded-lg p-6 shadow-lg">
            <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-cyan-400" />
              Important Notice
            </h4>
            <div className="space-y-2 text-sm text-gray-300">
              <p>
                <strong>Summer Session 2024-25 Enrollment:</strong> Submit your applications before the deadlines to secure your internship spot.
              </p>
              <p>• Submission window: <span className="text-cyan-400 font-medium">16-06-2025</span></p>
              <p>• Late fee deadline: <span className="text-cyan-400 font-medium">17-06-2025</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#08192e] border-t border-[#123055]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <div>© 2025 InternHub Platform. All rights reserved.</div>
            <div className="flex space-x-6 mt-2 md:mt-0">
              <a href="#" className="hover:text-cyan-400">Privacy Policy</a>
              <a href="#" className="hover:text-cyan-400">Terms of Service</a>
              <a href="#" className="hover:text-cyan-400">Support</a>
            </div>
          </div>
          <div className="mt-2 text-center text-xs text-gray-600">
            <span className="inline-block mr-4">Deputy Treasurer (Fee)</span>
            <span className="text-cyan-400">Academic Affairs Department</span>
          </div>
        </div>
      </div>
    </footer>
  );
}