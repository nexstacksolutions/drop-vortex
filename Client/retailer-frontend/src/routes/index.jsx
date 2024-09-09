import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "../App";

// All pages
const HomePage = lazy(() => import("../pages/publicPages/Home"));
const LoginPage = lazy(() => import("../pages/publicPages/Login"));
const SignupPage = lazy(() => import("../pages/publicPages/Signup"));
const ErrorBoundary = lazy(() => import("../pages/publicPages/Error"));
const ProductPage = lazy(() => import("../pages/publicPages/Product"));
const CreateProductPage = lazy(() =>
  import("../pages/adminPages/CreateProduct")
);
const CategoryPage = lazy(() => import("../pages/publicPages/Category"));
const SearchPage = lazy(() => import("../pages/publicPages/Search"));
const IntegrationsPage = lazy(() =>
  import("../pages/publicPages/Integrations")
);
const CartPage = lazy(() => import("../pages/publicPages/Cart"));
const CheckoutPage = lazy(() => import("../pages/publicPages/Checkout"));
const OrderHistoryPage = lazy(() =>
  import("../pages/publicPages/OrderHistory")
);
const OrderDetailsPage = lazy(() =>
  import("../pages/publicPages/OrderDetails")
);
const ProfilePage = lazy(() => import("../pages/publicPages/Profile"));
const WishlistPage = lazy(() => import("../pages/publicPages/Wishlist"));
const ContactPage = lazy(() => import("../pages/publicPages/Contact"));
const AboutPage = lazy(() => import("../pages/publicPages/About"));
const FAQPage = lazy(() => import("../pages/publicPages/FAQ"));
const PrivacyPolicyPage = lazy(() =>
  import("../pages/publicPages/PrivacyPolicy")
);
const TermsOfServicePage = lazy(() =>
  import("../pages/publicPages/TermsOfService")
);
const AdminDashboardPage = lazy(() =>
  import("../pages/adminPages/AdminDashboard")
);
const ProductReviewsPage = lazy(() =>
  import("../pages/publicPages/ProductReviews")
);

// Creating routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorBoundary />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/signup", element: <SignupPage /> },
      { path: "/product/:productId", element: <ProductPage /> },
      { path: "/product/create", element: <CreateProductPage /> },
      { path: "/category/:categoryId", element: <CategoryPage /> },
      { path: "/search", element: <SearchPage /> },
      { path: "/integrations/:platformId", element: <IntegrationsPage /> },
      { path: "/cart", element: <CartPage /> },
      { path: "/checkout", element: <CheckoutPage /> },
      { path: "/orders", element: <OrderHistoryPage /> },
      { path: "/order/:orderId", element: <OrderDetailsPage /> },
      { path: "/profile", element: <ProfilePage /> },
      { path: "/wishlist", element: <WishlistPage /> },
      { path: "/contact", element: <ContactPage /> },
      { path: "/about", element: <AboutPage /> },
      { path: "/faq", element: <FAQPage /> },
      { path: "/privacy-policy", element: <PrivacyPolicyPage /> },
      { path: "/terms-of-service", element: <TermsOfServicePage /> },
      { path: "/admin/dashboard", element: <AdminDashboardPage /> },
      { path: "/product/:productId/reviews", element: <ProductReviewsPage /> },
    ],
  },
]);

export default router;
