import axios from "axios";
import { useEffect, useState } from "react";
import { API, ERROR_MSG } from "../config";
import toast from "react-hot-toast";
import { Button,  Dialog, DialogBody, DialogFooter, DialogHeader, Spinner, Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { FaCopy, FaNewspaper, FaTrash } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { setLoad } from "../managers/config.manager";

function SellerStreams() {
    const [streams, setStreams] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const [refresh, setRefresh] = useState(false);
    useEffect(() => {
        setIsLoad(false);
        axios(`${API}/seller/get-streams`, {
            headers: {
                'x-auth-token': `Bearer ${localStorage?.access}`
            }
        }).then(res => {
            const { ok, data, msg } = res.data;
            setIsLoad(true);
            if (!ok) {
                toast.error(msg);
            } else {
                setStreams(data);
            }
        }).catch(() => {
            setIsLoad(true);
            toast.error(ERROR_MSG);
        });
    }, [refresh]);
    const [deleteStream, setDeleteStream] = useState({ _id: '', title: '' });
    function CloseDeleteStream() {
        setDeleteStream({ _id: '', title: '' })
    }
    const dp = useDispatch();
    function SubmitDeleteStream() {
        dp(setLoad(true))
        axios.delete(`${API}/seller/delete-stream/${deleteStream?._id}`, {
            headers: {
                'x-auth-token': `Bearer ${localStorage?.access}`
            }
        }).then(res => {
            const { ok, msg } = res.data;
            dp(setLoad(false))
            if (!ok) {
                toast.error(msg);
            } else {
                CloseDeleteStream();
                setRefresh(!refresh);
            }
        }).catch(() => {
            dp(setLoad(false))
            toast.error(ERROR_MSG);
        });
    }
    function GetCreative(_id) {
        dp(setLoad(true))
        axios(`${API}/seller/get-creative/${_id}`, {
            headers: {
                'x-auth-token': `Bearer ${localStorage?.access}`
            }
        }).then(res => {
            const { ok, msg } = res.data;
            dp(setLoad(false))
            if (!ok) {
                toast.error(msg);
            } else {
                toast.success(msg);
            }
        }).catch(() => {
            dp(setLoad(false))
            toast.error(ERROR_MSG);
        });
    }
    return (
        <div className="flex items-center justify-start flex-col w-full p-1 pb-[50px]">
            {/* TOP */}
            <div className="flex items-center xl:items-start justify-center xl:justify-start flex-col w-full mb-[10px]">
                <h1 className="text-[30px] sm:text-[40px] text-white animate-fade-down">OQIMLAR</h1>
            </div>
            {/*  */}
            {!isLoad &&
                <div className="flex items-center justify-center w-full h-[70vh] gap-3 text-white animate-fade-up">
                    <Spinner color="indigo" /> Kuting...
                </div>
            }
            {isLoad && !streams[0] &&
                <div className="flex items-center justify-center w-full h-[70vh] gap-3 text-white animate-fade-up flex-col">
                    <p>Oqimlar mavjud emas : (</p>
                    <Link to={'/seller/market'}>
                        <Button color="green">Oqim ochish</Button>
                    </Link>
                </div>
            }
            {isLoad && streams[0] &&
                <div className="flex items-start justify-center flex-wrap w-full gap-2">
                    {streams?.map((s, i) => {
                        return (
                            <div key={i} className="flex items-center justify-start flex-col w-[90%] md:w-[320px] bg-white rounded-[12px] p-[10px] gap-2 animate-fade-up">
                                {/* top */}
                                <div className="flex items-start justify-start w-full gap-2">
                                    <div className="flex items-center justify-center w-[70px] h-[70px] rounded-[15px] overflow-hidden">
                                        <img
                                            src={s?.image}
                                            alt="s-image"
                                        />
                                    </div>
                                    <div className="flex items-start justify-start flex-col gap-2">
                                        <Typography className='text-[16px]' color={'blue-gray'}>{s?.title?.length > 25 ? s?.title?.slice(0, 25) + '...' : s?.title}</Typography>
                                        <Typography className='text-[16px] lowercase' color={'blue-gray'}>{s?.product?.length > 25 ? s?.product?.slice(0, 25) + '...' : s?.product}</Typography>
                                    </div>
                                </div>
                                {/* BODY */}
                                <div className="flex items-center justify-start flex-col w-full py-[5px] gap-2 border-y relative">
                                    {s?.value < 1 &&
                                        <div className="flex items-center justify-center w-full h-[100%] absolute top-0 left-0 flex-col bg-[#0000008a] backdrop-blur-sm rounded-[15px]">
                                            <p className="text-white">Omborda mahsulot qolmagan : (</p>
                                            <p className="text-white">Tez orada to'ldiriladi!</p>
                                        </div>
                                    }
                                    {/* PRICE & FOR_SELLER */}
                                    <p className="text-[16px] w-full flex items-center justify-between text-blue-gray-500">Narxi: <b >{Number(s?.price)?.toLocaleString()} so'm</b></p>
                                    <p className="text-[16px] w-full flex items-center justify-between text-blue-gray-500">Bonus: <b >{Number(s?.for_seller)?.toLocaleString()} so'm</b></p>
                                    <p className="text-[16px] w-full flex items-center justify-between text-blue-gray-500">Mavjud: <b >{s?.value} ta</b></p>
                                    {/* STREAM */}
                                    <input type="text" className="w-full border text-[13px] text-center mb-[5px] border-indigo-300 rounded bg-gray-200 h-[30px] focus:outline-indigo-500" value={`https://selly.uz/o/${s?.id}`} />
                                </div>
                                {/* FOOTER */}
                                <div className="flex items-center justify-center gap-2">
                                    {/* COPY */}
                                    <div className="flex items-center justify-center w-[40px] h-[40px] border-indigo-300 rounded border cursor-pointer text-indigo-500 hover:bg-gray-300" onClick={() => { s?.value < 1 ? toast.error("Omborda yetarli mahsulot qolmagan!") : navigator.clipboard.writeText(`https://selly.uz/o/${s?.id}`).then(()=>{ toast.success(`${s?.title} - dan nusxa olindi!`) })}}>
                                        <FaCopy />
                                    </div>
                                    {/* VIDEO */}
                                    <div onClick={() => { s?.value < 1 ? toast.error("Omborda yetarli mahsulot qolmagan!") : GetCreative(s?._id) }} className="flex items-center justify-center w-[40px] h-[40px] border-blue-300 rounded border cursor-pointer text-blue-500 hover:bg-gray-300">
                                        <FaNewspaper />
                                    </div>
                                    {/* DELETE */}
                                    <div onClick={() => setDeleteStream({ _id: s?._id, title: s?.title })} className="flex items-center justify-center w-[40px] h-[40px] border-red-300 rounded border cursor-pointer text-red-500 hover:bg-gray-300" >
                                        <FaTrash />
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            }
            <Dialog size="md" open={deleteStream?._id !== ''}>
                <DialogHeader>
                    <p className="font-normal text-[16px]"><b>{deleteStream?.title}</b> o'chirilsinmi?</p>
                </DialogHeader>
                <DialogBody className="border-y">
                    <p className="text-blue-gray-800">!! DIQQAT !!<br />1 - Sotuvlar tarixi va hisob( balans ) o'zgarmaydi!<br />2 - Ushbu oqim orqali yangi buyurtmalar sizning hisobingizga kiritilmaydi va siz uchun bonus berimaydi!<br />3 - O'chirib tashlangan oqim qayta tiklanmaydi.</p>
                    <p className="text-[20px] text-red-500">Oqim chindan ham o'chirib tashlansinmi?</p>
                </DialogBody>
                <DialogFooter className="gap-2">
                    <Button color="blue" onClick={CloseDeleteStream}>Ortga</Button>
                    <Button color="red" onClick={SubmitDeleteStream}>O'chirib tashlash</Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
}

export default SellerStreams;