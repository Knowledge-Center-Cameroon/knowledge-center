import React from "react";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Raunaq Jain",
    location: "India",
    program: "Applied Data Institute",
    year: "2022",
    quote:
      "To be able to build relationships with people you’ve met only on the internet, and then feel like you’ve known each other for years when you finally meet in person – it is a feat only Equitech Futures could accomplish.",
  },
  {
    name: "Aryan Gupta",
    location: "India",
    program: "",
    year: "2021",
    quote:
      "One of the biggest things Equitech Futures focuses on, and I find really lacking in this world right now, is collaboration over competition. The community came forward to support me in being bold about my vision and paving a different path for myself. I realized that there were more people supporting me and celebrating me rather than pushing me down.",
  },
  {
    name: "Montse Madrigal",
    location: "United States",
    program: "Equitech Scholars",
    year: "2021",
    quote:
      "I was an English major, and now I work in tech. I wanted a space where I could learn data science and AI and figure out how to apply these tools to real-world problems. Equitech Futures was the perfect fit.",
  },
];

const Testimonials = () => {
  return (
    <section className="bg-black text-white py-20">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold">
            Hear from our alumni
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-900 p-8 rounded-lg"
            >
              <p className="mb-6">"{testimonial.quote}"</p>
              <p className="font-bold">{testimonial.name}</p>
              <p>
                {testimonial.location} - {testimonial.program}{" "}
                {testimonial.year}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
