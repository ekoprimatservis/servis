import React from "react";
import "./index.css";
import ReactDOM from "react-dom/client";
import { Home } from "./pages/Home";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Login } from "./pages/Login";
import { ErrorPage } from "./pages/Error";
import { Client } from "./pages/Client";
import { ClientCreate } from "./pages/ClientCreate";
import { ClientEdit } from "./pages/ClientEdit";
import { QueryClient, QueryClientProvider } from "react-query";
import { ClientList } from "./pages/ClientList";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Article } from "./pages/Article";
import { ArticleCreate } from "./pages/ArticleCreate";
import { ArticleEdit } from "./pages/ArticleEdit";
import { ArticleList } from "./pages/ArticleList";
import { BillCreate } from "./pages/BillCreate";
import { BillList } from "./pages/BillList";
import { Bill } from "./pages/Bill";
import { BillEdit } from "./pages/BillEdit";
import { BillArticlesCreate } from "./pages/BillArticles";
import { BillPDF } from "./pages/BillPDF";
import { InvoicePDF } from "./pages/InvoicePDF";
import { Input } from "./pages/Input";
import { ExpensesCreate } from "./pages/ExpensesCreate";
import { Transport } from "./pages/Transport";
import { Statistics } from "./pages/Statistics";
import { CompanyInfo } from "./pages/CompanyInfo";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/home",
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/input",
    element: <Input />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/client",
    element: <Client />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/client/create",
    element: <ClientCreate />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/client/edit/:id",
    element: <ClientEdit />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/client/list",
    element: <ClientList />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/article",
    element: <Article />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/article/create",
    element: <ArticleCreate />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/article/edit/:id",
    element: <ArticleEdit />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/article/list",
    element: <ArticleList />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/bill",
    element: <Bill />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/expenses",
    element: <ExpensesCreate />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/transport",
    element: <Transport />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/statistics",
    element: <Statistics />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/bill/create",
    element: <BillCreate />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/bill/edit/:id",
    element: <BillEdit />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/bill/list",
    element: <BillList />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/company-info",
    element: <CompanyInfo />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/bill-articles/:id",
    element: <BillArticlesCreate />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/bill-pdf/:id",
    element: <BillPDF />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/invoice-pdf/:id",
    element: <InvoicePDF />,
    errorElement: <ErrorPage />,
  },
  { path: "*", element: <ErrorPage /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
    <ToastContainer />
  </QueryClientProvider>
);
