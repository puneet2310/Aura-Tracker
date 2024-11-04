import React from 'react';

const AboutUs = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">About Us</h1>
        <p className="text-gray-600 mb-4">
          Welcome to <span className="font-semibold text-indigo-600">Pro-track</span>! We are dedicated to empowering students, professionals, and lifelong learners to achieve their academic goals through organized planning and progress tracking.
        </p>
        <p className="text-gray-600 mb-4">
          At Pro-track, we understand the importance of setting clear and achievable goals. Our platform provides you with tools to manage your academic plans, track your achievements, and stay motivated on your journey to success. From setting up academic goals to accessing leaderboards for healthy competition, Pro-track is here to enhance your productivity and performance.
        </p>
        <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-3">Our Mission</h2>
        <p className="text-gray-600 mb-4">
          Our mission is to create an engaging platform that helps users:
        </p>
        <ul className="list-disc list-inside text-gray-600 mb-4">
          <li>Set clear academic and personal growth goals.</li>
          <li>Track progress and celebrate achievements.</li>
          <li>Motivate themselves through interactive tools and leaderboards.</li>
          <li>Connect with a community that shares the same drive for excellence.</li>
        </ul>
        <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-3">Why Choose Us?</h2>
        <p className="text-gray-600 mb-4">
          Pro-track offers a user-friendly interface, customizable goal-setting features, and a seamless experience that supports your educational journey. Our commitment to providing top-notch tools ensures that you stay on track and reach new heights in your academic pursuits.
        </p>
        <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-3">Our Team</h2>
        <p className="text-gray-600 mb-4">
          We are a team of educators, developers, and creative minds passionate about making learning more structured and motivating for everyone. Our combined expertise drives our mission to enhance how individuals manage and achieve their academic goals.
        </p>
        <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-3">Get In Touch</h2>
        <p className="text-gray-600">
          If you have any questions, feedback, or suggestions, feel free to reach out to us. Your success is our priority, and we’re here to support you every step of the way.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
