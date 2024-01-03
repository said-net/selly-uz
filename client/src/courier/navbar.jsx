import { IconButton } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { BiAlignLeft, BiXCircle } from "react-icons/bi";
import {
    FaBoxesPacking,
    FaCircleXmark,
    FaCreditCard,
    FaDisplay,
    FaGear,
    FaLeftLong,
    FaRecycle,
    FaTruckFast,
} from "react-icons/fa6";
import { FaShoppingCart } from 'react-icons/fa'
import { Link, useLocation } from "react-router-dom";
import { API, ERROR_MSG } from "../config";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setInfoAuth } from "../managers/auth.manager";
function CourierNavbar() {
    const [open, setOpen] = useState(false);
    const p = useLocation().pathname;
    const { refresh } = useSelector(e => e?.config)
    useEffect(() => {
        setOpen(false);
    }, [p]);
    // 
    const [s, setS] = useState({ my_orders: 0, parties: 0, recontacts: 0, delivereds: 0, rejecteds: 0 });
    // 
    useEffect(() => {
        axios(`${API}/courier/get-navbar`, {
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
                        to={"/courier/dashboard"}
                        className={
                            classLink +
                            'animate-delay-25 ' + (p === "/courier/dashboard"
                                ? "text-indigo-800 bg-white "
                                : "bg-none text-white")
                        }
                    >
                        <FaDisplay />
                        Dashboard
                    </Link>
                    {/*  */}
                    <Link
                        to={"/courier/finance"}
                        className={
                            classLink +
                            'animate-delay-[75ms] ' + (p === "/courier/finance"
                                ? "text-indigo-800 bg-white "
                                : "bg-none text-white")
                        }
                    >
                        <FaCreditCard />
                        Moliya
                    </Link>
                    {/*  */}
                    <Link
                        to={"/courier/my-orders"}
                        className={
                            classLink +
                            'animate-delay-[125ms] ' + (p === "/courier/my-orders"
                                ? "text-indigo-800 bg-white "
                                : "bg-none text-white")
                        }
                    >
                        <FaShoppingCart />
                        Mening buyurtmalarim
                        <span className="absolute right-[10px] bg-white p-[0_5px] text-[12px] rounded text-[#000]">
                            {s?.my_orders?.toLocaleString()}
                        </span>
                    </Link>
                    <Link
                        to={"/courier/recontacts"}
                        className={
                            classLink +
                            'animate-delay-[175ms] ' + (p === "/courier/recontacts"
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
                        to={"/courier/delivered"}
                        className={
                            classLink +
                            'animate-delay-[225ms] ' + (p === "/courier/delivered"
                                ? "text-indigo-800 bg-white "
                                : "bg-none text-white")
                        }
                    >
                        <FaTruckFast />
                        Yetkazilganlar
                        <span className="absolute right-[10px] bg-white p-[0_5px] text-[12px] rounded text-[#000]">
                            {s?.delivereds?.toLocaleString()}
                        </span>
                    </Link>
                    {/*  */}
                    <Link
                        to={"/courier/reject"}
                        className={
                            classLink +
                            'animate-delay-[275ms] ' + (p === "/courier/reject"
                                ? "text-indigo-800 bg-white "
                                : "bg-none text-white")
                        }
                    >
                        <FaCircleXmark />
                        Bekor qilinganlar
                        <span className="absolute right-[10px] bg-white p-[0_5px] text-[12px] rounded text-[#000]">
                            {s?.rejecteds?.toLocaleString()}
                        </span>
                    </Link>
                    {/*  */}
                    <Link
                        to={"/courier/parties"}
                        className={
                            classLink +
                            'animate-delay-[325ms] ' + (p === "/courier/parties"
                                ? "text-indigo-800 bg-white "
                                : "bg-none text-white")
                        }
                    >
                        <FaBoxesPacking />
                        Partiyalar
                        <span className="absolute right-[10px] bg-white p-[0_5px] text-[12px] rounded text-[#000]">
                            {s?.parties?.toLocaleString()}
                        </span>
                    </Link>
                    {/*  */}
                    <Link
                        to={"/courier/settings"}
                        className={
                            classLink +
                            'animate-delay-[375ms] ' + (p === "/courier/settings"
                                ? "text-indigo-800 bg-white "
                                : "bg-none text-white")
                        }
                    >
                        <FaGear />
                        Sozlamalar
                    </Link>
                    {/*  */}
                    <div onClick={LogOut} className={
                        classLink +
                        'animate-delay-[425ms] text-red-500'
                    }>
                        <FaLeftLong />
                        Chiqish
                    </div>
                </div>
            </nav >
            <div
                onClick={() => setOpen(false)}
                className={`${open ? "w-full" : "w-0"
                    } duration-300 h-screen fixed top-0 right-0 z-[9998] bg-[#4c008269] backdrop-blur-sm`}
            ></div>
        </div >
    );
}

export default CourierNavbar;
