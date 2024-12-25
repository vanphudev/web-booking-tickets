import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import publicRoutes from "./publicRoute/index";
import privateRoutes from "./privateRoute/index";

const routes = createBrowserRouter([...publicRoutes, ...privateRoutes]);

export default routes;
