import { IconButton } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { BiAlignLeft, BiXCircle } from "react-icons/bi";
import {
  FaBagShopping,
  FaBoxesPacking,
  FaCartShopping,
  FaChartBar,
  FaCreditCard,
  FaDisplay,
  FaGear,
  FaLeftLong,
  FaLink,
} from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { setInfoAuth } from "../managers/auth.manager";

function SellerNavbar() {
  const [open, setOpen] = useState(false);
  const p = useLocation().pathname;
  useEffect(() => {
    setOpen(false);
  }, [p]);
  const dp = useDispatch();
  function LogOut() {
    dp(setInfoAuth({
      _id: '',
      id: '',
      name: '',
      phone: '',
      supplier: false,
      admin: false,
      seller: false,
      operator: false,
      courier: false,
      refresh: false,
      active: false,
      telegram: ''
    }));
    setTimeout(() => {
      localStorage.removeItem('access')
    }, 500);
  }
  const classLink =
    "flex items-center justify-start w-full h-[40px] rounded-full cursor-pointer hover:text-indigo-200 font-light duration-300 px-[10px] text-[18px] gap-2 hover:pl-[15px] animate-fade-right ";
  return (
    <div>
      {/* NAV */}
      <nav
        className={`fixed top-0 duration-300 ${open ? "left-0" : "left-[-300px]"
          } bg-[#160082a3] backdrop-blur-sm h-[100vh] w-[300px] flex items-center justify-start flex-col gap-[5px] px-2 xl:relative xl:top-auto xl:left-auto p-[5px] z-[9999]`}
      >
        {/* TOP */}
        <div className="flex items-center justify-center w-full bg-white h-[50px] rounded relative animate-fade-down">
          <p className="text-[30px] text-indigo-500">SELLY</p>
          <div
            className={`absolute ${open ? "right-1" : "-right-14"
              } xl:hidden duration-300`}
          >
            <IconButton
              onClick={() => setOpen(!open)}
              className="rounded-full text-[20px]"
              color="indigo"
            >
              {open ? <BiXCircle /> : <BiAlignLeft />}
            </IconButton>
          </div>
        </div>
        {/* BODY */}
        <Link
          to={"/seller/dashboard"}
          className={
            classLink +
            'animate-delay-75 ' + (p === "/seller/dashboard"
              ? "text-indigo-800 bg-white "
              : "bg-none text-white")
          }
        >
          <FaDisplay />
          Dashboard
        </Link>
        <Link
          to={"/seller/market"}
          className={
            classLink +
            'animate-delay-[125ms] ' + (p === "/seller/market"
              ? "text-indigo-800 bg-white "
              : "bg-none text-white")
          }
        >
          <FaCartShopping />
          Market
        </Link>
        {/*  */}
        <Link
          to={"/seller/streams"}
          className={
            classLink +
            'animate-delay-[175ms] ' + (p === "/seller/streams"
              ? "text-indigo-800 bg-white "
              : "bg-none text-white")
          }
        >
          <FaLink />
          Oqimlar
        </Link>
        {/*  */}
        <Link
          to={"/seller/stats"}
          className={
            classLink +
            'animate-delay-[225ms] ' + (p === "/seller/stats"
              ? "text-indigo-800 bg-white "
              : "bg-none text-white")
          }
        >
          <FaChartBar />
          Statistika
        </Link>
        {/*  */}
        <Link
          to={"/seller/orders"}
          className={
            classLink +
            'animate-delay-[275ms] ' + (p === "/seller/orders"
              ? "text-indigo-800 bg-white "
              : "bg-none text-white")
          }
        >
          <FaBagShopping />
          Buyurtmalar
        </Link>
        {/*  */}
        <Link
          to={"/seller/balance"}
          className={
            classLink +
            'animate-delay-[325ms] ' + (p === "/seller/balance"
              ? "text-indigo-800 bg-white "
              : "bg-none text-white")
          }
        >
          <FaCreditCard />
          Moliya
        </Link>
        {/*  */}
        <Link
          to={"/seller/supplier"}
          className={
            classLink +
            'animate-delay-[375ms] ' + (p === "/seller/supplier"
              ? "text-indigo-800 bg-white "
              : "bg-none text-white")
          }
        >
          <FaBoxesPacking />
          Ta'minotchi
        </Link>
        {/*  */}
        <Link
          to={"/seller/settings"}
          className={
            classLink +
            'animate-delay-[425ms] ' + (p === "/seller/settings"
              ? "text-indigo-800 bg-white "
              : "bg-none text-white")
          }
        >
          <FaGear />
          Sozlamalar
        </Link>
        {/* <Link
          to={"/seller/api"}
          className={
            classLink +
            'animate-delay-[475ms] ' + (p === "/seller/api"
              ? "text-indigo-800 bg-white "
              : "bg-none text-white")
          }
        >
          <FaCode />
          API
        </Link> */}
        <div onClick={LogOut} className={
          classLink +
          'animate-delay-[475ms] text-red-500'
        }>
          <FaLeftLong />
          Chiqish
        </div>
      </nav>
      {/* CLOSER */}
      <div
        onClick={() => setOpen(false)}
        className={`${open ? "w-full" : "w-0"
          } duration-300 h-screen fixed top-0 right-0 z-[9998] bg-[#4c008269] backdrop-blur-sm`}
      ></div>
    </div>
  );
}

export default SellerNavbar;
