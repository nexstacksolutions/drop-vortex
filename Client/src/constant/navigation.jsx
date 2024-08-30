import {
  FeatureIcon,
  FeatureDot,
} from "../components/Common/FeatureIcons/FeatureIcons";
import imageSet from "../assets/mediaExports/assetIndex";
import { IoIosArrowDown } from "react-icons/io";

const navigation = {
  subHeader: [
    {
      label: "Be a Supplier",
      path: "/",
      divider: true,
    },
    {
      label: "Integrations",
      path: "/",
      icon: <IoIosArrowDown />,
      FeatureDot: FeatureDot,
      subLinks: [
        {
          label: "Shopify",
          path: "/",
          icon: imageSet.headerImages.shopify,
        },
        {
          label: "TikTok Shop",
          path: "/",
          icon: imageSet.headerImages.tiktok,
          featureIcon: <FeatureIcon label="NEW" popup={false} />,
        },
        {
          label: "WooCommerce",
          path: "/",
          icon: imageSet.headerImages.woo,
        },
        {
          label: "Amazon",
          path: "/",
          icon: imageSet.headerImages.amazon,
        },
        {
          label: "Bigcommerce",
          path: "/",
          icon: imageSet.headerImages.big,
        },
        {
          label: "eBay",
          path: "/",
          icon: imageSet.headerImages.ebay,
        },
        {
          label: "Newegg",
          path: "/",
          icon: imageSet.headerImages.newegg,
        },
        {
          label: "Wix",
          path: "/",
          icon: imageSet.headerImages.wix,
        },
        {
          label: "Square",
          path: "/",
          icon: imageSet.headerImages.square,
        },
        {
          label: "Walmart",
          path: "/",
          icon: imageSet.headerImages.walmart,
        },
        {
          label: "Shift4Shop",
          path: "/",
          icon: imageSet.headerImages.shift4you,
        },
        {
          label: "Retailer API",
          path: "/",
          icon: imageSet.headerImages.api,
        },
      ],
    },
    {
      label: "Pricing",
      path: "/",
    },
    {
      label: "Affiliate",
      path: "/",
    },
    {
      label: "Help Center",
      path: "/",
    },
    {
      label: "Resources",
      path: "/",
      icon: <IoIosArrowDown />,
      subLinks: [
        {
          label: "Blog",
          path: "/",
        },
        {
          label: "All Categories",
          path: "/",
        },
      ],
    },
  ],
  mainHeader: {
    quickLinks: [
      {
        label: "TikTok Shop Selections",
        path: "/",
        featureIcon: <FeatureIcon label="HOT" popup={true} />,
      },
      {
        label: "Top Ranking",
        path: "/",
        featureIcon: <FeatureIcon label="NEW" popup={true} />,
      },
      {
        label: "High Profit",
        path: "/",
      },
      {
        label: "New Arrivals",
        path: "/",
      },
      {
        label: "Blowout Sale",
        path: "/",
      },
      {
        label: "Premium Suppliers",
        path: "/",
      },
      {
        label: "All Products",
        path: "/",
      },
      {
        label: "Doba Elite Academy",
        path: "/",
      },
    ],
  },

  footer: [
    {
      title: "Company",
      path: "/",

      subLinks: [
        {
          label: "Careers",
          path: "/",
        },
        {
          label: "Return & Refund Policy",
          path: "/",
        },
        {
          label: "Terms of Use",
          path: "/",
        },
        {
          label: "Privacy Policys",
          path: "/",
        },
        {
          label: "Doba Inc 3300 N Triumph Blvd #G40 Lehi, UT 84043",
          path: "/",
        },
      ],
    },
    {
      title: "Resources",
      path: "/",

      subLinks: [
        {
          label: "API",
          path: "/",
        },
        {
          label: "Blog",
          path: "/",
        },
        {
          label: "Documentation",
          path: "/",
        },
        {
          label: "Sell on Doba",
          path: "/",
        },
        {
          label: "Affiliate Program",
          path: "/",
        },
      ],
    },
    {
      title: "Support",
      path: "/",

      subLinks: [
        {
          label: "Help Center",
          path: "/",
        },
        {
          label: "Doba Elite Academy",
          path: "/",
        },
        {
          label: "Get in Touch",
          path: "/",
        },
        {
          label: "Submit an IPR Complaint",
          path: "/",
        },
      ],
    },
  ],

  categories: [
    {
      label: "Home, Garden & Tools",
      path: "/",
      icon: imageSet.categoriesImages.category1,
      subLinks: [
        {
          label: "Furniture",
          path: "/",

          subLinks: [
            { label: "Bedroom Furniture", path: "/" },
            { label: "Living Room Furniture", path: "/" },
            { label: "Kitchen & Dining Room Furniture", path: "/" },
            { label: "Accent Furniture", path: "/" },
            { label: "Kids' Furniture", path: "/" },
            { label: "Home Office Furniture", path: "/" },
            { label: "Bathroom Furniture", path: "/" },
            { label: "Home Entertainment Furniture", path: "/" },
            { label: "Other Furniture & Replacement Parts", path: "/" },
          ],
        },
        {
          label: "Decor",
          path: "/",

          subLinks: [
            { label: "Home Decor", path: "/" },
            { label: "Wall Art", path: "/" },
            { label: "Seasonal Decor", path: "/" },
          ],
        },
        {
          label: "Kitchen & Dining",
          path: "/",

          subLinks: [
            { label: "Kitchen & Table Linens", path: "/" },
            { label: "Food & Beverage", path: "/" },
            { label: "Kitchen Storage & Organization", path: "/" },
            { label: "Kitchen Utensils & Gadgets", path: "/" },
            { label: "Dining & Entertaining", path: "/" },
            { label: "Cookware", path: "/" },
            { label: "Coffee, Tea & Espresso", path: "/" },
            { label: "Bakeware", path: "/" },
            { label: "Other Kitchen & Dining Supplies", path: "/" },
          ],
        },
        {
          label: "Patio, Lawn & Garden",
          path: "/",

          subLinks: [
            { label: "Patio Supplies", path: "/" },
            { label: "Pools, Hot Tubs & Supplies", path: "/" },
            { label: "Other Patio, Lawn & Garden Supplies", path: "/" },
          ],
        },
        {
          label: "Bedding",
          path: "/",
          subLinks: [
            { label: "Blankets & Throws", path: "/" },
            { label: "Bedding Sets & Collections", path: "/" },
            { label: "Quilts & Sets", path: "/" },
            { label: "Bed Pillows & Pillowcases", path: "/" },
            { label: "Bedding Accessories", path: "/" },
          ],
        },
        {
          label: "Home Improvement",
          path: "/",
          subLinks: [
            { label: "Home Storage & Organization", path: "/" },
            { label: "Heating, Cooling & Air Quality", path: "/" },
            { label: "Lighting & Ceiling Fans", path: "/" },
            { label: "Building Supplies", path: "/" },
            { label: "Electrical", path: "/" },
            { label: "Other Home Improvement Supplies", path: "/" },
          ],
        },
        {
          label: "Bath",
          path: "/",
          subLinks: [
            { label: "Bathroom Fittings & Accessories", path: "/" },
            { label: "Bath Towels", path: "/" },
            { label: "Bath Rugs", path: "/" },
          ],
        },
        {
          label: "Appliances",
          path: "/",
          subLinks: [
            { label: "Kitchen Appliances", path: "/" },
            { label: "Household Appliance", path: "/" },
            { label: "Appliance Parts & Accessories", path: "/" },
            { label: "Other Appliances", path: "/" },
          ],
        },
        {
          label: "Lamps & Light Fixtures",
          path: "/",
          subLinks: [],
        },
        {
          label: "Power & Hand Tools",
          path: "/",
          subLinks: [
            { label: "Power Tools, Parts & Accessories", path: "/" },
            { label: "Hand Tools", path: "/" },
            { label: "Tool Organizers", path: "/" },
            { label: "Gardening Tools", path: "/" },
          ],
        },
        {
          label: "Event & Party Supplies",
          path: "/",
          subLinks: [],
        },
        {
          label: "Hardware",
          path: "/",
          subLinks: [],
        },
        {
          label: "Kitchen & Bath Fixtures",
          path: "/",
          subLinks: [],
        },
        {
          label: "Fine Art",
          path: "/",
          subLinks: [],
        },
        {
          label: "Gifts",
          path: "/",
          subLinks: [],
        },
      ],
    },
    {
      label: "Beauty & Health",
      path: "/",
      icon: imageSet.categoriesImages.category2,
      subLinks: [
        {
          label: "All Beauty",
          path: "/",
          subLinks: [
            { label: "Fragrance", path: "/" },
            { label: "Makeup", path: "/" },
            { label: "Skin Care", path: "/" },
            { label: "Hair Care", path: "/" },
            { label: "Beauty Tools & Accessories", path: "/" },
            { label: "Oral Care", path: "/" },
          ],
        },
        {
          label: "Health, Household & Baby Care",
          path: "/",
          subLinks: [
            { label: "Sexual Wellness", path: "/" },
            { label: "Health Care", path: "/" },
            { label: "Medical Supplies", path: "/" },
            { label: "Personal Care", path: "/" },
            { label: "Household Supplies", path: "/" },
            { label: "Wellness & Relaxation", path: "/" },
            { label: "Baby Care & Child Care", path: "/" },
          ],
        },
        {
          label: "Men's Grooming",
          path: "/",
          subLinks: [],
        },
        {
          label: "Hemp CBD Products",
          path: "/",
          subLinks: [],
        },
      ],
    },
    {
      label: "Outdoor",
      path: "/",
      icon: imageSet.categoriesImages.category3,
      subLinks: [
        {
          label: "Outdoor Furniture",
          path: "/",
          subLinks: [
            { label: "Patio Furniture Sets", path: "/" },
            { label: " Patio Seating", path: "/" },
            { label: "Patio Tables", path: "/" },
            { label: "Patio Furniture Covers", path: "/" },
            { label: "Umbrellas & Shade", path: "/" },
            { label: "Hammocks, Stands & Accessories", path: "/" },
            { label: "Other Patio Furniture", path: "/" },
          ],
        },
        {
          label: "Camping & Hiking",
          path: "/",
          subLinks: [
            { label: "Navigation & Electronics", path: "/" },
            { label: "Camping & Hiking Personal Care", path: "/" },
            { label: "Lights & Lanterns", path: "/" },
            { label: "Tents & Shelters", path: "/" },
            { label: " Camping Furniture", path: "/" },
            { label: "Camping Dining Items", path: "/" },
            { label: "Camping Cookware", path: "/" },
            { label: " Backpacks & Bags", path: "/" },
            { label: "Sleeping Bags & Camp Bedding", path: "/" },
            { label: " Knives & Tools", path: "/" },
            { label: " Safety & Survival", path: "/" },
            { label: "Water Bottles & Containers", path: "/" },
            { label: " Freeze-Dried Food", path: "/" },
            { label: " Other Camping & Hiking Products", path: "/" },
          ],
        },
        {
          label: "Gardening & Lawn Care",
          path: "/",
          subLinks: [
            { label: " Pots, Planters & Container Accessories", path: "/" },
            { label: " Watering Equipment", path: "/" },
            { label: "Plant Support Structures", path: "/" },
            { label: "Greenhouses & Accessories", path: "/" },
            { label: "Plants, Seeds & Bulbs", path: "/" },
            { label: "Other Gardening & Lawn Care", path: "/" },
          ],
        },
        {
          label: "Outdoor Decor",
          path: "/",
          subLinks: [
            { label: "Outdoor Curtains", path: "/" },
            { label: " Decoration Lighting", path: "/" },
            { label: " Yard Signs", path: "/" },
            { label: "Other Outdoor Decor", path: "/" },
          ],
        },
        {
          label: "Cycling & Wheel Sports",
          path: "/",
          subLinks: [
            { label: "Cycling & Wheel Sports Accessories", path: "/" },
            { label: "Electric Bikes", path: "/" },
            { label: "Bike Trainers", path: "/" },
            { label: "Components & Parts", path: "/" },
            { label: "Other Cycles", path: "/" },
          ],
        },
        {
          label: "Pools, Hot Tubs & Supplies",
          path: "/",
          subLinks: [],
        },
        {
          label: "Playground & Park Equipment",
          path: "/",
          subLinks: [],
        },
        {
          label: "Outdoor Storage",
          path: "/",
          subLinks: [],
        },
        {
          label: "RV Equipment",
          path: "/",
          subLinks: [],
        },
        {
          label: "Grills & Outdoor Cooking",
          path: "/",
          subLinks: [],
        },
        {
          label: "Scooters",
          path: "/",
          subLinks: [],
        },
        {
          label: "Outdoor Recreation",
          path: "/",
          subLinks: [],
        },
        {
          label: "Climbing",
          path: "/",
          subLinks: [],
        },
        {
          label: "Outdoor Heating & Cooling",
          path: "/",
          subLinks: [],
        },
        {
          label: "Skateboarding",
          path: "/",
          subLinks: [],
        },
        {
          label: "Deck Tiles & Planks",
          path: "/",
          subLinks: [],
        },
        {
          label: "Dog Sports",
          path: "/",
          subLinks: [],
        },
      ],
    },
    {
      label: "Clothing, Shoes & Jewelry",
      path: "/",
      icon: imageSet.categoriesImages.category4,
      subLinks: [
        {
          label: "Jewelry & Watches",
          path: "/",
          subLinks: [
            { label: "Rings", path: "/" },
            { label: "Earrings", path: "/" },
            { label: "Bracelets", path: "/" },
            { label: "Necklaces", path: "/" },
            { label: "Body Jewelry", path: "/" },
            { label: "Pendants", path: "/" },
            { label: "Charms", path: "/" },
            { label: "Brooches & Pins", path: "/" },
            { label: "Watches", path: "/" },
            { label: "Other Jewelry & Accessories", path: "/" },
          ],
        },
        {
          label: "Women",
          path: "/",
          subLinks: [
            { label: "Women's Clothing", path: "/" },
            { label: "Women's Fashion Accessories", path: "/" },
            { label: "Women's Handbags & Wallets", path: "/" },
            { label: "Women's Shoes", path: "/" },
          ],
        },
        {
          label: "Men",
          path: "/",
          subLinks: [
            { label: "Men's Clothing", path: "/" },
            { label: "Men's Fashion Accessories", path: "/" },
            { label: "Men's Shoes", path: "/" },
          ],
        },
        {
          label: "Girls",
          path: "/",
          subLinks: [],
        },
        {
          label: "Luggage",
          path: "/",
          subLinks: [
            { label: "Waist Packs", path: "/" },
            { label: "Travel Accessories", path: "/" },
            { label: "Other Luggage Supplies", path: "/" },
          ],
        },
        {
          label: "Unisex",
          path: "/",
          subLinks: [
            { label: "Unisex Fashion Accessories", path: "/" },
            { label: "Unisex Clothing", path: "/" },
            { label: "Unisex Shoes", path: "/" },
            { label: "Work", path: "/" },
          ],
        },
        {
          label: "Boys",
          path: "/",
          subLinks: [],
        },
        {
          label: "Fashion Accessories",
          path: "/",
          subLinks: [
            { label: "Bags & Backpacks", path: "/" },
            { label: "Wallets, Card Cases & Money Organizers", path: "/" },
            { label: "Cold-weather Accessories", path: "/" },
            { label: "Other Fashion Accessories", path: "/" },
          ],
        },
        {
          label: "Baby",
          path: "/",
          subLinks: [],
        },
      ],
    },
    {
      label: "Toys, Kids & Baby",
      path: "/",
      icon: imageSet.categoriesImages.category5,
      subLinks: [
        {
          label: "Baby",
          path: "/",
          subLinks: [
            { label: "Unisex Clothing & Other Products", path: "/" },
            { label: "Nursery & Nursery Décor", path: "/" },
            { label: "Girls' Clothing, Shoes & Accessories", path: "/" },
            { label: "Diapers", path: "/" },
            { label: "Baby Strollers", path: "/" },
            { label: " Baby Bedding", path: "/" },
            { label: "Baby Feeding", path: "/" },
            { label: "Car Seats & Other Safety Products", path: "/" },
            { label: "Boys' Clothing, Shoes & Accessories", path: "/" },
            { label: "Furniture", path: "/" },
            { label: "Baby Gifts", path: "/" },
            { label: "Monitor Boutique", path: "/" },
            { label: " Bathing & Skin Care", path: "/" },
            { label: "Other Baby Products", path: "/" },
          ],
        },
        {
          label: "Toys & Games",
          path: "/",
          subLinks: [
            { label: " Hobbies", path: "/" },
            { label: " Sports & Outdoor Play", path: "/" },
            { label: "Baby & Toddler Toys", path: "/" },
            { label: " Dolls & Accessories", path: "/" },
            { label: " Novelty & Gag Toys", path: "/" },
            { label: "Learning & Education", path: "/" },
            { label: "Grown-Up Toys", path: "/" },
            { label: "Puzzles", path: "/" },
            { label: "Arts & Crafts", path: "/" },
            { label: "Activities & Amusements", path: "/" },
            { label: "Puppets", path: "/" },
            { label: "Stuffed Animals & Plush Toys", path: "/" },
            { label: "Other Toys & Games Supplies", path: "/" },
          ],
        },
      ],
    },
    {
      label: "Sports",
      path: "/",
      icon: imageSet.categoriesImages.category6,
      subLinks: [
        {
          label: "Fan Gear",
          path: "/",
          subLinks: [],
        },
        {
          label: "Exercise & Fitness",
          path: "/",
          subLinks: [
            { label: "Strength Training Equipment", path: "/" },
            { label: "Cardio Training", path: "/" },
            { label: "Yoga", path: "/" },
            { label: "Triathlon", path: "/" },
            { label: "Other Exercise & Fitness Equipment", path: "/" },
          ],
        },
        {
          label: "Leisure Sports & Game Room",
          path: "/",
          subLinks: [
            { label: "Casino & Card Games", path: "/" },
            { label: "Table Tennis", path: "/" },
            { label: "Trampolines & Accessories" },
            { label: "Darts & Equipment", path: "/" },
            { label: "Bowling", path: "/" },
          ],
        },
        {
          label: "Team Sports",
          path: "/",
          subLinks: [
            { label: "Fencing", path: "/" },
            { label: "Basketball", path: "/" },
            { label: "Football", path: "/" },
            { label: "Volleyball", path: "/" },
            { label: "Other Team Sports", path: "/" },
          ],
        },
        {
          label: "Hunting & Fishing",
          path: "/",
          subLinks: [
            { label: "Fishing", path: "/" },
            { label: "Hunting", path: "/" },
            { label: "Archery", path: "/" },
            { label: "Other Hunting & Fishing", path: "/" },
          ],
        },
        {
          label: "Ballet & Dance",
          path: "/",
          subLinks: [],
        },
        {
          label: "Swimming",
          path: "/",
          subLinks: [],
        },
        {
          label: "Boating",
          path: "/",
          subLinks: [],
        },
        {
          label: "Golf",
          path: "/",
          subLinks: [],
        },
        {
          label: "Airsoft",
          path: "/",
          subLinks: [
            { label: "Protective Gear", path: "/" },
            { label: "Other Airsoft Products", path: "/" },
          ],
        },
        {
          label: "Surfing",
          path: "/",
          subLinks: [],
        },
        {
          label: "Motor Sports",
          path: "/",
          subLinks: [],
        },
        {
          label: "Shooting",
          path: "/",
          subLinks: [
            { label: "Gun Accessories", path: "/" },
            { label: "Other Shooting Products", path: "/" },
          ],
        },
        {
          label: "Water Sports",
          path: "/",
          subLinks: [
            { label: "Kitesurfing Equipment", path: "/" },
            { label: " Wakeboarding", path: "/" },
            { label: "Other Water Sports Equipment", path: "/" },
          ],
        },
        {
          label: "Boxing",
          path: "/",
          subLinks: [
            { label: "Boxing Gym Equipment", path: "/" },
            { label: "Boxing Protective Gear", path: "/" },
            { label: "Boxing Gloves", path: "/" },
            { label: "Other Boxing Equipment", path: "/" },
          ],
        },
        {
          label: "Gymnastics",
          path: "/",
          subLinks: [],
        },
        {
          label: "Badminton",
          path: "/",
          subLinks: [],
        },
        {
          label: "Diving",
          path: "/",
          subLinks: [],
        },
        {
          label: "Baseball",
          path: "/",
          subLinks: [],
        },
        {
          label: "Snow Skiing",
          path: "/",
          subLinks: [],
        },
        {
          label: "Softball",
          path: "/",
          subLinks: [],
        },
        {
          label: "Skating",
          path: "/",
          subLinks: [],
        },
        {
          label: "Snowmobiling",
          path: "/",
          subLinks: [],
        },
        {
          label: "Law Enforcement",
          path: "/",
          subLinks: [],
        },
        {
          label: "Other Sport Products",
          path: "/",
          subLinks: [],
        },
      ],
    },
    {
      label: "Pets",
      path: "/",
      icon: imageSet.categoriesImages.category7,
      subLinks: [
        {
          label: "Pet Supplies",
          path: "/",
          subLinks: [
            { label: "Car & Travel", path: "/" },
            { label: "Pet Accessories", path: "/" },
            { label: "Furniture", path: "/" },
            { label: "Pet Fashions", path: "/" },
            { label: "Pet Toys", path: "/" },
            { label: "Collar, Leads, Harnesses & Training", path: "/" },
            { label: "Pet Carriers", path: "/" },
            { label: "Pet Food &Treats", path: "/" },
            { label: "Grooming Tools & Accessories", path: "/" },
            { label: "Health & Nutrition", path: "/" },
            { label: "Dishes & Food Storage", path: "/" },
            { label: "Crates & Accessories", path: "/" },
            { label: "Stain, Odor & Clean-up, House Train", path: "/" },
            { label: "Doors & Gates", path: "/" },
            { label: "Exercise Pens & Kennels", path: "/" },
            { label: "Treats", path: "/" },
            { label: "Clippers, Blades & Accessories", path: "/" },
            { label: "Flea & Tick", path: "/" },
            { label: "Gifts For Pet Lovers", path: "/" },
            { label: "Other Pet Products", path: "/" },
          ],
        },
        {
          label: "Dogs",
          path: "/",
          subLinks: [
            { label: "Dog Crates, Houses & Pens", path: "/" },
            { label: "Dog Food", path: "/" },
            { label: "Dog Apparel & Accessories", path: "/" },
            { label: "Dog Toys", path: "/" },
            { label: "Dog Beds & Furniture", path: "/" },
            { label: "Dog Doors, Gates & Ramps", path: "/" },
            { label: "Dog Collars, Harnesses & Leashes", path: "/" },
            { label: "Dog Training & Behavior Aids", path: "/" },
            { label: "Dog Feeding & Watering Supplies", path: "/" },
            { label: "Dog Carriers & Travel Products", path: "/" },
            { label: "Dog Grooming", path: "/" },
            { label: "Dog Health Supplies", path: "/" },
          ],
        },
        {
          label: "Cats",
          path: "/",
          subLinks: [
            { label: "Cat Beds & Furniture", path: "/" },
            { label: "Cat Food", path: "/" },
            { label: "Cat Toys", path: "/" },
            { label: "Cat Cages", path: "/" },
            { label: "Cat Feeding & Watering Supplies", path: "/" },
            { label: "Other Cat Products", path: "/" },
          ],
        },
        {
          label: "Small Animals",
          path: "/",
          subLinks: [
            { label: "Small Animal Houses & Habitats", path: "/" },
            { label: "Small Animal Carriers", path: "/" },
            { label: "Small Animal Feeding & Watering Supplies", path: "/" },
            { label: "Small Animal Grooming", path: "/" },
            { label: "Small Animal Collars, Harnesses & Leashes", path: "/" },
            { label: "Other Small Animal Products", path: "/" },
          ],
        },
        {
          label: "Birds",
          path: "/",
          subLinks: [
            { label: "Bird Cages & Accessories", path: "/" },
            { label: "Bird Feeding & Watering Supplies", path: "/" },
            { label: "Bird Food", path: "/" },
            { label: "Other Bird Products", path: "/" },
          ],
        },
        {
          label: "Fish & Aquatic Pets",
          path: "/",
          subLinks: [
            { label: "Aquarium Pumps & Filters", path: "/" },
            { label: "Fish & Aquatic Pet Food", path: "/" },
            { label: "Aquarium Decor", path: "/" },
            { label: "Other Fish & Aquatic Products", path: "/" },
          ],
        },
        {
          label: "Horses",
          path: "/",
          subLinks: [],
        },
        {
          label: "Reptiles & Amphibians",
          path: "/",
          subLinks: [],
        },
      ],
    },
    {
      label: "Electronics",
      path: "/",
      icon: imageSet.categoriesImages.category8,
      subLinks: [
        {
          label: "Gps",
          path: "/",
          subLinks: [
            { label: "Tracking Devices", path: "/" },
            { label: "Automotive GPS Devices", path: "/" },
          ],
        },
        {
          label: "Car Electronics",
          path: "/",
          subLinks: [],
        },
        {
          label: "Batteries, Chargers & Power Supplies",
          path: "/",
          subLinks: [],
        },
        {
          label: "Camera, Photo & Video",
          path: "/",
          subLinks: [],
        },
        {
          label: "Cell Phones & Accessories",
          path: "/",
          subLinks: [],
        },
        {
          label: "Headphones",
          path: "/",
          subLinks: [
            { label: "Headphone Accessories", path: "/" },
            { label: "Earbud Headphones", path: "/" },
            { label: "Wireless Headphones", path: "/" },
            { label: "Sports & Fitness Headphones", path: "/" },
            { label: "Other Headphones", path: "/" },
          ],
        },
        {
          label: "Home Automation & Security",
          path: "/",
          subLinks: [
            { label: "Spy Gadgets", path: "/" },
            { label: "Security & Surveillance", path: "/" },
            { label: " Other Home Automation Supplies", path: "/" },
          ],
        },
        {
          label: "General Electronics",
          path: "/",
          subLinks: [],
        },
        {
          label: "Wearable Technology",
          path: "/",
          subLinks: [],
        },
        {
          label: "Bluetooth & Wireless Speakers",
          path: "/",
          subLinks: [],
        },
        {
          label: "Portable Audio & Video",
          path: "/",
          subLinks: [],
        },
        {
          label: "Electronics Accessories",
          path: "/",
          subLinks: [],
        },
        {
          label: "TV & Video",
          path: "/",
          subLinks: [],
        },
        {
          label: "Home Audio & Theater",
          path: "/",
          subLinks: [],
        },
        {
          label: "Ipod, Mp3 & Media Players",
          path: "/",
          subLinks: [],
        },
        {
          label: "Other Electronics Products",
          path: "/",
          subLinks: [],
        },
      ],
    },
    {
      label: "Computers, Office Supplies",
      path: "/",
      icon: imageSet.categoriesImages.category9,
      subLinks: [
        {
          label: "Office & School Supplies",
          path: "/",
          subLinks: [
            { label: "Cards, Card Stock & Card Filing", path: "/" },
            { label: "Office & School Furniture", path: "/" },
            { label: "Desks & Desk Accessories", path: "/" },
            { label: "Office & School Chairs and Accessories", path: "/" },
            { label: "School Supplies", path: "/" },
            { label: "Paper", path: "/" },
            { label: "Art & Drafting", path: "/" },
            { label: "Office Basics", path: "/" },
            { label: "Clips & Clamps", path: "/" },
            { label: "Clothes Racks", path: "/" },
            { label: "Audio Visual", path: "/" },
            { label: "Computer Furniture", path: "/" },
            { label: "Files", path: "/" },
            { label: "Notebooks", path: "/" },
            { label: "Appointment Books", path: "/" },
            { label: "Laminators", path: "/" },
            { label: "Binding Systems", path: "/" },
            { label: "Adhesives", path: "/" },
            { label: "Office & School Equipment", path: "/" },
            { label: "Labels", path: "/" },
            { label: "Binders", path: "/" },
            { label: "Other Office & School Supplies", path: "/" },
          ],
        },
        {
          label: "Office Maintenance, Janitorial & Lunchroom",
          path: "/",
          subLinks: [],
        },
        {
          label: "Computer & Office Accessories",
          path: "/",
          subLinks: [
            { label: "Memory Cards & Accessories", path: "/" },
            { label: "Keyboards, Mice & Accessories", path: "/" },
            { label: "Audio & Video Accessories", path: "/" },
            { label: "Misc Accessories", path: "/" },
            { label: "Cleaning & Repair", path: "/" },
            { label: "Printer Ink & Toner", path: "/" },
            { label: "Computer Cable Adapters", path: "/" },
            { label: "Printer Accessories", path: "/" },
            { label: "Cables & Interconnects", path: "/" },
            { label: "Input Devices", path: "/" },
            { label: "Drive Enclosures", path: "/" },
            { label: "Usb/Firewire Hubs & Devices", path: "/" },
            { label: "Cable Security Devices", path: "/" },
            { label: "Other Computer & Office Accessories", path: "/" },
          ],
        },
        {
          label: "Printers",
          path: "/",
          subLinks: [],
        },
        {
          label: "Computers & Tablets",
          path: "/",
          subLinks: [
            { label: "Tablets", path: "/" },
            { label: "Desktops", path: "/" },
            { label: "Laptops", path: "/" },
          ],
        },
        {
          label: "Networking",
          path: "/",
          subLinks: [],
        },
        {
          label: "Computer Parts & Components",
          path: "/",
          subLinks: [
            { label: "Cases & Power Supplies", path: "/" },
            { label: "Fans & Cooling", path: "/" },
            { label: "Controller Cards", path: "/" },
            { label: "Sleeves, Cases, And Bags", path: "/" },
            { label: "Other Computer Parts & Components", path: "/" },
          ],
        },
        {
          label: "Drives & Storage",
          path: "/",
          subLinks: [],
        },
        {
          label: "Monitors",
          path: "/",
          subLinks: [],
        },
        {
          label: "Other Office Supplies",
          path: "/",
          subLinks: [],
        },
      ],
    },
    {
      label: "All Categories",
      path: "/",
      subLinks: [
        {
          label: "Industrial",
          path: "/",
          subLinks: [
            {
              label: "Packaging & Shipping Supplies",
              path: "/",
              subLinks: [],
            },
            {
              label: "Industrial Electrical",
              path: "/",
              subLinks: [
                { label: "  Controls & Indicators", path: "/" },
                { label: "   Wiring & Connecting", path: "/" },
                { label: " Optoelectronic Products", path: "/" },
                { label: " Other Industrial Electrica", path: "/" },
              ],
            },
            {
              label: "Lab & Scientific Products",
              path: "/",
              subLinks: [
                { label: "Glassware & Labware", path: "/" },
                { label: "    Lab Supplies & Consumables", path: "/" },
                { label: "      Other Lab & Scientific Pro", path: "/" },
              ],
            },
            {
              label: "Machinery",
              path: "/",
              subLinks: [
                { label: "Agricultural & Food Machinery", path: "/" },
                { label: "      General Machinery & Tools", path: "/" },
                { label: "   Other Machinery", path: "/" },
              ],
            },
            {
              label: "Occupational Health & Safety Products",
              path: "/",
              subLinks: [],
            },
            {
              label: "Hydraulics, Pneumatics & Plumbing",
              path: "/",
              subLinks: [
                { label: " Hydraulic Equipment", path: "/" },
                { label: "   Pumps", path: "/" },
                { label: "      Tubing, Pipe & Hose", path: "/" },
                { label: "  Hose Nozzles", path: "/" },
                { label: "  Seals & O-Rings", path: "/" },
                { label: "  Other Hydraulics, Pneum", path: "/" },
              ],
            },
            {
              label: "Industrial Power & Hand Tools",
              path: "/",
              subLinks: [],
            },
            {
              label: "Abrasive & Finishing Products",
              path: "/",
              subLinks: [
                { label: "    Abrasive Accessories", path: "/" },
                { label: " Abrasive Wheels & Discs", path: "/" },
                { label: " Other Abrasive & Finishing ", path: "/" },
              ],
            },
            {
              label: "Test, Measure & Inspect",
              path: "/",
              subLinks: [],
            },
            {
              label: "Cutting Tools",
              path: "/",
              subLinks: [],
            },
            {
              label: "Power Transmission Products",
              path: "/",
              subLinks: [
                { label: " Ratchets & Pawls", path: "/" },
                { label: "Brakes & Clutches", path: "/" },
                { label: "Other Power Transmission ", path: "/" },
              ],
            },
            {
              label: "Filtration",
              path: "/",
              subLinks: [],
            },
            {
              label: "Hardware",
              path: "/",
              subLinks: [],
            },
            {
              label: "Tapes, Adhesives & Sealants",
              path: "/",
              subLinks: [],
            },
            {
              label: "Fasteners",
              path: "/",
              subLinks: [],
            },
            {
              label: "Other Industrial Products",
              path: "/",
              subLinks: [],
            },
          ],
        },
        {
          label: "Arts & Crafts",
          path: "/",
          subLinks: [
            {
              label: "Party Decorations & Supplies",
              path: "/",
              subLinks: [],
            },
            {
              label: "Painting, Drawing & Art Supplies",
              path: "/",
              subLinks: [
                { label: "  Painting", path: "/" },
                { label: "  Drawing", path: "/" },
                { label: "   Art Paper", path: "/" },
                {
                  label: "  Other Painting, Drawing & Art Supplies",
                  path: "/",
                },
              ],
            },
            {
              label: "Crafting",
              path: "/",
              subLinks: [
                { label: "  Craft Supplies", path: "/" },
                { label: "  Paper & Paper Crafts", path: "/" },
                { label: "     Sculpture Supplies", path: "/" },
                { label: "  Other Crafting Products", path: "/" },
              ],
            },
            {
              label: "Beading & Jewelry Making",
              path: "/",
              subLinks: [],
            },
            {
              label: "Sewing",
              path: "/",
              subLinks: [
                { label: " Trim & Embellishments", path: "/" },
                { label: "     Sewing Project Kits", path: "/" },
                { label: "  Sewing Notions & Supplies", path: "/" },
                { label: "  Other Sewing Supplies", path: "/" },
              ],
            },
            {
              label: "Needlework",
              path: "/",
              subLinks: [
                { label: "  Cross-Stitch", path: "/" },
                { label: "Embroidery", path: "/" },
                { label: "Other Needlework Supplies", path: "/" },
              ],
            },
            {
              label: "Scrapbooking & Stamping",
              path: "/",
              subLinks: [
                {
                  label: "  Other Scrapbooking & Stamping Supplies",
                  path: "/",
                },
              ],
            },
            {
              label: "Knitting & Crochet",
              path: "/",
              subLinks: [
                { label: "    Yarn", path: "/" },
                { label: "  Knitting Needles", path: "/" },
                { label: "   Knitting Kits", path: "/" },
                { label: " Other Knitting & Crochet Supplies", path: "/" },
              ],
            },
            {
              label: "Other Arts & Crafts Supplies",
              path: "/",
              subLinks: [],
            },
          ],
        },
        {
          label: "Automotive",
          path: "/",
          subLinks: [
            {
              label: "Automotive Parts & Accessories",
              path: "/",
              subLinks: [
                { label: "Automotive Replacement Parts", path: "/" },
                { label: "   Exterior Accessories", path: "/" },
                { label: "     Tires & Wheels", path: "/" },
                { label: "    Interior Accessories", path: "/" },
                { label: "   Car Care", path: "/" },
                { label: " Other Automotive Parts ", path: "/" },
              ],
            },
            {
              label: "Automotive Tools & Equipment",
              path: "/",
              subLinks: [
                { label: "   Garage & Shop", path: "/" },
                {
                  label: "  Automotive Tools & Equipment Accessories",
                  path: "/",
                },
                { label: "  Diagnostic & Test Tools", path: "/" },
                {
                  label: " Automotive Air Conditioning Tools & Equipment",
                  path: "/",
                },
                { label: " Body Repair Tools", path: "/" },
                { label: " Tool Storage & Workbenches", path: "/" },
                { label: "  Automotive Hand Tools", path: "/" },
                { label: "  Supplies & Materials", path: "/" },
                { label: "      Tire Air Compressors & Inflators", path: "/" },
                { label: "Abrasives & Accessories", path: "/" },
                { label: "  Other Automotive Tool", path: "/" },
              ],
            },
            {
              label: "Car/Vehicle Electronics & GPS",
              path: "/",
              subLinks: [
                { label: " Vehicle GPS", path: "/" },
                { label: "Vehicle Electronics Accessories", path: "/" },
                { label: "Other Vehicle Electronics", path: "/" },
              ],
            },
            {
              label: "Motorcycle & Powersports",
              path: "/",
              subLinks: [],
            },
          ],
        },
        {
          label: "Entertainment",
          path: "/",
          subLinks: [
            {
              label: "Books & Video",
              path: "/",
              subLinks: [],
            },
            {
              label: "Video Games",
              path: "/",
              subLinks: [],
            },
            {
              label: "Music & Musical Instruments",
              path: "/",
              subLinks: [],
            },
          ],
        },
      ],
    },
  ],

  bannerList: [
    { image: "/featureBanner/image-1.webp", path: "/" },
    { image: "/featureBanner/image-2.webp", path: "/" },
    { image: "/featureBanner/image-3.webp", path: "/" },
  ],
};

export default navigation;
