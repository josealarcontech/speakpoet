import ErrorPage from "./routes/error-page";
import { createBrowserRouter } from "react-router-dom";
import Root from "./routes/root";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
  },
]);
export default router