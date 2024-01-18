import React, { useContext } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { UserContext } from "./context/UserContext";

import ArtDetails from "./components/HomePage/ArtDetails";
import UpdateArtBody from "./components/PostArtPage/UpdateArtBody";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import SigninPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import SignupPage from "./pages/SignupPage";
import ErrorPage from "./pages/ErrorPage";

function App() {
  const { user } = useContext(UserContext);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route
          path="/login"
          element={user ? <Navigate to="/" /> : <SigninPage />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/" /> : <SignupPage />}
        />

        <Route path="/forgotPassword" element={<ForgotPasswordPage />} />
        <Route path="/please-login" element={<ErrorPage />} />
        <Route
          path="/updateArt"
          element={ <UpdateArtBody />}
        />
        <Route path="/art-details/:artId" element={<ArtDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
