import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import Challenges from "../pages/Challenges";
import ChallengeDetail from "../pages/ChallengeDetail";
import AddChallenge from "../pages/AddChallenge";
import MyActivities from "../pages/MyActivities";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import NotFound from "../pages/NotFound";
import PrivateRoute from "./PrivateRoute";
import Tips from "../pages/Tips";
import Events from "../pages/Events";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/challenges", element: <Challenges /> },
      { path: "/challenges/:id", element: <ChallengeDetail /> },
      {
        path: "/challenges/add",
        element: (
          <PrivateRoute>
            <AddChallenge />
          </PrivateRoute>
        ),
      },
      {
        path: "/my-activities",
        element: (
          <PrivateRoute>
            <MyActivities />
          </PrivateRoute>
        ),
      },
      { path: "/tips", element: <Tips /> },
      { path: "/events", element: <Events /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/forgot-password", element: <ForgotPassword /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default router;