import axios from "axios";
import { useEffect, useState } from "react";
import { API, ERROR_MSG } from "../config";
import toast from "react-hot-toast";
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, IconButton, Menu, MenuHandler, MenuItem, MenuList, Option, Select, Spinner } from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { BiBlock, BiDotsVertical } from "react-icons/bi";
import { setLoad, setRefresh } from "../managers/config.manager";
import { FaBoxesPacking, FaPhone, FaTruck, FaXmark } from "react-icons/fa6";
import Regions from '../assets/regions.json';
import { FaSave } from "react-icons/fa";

function AdminSellers() {
    document.title = "SELLY - SOTUVCHILAR";
    const [sellers, setSellers] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const { refresh } = useSelector(e => e?.config);
    const dp = useDispatch();
    useEffect(() => {
        setIsLoad(false);
        axios(`${API}/admin/get-sellers`, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            setIsLoad(true);
            const { ok, data } = res.data;
            if (ok) {
                setSellers(data);
            }
        }).catch(() => {
            toast.error(ERROR_MSG);
        });
    }, [refresh]);
    // 
    function BlockUser(_id) {
        dp(setLoad(true));
        axios.post(`${API}/admin/block-user`, { _id }, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { ok, msg } = res.data;
            dp(setLoad(false));
            if (!ok) {
                toast.error(msg);
            } else {
                toast.success(msg);
                dp(setRefresh())
            }
        }).catch(() => {
            toast.error(ERROR_MSG);
            dp(setIsLoad(false));
        });
    }
    // SUPPLIER
    function SetSupplier(_id) {
        dp(setLoad(true));
        axios.post(`${API}/admin/set-supplier`, { _id }, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { ok, msg } = res.data;
            dp(setLoad(false));
            if (!ok) {
                toast.error(msg);
            } else {
                toast.success(msg);
                dp(setRefresh())
            }
        }).catch(() => {
            toast.error(ERROR_MSG);
            dp(setIsLoad(false));
        });
    }
    function RemoveSupplier(_id) {
        dp(setLoad(true));
        axios.post(`${API}/admin/remove-supplier`, { _id }, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { ok, msg } = res.data;
            dp(setLoad(false));
            if (!ok) {
                toast.error(msg);
            } else {
                toast.success(msg);
                dp(setRefresh())
            }
        }).catch(() => {
            toast.error(ERROR_MSG);
            dp(setIsLoad(false));
        });
    }
    // OPERATOR
    function SetOperator(_id) {
        dp(setLoad(true));
        axios.post(`${API}/admin/set-operator`, { _id }, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { ok, msg } = res.data;
            dp(setLoad(false));
            if (!ok) {
                toast.error(msg);
            } else {
                toast.success(msg);
                dp(setRefresh())
            }
        }).catch(() => {
            toast.error(ERROR_MSG);
            dp(setIsLoad(false));
        });
    }
    // COURIER
    const [courier, setCourier] = useState({ _id: '', region: '' });
    function SetCourier() {
        dp(setLoad(true));
        axios.post(`${API}/admin/set-courier`, courier, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { ok, msg } = res.data;
            dp(setLoad(false));
            if (!ok) {
                toast.error(msg);
            } else {
                toast.success(msg);
                setCourier({ _id: '', region: '' })
                dp(setRefresh())
            }
        }).catch(() => {
            toast.error(ERROR_MSG);
            dp(setIsLoad(false));
        });
    }
    return (
        <div className="flex items-cenetr justify-start flex-col w-full p-[50px_5px] relative ">
            {/* ADD-HADLER */}
            {/* MAPPING */}
            <div className="flex items-start justify-start flex-col w-[96%] overflow-x-scroll absolute top-[50px] left-[2%] bg-white p-[10px] rounded animate-fade-up">
                <div className="flex items-center justify-start border border-r-0 border-gray-500">
                    {/* MENU */}
                    <p className="w-[50px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">MENU</p>
                    {/* ID */}
                    <p className="w-[70px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">ID</p>
                    {/* IMAGE */}
                    <p className="w-[150px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">ISMI</p>
                    {/* TITLE */}
                    <p className="w-[150px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">RAQAMI</p>
                    {/* ORDERS */}
                    <p className="w-[120px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">SOTUVLAR</p>
                    {/* PROFIT */}
                    <p className="w-[180px] text-center h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">FOYDA( SO'M )</p>
                    {/* PAYMENTS */}
                    <p className="w-[180px] text-center h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">TO'LOVLAR( TA / SO'M )</p>
                    {/* PAYMENTS */}
                    <p className="w-[180px] text-center h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">KUTILAYYOTGAN TO'LOVLAR( SO'M )</p>
                    {/* BALANCE */}
                    <p className="w-[120px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">HISOB( SO'M )</p>
                    {/* CREATED */}
                    <p className="w-[200px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">RO'YHATDAN O'TGAN</p>
                    {/* END */}
                </div>
                {/*  */}
                {!isLoad &&
                    <div className="flex items-center justify-center w-full gap-3 h-[50vh]">
                        <Spinner color="indigo" />
                        Kuting...
                    </div>
                }
                {isLoad && !sellers[0] &&
                    <div className="flex items-center justify-center w-full gap-3 h-[50vh]">
                        <p>Sotuvchilar mavud emas</p>
                    </div>
                }
                {isLoad && sellers[0] &&
                    sellers?.map((s, i) => {
                        return (
                            <div key={i} className="flex items-center justify-start border border-r-0 border-gray-500 border-t-0">
                                {/* MENU */}
                                <div className="w-[50px] h-[50px] border-r flex items-center justify-center border-r-gray-500">
                                    <Menu placement="right-start">
                                        <MenuHandler>
                                            <IconButton className="rounded-full text-[20px]" color="indigo">
                                                <BiDotsVertical />
                                            </IconButton>
                                        </MenuHandler>
                                        <MenuList>
                                            {!s?.supplier ?
                                                <MenuItem onClick={() => SetSupplier(s?._id)} className="flex items-center justify-start gap-1">
                                                    <FaBoxesPacking className="text-[20px] text-green-500" />
                                                    Ta'minotchi qilish
                                                </MenuItem>
                                                :
                                                <MenuItem onClick={() => RemoveSupplier(s?._id)} className="flex items-center justify-start gap-1">
                                                    <FaXmark className="text-[20px] text-red-500" />
                                                    Ta'minotchidan olish
                                                </MenuItem>
                                            }
                                            <MenuItem onClick={() => SetOperator(s?._id)} className="flex items-center justify-start gap-1">
                                                <FaPhone className="text-[20px] text-orange-500" />
                                                Operator qilish
                                            </MenuItem>
                                            <MenuItem onClick={() => setCourier({ _id: s?._id, region: '' })} className="flex items-center justify-start gap-1">
                                                <FaTruck className="text-[20px] text-blue-500" />
                                                Kuryer qilish
                                            </MenuItem>
                                            <MenuItem onClick={() => BlockUser(s?._id)} className="flex items-center justify-start gap-1">
                                                {s?.block && <>
                                                    <BiBlock className="text-[20px] text-green-500" />
                                                    Blokdan chiqarish
                                                </>}
                                                {!s?.block && <>
                                                    <BiBlock className="text-[20px] text-red-500" />
                                                    Bloklash
                                                </>}
                                            </MenuItem>
                                        </MenuList>
                                    </Menu>
                                </div>
                                {/* ID */}
                                <p className="w-[70px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">
                                    {s?.id}
                                </p>
                                {/* IMAGE */}
                                <p className="w-[150px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">
                                    {s?.name}
                                </p>
                                {/* TITLE */}
                                <p onClick={() => window.open(`tel:${s?.phone}`)} className="w-[150px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px] cursor-pointer">
                                    {s?.phone}
                                </p>
                                {/* ORDERS */}
                                <p className="w-[120px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">
                                    {s?.orders}
                                </p>
                                {/* PROFIT */}
                                <p className="w-[180px] text-center h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">
                                    {s?.profit?.toLocaleString()}
                                </p>
                                {/* PAYMENTS */}
                                <p className="w-[180px] text-center h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">
                                    {s?.payments} / {s?.success_pays?.toLocaleString()}
                                </p>
                                {/* PAYMENTS */}
                                <p className="w-[180px] text-center h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">
                                    {s?.comming_pays?.toLocaleString()}
                                </p>
                                {/* BALANCE */}
                                <p className="w-[120px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">
                                    {s?.balance?.toLocaleString()}
                                </p>
                                {/* CREATED */}
                                <p className="w-[200px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">
                                    {s?.reg_time}
                                </p>
                                {/* END */}
                            </div>
                        )
                    })
                }

            </div>
            <Dialog size="md" open={courier?._id !== ''}>
                <DialogHeader>
                    <p className="text-[14px] font-normal">Kuryer uchun hududni tanlang!</p>
                </DialogHeader>
                <DialogBody className="border-y">
                    <Select label="Hududni tanlang" color="indigo" value={courier?.region} onChange={e => setCourier({ ...courier, region: e })}>
                        {Regions?.map((r, i) => {
                            return (
                                <Option value={`${r?.id}`} key={i}>{r?.name}</Option>
                            )
                        })}
                    </Select>
                </DialogBody>
                <DialogFooter className="gap-[10px]">
                    <Button onClick={() => setCourier({ _id: '', region: '' })}>Ortga</Button>
                    <IconButton onClick={SetCourier} disabled={!courier?.region} color="green" className="text-[20px]">
                        <FaSave />
                    </IconButton>
                </DialogFooter>
            </Dialog>
        </div>
    );
}

export default AdminSellers;