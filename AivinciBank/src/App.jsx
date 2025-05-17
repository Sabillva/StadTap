"use client";

import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./components/Header";
import Hero from "./components/Hero";
import SimpleTransitions from "./components/SimpleTransitions";
import MobileApp from "./components/MobileApp";
import Calculator from "./components/Calculator";
import CardOrder from "./components/CardOrder";
import OtherServices from "./components/OtherServices";
import News from "./components/News";
import Services from "./components/Services";
import Faq from "./components/Faq";
import Footer from "./components/Footer";
import ChatBot from "./components/ChatBot";
import ScrollToTop from "./components/ScrollToTop";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { ThemeProvider } from "./components/ThemeContext";

function App() {
  const [customerType, setCustomerType] = useState("fiziki");

  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-background text-foreground">
          <Header
            customerType={customerType}
            setCustomerType={setCustomerType}
          />

          <Routes>
            <Route
              path="/"
              element={
                <main className="flex-grow">
                  {customerType === "fiziki" ? (
                    <>
                      <Hero />
                      <SimpleTransitions />
                      <MobileApp />
                      <Calculator />
                      <CardOrder />
                      <OtherServices />
                      <News />
                      <Services />
                      <Faq />
                    </>
                  ) : (
                    <div className="container mx-auto mt-16 py-40 text-center">
                      <h2 className="text-3xl font-bold">Biznes səhifəsi</h2>
                      <p className="mt-4">Biznes səhifəsi hazırlanır...</p>
                    </div>
                  )}
                </main>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          <Footer />
          <ChatBot />
          <ScrollToTop />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
