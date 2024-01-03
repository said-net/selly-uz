import { IconButton } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { BiAlignLeft, BiRefresh, BiXCircle } from "react-icons/bi";
import {
  FaBagShopping,
  FaBasketShopping,
  FaBoxArchive,
  FaBoxOpen,
  FaBoxesPacking,
  FaBoxesStacked,
  FaCircleCheck,
  FaCircleXmark,
  FaClockRotateLeft,
  FaCreditCard,
  FaDisplay,
  FaGear,
  FaLeftLong,
  FaListUl,
  FaPhone,
  FaPhoneFlip,
  FaPrint,
  FaRecycle,
  FaStar,
  FaTruck,
  FaTruckFast,
  FaUsers,
} from "react-icons/fa6";
import { FaSearch } from 'react-icons/fa'
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { API } from "../config";
import { setRefresh } from "../managers/config.manager";
import { setInfoAuth } from "../managers/auth.manager";

function AdminNavbar() {
  const [open, setOpen] = useState(false);
  const p = useLocation().pathname;
  useEffect(() => {
    setOpen(false);
  }, [p]);
  // 
  const [s, setS] = useState({ categories: 0, products: 0, operators: 0, couriers: 0, sellers: 0, suppliers: 0, new_orders: 0, in_operators: 0, recontacts: 0, success: 0, sendeds: 0, delivereds: 0, rejecteds: 0, archiveds: 0, orders: 0, parties: 0, payments: 0 });
  // 
  const { refresh } = useSelector(e => e?.config);
  useEffect(() => {
    axios(`${API}/admin/get-navbar`, {
      headers: {
        'x-auth-token': `Bearer ${localStorage.getItem('access')}`
      }
    }).then(res => {
      const { ok, data } = res.data;
      if (ok) {
        setS(data);
      }
    })
  }, [refresh]);
  // 
  const dp = useDispatch();
  const classLink =
    "flex items-center justify-start w-full h-[40px] mb-[10px] rounded-full cursor-pointer hover:text-indigo-200 font-light border border-[#fff4] duration-300 px-[10px] py-[5px] gap-2 hover:pl-[15px] animate-fade-right relative ";
  // 
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
  return (
    <div>
      {/* NAV */}
      <nav
        className={`fixed top-0 duration-300 ${open ? "left-0" : "left-[-300px]"
          } bg-[#160082a3] backdrop-blur-sm h-[100vh] w-[300px] flex items-center justify-start flex-col gap-[5px] px-2 xl:relative xl:top-auto xl:left-auto p-[5px] z-[9999] scrollbar-hide`}
      >
        {/* TOP */}
        <div className="flex items-center justify-start gap-[10px] px-[10px] w-full bg-white h-[50px] rounded relative animate-fade-down">
          <IconButton
            onClick={() => dp(setRefresh())}
            className="rounded-full text-[20px]"
            color="indigo"
          >
            <BiRefresh />
          </IconButton>
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
        <div className="flex items-center justify-start flex-col w-full h-[100vh] overflow-y-scroll scrollbar-hide">
          <Link
            to={"/admin/dashboard"}
            className={
              classLink +
              'animate-delay-0 ' + (p === "/admin/dashboard"
                ? "text-indigo-800 bg-white "
                : "bg-none text-white")
            }
          >
            <FaDisplay />
            Dashboard
          </Link>
          {/*  */}
          <Link
            to={"/admin/payments"}
            className={
              classLink +
              'animate-delay-25 ' + (p === "/admin/payments"
                ? "text-indigo-800 bg-white "
                : "bg-none text-white")
            }
          >
            <FaCreditCard />
            To'lovlar
            <span className="absolute right-[10px] bg-white p-[0_5px] text-[12px] rounded text-[#000]">
              {s?.payments}
            </span>
          </Link>
          {/*  */}
          <Link
            to={"/admin/suppliers"}
            className={
              classLink +
              'animate-delay-75 ' + (p === "/admin/suppliers"
                ? "text-indigo-800 bg-white "
                : "bg-none text-white")
            }
          >
            <FaBoxesPacking />
            Ta'minotchilar
            <span className="absolute right-[10px] bg-white p-[0_5px] text-[12px] rounded text-[#000]">
              {s?.suppliers}
            </span>
          </Link>
          {/*  */}
          <Link
            to={"/admin/categories"}
            className={
              classLink +
              'animate-delay-[125ms] ' + (p === "/admin/categories"
                ? "text-indigo-800 bg-white "
                : "bg-none text-white")
            }
          >
            <FaListUl />
            Kategoriyalar
            <span className="absolute right-[10px] bg-white p-[0_5px] text-[12px] rounded text-[#000]">
              {s?.categories}
            </span>
          </Link>
          {/*  */}
          <Link
            to={"/admin/products"}
            className={
              classLink +
              'animate-delay-[175ms] ' + (p === "/admin/products"
                ? "text-indigo-800 bg-white "
                : "bg-none text-white")
            }
          >
            <FaBoxesStacked />
            Mahsulotlar
            <span className="absolute right-[10px] bg-white p-[0_5px] text-[12px] rounded text-[#000]">
              {s?.products}
            </span>
          </Link>
          {/*  */}
          <Link
            to={"/admin/operators"}
            className={
              classLink +
              'animate-delay-[225ms] ' + (p === "/admin/operators"
                ? "text-indigo-800 bg-white "
                : "bg-none text-white")
            }
          >
            <FaPhone />
            Operatorlar
            <span className="absolute right-[10px] bg-white p-[0_5px] text-[12px] rounded text-[#000]">
              {s?.operators}
            </span>
          </Link>
          {/*  */}
          <Link
            to={"/admin/couriers"}
            className={
              classLink +
              'animate-delay-[275ms] ' + (p === "/admin/couriers"
                ? "text-indigo-800 bg-white "
                : "bg-none text-white")
            }
          >
            <FaTruck />
            Kuryerlar
            <span className="absolute right-[10px] bg-white p-[0_5px] text-[12px] rounded text-[#000]">
              {s?.couriers}
            </span>
          </Link>
          {/*  */}
          <Link
            to={"/admin/sellers"}
            className={
              classLink +
              'animate-delay-[325ms] ' + (p === "/admin/sellers"
                ? "text-indigo-800 bg-white "
                : "bg-none text-white")
            }
          >
            <FaUsers />
            Sotuvchilar
            <span className="absolute right-[10px] bg-white p-[0_5px] text-[12px] rounded text-[#000]">
              {s?.sellers}
            </span>
          </Link>
          {/*  */}
          <Link
            to={"/admin/new-orders"}
            className={
              classLink +
              'animate-delay-[375ms] ' + (p === "/admin/new-orders"
                ? "text-indigo-800 bg-white "
                : "bg-none text-white")
            }
          >
            <FaBagShopping />
            Yangi buyurtmalar
            <span className="absolute right-[10px] bg-white p-[0_5px] text-[12px] rounded text-[#000]">
              {s?.new_orders?.toLocaleString()}
            </span>
          </Link>
          {/*  */}
          <Link
            to={"/admin/in-operator"}
            className={
              classLink +
              'animate-delay-[425ms] ' + (p === "/admin/in-operator"
                ? "text-indigo-800 bg-white "
                : "bg-none text-white")
            }
          >
            <FaPhoneFlip />
            Operatorlarda
            <span className="absolute right-[10px] bg-white p-[0_5px] text-[12px] rounded text-[#000]">
              {s?.in_operators?.toLocaleString()}
            </span>
          </Link>
          {/*  */}
          <Link
            to={"/admin/recontacts"}
            className={
              classLink +
              'animate-delay-[475ms] ' + (p === "/admin/recontacts"
                ? "text-indigo-800 bg-white "
                : "bg-none text-white")
            }
          >
            <FaRecycle />
            Qayta aloqa
            <span className="absolute right-[10px] bg-white p-[0_5px] text-[12px] rounded text-[#000]">
              {s?.recontacts?.toLocaleString()}
            </span>
          </Link>
          {/*  */}
          <Link
            to={"/admin/success"}
            className={
              classLink +
              'animate-delay-[525ms] ' + (p === "/admin/success"
                ? "text-indigo-800 bg-white "
                : "bg-none text-white")
            }
          >
            <FaBasketShopping />
            Qadoqlashda
            <span className="absolute right-[10px] bg-white p-[0_5px] text-[12px] rounded text-[#000]">
              {s?.success?.toLocaleString()}
            </span>
          </Link>
          {/*  */}
          <Link
            to={"/admin/cheques"}
            className={
              classLink +
              'animate-delay-[575ms] ' + (p === "/admin/cheques"
                ? "text-indigo-800 bg-white "
                : "bg-none text-white")
            }
          >
            <FaPrint />
            Cheklar
            <span className="absolute right-[10px] bg-white p-[0_5px] text-[12px] rounded text-[#000]">
              {s?.success?.toLocaleString()}
            </span>
          </Link>
          {/*  */}
          <Link
            to={"/admin/sended"}
            className={
              classLink +
              'animate-delay-[625ms] ' + (p === "/admin/sended"
                ? "text-indigo-800 bg-white "
                : "bg-none text-white")
            }
          >
            <FaTruckFast />
            Yuborilganlar
            <span className="absolute right-[10px] bg-white p-[0_5px] text-[12px] rounded text-[#000]">
              {s?.sendeds?.toLocaleString()}
            </span>
          </Link>
          {/*  */}
          {/*  */}
          <Link
            to={"/admin/parties"}
            className={
              classLink +
              'animate-delay-[675ms] ' + (p === "/admin/parties"
                ? "text-indigo-800 bg-white "
                : "bg-none text-white")
            }
          >
            <FaBoxOpen />
            Partiyalar
            <span className="absolute right-[10px] bg-white p-[0_5px] text-[12px] rounded text-[#000]">
              {s?.parties?.toLocaleString()}
            </span>
          </Link>
          {/*  */}
          <Link
            to={"/admin/delivered"}
            className={
              classLink +
              'animate-delay-[725ms] ' + (p === "/admin/delivered"
                ? "text-indigo-800 bg-white "
                : "bg-none text-white")
            }
          >
            <FaCircleCheck />
            Yetkazilganlar
            <span className="absolute right-[10px] bg-white p-[0_5px] text-[12px] rounded text-[#000]">
              {s?.delivereds?.toLocaleString()}
            </span>
          </Link>
          {/*  */}
          <Link
            to={"/admin/reject"}
            className={
              classLink +
              'animate-delay-[775ms] ' + (p === "/admin/reject"
                ? "text-indigo-800 bg-white "
                : "bg-none text-white")
            }
          >
            <FaCircleXmark />
            Dostavkadan qaytganlar
            <span className="absolute right-[10px] bg-white p-[0_5px] text-[12px] rounded text-[#000]">
              {s?.rejecteds?.toLocaleString()}
            </span>
          </Link>
          {/*  */}
          <Link
            to={"/admin/archive"}
            className={
              classLink +
              'animate-delay-[825ms] ' + (p === "/admin/archive"
                ? "text-indigo-800 bg-white "
                : "bg-none text-white")
            }
          >
            <FaBoxArchive />
            Arxivlanganlar
            <span className="absolute right-[10px] bg-white p-[0_5px] text-[12px] rounded text-[#000]">
              {s?.archiveds?.toLocaleString()}
            </span>
          </Link>
          {/*  */}
          <Link
            to={"/admin/history"}
            className={
              classLink +
              'animate-delay-[875ms] ' + (p === "/admin/history"
                ? "text-indigo-800 bg-white "
                : "bg-none text-white")
            }
          >
            <FaClockRotateLeft />
            <span className="absolute right-[10px] bg-white p-[0_5px] text-[12px] rounded text-[#000]">
              {s?.orders?.toLocaleString()}
            </span>
            Sotuvar tarixi
          </Link>
          {/*  */}
          <Link
            to={"/admin/search"}
            className={
              classLink +
              'animate-delay-[925ms] ' + (p === "/admin/search"
                ? "text-indigo-800 bg-white "
                : "bg-none text-white")
            }
          >
            <FaSearch />
            Qidiruv( Tarix )
          </Link>
          {/*  */}
          {/* <Link
            to={"/admin/seller-rating"}
            className={
              classLink +
              'animate-delay-[975ms] ' + (p === "/admin/seller-rating"
                ? "text-indigo-800 bg-white "
                : "bg-none text-white")
            }
          >
            <FaStar />
            Sotuvchilar reytingi
          </Link> */}
          {/*  */}
          {/* <Link
            to={"/admin/operator-rating"}
            className={
              classLink +
              'animate-delay-[1025ms] ' + (p === "/admin/operator-rating"
                ? "text-indigo-800 bg-white "
                : "bg-none text-white")
            }
          >
            <FaStar />
            Operatorlar reytingi
          </Link> */}
          {/*  */}
          <Link
            to={"/admin/settings"}
            className={
              classLink +
              'animate-delay-[1075ms] ' + (p === "/admin/settings"
                ? "text-indigo-800 bg-white "
                : "bg-none text-white")
            }
          >
            <FaGear />
            Sozlamalar
          </Link>
          <div onClick={LogOut} className={
            classLink +
            'animate-delay-[1125ms] text-red-500'
          }>
            <FaLeftLong />
            Chiqish
          </div>
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

export default AdminNavbar;
