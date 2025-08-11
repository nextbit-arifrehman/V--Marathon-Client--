import React from 'react';
import { Search, UserPlus, Calendar, Trophy } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      icon: Search,
      title: "Discover Marathons",
      description: "Browse through hundreds of marathons worldwide. Filter by location, distance, and difficulty level to find your perfect match."
    },
    {
      id: 2,
      icon: UserPlus,
      title: "Create Your Profile",
      description: "Sign up and create your runner profile. Track your progress, set goals, and connect with the running community."
    },
    {
      id: 3,
      icon: Calendar,
      title: "Register for Events",
      description: "Easy online registration for marathons. Secure payment processing and instant confirmation for your chosen events."
    },
    {
      id: 4,
      icon: Trophy,
      title: "Run & Achieve",
      description: "Follow our training plans, participate in your marathons, and celebrate your achievements with our community."
    }
  ];

  return (
    <section className="py-16 bg-white dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Getting started with your marathon journey is easier than you think. Follow these simple steps to begin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                className="text-center group hover:transform hover:scale-105 transition-all duration-300"
              >
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center mx-auto group-hover:bg-blue-700 dark:group-hover:bg-blue-400 transition-colors duration-300">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold text-sm">
                    {step.id}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {step.description}
                </p>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gray-200 dark:bg-gray-700 transform translate-x-4"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;