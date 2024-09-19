import { LuShoppingBag } from "react-icons/lu";
import { BiDetail } from "react-icons/bi";
import { MdInsights } from "react-icons/md";
import { MdInsertChartOutlined } from "react-icons/md";
import { FaStore } from "react-icons/fa";
import { IoWalletOutline } from "react-icons/io5";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { IoMdContact } from "react-icons/io";
import { GrGrow } from "react-icons/gr";

const navigation = {
  sidebar: [
    {
      label: "Products",
      icon: <LuShoppingBag />,
      subLinks: [
        {
          label: "Manage Products",
          to: "/products/manage",
        },
        {
          label: "Add New Product",
          to: "/products/add",
        },
        {
          label: "Media Center",
          to: "/products/media-center",
        },
        {
          label: "Brand Management",
          to: "/products/brand-management",
        },
      ],
    },

    {
      label: "Orders & Reviews",
      icon: <BiDetail />,
      subLinks: [
        {
          label: "All Orders",
          to: "/orders/all",
        },
        {
          label: "Return Requests",
          to: "/orders/returns",
        },
        {
          label: "Customer Reviews",
          to: "/orders/reviews",
        },
      ],
    },

    {
      label: "Marketing Center",
      icon: <MdInsights />,
      new: true,
      subLinks: [],
    },

    {
      label: "Data Insights",
      icon: <MdInsertChartOutlined />,
      subLinks: [],
    },

    {
      label: "Learn & Grow",
      icon: <GrGrow />,
      subLinks: [],
    },

    {
      label: "Store Management",
      icon: <FaStore />,
      subLinks: [
        {
          label: "Store Decoration",
          to: "/store/decoration",
        },
        {
          label: "Store Settings",
          to: "/store/settings",
        },
      ],
    },

    {
      label: "Finance",
      icon: <IoWalletOutline />,
      subLinks: [
        {
          label: "Income Overview",
          to: "/finance/income",
        },
        {
          label: "Seller Finances",
          to: "/finance/seller",
        },
      ],
    },

    {
      label: "Support",
      icon: <AiOutlineQuestionCircle />,
      subLinks: [
        {
          label: "Help Center",
          to: "/support/help-center",
        },
        {
          label: "Live Chat",
          to: "/support/live-chat",
        },
      ],
    },

    {
      label: "Account Management",
      icon: <IoMdContact />,
      subLinks: [
        {
          label: "Profile Settings",
          to: "/account/profile",
        },
        {
          label: "Account Settings",
          to: "/account/settings",
        },
        {
          label: "User Management",
          to: "/account/user-management",
        },
        {
          label: "Chat Preferences",
          to: "/account/chat-preferences",
        },
      ],
    },
  ],
};

export default navigation;
