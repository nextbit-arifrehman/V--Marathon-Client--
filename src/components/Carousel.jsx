import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button.jsx';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const slides = [
    {
      id: 1,
      title: "Run Your First Marathon",
      subtitle: "Start your journey with beginner-friendly marathons",
      description: "Join thousands of first-time runners in marathons designed for beginners. Get professional training plans and community support.",
      image: "https://i.ibb.co/sJd4tv84/Whats-App-Image-2025-05-03-at-3-25-33-AM.jpg",
      buttonText: "Start Training"
    },
    {
      id: 2,
      title: "Conquer Challenging Routes",
      subtitle: "Push your limits with advanced marathons",
      description: "Experience world-class marathon routes that challenge even the most experienced runners. From mountain trails to city circuits.",
      image: "https://i.ibb.co/6c7vF9tZ/c89e6eb6-258e-45f7-8928-60cfb5dea85d.png",
      buttonText: "View Challenges"
    },
    {
      id: 3,
      title: "Join Our Community",
      subtitle: "Connect with runners worldwide",
      description: "Be part of a global community of passionate runners. Share experiences, get motivation, and celebrate achievements together.",
      image: "https://i.ibb.co/C57vhKNB/Leonardo-Vision-XL-A-hyperrealistic-image-of-a-young-adventure-2.jpg",
      buttonText: "Join Community"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Auto-play carousel
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleButtonClick = (buttonText) => {
    switch(buttonText) {
      case 'Start Training':
        if (currentUser) {
          navigate('/marathons');
        } else {
          navigate('/register');
        }
        break;
      case 'View Challenges':
        navigate('/marathons');
        break;
      case 'Join Community':
        if (currentUser) {
          navigate('/about');
        } else {
          navigate('/register');
        }
        break;
      default:
        navigate('/marathons');
    }
  };

  return (
    <div className="relative h-96 md:h-[500px] overflow-hidden bg-gray-900 dark:bg-gray-800">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
            index === currentSlide ? 'translate-x-0' : 
            index < currentSlide ? '-translate-x-full' : 'translate-x-full'
          }`}
        >
          <div className="relative h-full">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 dark:bg-opacity-60"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white px-4 max-w-4xl">
                <h1 className="text-3xl md:text-5xl font-bold mb-4">
                  {slide.title}
                </h1>
                <h2 className="text-lg md:text-2xl mb-4 text-blue-200">
                  {slide.subtitle}
                </h2>
                <p className="text-sm md:text-lg mb-8 text-gray-200 max-w-2xl mx-auto">
                  {slide.description}
                </p>
                <Button 
                  size="lg" 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => handleButtonClick(slide.buttonText)}
                >
                  {slide.buttonText}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all duration-200"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all duration-200"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentSlide
                ? 'bg-white'
                : 'bg-white bg-opacity-50 hover:bg-opacity-75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;