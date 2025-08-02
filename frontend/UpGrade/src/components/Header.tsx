'use client';

import React from 'react';
import Link from 'next/link';
import { GraduationCap, User } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-900">UpGrade</span>
          </Link>

          <nav className="hidden md:flex space-x-8">
            <Link href="/createList" className="text-gray-700 hover:text-indigo-600">
              Create Listing
            </Link>
            <Link href="/uploadNotes" className="text-gray-700 hover:text-indigo-600">
              Upload Notes
            </Link>
            <Link href="/tutors" className="text-gray-700 hover:text-indigo-600">
              Tutors
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;