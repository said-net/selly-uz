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

function CourierGetParty() {
    const [params, setParams] = useSearchParams();
    const id = params.get('id');
    const [isLoad, setIsLoad] = useState(false);
    const [orders, setOrders] = useState([]);
    const [filterStatus, setFilterStatus] = useState('');
    const { refresh } = useSelector(e => e?.config)
    useEffect(() => {
        setIsLoad(false);
        axios(`${API}/courier/get-party-orders/${id}`, {
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
    return (
        <div className="flex items-center justify-start flex-col w-full relative">
            {/* INTRO */}
            <p className="uppercase text-white text-[20px] sm:text-[30px] animate-fade-down my-[10px]">PARTIYA: {id}</p>
            {/* BODY */}
            <div className="flex items-start justify-start flex-col w-[96%] overflow-x-scroll min-h-[70vh] bg-white p-[10px] rounded animate-fade-up">
                <div className="w-full mb-[10px]">
                    <Select onChange={e => setFilterStatus(e)} value={filterStatus} label="Kuryer holati" color="indigo">
                        <Option value="reject">Bekor qilingan</Option>
                        <Option value="sended">Yetkazilmoqda</Option>
                        <Option value="recontact">Qayta aloqa</Option>
                        <Option value="delivered">Yetkazilgan</Option>
                    </Select>
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
                                    <div key={i} className={`flex overflow-hidden items-start justify-start flex-col p-[5px] gap-2 sm:gap-1 cursor-pointer w-[280px] sm:w-[310px] text-[12px] sm:text-[14px] border-[1px] rounded border-black h-[320px] relative bg-white hover:bg-gray-200`}>
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
                                        {/* COURIER STATUS */}
                                        <p className="flex items-center justify-start gap-2"><b>KURYER HOLATI:</b> <Chip className="p-[2px] rounded" value={getCourierStatus(o?.courier_status)} color={o?.courier_status === 'reject' ? 'red' : o?.courier_status === 'sended' ? 'blue' : o?.courier_status === 'recontact' ? 'orange' : 'green'} /></p>
                                        <div className="flex w-full items-center justify-center absolute bottom-0 h-[50px] overflow-hidden">
                                            <Barcode displayValue={false} value={`S-${o?.id}`} height={30} />
                                        </div>
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

export default CourierGetParty;