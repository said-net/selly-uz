import axios from "axios";
import { useEffect, useState } from "react";
import { API, ERROR_MSG } from "../config";
import toast from "react-hot-toast";
import { IconButton, Spinner } from "@material-tailwind/react";
import { FaBox, FaCalendar, FaIdCard, FaMoneyBill, FaPhone } from "react-icons/fa6";
import { FaQuestionCircle } from "react-icons/fa";

function SellerOrders() {
    const [orders, setOrders] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(1);
    const [pages, setPages] = useState(1);
    useEffect(() => {
        setIsLoad(false);
        axios(`${API}/seller/get-orders/${page}`, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { ok, msg, data, pages, total } = res.data;
            setIsLoad(true);
            if (!ok) {
                toast.error(msg);
            } else {
                setOrders(data);
                setPages(pages);
                setTotal(total);
                window?.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        }).catch(() => {
            toast.error(ERROR_MSG);
        })
    }, [page]);
    function getStatus(s) {
        if (s === 'new') {
            return 'Yangi';
        } else if (s === 'reject') {
            return 'Bekor qilingan';
        } else if (s === 'archive') {
            return 'Arxivlangan';
        } else if (s === 'recontact') {
            return 'Qayta aloqa';
        } else if (s === 'copy') {
            return 'Kopiya( Dublikat )';
        } else if (s === 'success') {
            return 'Qabul qilingan( Upakovkada )';
        } else if (s === 'sended') {
            return 'Yetkazilmoqda';
        } else if (s === 'delivered') {
            return 'Yetkazilgan';
        }
    }
    return (
        <div className="flex items-center justify-start flex-col w-full p-1">
            {/* TOP */}
            <div className="flex items-center xl:items-start justify-center xl:justify-start flex-col w-full mb-[10px]">
                <h1 className="text-[30px] sm:text-[40px] text-white animate-fade-down">BUYURTMALAR</h1>
            </div>
            {/* BODY */}
            <div className="flex items-start justify-start w-full h-[50px] px-[10px] flex-col">
                <p className="text-white uppercase animate-fade-right animate-delay-100">{total?.toLocaleString()} dan {orders?.length?.toLocaleString()} ta buyurtma</p>
                <p className="text-white uppercase animate-fade-left animate-delay-150">{pages?.toLocaleString()} dan {page?.toLocaleString()} chi sahifa</p>
            </div>
            {/* Isload */}
            {!isLoad &&
                <div className="flex items-center justify-center w-full h-[70vh] gap-3 text-white animate-fade-up">
                    <Spinner color="indigo" /> Kuting...
                </div>
            }
            {isLoad && !orders[0] &&
                <div className="flex items-center justify-center w-full h-[70vh] gap-3 text-white animate-fade-up flex-col">
                    <p>Buyurtmalar mavjud emas : (</p>
                </div>
            }
            {isLoad && orders[0] &&
                <>
                    <div className="flex items-start justify-center flex-wrap w-full gap-2">
                        {orders?.map((o, i) => {
                            return (
                                <div className={`flex items-start justify-start flex-col w-[90%] sm:w-[320px] p-[5px] rounded  bg-white animate-fade-up`} style={{ animationDelay: (i + 1) + '0ms' }} key={i}>
                                    <p className="flex items-center justify-start gap-1">
                                        <FaIdCard className="text-blue-gray-800" />
                                        ID: <b>{o?.id}</b>
                                    </p>
                                    <p className="flex items-center justify-start gap-1">
                                        <FaCalendar className="text-blue-gray-800" />
                                        Buyurtma sanasi: <b>{o?.created}</b>
                                    </p>
                                    <p className="flex items-center justify-start gap-1">
                                        <FaBox className="text-blue-gray-800" />
                                        Mahsulot: <b>{o?.product}</b>
                                    </p>
                                    <p className="flex items-center justify-start gap-1">
                                        <FaMoneyBill className="text-blue-gray-800" />
                                        Sotuvchi bonusi: <b>{o?.for_seller}</b> so'm
                                    </p>
                                    <p className="flex items-center justify-start gap-1">
                                        <FaPhone className="text-blue-gray-800" />
                                        Buyurtmachi raqami: <b>{o?.phone}</b>
                                    </p>
                                    <p className="flex items-center justify-start gap-1">
                                        <FaQuestionCircle className="text-blue-gray-800" />
                                        Holat: <b>{getStatus(o?.status)}</b>
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                    <div className="flex items-center justify-center w-full gap-2 mt-[10px] animate-fade-up" style={{ animationDelay: (orders?.length+1) + '0ms' }}>
                        <IconButton onClick={() => setPage(page >= 2 ? page - 1 : 1)} disabled={page < 2} color="green" className="rounded-full">
                            {page - 1}
                        </IconButton>
                        <IconButton color="yellow" className="rounded-full">
                            {page}
                        </IconButton>
                        <IconButton onClick={() => setPage(pages >= page + 1 ? page + 1 : page)} disabled={pages < page + 1} color="green" className="rounded-full">
                            {page + 1}
                        </IconButton>
                    </div>
                </>
            }
        </div>
    );
}

export default SellerOrders;