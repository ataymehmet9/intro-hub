'use client'

import React from 'react'
import SignupForm from './_components/SignupForm'

export default function SignupPage() {
  return (
    <div className="grid lg:grid-cols-2 h-screen bg-white dark:bg-gray-800">
      {/* Left side - Branding */}
      <div className="bg-no-repeat bg-cover py-6 px-16 flex-col justify-center items-center hidden lg:flex bg-primary rounded-r-3xl">
        <div className="flex flex-col items-center gap-12">
          <div className="text-center max-w-[550px]">
            <h1 className="text-white text-5xl font-bold mb-6">
              Join Intro-Hub
            </h1>
            <h2 className="text-white text-3xl font-semibold mb-8">
              Start Building Your Network Today
            </h2>
            <p className="text-white opacity-90 text-lg font-medium leading-relaxed">
              Create your free account and unlock the power of warm introductions. 
              Connect with professionals, expand your network, and grow your business 
              through trusted relationships.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-8 mt-8">
            <div className="text-center">
              <div className="text-white text-4xl font-bold mb-2">Free</div>
              <div className="text-white opacity-80 text-sm">Forever Plan</div>
            </div>
            <div className="text-center">
              <div className="text-white text-4xl font-bold mb-2">2 min</div>
              <div className="text-white opacity-80 text-sm">Setup Time</div>
            </div>
            <div className="text-center">
              <div className="text-white text-4xl font-bold mb-2">24/7</div>
              <div className="text-white opacity-80 text-sm">Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Signup Form */}
      <div className="flex flex-col justify-center items-center p-6 overflow-y-auto">
        <div className="w-full xl:max-w-[450px] px-8 max-w-[380px]">
          <SignupForm />
        </div>
      </div>
    </div>
  )
}


