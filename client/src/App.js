import { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend
} from "recharts";

import amazon from "./assets/amazon.png";
import flipkart from "./assets/flipkart.png";
import croma from "./assets/croma.png";
import siteLogo from "./assets/logo.jpg"; 

// ─── CONFIGURATION ───
const API_BASE_URL = "https://p4-backend-fq2i.onrender.com";

// ─── SVG ICONS ───
const SearchIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const CartIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>;
const UserIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const HeartIcon = ({ filled }) => <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>;
const CloseIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const BellIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>;
const ShareIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>;
const GridIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>;

// Category Icons
const MobileIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>;
const LaptopIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="12" rx="2" ry="2"></rect><rect x="2" y="16" width="20" height="4" rx="2" ry="2"></rect></svg>;
const FashionIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.38 3.46 16 2a8.86 8.86 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"></path></svg>;
const WatchIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="6" width="12" height="12" rx="2" ry="2"></rect><path d="M8 2v4"></path><path d="M16 2v4"></path><path d="M8 18v4"></path><path d="M16 18v4"></path><circle cx="12" cy="12" r="2"></circle></svg>;
const ApplianceIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="3" width="14" height="18" rx="2" ry="2"></rect><path d="M5 8h14"></path><path d="M10 13h4"></path></svg>;

// ─── LOGIC & HELPERS ───
const generatePriceHistory = (prices) => {
  const days = 30;
  const history = [];
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const label = `${date.getDate()}/${date.getMonth() + 1}`;
    const entry = { date: label };
    prices.forEach(p => {
      const fluctuation = (Math.random() - 0.4) * p.price * 0.1;
      entry[p.site] = Math.round(p.price + fluctuation);
    });
    history.push(entry);
  }
  const last = history[history.length - 1];
  prices.forEach(p => { last[p.site] = p.price; });
  return history;
};

const generateMockSpecs = (name) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes("phone") || lowerName.includes("iphone") || lowerName.includes("samsung")) {
    return { "RAM": "8GB / 12GB", "Storage": "128GB / 256GB", "Display": "6.1-inch OLED", "Battery": "4500 mAh", "Processor": "Latest Gen Octa-Core" };
  } else if (lowerName.includes("laptop") || lowerName.includes("mac") || lowerName.includes("hp") || lowerName.includes("dell")) {
    return { "RAM": "16GB DDR5", "Storage": "512GB NVMe SSD", "Display": "14-inch FHD IPS", "Battery": "Upto 12 Hours", "Processor": "Intel i7 / Apple M-Series" };
  } else if (lowerName.includes("watch") || lowerName.includes("smartwatch")) {
    return { "RAM": "1GB", "Storage": "32GB", "Display": "1.9-inch AMOLED", "Battery": "Upto 3 Days", "Water Resist": "IP68 / 5ATM" };
  } else if (lowerName.includes("shoe") || lowerName.includes("sneaker") || lowerName.includes("slide")) {
    return { "Material": "Premium Mesh", "Sole": "Anti-Slip EVA", "Closure": "Lace-up", "Weight": "Lightweight", "Wash": "Machine Washable" };
  }
  return { "Material": "Premium", "Weight": "Standard", "Warranty": "1 Year", "Returns": "7 Days", "Delivery": "Express" };
};

const SITE_COLORS = { Amazon: "#FF9900", Flipkart: "#2874F0", Croma: "#00A650" };

// ─── STYLES ───
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg-top: #C8D7C8;       /* Sage Green */
    --bg-bottom: #FAF8F5;    /* Cream/Beige */
    --text-main: #1F2937;    /* Dark Charcoal */
    --text-muted: #4B5563;
    --primary-blue: #2563EB; /* Royal Blue */
    --card-bg: #FFFFFF;
    --border-light: rgba(0,0,0,0.08);
    --shadow-soft: 0 4px 20px rgba(0,0,0,0.04);
    --radius-lg: 16px;
    --radius-full: 99px;
  }

  body { 
    font-family: 'Inter', sans-serif; 
    background-color: var(--bg-bottom);
    color: var(--text-main);
    overflow-x: hidden;
  }

  h1, h2, h3, h4, .font-heading {
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  ::-webkit-scrollbar { width: 8px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 10px; }

  @keyframes fadeUp {
    from{opacity:0;transform:translateY(15px)} to{opacity:1;transform:translateY(0)}
  }

  @keyframes popIn {
    0% { opacity: 0; transform: translate(-50%, -40%) scale(0.95); }
    100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  }

  .btn {
    font-family: 'Inter', sans-serif;
    font-weight: 500;
    cursor: pointer;
    border: none;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }
  .btn:hover { transform: translateY(-1px); }
  .btn:active { transform: scale(0.98); }

  .btn-outline {
    background: transparent;
    border: 1px solid var(--primary-blue);
    color: var(--primary-blue);
    border-radius: var(--radius-full);
  }
  .btn-outline:hover { background: rgba(37,99,235,0.05); }

  .btn-solid {
    background: var(--primary-blue);
    color: #FFFFFF;
    border-radius: var(--radius-full);
  }
  .btn-solid:hover { background: #1D4ED8; box-shadow: 0 4px 12px rgba(37,99,235,0.2); }

  .nav-link {
    font-size: 14px;
    font-weight: 500;
    color: var(--text-main);
    cursor: pointer;
    text-decoration: none;
    transition: color 0.2s;
  }
  .nav-link:hover { color: var(--primary-blue); }

  .product-card {
    background: var(--card-bg);
    border-radius: var(--radius-lg);
    padding: 20px;
    border: 1px solid var(--border-light);
    box-shadow: var(--shadow-soft);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .product-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0,0,0,0.08);
  }

  .compare-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
  .compare-table th, .compare-table td { padding: 16px; text-align: left; border-bottom: 1px solid var(--border-light); }
  .compare-table th { color: var(--text-muted); font-weight: 600; font-size: 12px; text-transform: uppercase; width: 120px; }
  .compare-table td { font-size: 14px; color: var(--text-main); }
  
  .badge-deal {
    background: #FEF3C7;
    color: #D97706;
    font-size: 10px;
    font-weight: 700;
    padding: 4px 8px;
    border-radius: 12px;
    text-transform: uppercase;
    display: inline-block;
  }

  .sidebar-link {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.18s ease;
    font-size: 14px;
    color: var(--text-main);
  }
  .sidebar-link:hover { background: rgba(0,0,0,0.05); color: var(--primary-blue); }

  /* Auth Input Styles */
  .auth-input {
    width: 100%; padding: 12px 16px; border: 1px solid var(--border-light);
    border-radius: 8px; font-size: 14px; font-family: 'Inter', sans-serif;
    margin-bottom: 16px; outline: none; transition: border-color 0.2s;
  }
  .auth-input:focus { border-color: var(--primary-blue); }
`;

function PriceHistoryModal({ item, onClose }) {
  if (!item || !item.prices) return null;
  const history = generatePriceHistory(item.prices);
  const lowest = Math.min(...item.prices.map(p => p.price));

  return (
    <>
      <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", zIndex:1100, backdropFilter:"blur(4px)" }} />
      <div style={{
        position:"fixed", top:"50%", left:"50%", transform:"translate(-50%,-50%)",
        background: "#FFFFFF", borderRadius:"24px", padding:"28px",
        width:"min(94vw,640px)", zIndex:1200, boxShadow:"0 24px 60px rgba(0,0,0,0.15)",
        animation:"fadeUp 0.3s ease"
      }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"20px" }}>
          <div>
            <h3 className="font-heading" style={{ fontSize:"18px", color:"#1F2937", marginBottom:"4px" }}>Price History</h3>
            <p style={{ color:"#6B7280", fontSize:"13px", maxWidth:"380px", lineHeight:1.4 }}>{item.name}</p>
          </div>
          <button onClick={onClose} style={{ background:"#F3F4F6", border:"none", borderRadius:"50%", width:"32px", height:"32px", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"#4B5563" }}><CloseIcon/></button>
        </div>

        <div style={{ background:"#F9FAFB", borderRadius:"14px", padding:"16px", border:"1px solid #E5E7EB" }}>
          <LineChart width={530} height={220} data={history} margin={{ top:5, right:10, left:10, bottom:5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="date" tick={{ fill:"#6B7280", fontSize:10 }} interval={4} stroke="#D1D5DB" />
            <YAxis tick={{ fill:"#6B7280", fontSize:10 }} stroke="#D1D5DB" tickFormatter={v=>`₹${(v/1000).toFixed(0)}k`} width={42} />
            <Tooltip contentStyle={{ background:"#FFF", border:"1px solid #E5E7EB", borderRadius:"8px", fontSize:"12px" }} formatter={(value,name)=>[`₹${value.toLocaleString()}`,name]} />
            <Legend wrapperStyle={{ color:"#4B5563", fontSize:"12px", marginTop:"10px" }} />
            {item.prices.map(p => (
              <Line key={p.site} type="monotone" dataKey={p.site} stroke={SITE_COLORS[p.site]||"#000"} strokeWidth={2.5} dot={false} activeDot={{ r:5, strokeWidth:0 }} />
            ))}
          </LineChart>
        </div>
      </div>
    </>
  );
}

function ComparisonModal({ items, onClose, removeFromCompare }) {
  if (!items || items.length === 0) return null;
  const allSpecKeys = Array.from(new Set(items.flatMap(item => Object.keys(item.specs))));

  return (
    <>
      <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", zIndex:1100, backdropFilter:"blur(4px)" }} />
      <div style={{
        position:"fixed", top:"50%", left:"50%", transform:"translate(-50%,-50%)",
        background: "#FFFFFF", borderRadius:"24px", padding:"28px",
        width:"min(96vw,900px)", maxHeight: "85vh", overflowY: "auto", zIndex:1200,
        boxShadow:"0 24px 60px rgba(0,0,0,0.15)", animation:"fadeUp 0.3s ease"
      }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"20px" }}>
          <h2 className="font-heading" style={{ fontSize:"20px", color:"#1F2937" }}>Compare Products</h2>
          <button onClick={onClose} style={{ background:"#F3F4F6", border:"none", borderRadius:"50%", width:"32px", height:"32px", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"#4B5563" }}><CloseIcon/></button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="compare-table">
            <thead>
              <tr>
                <th>Features</th>
                {items.map((item, i) => (
                  <th key={i} style={{ width: `${100 / items.length}%`, textAlign: "center", textTransform: "none" }}>
                    <div style={{ position: "relative", padding: "10px" }}>
                      <button onClick={() => removeFromCompare(item.name)} style={{ position: "absolute", top: 0, right: 0, background: "#FEE2E2", color: "#E11D48", border: "none", borderRadius: "50%", width: "24px", height: "24px", cursor: "pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><CloseIcon/></button>
                      <img src={item.image} alt={item.name} style={{ width: "100px", height: "100px", objectFit: "contain", marginBottom: "10px" }} />
                      <p style={{ fontSize: "13px", fontWeight: 600, color:"#1F2937", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{item.name}</p>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>Best Price</th>
                {items.map((item, i) => {
                  const lowest = Math.min(...item.prices.map(p => p.price));
                  return <td key={i} style={{ textAlign: "center", fontWeight: 700, color: "#16A34A", fontSize: "18px" }}>₹{lowest.toLocaleString()}</td>;
                })}
              </tr>
              {allSpecKeys.map(key => (
                <tr key={key}>
                  <th>{key}</th>
                  {items.map((item, i) => <td key={i} style={{ textAlign: "center" }}>{item.specs[key] || "N/A"}</td>)}
                </tr>
              ))}
              <tr>
                <th>Action</th>
                {items.map((item, i) => {
                  const lowest = Math.min(...item.prices.map(p => p.price));
                  const bestDeal = item.prices.find(p => p.price === lowest);
                  return (
                    <td key={i} style={{ textAlign: "center" }}>
                      <button className="btn btn-solid" onClick={() => window.open(bestDeal.link)} style={{ padding:"10px 20px", fontSize:"13px" }}>View on Store</button>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function App() {
  // 🔥 AUTH & USER STATE 🔥
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "" });

  // 🔥 NEW: Welcome Popup State 🔥
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);

  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [visibleCount, setVisibleCount] = useState(12);
  
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [historyItem, setHistoryItem] = useState(null);
  const [alertForms, setAlertForms] = useState({}); 
  const [alertStatus, setAlertStatus] = useState({});
  const [compareList, setCompareList] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const logos = { Amazon: amazon, Flipkart: flipkart, Croma: croma };

  const exploreCategories = [
    { name: "Mobiles", icon: <MobileIcon/> },
    { name: "Laptops", icon: <LaptopIcon/> },
    { name: "Fashion", icon: <FashionIcon/> },
    { name: "Smartwatches", icon: <WatchIcon/> },
    { name: "Appliances", icon: <ApplianceIcon/> }
  ];

  // 🔥 NEW: Welcome Popup Logic 🔥
  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem("seenWelcomePopup");
    if (!hasSeenPopup && !user) {
      const timer = setTimeout(() => {
        setShowWelcomePopup(true);
        sessionStorage.setItem("seenWelcomePopup", "true");
      }, 2500); 
      return () => clearTimeout(timer);
    }
  }, [user]);

  // 🔥 AUTH LOGIC 🔥
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLoginMode ? "/login" : "/register";
    try {
      // UPDATED TO LIVE LINK
      const res = await axios.post(`${API_BASE_URL}${endpoint}`, authForm);
      setUser(res.data.user); 
      setShowAuthModal(false);
      setAuthForm({ name: "", email: "", password: "" });
      alert(`Welcome ${res.data.user.name}!`);
    } catch (err) {
      alert(err.response?.data?.error || "Authentication failed. Make sure backend is running.");
    }
  };

  const handleLogout = () => {
    setUser(null);
    setShowProfileMenu(false);
  };

  const processApiData = (items) => {
    return items.map(item => {
      if (!item.specs) item.specs = generateMockSpecs(item.name || "");
      return item;
    });
  };

  const fetchHome = async () => {
    setLoading(true);
    try {
      const randomQueries = ["mobile", "laptop", "smartwatch", "headphones"];
      const initialQuery = randomQueries[Math.floor(Math.random() * randomQueries.length)];
      // UPDATED TO LIVE LINK
      const res = await axios.get(`${API_BASE_URL}/search?q=${initialQuery}`);
      if (res.data && res.data.length > 0) setData(processApiData(res.data));
      else {
        // UPDATED TO LIVE LINK
        const fallback = await axios.get(`${API_BASE_URL}/search?q=deals`);
        setData(processApiData(fallback.data));
      }
      setVisibleCount(12);
    } catch (err) { console.log("ERROR:", err); }
    setLoading(false);
  };

  const search = async (q) => {
    const val = q || query;
    if (!val) return;
    setLoading(true);
    setSuggestions([]);
    try {
      // UPDATED TO LIVE LINK
      const res = await axios.get(`${API_BASE_URL}/search?q=${val}`);
      if (res.data && res.data.length > 0) setData(processApiData(res.data));
      else alert("No products found 😢");
      setVisibleCount(12);
    } catch (err) { console.log("ERROR:", err); }
    setLoading(false);
  };

  useEffect(() => { search("best deals"); }, []);

  const suggestionList = ["iPhone 15", "Dell XPS", "Sony TV", "Nike Sneakers", "Apple Watch", "Samsung S24"];
  useEffect(() => {
    if (query.length > 1) setSuggestions(suggestionList.filter(item => item.toLowerCase().includes(query.toLowerCase())));
    else setSuggestions([]);
  }, [query]);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") setActiveIndex(prev => Math.min(prev+1, suggestions.length-1));
    else if (e.key === "ArrowUp") setActiveIndex(prev => Math.max(prev-1, 0));
    else if (e.key === "Enter") { search(activeIndex >= 0 ? suggestions[activeIndex] : query); setSuggestions([]); }
  };

  const handleGoHome = () => {
    setQuery(""); setSuggestions([]); fetchHome(); window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShare = async (item, lowestPrice) => {
    const shareText = `🔥 Check out this deal on P4 Price Dekho: ${item.name.substring(0, 40)}... for just ₹${lowestPrice.toLocaleString()}!`;
    const shareUrl = item.prices.find(p => p.price === lowestPrice)?.link || window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: 'P4 Price Dekho Deal', text: shareText, url: shareUrl }); } catch (e) { }
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`, '_blank');
    }
  };

  const submitAlert = async (item, lowestPrice) => {
    if (!user) { alert("Please Sign In first to set Price Alerts!"); return setShowAuthModal(true); }
    const form = alertForms[item.name];
    if (!form || !form.email || !form.price) return alert("Please enter email and target price.");
    try {
      // UPDATED TO LIVE LINK
      await axios.post(`${API_BASE_URL}/set-alert`, {
        email: form.email, product: item.name, targetPrice: Number(form.price),
        currentPrice: lowestPrice, link: item.prices.find(p => p.price === lowestPrice)?.link || ""
      });
      setAlertStatus(prev => ({ ...prev, [item.name]: 'Alert Set!' }));
      setTimeout(() => {
        setAlertForms(prev => { const n = { ...prev }; delete n[item.name]; return n; });
        setAlertStatus(prev => { const n = { ...prev }; delete n[item.name]; return n; });
      }, 2000);
    } catch (err) { alert("Failed to set alert."); }
  };

  const toggleCompare = (item) => {
    const exists = compareList.find(c => c.name === item.name);
    if (exists) setCompareList(prev => prev.filter(c => c.name !== item.name));
    else {
      if (compareList.length >= 3) return alert("You can only compare up to 3 items at a time.");
      setCompareList(prev => [...prev, item]);
    }
  };

  const toggleWishlist = (item) => {
    if (!user) { alert("Please Sign In first to save items to your Wishlist!"); return setShowAuthModal(true); }
    setWishlist(prev => {
      if (prev.find(w => w.name === item.name)) return prev.filter(w => w.name !== item.name);
      return [...prev, item];
    });
  };

  const isWishlisted = (name) => wishlist.some(w => w.name === name);

  const addToCart = (item) => {
    setCart(prev => {
      const exists = prev.find(c => c.name === item.name);
      if (exists) return prev.map(c => c.name === item.name ? { ...c, qty: c.qty+1 } : c);
      return [...prev, { ...item, qty:1 }];
    });
  };

  const cartTotal = cart.reduce((sum, item) => {
    const lowest = Math.min(...item.prices.map(p => p.price));
    return sum + lowest * item.qty;
  }, 0);

  const sortedData = [...data].sort((a, b) => {
    const getDiscount = (item) => {
      const prices = item.prices.map(p => p.price);
      const max = Math.max(...prices); const min = Math.min(...prices);
      return max > 0 ? Math.floor(((max - min) / max) * 100) : 0;
    };
    return getDiscount(b) - getDiscount(a);
  });

  const BadgeCount = ({ count }) => count > 0 ? (
    <span style={{ position:"absolute", top:"-5px", right:"-5px", background:"var(--primary-blue)", color:"white", borderRadius:"50%", width:"16px", height:"16px", fontSize:"10px", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700 }}>{count}</span>
  ) : null;

  // Reusable Side Panel Component
  const SidePanel = ({ title, items, onClose, renderItem, footer }) => (
    <>
      <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", zIndex:998, backdropFilter:"blur(2px)" }} />
      <div style={{ position:"fixed", right:0, top:0, width:"340px", height:"100%", background:"#FFF", padding:"24px", zIndex:999, overflowY:"auto", boxShadow:"-10px 0 30px rgba(0,0,0,0.05)", animation:"slideIn 0.25s ease", display:"flex", flexDirection:"column" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"24px" }}>
          <h2 className="font-heading" style={{ fontSize:"18px", color:"#1F2937" }}>{title}</h2>
          <button onClick={onClose} style={{ background:"#F3F4F6", border:"none", borderRadius:"50%", width:"32px", height:"32px", cursor:"pointer", color:"#4B5563" }}><CloseIcon/></button>
        </div>
        <div style={{ flex: 1, overflowY:"auto", paddingRight:"4px" }}>
          {items.length === 0 ? <p style={{ color:"#6B7280", textAlign:"center", marginTop:"40px", fontSize:"14px" }}>Nothing here yet.</p> : items.map(renderItem)}
        </div>
        {footer && <div style={{ marginTop:"auto", paddingTop:"20px" }}>{footer}</div>}
      </div>
    </>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight:"100vh" }}>
      <style>{GLOBAL_STYLES}</style>

      {historyItem && <PriceHistoryModal item={historyItem} onClose={() => setHistoryItem(null)} />}
      {showCompareModal && <ComparisonModal items={compareList} onClose={() => setShowCompareModal(false)} removeFromCompare={(name) => { setCompareList(prev => prev.filter(c => c.name !== name)); if(compareList.length<=1) setShowCompareModal(false); }} />}

      {/* 🔥 WELCOME POPUP 🔥 */}
      {showWelcomePopup && (
        <>
          <div onClick={() => setShowWelcomePopup(false)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:1300, backdropFilter:"blur(6px)" }} />
          <div style={{ position:"fixed", top:"50%", left:"50%", transform:"translate(-50%,-50%)", background: "#FFFFFF", borderRadius:"24px", padding:"32px", width:"min(90vw,440px)", zIndex:1400, boxShadow:"0 24px 60px rgba(0,0,0,0.2)", animation:"popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)" }}>
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:"54px", marginBottom:"16px", animation: "fadeUp 0.5s ease 0.2s both" }}>👋</div>
              <h2 className="font-heading" style={{ fontSize:"22px", color:"#1F2937", marginBottom:"12px" }}>Welcome to P4 Price Dekho!</h2>
              <p style={{ fontSize:"15px", color:"var(--text-muted)", lineHeight:1.6, marginBottom:"24px" }}>
                Sign in or create a free account to securely save your <strong style={{ color:"var(--text-main)" }}>Wishlist</strong>, manage your <strong style={{ color:"var(--text-main)" }}>Cart</strong>, and track <strong style={{ color:"var(--text-main)" }}>Price Drops</strong> across all your devices!
              </p>
              <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
                <button className="btn btn-solid" onClick={() => { setShowWelcomePopup(false); setShowAuthModal(true); }} style={{ width:"100%", padding:"14px", fontSize:"15px", fontWeight:600 }}>Create Free Account</button>
                <button onClick={() => setShowWelcomePopup(false)} style={{ background:"transparent", border:"none", color:"var(--text-muted)", fontSize:"14px", cursor:"pointer", fontWeight:600, padding:"8px" }}>Maybe Later</button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 🔥 AUTHENTICATION MODAL 🔥 */}
      {showAuthModal && (
        <>
          <div onClick={() => setShowAuthModal(false)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", zIndex:1100, backdropFilter:"blur(4px)" }} />
          <div style={{ position:"fixed", top:"50%", left:"50%", transform:"translate(-50%,-50%)", background: "#FFFFFF", borderRadius:"24px", padding:"32px", width:"min(94vw,400px)", zIndex:1200, boxShadow:"0 24px 60px rgba(0,0,0,0.15)", animation:"fadeUp 0.3s ease" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"24px" }}>
              <h2 className="font-heading" style={{ fontSize:"22px", color:"#1F2937" }}>{isLoginMode ? "Welcome Back" : "Create Account"}</h2>
              <button onClick={() => setShowAuthModal(false)} style={{ background:"#F3F4F6", border:"none", borderRadius:"50%", width:"32px", height:"32px", cursor:"pointer", color:"#4B5563" }}><CloseIcon/></button>
            </div>
            
            <form onSubmit={handleAuthSubmit}>
              {!isLoginMode && (
                <input required className="auth-input" type="text" placeholder="Full Name" value={authForm.name} onChange={(e) => setAuthForm({...authForm, name: e.target.value})} />
              )}
              <input required className="auth-input" type="email" placeholder="Email Address" value={authForm.email} onChange={(e) => setAuthForm({...authForm, email: e.target.value})} />
              <input required className="auth-input" type="password" placeholder="Password" value={authForm.password} onChange={(e) => setAuthForm({...authForm, password: e.target.value})} />
              
              <button type="submit" className="btn btn-solid" style={{ width: "100%", padding: "14px", fontSize: "15px", marginTop: "8px" }}>
                {isLoginMode ? "Sign In" : "Register"}
              </button>
            </form>

            <p style={{ textAlign: "center", marginTop: "20px", fontSize: "14px", color: "var(--text-muted)" }}>
              {isLoginMode ? "Don't have an account? " : "Already have an account? "}
              <span style={{ color: "var(--primary-blue)", fontWeight: 600, cursor: "pointer" }} onClick={() => setIsLoginMode(!isLoginMode)}>
                {isLoginMode ? "Sign Up" : "Sign In"}
              </span>
            </p>
          </div>
        </>
      )}

      {/* ── NAVBAR ── */}
      <nav style={{ position:"fixed", top:0, width:"100%", height:"72px", padding:"0 40px", display:"flex", justifyContent:"space-between", alignItems:"center", background: "var(--bg-top)", zIndex:100 }}>
        <div style={{ display:"flex", alignItems:"center", gap: "16px", cursor:"pointer" }} onClick={handleGoHome}>
          <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
            <img src={siteLogo} alt="Logo" style={{ height: "32px", borderRadius: "6px" }} />
            <span className="font-heading" style={{ fontWeight: 800, fontSize: "18px", color: "var(--text-main)", letterSpacing: "-0.5px" }}>P4 PRICE DEKHO</span>
          </div>
          <div style={{ width: "1px", height: "24px", background: "rgba(0,0,0,0.15)" }}></div>
          <span style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.2, fontWeight: 500 }}>Smart Price Companion,<br/>Best Deals.</span>
        </div>

        <div style={{ display: "none", '@media(min-width: 900px)': { display: "flex" }, gap: "28px" }}>
          {["Mobiles", "Laptops", "Fashion", "Appliances", "Categories", "Deals"].map(link => (
            <span key={link} className="nav-link" onClick={() => search(link)}>{link}</span>
          ))}
        </div>

        <div style={{ display:"flex", gap:"20px", alignItems:"center", color: "var(--text-main)" }}>
          <div style={{ cursor: "pointer", position:"relative" }} onClick={() => setShowWishlist(true)} title="Wishlist">
            <HeartIcon filled={wishlist.length>0}/><BadgeCount count={wishlist.length} />
          </div>
          <div style={{ cursor: "pointer", position:"relative" }} onClick={() => setShowCart(true)} title="Cart">
            <CartIcon/><BadgeCount count={cart.reduce((s,c)=>s+c.qty,0)} />
          </div>
          
          <div style={{ position: "relative" }}>
            <div style={{ cursor: "pointer" }} onClick={() => setShowProfileMenu(!showProfileMenu)}>
              {user ? (
                <img src={`https://ui-avatars.com/api/?name=${user.name}&background=C8D7C8&color=1F2937&bold=true`} alt="Profile" style={{ width: "32px", height: "32px", borderRadius: "50%", border: "2px solid #FFFFFF" }} />
              ) : (
                <UserIcon/>
              )}
            </div>

            {showProfileMenu && (
              <div style={{ position: "absolute", top: "44px", right: "0", background: "#FFFFFF", width: "260px", borderRadius: "16px", boxShadow: "0 10px 40px rgba(0,0,0,0.1)", border: "1px solid var(--border-light)", overflow: "hidden", zIndex: 1000, animation: "fadeUp 0.2s ease" }}>
                {!user ? (
                  <div style={{ padding: "20px", textAlign: "center" }}>
                    <h4 style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-main)", marginBottom: "6px" }}>Welcome to P4 Price Dekho!</h4>
                    <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "16px", lineHeight: 1.4 }}>Sign in to save your wishlists and track price drops across all your devices.</p>
                    <button className="btn btn-solid" onClick={() => { setShowAuthModal(true); setShowProfileMenu(false); }} style={{ width: "100%", padding: "10px", fontSize: "13px" }}>Sign In / Sign Up</button>
                  </div>
                ) : (
                  <div>
                    <div style={{ padding: "20px", borderBottom: "1px solid var(--border-light)", display: "flex", alignItems: "center", gap: "12px", background: "#F9FAFB" }}>
                      <img src={`https://ui-avatars.com/api/?name=${user.name}&background=C8D7C8&color=1F2937&bold=true`} alt="Avatar" style={{ width: "40px", height: "40px", borderRadius: "50%" }} />
                      <div style={{ flex: 1, overflow: "hidden" }}>
                        <h4 style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-main)", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>{user.name}</h4>
                        <p style={{ fontSize: "12px", color: "var(--text-muted)", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>{user.email}</p>
                      </div>
                    </div>
                    <div style={{ padding: "8px 0" }}>
                      <div className="sidebar-link" onClick={() => { setShowWishlist(true); setShowProfileMenu(false); }} style={{ padding: "12px 20px", borderRadius: 0 }}>♥ My Wishlist</div>
                      <div className="sidebar-link" onClick={() => { setShowCart(true); setShowProfileMenu(false); }} style={{ padding: "12px 20px", borderRadius: 0 }}>🛒 My Cart</div>
                    </div>
                    <div style={{ padding: "8px 0", borderTop: "1px solid var(--border-light)" }}>
                      <div className="sidebar-link" onClick={handleLogout} style={{ padding: "12px 20px", borderRadius: 0, color: "#E11D48" }}>🚪 Log Out</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <div style={{ background: "var(--bg-top)", paddingTop: "140px", paddingBottom: "80px", textAlign: "center", position:"relative" }}>
        <h1 className="font-heading" style={{ fontWeight:800, fontSize:"clamp(32px, 4vw, 46px)", color:"var(--text-main)", lineHeight:1.2, marginBottom:"30px" }}>
          Compare Prices Across India.<br/>Find the Best Offers, Every Day.
        </h1>
        <div style={{ display:"flex", justifyContent:"center", padding: "0 20px" }}>
          <div style={{
            display:"flex", alignItems:"center", background: "#FFFFFF",
            borderRadius:"var(--radius-full)", padding:"6px 8px 6px 24px",
            width:"100%", maxWidth:"700px", boxShadow:"0 8px 30px rgba(0,0,0,0.06)", position: "relative"
          }}>
            <input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={handleKeyDown} placeholder="Search for products (e.g., iPhone 15, Dell XPS, Sony TV)..." style={{ flex:1, background:"transparent", border:"none", color:"var(--text-main)", fontSize:"16px", outline:"none", fontFamily:"'Inter',sans-serif" }} />
            {query.length > 0 && <button onClick={() => setQuery("")} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "0 10px" }}><CloseIcon/></button>}
            <button className="btn btn-solid" onClick={() => search()} style={{ padding:"12px", width:"44px", height:"44px", display:"flex", alignItems:"center", justifyContent:"center" }}><SearchIcon/></button>
            {suggestions.length > 0 && (
              <div style={{ position:"absolute", top:"calc(100% + 10px)", left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:"700px", background: "#FFFFFF", borderRadius:"16px", overflow:"hidden", zIndex:10, boxShadow:"0 12px 40px rgba(0,0,0,0.1)", border:"1px solid var(--border-light)", textAlign:"left" }}>
                {suggestions.map((s,i) => (
                  <div key={i} onClick={() => { setQuery(s); search(s); setSuggestions([]); }} style={{ padding:"14px 20px", cursor:"pointer", color:"var(--text-main)", fontSize:"15px", display:"flex", alignItems:"center", gap:"12px", borderBottom: i !== suggestions.length-1 ? `1px solid var(--border-light)` : "none" }}>
                    <span style={{ color:"var(--text-muted)" }}><SearchIcon/></span> {s}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ flex: 1, padding: "0 40px 80px", maxWidth: "1600px", margin: "0 auto", width: "100%" }}>
        <div style={{ marginTop: "-40px", position:"relative", zIndex:2 }}>
          <h2 className="font-heading" style={{ fontSize:"20px", marginBottom:"20px", color:"var(--text-main)" }}>Featured Deals</h2>
          
          {loading ? (
            <div style={{ textAlign:"center", padding:"60px 0" }}><div className="loading-spinner" /><p style={{ color:"var(--text-muted)", marginTop:"16px" }}>Searching best prices...</p></div>
          ) : (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(380px, 1fr))", gap:"24px" }}>
              {sortedData.slice(0, visibleCount).map((item, i) => {
                const prices = item.prices.map(p => p.price);
                const lowest = Math.min(...prices);
                const isHot = Math.floor(((Math.max(...prices) - lowest) / Math.max(...prices)) * 100) >= 15;
                const bestDealLink = item.prices.find(p => p.price === lowest)?.link;

                return (
                  <div key={i} className="product-card" style={{ animation:`fadeUp 0.4s ease ${i * 0.05}s both` }}>
                    <div style={{ display:"flex", gap:"20px", marginBottom:"20px" }}>
                      <div style={{ width:"120px", height:"120px", background:"#F3F4F6", borderRadius:"12px", padding:"10px", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        <img src={item.image} alt={item.name} style={{ width:"100%", height:"100%", objectFit:"contain", mixBlendMode: "multiply" }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:"10px" }}>
                          <h3 className="font-heading" style={{ fontSize:"15px", fontWeight:700, color:"var(--text-main)", lineHeight:1.3, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden", marginBottom:"6px" }}>{item.name}</h3>
                          {isHot && <span className="badge-deal">Best Deal</span>}
                        </div>
                        <p style={{ fontSize:"12px", color:"var(--text-muted)", marginBottom:"12px" }}>Starting at <strong style={{ color:"var(--text-main)" }}>₹{lowest.toLocaleString()}</strong></p>
                        
                        <div style={{ display:"flex", flexDirection:"column", gap:"6px" }}>
                          {item.prices.map((p, idx) => (
                            <div key={idx} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", fontSize:"13px" }}>
                              <span style={{ color:"var(--text-muted)", display:"flex", alignItems:"center", gap:"6px" }}><img src={logos[p.site]} width="14" style={{borderRadius:"2px"}}/> {p.site}:</span>
                              <span style={{ fontWeight: p.price === lowest ? 700 : 500, color: p.price === lowest ? "#16A34A" : "var(--text-main)" }}>₹{p.price.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {alertForms[item.name] && (
                      <div style={{ marginBottom: "16px", padding: "12px", background: "#F9FAFB", borderRadius: "10px", border: `1px solid #E5E7EB` }}>
                        {alertStatus[item.name] ? ( <p style={{ color: "#16A34A", fontSize: "13px", fontWeight: 600, textAlign: "center", margin: 0 }}>{alertStatus[item.name]}</p> ) : (
                          <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
                            <input placeholder="Email" type="email" value={alertForms[item.name].email} onChange={(e) => setAlertForms(prev => ({...prev, [item.name]: {...prev[item.name], email: e.target.value}}))} style={{ width: "100%", border: "1px solid #D1D5DB", borderRadius: "6px", padding: "8px", fontSize: "12px", fontFamily: "inherit" }} />
                            <div style={{ display: "flex", gap: "8px" }}>
                              <input placeholder="Target Price (₹)" type="number" value={alertForms[item.name].price} onChange={(e) => setAlertForms(prev => ({...prev, [item.name]: {...prev[item.name], price: e.target.value}}))} style={{ flex: 1, border: "1px solid #D1D5DB", borderRadius: "6px", padding: "8px", fontSize: "12px", fontFamily: "inherit" }} />
                              <button className="btn btn-solid" onClick={() => submitAlert(item, lowest)} style={{ padding: "8px 16px", fontSize: "12px" }}>Set</button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <div style={{ display:"flex", gap:"10px", alignItems:"center" }}>
                      <div style={{ display:"flex", gap:"4px" }}>
                         <button onClick={() => toggleWishlist(item)} style={{ background:"transparent", border:"none", cursor:"pointer", color: isWishlisted(item.name) ? "#E11D48" : "var(--text-muted)", padding:"6px" }} title="Wishlist"><HeartIcon filled={isWishlisted(item.name)}/></button>
                         <button onClick={() => setAlertForms(prev => ({...prev, [item.name]: { email: '', price: lowest }}))} style={{ background:"transparent", border:"none", cursor:"pointer", color: "var(--text-muted)", padding:"6px" }} title="Alert"><BellIcon/></button>
                         <button onClick={() => handleShare(item, lowest)} style={{ background:"transparent", border:"none", cursor:"pointer", color: "var(--text-muted)", padding:"6px" }} title="Share"><ShareIcon/></button>
                      </div>
                      <button className="btn btn-outline" onClick={() => toggleCompare(item)} style={{ flex:1, padding:"10px", fontSize:"13px", background: compareList.some(c=>c.name===item.name) ? "rgba(37,99,235,0.05)" : "transparent" }}>
                         {compareList.some(c=>c.name===item.name) ? "Added" : "Compare Specs"}
                      </button>
                      <button className="btn btn-solid" onClick={() => window.open(bestDealLink)} style={{ flex:1, padding:"10px", fontSize:"13px" }}>View on Store</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {visibleCount < sortedData.length && !loading && (
            <div style={{ textAlign:"center", marginTop:"40px" }}>
              <button className="btn btn-outline" onClick={() => setVisibleCount(visibleCount + 12)} style={{ padding:"12px 32px", fontSize:"14px" }}>
                Load More Deals ({sortedData.length - visibleCount})
              </button>
            </div>
          )}
        </div>

        {/* ── CATEGORIES ── */}
        <div style={{ marginTop: "60px" }}>
          <h2 className="font-heading" style={{ fontSize:"16px", textTransform:"uppercase", letterSpacing:"1px", color:"var(--text-main)", marginBottom:"24px" }}>Explore Categories</h2>
          <div style={{ display:"flex", gap:"16px", overflowX:"auto", paddingBottom:"10px", scrollbarWidth:"none" }}>
            {exploreCategories.map(cat => (
              <div key={cat.name} onClick={() => search(cat.name)} style={{ 
                minWidth:"120px", background: "var(--bg-top)", borderRadius:"16px", padding:"20px 16px",
                display:"flex", flexDirection:"column", alignItems:"center", gap:"12px", cursor:"pointer",
                color:"var(--text-main)", transition:"transform 0.2s"
              }} className="card-hover">
                <div style={{ color:"#1F2937" }}>{cat.icon}</div>
                <span style={{ fontSize:"13px", fontWeight:600 }}>{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── PANELS ── */}
      {showCart && (
        <SidePanel 
          title="Your Cart" 
          items={cart} 
          onClose={() => setShowCart(false)} 
          renderItem={(item, i) => {
            const lowest = Math.min(...item.prices.map(p=>p.price));
            return (
              <div key={i} style={{ display:"flex", gap:"12px", padding:"12px", border:"1px solid var(--border-light)", borderRadius:"12px", marginBottom:"12px" }}>
                <img src={item.image} style={{ width:"60px", height:"60px", objectFit:"contain", background:"#F3F4F6", borderRadius:"8px", padding:"4px" }} alt="" />
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:"12px", fontWeight:500, marginBottom:"4px", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{item.name}</p>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ fontWeight:700, color:"var(--primary-blue)", fontSize:"14px" }}>₹{lowest.toLocaleString()}</span>
                    <div style={{ display:"flex", alignItems:"center", background:"#F3F4F6", borderRadius:"6px" }}>
                       <button onClick={()=>setCart(prev=>prev.map(c=>c.name===item.name&&c.qty>1?{...c,qty:c.qty-1}:c))} style={{ border:"none", background:"none", padding:"4px 8px", cursor:"pointer", fontWeight:"bold" }}>-</button>
                       <span style={{ fontSize:"12px", fontWeight:600, padding:"0 4px" }}>{item.qty}</span>
                       <button onClick={()=>setCart(prev=>prev.map(c=>c.name===item.name?{...c,qty:c.qty+1}:c))} style={{ border:"none", background:"none", padding:"4px 8px", cursor:"pointer", fontWeight:"bold" }}>+</button>
                    </div>
                  </div>
                </div>
              </div>
            );
          }} 
          footer={
            cart.length > 0 && (
              <div style={{ background:"#F9FAFB", borderRadius:"14px", padding:"16px", border:"1px solid #E5E7EB" }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"12px" }}>
                  <span style={{ color:"var(--text-muted)" }}>Total Amount</span>
                  <span style={{ fontWeight:800, fontSize:"18px", color:"var(--primary-blue)" }}>₹{cartTotal.toLocaleString()}</span>
                </div>
                <button className="btn btn-solid" style={{ width:"100%", padding:"14px", fontSize:"14px" }}>Proceed to Checkout</button>
              </div>
            )
          }
        />
      )}

      {showWishlist && (
        <SidePanel title="Your Wishlist" items={wishlist} onClose={() => setShowWishlist(false)} renderItem={(item, i) => {
          const lowest = Math.min(...item.prices.map(p=>p.price));
          return (
            <div key={i} style={{ display:"flex", gap:"12px", padding:"12px", border:"1px solid var(--border-light)", borderRadius:"12px", marginBottom:"12px" }}>
              <img src={item.image} style={{ width:"60px", height:"60px", objectFit:"contain", background:"#F3F4F6", borderRadius:"8px", padding:"4px" }} alt="" />
              <div style={{ flex:1 }}>
                <p style={{ fontSize:"12px", fontWeight:500, marginBottom:"4px", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{item.name}</p>
                <p style={{ fontWeight:700, color:"#16A34A", fontSize:"13px", marginBottom:"8px" }}>₹{lowest.toLocaleString()}</p>
                <div style={{ display:"flex", gap:"6px" }}>
                  <button className="btn btn-solid" onClick={()=>addToCart(item)} style={{ flex:1, padding:"6px", fontSize:"11px" }}>Add to Cart</button>
                  <button className="btn btn-outline" onClick={()=>toggleWishlist(item)} style={{ padding:"6px 10px", fontSize:"11px", color:"#E11D48", borderColor:"#FECDD3" }}>Remove</button>
                </div>
              </div>
            </div>
          );
        }} />
      )}

      {/* ── FLOATING COMPARE BAR ── */}
      {compareList.length > 0 && (
        <div style={{ position: "fixed", bottom: "30px", right: "30px", background: "#FFFFFF", padding: "10px 16px", borderRadius: "var(--radius-full)", display: "flex", alignItems: "center", gap: "12px", boxShadow: "0 10px 40px rgba(0,0,0,0.15)", border: `1px solid var(--border-light)`, zIndex: 1050, animation: "fadeUp 0.3s ease", cursor:"pointer" }} onClick={() => setShowCompareModal(true)}>
          <div style={{ color: "var(--primary-blue)" }}><GridIcon/></div>
          <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-main)" }}>Compared Items ({compareList.length})</span>
        </div>
      )}

      <footer style={{ marginTop: "auto", padding: "40px 24px", textAlign: "center", borderTop: `1px solid var(--border-light)`, background: "#FFFFFF" }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
          <img src={siteLogo} alt="Logo" style={{ height: "24px", objectFit: "contain", borderRadius: "4px" }} />
          <span className="font-heading" style={{ fontWeight: 800, fontSize: "15px", color: "var(--text-main)" }}>P4 PRICE DEKHO</span>
        </div>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "8px" }}>Smart Price Companion, Best Deals.</p>
        <p style={{ fontSize: "12px", fontWeight: 600, color:"var(--text-main)" }}>© 2026 P4 Price Dekho. Developed with ❤️ by @CodeWithPrashoon.</p>
      </footer>
    </div>
  );
}

export default App;