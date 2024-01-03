import { IconButton } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { BiAlignLeft, BiXCircle } from "react-icons/bi";
import {
  FaBagShopping,
  FaBasketShopping,
  FaBoxArchive,
  FaBoxesStacked,
  FaCircleCheck,
  FaCircleXmark,
  FaDisplay,
  FaGear,
  FaLeftLong,
  FaRecycle,
  FaTruckFast,
} from "react-icons/fa6";
import { FaCreditCard } from 'react-icons/fa'
import { Link, useLocation } from "react-router-dom";
import { API, ERROR_MSG } from "../config";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
function SupplierNavbar() {
  const [open, setOpen] = useState(false);
  const p = useLocation().pathname;
  const { refresh } = useSelector(e => e?.config)
  useEffect(() => {
    setOpen(false);
  }, [p]);
  // 
  const [s, setS] = useState({ products: 0, new_orders: 0, recontacts: 0, success: 0, sendeds: 0, delivereds: 0, rejecteds: 0, archiveds: 0 });
  // 
  useEffect(() => {
    axios(`${API}/supplier/get-navbar`, {
      headers: {
        'x-auth-token': `Bearer ${localStorage.getItem(`access`)}`
      }
    }).then(res => {
      const { ok, data, msg } = res.data;
      if (!ok) {
        toast.error(msg);
      } else {
        setS(data);
      }
    }).catch(() => {
      toast.error(ERROR_MSG)
    });
  }, [refresh])
  // 
  const classLink =
    "flex items-center justify-start w-full h-[40px] mb-[10px] rounded-full cursor-pointer hover:text-indigo-200 font-light border border-[#fff4] duration-300 px-[10px] py-[5px] gap-2 hover:pl-[15px] animate-fade-right relative ";
  return (
    <div>
      {/* NAV */}
      <nav
        className={`fixed top-0 duration-300 ${open ? "left-0" : "left-[-300px]"
          } bg-[#160082a3] backdrop-blur-sm h-[100vh] w-[300px] flex items-center justify-start flex-col gap-[5px] px-2 xl:relative xl:top-auto xl:left-auto p-[5px] z-[9999] scrollbar-hide`}
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
        <div className="flex items-center justify-start flex-col w-full h-[100vh] overflow-y-scroll scrollbar-hide">
          <Link
            to={"/supplier/dashboard"}
            className={
              classLink +
              'animate-delay-25 ' + (p === "/supplier/dashboard"
                ? "text-indigo-800 bg-white "
                : "bg-none text-white")
            }
          >
            <FaDisplay />
            Dashboard
          </Link>
          {/*  */}
          <Link
            to={"/supplier/products"}
            className={
              classLink +
              'animate-delay-[75ms] ' + (p === "/supplier/products"
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
            to={"/supplier/finance"}
            className={
              classLink +
              'animate-delay-[125ms] ' + (p === "/supplier/finance"
                ? "text-indigo-800 bg-white "
                : "bg-none text-white")
            }
          >
            <FaCreditCard />
            Moliya
          </Link>
          {/*  */}
          <Link
            to={"/supplier/new-orders"}
            className={
              classLink +
              'animate-delay-[175ms] ' + (p === "/supplier/new-orders"
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
            to={"/supplier/recontacts"}
            className={
              classLink +
              'animate-delay-[225ms] ' + (p === "/supplier/recontacts"
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
            to={"/supplier/success"}
            className={
              classLink +
              'animate-delay-[275ms] ' + (p === "/supplier/success"
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
            to={"/supplier/sended"}
            className={
              classLink +
              'animate-delay-[325ms] ' + (p === "/supplier/sended"
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
          <Link
            to={"/supplier/delivered"}
            className={
              classLink +
              'animate-delay-[375ms] ' + (p === "/supplier/delivered"
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
            to={"/supplier/reject"}
            className={
              classLink +
              'animate-delay-[425ms] ' + (p === "/supplier/reject"
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
            to={"/supplier/archive"}
            className={
              classLink +
              'animate-delay-[475ms] ' + (p === "/supplier/archive"
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
          {/*  */}
          {/* <Link
            to={"/supplier/settings"}
            className={
              classLink +
              'animate-delay-[525ms] ' + (p === "/supplier/settings"
                ? "text-indigo-800 bg-white "
                : "bg-none text-white")
            }
          >
            <FaGear />
            Sozlamalar
          </Link> */}
          {/*  */}
          <Link
            to={"/seller/dashboard"}
            className={
              classLink +
              'animate-delay-[525ms] ' + (p === "/seller/dashboard"
                ? "text-indigo-800 bg-white "
                : "bg-none text-white")
            }
          >
            <FaLeftLong />
            Ortga
          </Link>
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

export default SupplierNavbar;
