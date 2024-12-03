import { RouterProvider, createBrowserRouter } from "react-router-dom";
import {
  Categories,
  CreateCategory,
  CreateOrder,
  CreateProduct,
  CreateReview,
  CreateUser,
  EditCategory,
  EditOrder,
  EditProduct,
  EditReview,
  EditUser,
  HelpDesk,
  HomeLayout,
  Landing,
  Login,
  Orders,
  Products,
  Register,
  Reviews,
  Users,
} from "./pages";
import PrivateRoute from "./components/PrivateRoute";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/",
    element: (
      <PrivateRoute>
        <HomeLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: "/products",
        element: (
          <PrivateRoute>
            <Products />
          </PrivateRoute>
        ),
      },
      {
        path: "/products/create-product",
        element: (
          <PrivateRoute>
            <CreateProduct />
          </PrivateRoute>
        ),
      },
      {
        path: "/products/:id",
        element: (
          <PrivateRoute>
            <EditProduct />
          </PrivateRoute>
        ),
      },
      {
        path: "/categories",
        element: (
          <PrivateRoute>
            <Categories />
          </PrivateRoute>
        ),
      },
      {
        path: "/categories/create-category",
        element: (
          <PrivateRoute>
            <CreateCategory />
          </PrivateRoute>
        ),
      },
      {
        path: "/categories/:id",
        element: (
          <PrivateRoute>
            <EditCategory />
          </PrivateRoute>
        ),
      },
      {
        path: "/orders",
        element: (
          <PrivateRoute>
            <Orders />
          </PrivateRoute>
        ),
      },
      {
        path: "/orders/create-order",
        element: (
          <PrivateRoute>
            <CreateOrder />
          </PrivateRoute>
        ),
      },
      {
        path: "/orders/:id",
        element: (
          <PrivateRoute>
            <EditOrder />
          </PrivateRoute>
        ),
      },
      {
        path: "/reviews",
        element: (
          <PrivateRoute>
            <Reviews />
          </PrivateRoute>
        ),
      },
      {
        path: "/reviews/create-review",
        element: (
          <PrivateRoute>
            <CreateReview />
          </PrivateRoute>
        ),
      },
      {
        path: "/reviews/:id",
        element: (
          <PrivateRoute>
            <EditReview />
          </PrivateRoute>
        ),
      },
      {
        path: "/users",
        element: (
          <PrivateRoute>
            <Users />
          </PrivateRoute>
        ),
      },
      {
        path: "/users/:id",
        element: (
          <PrivateRoute>
            <EditUser />
          </PrivateRoute>
        ),
      },
      {
        path: "/users/create-user",
        element: (
          <PrivateRoute>
            <CreateUser />
          </PrivateRoute>
        ),
      },
      {
        path: "/help-desk",
        element: (
          <PrivateRoute>
            <HelpDesk />
          </PrivateRoute>
        ),
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
