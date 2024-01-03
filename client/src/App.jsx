import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/home";
import Navbar from "./components/navbar";
import { useDispatch, useSelector } from "react-redux";
import AnimationBG from "./components/animation";
import Register from "./pages/register";
import { Toaster } from "react-hot-toast";
import Load from "./components/load";
import Auth from "./pages/auth";
import Recovery from "./pages/recovery";
import { useEffect } from "react";
import axios from "axios";
import { API } from "./config";
import { setInfoAuth } from "./managers/auth.manager";
import Seller from "./seller/seller";
import Admin from "./admin/admin";
import Supplier from "./supplier/supplier";
import Stream from "./pages/stream";
import NavigatorPages from "./pages/navigator";
import Operator from "./operator/operator";
import Courier from "./courier/courier";
// import MainMenu from "./pages/main";
function App() {
  // const nv = useNavigate();
  const p = useLocation().pathname
  const {
    config: { animation: a, load },
    auth: { _id, refresh, seller, admin, supplier, courier, operator },
  } = useSelector((e) => e);

  const dp = useDispatch();
  useEffect(() => {
    axios(`${API}/user/verify-session`, {
      headers: { "x-auth-token": `Bearer ${localStorage.getItem("access")}` },
    }).then((res) => {
      const { ok, data } = res.data;
      if (ok) {
        dp(setInfoAuth(data));
      }
    });
  }, [refresh]);
  // 
  return (
    <>
      {load && <Load />}
      {(!_id && p !== '/') && <Navbar />}
      {a && <AnimationBG />}
      <Routes>
        <Route path="/o/:id" element={<Stream />} />
        {/* <Route path="/" element={<MainMenu />} /> */}
        <Route path="*" element={<Home />} />
        <Route path="/register" element={!_id ? <Register /> : <NavigatorPages />} />
        <Route path="/auth" element={!_id ? <Auth /> : <NavigatorPages />} />
        <Route path="/recovery" element={!_id ? <Recovery /> : <NavigatorPages />} />
        <Route path="/seller/:path" element={_id && seller ? <Seller /> : <Home />} />
        <Route path="/admin/:path" element={_id && admin ? <Admin /> : <Home />} />
        <Route path="/supplier/:path" element={_id && supplier ? <Supplier /> : <Home />} />
        <Route path="/operator/:path" element={_id && operator ? <Operator /> : <Home />} />
        <Route path="/courier/:path" element={_id && courier ? <Courier /> : <Home />} />
      </Routes>
      <Toaster position="top-left" containerStyle={{ zIndex: 99999 }} />
    </>
  );
}

export default App;
