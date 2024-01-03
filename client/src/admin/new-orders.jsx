import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API, ERROR_MSG } from '../config'
import toast from "react-hot-toast";
import { Button, Checkbox, Dialog, DialogBody, DialogFooter, DialogHeader, IconButton, Option, Select, Spinner } from "@material-tailwind/react";
import { FaNewspaper, FaPhone, FaSave } from "react-icons/fa";
import { FaTruckFast } from "react-icons/fa6";
import Regions from '../assets/regions.json';
import { setLoad, setRefresh } from "../managers/config.manager";
function AdminNewOrders() {
    const [isLoad, setIsLoad] = useState(false);
    const [orders, setOrders] = useState([]);
    const [selecteds, setSelecteds] = useState([]);
    const [operators, setOperators] = useState([]);
    const [couriers, setCouriers] = useState([]);
    const [showSeller, setShowSeller] = useState(false);
    const [showSupplier, setShowSupplier] = useState(false);
    const [showOther, setShowOther] = useState(false);
    const [showMore, setShowMore] = useState(false);
    // 
    const { refresh } = useSelector(e => e?.config);
    const dp = useDispatch();
    useEffect(() => {
        setIsLoad(false);
        axios(`${API}/admin/get-new-orders`, {
            headers: {
                'x-auth-token': `Bearer ${localStorage?.access}`
            }
        }).then(res => {
            const { ok, data, msg, operators, couriers } = res.data;
            setIsLoad(true);
            if (!ok) {
                toast.error(msg);
            } else {
                setOrders(data);
                setOperators(operators);
                setCouriers(couriers);
            }
        }).catch(() => {
            toast.error(ERROR_MSG);
            setIsLoad(true);
        });
    }, [refresh]);
    document.title = `YANGI BUYURTMALAR(${orders?.length})`
    // Selects
    function SelectAll() {
        if (selecteds.length === orders.length) {
            setSelecteds([]);
        } else {
            setSelecteds(orders?.map(o => o?._id))
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
    const [operator, setOperator] = useState({ open: false, _id: '' });
    const [courier, setCourier] = useState({ open: false, _id: '' });
    const [status, setStatus] = useState({ open: false, status: '', courier: '' });
    // 
    function SubmitSetOperator() {
        dp(setLoad(true));
        axios.post(`${API}/admin/set-operator-to-orders`, {
            orders: selecteds,
            _id: operator?._id
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
                setOperator({ _id: '', open: false })
                dp(setRefresh());
            }
        }).catch(() => {
            dp(setLoad(false));
            toast.error(ERROR_MSG);
        })
    }
    function SubmitSetCourier() {
        dp(setLoad(true));
        axios.post(`${API}/admin/set-courier-to-orders`, {
            orders: selecteds,
            _id: courier?._id
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
                setCourier({ _id: '', open: false })
                dp(setRefresh());
            }
        }).catch(() => {
            dp(setLoad(false));
            toast.error(ERROR_MSG);
        })
    }
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
    return (
        <div className="flex items-center justify-start flex-col w-full relative">
            {/* INTRO */}
            <p className="uppercase text-white text-[20px] sm:text-[30px] animate-fade-down my-[10px]">Yangi buyurtmalar</p>
            {/* FILTER */}
            <div className={`flex items-start justify-center flex-col w-[96%] animate-fade-up rounded-[4px_4px_0_0] gap-2 bg-white px-[10px] overflow-y-hidden duration-300 p-[5px]`}>
                {/* MORE BTN */}
                <Button onClick={() => setShowMore(!showMore)} className="w-full" color={showMore ? 'blue-gray' : 'indigo'}>
                    {showMore ? "Berkitish" : "Ko'proq"}
                </Button>
                <div className={`${showMore ? 'h-[200px]' : 'h-0'} w-full flex-col items-center justify-start duration-300 gap-3`}>
                    <div className="flex items-center justify-start overflow-y-hidden overflow-x-scroll w-full scrollbar-hide py-[10px]">
                        <Checkbox id="check-box-seller" className="rounded-full" checked={showSeller} onChange={e => setShowSeller(e.target.checked)} color="green" label={'Sotuvchi'} />
                        <Checkbox id="check-box-supplier" className="rounded-full" checked={showSupplier} onChange={e => setShowSupplier(e.target.checked)} color="green" label={"Ta'minotchi"} />
                        <Checkbox id="check-box-other" className="rounded-full" checked={showOther} onChange={e => setShowOther(e.target.checked)} color="green" label={"Qo'shimcha"} />
                    </div>
                    {/* SET OPERATOR */}
                    <div className="flex w-full mb-[10px]">
                        <Button onClick={() => setOperator({ open: true, _id: '' })} disabled={!selecteds[0]} className="w-full font-normal flex items-center justify-center gap-2">
                            <FaPhone />
                            Operator biriktirish
                            <FaPhone />
                        </Button>
                    </div>
                    {/* SET COURIER */}
                    <div className="flex w-full mb-[10px]">
                        <Button onClick={() => setCourier({ open: true, _id: '' })} disabled={!selecteds[0]} className="w-full font-normal flex items-center justify-center gap-2" color="indigo">
                            <FaTruckFast />
                            Kuryer biriktirish
                            <FaTruckFast />
                        </Button>
                    </div>
                    {/* SET STATUS */}
                    <div className="flex w-full mb-[10px]">
                        <Button onClick={() => setStatus({ open: true, _id: '' })} disabled={!selecteds[0]} className="w-full font-normal flex items-center justify-center gap-2" color="green">
                            <FaNewspaper />
                            Status biriktirish
                            <FaNewspaper />
                        </Button>
                    </div>
                </div>
                {/*  */}
            </div>
            {/* BODY */}
            <div className="flex items-start justify-start flex-col w-[96%] overflow-x-scroll bg-white p-[10px] rounded-[0_0_4px_4px] animate-fade-up">
                {/* STRUCT */}
                <div className="flex items-center justify-start border border-r-0 border-gray-500">
                    {/* SELECT ALL */}
                    <div className="w-[50px] h-[50px] border-r flex items-center justify-center border-r-gray-500 ">
                        <Checkbox onChange={SelectAll} checked={selecteds?.length === orders?.length} id="check-all" className="rounded-full" color="indigo" />
                    </div>
                    {/* ID */}
                    <p className="w-[80px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">
                        ID
                    </p>
                    {/* PRODUCT */}
                    <p className="w-[150px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">
                        MAHSULOT
                    </p>
                    {/* PRODUCT IMAGE */}
                    <p className="w-[70px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">
                        RASMI
                    </p>
                    {/* PRODUCT VALUE */}
                    <p className="w-[120px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">
                        SONI
                    </p>
                    {/* PRODUCT PRICE */}
                    <p className="w-[150px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">
                        NARXI( SO'M )
                    </p>
                    {/* CREATED */}
                    <p className="w-[150px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">
                        SANA
                    </p>
                    {/* NAME */}
                    <p className="w-[150px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">
                        BUYURTMACHI
                    </p>
                    {/* PHONE */}
                    <p className="w-[150px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">
                        RAQAMI
                    </p>
                    {showSeller &&
                        <>
                            {/* SELLER */}
                            <p className="w-[150px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">
                                SOTUVCHI
                            </p>
                            {/* SELLER ID */}
                            <p className="w-[150px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">
                                SOTUVCHI - ID
                            </p>
                            {/* SELLER PHONE */}
                            <p className="w-[150px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px] text-center">
                                SOTUVCHI RAQAMI
                            </p>
                        </>
                    }
                    {showSupplier &&
                        <>
                            {/* SUPPLIER */}
                            <p className="w-[150px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">
                                TA'MINOTCHI
                            </p>
                            {/* SUPPLIER ID */}
                            <p className="w-[150px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">
                                TA'MINOTCHI - ID
                            </p>
                            {/* SUPPLIER PHONE */}
                            <p className="w-[150px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px] text-center">
                                TA'MINOTCHI RAQAMI
                            </p>
                        </>
                    }
                    {showOther &&
                        <>
                            {/* STREAM ID */}
                            <p className="w-[120px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px] text-center">
                                OQIM - ID
                            </p>
                            {/* COMISSION */}
                            <p className="w-[150px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px] text-center">
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
                    orders?.map((o, i) => {
                        return (
                            <div key={i} className="flex items-center justify-start border-t-0 border border-r-0 border-gray-500">
                                {/* SELECT ALL */}
                                <div className="w-[50px] h-[80px] border-r flex items-center justify-center border-r-gray-500 ">
                                    <Checkbox onChange={() => SelectOne(o?._id)} checked={selecteds?.includes(o?._id)} id={'check-' + i} className="rounded-full" color="indigo" />
                                </div>
                                {/* ID */}
                                <p className="w-[80px] h-[80px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">
                                    {o?.id}
                                </p>
                                {/* PRODUCT */}
                                <p className="w-[150px] h-[80px] border-r flex items-center justify-center border-r-gray-500 text-[14px] text-center">
                                    {o?.title}
                                </p>
                                {/* PRODUCT IMAGE */}
                                <div className="w-[70px] h-[80px] border-r flex items-center justify-center border-r-gray-500 ">
                                    <div className="flex overflow-hidden items-center justify-center w-[45px] h-[45px] rounded-full border-blue-gray-500">
                                        <img src={o?.image} alt="" />
                                    </div>
                                </div>
                                {/* PRODUCT VALUE */}
                                <p className="w-[120px] h-[80px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">
                                    {o?.value}
                                </p>
                                {/* PRODUCT PRICE */}
                                <p className="w-[150px] h-[80px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">
                                    {Number(o?.price)?.toLocaleString()}
                                </p>
                                {/* CREATED */}
                                <p className="w-[150px] h-[80px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">
                                    {o?.created}
                                </p>
                                {/* NAME */}
                                <p className="w-[150px] h-[80px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">
                                    {o?.name}
                                </p>
                                {/* PHONE */}
                                <p className="w-[150px] h-[80px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">
                                    {o?.phone}
                                </p>
                                {showSeller &&
                                    <>
                                        {/* SELLER */}
                                        <p className="w-[150px] h-[80px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">
                                            {o?.seller}
                                        </p>
                                        {/* SELLER ID */}
                                        <p className="w-[150px] h-[80px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">
                                            {o?.seller_id}
                                        </p>
                                        {/* SELLER PHONE */}
                                        <p className="w-[150px] h-[80px] border-r flex items-center justify-center border-r-gray-500 text-[14px] text-center">
                                            {o?.seller_phone}
                                        </p>
                                    </>
                                }
                                {showSupplier &&
                                    <>
                                        {/* SUPPLIER */}
                                        <p className="w-[150px] h-[80px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">
                                            {o?.supplier}
                                        </p>
                                        {/* SUPPLIER ID */}
                                        <p className="w-[150px] h-[80px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">
                                            {o?.supplier_id}
                                        </p>
                                        {/* SUPPLIER PHONE */}
                                        <p className="w-[150px] h-[80px] border-r flex items-center justify-center border-r-gray-500 text-[14px] text-center">
                                            {o?.supplier_phone}
                                        </p>
                                    </>
                                }
                                {showOther &&
                                    <>
                                        {/* STREAM ID */}
                                        <p className="w-[120px] h-[80px] border-r flex items-center justify-center border-r-gray-500 text-[14px] text-center">
                                            {o?.stream_id}
                                        </p>
                                        {/* COMISSION */}
                                        <p className="w-[150px] h-[80px] border-r flex items-center justify-center border-r-gray-500 text-[14px] text-center">
                                            {Number(o?.comission)?.toLocaleString()}
                                        </p>
                                    </>
                                }
                            </div>
                        )
                    })
                }

            </div>
            {/* SELECT OPERATOR */}
            <Dialog open={operator?.open} size="md">
                <DialogHeader className="flex items-start justify-start flex-col">
                    <p className="text-[14px] font-normal">Operator biriktirish</p>
                    <p className="text-[14px] font-normal">Buyurtmalar: <b>{selecteds?.length}</b> ta</p>
                </DialogHeader>
                <DialogBody className="border-y">
                    <Select onChange={e => setOperator({ ...operator, _id: e })} value={operator?._id} color="indigo" label="Operator tanlang">
                        {operators?.map((o, i) => {
                            return (
                                <Option key={i} value={o?._id}>ID: {o?.id} | {o?.name} | {o?.phone}</Option>
                            )
                        })}
                    </Select>
                </DialogBody>
                <DialogFooter className="gap-2">
                    <Button onClick={() => setOperator({ open: false, _id: '' })} color="indigo">
                        Ortga
                    </Button>
                    <IconButton className="text-[16px]" onClick={() => operator?._id && SubmitSetOperator()} disabled={!operator?._id}>
                        <FaSave />
                    </IconButton>
                </DialogFooter>
            </Dialog>
            {/* SELECT COURIER */}
            <Dialog open={courier?.open} size="md">
                <DialogHeader className="flex items-start justify-start flex-col">
                    <p className="text-[14px] font-normal">Kuryer biriktirish</p>
                    <p className="text-[14px] font-normal">Buyurtmalar: <b>{selecteds?.length}</b> ta</p>
                </DialogHeader>
                <DialogBody className="border-y">
                    <Select onChange={e => setCourier({ ...courier, _id: e })} value={courier?._id} color="indigo" label="Kuryer tanlang">
                        {couriers?.map((c, i) => {
                            return (
                                <Option key={i} value={c?._id}>ID: {c?.id} | {c?.name} | {c?.phone} | {Regions?.find(r => r?.id === c?.region)?.name}</Option>
                            )
                        })}
                    </Select>
                </DialogBody>
                <DialogFooter className="gap-2">
                    <Button onClick={() => setCourier({ open: false, _id: '' })} color="indigo">
                        Ortga
                    </Button>
                    <IconButton className="text-[16px]" onClick={() => courier?._id && SubmitSetCourier()} disabled={!courier?._id}>
                        <FaSave />
                    </IconButton>
                </DialogFooter>
            </Dialog>
            {/* SELECT STATUS */}
            <Dialog open={status?.open} size="md">
                <DialogHeader className="flex items-start justify-start flex-col">
                    <p className="text-[14px] font-normal">Status biriktirish</p>
                    <p className="text-[14px] font-normal">Buyurtmalar: <b>{selecteds?.length}</b> ta</p>
                </DialogHeader>
                <DialogBody className="border-y">
                    <div className="w-full mb-[10px]">
                        <Select onChange={e => setStatus({ ...status, status: e })} value={status?.status} color="indigo" label="Status tanlang">
                            <Option value="copy">Kopiya / Dublikat</Option>
                            <Option value="reject">Bekor qilingan</Option>
                            <Option value="archive">Arxiv</Option>
                            <Option value="recontact">Qayta aloqa</Option>
                            <Option value="new">Yangi</Option>
                            <Option value="success">Upakovkada</Option>
                            <Option value="sended">Yetkazilmoqda</Option>
                            <Option value="delivered">Yetkazilgan</Option>
                        </Select>
                    </div>
                    {status?.status === 'sended' &&
                        <div className="w-full">
                            <Select onChange={e => setStatus({ ...status, courier: e })} value={status?.courier} color="indigo" label="Kuryer tanlang">
                                {couriers?.map((c, i) => {
                                    return (
                                        <Option key={i} value={c?._id}>ID: {c?.id} | {c?.name} | {c?.phone} | {Regions?.find(r => r?.id === c?.region)?.name}</Option>
                                    )
                                })}
                            </Select>
                        </div>
                    }
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

        </div>
    );
}
export default AdminNewOrders;