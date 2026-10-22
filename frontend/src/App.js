/**
 * App.js
 * ---------------------------------------------------------
 * Root component. Sets up all the routes for the app.
 * Routes:
 *   /               → Public landing page
 *   /login          → Login form
 *   /registration   → Create account form
 *   /admin/*        → Admin workspace (protected)
 */

import { Routes, Route } from "react-router";

// Landing page sections
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import Process from "./components/Process";
import Carousel from "./components/Carousel";
import Footer from "./components/Footer";

// Auth pages
import Login from "./auth/login/Login";
import Registration from "./auth/registration/Registration";

// Admin workspace
import Admin from "./admin/Admin";

function PublicWebsite() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <Process />
        <Carousel />
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicWebsite />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registration" element={<Registration />} />
      <Route path="/admin/*" element={<Admin />} />
    </Routes>
  );
}

export default App;