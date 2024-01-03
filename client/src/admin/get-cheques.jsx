import axios from "axios";
import { useEffect, useRef } from "react";
import { useState } from "react";
import { API, ERROR_MSG } from '../config'
import toast from "react-hot-toast";
import { Button, IconButton, Option, Select, Spinner } from "@material-tailwind/react";
import { FaPrint } from "react-icons/fa";
import Regions from '../assets/regions.json';
import { useReactToPrint } from "react-to-print";
import Barcode from 'react-barcode';
function AdminGetCheques() {
    const [isLoad, setIsLoad] = useState(false);
    const [orders, setOrders] = useState([]);
    const [filterRegion, setFilterRegion] = useState('');
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    // 
    useEffect(() => {
        setIsLoad(false);
        axios(`${API}/admin/get-cheques/${page}`, {
            headers: {
                'x-auth-token': `Bearer ${localStorage?.access}`
            }
        }).then(res => {
            const { ok, data, msg, pages } = res.data;
            setIsLoad(true);
            if (!ok) {
                toast.error(msg);
            } else {
                setOrders(data);
                setPages(pages);
            }
        }).catch(() => {
            toast.error(ERROR_MSG);
            setIsLoad(true);
        });
    }, [page]);
    // 
    document.title = `CHEKLAR(${orders?.length})`
    // PRINTER
    const printRef = useRef();
    const print = useReactToPrint({
        content: () => printRef.current,
        documentTitle: !filterRegion ? `Selly.uz - ${orders?.length} ta buyurtma` : `${Regions?.find(r => r.id === Number(filterRegion))} - ${orders?.length} ta buyurtma`
    });
    return (
        <div className="flex items-center justify-start flex-col w-full relative">
            {/* INTRO */}
            <p className="uppercase text-white text-[20px] sm:text-[30px] animate-fade-down my-[10px]">CHEKLAR</p>
            {/* FILTER */}
            <div className={`flex items-start justify-center flex-col w-[96%] animate-fade-up rounded-[4px_4px_0_0] gap-2 bg-white px-[10px] duration-300 p-[7px] z-[999]`}>
                {/* FILTER REGION */}
                {isLoad &&
                    <div className="flex items-center justify-between w-full gap-2">
                        <div className="flex items-center justify-center w-[80%] sm:w-[90%]">
                            <Select label="Viloyat filteri" onChange={e => setFilterRegion(e)} value={filterRegion} color="indigo">
                                {[{ id: '', name: 'Barchasi' }, ...Regions]?.map(o => (
                                    <Option key={o.id} value={String(o.id)}>{o?.name} <b className="text-indigo-500">{o?.id === '' ? orders?.length : orders?.filter(order => order?.region === o?.id)?.length}</b> ta</Option>
                                ))}
                            </Select>
                        </div>
                        <Button onClick={print} className="items-center gap-1 hidden sm:flex" color="blue-gray">
                            <FaPrint />
                            Print
                        </Button>
                        <IconButton onClick={print} className="w-[40px] h-[40px] text-[15px] sm:hidden inline" color="blue-gray">
                            <FaPrint />
                        </IconButton>
                    </div>
                }
            </div>
            {/* BODY */}
            <div ref={printRef} className="flex items-start justify-start flex-col w-[96%] overflow-x-scroll bg-white p-[10px] rounded-[0_0_4px_4px] animate-fade-up">
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
                    <div className="flex items-start justify-center w-full">
                        <div className="grid gap-3 grid-cols-3">
                            {orders?.filter(o => !filterRegion ? o : String(o?.region) === filterRegion)?.map((o, i) => {
                                return (
                                    <div key={i} className="flex items-center justify-start w-[310px] border-black border-[1px] rounded h-[250px] relative">
                                        {/* LEFT */}
                                        <div className="flex items-start gap-1 justify-start flex-col w-full p-[5px] h-[100%] text-[14px]">
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
                                            {/* ORDER-ID */}
                                            <p><b>ORDER-ID:</b> S-{o?.id}</p>
                                            <div className="flex w-full items-center justify-center absolute bottom-0 h-[50px] overflow-hidden">
                                                <Barcode value={`S-${o?.id}`} displayValue={0} height={30} />
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                }
            </div>
        </div >
    );
}

export default AdminGetCheques;