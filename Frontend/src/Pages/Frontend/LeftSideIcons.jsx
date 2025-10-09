import React , { useEffect, useState } from 'react';
import {
  FaGraduationCap, FaBookOpen, FaChalkboardTeacher, FaClipboardList,
  FaBriefcase, FaUserTie, FaChartLine, FaUsers,
  FaLaptopCode, FaCode, FaProjectDiagram
} from 'react-icons/fa';

const icons = [
  <FaGraduationCap />, <FaBookOpen />, <FaChalkboardTeacher />, <FaClipboardList />,
  <FaBriefcase />, <FaUserTie />, <FaChartLine />, <FaUsers />,
  <FaLaptopCode />, <FaProjectDiagram />, <FaCode />
];

import Typewriter from 'typewriter-effect';

export default function LeftIcons() {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % icons.length);
        setVisible(true);
      }, 400);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="z-10 flex flex-col justify-center items-center text-center min-h-screen px-4">
      
      {/* ICON */}
      <div className={`transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="text-[160px] sm:text-[250px] text-orange-400">
          {icons[current]}
        </div>
      </div>

      {/* TYPEWRITER TEXT */}
      <div className="font-bold mt-4 sm:mt-6 text-white text-lg sm:text-2xl min-h-[2.5rem] sm:min-h-[3rem] w-full max-w-md">
        <Typewriter
          options={{
            strings: [
                'Build your future with real-world skills.',
                'Launch your career in tech.',
                'Internships, roadmaps, and free resources.',
                'Code. Learn. Grow. Repeat.',
                'Master the tools used by top tech teams.',
                'Turn your passion into a profession.',
                'Intern today, lead tomorrow.',
                'From learning to earning — we’ve got you.',
                'Unlock your potential with the right roadmap.',
                'Practical skills. Real projects. Real impact.',
                'Your tech career starts here.',
                'Not just theory — real experience.',
                'Explore. Experiment. Excel.',
                'Learn from curated YouTube content.',
                'Education meets opportunity.',
                'Internships that actually teach.',
                'The bridge between learning and doing.',
                'Prepare for interviews, not just exams.',
                'Roadmaps tailored to your career goals.',
                'Learn smart. Grow fast. Land strong.'
            ],
            autoStart: true,
            loop: true,
            delay: 40,
            deleteSpeed: 20,
            pauseFor: 2000,
          }}
        />
      </div>
    </div>
  );
}