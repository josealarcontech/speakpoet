import ErrorPage from "./routes/error-page";
import { createBrowserRouter, redirect } from "react-router-dom";
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
    loader:() => {
      console.log("router")
      redirect('/login')
      return null
    }
  },
]);
export default router