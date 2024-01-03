import axios from "axios";
import { useEffect, useState } from "react";
import { FaCheckCircle, FaMoneyBillAlt, } from "react-icons/fa";
import { FaBoxesStacked, FaCreditCard, FaMoneyBill, FaTruckFast, } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { API, ERROR_MSG } from "../config";
import toast from "react-hot-toast";

function SupplierDashboard() {
    const [s, setS] = useState({ products: 0, balance: 0, hold_balance: 0, payments: 0, comming_payments: 0, sended: 0, delivered: 0 });
    // 
    const { refresh } = useSelector(e => e?.config)
    const classCont = 'flex items-center justify-between w-[90%] sm:w-[320px] rounded-full h-[80px] bg-white relative p-[5px_10px] animate-fade-up ';
    const classIcon = 'flex items-center justify-center w-[60px] h-[60px] rounded-full ';
    // 
    useEffect(() => {
        axios(`${API}/supplier/get-dashboard`, {
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
    return (
        <div className="flex items-center justify-start flex-col w-full gap-3 p-[50px_5px]">
            <div className="flex items-start justify-center w-full flex-wrap gap-2">
                {/*  */}
                <div className={classCont+' animate-delay-75'}>
                    <div className={`${classIcon} bg-green-100 text-green-500`}>
                        <FaBoxesStacked className="text-[30px]" />
                    </div>
                    <p className="absolute top-[5px] right-[25px] uppercase text-[14px]">Mahsulotlar</p>
                    <p className="text-[25px] font-light">{s?.products} ta</p>
                </div>
                {/*  */}
                <div className={classCont+' animate-delay-[125ms]'}>
                    <div className={`${classIcon} bg-orange-100 text-orange-500`}>
                        <FaCreditCard className="text-[30px]" />
                    </div>
                    <p className="absolute top-[5px] right-[25px] uppercase text-[14px]">Balans</p>
                    <p className="text-[25px] font-light">{s?.balance?.toLocaleString()} so'm</p>
                </div>
                {/*  */}
                <div className={classCont+' animate-delay-[175ms]'}>
                    <div className={`${classIcon} bg-blue-100 text-blue-500`}>
                        <FaMoneyBill className="text-[30px]" />
                    </div>
                    <p className="absolute top-[5px] right-[25px] uppercase text-[14px]">hold balans</p>
                    <p className="text-[25px] font-light">{s?.hold_balance?.toLocaleString()} so'm</p>
                </div>
                {/*  */}
                <div className={classCont+' animate-delay-[225ms]'}>
                    <div className={`${classIcon} bg-red-100 text-red-500`}>
                        <FaMoneyBillAlt className="text-[30px]" />
                    </div>
                    <p className="absolute top-[5px] right-[25px] uppercase text-[14px]">Chiqarib olgansiz</p>
                    <p className="text-[25px] font-light">{s?.payments?.toLocaleString()} so'm</p>
                </div>
                {/*  */}
                <div className={classCont+' animate-delay-[275ms]'}>
                    <div className={`${classIcon} bg-deep-purple-100 text-deep-purple-500`}>
                        <FaMoneyBill className="text-[30px]" />
                    </div>
                    <p className="absolute top-[5px] right-[25px] uppercase text-[14px]">Tekshiruvdagi to'lov</p>
                    <p className="text-[30px] font-light">{s?.comming_payments?.toLocaleString()} so'm</p>
                </div>
                {/*  */}
                <div className={classCont+' animate-delay-[325ms]'}>
                    <div className={`${classIcon} bg-purple-100 text-purple-500`}>
                        <FaTruckFast className="text-[30px]" />
                    </div>
                    <p className="absolute top-[5px] right-[25px] uppercase text-[14px]">Yuborilganlar</p>
                    <p className="text-[30px] font-light">{s?.sended?.toLocaleString()} ta</p>
                </div>
                {/*  */}
                <div className={classCont+' animate-delay-[375ms]'}>
                    <div className={`${classIcon} bg-green-100 text-green-500`}>
                        <FaCheckCircle className="text-[30px]" />
                    </div>
                    <p className="absolute top-[5px] right-[25px] uppercase text-[14px]">yetkazilganlar</p>
                    <p className="text-[30px] font-light">{s?.delivered?.toLocaleString()} ta</p>
                </div>
            </div>
        </div>
    );
}

export default SupplierDashboard;