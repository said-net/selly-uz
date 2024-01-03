import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API, ERROR_MSG } from '../config'
import toast from "react-hot-toast";
import { Button, Checkbox, Chip, Dialog, DialogBody, DialogFooter, DialogHeader, IconButton, Input, Menu, MenuHandler, MenuItem, MenuList, Option, Select } from "@material-tailwind/react";
import { FaBox, FaComment, FaEdit, FaLocationArrow, FaMoneyBill, FaNewspaper, FaPhone, FaSave, FaSearch, FaUser } from "react-icons/fa";
import { FaTruckFast } from "react-icons/fa6";
import Regions from '../assets/regions.json';
import { setLoad, setRefresh } from "../managers/config.manager";
import { BiDotsVertical } from "react-icons/bi";
function AdminSearchOrder() {
    const [isLoad, setIsLoad] = useState(false);
    const [orders, setOrders] = useState([]);
    const [selecteds, setSelecteds] = useState([]);
    const [parties, setParties] = useState([]);
    const [operators, setOperators] = useState([]);
    const [couriers, setCouriers] = useState([]);
    const [showSeller, setShowSeller] = useState(false);
    const [showOperator, setShowOperator] = useState(false);
    const [showSupplier, setShowSupplier] = useState(false);
    const [showOther, setShowOther] = useState(false);
    const [showMore, setShowMore] = useState(false);
    const [showCourier, setShowCourier] = useState(false);
    // 
    const [param, setParam] = useState('');
    const [type, setType] = useState('id');
    // 
    const { refresh } = useSelector(e => e?.config);
    const [run, setRun] = useState(false);
    const dp = useDispatch();

    useEffect(() => {
        if (param) {
            setIsLoad(false);
            axios(`${API}/admin/search-order/${type}/${param}`, {
                headers: {
                    'x-auth-token': `Bearer ${localStorage?.access}`
                }
            }).then(res => {
                const { ok, data, msg, operators, couriers, parties } = res.data;
                setIsLoad(true);
                if (!ok) {
                    toast.error(msg);
                } else {
                    setOrders(data);
                    setOperators(operators);
                    setCouriers(couriers);
                    setParties(parties);
                }
            }).catch(() => {
                toast.error(ERROR_MSG);
                setIsLoad(true);
            });
        }
    }, [refresh]);
    useEffect(() => {
        if (param) {
            setIsLoad(false);
            axios(`${API}/admin/search-order/${type}/${param}`, {
                headers: {
                    'x-auth-token': `Bearer ${localStorage?.access}`
                }
            }).then(res => {
                const { ok, data, msg, operators, couriers, parties } = res.data;
                setIsLoad(true);
                if (!ok) {
                    toast.error(msg);
                } else {
                    setOrders(data);
                    setOperators(operators);
                    setCouriers(couriers);
                    setParties(parties);
                }
            }).catch(() => {
                toast.error(ERROR_MSG);
                setIsLoad(true);
            });
        }
    }, [run]);
    document.title = `QIDIRUV: ${param}`
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
    // 
    function getStatus(s) {
        if (s === 'reject') {
            return <Chip className="w-[90%] flex items-center justify-center rounded font-[comfortaa] font-normal" value="Bekor qilingan" color="red" />
        } else if (s === 'archive') {
            return <Chip className="w-[90%] flex items-center justify-center rounded font-[comfortaa] font-normal" value="Arxivlangan" color="orange" />
        } else if (s === 'copy') {
            return <Chip className="w-[90%] flex items-center justify-center rounded font-[comfortaa] font-normal" value="Kopiya" color="red" />
        } else if (s === 'recontact') {
            return <Chip className="w-[90%] flex items-center justify-center rounded font-[comfortaa] font-normal" value="Qayta aloqa" color="deep-orange" />
        } else if (s === 'new') {
            return <Chip className="w-[90%] flex items-center justify-center rounded font-[comfortaa] font-normal" value="Yangi" color="light-blue" />
        } else if (s === 'success') {
            return <Chip className="w-[90%] flex items-center justify-center rounded font-[comfortaa] font-normal" value="Qadoqlashda" color="blue" />
        } else if (s === 'sended') {
            return <Chip className="w-[90%] flex items-center justify-center rounded font-[comfortaa] font-normal" value="Yuborilgan" color="purple" />
        } else if (s === 'delivered') {
            return <Chip className="w-[90%] flex items-center justify-center rounded font-[comfortaa] font-normal" value="Yetkazilgan" color="green" />
        }
    }
    useEffect(() => {
        if (param < 1) {
            setOrders([]);
        }
    }, [param]);
    // 
    const [edit, setEdit] = useState({ _id: '', id: '', price: '', delivery_price: '', party_id: '', city: '', comment: '', name: '', phone: '', type: '', oldPrice: '', value: '' });
    function CloseEdit() {
        setEdit({ _id: '', id: '', price: '', delivery_price: '', party_id: '', city: '', comment: '', name: '', phone: '', type: '', oldPrice: '', value: '' });
    }
    function SubmitSetParty() {
        dp(setLoad(true));
        axios.put(`${API}/admin/edit-party`, {
            _id: edit?._id,
            party_id: edit?.party_id
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
                CloseEdit();
                dp(setRefresh());
            }
        }).catch(() => {
            dp(setLoad(false));
            toast.error(ERROR_MSG);
        })
    }
    function SubmitSetInfo() {
        dp(setLoad(true));
        const {price, value, delivery_price, city, comment, name, phone, _id} = edit;
        axios.put(`${API}/admin/edit-info-order`, {
            _id,
            name, 
            phone,
            comment,
            city,
            price,
            delivery_price,
            value
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
                CloseEdit();
                dp(setRefresh());
            }
        }).catch(() => {
            dp(setLoad(false));
            toast.error(ERROR_MSG);
        })
    }
    // 
    return (
        <div className="flex items-center justify-start flex-col w-full relative">
            {/* INTRO */}
            <p className="uppercase text-white text-[20px] sm:text-[30px] animate-fade-down my-[10px]">QIDIRUV</p>
            {/* FILTER */}
            <div className={`flex items-start justify-center flex-col w-[96%] animate-fade-up rounded-[4px_4px_0_0] gap-2 bg-white px-[10px] duration-300 p-[7px] z-[999]`}>
                {/* SEARCH */}
                <div className="flex items-center justify-center w-full flex-col">
                    <div className="flex items-center justify-center relative w-full mb-[5px]">
                        <Input onKeyPress={(k) => k?.key === 'Enter' && setRun(!run)} type="tel" color="indigo" onChange={e => setParam(e.target.value)} value={param} label={`Qidiruv: ${type === 'id' ? "ID" : "Raqam"}`} />
                        <div className="absolute right-[0px]">
                            <Button color="indigo" className="px-[10px] py-[12px] rounded-s-none" onClick={() => setType(type === 'id' ? 'phone' : 'id')}>
                                {type === 'id' &&
                                    'ID → Raqam'
                                }
                                {type === 'phone' &&
                                    'Raqam → ID'
                                }
                            </Button>
                        </div>
                    </div>
                    <Button onClick={() => setRun(!run)} disabled={type === 'id' ? param < 1 : param < 1000} className="w-full flex items-center justify-center gap-2">
                        <FaSearch />
                        Qidirish
                        <FaSearch className="rotate-90" />
                    </Button>
                </div>
                {/* MORE BTN */}
                <Button onClick={() => setShowMore(!showMore)} className="w-full" color={showMore ? 'blue-gray' : 'indigo'}>
                    {showMore ? "Berkitish" : "Ko'proq"}
                </Button>
                <div className={`${showMore ? 'h-[200px]' : 'h-0'} w-full flex-col items-center justify-start duration-300 gap-3 overflow-hidden`}>
                    <div className="flex items-center justify-start overflow-y-hidden overflow-x-scroll w-full scrollbar-hide py-[10px]">
                        <Checkbox id="check-box-courier" className="rounded-full" checked={showCourier} onChange={e => setShowCourier(e.target.checked)} color="green" label={'Kuryer'} />
                        <Checkbox id="check-box-oper" className="rounded-full" checked={showOperator} onChange={e => setShowOperator(e.target.checked)} color="green" label={'Operator'} />
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
            <div className="flex items-start justify-start flex-col w-[96%] overflow-scroll bg-white p-[10px] rounded-[0_0_4px_4px] animate-fade-up h-[70vh]">
                {/* STRUCT */}
                <div className="flex items-center justify-start border border-r-0 border-gray-500">
                    {/* SELECT ALL */}
                    <div className="w-[50px] h-[50px] border-r flex items-center justify-center border-r-gray-500 ">
                        <Checkbox onChange={SelectAll} checked={selecteds?.length === orders?.length} id="check-all" className="rounded-full" color="indigo" />
                    </div>
                    {/* ACTION */}
                    <div className="w-[70px] h-[50px] border-r flex items-center justify-center border-r-gray-500 ">
                        ACTION
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
                    {/* STATUS */}
                    <p className="w-[150px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">
                        HOLAT
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
                    {showOther &&
                        // {/* REGION CITY */}
                        <p className="w-[200px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">
                            MANZILI
                        </p>
                    }
                    {/* COMMENT */}
                    <p className="w-[200px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px] text-center">
                        IZOH
                    </p>
                    {showCourier &&
                        <>
                            {/* COURIER NAME */}
                            <p className="w-[150px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[12px]">
                                KURYER
                            </p>
                            {/* COURIER ID */}
                            <p className="w-[150px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[12px]">
                                KURYER - ID
                            </p>
                            {/* COURIER PHONE */}
                            <p className="w-[150px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[12px]">
                                KURYER RAQAMI
                            </p>
                            {/* PARTY ID */}
                            <p className="w-[150px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[12px]">
                                PARTIYA - ID
                            </p>
                            {/* PARTY PHONE */}
                            <p className="w-[150px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[12px]">
                                YUBORILGAN SANA
                            </p>
                        </>
                    }
                    {showOperator &&
                        <>
                            {/* OPERATOR NAME */}
                            <p className="w-[150px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">
                                OPERATOR
                            </p>
                            {/* OPERATOR ID */}
                            <p className="w-[150px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">
                                OPERATOR - ID
                            </p>
                            {/* OPERATOR PHONE */}
                            <p className="w-[150px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">
                                OPERATOR RAQAMI
                            </p>
                        </>
                    }
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
                {!isLoad && !orders[0] &&
                    <div className="flex items-center justify-center w-full gap-3 h-[50vh]">
                        <p className="text-center">Buyurtma ID si yoki Buyurtmachi raqami bo'yicha qidiruv</p>
                    </div>
                }
                {isLoad && !orders[0] &&
                    <div className="flex items-center justify-center w-full gap-3 h-[50vh]">
                        <p className="text-center">Buyurtmalar mavud emas : (</p>
                    </div>
                }
                {param && isLoad && orders[0] &&
                    orders?.map((o, i) => {
                        return (
                            <div key={i} className="flex items-center justify-start border-t-0 border border-r-0 border-gray-500">
                                {/* SELECT ALL */}
                                <div className="w-[50px] h-[50px] border-r flex items-center justify-center border-r-gray-500 ">
                                    <Checkbox onChange={() => SelectOne(o?._id)} checked={selecteds?.includes(o?._id)} id={'check-' + i} className="rounded-full" color="indigo" />
                                </div>
                                {/* ACTION */}
                                <div className="w-[70px] h-[50px] border-r flex items-center justify-center border-r-gray-500 ">
                                    <Menu placement="bottom-start">
                                        <MenuHandler>
                                            <IconButton className="text-[20px] rounded-full" color="blue-gray">
                                                <BiDotsVertical />
                                            </IconButton>
                                        </MenuHandler>
                                        <MenuList>
                                            <MenuItem onClick={() => setEdit({ ...edit, _id: o?._id, id: o?.id, type: 'party' })} className={"items-center justify-start gap-2 text-blue-500 " + (o?.status === 'delivered' || o?.status === 'sended' || o?.status === 'reject' ? 'flex' : 'hidden')}>
                                                <FaTruckFast className="text-[20px]" />
                                                Partiyani o'zgaritish
                                            </MenuItem>
                                            <MenuItem onClick={() => setEdit({ _id: o?._id, id: o?.id, price: o?.price, delivery_price: o?.delivery_price, party_id: o?.party_id, city: o?.city, comment: o?.comment, name: o?.name, phone: o?.phone, type: 'info', oldPrice: o?.product_price, value: o?.value })} className="flex items-center justify-start gap-2 text-green-500">
                                                <FaEdit className="text-[20px]" />
                                                Ma'lumotlarni taxrirlash
                                            </MenuItem>
                                        </MenuList>
                                    </Menu>
                                </div>
                                {/* ID */}
                                <p className="w-[80px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">
                                    {o?.id}
                                </p>
                                {/* PRODUCT */}
                                <p className="w-[150px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px] text-center">
                                    {o?.title}
                                </p>
                                {/* PRODUCT IMAGE */}
                                <div className="w-[70px] h-[50px] border-r flex items-center justify-center border-r-gray-500 ">
                                    <div className="flex overflow-hidden items-center justify-center w-[45px] h-[45px] rounded-full border-blue-gray-500">
                                        <img src={o?.image} alt="o_img" />
                                    </div>
                                </div>
                                {/* PRODUCT VALUE */}
                                <p className="w-[120px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">
                                    {o?.value}
                                </p>
                                {/* PRODUCT PRICE */}
                                <p className="w-[150px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">
                                    {Number(o?.price)?.toLocaleString()}
                                </p>
                                {/* STATUS */}
                                <div className="w-[150px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">
                                    {getStatus(o?.status)}
                                </div>
                                {/* CREATED */}
                                <p className="w-[150px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">
                                    {o?.created}
                                </p>
                                {/* NAME */}
                                <p className="w-[150px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">
                                    {o?.name}
                                </p>
                                {/* PHONE */}
                                <p className="w-[150px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">
                                    {o?.phone}
                                </p>
                                {showOther &&
                                    // {/* REGION CITY */}
                                    <p className="w-[200px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px] text-center">
                                        {Regions?.find(r => r?.id === o?.region)?.name} - {o?.city}
                                    </p>
                                }
                                {/* COMMENT */}
                                <p className="w-[200px] overflow-hidden h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px] text-center">
                                    {o?.comment}
                                </p>
                                {showCourier &&
                                    <>
                                        {/* COURIER NAME */}
                                        <p className="w-[150px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[12px]">
                                            {o?.courier}
                                        </p>
                                        {/* COURIER ID */}
                                        <p className="w-[150px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[12px]">
                                            {o?.courier_id}
                                        </p>
                                        {/* COURIER PHONE */}
                                        <p className="w-[150px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[12px]">
                                            {o?.courier_phone}
                                        </p>
                                        <p className="w-[150px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[12px]">
                                            {o?.party_id}
                                        </p>
                                        {/* COURIER PHONE */}
                                        <p className="w-[150px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[12px]">
                                            {o?.party_date}
                                        </p>
                                    </>
                                }
                                {showOperator &&
                                    <>
                                        {/* OPERATOR NAME */}
                                        <p className="w-[150px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">
                                            {o?.operator}
                                        </p>
                                        {/* OPERATOR ID */}
                                        <p className="w-[150px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">
                                            {o?.operator_id}
                                        </p>
                                        {/* OPERATOR PHONE */}
                                        <p className="w-[150px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">
                                            {o?.operator_phone}
                                        </p>
                                    </>
                                }
                                {showSeller &&
                                    <>
                                        {/* SELLER */}
                                        <p className="w-[150px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">
                                            {o?.seller}
                                        </p>
                                        {/* SELLER ID */}
                                        <p className="w-[150px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">
                                            {o?.seller_id}
                                        </p>
                                        {/* SELLER PHONE */}
                                        <p className="w-[150px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px] text-center">
                                            {o?.seller_phone}
                                        </p>
                                    </>
                                }
                                {showSupplier &&
                                    <>
                                        {/* SUPPLIER */}
                                        <p className="w-[150px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">
                                            {o?.supplier}
                                        </p>
                                        {/* SUPPLIER ID */}
                                        <p className="w-[150px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">
                                            {o?.supplier_id}
                                        </p>
                                        {/* SUPPLIER PHONE */}
                                        <p className="w-[150px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px] text-center">
                                            {o?.supplier_phone}
                                        </p>
                                    </>
                                }
                                {showOther &&
                                    <>
                                        {/* STREAM ID */}
                                        <p className="w-[120px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px] text-center">
                                            {o?.stream_id}
                                        </p>
                                        {/* COMISSION */}
                                        <p className="w-[150px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px] text-center">
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
            {/* EDIT PARTY */}
            <Dialog open={edit?.type === 'party'} size="md">
                <DialogHeader className="flex items-start justify-start flex-col">
                    <p className="text-[14px] font-normal">Partiya biriktirish</p>
                    <p className="text-[14px] font-normal">Buyurtma uchun ID: <b>{edit?.id}</b></p>
                </DialogHeader>
                <DialogBody className="border-y">
                    <div className="w-full mb-[10px]">
                        {isLoad &&
                            <Select onChange={e => setEdit({ ...edit, party_id: e })} value={edit?.party_id} color="indigo" label="Status tanlang">
                                {parties?.map((p, i) => {
                                    return (
                                        <Option key={i} value={p?._id}>Partiya: {p?.id} | {Regions?.find(r => r?.id === p?.region)?.name} | {p?.courier_name}, {p?.courier_phone} | {p?.created}</Option>
                                    )
                                })}
                            </Select>
                        }
                    </div>
                </DialogBody>
                <DialogFooter className="gap-2">
                    <Button onClick={CloseEdit} color="indigo">
                        Ortga
                    </Button>
                    <IconButton className="text-[16px]" onClick={() => edit?.party_id && SubmitSetParty()} disabled={!edit?.party_id}>
                        <FaSave />
                    </IconButton>
                </DialogFooter>
            </Dialog>
            {/* EDIT INFO */}
            <Dialog open={edit?.type === 'info'} size="md">
                <DialogHeader className="flex items-start justify-start flex-col">
                    <p className="text-[14px] font-normal">Ma'lumotlarni taxrirlash</p>
                    <p className="text-[14px] font-normal">Buyurtma uchun ID: <b>{edit?.id}</b></p>
                </DialogHeader>
                <DialogBody className="border-y">
                    {/* NAME */}
                    <div className="w-full mb-[10px]">
                        <Input label="Mijoz ismi" required color="indigo" onChange={e => setEdit({ ...edit, name: e.target.value })} value={edit?.name} icon={<FaUser />} />
                    </div>
                    {/* PHONE */}
                    <div className="w-full mb-[10px]">
                        <Input label="Mijoz raqami" type="tel" required color="indigo" onChange={e => setEdit({ ...edit, phone: e.target.value })} value={edit?.phone} icon={<FaPhone />} />
                    </div>
                    {/* VALUE */}
                    <div className="w-full mb-[10px]">
                        <Input label="Nechta mahsulot" type="number" required color="indigo" onChange={e => setEdit({ ...edit, value: e.target.value, price: e.target.value * edit?.oldPrice })} value={edit?.value} icon={<FaBox />} />
                    </div>
                    {/* PRICE */}
                    <div className="w-full mb-[10px]">
                        <Input label="Narxi( SO'M )" type="number" required color="indigo" onChange={()=>{}} value={edit?.price} icon={<FaMoneyBill />} />
                    </div>
                    {/* DELIVERY_PRICE */}
                    <div className="w-full mb-[10px]">
                        <Input label="Yetkazib berish narxi( SO'M )" type="number" required color="indigo" onChange={e => setEdit({ ...edit, delivery_price: e.target.value })} value={edit?.delivery_price} icon={<FaTruckFast />} />
                    </div>
                    {/* COMMENT */}
                    <div className="w-full mb-[10px]">
                        <Input label="Izoh" type="text" required color="indigo" onChange={e => setEdit({ ...edit, comment: e.target.value })} value={edit?.comment} icon={<FaComment />} />
                    </div>
                    {/* CITY */}
                    <div className="w-full mb-[10px]">
                        <Input label="Tuman( Shaxar )" type="text" required color="indigo" onChange={e => setEdit({ ...edit, city: e.target.value })} value={edit?.city} icon={<FaLocationArrow />} />
                    </div>
                </DialogBody>
                <DialogFooter className="gap-2">
                    <Button onClick={CloseEdit} color="indigo">
                        Ortga
                    </Button>
                    <IconButton className="text-[16px]" onClick={() => edit?._id && SubmitSetInfo()} disabled={!edit?._id}>
                        <FaSave />
                    </IconButton>
                </DialogFooter>
            </Dialog>
        </div>
    );
}

export default AdminSearchOrder;