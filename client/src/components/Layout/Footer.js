import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer mt-auto py-3 bg-light">
      <div className="container text-center">
        <h1 className="fs-5 display-2">DEVELOPED BY RAVI RAJ</h1>
        <p className="mt-3">
          <Link to="/about">About</Link> | <Link to="/contact">Contact</Link> | <Link to="/policy">Privacy Policy</Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
