import React from "react";
import { motion } from "framer-motion";

const lmsData = {
  logo: {
    src: "/assets/logo.png", // Adjust path as necessary
    alt: "LevelUP Logo",
    title: "LevelUP",
    url: "/",
  },
  tagline: "Empowering Learners. Enabling Instructors.",
  menuItems: [
    {
      title: "Courses",
      links: [
        { text: "Browse All", url: "/courses" },
        { text: "Free Courses", url: "/courses/free" },
        { text: "Featured", url: "/courses/featured" },
        { text: "Learning Paths", url: "/learning-paths" },
      ],
    },
    {
      title: "Instructors",
      links: [
        { text: "Become an Instructor", url: "/instructor-join" },
        { text: "Dashboard", url: "/dashboard" },
        { text: "FAQ", url: "/faq" },
      ],
    },
    {
      title: "Company",
      links: [
        { text: "About", url: "/about" },
        { text: "Careers", url: "/careers" },
        { text: "Contact", url: "/contact" },
        { text: "Blog", url: "/blog" },
      ],
    },
    {
      title: "Connect",
      links: [
        { text: "Twitter", url: "#" },
        { text: "LinkedIn", url: "#" },
        { text: "Instagram", url: "#" },
      ],
    },
  ],
  copyright: "© 2025 LevelUP. All rights reserved.",
  bottomLinks: [
    { text: "Terms & Conditions", url: "/terms" },
    { text: "Privacy Policy", url: "/privacy" },
  ],
};
export default function LMSFooter() {
  return (
    <footer className="bg-[#0d0d0d] text-gray-400 px-6 pt-20 pb-10">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 border-b border-gray-700 pb-10">
        <div className="md:col-span-1">
          <a href={lmsData.logo.url} className="flex items-center gap-2 mb-4">
            <img src={lmsData.logo.src} alt={lmsData.logo.alt} className="h-8" />
            <span className="text-xl font-bold text-white">{lmsData.logo.title}</span>
          </a>
          <p className="text-sm">{lmsData.tagline}</p>
        </div>

        {lmsData.menuItems.map((section, idx) => (
          <div key={idx}>
            <h4 className="text-white font-semibold mb-3">{section.title}</h4>
            <ul className="space-y-2 text-sm">
              {section.links.map((link, i) => (
                <li key={i}>
                  <a href={link.url} className="hover:text-indigo-400 transition">{link.text}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="flex flex-col md:flex-row items-center justify-between mt-10 gap-6">
        <p className="text-sm">{lmsData.copyright}</p>
        <div className="flex space-x-4 text-sm">
          {lmsData.bottomLinks.map((link, idx) => (
            <a key={idx} href={link.url} className="hover:text-indigo-400 transition">
              {link.text}
            </a>
          ))}
        </div>
      </div>
      <motion.h1
        whileHover={{ filter: "url(#pixelate)" }}
        className="mt-12 text-center text-[3rem] md:text-[4rem] font-extrabold text-white tracking-widest select-none transition duration-300"
      >
        LEVELUP
      </motion.h1>

      <svg className="hidden">
        <filter id="pixelate" x="0" y="0">
          <feFlood result="flood" flood-color="black" />
          <feComposite in="SourceGraphic" in2="flood" operator="in" />
          <feMorphology operator="dilate" radius="2" />
          <feTurbulence type="turbulence" baseFrequency="0.05" numOctaves="2" result="turbulence" />
          <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="10" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
    </footer>
  );
}

