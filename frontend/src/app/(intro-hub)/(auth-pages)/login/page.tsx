'use client'

import React from 'react'
import LoginForm from './_components/LoginForm'

export default function LoginPage() {
  return (
    <div className="grid lg:grid-cols-2 h-screen bg-white dark:bg-gray-800">
      {/* Left side - Branding */}
      <div className="bg-no-repeat bg-cover py-6 px-16 flex-col justify-center items-center hidden lg:flex bg-primary rounded-r-3xl">
        <div className="flex flex-col items-center gap-12">
          <div className="text-center max-w-[550px]">
            <h1 className="text-white text-5xl font-bold mb-6">
              Intro-Hub
            </h1>
            <h2 className="text-white text-3xl font-semibold mb-8">
              Connect Through Warm Introductions
            </h2>
            <p className="text-white opacity-90 text-lg font-medium leading-relaxed">
              Build meaningful business relationships through trusted connections. 
              Intro-Hub makes it easy to request and manage professional introductions 
              within your network.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-8 mt-8">
            <div className="text-center">
              <div className="text-white text-4xl font-bold mb-2">1000+</div>
              <div className="text-white opacity-80 text-sm">Connections Made</div>
            </div>
            <div className="text-center">
              <div className="text-white text-4xl font-bold mb-2">500+</div>
              <div className="text-white opacity-80 text-sm">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-white text-4xl font-bold mb-2">95%</div>
              <div className="text-white opacity-80 text-sm">Success Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex flex-col justify-center items-center p-6">
        <div className="w-full xl:max-w-[450px] px-8 max-w-[380px]">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}

// Made with Bob
