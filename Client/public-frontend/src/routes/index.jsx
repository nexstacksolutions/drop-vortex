import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "../App";

// All pages
const HomePage = lazy(() => import("../pages/Home"));
const LoginPage = lazy(() => import("../pages/Login"));
const SignupPage = lazy(() => import("../pages/Signup"));
const ErrorBoundary = lazy(() => import("../pages/Error"));
const ProductPage = lazy(() => import("../pages/Product"));
const CategoryPage = lazy(() => import("../pages/Category"));
const SearchPage = lazy(() => import("../pages/Search"));
const IntegrationsPage = lazy(() => import("../pages/Integrations"));
const CartPage = lazy(() => import("../pages/Cart"));
const CheckoutPage = lazy(() => import("../pages/Checkout"));
const OrderHistoryPage = lazy(() => import("../pages/OrderHistory"));
const OrderDetailsPage = lazy(() => import("../pages/OrderDetails"));
const ProfilePage = lazy(() => import("../pages/Profile"));
const WishlistPage = lazy(() => import("../pages/Wishlist"));
const ContactPage = lazy(() => import("../pages/Contact"));
const AboutPage = lazy(() => import("../pages/About"));
const FAQPage = lazy(() => import("../pages/FAQ"));
const PrivacyPolicyPage = lazy(() => import("../pages/PrivacyPolicy"));
const TermsOfServicePage = lazy(() => import("../pages/TermsOfService"));
const ProductReviewsPage = lazy(() => import("../pages/ProductReviews"));

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
      { path: "/product/:productId/reviews", element: <ProductReviewsPage /> },
    ],
  },
]);

export default router;
