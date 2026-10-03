/* ==========================================================================
   LocalCart — Initial Seed Mock Data
   5 Shops, 25+ Products, 8 Categories, 10+ Orders, 10+ Reviews, 5 Sellers, 10+ Customers
   ========================================================================== */

const INITIAL_SHOPS = [
  {
    id: "shop-1",
    name: "Sri Murugan Stores",
    category: "Grocery",
    rating: 4.8,
    reviewsCount: 142,
    distance: "0.8 km",
    deliveryTime: "15-20 min",
    isOpen: true,
    address: "124 M.G. Road, Indiranagar, Bengaluru",
    banner: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80",
    logo: "https://images.unsplash.com/photo-1534723452862-4c874018d66d?auto=format&fit=crop&w=200&q=80",
    sellerId: "seller-1",
    phone: "+91 98765 43210",
    hours: "7:00 AM - 10:00 PM",
    description: "Your trusted local supermarket for daily essentials, fresh pulses, spices, and branded groceries."
  },
  {
    id: "shop-2",
    name: "Green Basket",
    category: "Vegetables",
    rating: 4.9,
    reviewsCount: 98,
    distance: "1.2 km",
    deliveryTime: "20-25 min",
    isOpen: true,
    address: "45 Farm View Street, HSR Layout, Bengaluru",
    banner: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80",
    logo: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=200&q=80",
    sellerId: "seller-2",
    phone: "+91 98123 45678",
    hours: "6:00 AM - 9:00 PM",
    description: "Farm-fresh organic vegetables and exotic fruits sourced directly from local farmers daily."
  },
  {
    id: "shop-3",
    name: "Fresh Mart",
    category: "Bakery",
    rating: 4.7,
    reviewsCount: 210,
    distance: "1.5 km",
    deliveryTime: "25-30 min",
    isOpen: true,
    address: "88 Commercial Street, Bengaluru",
    banner: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
    logo: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=200&q=80",
    sellerId: "seller-3",
    phone: "+91 97890 12345",
    hours: "8:00 AM - 10:30 PM",
    description: "Freshly baked artisan bread, cakes, cookies, and delicious dairy products."
  },
  {
    id: "shop-4",
    name: "Daily Needs Pharmacy",
    category: "Pharmacy",
    rating: 4.6,
    reviewsCount: 76,
    distance: "0.5 km",
    deliveryTime: "10-15 min",
    isOpen: true,
    address: "12 Main Bus Stand Road, Indiranagar, Bengaluru",
    banner: "https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&w=800&q=80",
    logo: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=200&q=80",
    sellerId: "seller-4",
    phone: "+91 96543 21098",
    hours: "24 Hours Open",
    description: "100% genuine medicines, healthcare supplements, personal care, and emergency medical kits."
  },
  {
    id: "shop-5",
    name: "Tech Corner",
    category: "Electronics",
    rating: 4.8,
    reviewsCount: 165,
    distance: "2.1 km",
    deliveryTime: "30-40 min",
    isOpen: true,
    address: "204 SP Road, Electronics Market, Bengaluru",
    banner: "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80",
    logo: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=200&q=80",
    sellerId: "seller-5",
    phone: "+91 95432 10987",
    hours: "10:00 AM - 9:00 PM",
    description: "Authorized multi-brand local store for mobile accessories, cables, chargers, and gadgets."
  }
];

const INITIAL_CATEGORIES = [
  { id: "cat-1", name: "Grocery", icon: "shopping-bag", count: 8 },
  { id: "cat-2", name: "Pharmacy", icon: "pill", count: 4 },
  { id: "cat-3", name: "Vegetables", icon: "leaf", count: 6 },
  { id: "cat-4", name: "Bakery", icon: "cookie", count: 5 },
  { id: "cat-5", name: "Electronics", icon: "smartphone", count: 5 },
  { id: "cat-6", name: "Stationery", icon: "book-open", count: 4 },
  { id: "cat-7", name: "Fashion", icon: "shirt", count: 3 },
  { id: "cat-8", name: "Household", icon: "home", count: 4 }
];

const INITIAL_PRODUCTS = [
  // Grocery (Sri Murugan Stores)
  {
    id: "p-101",
    name: "Fortune Sunlite Refined Sunflower Oil 1L",
    category: "Grocery",
    shopId: "shop-1",
    shopName: "Sri Murugan Stores",
    price: 145,
    oldPrice: 160,
    rating: 4.8,
    stock: 45,
    unit: "1 Packet",
    image: "https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?auto=format&fit=crop&w=400&q=80",
    description: "Light and healthy sunflower oil rich in Vitamin E, perfect for daily cooking and frying."
  },
  {
    id: "p-102",
    name: "Aashirvaad Shudh Chakki Atta 5kg",
    category: "Grocery",
    shopId: "shop-1",
    shopName: "Sri Murugan Stores",
    price: 240,
    oldPrice: 265,
    rating: 4.9,
    stock: 30,
    unit: "5 kg Bag",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=400&q=80",
    description: "Made from 100% pure whole wheat grains ground to perfection for soft rotis."
  },
  {
    id: "p-103",
    name: "Tata Salt Vacuum Evaporated Iodized 1kg",
    category: "Grocery",
    shopId: "shop-1",
    shopName: "Sri Murugan Stores",
    price: 28,
    oldPrice: 30,
    rating: 4.9,
    stock: 100,
    unit: "1 kg Packet",
    image: "https://images.unsplash.com/photo-1518110168401-f28442a80426?auto=format&fit=crop&w=400&q=80",
    description: "India's trusted iodized salt ensuring mental and physical well-being."
  },
  {
    id: "p-104",
    name: "Toor Dal Premium 1kg",
    category: "Grocery",
    shopId: "shop-1",
    shopName: "Sri Murugan Stores",
    price: 160,
    oldPrice: 180,
    rating: 4.7,
    stock: 25,
    unit: "1 kg Packet",
    image: "https://images.unsplash.com/photo-1585994191611-72b3a393db2e?auto=format&fit=crop&w=400&q=80",
    description: "Unpolished natural yellow pigeon peas rich in protein and dietary fiber."
  },
  
  // Vegetables (Green Basket)
  {
    id: "p-201",
    name: "Fresh Hybrid Tomatoes 1kg",
    category: "Vegetables",
    shopId: "shop-2",
    shopName: "Green Basket",
    price: 35,
    oldPrice: 45,
    rating: 4.9,
    stock: 60,
    unit: "1 kg",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80",
    description: "Farm-fresh ripe tomatoes harvested this morning. Juicy and sweet."
  },
  {
    id: "p-202",
    name: "Organic Red Onions 1kg",
    category: "Vegetables",
    shopId: "shop-2",
    shopName: "Green Basket",
    price: 40,
    oldPrice: 50,
    rating: 4.8,
    stock: 80,
    unit: "1 kg",
    image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cf?auto=format&fit=crop&w=400&q=80",
    description: "Crisp and flavorful red onions essential for all curry bases and salads."
  },
  {
    id: "p-203",
    name: "Fresh Potato Baby 1kg",
    category: "Vegetables",
    shopId: "shop-2",
    shopName: "Green Basket",
    price: 30,
    oldPrice: 38,
    rating: 4.7,
    stock: 50,
    unit: "1 kg",
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=400&q=80",
    description: "Firm baby potatoes ideal for dum aloo, roasting, and fries."
  },
  {
    id: "p-204",
    name: "Green Capsicum / Bell Pepper 500g",
    category: "Vegetables",
    shopId: "shop-2",
    shopName: "Green Basket",
    price: 45,
    oldPrice: 55,
    rating: 4.8,
    stock: 20,
    unit: "500 grams",
    image: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=400&q=80",
    description: "Crunchy green bell peppers packed with Vitamin C."
  },

  // Bakery (Fresh Mart)
  {
    id: "p-301",
    name: "Artisan Whole Wheat Bread 400g",
    category: "Bakery",
    shopId: "shop-3",
    shopName: "Fresh Mart",
    price: 45,
    oldPrice: 50,
    rating: 4.9,
    stock: 18,
    unit: "1 Loaf",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80",
    description: "Freshly baked daily with 100% whole wheat flour, no added maida."
  },
  {
    id: "p-302",
    name: "Amul Pasteurised Butter 100g",
    category: "Bakery",
    shopId: "shop-3",
    shopName: "Fresh Mart",
    price: 58,
    oldPrice: 60,
    rating: 4.9,
    stock: 40,
    unit: "1 Pack",
    image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=400&q=80",
    description: "Delicious creamy butter made from pure cow milk."
  },
  {
    id: "p-303",
    name: "Chocolate Fudge Brownie 2pcs",
    category: "Bakery",
    shopId: "shop-3",
    shopName: "Fresh Mart",
    price: 120,
    oldPrice: 140,
    rating: 4.9,
    stock: 12,
    unit: "1 Pack (2 Pcs)",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=400&q=80",
    description: "Rich gooey chocolate brownie topped with roasted walnuts."
  },

  // Pharmacy (Daily Needs Pharmacy)
  {
    id: "p-401",
    name: "Dettol Antiseptic Liquid 250ml",
    category: "Pharmacy",
    shopId: "shop-4",
    shopName: "Daily Needs Pharmacy",
    price: 125,
    oldPrice: 135,
    rating: 4.8,
    stock: 35,
    unit: "250 ml Bottle",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80",
    description: "Essential first aid disinfectant liquid for wounds, bathing, and cleaning."
  },
  {
    id: "p-402",
    name: "Multivitamin & Minerals Health Supplement",
    category: "Pharmacy",
    shopId: "shop-4",
    shopName: "Daily Needs Pharmacy",
    price: 320,
    oldPrice: 399,
    rating: 4.7,
    stock: 15,
    unit: "30 Tablets",
    image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=400&q=80",
    description: "Boost immunity and daily energy with essential multivitamins."
  },

  // Electronics (Tech Corner)
  {
    id: "p-501",
    name: "Boat BassHeads 100 Wired Earphones",
    category: "Electronics",
    shopId: "shop-5",
    shopName: "Tech Corner",
    price: 399,
    oldPrice: 999,
    rating: 4.8,
    stock: 22,
    unit: "1 Unit",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80",
    description: "Super extra bass in-ear earphones with inline mic for crisp clear calls."
  },
  {
    id: "p-502",
    name: "Type-C Fast Charging Braided Cable 1m",
    category: "Electronics",
    shopId: "shop-5",
    shopName: "Tech Corner",
    price: 249,
    oldPrice: 499,
    rating: 4.7,
    stock: 4,
    unit: "1 Unit",
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=400&q=80",
    description: "Heavy-duty nylon braided cable supporting 65W fast power charging."
  },
  {
    id: "p-503",
    name: "20000mAh Power Bank 22.5W Fast Charge",
    category: "Electronics",
    shopId: "shop-5",
    shopName: "Tech Corner",
    price: 1499,
    oldPrice: 2499,
    rating: 4.9,
    stock: 8,
    unit: "1 Piece",
    image: "https://images.unsplash.com/photo-1609592424074-1e0e9fb54316?auto=format&fit=crop&w=400&q=80",
    description: "Dual output fast-charging power bank compatible with all mobile devices."
  }
];

const INITIAL_ORDERS = [
  {
    id: "ORD-9821",
    customerId: "cust-1",
    customerName: "Jagan Mohan",
    customerPhone: "+91 98450 12345",
    shopId: "shop-1",
    shopName: "Sri Murugan Stores",
    items: [
      { id: "p-101", name: "Fortune Sunlite Refined Sunflower Oil 1L", price: 145, qty: 2 },
      { id: "p-102", name: "Aashirvaad Shudh Chakki Atta 5kg", price: 240, qty: 1 }
    ],
    subtotal: 530,
    deliveryFee: 30,
    discount: 50,
    total: 510,
    status: "PREPARING", // PLACED, ACCEPTED, PREPARING, READY, OUT FOR DELIVERY, DELIVERED
    paymentMethod: "UPI (Google Pay)",
    deliveryAddress: "Flat 402, Sunrise Apartments, 12th Cross, Indiranagar, Bengaluru - 560038",
    date: "2026-08-20 10:15 AM"
  },
  {
    id: "ORD-9820",
    customerId: "cust-2",
    customerName: "Priya Sharma",
    customerPhone: "+91 98765 11223",
    shopId: "shop-2",
    shopName: "Green Basket",
    items: [
      { id: "p-201", name: "Fresh Hybrid Tomatoes 1kg", price: 35, qty: 2 },
      { id: "p-202", name: "Organic Red Onions 1kg", price: 40, qty: 1 }
    ],
    subtotal: 110,
    deliveryFee: 20,
    discount: 0,
    total: 130,
    status: "DELIVERED",
    paymentMethod: "Cash on Delivery",
    deliveryAddress: "House No 18, 5th Main, HSR Layout Sector 3, Bengaluru - 560102",
    date: "2026-08-19 04:30 PM"
  }
];

const INITIAL_USERS = [
  { id: "cust-1", name: "Jagan Mohan", email: "jagan@example.com", role: "Customer", status: "ACTIVE", joined: "2026-01-15" },
  { id: "cust-2", name: "Priya Sharma", email: "priya@example.com", role: "Customer", status: "ACTIVE", joined: "2026-02-10" },
  { id: "seller-1", name: "Murugan Swamy", email: "murugan@stores.com", role: "Seller", status: "APPROVED", joined: "2025-11-20" },
  { id: "seller-2", name: "Ramesh Green", email: "ramesh@greenbasket.com", role: "Seller", status: "APPROVED", joined: "2025-12-05" },
  { id: "admin-1", name: "Super Admin", email: "admin@localcart.com", role: "Admin", status: "ACTIVE", joined: "2025-10-01" }
];

const INITIAL_COMPLAINTS = [
  { id: "CMP-401", user: "Priya Sharma", type: "Late Delivery", description: "Order ORD-9820 delivered 20 mins after promised slot.", status: "IN REVIEW", date: "2026-08-19" },
  { id: "CMP-402", user: "Rahul Verma", type: "Damaged Item", description: "Bread packet was crushed during transit.", status: "OPEN", date: "2026-08-18" }
];

// Helper to seed localStorage
function initializeLocalStorageData() {
  if (!localStorage.getItem("localcart_shops")) {
    localStorage.setItem("localcart_shops", JSON.stringify(INITIAL_SHOPS));
  }
  if (!localStorage.getItem("localcart_products")) {
    localStorage.setItem("localcart_products", JSON.stringify(INITIAL_PRODUCTS));
  }
  if (!localStorage.getItem("localcart_categories")) {
    localStorage.setItem("localcart_categories", JSON.stringify(INITIAL_CATEGORIES));
  }
  if (!localStorage.getItem("localcart_orders")) {
    localStorage.setItem("localcart_orders", JSON.stringify(INITIAL_ORDERS));
  }
  if (!localStorage.getItem("localcart_users")) {
    localStorage.setItem("localcart_users", JSON.stringify(INITIAL_USERS));
  }
  if (!localStorage.getItem("localcart_complaints")) {
    localStorage.setItem("localcart_complaints", JSON.stringify(INITIAL_COMPLAINTS));
  }
  if (!localStorage.getItem("localcart_cart")) {
    localStorage.setItem("localcart_cart", JSON.stringify([]));
  }
  if (!localStorage.getItem("localcart_wishlist")) {
    localStorage.setItem("localcart_wishlist", JSON.stringify([]));
  }
  if (!localStorage.getItem("localcart_current_user")) {
    localStorage.setItem("localcart_current_user", JSON.stringify({
      id: "cust-1",
      name: "Jagan Mohan",
      email: "jagan@example.com",
      role: "Customer"
    }));
  }
}

// Auto execute seed on load
initializeLocalStorageData();
