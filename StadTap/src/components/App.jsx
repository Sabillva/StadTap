import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "../fonts/Ravio-Regular.ttf";
import Header from "./Header.jsx";
import Hero from "./Hero.jsx";
import LogoTicker from "./LogoTicker.jsx";
import Introduction from "./Introduction.jsx";
import Features from "./Features.jsx";
import Matches from "./Matches.jsx";
import Testimonials from "./Testimonials.jsx";
import Faqs from "./Faqs.jsx";
import Words from "./Words.jsx";
import Contact from "./Contact.jsx";
import Footer from "./Footer.jsx";

import SignUp from "../../../MainPage/src/pages/SignUp.jsx";
import Login from "../../../MainPage/src/pages/Login.jsx";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero />
              <LogoTicker />
              <Introduction />
              <Features />
              <Matches />
              <Words />
              <Testimonials />
              <Faqs />
              <Contact />
              <Footer />
            </>
          }
        />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
