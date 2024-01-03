import { Chip, Input, Option, Select, Spinner } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { API, ERROR_MSG } from "../config";
import toast from "react-hot-toast";
import Regions from '../assets/regions.json';
import { BiIdCard } from 'react-icons/bi'
import { useNavigate } from "react-router-dom";
function AdminParties() {
    const [parties, setParties] = useState([]);
    const [couriers, setCouriers] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const [id, setId] = useState('');
    const [filterRegion, setFilterRegion] = useState('');
    const [filterCourier, setFilterCourier] = useState('');
    useEffect(() => {
        setIsLoad(false);
        axios(`${API}/admin/get-parties`, {
            headers: {
                'x-auth-token': `Bearer ${localStorage?.access}`
            }
        }).then(res => {
            const { ok, parties, couriers, msg } = res?.data;
            setIsLoad(true);
            if (!ok) {
                toast.error(msg);
            } else {
                setParties(parties);
                setCouriers(couriers);
            }
        }).catch(() => {
            setIsLoad(true);
            toast.error(ERROR_MSG);
        })
    }, []);
    document.title = `PARTIYALAR(${parties?.length})`
    const nv = useNavigate();
    return (
        <div className="flex items-center justify-start flex-col w-full relative">
            {/* INTRO */}
            <p className="uppercase text-white text-[20px] sm:text-[30px] animate-fade-down my-[10px]">PARTIYALAR</p>
            {/* BODY */}
            <div className="flex items-center justify-start flex-wrap w-full p-[5px] gap-2">
                {/* FILTER */}
                <div className="flex items-center justify-start flex-col w-full gap-[10px] bg-white p-[10px] rounded animate-fade-down z-[999]">
                    {/*  */}
                    {isLoad &&
                        <>
                            {/* REGION FILTER */}
                            <div className="w-full">
                                <Select onChange={e => { setFilterRegion(e); setFilterCourier('') }} value={filterRegion} label="Viloyat filteri" color="indigo">
                                    {Regions?.map((r, i) => {
                                        return (
                                            <Option key={i} value={String(r?.id)}>{r?.name} | <span className="text-indigo-500 font-bold">{parties?.filter(p => p?.region === r?.id)?.length}</span> ta</Option>
                                        )
                                    })}
                                </Select>
                            </div>
                            {/* COURIER FILTER */}
                            <div className="w-full">
                                <Select onChange={e => setFilterCourier(e)} value={filterCourier} label="Kuryer filteri" color="indigo">
                                    {couriers?.filter(c => !filterRegion ? c : c?.region === Number(filterRegion))?.map((c, i) => {
                                        return (
                                            <Option key={i} value={c?._id}>{c?.name} | <span className="text-indigo-500 font-bold">{parties?.filter(p => p?.courier_id === c?.id)?.length}</span> ta</Option>
                                        )
                                    })}
                                </Select>
                            </div>
                            {/* ID FILTER */}
                            <div className="w-full">
                                <Input label="ID filteri" onChange={e => setId(e?.target?.value)} value={id} type="number" color="indigo" icon={<BiIdCard />} />
                            </div>
                        </>
                    }
                    {/*  */}
                </div>
                {/* MAPPING */}
                {!isLoad &&
                    <div className="flex items-center justify-center gap-3 w-full h-[40vh]">
                        <Spinner color="indigo" />
                        Kuting...
                    </div>
                }
                {isLoad && !parties[0] &&
                    <div className="flex items-center justify-center gap-3 w-full h-[40vh]">
                        <p>Partiyalar mavjud emas!</p>
                    </div>
                }
                {isLoad && parties[0] &&
                    parties?.filter(p => !filterRegion ? p : p?.region === Number(filterRegion))?.filter(p => !filterCourier ? p : p?.courierId === filterCourier)?.filter(p => !id ? p : p?.id === Number(id))?.map((p, i) => {
                        return (
                            <div onClick={() => nv(`/admin/party?id=${p?.id}`)} className="flex items-start p-1 justify-start flex-col w-full md:w-[300px] rounded animate-fade-up bg-white hover:bg-gray-200 cursor-pointer" style={{ animationDelay: i + '0ms' }} key={i}>
                                <p className="text-[14px]"><b>Partiya-ID:</b> {p?.id}</p>
                                <p className="text-[14px]"><b>Yuborilgan:</b> {p?.created}</p>
                                <p className="text-[14px]"><b>Kuryer:</b> {p?.courier_id} | {p?.courier} | <span className="underline text-blue-500 cursor-pointer" onClick={() => window.open('tel:' + p?.courier_phone)}>{p?.courier_phone}</span></p>
                                <p className="text-[14px]"><b>Viloyat:</b> {Regions?.find(r => r?.id === p?.region)?.name}</p>
                                {/*  */}
                                <p className="text-[14px]"><b>Buyurtmalar:</b> {p?.total} ta / {Number(p?.price)?.toLocaleString()} so'm</p>
                                <p className="text-[14px]"><b>Sotilgan:</b> {p?.delivered} ta / {Number(p?.profit)?.toLocaleString()} so'm</p>
                                <p className="text-[14px]"><b>Qaytgan:</b> {p?.reject} ta / {Number(p?.not_come_profit)?.toLocaleString()} so'm</p>
                                {/*  */}
                                <p className="text-[14px]"><b>Kuryer uchun:</b> {p?.delivered} ta / {Number(p?.courier_profit)?.toLocaleString()} so'm</p>
                                {/*  */}
                                <div className="text-[14px] flex gap-1"><b>Holat:</b> <Chip value={p?.verified ? 'Yakunlangan' : 'Yakunlanmagan'} color={p?.verified ? 'green' : 'orange'} className="font-normal p-[0_5px]" /></div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
}

export default AdminParties;