import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { PublicNav } from '~/components/layout/PublicNav'

export const Route = createFileRoute('/what-is-introhub')({
  component: WhatIsIntroHubPage,
})

function WhatIsIntroHubPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <PublicNav />
      <div className="max-w-7xl mx-auto px-4 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, translateY: 40 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            What is IntroHub?
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Your professional networking platform designed to streamline connections and introductions
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, translateX: -40 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Professional Networking Made Simple
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              IntroHub is a comprehensive platform that helps professionals manage their network,
              send introduction requests, and build meaningful business relationships. Whether you're
              looking to expand your network or help others connect, IntroHub makes it effortless.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Our intuitive interface and powerful features ensure that every introduction is handled
              professionally and efficiently, saving you time while maximizing the value of your network.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, translateX: 40 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8"
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Key Features
            </h3>
            <ul className="space-y-4">
              {[
                'Smart contact management and organization',
                'Easy introduction request workflow',
                'Track request status in real-time',
                'Secure and private communication',
                'Analytics and insights on your network',
              ].map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

// Made with Bob