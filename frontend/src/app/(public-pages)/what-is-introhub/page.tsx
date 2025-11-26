'use client'

import { motion } from 'framer-motion'

const WhatIsIntroHubPage = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 py-24">
            <motion.div
                initial={{ opacity: 0, translateY: 40 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-16"
            >
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                    What is IntroHub?
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                    Your professional networking platform for meaningful connections
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16">
                <motion.div
                    initial={{ opacity: 0, translateX: -40 }}
                    animate={{ opacity: 1, translateX: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="space-y-6"
                >
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Streamline Your Professional Network
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        IntroHub is a comprehensive platform designed to help professionals
                        manage their contacts, facilitate introductions, and build meaningful
                        business relationships.
                    </p>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Whether you're looking to expand your network, request introductions,
                        or simply keep track of your professional connections, IntroHub
                        provides all the tools you need in one intuitive interface.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, translateX: 40 }}
                    animate={{ opacity: 1, translateX: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 border border-gray-200 dark:border-gray-700"
                >
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        Key Features
                    </h3>
                    <ul className="space-y-4">
                        {[
                            'Manage unlimited contacts',
                            'Send and track introduction requests',
                            'Advanced search and filtering',
                            'Network analytics and insights',
                            'Secure and private',
                        ].map((feature, index) => (
                            <li
                                key={index}
                                className="flex items-center gap-3 text-gray-700 dark:text-gray-300"
                            >
                                <span className="text-2xl">✓</span>
                                <span className="text-lg">{feature}</span>
                            </li>
                        ))}
                    </ul>
                </motion.div>
            </div>
        </div>
    )
}

export default WhatIsIntroHubPage


