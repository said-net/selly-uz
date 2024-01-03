import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API, ERROR_MSG } from "../config";
import toast from "react-hot-toast";
import Regions from '../assets/regions.json';
import { FaSearch } from 'react-icons/fa'
import { Button, Chip, Dialog, DialogBody, DialogFooter, DialogHeader, Input, Spinner } from "@material-tailwind/react";
import InputMask from 'react-input-mask';
import { setLoad, setRefresh } from "../managers/config.manager";
function CourierRejectedsOrders() {
    const [orders, setOrders] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const dp = useDispatch();
    const { refresh } = useSelector(e => e?.config);
    const [search, setSearch] = useState('');
    // 
    useEffect(() => {
        setIsLoad(false);
        axios(`${API}/courier/get-rejected-orders`, {
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
    const [edit, setEdit] = useState({ _id: '', id: '', status: '' });
    function CloseEdit() {
        setEdit({ _id: '', status: '', id: '' });
    }
    function SubmitEdit() {
        const { _id, status } = edit;
        dp(setLoad(true));
        axios.post(`${API}/courier/set-status-to-order`
            , {
                _id,
                status
            }, {
            headers: {
                'x-auth-token': `Bearer ${localStorage?.access}`
            }
        }).then((res) => {
            dp(setLoad(false))
            const { ok, msg } = res.data;
            if (!ok) {
                toast.error(msg);
            } else {
                toast.success(msg);
                CloseEdit();
                dp(setRefresh());
            }
        }).catch(() => {
            toast.error(msg);
            dp(setLoad(false));
        })
    }
    return (
        <div className="flex items-center justify-start flex-col w-full relative pb-[50px]">
            {/* INTRO */}
            <p className="uppercase text-white text-[20px] sm:text-[30px] animate-fade-down my-[10px]">Bekor qilinganlar</p>
            {/* SEARCH */}
            <div className="flex items-center justify-center w-[90%] mb-[10px] animate-fade-up p-[10px] rounded-[15px] bg-white">
                <InputMask type="tel" mask="\S-9999999999999" maskChar={''} value={search} onChange={e => setSearch(e?.target?.value)}>
                    {(p) => <Input {...p} color="indigo" className="text-indigo-500" label="ID orqali qidiruv" icon={<FaSearch />} />}
                </InputMask>
            </div>
            {/* BODY */}
            <div className="flex items-start justify-center flex-wrap gap-2 w-full">
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
                    orders?.filter(o => String(o?.id)?.includes(search?.replace('S-', '')))?.map((o, key) => {
                        return (
                            <div key={key} className="flex flex-col items-start p-[5px] gap-1 justify-start w-[90%] bg-white md:w-[300px] rounded-[10px] hover:bg-gray-200 cursor-pointer animate-fade-up">
                                {/* ORDER ID */}
                                <p>OrderID: <b>S-{o?.id}</b></p>
                                {/* NAME */}
                                <p>Mijoz ismi: <b>{o?.name}</b></p>
                                {/* PHONE */}
                                <p>Mijoz raqami: <b className="underline text-blue-500" onClick={() => window.open('tel:' + o?.phone)}>{o?.phone}</b></p>
                                {/* REGION CITY */}
                                <p>Manzil: <b>{Regions?.find(r => r?.id === o?.region)?.name} - {o?.city}</b></p>
                                {/* PRODUCT VALUE */}
                                <p>Mahsulot: <b>{o?.title} / {o?.value}ta</b></p>
                                {/* PRICE */}
                                <p>Narxi: <b>{o?.price?.toLocaleString()} so'm</b></p>
                                {/* DELIVERY */}
                                <p>Yetkazib berish: <b>{o?.delivery_price?.toLocaleString()} so'm</b></p>
                                {/* TOTAL PRICE */}
                                <p>Umumiy: <b>{Number(o?.price + o?.delivery_price)?.toLocaleString()} so'm</b></p>
                                {/* CREATED */}
                                <p>Yuborilgan sana: <b>{o?.party?.created}</b></p>
                                {/* PARTY */}
                                <p>Partiya: <b>{o?.party?.id}</b></p>
                                {/* COMMENT */}
                                <p>Operator izohi: <b className="text-indigo-500">{o?.comment}</b></p>
                                {/* UPTIME */}
                                <p>So'ngi yangilanish: <b>{o?.up_time}</b></p>
                                {/* IMAGE */}
                                <Chip color="red" value={"Bekor qilingan / Rad etilgan"} className="w-full flex items-center justify-center font-normal" />
                                {/*  */}
                                <div className="absolute flex items-center justify-start w-[50px] h-[50px] top-[5px] right-[5px] border rounded-full overflow-hidden">
                                    <img src={o?.image} alt="p_img" />
                                </div>
                                {/* BTN */}
                                {/* <div className="flex items-center justify-center w-full gap-2">
                                    <Button onClick={() => setEdit({ _id: o?._id, id: o?.id, status: 'recontact' })} className="font-normal w-[50%]" color="orange">
                                        Qayta aloqa
                                    </Button>
                                    <Button onClick={() => setEdit({ _id: o?._id, id: o?.id, status: 'reject' })} className="font-normal w-[50%]" color="red">
                                        Bekor qilindi
                                    </Button>
                                </div>
                                <div className="flex w-full mt-1">
                                    <Button onClick={() => setEdit({ _id: o?._id, id: o?.id, status: 'delivered' })} className="font-normal" fullWidth color="green">
                                        Yetkazildi
                                    </Button>
                                </div> */}
                            </div>
                        )
                    })
                }
            </div>
            {/* DIALOG EDIT */}
            <Dialog open={edit?._id !== ''} size="md">
                <DialogHeader>
                    <p className="text-[16px]">ID: {edit?.id} - buyurtmani {edit?.status === 'reject' ? "bekor qilish" : edit?.status === 'success' ? "yetkazildi deb belgilash" : "qayta aloqaga o'tkazish"}</p>
                </DialogHeader>
                <DialogBody className="border-y">
                    {edit?.status === 'success' &&
                        <p className="text-gray-900">Diqqat {edit?.id} id raqami tegishli buyurtma chindan ham buyurtmachiga yetkazilganini tasdiqlaysizmi?</p>
                    }
                    {edit?.status === 'recontact' &&
                        <p className="text-gray-900">Diqqat {edit?.id} id raqami tegishli buyurtma chindan ham qayta aloqaga o'tkazilishini tasdiqlaysizmi?</p>
                    }
                    {edit?.status === 'reject' &&
                        <p className="text-gray-900">Diqqat {edit?.id} id raqami tegishli buyurtma chindan ham bekor qilinganini tasdiqlaysizmi?</p>
                    }
                </DialogBody>
                <DialogFooter className="gap-3">
                    <Button color="orange" className="font-normal" onClick={CloseEdit}>Ortga</Button>
                    <Button color="blue-gray" className="font-normal" onClick={SubmitEdit}>Tasdiqlash</Button>
                </DialogFooter>
            </Dialog>
        </div>
    )
}
export default CourierRejectedsOrders;