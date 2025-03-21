import axios from 'axios';
import React, { useState } from 'react';
import { backend_api } from "../../config/config.json";

const ContactUs = () => {
  const [data, setData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({}); // To hold validation errors

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
    setErrors({ ...errors, [name]: '' }); // Clear the error for the field being changed
  };

  const validate = () => {
    const newErrors = {};
    if (!data.name) newErrors.name = "Full Name is required.";
    if (!data.email) {
      newErrors.email = "Email Address is required.";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = "Email Address is invalid.";
    }
    if (!data.phone) newErrors.phone = "Phone Number is required.";
    if (!data.subject) newErrors.subject = "Subject is required.";
    if (!data.message) newErrors.message = "Message is required.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; // Stop submission if there are validation errors
    }

    const formData = new FormData();
    for (let key in data) {
      formData.append(key, data[key]);
    }

    try {
      const response = await axios.post(`${backend_api}/contact`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      // console.log(response);
      setSuccessMessage("Your message has been sent!");
      setData({ name: '', email: '', phone: '', subject: '', message: '' }); // Clear form fields

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-pink-100 to-purple-200 p-6 sm:p-12">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-lg">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-purple-600 mb-4 sm:mb-6">
          Get In Touch with Us
        </h2>
        <p className="text-center text-gray-600 mb-4 sm:mb-6">We’d love to hear from you! Fill out the form below to reach us.</p>

        {successMessage && (
          <div className="mb-4 p-4 text-green-700 bg-green-100 border border-green-400 rounded">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Name Field */}
          <div className="mb-4 sm:mb-5">
            <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
            <input
              type="text"
              value={data.name}
              name="name"
              onChange={handleChange}
              className={`block w-full bg-gray-100 text-gray-700 border-none rounded-lg py-2 sm:py-3 px-4 leading-tight focus:outline-none focus:ring-2 ${errors.name ? "focus:ring-red-400" : "focus:ring-purple-400"}`}
              required
            />
            {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
          </div>

          {/* Email Field */}
          <div className="mb-4 sm:mb-5">
            <label className="block text-gray-700 font-semibold mb-2">Email Address</label>
            <input
              type="email"
              value={data.email}
              name="email"
              onChange={handleChange}
              className={`block w-full bg-gray-100 text-gray-700 border-none rounded-lg py-2 sm:py-3 px-4 leading-tight focus:outline-none focus:ring-2 ${errors.email ? "focus:ring-red-400" : "focus:ring-purple-400"}`}
              required
            />
            {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
          </div>

          {/* Phone Field */}
          <div className="mb-4 sm:mb-5">
            <label className="block text-gray-700 font-semibold mb-2">Phone Number</label>
            <input
              type="tel"
              value={data.phone}
              name="phone"
              onChange={handleChange}
              className={`block w-full bg-gray-100 text-gray-700 border-none rounded-lg py-2 sm:py-3 px-4 leading-tight focus:outline-none focus:ring-2 ${errors.phone ? "focus:ring-red-400" : "focus:ring-purple-400"}`}
              required
            />
            {errors.phone && <p className="text-red-600 text-sm">{errors.phone}</p>}
          </div>

          {/* Subject Field */}
          <div className="mb-4 sm:mb-5">
            <label className="block text-gray-700 font-semibold mb-2">Subject</label>
            <input
              type="text"
              value={data.subject}
              name="subject"
              onChange={handleChange}
              className={`block w-full bg-gray-100 text-gray-700 border-none rounded-lg py-2 sm:py-3 px-4 leading-tight focus:outline-none focus:ring-2 ${errors.subject ? "focus:ring-red-400" : "focus:ring-purple-400"}`}
              required
            />
            {errors.subject && <p className="text-red-600 text-sm">{errors.subject}</p>}
          </div>

          {/* Message Field */}
          <div className="mb-4 sm:mb-5">
            <label className="block text-gray-700 font-semibold mb-2">Message</label>
            <textarea
              value={data.message}
              name="message"
              onChange={handleChange}
              className={`block w-full bg-gray-100 text-gray-700 border-none rounded-lg py-2 sm:py-3 px-4 leading-tight focus:outline-none focus:ring-2 ${errors.message ? "focus:ring-red-400" : "focus:ring-purple-400"}`}
              rows="4"
              required
            />
            {errors.message && <p className="text-red-600 text-sm">{errors.message}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-2 sm:py-3 px-6 rounded-lg transition duration-300 ease-in-out"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
