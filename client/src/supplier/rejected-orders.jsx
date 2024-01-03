import axios from "axios";
import { useEffect, useState } from "react";
import { API, ERROR_MSG } from "../config";
import toast from "react-hot-toast";
import { Spinner } from "@material-tailwind/react";
import { FaBox, FaCalendar, FaIdCard, FaMoneyBill, FaPhone } from "react-icons/fa6";

function SupplierRejectedOrders() {
    const [orders, setOrders] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    useEffect(() => {
        setIsLoad(false);
        axios(`${API}/supplier/get-orders/reject`, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { ok, msg, data } = res.data;
            setIsLoad(true);
            if (!ok) {
                toast.error(msg);
            } else {
                setOrders(data);
            }
        }).catch(() => {
            toast.error(ERROR_MSG);
        })
    }, []);
    return (
        <div className="flex items-center justify-start flex-col w-full p-1">
            {/* TOP */}
            <div className="flex my-[10px] items-center xl:items-start justify-center xl:justify-start flex-col w-full mb-[10px]">
                <h1 className="text-[20px] md:text-[30px] sm:text-[40px] text-white animate-fade-down">BEKOR QILINGANLAR</h1>
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
                                        Mahsulot: <b>{o?.product} / {o?.value} ta</b>
                                    </p>
                                    <p className="flex items-center justify-start gap-1">
                                        <FaMoneyBill className="text-blue-gray-800" />
                                        Foyda: <s className="text-red-500"><b>{o?.for_supplier}</b></s> so'm
                                    </p>
                                    <p className="flex items-center justify-start gap-1">
                                        <FaPhone className="text-blue-gray-800" />
                                        Buyurtmachi raqami: <b>{o?.phone}</b>
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </>
            }
        </div>
    );
}

export default SupplierRejectedOrders;