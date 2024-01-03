import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API, ERROR_MSG } from "../config";
import toast from "react-hot-toast";
import { IconButton, Menu, MenuHandler, MenuItem, MenuList, Spinner } from "@material-tailwind/react";
import { BiCheckCircle, BiDotsVertical, BiXCircle } from "react-icons/bi";
import { setLoad, setRefresh } from "../managers/config.manager";

function AdminGetPayments() {
    const [payments, setPayments] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const dp = useDispatch();
    const { refresh } = useSelector(e => e?.config);
    // 
    useEffect(() => {
        setIsLoad(false);
        axios(`${API}/admin/get-payments`, {
            headers: {
                'x-auth-token': `Bearer ${localStorage?.access}`
            }
        }).then(res => {
            const { ok, data, msg } = res.data;
            setIsLoad(true);
            if (!ok) {
                toast.error(msg);
            } else {
                setPayments(data);
            }
        }).catch(() => {
            setIsLoad(true);
            toast.error(ERROR_MSG);
        })
    }, [refresh]);
    // 
    function SetStatus(_id, status) {
        dp(setLoad(true));
        axios.post(`${API}/admin/set-status-payment`, {
            _id,
            status
        }, {
            headers: {
                'x-auth-token': `Bearer ${localStorage?.access}`
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
            dp(setLoad(false));
        })
    }
    return (
        <div className="flex items-center justify-start flex-col w-full relative">
            {/* INTRO */}
            <p className="uppercase text-white text-[20px] sm:text-[30px] animate-fade-down my-[10px]">TO'LOVLAR</p>
            {/* BODY */}
            <div className="flex items-start justify-start flex-col w-[96%] overflow-x-scroll absolute top-[50px] left-[2%] bg-white p-[10px] rounded animate-fade-up">
                {/* STRUCT */}
                <div className="flex items-center justify-start border border-r-0 border-gray-500">
                    {/* MENU */}
                    <p className="w-[50px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">MENU</p>
                    {/* ID */}
                    <p className="w-[70px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">ID</p>
                    {/* NAME */}
                    <p className="w-[150px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">ISMI</p>
                    {/* PHONE */}
                    <p className="w-[150px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">RAQAMI</p>
                    {/* PHONE */}
                    <p className="w-[150px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">FOYDALANUVCHI ID</p>
                    {/* VALUE */}
                    <p className="w-[150px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">QIYMAT( SO'M )</p>
                    {/* CARD */}
                    <p className="w-[200px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">KARTA</p>
                    {/*  */}
                    <p className="w-[150px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">KIM UCHUN</p>
                    {/* CREATED */}
                    <p className="w-[180px] text-center h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">SO'ROV SANASI</p>
                </div>
                {/*  */}
                {!isLoad &&
                    <div className="flex items-center justify-center w-full gap-3 h-[50vh]">
                        <Spinner color="indigo" />
                        Kuting...
                    </div>
                }
                {isLoad && !payments[0] &&
                    <div className="flex items-center justify-center w-full gap-3 h-[50vh]">
                        <p>To'lovlar mavud emas!</p>
                    </div>
                }
                {isLoad && payments[0] &&
                    payments?.map((p, i) => {
                        return (
                            <div key={i} className="flex items-center justify-start border border-r-0 border-gray-500 border-t-0">
                                {/* MENU */}
                                <div className="w-[50px] h-[50px] border-r flex items-center justify-center border-r-gray-500">
                                    <Menu placement="bottom-start">
                                        <MenuHandler>
                                            <IconButton className="rounded-full text-[20px]" color="blue-gray">
                                                <BiDotsVertical />
                                            </IconButton>
                                        </MenuHandler>
                                        <MenuList>
                                            <MenuItem onClick={() => SetStatus(p?._id, 'success')} className="flex items-center justify-start gap-1 text-green-500">
                                                <BiCheckCircle className="text-[20px]" />
                                                To'landi
                                            </MenuItem>
                                            {/*  */}
                                            <MenuItem onClick={() => SetStatus(p?._id, 'reject')} className="flex items-center justify-start gap-1 text-red-500">
                                                <BiXCircle className="text-[20px]" />
                                                Rad etildi
                                            </MenuItem>
                                        </MenuList>
                                    </Menu>
                                </div>
                                {/* ID */}
                                <p className="w-[70px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">
                                    {p?.id}
                                </p>
                                {/* NAME */}
                                <p className="w-[150px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">
                                    {p?.name}
                                </p>
                                {/* PHONE */}
                                <p className="w-[150px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">
                                    {p?.phone}
                                </p>
                                {/* PHONE */}
                                <p className="w-[150px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">
                                    {p?.user_id}
                                </p>
                                {/* VALUE */}
                                <p onClick={() => { navigator.clipboard.writeText(p?.value); toast.success("Summadan nusxa olindi") }} className="w-[150px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px] cursor-pointer">
                                    {p?.value?.toLocaleString()}
                                </p>
                                {/* CARD */}
                                <p onClick={() => { navigator.clipboard.writeText(p?.card); toast.success("Kartadan nusxa olindi") }} className="w-[200px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px] cursor-pointer">
                                    {p?.card}
                                </p>
                                {/*  */}
                                <p className="w-[150px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">
                                    {p?.type === 'seller' && 'Sotuvchi'}
                                    {p?.type === 'courier' && 'Kuryer'}
                                    {p?.type === 'operator' && 'Operator'}
                                    {p?.type === 'supplier' && "Ta'minotchi"}
                                </p>
                                {/* CREATED */}
                                <p className="w-[180px] text-center h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">
                                    {p?.created}
                                </p>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
}

export default AdminGetPayments;