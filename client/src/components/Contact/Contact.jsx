import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';
// import { Link } from 'react-router-dom';
// import Button from '../Button';

function Contact() {

  
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        form.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )
      .then(
        () => {
          console.log('SUCCESS!');
          console.log('Message Sent');
          e.target.reset();
        },
        (error) => {
          console.log('FAILED...', error.text);
          console.log(error);
          e.target.reset();
        },
      );
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Us</h2>
        <p className="text-gray-600 mb-6">
          Have questions or feedback? Send us a message below.
        </p>
        <form ref={form} onSubmit={sendEmail} className="space-y-4">
          <div>
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="user_name"
      
              className="w-full px-4 py-2 mt-1 text-gray-800 border rounded-lg focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="user_email"
              className="w-full px-4 py-2 mt-1 text-gray-800 border rounded-lg focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Subject</label>
            <input
              type="text"
              name="subject"
              className="w-full px-4 py-2 mt-1 text-gray-800 border rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-gray-700">Message</label>
            <textarea
              name="message"
              rows="4"
              className="w-full px-4 py-2 mt-1 text-gray-800 border rounded-lg focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-medium py-2 rounded-lg hover:bg-blue-500 transition duration-300"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}

export default Contact;
