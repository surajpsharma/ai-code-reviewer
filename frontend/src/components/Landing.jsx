// Landing.jsx
"use client";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import {
  Mail,
  Code,
  FileCode,
  GitBranch,
  GitPullRequest,
  Shield,
  Zap,
  CheckCircle,
} from "lucide-react";
import lockImage from "../assets/code.png";
import { useState, useEffect } from "react";
import axios from "axios"; // Import axios
const backendURL = import.meta.env.VITE_BACKEND_URL;

export default function CodeReviewLanding() {
  //use nagivate
  const navigate = useNavigate();

  // State for scroll detection
  const [isScrolled, setIsScrolled] = useState(false);
  const [token, settoken] = useState(false); // Changed to represent authentication status
  const [refresh, setrefresh] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true); // New state for managing auth loading

  // State for contact form
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Handle scroll event for navbar styling
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Ensure all Axios requests from this component send cookies
    axios.defaults.withCredentials = true;

    const checkAuthentication = async () => {
      setLoadingAuth(true); // Start loading state

      try {
        const response = await axios.post(
          `${backendURL}/api/tokengetter`,
          null, // No request body needed
          { withCredentials: true }
        );

        console.log("✅ Auth Check Response:", response.data);

        if (response.data.success) {
          settoken(true); // User is authenticated
          // Optional: Store user data if needed
          // setUserData(response.data.decode);
        } else {
          console.log("User is not authenticated");
          settoken(false);
        }
      } catch (error) {
        // Log any unexpected errors that might still occur
        console.error("Authentication check error:", error.message);
        settoken(false); // Treat as unauthenticated
      } finally {
        setLoadingAuth(false); // Stop loading state
      }
    };

    checkAuthentication();
  }, [refresh]);

  // Logout handler
  const handleLogout = async () => {
    console.log("logout..");

    try {
      const response = await axios.post(`${backendURL}/api/logout`, null, {
        withCredentials: true,
      });

      if (response.data.success === true) {
        settoken(false); // Clear authentication status
        setrefresh((prev) => !prev); // Toggle refresh to trigger token check
        navigate("/login"); // Redirect to login page
      }
    } catch (error) {
      console.error(
        "Error during logout:",
        error.response ? error.response.data : error.message
      );
    }
  };

  // Form handlers
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${backendURL}/api/form/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        alert("Message sent successfully!");
      } else {
        alert("Failed to send message.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Features data
  const features = [
    {
      icon: <Zap className="h-6 w-6 text-primary" />,
      title: "Automated Analysis",
      desc: "AI-powered code analysis that identifies bugs, security vulnerabilities, and performance issues in real-time.",
    },
    {
      icon: <Shield className="h-6 w-6 text-primary" />,
      title: "Security Scanning",
      desc: "Detect security vulnerabilities and suggest fixes before they reach production environments.",
    },
    {
      icon: <FileCode className="h-6 w-6 text-primary" />,
      title: "Code Quality",
      desc: "Enforce coding standards and best practices across your entire codebase with customizable rules.",
    },
    {
      icon: <GitPullRequest className="h-6 w-6 text-primary" />,
      title: "PR Integration",
      desc: "Automatically review pull requests and provide inline feedback directly in your GitHub, GitLab, or Bitbucket workflow.",
    },
    {
      icon: <Code className="h-6 w-6 text-primary" />,
      title: "Language Support",
      desc: "Support for over 40 programming languages and frameworks including JavaScript, TypeScript, Python, Java, and more.",
    },
    {
      icon: <GitBranch className="h-6 w-6 text-primary" />,
      title: "Custom Rules",
      desc: "Create custom rules and checks specific to your project requirements and coding standards.",
    },
  ];

  // Testimonials data
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Senior Developer at TechCorp",
      review:
        "CodeReviewer has transformed our development process. We catch bugs early and our code quality has improved dramatically.",
    },
    {
      name: "Michael Chen",
      role: "Lead Engineer at StartupX",
      review:
        "The AI-powered suggestions are incredibly accurate. It's like having an expert code reviewer available 24/7.",
    },
    {
      name: "Alex Rodriguez",
      role: "CTO at DevShop",
      review:
        "We've reduced our bug rate by 73% since implementing CodeReviewer. The ROI has been incredible.",
    },
  ];

  // Render a loading state while authentication is being checked
  if (loadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-700">
        Checking authentication status...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* CSS Variables - Inline styles for a self-contained component */}
      <style jsx="true" global="true">{`
        :root {
          --color-primary: #4f46e5;
          --color-primary-dark: #4338ca;
          --color-accent: #10b981;
          --color-text: #1f2937;
          --color-text-light: #6b7280;
          --color-background: #ffffff;
          --color-background-alt: #f9fafb;
          --color-border: #e5e7eb;
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
          color: var(--color-text);
          line-height: 1.5;
        }

        /* Utility Classes */
        .container {
          width: 100%;
          max-width: 1280px;
          margin-left: auto;
          margin-right: auto;
          padding-left: 1rem;
          padding-right: 1rem;
        }

        .min-h-screen {
          min-height: 100vh;
        }

        .flex {
          display: flex;
        }

        .flex-col {
          flex-direction: column;
        }

        .items-center {
          align-items: center;
        }

        .justify-center {
          justify-content: center;
        }

        .justify-between {
          justify-content: space-between;
        }

        .space-x-2 > * + * {
          margin-left: 0.5rem;
        }

        .space-x-4 > * + * {
          margin-left: 1rem;
        }

        .space-x-6 > * + * {
          margin-left: 1.5rem;
        }

        .space-y-2 > * + * {
          margin-top: 0.5rem;
        }

        .space-y-3 > * + * {
          margin-top: 0.75rem;
        }

        .space-y-4 > * + * {
          margin-top: 1rem;
        }

        .space-y-6 > * + * {
          margin-top: 1.5rem;
        }

        .gap-2 {
          gap: 0.5rem;
        }

        .gap-4 {
          gap: 1rem;
        }

        .gap-6 {
          gap: 1.5rem;
        }

        .gap-8 {
          gap: 2rem;
        }

        .gap-12 {
          gap: 3rem;
        }

        .grid {
          display: grid;
        }

        .grid-cols-1 {
          grid-template-columns: repeat(1, minmax(0, 1fr));
        }

        .grid-cols-2 {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .text-center {
          text-align: center;
        }

        .text-left {
          text-align: left;
        }

        .font-medium {
          font-weight: 500;
        }

        .font-semibold {
          font-weight: 600;
        }

        .font-bold {
          font-weight: 700;
        }

        .font-extrabold {
          font-weight: 800;
        }

        .text-sm {
          font-size: 0.875rem;
        }

        .text-base {
          font-size: 1rem;
        }

        .text-lg {
          font-size: 1.125rem;
        }

        .text-xl {
          font-size: 1.25rem;
        }

        .text-2xl {
          font-size: 1.5rem;
        }

        .text-3xl {
          font-size: 1.875rem;
        }

        .text-4xl {
          font-size: 2.25rem;
        }

        .text-5xl {
          font-size: 3rem;
        }

        .leading-tight {
          line-height: 1.25;
        }

        .tracking-tight {
          letter-spacing: -0.025em;
        }

        .text-white {
          color: #ffffff;
        }

        .text-primary {
          color: var(--color-primary);
        }

        .text-accent {
          color: var(--color-accent);
        }

        .text-gray-500 {
          color: #6b7280;
        }

        .text-gray-600 {
          color: #4b5563;
        }

        .text-gray-700 {
          color: #374151;
        }

        .text-gray-800 {
          color: #1f2937;
        }

        .text-gray-900 {
          color: #111827;
        }

        .bg-white {
          background-color: #ffffff;
        }

        .bg-primary {
          background-color: var(--color-primary);
        }

        .bg-primary-dark {
          background-color: var(--color-primary-dark);
        }

        .bg-gray-50 {
          background-color: #f9fafb;
        }

        .bg-blue-100 {
          background-color: #dbeafe;
        }

        .bg-green-100 {
          background-color: #d1fae5;
        }

        .bg-purple-100 {
          background-color: #ede9fe;
        }

        .bg-primary\/10 {
          background-color: rgba(79, 70, 229, 0.1);
        }

        .bg-white\/10 {
          background-color: rgba(255, 255, 255, 0.1);
        }

        .text-blue-600 {
          color: #2563eb;
        }

        .text-green-600 {
          color: #059669;
        }

        .text-purple-600 {
          color: #7c3aed;
        }

        .text-white\/80 {
          color: rgba(255, 255, 255, 0.8);
        }

        .border {
          border-width: 1px;
          border-style: solid;
        }

        .border-t {
          border-top-width: 1px;
          border-top-style: solid;
        }

        .border-gray-100 {
          border-color: #f3f4f6;
        }

        .border-gray-200 {
          border-color: #e5e7eb;
        }

        .border-gray-300 {
          border-color: #d1d5db;
        }

        .border-white\/20 {
          border-color: rgba(255, 255, 255, 0.2);
        }

        .border-transparent {
          border-color: transparent;
        }

        .rounded-md {
          border-radius: 0.375rem;
        }

        .rounded-lg {
          border-radius: 0.5rem;
        }

        .rounded-xl {
          border-radius: 0.75rem;
        }

        .rounded-full {
          border-radius: 9999px;
        }

        .shadow-md {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .shadow-lg {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }

        .shadow-xl {
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .hover\:shadow-lg:hover {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }

        .hover\:shadow-xl:hover {
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .p-4 {
          padding: 1rem;
        }

        .p-6 {
          padding: 1.5rem;
        }

        .p-10 {
          padding: 2.5rem;
        }

        .px-3 {
          padding-left: 0.75rem;
          padding-right: 0.75rem;
        }

        .px-4 {
          padding-left: 1rem;
          padding-right: 1rem;
        }

        .px-5 {
          padding-left: 1.25rem;
          padding-right: 1.25rem;
        }

        .px-6 {
          padding-left: 1.5rem;
          padding-right: 1.5rem;
        }

        .px-8 {
          padding-left: 2rem;
          padding-right: 2rem;
        }

        .py-1 {
          padding-top: 0.25rem;
          padding-bottom: 0.25rem;
        }

        .py-2 {
          padding-top: 0.5rem;
          padding-bottom: 0.5rem;
        }

        .py-3 {
          padding-top: 0.75rem;
          padding-bottom: 0.75rem;
        }

        .py-4 {
          padding-top: 1rem;
          padding-bottom: 1rem;
        }

        .py-6 {
          padding-top: 1.5rem;
          padding-bottom: 1.5rem;
        }

        .py-12 {
          padding-top: 3rem;
          padding-bottom: 3rem;
        }

        .py-16 {
          padding-top: 4rem;
          padding-bottom: 4rem;
        }

        .pt-4 {
          padding-top: 1rem;
        }

        .pt-8 {
          padding-top: 2rem;
        }

        .pt-12 {
          padding-top: 3rem;
        }

        .pt-32 {
          padding-top: 8rem;
        }

        .pb-16 {
          padding-bottom: 4rem;
        }

        .mb-2 {
          margin-bottom: 0.5rem;
        }

        .mb-3 {
          margin-bottom: 0.75rem;
        }

        .mb-4 {
          margin-bottom: 1rem;
        }

        .mb-6 {
          margin-bottom: 1.5rem;
        }

        .mb-8 {
          margin-bottom: 2rem;
        }

        .mb-12 {
          margin-bottom: 3rem;
        }

        .mb-16 {
          margin-bottom: 4rem;
        }

        .mr-4 {
          margin-right: 1rem;
        }

        .mt-2 {
          margin-top: 0.5rem;
        }

        .mt-3 {
          margin-top: 0.75rem;
        }

        .mt-4 {
          margin-top: 1rem;
        }

        .mx-auto {
          margin-left: auto;
          margin-right: auto;
        }

        .max-w-2xl {
          max-width: 42rem;
        }

        .max-w-3xl {
          max-width: 48rem;
        }

        .max-w-5xl {
          max-width: 64rem;
        }

        .max-w-sm {
          max-width: 24rem;
        }

        .max-w-\[300px\] {
          max-width: 300px;
        }

        .max-w-\[400px\] {
          max-width: 400px;
        }

        .max-w-\[600px\] {
          max-width: 600px;
        }

        .max-w-\[700px\] {
          max-width: 700px;
        }

        .max-w-\[900px\] {
          max-width: 900px;
        }

        .w-5 {
          width: 1.25rem;
        }

        .w-6 {
          width: 1.5rem;
        }

        .w-12 {
          width: 3rem;
        }

        .w-full {
          width: 100%;
        }

        .h-5 {
          height: 1.25rem;
        }

        .h-6 {
          height: 1.5rem;
        }

        .h-9 {
          height: 2.25rem;
        }

        .h-10 {
          height: 2.5rem;
        }

        .h-12 {
          height: 3rem;
        }

        .h-14 {
          height: 3.5rem;
        }

        .h-16 {
          height: 4rem;
        }

        .h-auto {
          height: auto;
        }

        .fixed {
          position: fixed;
        }

        .absolute {
          position: absolute;
        }

        .relative {
          position: relative;
        }

        .top-0 {
          top: 0;
        }

        .left-0 {
          left: 0;
        }

        .-top-2 {
          top: -0.5rem;
        }

        .-right-2 {
          right: -0.5rem;
        }

        .z-50 {
          z-index: 50;
        }

        .overflow-hidden {
          overflow: hidden;
        }

        .transition {
          transition-property: color, background-color, border-color,
            text-decoration-color, fill, stroke, opacity, box-shadow, transform,
            filter, backdrop-filter;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 150ms;
        }

        .transition-all {
          transition-property: all;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 150ms;
        }

        .transition-colors {
          transition-property: color, background-color, border-color,
            text-decoration-color, fill, stroke;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 150ms;
        }

        .transition-shadow {
          transition-property: box-shadow;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 150ms;
        }

        .duration-300 {
          transition-duration: 300ms;
        }

        .hover\:scale-105:hover {
          transform: scale(1.05);
        }

        .active\:scale-95:active {
          transform: scale(0.95);
        }

        .hover\:bg-primary\/90:hover {
          background-color: rgba(79, 70, 229, 0.9);
        }

        .hover\:bg-white\/10:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        .hover\:bg-white\/20:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }

        .hover\:bg-gray-100:hover {
          background-color: #f3f4f6;
        }

        .hover\:bg-accent:hover {
          background-color: var(--color-accent);
        }

        .hover\:text-primary:hover {
          color: var(--color-primary);
        }

        .hover\:underline:hover {
          text-decoration: underline;
        }

        .focus\:ring-2:focus {
          box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.5);
          outline: none;
        }

        .focus\:ring-primary:focus {
          box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.5);
          outline: none;
        }

        .focus\:border-primary:focus {
          border-color: var(--color-primary);
        }

        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }

        .backdrop-blur-md {
          backdrop-filter: blur(12px);
        }

        .bg-gradient-to-b {
          background-image: linear-gradient(
            to bottom,
            var(--tw-gradient-stops)
          );
        }

        .from-primary {
          --tw-gradient-stops: var(--color-primary), var(--color-primary-dark);
        }

        .to-primary-dark {
          --tw-gradient-stops: var(--color-primary), var(--color-primary-dark);
        }

        .inline-block {
          display: inline-block;
        }

        .inline-flex {
          display: inline-flex;
        }

        .aspect-video {
          aspect-ratio: 16 / 9;
        }

        .object-cover {
          object-fit: cover;
        }

        .object-center {
          object-position: center;
        }

        /* Media Queries */
        @media (min-width: 400px) {
          .min-\[400px\]\:flex-row {
            flex-direction: row;
          }
        }

        @media (min-width: 640px) {
          .sm\:px-6 {
            padding-left: 1.5rem;
            padding-right: 1.5rem;
          }

          .sm\:px-10 {
            padding-left: 2.5rem;
            padding-right: 2.5rem;
          }

          .sm\:grid-cols-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .sm\:flex-row {
            flex-direction: row;
          }

          .sm\:ml-auto {
            margin-left: auto;
          }

          .sm\:p-8 {
            padding: 2rem;
          }

          .sm\:w-full {
            width: 100%;
          }

          .sm\:text-4xl {
            font-size: 2.25rem;
          }

          .sm\:text-5xl {
            font-size: 3rem;
          }
        }

        @media (min-width: 768px) {
          .md\:px-6 {
            padding-left: 1.5rem;
            padding-right: 1.5rem;
          }

          .md\:px-10 {
            padding-left: 2.5rem;
            padding-right: 2.5rem;
          }

          .md\:grid-cols-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .md\:grid-cols-4 {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }

          .md\:flex-row {
            flex-direction: row;
          }

          .md\:gap-12 {
            gap: 3rem;
          }

          .md\:gap-16 {
            gap: 4rem;
          }

          .md\:p-10 {
            padding: 2.5rem;
          }

          .md\:py-24 {
            padding-top: 6rem;
            padding-bottom: 6rem;
          }

          .md\:pt-24 {
            padding-top: 6rem;
          }

          .md\:pt-40 {
            padding-top: 10rem;
          }

          .md\:pb-24 {
            padding-bottom: 6rem;
          }

          .md\:text-xl {
            font-size: 1.25rem;
          }

          .md\:text-4xl {
            font-size: 2.25rem;
          }

          .md\:text-5xl {
            font-size: 3rem;
          }

          .md\:text-base {
            font-size: 1rem;
          }

          .md\:text-left {
            text-align: left;
          }

          .md\:mt-0 {
            margin-top: 0;
          }
        }

        @media (min-width: 1024px) {
          .lg\:px-6 {
            padding-left: 1.5rem;
            padding-right: 1.5rem;
          }

          .lg\:px-8 {
            padding-left: 2rem;
            padding-right: 2rem;
          }

          .lg\:grid-cols-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .lg\:grid-cols-3 {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .lg\:col-span-2 {
            grid-column: span 2 / span 2;
          }

          .lg\:gap-10 {
            gap: 2.5rem;
          }

          .lg\:gap-12 {
            gap: 3rem;
          }

          .lg\:py-32 {
            padding-top: 8rem;
            padding-bottom: 8rem;
          }

          .lg\:pt-32 {
            padding-top: 8rem;
          }

          .lg\:justify-end {
            justify-content: flex-end;
          }

          .lg\:order-last {
            order: 9999;
          }

          .lg\:text-base {
            font-size: 1rem;
          }

          .lg\:leading-tighter {
            line-height: 1.1;
          }
        }

        @media (min-width: 1280px) {
          .xl\:grid-cols-\[1fr_600px\] {
            grid-template-columns: 1fr 600px;
          }

          .xl\:py-48 {
            padding-top: 12rem;
            padding-bottom: 12rem;
          }

          .xl\:text-xl {
            font-size: 1.25rem;
          }

          .xl\:text-6xl {
            font-size: 3.75rem;
          }

          .xl\:text-\[3\.4rem\] {
            font-size: 3.4rem;
          }
        }

        @media (min-width: 1536px) {
          .\\32xl\\:text-\\[3\.75rem\\] {
            font-size: 3.75rem;
          }
        }
      `}</style>

      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-white shadow-md" : "bg-transparent backdrop-blur-md"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Code
              className={`h-6 w-6 ${
                isScrolled ? "text-primary" : "text-white"
              }`}
            />
            <span
              className={`font-bold text-lg md:text-xl ${
                isScrolled ? "text-gray-900" : "text-white"
              }`}
            >
              CodeReviewer
            </span>
          </div>

          {/* Buttons */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                // Redirect based on authentication status
                token ? navigate("/try") : navigate("/register");
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                isScrolled
                  ? "bg-primary text-white hover:bg-primary/90 border-transparent"
                  : "bg-white/10 text-white hover:bg-white/20 border-white/20"
              }`}
            >
              Get Started
            </button>
            <button
              onClick={() => {
                // Logout if authenticated, otherwise navigate to Login
                token ? handleLogout() : navigate("/login");
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all shadow-lg ${
                isScrolled
                  ? "bg-primary text-white hover:bg-primary/90 shadow-primary/30"
                  : "bg-white text-primary hover:bg-gray-100 shadow-white/30"
              }`}
            >
              {token ? "Logout" : "Login"}
            </button>
          </div>
        </div>
      </nav>
      <section className="pt-32 md:pt-40 pb-16 md:pb-24 bg-white text-black overflow-hidden">
        {" "}
        {/* Added overflow-hidden to prevent horizontal scroll issues from animations */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="space-y-6 text-center md:text-left"
            >
              {/* Using a more semantic button for the tag, with ARIA-hidden for screen readers if it's purely decorative */}
              <span
                className="inline-block px-5 py-2 text-sm md:text-base font-medium bg-black/10 rounded-full animate-pulse"
                aria-hidden="true" // Indicate it's decorative for accessibility
              >
                🚀 AI-Powered Code Reviews
              </span>

              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
                Improve Your Code Quality with{" "}
                <span className="text-accent">AI Automation</span>
              </h1>

              <p className="text-base md:text-lg text-black/80 max-w-prose mx-auto md:mx-0">
                {" "}
                {/* Added max-w-prose for better readability on large screens */}
                Detect errors, security vulnerabilities, and performance issues
                before deployment. Our AI-driven code reviewer continuously
                analyzes your code and provides actionable feedback in
                real-time.
              </p>

              {/* CTA Buttons - Adjusted to reflect token status */}
              <div className="flex flex-wrap gap-3 justify-center md:justify-start pt-2">
                {" "}
                {/* Added pt-2 for slight vertical separation from paragraph */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    token ? navigate("/try") : navigate("/register")
                  }
                  className="bg-black text-white px-7 md:px-9 py-3.5 md:py-4.5 rounded-full font-semibold text-lg shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black" // Added focus styles for accessibility
                >
                  🚀 {token ? "Go to Reviewer" : "Get Started for Free"}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative border-2 border-black text-black px-7 md:px-9 py-3.5 md:py-4.5 rounded-full font-semibold text-lg shadow-md transition-all hover:bg-black hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black" // Changed text-white to text-black and added hover for visual feedback
                >
                  🎬 Watch Demo
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full animate-bounce">
                    {" "}
                    {/* Added animate-bounce for a subtle attention grab */}
                    New
                  </span>
                </motion.button>
              </div>
            </motion.div>

            {/* Right Content (Image) */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative rounded-xl overflow-hidden shadow-xl flex justify-center p-4 md:p-0" // Added padding for image on smaller screens
            >
              <img
                src={lockImage}
                alt="Illustration showing secure code review or code quality improvement" // More descriptive alt text for accessibility
                className="w-auto max-w-xs sm:max-w-sm md:max-w-md h-auto object-contain" // Adjusted max-width for smoother scaling
                loading="lazy" // Added lazy loading for performance
              />
            </motion.div>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Powerful Code Review Features
            </h2>
            <p className="text-lg text-gray-600 mt-3">
              Everything you need to improve code quality and streamline your
              development process.
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              What Developers Say
            </h2>
            <p className="text-lg text-gray-600 mt-3">
              Trusted by thousands of developers around the world
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                    <span className="text-lg font-bold text-primary">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600">"{testimonial.review}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
              Get in Touch
            </h2>
            <p className="text-lg text-gray-600 mt-2">
              Have questions? We're here to help!
            </p>
          </div>

          {/* Grid Layout */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Contact Info Cards */}
            <div className="space-y-6">
              <div className="flex items-center p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition border border-gray-100">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <Mail className="text-blue-600 h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold">Email Us</h4>
                  <p className="text-gray-600">sharmasuraj030805@gmail.com</p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition border border-gray-100">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <Shield className="text-green-600 h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold">Security</h4>
                  <p className="text-gray-600">Your data is secure with us.</p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition border border-gray-100">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <GitBranch className="text-purple-600 h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold">Integration</h4>
                  <p className="text-gray-600">
                    Works with GitHub, GitLab, and Bitbucket. soon....
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 md:p-10 border border-gray-100">
              {formSubmitted ? (
                <div className="text-center py-12">
                  <CheckCircle className="text-green-600 h-12 w-12 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-800">
                    Message Sent!
                  </h3>
                  <p className="text-gray-600">
                    Thank you for reaching out. We'll respond soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition"
                      placeholder="Your email address"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={5}
                      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition"
                      placeholder="Your message"
                      required
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-md font-medium transition"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 text-gray-700 py-12 border-t border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-8 mb-8">
            {/* Brand Section */}
            <div>
              <div className="flex items-center space-x-2 text-gray-900 mb-4">
                <Code className="h-6 w-6 text-primary" />
                <span className="font-bold text-xl">CodeReviewer</span>
              </div>
              <p className="mb-4 text-sm">
                Automated code reviews for better software. Catch bugs before
                they reach production.
              </p>
              {/* Social Icons */}
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-500 hover:text-primary transition"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-500 hover:text-primary transition"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743A11.65 11.65 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Links Sections */}
            {[
              {
                title: "Product",
                links: [
                  "Features",
                  "Integrations",
                  "Documentation",
                  "Changelog",
                ],
              },
              {
                title: "Company",
                links: ["About", "Blog", "Careers", "Contact"],
              },
              {
                title: "Resources",
                links: [
                  "Support",
                  "Privacy Policy",
                  "Terms of Service",
                  "Cookie Policy",
                ],
              },
            ].map((section) => (
              <div key={section.title}>
                <h4 className="text-gray-900 text-lg font-semibold mb-4">
                  {section.title}
                </h4>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-gray-500 hover:text-primary transition text-sm"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Footer Bottom Section */}
          <div className="pt-8 border-t border-gray-300 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">
              &copy; {new Date().getFullYear()} CodeReviewer. All rights
              reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="#"
                className="text-sm text-gray-500 hover:text-primary transition"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-sm text-gray-500 hover:text-primary transition"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-sm text-gray-500 hover:text-primary transition"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
