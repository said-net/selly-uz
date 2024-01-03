import { useEffect, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { FaBoxesPacking, FaCreditCard, FaMoneyBill, FaUsers } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { API } from "../config";
import axios from "axios";

function AdminDashboard() {
    document.title = "SELLY - DASHBOARD";
    const [s, setS] = useState({
        sellers: 0,
        suppliers: 0,
        operators: 0,
        sellers_balance: 0,
        operator_balance: 0,
        orders: 0,
        // 
        today_delivered: 0,
        today_profit: 0,
        // 
        yesterday_delivered: 0,
        yesterday_profit: 0,
        // 
        weekly_delivered: 0,
        weekly_profit: 0,
        // 
        last_weekly_delivered: 0,
        last_weekly_profit: 0,
        // 
        monthly_delivered: 0,
        monthly_profit: 0,
        // 
        last_monthly_delivered: 0,
        last_monthly_profit: 0,
        // 
        yearly_delivered: 0,
        yearly_profit: 0,
        // 
        all_delivered: 0,
        all_profit: 0
    });
    const { refresh } = useSelector(e => e?.config);
    useEffect(() => {
        axios(`${API}/admin/get-dashboard`, {
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
    const classCont = 'flex items-center justify-between w-[300px] rounded-full h-[60px] bg-white relative p-[5px] animate-fade-up';
    const classIcon = 'flex items-center justify-center w-[50px] h-[50px] rounded-full ';
    const classStat = 'flex items-center justify-center w-full md:w-[300px] border-l-[5px] rounded h-[50px] border-[1px] p-[5px] text-[12px] gap-[5px] '
    // 
    return (
        <div className="flex items-center justify-start flex-col w-full gap-3 p-[50px_5px]">
            {/*  */}
            <div className="flex items-start justify-center w-full flex-wrap gap-2">
                {/*  */}
                <div className={classCont}>
                    <div className={`${classIcon} bg-green-100 text-green-300`}>
                        <FaUsers className="text-[30px]" />
                    </div>
                    <p className="absolute top-[1px] right-[25px] uppercase text-[14px]">Sotuvchilar</p>
                    <p className="text-[25px] font-light">{s?.sellers} ta</p>
                </div>
                {/*  */}
                <div className={classCont}>
                    <div className={`${classIcon} bg-orange-100 text-orange-300`}>
                        <FaBoxesPacking className="text-[30px]" />
                    </div>
                    <p className="absolute top-[1px] right-[25px] uppercase text-[14px]">Ta'minotchilar</p>
                    <p className="text-[25px] font-light">{s?.suppliers} ta</p>
                </div>
                {/*  */}
                <div className={classCont}>
                    <div className={`${classIcon} bg-blue-100 text-blue-300`}>
                        <FaBoxesPacking className="text-[30px]" />
                    </div>
                    <p className="absolute top-[1px] right-[25px] uppercase text-[14px]">Operatorlar</p>
                    <p className="text-[25px] font-light">{s?.operators} ta</p>
                </div>
                {/*  */}
                <div className={classCont}>
                    <div className={`${classIcon} bg-red-100 text-red-300`}>
                        <FaCreditCard className="text-[30px]" />
                    </div>
                    <p className="absolute top-[1px] right-[25px] uppercase text-[14px]">Sotuvchilar hisobi</p>
                    <p className="text-[25px] font-light">{s?.sellers_balance?.toLocaleString()} so'm</p>
                </div>
                {/*  */}
                <div className={classCont}>
                    <div className={`${classIcon} bg-purple-100 text-purple-300`}>
                        <FaMoneyBill className="text-[30px]" />
                    </div>
                    <p className="absolute top-[1px] right-[25px] uppercase text-[14px]">Operatorlar hisobi</p>
                    <p className="text-[25px] font-light">{s?.operator_balance?.toLocaleString()} so'm</p>
                </div>
                {/*  */}
                <div className={classCont}>
                    <div className={`${classIcon} bg-purple-100 text-purple-300`}>
                        <FaShoppingCart className="text-[30px]" />
                    </div>
                    <p className="absolute top-[1px] right-[25px] uppercase text-[14px]">Sotuvlar</p>
                    <p className="text-[25px] font-light">{s?.orders?.toLocaleString()} ta</p>
                </div>
            </div>
            {/*  */}
            <div className="flex items-center justify-center w-full p-[10px] rounded bg-white flex-wrap gap-[10px] animate-fade-up">
                {/* DAILY */}
                <div className={`${classStat} border-blue-300`}>
                    <p>Bugun:</p>
                    <p>{s?.today_delivered?.toLocaleString()} ta ({s?.today_profit?.toLocaleString()} so'm)</p>
                </div>
                {/* YESTERDAY */}
                <div className={`${classStat} border-indigo-300`}>
                    <p>Kecha:</p>
                    <p>{s?.yesterday_delivered?.toLocaleString()} ta ({s?.yesterday_profit?.toLocaleString()} so'm)</p>
                </div>
                {/* WEEKLY */}
                <div className={`${classStat} border-purple-300`}>
                    <p>Haftalik:</p>
                    <p>{s?.weekly_delivered?.toLocaleString()} ta ({s?.weekly_profit?.toLocaleString()} so'm)</p>
                </div>
                {/* LAST WEEKLY */}
                <div className={`${classStat} border-red-300`}>
                    <p>O'tgan hafta:</p>
                    <p>{s?.last_weekly_delivered?.toLocaleString()} ta ({s?.last_weekly_profit?.toLocaleString()} so'm)</p>
                </div>
                {/* MONTHLY */}
                <div className={`${classStat} border-orange-300`}>
                    <p>Oylik:</p>
                    <p>{s?.monthly_delivered?.toLocaleString()} ta ({s?.monthly_profit?.toLocaleString()} so'm)</p>
                </div>
                {/* LAST MONTHLY */}
                <div className={`${classStat} border-deep-orange-300`}>
                    <p>O'tgan oy:</p>
                    <p>{s?.last_monthly_delivered?.toLocaleString()} ta ({s?.last_monthly_profit?.toLocaleString()} so'm)</p>
                </div>
                {/* YEARLY */}
                <div className={`${classStat} border-teal-300`}>
                    <p>Yillik:</p>
                    <p>{s?.yearly_delivered?.toLocaleString()} ta ({s?.yearly_profit?.toLocaleString()} so'm)</p>
                </div>
                {/* TOTAL */}
                <div className={`${classStat} border-red-300`}>
                    <p>Umumiy:</p>
                    <p>{s?.all_delivered?.toLocaleString()} ta ({s?.all_profit?.toLocaleString()} so'm)</p>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;