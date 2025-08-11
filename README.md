# 🏃‍♂️ Marathon Management System

🔗 **Live Site URL:**        

## 📌 Project Overview

The **Marathon Management System** is a full-stack platform designed to simplify the organization and participation of marathon events. It offers a streamlined experience for event organizers to manage marathons and for users to register, view details, and keep track of their applications through a responsive, secure interface.

## ✨ Key Features

- 🔐 **Authentication & JWT Security**  
  Email/password-based login and social login (Google/GitHub), protected with JWT stored in cookies. Ensures private routes are secure and accessible after page reloads.

- 📊 **Role-based Dashboards & CRUD Operations**  
  Organizers can create, update, and delete marathon events. Participants can register for events and manage their applications.

- 📅 **Smart Countdown & Date Handling**  
  Countdown timer on the marathon details page shows real-time time left until the event using `react-countdown-circle-timer`. Date pickers for marathon creation using `react-datepicker`.

- 🔎 **Advanced Search & Sort (Server-side)**  
  Real-time search in the Apply List page by marathon title using server-side MongoDB `$regex`, and sorting marathons by `createdAt` date.

- 🎨 **Modern, Responsive UI with TailwindCSS + Dark Mode**  
  Fully mobile/tablet/desktop responsive interface with dark/light theme toggle support and toast/sweetalert feedback for all actions.

## 🛠️ Technologies Used

- **Frontend:** React, TailwindCSS, React Router, Firebase Auth, SweetAlert2, React Hook Form, React Toastify and more
- **Backend:** Node.js, Express.js, MongoDB (Native Driver), JWT, CORS, dotenv 
- **Others:** Vite, Firebase Hosting, Vercel (Server), Ngrok (Local Testing)

## 📁 Project Structure

- `client/` – React Frontend (Responsive UI, Routing, Auth, Dashboard)
- `server/` – Node.js Backend (API, JWT Auth, MongoDB Queries) and more
- `.env` – Environment variables (Firebase config, MongoDB URI)
- `vercel.json` – Backend deployment config for Vercel

## ⚠️ Developer Notes

- Private routes persist login after page refresh using JWT.
- Environment variables are secured and not hardcoded.
- No default alerts or placeholder text like `Lorem ipsum` is used.
- Includes 404 page, dynamic title, loading spinner, and confirmation modals.

---

