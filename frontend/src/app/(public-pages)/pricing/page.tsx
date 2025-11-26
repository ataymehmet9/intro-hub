'use client'

import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'
import { useRouter } from 'next/navigation'

const PricingPage = () => {
    const router = useRouter()

    const plans = [
        {
            name: 'Free',
            price: '$0',
            period: 'forever',
            description: 'Perfect for getting started',
            features: [
                'Up to 50 contacts',
                '5 introduction requests per month',
                'Basic search',
                'Email support',
            ],
            cta: 'Get Started',
            highlighted: false,
        },
        {
            name: 'Professional',
            price: '$29',
            period: 'per month',
            description: 'For active networkers',
            features: [
                'Unlimited contacts',
                'Unlimited introduction requests',
                'Advanced search & filters',
                'Network analytics',
                'Priority support',
                'Custom tags & categories',
            ],
            cta: 'Start Free Trial',
            highlighted: true,
        },
        {
            name: 'Enterprise',
            price: 'Custom',
            period: 'contact us',
            description: 'For teams and organizations',
            features: [
                'Everything in Professional',
                'Team collaboration',
                'Admin dashboard',
                'API access',
                'Dedicated account manager',
                'Custom integrations',
            ],
            cta: 'Contact Sales',
            highlighted: false,
        },
    ]

    return (
        <div className="max-w-7xl mx-auto px-4 py-24">
            <motion.div
                initial={{ opacity: 0, translateY: 40 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-16"
            >
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                    Simple, Transparent Pricing
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                    Choose the plan that fits your networking needs
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                {plans.map((plan, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, translateY: 40 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className={`rounded-2xl p-8 border ${
                            plan.highlighted
                                ? 'bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-500 dark:border-blue-400 shadow-xl scale-105'
                                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                        }`}
                    >
                        {plan.highlighted && (
                            <div className="text-center mb-4">
                                <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                                    Most Popular
                                </span>
                            </div>
                        )}
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            {plan.name}
                        </h3>
                        <div className="mb-4">
                            <span className="text-4xl font-bold text-gray-900 dark:text-white">
                                {plan.price}
                            </span>
                            <span className="text-gray-600 dark:text-gray-400 ml-2">
                                {plan.period}
                            </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            {plan.description}
                        </p>
                        <Button
                            variant={plan.highlighted ? 'solid' : 'default'}
                            block
                            size="lg"
                            onClick={() => router.push('/signup')}
                            className="mb-6"
                        >
                            {plan.cta}
                        </Button>
                        <ul className="space-y-3">
                            {plan.features.map((feature, featureIndex) => (
                                <li
                                    key={featureIndex}
                                    className="flex items-center gap-3 text-gray-700 dark:text-gray-300"
                                >
                                    <span className="text-green-500 text-xl">✓</span>
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

export default PricingPage


