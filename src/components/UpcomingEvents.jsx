
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card.jsx';
import { Calendar, MapPin, Users } from 'lucide-react';

const UpcomingEvents = () => {
  const upcomingEvents = [
    {
      id: 1,
      title: "Spring Training Marathon",
      date: "2024-03-30",
      location: "Phoenix, AZ",
      participants: 500
    },
    {
      id: 2,
      title: "Cherry Blossom Run",
      date: "2024-04-05",
      location: "Washington, DC",
      participants: 1200
    },
    {
      id: 3,
      title: "Desert Challenge",
      date: "2024-04-12",
      location: "Las Vegas, NV",
      participants: 800
    },
    {
      id: 4,
      title: "Forest Trail Marathon",
      date: "2024-04-25",
      location: "Portland, OR",
      participants: 600
    },
    {
      id: 5,
      title: "Sunset Beach Run",
      date: "2024-05-03",
      location: "Miami, FL",
      participants: 900
    },
    {
      id: 6,
      title: "Mountain Peak Challenge",
      date: "2024-05-15",
      location: "Denver, CO",
      participants: 700
    }
  ];

  return (
    <section className="py-16 bg-white dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Upcoming Events
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Don't miss these exciting marathon events coming up
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingEvents.map((event) => (
            <Card key={event.id} className="hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900 dark:text-white">{event.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <Calendar size={16} />
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <MapPin size={16} />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <Users size={16} />
                  <span>{event.participants} participants expected</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UpcomingEvents;
