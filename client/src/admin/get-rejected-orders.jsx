import axios from "axios";
import { useEffect, useRef } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API, ERROR_MSG } from '../config'
import toast from "react-hot-toast";
import { Button, Checkbox, Dialog, DialogBody, DialogFooter, DialogHeader, IconButton, Option, Select, Spinner } from "@material-tailwind/react";
import { FaNewspaper, FaPrint, FaSave } from "react-icons/fa";
import Regions from '../assets/regions.json';
import { setLoad, setRefresh } from "../managers/config.manager";
import { useReactToPrint } from "react-to-print";
function AdminGetRejectedOrders() {
    const [isLoad, setIsLoad] = useState(false);
    const [orders, setOrders] = useState([]);
    const [selecteds, setSelecteds] = useState([]);
    const [couriers, setCouriers] = useState([]);
    const [showSeller, setShowSeller] = useState(false);
    const [showOperator, setShowOperator] = useState(false);
    const [showSupplier, setShowSupplier] = useState(false);
    const [showOther, setShowOther] = useState(false);
    const [showMore, setShowMore] = useState(false);
    const [showCourier, setShowCourier] = useState(false);
    const [filterCourier, setFilterCourier] = useState('');
    // 
    const { refresh } = useSelector(e => e?.config);
    const dp = useDispatch();
    useEffect(() => {
        setIsLoad(false);
        axios(`${API}/admin/get-rejected-orders`, {
            headers: {
                'x-auth-token': `Bearer ${localStorage?.access}`
            }
        }).then(res => {
            const { ok, data, msg, couriers } = res.data;
            setIsLoad(true);
            if (!ok) {
                toast.error(msg);
            } else {
                setOrders(data);
                setCouriers(couriers);
            }
        }).catch(() => {
            toast.error(ERROR_MSG);
            setIsLoad(true);
        });
    }, [refresh]);
    // 
    document.title = `QAYTIB KELGANLAR(${orders?.length})`
    // Selects
    function SelectAll() {
        if (selecteds.length === orders.length) {
            setSelecteds([]);
        } else {
            if (!filterCourier) {
                setSelecteds(orders?.map(o => o?._id));
            } else {
                setSelecteds(orders?.filter(o => o?.courier_id === Number(filterCourier))?.map(o => o?._id))
            }
        }
    }
    function SelectOne(_id) {
        if (selecteds.includes(_id)) {
            setSelecteds(selecteds.filter(o => o !== _id))
        } else {
            setSelecteds([...selecteds, _id])
        }
    }
    // 
    const [status, setStatus] = useState({ open: false, status: '', courier: '' });
    // 
    function SubmitSetStatus() {
        dp(setLoad(true));
        axios.post(`${API}/admin/set-status-to-orders`, {
            orders: selecteds,
            status: status?.status,
            courier: status?.courier
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
                setStatus({ open: false, status: '', courier: '' });
                dp(setRefresh());
            }
        }).catch(() => {
            dp(setLoad(false));
            toast.error(ERROR_MSG);
        })
    }
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalDeliveryPrice, setTotalDeliveryPrice] = useState(0);
    useEffect(() => {
        setSelecteds([]);
        let price = 0;
        let delivery = 0
        orders?.filter(o => !filterCourier ? o : o?.courier_id === Number(filterCourier))?.forEach(o => {
            price += o?.price;
            delivery += o?.delivery_price;
        });
        setTotalPrice(price);
        setTotalDeliveryPrice(delivery);
    }, [orders]);
    // 
    useEffect(() => {
        setSelecteds([]);
        let price = 0;
        let delivery = 0
        orders?.filter(o => !filterCourier ? o : o?.courier_id === Number(filterCourier))?.forEach(o => {
            price += o?.price;
            delivery += o?.delivery_price;
        });
        setTotalPrice(price);
        setTotalDeliveryPrice(delivery);
    }, [filterCourier]);
    // PRINTER
    const printRef = useRef();
    const print = useReactToPrint({
        content: () => printRef.current,
        documentTitle: !filterCourier ? `Selly.uz - ${orders?.length} ta buyurtma` : `${couriers?.find(r => r.id === Number(filterCourier))} - ${orders?.length} ta buyurtma`
    });
    return (
        <div className="flex items-center justify-start flex-col w-full relative">
            {/* INTRO */}
            <p className="uppercase text-white text-[20px] sm:text-[30px] animate-fade-down my-[10px]">YETKAZILGAN</p>
            {/* FILTER */}
            <div className={`flex items-start justify-center flex-col w-[96%] animate-fade-up rounded-[4px_4px_0_0] gap-2 bg-white px-[10px] duration-300 p-[7px] z-[999]`}>
                {/* FILTER REGION */}
                {isLoad &&
                    <div className="flex items-center justify-between w-full gap-2">
                        <div className="flex items-center justify-center w-[80%] sm:w-[90%]">
                            <Select label="Kuryer filteri" onChange={e => setFilterCourier(e)} value={filterCourier} color="indigo">
                                {[{ id: '', name: 'Barchasi' }, ...couriers]?.map(o => (
                                    <Option key={o.id} value={String(o.id)}>{o?.name} <b className="text-indigo-500">{o?.id === '' ? orders?.length : orders?.filter(order => order?.courier_id === o?.id)?.length}</b> ta</Option>
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
                {/* MORE BTN */}
                <Button onClick={() => setShowMore(!showMore)} className="w-full" color={showMore ? 'blue-gray' : 'indigo'}>
                    {showMore ? "Berkitish" : "Ko'proq"}
                </Button>
                <div className={`${showMore ? 'h-[120px]' : 'h-0'} w-full flex-col items-center justify-start duration-300 gap-3 overflow-hidden`}>
                    <div className="flex items-center justify-start overflow-y-hidden overflow-x-scroll w-full scrollbar-hide py-[10px]">
                        <Checkbox id="check-box-courier" className="rounded-full" checked={showCourier} onChange={e => setShowCourier(e.target.checked)} color="green" label={'Kuryer'} />
                        <Checkbox id="check-box-oper" className="rounded-full" checked={showOperator} onChange={e => setShowOperator(e.target.checked)} color="green" label={'Operator'} />
                        <Checkbox id="check-box-seller" className="rounded-full" checked={showSeller} onChange={e => setShowSeller(e.target.checked)} color="green" label={'Sotuvchi'} />
                        <Checkbox id="check-box-supplier" className="rounded-full" checked={showSupplier} onChange={e => setShowSupplier(e.target.checked)} color="green" label={"Ta'minotchi"} />
                        <Checkbox id="check-box-other" className="rounded-full" checked={showOther} onChange={e => setShowOther(e.target.checked)} color="green" label={"Qo'shimcha"} />
                    </div>
                    {/* SET STATUS */}
                    <div className="flex w-full mb-[10px]">
                        <Button onClick={() => setStatus({ open: true, _id: '' })} disabled={!selecteds[0]} className="w-full font-normal flex items-center justify-center gap-2" color="green">
                            <FaNewspaper />
                            Tasdiqlab olish
                            <FaNewspaper />
                        </Button>
                    </div>
                </div>
                {/*  */}
            </div>
            {/* BODY */}
            <div ref={printRef} className="flex items-start justify-start flex-col w-[96%] overflow-x-scroll bg-white p-[10px] rounded-[0_0_4px_4px] animate-fade-up">
                {/* STRUCT */}
                <div className="flex items-center justify-start border border-r-0 border-gray-500">
                    {/* SELECT ALL */}
                    <div className="w-[50px] h-[80px] border-r flex items-center justify-center border-r-gray-500 ">
                        <Checkbox onChange={SelectAll} checked={!filterCourier ? selecteds?.length === orders?.length : selecteds?.length === orders?.filter(o => o?.courier_id === Number(filterCourier))?.length} id="check-all" className="rounded-full" color="indigo" />
                    </div>
                    {/* ID */}
                    <p className="w-[80px] h-[80px] border-r flex items-center justify-center border-r-gray-500 text-[12px]">
                        ID
                    </p>
                    {/* PRODUCT */}
                    <p className="w-[150px] h-[80px] border-r flex items-center justify-center border-r-gray-500 text-[12px]">
                        MAHSULOT
                    </p>
                    {/* PRODUCT IMAGE */}
                    <p className="w-[70px] h-[80px] border-r flex items-center justify-center border-r-gray-500 text-[12px]">
                        RASMI
                    </p>
                    {/* TOTAL PRICE */}
                    <p className="w-[200px] h-[80px] border-r flex items-center flex-col justify-center border-r-gray-500 text-[12px]">
                        SUMMA
                    </p>
                    {showOther &&
                        // {/* CREATED */ }
                        <p className="w-[150px] h-[80px] border-r flex items-center justify-center border-r-gray-500 text-[12px]">
                            SANA
                        </p>
                    }
                    {/* NAME */}
                    <p className="w-[150px] h-[80px] border-r flex items-center justify-center border-r-gray-500 text-[12px] flex-col">
                        <span>BUYURTMACHI</span>
                    </p>
                    {/* REGION */}
                    <p className="w-[150px] h-[80px] border-r flex items-center justify-center border-r-gray-500 text-[12px] text-center flex-col">
                        <span>MANZIL</span>
                    </p>
                    {/* PARTY */}
                    <p className="w-[150px] h-[80px] border-r flex items-center justify-center border-r-gray-500 text-[12px] text-center flex-col">
                        <span>PARTIYA</span>
                    </p>
                    {/* COMMENT */}
                    <p className="w-[200px] h-[80px] border-r flex items-center justify-center border-r-gray-500 text-[12px] text-center">
                        IZOH
                    </p>
                    {showCourier &&
                        <>
                            {/* COURIER NAME */}
                            <p className="w-[150px] h-[80px] border-r flex items-center justify-center border-r-gray-500 text-[12px]">
                                KURYER
                            </p>
                            {/* COURIER ID */}
                            <p className="w-[150px] h-[80px] border-r flex items-center justify-center border-r-gray-500 text-[12px]">
                                KURYER - ID
                            </p>
                            {/* COURIER PHONE */}
                            <p className="w-[150px] h-[80px] border-r flex items-center justify-center border-r-gray-500 text-[12px]">
                                KURYER RAQAMI
                            </p>
                        </>
                    }
                    {showOperator &&
                        <>
                            {/* OPERATOR NAME */}
                            <p className="w-[150px] h-[80px] border-r flex items-center justify-center border-r-gray-500 text-[12px]">
                                OPERATOR
                            </p>
                            {/* OPERATOR ID */}
                            <p className="w-[150px] h-[80px] border-r flex items-center justify-center border-r-gray-500 text-[12px]">
                                OPERATOR - ID
                            </p>
                            {/* OPERATOR PHONE */}
                            <p className="w-[150px] h-[80px] border-r flex items-center justify-center border-r-gray-500 text-[12px]">
                                OPERATOR RAQAMI
                            </p>
                        </>
                    }
                    {showSeller &&
                        <>
                            {/* SELLER */}
                            <p className="w-[150px] h-[80px] border-r flex items-center justify-center border-r-gray-500 text-[12px]">
                                SOTUVCHI
                            </p>
                            {/* SELLER ID */}
                            <p className="w-[150px] h-[80px] border-r flex items-center justify-center border-r-gray-500 text-[12px]">
                                SOTUVCHI - ID
                            </p>
                            {/* SELLER PHONE */}
                            <p className="w-[150px] h-[80px] border-r flex items-center justify-center border-r-gray-500 text-[12px] text-center">
                                SOTUVCHI RAQAMI
                            </p>
                        </>
                    }
                    {showSupplier &&
                        <>
                            {/* SUPPLIER */}
                            <p className="w-[150px] h-[80px] border-r flex items-center justify-center border-r-gray-500 text-[12px]">
                                TA'MINOTCHI
                            </p>
                            {/* SUPPLIER ID */}
                            <p className="w-[150px] h-[80px] border-r flex items-center justify-center border-r-gray-500 text-[12px]">
                                TA'MINOTCHI - ID
                            </p>
                            {/* SUPPLIER PHONE */}
                            <p className="w-[150px] h-[80px] border-r flex items-center justify-center border-r-gray-500 text-[12px] text-center">
                                TA'MINOTCHI RAQAMI
                            </p>
                        </>
                    }
                    {showOther &&
                        <>
                            {/* STREAM ID */}
                            <p className="w-[120px] h-[80px] border-r flex items-center justify-center border-r-gray-500 text-[12px] text-center">
                                OQIM - ID
                            </p>
                            {/* COMISSION */}
                            <p className="w-[150px] h-[80px] border-r flex items-center justify-center border-r-gray-500 text-[12px] text-center">
                                KOMISSIYA( SO'M )
                            </p>
                        </>
                    }
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
                        <p>Buyurtmalar mavud emas : (</p>
                    </div>
                }
                {isLoad && orders[0] &&
                    orders?.filter(o => !filterCourier ? o : String(o?.courier_id) === filterCourier)?.map((o, i) => {
                        return (
                            <div key={i} className="flex items-center justify-start border-t-0 border border-r-0 border-gray-500">
                                {/* SELECT ALL */}
                                <div className="w-[50px] h-[80px] border-r flex items-center justify-center border-r-gray-500 ">
                                    <Checkbox onChange={() => SelectOne(o?._id)} checked={selecteds?.includes(o?._id)} id={'check-' + i} className="rounded-full" color="indigo" />
                                </div>
                                {/* ID */}
                                <p className="w-[80px] h-[80px] border-r flex items-center justify-center border-r-gray-500 text-[12px]">
                                    {o?.id}
                                </p>
                                {/* PRODUCT */}
                                <p className="w-[150px] h-[80px] border-r flex items-center justify-center border-r-gray-500 text-[12px] text-center flex-col">
                                    <span>{o?.title}</span>
                                    <span>{o?.value} ta</span>
                                </p>
                                {/* PRODUCT IMAGE */}
                                <div className="w-[70px] h-[80px] border-r flex items-center justify-center border-r-gray-500 ">
                                    <div className="flex overflow-hidden items-center justify-center w-[45px] h-[45px] rounded-full border-blue-gray-500">
                                        <img src={o?.image} alt="o_img" />
                                    </div>
                                </div>
                                {/* TOTAL PRICE */}
                                <p className="w-[200px] h-[80px] border-r flex items-center flex-col justify-center border-r-gray-500 text-[12px]">
                                    <span>Mahsulot: {Number(o?.price)?.toLocaleString()} so'm</span>
                                    <span>Yetkazib berish: {Number(o?.delivery_price)?.toLocaleString()} so'm</span>
                                    <span>Umumiy: {Number(o?.price + o?.delivery_price)?.toLocaleString()} so'm</span>
                                </p>
                                {/* CREATED */}
                                {showOther &&
                                    <p className="w-[150px] h-[80px] border-r flex items-center justify-center border-r-gray-500 text-[12px]">
                                        {o?.created}
                                    </p>
                                }
                                {/* NAME */}
                                <p className="w-[150px] h-[80px] border-r flex items-center justify-center border-r-gray-500 text-[12px] flex-col">
                                    <span>{o?.name}</span>
                                    <span>{o?.phone}</span>
                                </p>
                                {/* REGION */}
                                <p className="w-[150px] h-[80px] border-r flex items-center justify-center border-r-gray-500 text-[12px] text-center">
                                    {Regions?.find(r => r?.id === o?.region)?.name} - {o?.city}
                                </p>
                                {/* PARTY */}
                                <p className="w-[150px] h-[80px] border-r flex items-center justify-center border-r-gray-500 text-[12px] text-center flex-col">
                                    <span>{o?.party}</span>
                                </p>
                                {/* COMMENT */}
                                <p className="w-[200px] h-[80px] border-r flex items-center justify-center overflow-hidden border-r-gray-500 text-[12px] text-center">
                                    {o?.comment}
                                </p>
                                {showCourier &&
                                    <>
                                        {/* COURIER NAME */}
                                        <p className="w-[150px] h-[80px] border-r flex items-center justify-center border-r-gray-500 text-[12px]">
                                            {o?.courier}
                                        </p>
                                        {/* COURIER ID */}
                                        <p className="w-[150px] h-[80px] border-r flex items-center justify-center border-r-gray-500 text-[12px]">
                                            {o?.courier_id}
                                        </p>
                                        {/* COURIER PHONE */}
                                        <p className="w-[150px] h-[80px] border-r flex items-center justify-center border-r-gray-500 text-[12px]">
                                            {o?.courier_phone}
                                        </p>
                                    </>
                                }
                                {showOperator &&
                                    <>
                                        {/* OPERATOR NAME */}
                                        <p className="w-[150px] h-[80px] border-r flex items-center justify-center border-r-gray-500 text-[12px]">
                                            {o?.operator}
                                        </p>
                                        {/* OPERATOR ID */}
                                        <p className="w-[150px] h-[80px] border-r flex items-center justify-center border-r-gray-500 text-[12px]">
                                            {o?.operator_id}
                                        </p>
                                        {/* OPERATOR PHONE */}
                                        <p className="w-[150px] h-[80px] border-r flex items-center justify-center border-r-gray-500 text-[12px]">
                                            {o?.operator_phone}
                                        </p>
                                    </>
                                }
                                {showSeller &&
                                    <>
                                        {/* SELLER */}
                                        <p className="w-[150px] h-[80px] border-r flex items-center justify-center border-r-gray-500 text-[12px]">
                                            {o?.seller}
                                        </p>
                                        {/* SELLER ID */}
                                        <p className="w-[150px] h-[80px] border-r flex items-center justify-center border-r-gray-500 text-[12px]">
                                            {o?.seller_id}
                                        </p>
                                        {/* SELLER PHONE */}
                                        <p className="w-[150px] h-[80px] border-r flex items-center justify-center border-r-gray-500 text-[12px] text-center">
                                            {o?.seller_phone}
                                        </p>
                                    </>
                                }
                                {showSupplier &&
                                    <>
                                        {/* SUPPLIER */}
                                        <p className="w-[150px] h-[80px] border-r flex items-center justify-center border-r-gray-500 text-[12px]">
                                            {o?.supplier}
                                        </p>
                                        {/* SUPPLIER ID */}
                                        <p className="w-[150px] h-[80px] border-r flex items-center justify-center border-r-gray-500 text-[12px]">
                                            {o?.supplier_id}
                                        </p>
                                        {/* SUPPLIER PHONE */}
                                        <p className="w-[150px] h-[80px] border-r flex items-center justify-center border-r-gray-500 text-[12px] text-center">
                                            {o?.supplier_phone}
                                        </p>
                                    </>
                                }
                                {showOther &&
                                    <>
                                        {/* STREAM ID */}
                                        <p className="w-[120px] h-[80px] border-r flex items-center justify-center border-r-gray-500 text-[12px] text-center">
                                            {o?.stream_id}
                                        </p>
                                        {/* COMISSION */}
                                        <p className="w-[150px] h-[80px] border-r flex items-center justify-center border-r-gray-500 text-[12px] text-center">
                                            {Number(o?.comission)?.toLocaleString()}
                                        </p>
                                    </>
                                }
                            </div>
                        )
                    })
                }
                <p className="text-[14px]">Dostavka uchun umumiy: {totalDeliveryPrice?.toLocaleString()} so'm</p>
                <p className="text-[14px]">Kompaniya uchun umumiy: {totalPrice?.toLocaleString()} so'm</p>
                <p className="text-[14px]">Umumiy narx: {(totalPrice + totalDeliveryPrice)?.toLocaleString()} so'm</p>
            </div>
            {/* SELECT STATUS */}
            <Dialog open={status?.open} size="md">
                <DialogHeader className="flex items-start justify-start flex-col">
                    <p className="text-[12px] font-normal">Status biriktirish</p>
                    <p className="text-[12px] font-normal">Buyurtmalar: <b>{selecteds?.length}</b> ta</p>
                </DialogHeader>
                <DialogBody className="border-y">
                    <div className="w-full mb-[10px]">
                        <Select onChange={e => setStatus({ ...status, status: e })} value={status?.status} color="indigo" label="Status tanlang">
                            <Option value="reject">Bekor qilingan / Qaytib kelgan</Option>
                            <Option value="delivered">Yetkazilgan / Topshirilgan</Option>
                        </Select>
                    </div>
                </DialogBody>
                <DialogFooter className="gap-2">
                    <Button onClick={() => setStatus({ open: false, status: '' })} color="indigo">
                        Ortga
                    </Button>
                    <IconButton className="text-[16px]" onClick={() => status?.status && SubmitSetStatus()} disabled={!status?.status}>
                        <FaSave />
                    </IconButton>
                </DialogFooter>
            </Dialog>
        </div >
    );
}

export default AdminGetRejectedOrders;