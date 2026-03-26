'use client'

import { Linkedin, Twitter } from 'lucide-react'

const teamMembers = [
  {
    id: 1,
    name: 'Make Jhane',
    role: 'Finance Manager',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=600&fit=crop',
    socialLinks: {
      linkedin: '#',
      twitter: '#'
    }
  },
  {
    id: 2,
    name: 'Jinny Owen',
    role: 'Marketing Manager',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=600&fit=crop',
    socialLinks: {
      linkedin: '#',
      twitter: '#'
    }
  },
  {
    id: 3,
    name: 'Mia Lobey',
    role: 'Accountant',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&h=600&fit=crop',
    socialLinks: {
      linkedin: '#',
      twitter: '#'
    }
  }
]

export function TeamSection() {
  return (
    <section className="w-full bg-white dark:bg-slate-950 py-12 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16 animate-fadeInUp">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white text-balance">
            Meet Our Team
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            We write various things related to furniture, from tips and what things I need to pay attention to when choosing furniture
          </p>
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
          {teamMembers.map((member, index) => (
            <div 
              key={member.id}
              className="group animate-fadeInUp"
              style={{animationDelay: `${index * 0.15}s`}}
            >
              {/* Image Container */}
              <div className="relative mb-6 overflow-hidden rounded-xl aspect-[3/4]">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Social Links Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a
                    href={member.socialLinks.linkedin}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a
                    href={member.socialLinks.twitter}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-blue-400 hover:text-white transition-all"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                </div>
              </div>

              {/* Member Info */}
              <div className="text-center">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                  {member.name}
                </h3>
                <p className="text-blue-600 dark:text-blue-400 text-sm md:text-base font-medium mt-1">
                  {member.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
