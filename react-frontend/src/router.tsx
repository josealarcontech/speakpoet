import ErrorPage from "./routes/error-page";
import { createBrowserRouter } from "react-router-dom";
import Login from "./routes/login";
import Home from "./routes/home";
const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
  },
]);
export default router