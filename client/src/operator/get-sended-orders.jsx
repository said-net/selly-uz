import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { API, ERROR_MSG } from "../config";
import toast from "react-hot-toast";
import { IconButton, Popover, PopoverContent, PopoverHandler, Select, Spinner } from "@material-tailwind/react";
import { BiBox, BiComment, BiGift, BiIdCard, BiInfoCircle, BiLoader, BiLocationPlus, BiMoney, BiSend, BiUser, } from "react-icons/bi";
import Regions from '../assets/regions.json'
function OperatorGetSendedOrders() {
    const [orders, setOrders] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const { refresh } = useSelector(e => e?.config);
    // 
    useEffect(() => {
        setIsLoad(false);
        axios(`${API}/operator/get-sended-orders`, {
            headers: {
                'x-auth-token': `Bearer ${localStorage?.access}`
            }
        }).then(res => {
            const { ok, data, msg } = res.data;
            setIsLoad(true);
            if (ok) {
                setOrders(data);
            } else {
                toast.error(msg);
            }
        }).catch(() => {
            setIsLoad(true);
            toast.error(ERROR_MSG)
        })
    }, [refresh]);
    // 
    return (
        <div className="flex items-center justify-start flex-col w-full relative pb-[50px]">
            {/* INTRO */}
            <p className="uppercase text-white text-[20px] sm:text-[30px] animate-fade-down my-[10px]">YUBORILGANLAR</p>
            {/* BODY */}
            <div className="flex items-start justify-center flex-wrap gap-2">
                {!isLoad &&
                    <div className="flex items-center justify-center w-full h-[70vh] gap-3 text-white animate-fade-up">
                        <Spinner color="indigo" /> Kuting...
                    </div>
                }
                {isLoad && !orders[0] &&
                    <div className="flex items-center justify-center w-full h-[70vh] gap-3 text-white animate-fade-up">
                        <p>Buyurtmalar mavjud emas : (</p>
                    </div>
                }
                {isLoad && orders[0] &&
                    orders?.map((o, i) => {
                        return (
                            <div className="flex items-start justify-start flex-col w-[90%] md:w-[300px] p-[5px] bg-white rounded h-[250px] relative hover:shadow-lg animate-fade-up" style={{ animationDelay: i + '00ms' }} key={o?.id}>
                                {/* ID - CREATED */}
                                <p className="text-[14px] flex items-center justify-center gap-1">
                                    <BiIdCard />
                                    ID-{o?.id} | {o?.created}
                                    <Popover placement="top">
                                        <PopoverHandler>
                                            <IconButton className="w-[20px] text-[20px] text-gray-500 shadow-none h-[20px]" color="white">
                                                <BiInfoCircle />
                                            </IconButton>
                                        </PopoverHandler>
                                        <PopoverContent className="p-[5px_10px]">
                                            <span className="text-blue-gray-900">Buyurtma ID si va Sanasi</span>
                                        </PopoverContent>
                                    </Popover>
                                </p>
                                {/* PRODUCT VALUE */}
                                <p className="text-[14px] flex items-center justify-center gap-1">
                                    <BiBox />
                                    {o?.title} | {o?.value} ta
                                    <Popover placement="top">
                                        <PopoverHandler>
                                            <IconButton className="w-[20px] text-[20px] text-gray-500 shadow-none h-[20px]" color="white">
                                                <BiInfoCircle />
                                            </IconButton>
                                        </PopoverHandler>
                                        <PopoverContent className="p-[5px_10px]">
                                            <span className="text-blue-gray-900">Mahsulot va soni</span>
                                        </PopoverContent>
                                    </Popover>
                                </p>
                                {/* PRICE */}
                                <p className="text-[14px] flex items-center justify-center gap-1">
                                    <BiMoney />
                                    {Number(o?.price)?.toLocaleString()} so'm
                                    <Popover placement="top">
                                        <PopoverHandler>
                                            <IconButton className="w-[20px] text-[20px] text-gray-500 shadow-none h-[20px]" color="white">
                                                <BiInfoCircle />
                                            </IconButton>
                                        </PopoverHandler>
                                        <PopoverContent className="p-[5px_10px]">
                                            <span className="text-blue-gray-900">Mahsulot narxi</span>
                                        </PopoverContent>
                                    </Popover>
                                </p>
                                {/* FOR_OPERATOR */}
                                <p className="text-[14px] flex items-center justify-center gap-1">
                                    <BiGift />
                                    {o?.for_operator}
                                    <Popover placement="top">
                                        <PopoverHandler>
                                            <IconButton className="w-[20px] text-[20px] text-gray-500 shadow-none h-[20px]" color="white">
                                                <BiInfoCircle />
                                            </IconButton>
                                        </PopoverHandler>
                                        <PopoverContent className="p-[5px_10px]">
                                            <span className="text-blue-gray-900">Operator bonusi</span>
                                        </PopoverContent>
                                    </Popover>
                                </p>
                                {/* DELIVERY */}
                                <p className="text-[14px] flex items-center justify-center gap-1">
                                    <BiSend />
                                    ~ {Number(o?.delivery_price)?.toLocaleString()} so'm
                                    <Popover placement="top">
                                        <PopoverHandler>
                                            <IconButton className="w-[20px] text-[20px] text-gray-500 shadow-none h-[20px]" color="white">
                                                <BiInfoCircle />
                                            </IconButton>
                                        </PopoverHandler>
                                        <PopoverContent className="p-[5px_10px]">
                                            <span className="text-blue-gray-900">Yetkazib berish narxi</span>
                                        </PopoverContent>
                                    </Popover>
                                </p>
                                {/* NAME - PHONE*/}
                                <p className="text-[14px] flex items-center justify-center gap-1">
                                    <BiUser />
                                    {o?.name} | <span onClick={() => window?.open('tel:' + o?.phone)} className="underline cursor-pointer text-indigo-500">{o?.phone}</span>
                                    <Popover placement="top">
                                        <PopoverHandler>
                                            <IconButton className="w-[20px] text-[20px] text-gray-500 shadow-none h-[20px]" color="white">
                                                <BiInfoCircle />
                                            </IconButton>
                                        </PopoverHandler>
                                        <PopoverContent className="p-[5px_10px]">
                                            <span className="text-blue-gray-900">Mijoz ismi va raqami</span>
                                        </PopoverContent>
                                    </Popover>
                                </p>
                                {/* COMMENT*/}
                                <p className="text-[14px] flex items-center justify-center gap-1">
                                    <BiComment />
                                    {o?.comment}
                                    <Popover placement="top">
                                        <PopoverHandler>
                                            <IconButton className="w-[20px] text-[20px] text-gray-500 shadow-none h-[20px]" color="white">
                                                <BiInfoCircle />
                                            </IconButton>
                                        </PopoverHandler>
                                        <PopoverContent className="p-[5px_10px]">
                                            <span className="text-blue-gray-900">Operator izohi</span>
                                        </PopoverContent>
                                    </Popover>
                                </p>
                                {/* STATUS */}
                                <p className="text-[14px] flex items-center justify-center gap-1">
                                    <BiLoader />
                                    Yuborilgan( Yetkazilmoqda )
                                    <Popover placement="top">
                                        <PopoverHandler>
                                            <IconButton className="w-[20px] text-[20px] text-gray-500 shadow-none h-[20px]" color="white">
                                                <BiInfoCircle />
                                            </IconButton>
                                        </PopoverHandler>
                                        <PopoverContent className="p-[5px_10px] z-[99999]">
                                            <span className="text-blue-gray-900">Buyurtma holati</span>
                                        </PopoverContent>
                                    </Popover>
                                </p>
                                {/* REGION */}
                                <p className="text-[14px] flex items-center justify-center gap-1">
                                    <BiLocationPlus />
                                    {Regions?.find(r => r?.id === o?.id)?.name} - {o?.city}
                                    <Popover placement="top">
                                        <PopoverHandler>
                                            <IconButton className="w-[20px] text-[20px] text-gray-500 shadow-none h-[20px]" color="white">
                                                <BiInfoCircle />
                                            </IconButton>
                                        </PopoverHandler>
                                        <PopoverContent className="p-[5px_10px] z-[99999]">
                                            <span className="text-blue-gray-900">Mijoz manzili</span>
                                        </PopoverContent>
                                    </Popover>
                                </p>
                                {/* UTIME */}
                                <p className="text-[14px] flex items-center justify-center gap-1">
                                    <BiLoader />
                                    {o?.up_time}
                                    <Popover placement="top">
                                        <PopoverHandler>
                                            <IconButton className="w-[20px] text-[20px] text-gray-500 shadow-none h-[20px]" color="white">
                                                <BiInfoCircle />
                                            </IconButton>
                                        </PopoverHandler>
                                        <PopoverContent className="p-[5px_10px] z-[99999]">
                                            <span className="text-blue-gray-900">So'ngi yangilanish</span>
                                        </PopoverContent>
                                    </Popover>
                                </p>
                                {/* IMG */}
                                <div className="flex items-center justify-center w-[60px] h-[60px] border rounded-full overflow-hidden absolute top-[5px] right-[5px]">
                                    <img src={o?.product?.images[o?.product?.main_image] || o?.product?.images[0]} alt="p_img" />
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
}

export default OperatorGetSendedOrders;