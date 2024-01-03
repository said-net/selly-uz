import axios from "axios";
import { useEffect, useState } from "react";
import { API, ERROR_MSG } from "../config";
import toast from "react-hot-toast";
import { Chip, IconButton, Menu, MenuHandler, MenuItem, MenuList, Spinner } from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { BiBlock, BiDotsVertical, BiNote, BiUserCheck, BiUserX, BiXCircle } from "react-icons/bi";
import { setLoad, setRefresh } from "../managers/config.manager";
function AdminOperators() {
    document.title = "SELLY - OPERATORLAR";
    const [suppliers, setSuppliers] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const { refresh } = useSelector(e => e?.config);
    const dp = useDispatch();
    useEffect(() => {
        setIsLoad(false);
        axios(`${API}/admin/get-operators`, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            setIsLoad(true);
            const { ok, data } = res.data;
            if (ok) {
                setSuppliers(data);
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
    function RemoveOperator(_id) {
        dp(setLoad(true));
        axios.post(`${API}/admin/remove-operator`, { _id }, {
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
    function SetFreedom(_id) {
        dp(setLoad(true));
        axios.post(`${API}/admin/set-freedom-operator`, { _id }, {
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
                    {/* NAME */}
                    <p className="w-[150px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">ISMI</p>
                    {/* PHONE */}
                    <p className="w-[150px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">RAQAMI</p>
                    {/* FREE DOM */}
                    <p className="w-[150px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">ERKIN ISH</p>
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
                {isLoad && !suppliers[0] &&
                    <div className="flex items-center justify-center w-full gap-3 h-[50vh]">
                        <p>Operatorlar mavud emas</p>
                    </div>
                }
                {isLoad && suppliers[0] &&
                    suppliers?.map((s, i) => {
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
                                            <MenuItem onClick={() => RemoveOperator(s?._id)} className="flex items-center justify-start gap-1">
                                                <BiUserX className="text-[20px] text-orange-500" />
                                                Operatorlar safidan olish
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
                                            <MenuItem onClick={() => SetFreedom(s?._id)} className="flex items-center justify-start gap-1">
                                                {s?.operator_freedom && <>
                                                    <BiXCircle className="text-[20px] text-red-500" />
                                                    Erkin ishni taqiqlash
                                                </>}
                                                {!s?.operator_freedom && <>
                                                    <BiUserCheck className="text-[20px] text-green-500" />
                                                    Erkin ishga ruhsat berish
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
                                {/* FREE DOM */}
                                <div className="w-[150px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">
                                    {s?.operator_freedom && <Chip className="w-[90%] flex items-center justify-center" color="green" value="HA" />}
                                    {!s?.operator_freedom && <Chip className="w-[90%] flex items-center justify-center" color="orange" value="Yo'q" />}
                                </div>

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
        </div>
    );
}

export default AdminOperators;