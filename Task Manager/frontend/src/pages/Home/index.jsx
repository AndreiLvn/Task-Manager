import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Slider from "react-slick";
import "./style.css";

const Home = () => {
  const testimonials = [
    {
      name: "Maria",
      feedback:
        "Task Manager m-a ajutat sa imi organizez proiectele de la facultate!",
    },
    {
      name: "Andrei",
      feedback: "Imi place ca primesc email inainte de termen. Foarte util.",
    },
    {
      name: "Alex",
      feedback:
        "Folosesc aplicatia zilnic pentru freelancing si sunt foarte multumit.",
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  const token = localStorage.getItem("token");
  const startLink = token ? "/tasks" : "/login";

  return (
    <div className="home">
      <motion.section
        className="hero"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <h1>Task Manager</h1>
        <p>
          Organizeaza-ti sarcinile, fii productiv, primeste remindere automate.
        </p>
        <Link to={startLink} className="cta-button">
          Incepe acum
        </Link>
      </motion.section>

      <motion.section
        className="features"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <h2>Functionalitati</h2>
        <ul>
          <li>✅ Creare, editare si stergere taskuri</li>
          <li>📩 Remindere automate pe email</li>
          <li>📎 Incarcare fisiere atasate pentru fiecare task</li>
          <li>⏰ Frecventa personalizata pentru notificari</li>
        </ul>
      </motion.section>

      <motion.section
        className="about"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <h2>De ce Task Manager?</h2>
        <p>
          Task Manager te ajuta sa iti gestionezi eficient sarcinile zilnice,
          oferind control complet, notificari automate si o interfata
          prietenoasa. Ideal pentru studenti, freelanceri sau echipe mici.
        </p>
      </motion.section>

      <motion.section
        className="showcase"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      ></motion.section>

      <motion.section
        className="testimonials"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <h2>Parerile utilizatorilor</h2>
        <Slider {...settings}>
          {testimonials.map((t, index) => (
            <div key={index} className="testimonial">
              <p>"{t.feedback}"</p>
              <strong>- {t.name}</strong>
            </div>
          ))}
        </Slider>
      </motion.section>

      <footer className="footer">
        <p>
          &copy; {new Date().getFullYear()} Task Manager. Toate drepturile
          rezervate.
        </p>
      </footer>
    </div>
  );
};

export default Home;
