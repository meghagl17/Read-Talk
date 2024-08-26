import { useState } from 'react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        setStatus('Message sent successfully!');
      } else {
        setStatus(result.message || 'Something went wrong.');
      }
    } catch (error) {
      setStatus('An error occurred.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col lg:flex-row pt-8 pb-8 items-center justify-between space-y-8 lg:space-y-0 lg:space-x-8 px-4 md:px-8 lg:px-0">
      
      {/* Left Side: "Contact Me" */}
      <div className="w-full lg:w-1/3 text-center lg:text-left">
        <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-800 mb-2" style={{ color: '#2e3b5f' }}>Contact Me</h2>
        <p className="text-lg text-gray-600">I would love to hear from you! Whether you have a question, feedback, or just want to say hi, feel free to drop me a message. I’ll get back to you as soon as possible.</p>
      </div>

      {/* Right Side: Form */}
      <div className="w-full lg:w-2/3">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full sm:w-96 bg-transparent border-b-2 border-[#2e3b5f] focus:border-[#2e3b5f] outline-none py-2 text-base sm:text-lg text-gray-800 placeholder-gray-500"
              required
            />
          </div>

          <div className="relative">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full sm:w-96 bg-transparent border-b-2 border-[#2e3b5f] focus:border-[#2e3b5f] outline-none py-2 text-base sm:text-lg text-gray-800 placeholder-gray-500"
              required
            />
          </div>

          <div className="relative">
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              placeholder="Your message"
              className="w-full sm:w-96 bg-transparent border-b-2 border-[#2e3b5f] focus:border-[#2e3b5f] outline-none py-2 text-base sm:text-lg text-gray-800 placeholder-gray-500"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="px-6 py-3 bg-[#3b4a73] text-white rounded-md shadow-md hover:bg-opacity-90 text-base sm:text-lg font-semibold" style={{ backgroundColor: '#2e3b5f' }}
          >
            Send
          </button>
          {status && <p className="mt-4 text-base sm:text-lg text-[#3b4a73]">{status}</p>}
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
