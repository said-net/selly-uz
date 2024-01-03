import axios from "axios";
import { useEffect, useState } from "react";
import { BiRefresh } from "react-icons/bi";
import { FaShoppingBag, FaShoppingBasket } from "react-icons/fa";
import { FaBoxArchive, FaCheck, FaCircleDollarToSlot, FaCircleXmark, FaClock, FaCreditCard, FaMoneyBill, FaTruckFast } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { API, ERROR_MSG } from "../config";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

function CourierDashboard() {
    const [s, setS] = useState({ my_orders: 0, recontacts: 0, rejecteds: 0, delivereds: 0, comming_balance: 0, balance: 0, payments: 0, comming_payments: 0 });
    // CLASSES
    const classCont = 'flex items-center justify-between w-[90%] sm:w-[300px] bg-white rounded-full h-[70px] p-[5px] hover:shadow-md cursor-pointer animate-fade-up relative ';
    // 
    const classIcon = 'flex rounded-full items-center justify-center w-[60px] h-[60px] text-[30px] ';
    // functions
    const { refresh } = useSelector(e => e?.config);
    useEffect(() => {
        axios(`${API}/courier/get-dashboard`, {
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
    }, [refresh]);
    return (
        <div className="flex items-center justify-start flex-col w-full relative">
            {/* INTRO */}
            <p className="uppercase text-white text-[20px] sm:text-[30px] animate-fade-down my-[10px]">dashboard</p>
            {/* BODY */}
            <div className="flex items-start justify-center w-full flex-wrap gap-3">
                {/* MY - ORDERS */}
                <Link to={'/courier/my-orders'} className={classCont + 'animate-delay-[50ms]'}>
                    <div className={classIcon + 'bg-blue-100 text-blue-500'}>
                        <FaShoppingBag />
                    </div>
                    <p className="absolute top-[1px] right-[20px]">Buyurtmalarim</p>
                    <p className="text-[30px]">{s?.my_orders?.toLocaleString()} <sub>ta</sub></p>
                </Link>
                {/* RECONTACT - ORDERS */}
                <Link to={'/courier/recontacts'} className={classCont + 'animate-delay-[75ms]'}>
                    <div className={classIcon + 'bg-orange-100 text-orange-500'}>
                        <BiRefresh />
                    </div>
                    <p className="absolute top-[1px] right-[20px]">Qayta aloqalar</p>
                    <p className="text-[30px]">{s?.recontacts?.toLocaleString()} <sub>ta</sub></p>
                </Link>
                {/* DELIVERED - ORDERS */}
                <Link to={'/courier/delivered'} className={classCont + 'animate-delay-[150ms]'}>
                    <div className={classIcon + 'bg-deep-purple-100 text-deep-purple-500'}>
                        <FaCheck />
                    </div>
                    <p className="absolute top-[1px] right-[20px]">Yetkazilganlar</p>
                    <p className="text-[30px]">{s?.delivereds?.toLocaleString()} <sub>ta</sub></p>
                </Link>
                {/* REJECT - ORDERS */}
                <Link to={'/courier/reject'} className={classCont + 'animate-delay-[175ms]'}>
                    <div className={classIcon + 'bg-red-100 text-red-500'}>
                        <FaCircleXmark />
                    </div>
                    <p className="absolute top-[1px] right-[20px]">Qaytib kelgan</p>
                    <p className="text-[30px]">{s?.rejecteds?.toLocaleString()} <sub>ta</sub></p>
                </Link>
                {/* COMMING - BALANCE */}
                <Link to={'/courier/finance'} className={classCont + 'animate-delay-[225ms]'}>
                    <div className={classIcon + 'bg-light-blue-100 text-light-blue-500'}>
                        <FaCircleDollarToSlot />
                    </div>
                    <p className="absolute top-[1px] right-[20px]">Kutilayotgan foyda</p>
                    <p className="text-[30px]">{s?.comming_balance?.toLocaleString()} <sub>so'm</sub></p>
                </Link>
                {/* BALANCE */}
                <Link to={'/courier/finance'} className={classCont + 'animate-delay-[250ms]'}>
                    <div className={classIcon + 'bg-green-100 text-green-500'}>
                        <FaCreditCard />
                    </div>
                    <p className="absolute top-[1px] right-[20px]">Hisobingiz</p>
                    <p className="text-[30px]">{s?.balance?.toLocaleString()} <sub>so'm</sub></p>
                </Link>
                {/* COMMING - PAYMENT */}
                <Link to={'/courier/finance'} className={classCont + 'animate-delay-[275ms]'}>
                    <div className={classIcon + 'bg-purple-100 text-purple-500'}>
                        <FaClock />
                    </div>
                    <p className="absolute top-[1px] right-[20px]">Tekshiruvdagi to'lov</p>
                    <p className="text-[30px]">{s?.comming_payments?.toLocaleString()} <sub>so'm</sub></p>
                </Link>
                {/*  PAYMENTS */}
                <Link to={'/courier/finance'} className={classCont + 'animate-delay-[300ms]'}>
                    <div className={classIcon + 'bg-orange-100 text-orange-500'}>
                        <FaMoneyBill />
                    </div>
                    <p className="absolute top-[1px] right-[20px]">Chiqarib olgansiz</p>
                    <p className="text-[30px]">{s?.payments?.toLocaleString()} <sub>so'm</sub></p>
                </Link>
            </div>
        </div>
    );
}

export default CourierDashboard;