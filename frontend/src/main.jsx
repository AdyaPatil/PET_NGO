import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { LoginState } from "./context/LoginContext";

import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import HomePage from "./Body/HomePage";
import LoginPage from "./Body/LoginPage";
import RegisterPage from "./Body/RegisterPage";
import UserProfile from "./Body/UserProfile";
import PetList from "./Body/PetListPage";
import CreatePet from "./Body/CreatePetPage";
import PetInfo from "./Body/PetInformationPage";
import ContactUs from "./Body/ContactUsPage";
import UserPetListPage from "./Body/UserPetListPage";
import UserPetDetails from "./Body/UserPetDetails";
import AboutUs from "./Body/AboutUsPage";
import PaymentPage from "./Body/PaymentPage";
import Test from "./Body/test";
import ErrorPage from "./Body/ErrorPage";

const AppLayout = () => {
  return (
    <LoginState>
      <Header />
      <Outlet />
      <Footer />
    </LoginState>
  );
};

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <ErrorPage />,

    children: [
      { path: "/", element: <HomePage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/contact-us", element: <ContactUs /> },
      { path: "/about-us", element: <AboutUs /> },
      { path: "/payment-page", element: <PaymentPage /> },

      { path: "/user-profile", element: <UserProfile /> },
      { path: "/user/pets", element: <UserPetListPage /> },

      { path: "/pets", element: <PetList /> },
      { path: "/pet/:petId", element: <PetInfo /> },

      { path: "/user/pet/create", element: <CreatePet /> },
      { path: "/user/pet/:petId", element: <UserPetDetails /> },
      // { path: "/user/:userId/pets", element: <GetPetList /> },
      // { path: "/user/:userId/pet/:petId", element: <GetPetInformation /> },
      { path: "/test", element: <Test /> },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={appRouter} />);
