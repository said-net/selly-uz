import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { API, ERROR_EFFECT, ERROR_MSG, SUCCESS_EFFECT } from "../config";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Button, Chip, Input, Option, Select, Spinner } from "@material-tailwind/react";
import Barcode from "react-barcode";
import Regions from '../assets/regions.json';
import { FaIdBadge } from "react-icons/fa6";
import BarcodeReader from 'use-scan-detection';
import { setLoad, setRefresh } from "../managers/config.manager";

function AdminParty() {
    const [params, setParams] = useSearchParams();
    const id = params.get('id');
    const [isLoad, setIsLoad] = useState(false);
    const [orders, setOrders] = useState([]);
    const [selecteds, setSelecteds] = useState([]);
    const [filterStatus, setFilterStatus] = useState('');
    const [orderId, setOrderId] = useState('');
    const dp = useDispatch();
    const { refresh } = useSelector(e => e?.config)
    useEffect(() => {
        setIsLoad(false);
        axios(`${API}/admin/get-party-orders/${id}`, {
            headers: {
                'x-auth-token': `Bearer ${localStorage?.access}`
            }
        }).then(res => {
            setIsLoad(true);
            const { ok, data, msg } = res.data;
            if (!ok) {
                toast.error(msg);
            } else {
                setOrders(data);
            }
        }).catch(() => {
            toast.error(ERROR_MSG);
            setIsLoad(true);
        })
    }, [refresh]);
    document.title = `PARTIYA: ${id}`;
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
    function getCourierStatus(s) {
        if (s === 'reject') {
            return 'Bekor qilingan';
        } else if (s === 'recontact') {
            return 'Qayta aloqa';
        } else if (s === 'sended') {
            return 'Yetkazilmoqda';
        } else if (s === 'delivered') {
            return 'Yetkazilgan';
        }
    }
    function SelectOne(_id) {
        if (selecteds?.includes(_id)) {
            setSelecteds(selecteds.filter(id => id !== _id));
        } else {
            setSelecteds([...selecteds, _id]);
            SUCCESS_EFFECT()
        }
    }
    function SelectByInput() {
        if (selecteds?.includes(Number(orderId))) {
            ERROR_EFFECT();
            toast.error("Ushbu ID tanlangan!")
        } else if (!orders?.find(o => o?.id === Number(orderId))) {
            ERROR_EFFECT();
            toast.error("ID Buyurtmalardan topilmadi")
        } else {
            SUCCESS_EFFECT();
            setSelecteds([...selecteds, Number(orderId)]);
            setOrderId('');
        }
    }
    // BARCODE
    BarcodeReader({
        onComplete: e => {
            let code = e?.replaceAll('Shift', '')?.replaceAll('S-', '');
            if (selecteds?.includes(Number(code))) {
                ERROR_EFFECT();
                toast.error("Ushbu ID tanlangan!")
            } else if (!orders?.find(o => o?.id === Number(code))) {
                ERROR_EFFECT();
                toast.error("ID Buyurtmalardan topilmadi")
            } else {
                SUCCESS_EFFECT();
                setSelecteds([...selecteds, Number(code)]);
            }
        },
        minLength: 3,
    });
    // 
    function SetStatusDelivered() {
        const list = [];
        selecteds?.forEach(id => {
            if (orders?.find(o => o?.id === id)) {
                list.push(orders?.find(o => o?.id === id)?._id);
            }
        });
        dp(setLoad(true));
        axios.post(`${API}/admin/set-status-to-orders`, {
            orders: list,
            status: 'delivered',
        }, {
            headers: {
                'x-auth-token': `Bearer ${localStorage?.access}`
            },
        }).then(res => {
            const { ok, msg } = res.data;
            dp(setLoad(false));
            if (!ok) {
                toast.error(msg);
            } else {
                toast.success(msg);
                setSelecteds([])
                dp(setRefresh());
            }
        }).catch(() => {
            dp(setLoad(false));
            toast.error(ERROR_MSG);
        })
    }
    function SetStatusReject() {
        const list = [];
        selecteds?.forEach(id => {
            if (orders?.find(o => o?.id === id)) {
                list.push(orders?.find(o => o?.id === id)?._id);
            }
        });
        dp(setLoad(true));
        axios.post(`${API}/admin/set-status-to-orders`, {
            orders: list,
            status: 'reject',
        }, {
            headers: {
                'x-auth-token': `Bearer ${localStorage?.access}`
            },
        }).then(res => {
            const { ok, msg } = res.data;
            dp(setLoad(false));
            if (!ok) {
                toast.error(msg);
            } else {
                toast.success(msg);
                setSelecteds([])
                dp(setRefresh());
            }
        }).catch(() => {
            dp(setLoad(false));
            toast.error(ERROR_MSG);
        })
    }
    return (
        <div className="flex items-center justify-start flex-col w-full relative">
            {/* INTRO */}
            <p className="uppercase text-white text-[20px] sm:text-[30px] animate-fade-down my-[10px]">PARTIYA: {id}</p>
            {/* BODY */}
            <div className="flex items-start justify-start flex-col w-[96%] overflow-x-scroll min-h-[70vh] bg-white p-[10px] rounded animate-fade-up">
                <div className={"flex items-center justify-start w-full p-[5px] flex-wrap border rounded-[7px]  mb-[10px] min-h-[40px] gap-2 " + (selecteds[0] ? ' border-indigo-500 border-2' : 'border-blue-gray-200')}>
                    {selecteds?.map((s, i) => {
                        return (
                            <p onClick={() => SelectOne(s)} className="text-[12px] cursor-pointer border-indigo-500 border-2 hover:border-green-500 p-[2px_5px] rounded-full" key={i}>S-{s}</p>
                        )
                    })}
                </div>
                <div className="w-full mb-[10px]">
                    <Select onChange={e => setFilterStatus(e)} value={filterStatus} label="Kuryer holati" color="indigo">
                        <Option value="reject">Bekor qilingan</Option>
                        <Option value="sended">Yetkazilmoqda</Option>
                        <Option value="recontact">Qayta aloqa</Option>
                        <Option value="delivered">Yetkazilgan</Option>
                    </Select>
                </div>
                <div className="w-full mb-[10px]">
                    <Input onKeyPress={k => k?.key === 'Enter' && SelectByInput()} type="number" onChange={e => setOrderId(e.target.value)} value={orderId} label="ID:" color="indigo" icon={<FaIdBadge />} />
                </div>
                <div className="w-full mb-[10px] flex items-center justify-between">
                    <Button disabled={!selecteds[0]} onClick={SetStatusReject} color="red" className="w-[49%]">Qaytgan</Button>
                    <Button disabled={!selecteds[0]} onClick={SetStatusDelivered} color="green" className="w-[49%]">Yetkazlgan</Button>
                </div>
                {/*  */}
                {!isLoad &&
                    <div className="flex items-center justify-center w-full gap-3 h-[50vh]">
                        <Spinner color="indigo" />
                        Kuting...
                    </div>
                }
                {isLoad && !orders[0] &&
                    <div className="flex items-center justify-center w-full gap-3 h-[50vh]">
                        <p>Cheklar mavud emas : (</p>
                    </div>
                }
                {isLoad && orders[0] &&
                    <div className="flex items-start justify-center w-full overflow-x-scroll">
                        <div className="flex items-start justify-center flex-wrap gap-3">
                            {orders?.filter(o => !filterStatus ? o : o?.courier_status === filterStatus)?.map((o, i) => {
                                return (
                                    <div onClick={() => SelectOne(o?.id)} key={i} className={`flex items-start justify-start flex-col p-[5px] gap-2 sm:gap-1 cursor-pointer w-[280px] sm:w-[310px] text-[12px] sm:text-[14px] border-[1px] rounded border-black h-[360px] relative ${selecteds?.includes(o?.id) ? 'bg-gray-300' : 'bg-white'}`}>
                                        {/* ORDER-ID */}
                                        <p><b>ORDER-ID:</b> S-{o?.id}</p>
                                        {/* NAME PHONE */}
                                        <p><b>Mijoz:</b> {o?.name} | {o?.phone}</p>
                                        {/* REGION CITY */}
                                        <p><b>Manzil:</b> {Regions?.find(r => r?.id === o?.region)?.name
                                        } - {o?.city}</p>
                                        {/* PRODUCT */}
                                        <p><b>Mahsulot:</b> {o?.title} | <b>{o?.value}</b> ta</p>
                                        {/* PRICE */}
                                        <p><b>Umumiy:</b> {Number(o?.price)?.toLocaleString()} so'm</p>
                                        {/* COMMENT */}
                                        <p><b>Izoh:</b> {o?.comment}</p>
                                        {/* OPERATOR */}
                                        <p><b>OPERATOR:</b> {o?.operator} | {o?.operator_phone}</p>
                                        {/* WEB-SITE */}
                                        <p><b>VEB-SAYT:</b> WWW.SELLY.UZ</p>
                                        {/* STATUS */}
                                        <p><b>HOLAT:</b> {getStatus(o?.status)}</p>
                                        {/* COURIER */}
                                        <p><b>KURYER:</b> {o?.courier} | {o?.courier_phone}</p>
                                        {/* COURIER STATUS */}
                                        <p className="flex items-center justify-start gap-2"><b>KURYER HOLATI:</b> <Chip className="p-[2px] rounded" value={getCourierStatus(o?.courier_status)} color={o?.courier_status === 'reject' ? 'red' : o?.courier_status === 'sended' ? 'blue' : o?.courier_status === 'recontact' ? 'orange' : 'green'} /></p>
                                        {/*  */}
                                        <div className="flex w-full items-center justify-center absolute bottom-0 h-[50px] overflow-hidden">
                                            <Barcode displayValue={false} value={`S-${o?.id}`} height={30} />
                                        </div>
                                        {/*  */}
                                        {/* VERIFIED */}
                                        <div className={`absolute top-0 right-0 w-[50px] h-[50px] rounded-[0_0_0_50px] ${!o?.verified ? 'bg-orange-500' : 'bg-green-500'}`}>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}

export default AdminParty;