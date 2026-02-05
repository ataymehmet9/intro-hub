import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { getSession } from '@/lib/auth-client'
import Button from '@/components/ui/Button'
import PublicHeader from '@/components/shared/PublicHeader'

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    const { data: token } = await getSession()

    if (token) {
      throw redirect({
        to: '/dashboard',
      })
    }
  },
  component: HomePage,
})

const TextGenerateEffect = ({
    words,
    wordClassName,
    wordsCallbackClass,
}: {
    words: string
    wordClassName?: string
    wordsCallbackClass?: (payload: { word: string }) => string
}) => {
    const wordsArray = words.split(' ')

    return (
        <motion.div
            initial={{ opacity: 0, translateY: 40 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ duration: 0.5 }}
            className={wordClassName}
        >
            {wordsArray.map((word, idx) => (
                <motion.span
                    key={word + idx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: idx * 0.075 }}
                    className={wordsCallbackClass?.({ word }) || ''}
                >
                    {word}{' '}
                </motion.span>
            ))}
        </motion.div>
    )
}

function HomePage() {
  const navigate = useNavigate()

  const handleGetStarted = () => {
    navigate({ to: '/dashboard' })
  }

  const handleLearnMore = () => {
    navigate({ to: '/contacts' })
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <PublicHeader />
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 flex min-h-screen flex-col items-center justify-between">
        <div className="flex flex-col min-h-screen pt-20 md:pt-40 relative overflow-hidden">
          <div>
            <TextGenerateEffect
              wordClassName="text-2xl md:text-4xl lg:text-8xl font-bold max-w-7xl mx-auto text-center mt-6 relative z-10"
              words="Connect Professionally with the Perfect Network"
              wordsCallbackClass={({ word }) => {
                if (word === 'Perfect') {
                  return 'bg-gradient-to-r from-[#2feaa8] to-[#0eb9ce] bg-clip-text text-transparent'
                }

                if (word === 'Network') {
                  return 'bg-gradient-to-r from-[#02bcca] to-[#028cf3] bg-clip-text text-transparent'
                }

                return 'text-gray-900 dark:text-white'
              }}
            />
            <motion.p
              initial={{ opacity: 0, translateY: 40 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
              className="text-center mt-6 text-base md:text-xl text-gray-600 dark:text-gray-400 max-w-5xl mx-auto relative z-10 font-normal"
            >
              IntroHub is your professional networking platform that
              streamlines connections and introductions. Manage your
              contacts, send introduction requests, and build meaningful
              relationships with ease. Designed for professionals who
              value authentic networking.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, translateY: 40 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ duration: 0.3, delay: 0.6 }}
              className="flex items-center gap-4 justify-center mt-10 relative z-10"
            >
              <Button
                variant="solid"
                onClick={handleGetStarted}
                size="lg"
              >
                Preview
              </Button>
              <Button onClick={handleLearnMore} size="lg">
                Get this template
              </Button>
            </motion.div>
          </div>

          {/* Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, translateY: 60 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="p-2 lg:p-4 border border-gray-200 bg-gray-50 dark:bg-gray-700 dark:border-gray-700 rounded-2xl lg:rounded-[32px] mt-20 relative"
          >
            <div className="absolute inset-x-0 bottom-0 h-40 w-full bg-gradient-to-b from-transparent via-white to-white dark:via-gray-900 dark:to-gray-900 scale-[1.1] pointer-events-none" />
            <div className="bg-white dark:bg-gray-800 dark:border-gray-700 border border-gray-200 rounded-[24px] overflow-hidden">
              {/* Dashboard Preview Content */}
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-900 dark:bg-white flex items-center justify-center">
                      <span className="text-white dark:text-gray-900 font-bold text-lg">
                        IH
                      </span>
                    </div>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      IntroHub
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Overview
                    </span>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                        Total Contacts
                      </span>
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center">
                        <span className="text-blue-600 dark:text-blue-400">
                          👥
                        </span>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                      247
                    </div>
                    <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                      +12% from last month
                    </div>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-100 dark:border-green-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                        Total order
                      </span>
                      <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center">
                        <span className="text-green-600 dark:text-green-400">
                          📨
                        </span>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                      7,234
                    </div>
                    <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                      -2.8% from last month
                    </div>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 border border-purple-100 dark:border-purple-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                        Impression
                      </span>
                      <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-800 flex items-center justify-center">
                        <span className="text-purple-600 dark:text-purple-400">
                          👁️
                        </span>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                      3.1M
                    </div>
                    <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                      +4.6% from last month
                    </div>
                  </div>
                </div>

                {/* Chart Area Placeholder */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      EM
                    </h3>
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        Sales target
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent"></div>
                        <span className="text-sm font-semibold text-blue-500">
                          75%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="h-32 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg relative overflow-hidden">
                    <svg
                      className="absolute bottom-0 w-full h-full"
                      viewBox="0 0 400 100"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0,50 Q100,20 200,40 T400,30"
                        fill="none"
                        stroke="rgb(59, 130, 246)"
                        strokeWidth="3"
                      />
                    </svg>
                  </div>
                </div>

                {/* Top Product Section */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Top product
                    </h3>
                    <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                      View all
                    </button>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-700 rounded-lg">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-400 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white">
                        Maneki Neko Poster
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Sold: 1249
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                      +16.2%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, translateY: 40 }}
          whileInView={{ opacity: 1, translateY: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose IntroHub?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Everything you need to manage your professional network
            effectively
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: '🔍',
              title: 'Smart Contact Search',
              description:
                'Quickly find and filter contacts based on industry, location, skills, and more.',
            },
            {
              icon: '📬',
              title: 'Introduction Requests',
              description:
                'Send and manage introduction requests with ease. Track status and follow up efficiently.',
            },
            {
              icon: '📊',
              title: 'Network Analytics',
              description:
                'Gain insights into your networking activities with comprehensive analytics and reports.',
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, translateY: 40 }}
              whileInView={{ opacity: 1, translateY: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}