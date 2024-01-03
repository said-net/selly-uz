import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API, ERROR_MSG } from "../config";
import toast from "react-hot-toast";
import { Dialog, DialogBody, DialogFooter, DialogHeader, IconButton, Input, Option, Popover, PopoverContent, PopoverHandler, Select, Spinner } from "@material-tailwind/react";
import { BiBox, BiComment, BiEdit, BiGift, BiIdCard, BiInfoCircle, BiLoader, BiLocationPlus, BiMoney, BiQuestionMark, BiSave, BiSend, BiTrashAlt, BiUser, BiXCircle } from "react-icons/bi";
import Regions from '../assets/regions.json'
import { setLoad, setRefresh } from "../managers/config.manager";
function OperatorGetSuccessOrders() {
    const [orders, setOrders] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const dp = useDispatch();
    const { refresh } = useSelector(e => e?.config);
    // 
    useEffect(() => {
        setIsLoad(false);
        axios(`${API}/operator/get-success-orders`, {
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
    const [edit, setEdit] = useState({ _id: '', id: '', value: '', region: '', city: '', price: '', delivery_price: '', status: '', comment: '', title: '', name: '', old_price: '' });
    function CloseEdit() {
        setEdit({ _id: '', id: '', value: '', region: '', city: '', price: '', delivery_price: '', status: '', comment: '', title: '', name: '', old_price: '' });
    }
    function SubmitEdit() {
        const { _id, name, value, price, delivery_price, comment, region, city } = edit;
        dp(setLoad(true));
        axios.post(`${API}/operator/set-status-success`, {
            _id,
            name,
            value,
            price,
            delivery_price,
            comment,
            region,
            city
        }, {
            headers: {
                'x-auth-token': `Bearer ${localStorage?.access}`
            }
        }).then(res => {
            dp(setLoad(false));
            const { ok, msg } = res.data;
            if (!ok) {
                toast.error(msg);
            } else {
                toast.success(msg);
                CloseEdit();
                dp(setRefresh())
            }
        }).catch(() => {
            toast.error(ERROR_MSG);
            dp(setLoad(false));
        })
    }
    function SubmitArchive() {
        const { _id, comment } = edit;
        dp(setLoad(true));
        axios.post(`${API}/operator/set-status-archive`, {
            _id,
            comment,
        }, {
            headers: {
                'x-auth-token': `Bearer ${localStorage?.access}`
            }
        }).then(res => {
            dp(setLoad(false));
            const { ok, msg } = res.data;
            if (!ok) {
                toast.error(msg);
            } else {
                toast.success(msg);
                CloseEdit();
                dp(setRefresh())
            }
        }).catch(() => {
            toast.error(ERROR_MSG);
            dp(setLoad(false));
        });
    }
    return (
        <div className="flex items-center justify-start flex-col w-full relative pb-[50px]">
            {/* INTRO */}
            <p className="uppercase text-white text-[20px] sm:text-[30px] animate-fade-down my-[10px]">QADOQLASHDA</p>
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
                            <div className="flex items-start justify-start flex-col w-[90%] md:w-[300px] p-[5px] bg-white rounded h-[200px] relative hover:shadow-lg animate-fade-up" style={{ animationDelay: i + '00ms' }} key={o?.id}>
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
                                {/* STATUS */}
                                <p className="text-[14px] flex items-center justify-center gap-1">
                                    <BiLoader />
                                    Qadoqlashda
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
                                            <span className="text-blue-gray-900">Buyurtma holati</span>
                                        </PopoverContent>
                                    </Popover>
                                </p>
                                {/* IMG */}
                                <div className="flex items-center justify-center w-[60px] h-[60px] border rounded-full overflow-hidden absolute top-[5px] right-[5px]">
                                    <img src={o?.product?.images[o?.product?.main_image] || o?.product?.images[0]} alt="p_img" />
                                </div>
                                {/* ACTIONS */}
                                <div className="flex items-center justify-end w-full gap-3 absolute bottom-[5px] right-[15px]">
                                    <IconButton onClick={() => setEdit({ ...edit, id: o?.id, _id: o?._id, value: o?.value, price: o?.price, delivery_price: o?.delivery_price, old_price: o?.price, status: 'success', title: o?.title, name: o?.name, comment: o?.comment, region: String(o?.region), city: o?.city })} disabled={o?.product?.value < 1} className="w-[30px] h-[30px] rounded text-[20px]" color="green">
                                        <BiEdit />
                                    </IconButton>
                                    <IconButton onClick={() => setEdit({ ...edit, status: 'archive', _id: o?._id, id: o?.id, comment: '' })} className="w-[30px] h-[30px] rounded text-[20px]" color="red">
                                        <BiTrashAlt />
                                    </IconButton>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            {/* EDIT */}
            <Dialog open={edit?._id !== '' && edit?.status === 'success'} size="md">
                <DialogHeader>
                    <p className="text-[18px] text-black font-normal">ID: {edit?.id} buyurtmani qabul qilish</p>
                </DialogHeader>
                <DialogBody className="border-y flex items-center justify-start flex-col gap-[10px]">
                    {/* TITLE */}
                    <div className="flex items-center justify-center w-full">
                        <Input label="Mahsulot" color="indigo" required onChange={e => setEdit({ ...edit, title: e.target.value })} value={edit?.title} icon={<BiBox />} />
                    </div>
                    {/* Value */}
                    <div className="flex items-center justify-center w-full">
                        <Input label="Mahsulot soni" color="indigo" type="number" required onChange={e => setEdit({ ...edit, value: e.target.value, price: (edit?.old_price * e.target.value) })} value={edit?.value} icon={<BiQuestionMark />} />
                    </div>
                    {/* price */}
                    <div className="flex items-center justify-center w-full">
                        <Input label="Narxi" color="indigo" type="number" required onChange={() => { }} value={edit?.price} icon={<BiMoney />} />
                    </div>
                    {/* delivery_price */}
                    <div className="flex items-center justify-center w-full">
                        <Input label="Yetkazib berish narxi" color="indigo" type="number" required onChange={e => setEdit({ ...edit, delivery_price: e.target.value })} value={edit?.delivery_price} icon={<BiSend />} />
                    </div>
                    {/* NAME */}
                    <div className="flex items-center justify-center w-full">
                        <Input label="Mijoz ismi" color="indigo" required onChange={e => setEdit({ ...edit, name: e.target.value })} value={edit?.name} icon={<BiUser />} />
                    </div>
                    {/* REGION */}
                    <div className="flex items-center justify-center w-full">
                        <Select color="indigo" label="Viloyatni tanlang" onChange={e => setEdit({ ...edit, region: e })} value={edit?.region}>
                            {Regions?.map((r, i) => {
                                return (
                                    <Option key={i} value={`${r?.id}`}>{r?.name}</Option>
                                )
                            })}
                        </Select>
                    </div>
                    {/* CITY */}
                    <div className="flex items-center justify-center w-full">
                        <Input label="Tuman( Shaxar )" color="indigo" required onChange={e => setEdit({ ...edit, city: e.target.value })} value={edit?.city} icon={<BiLocationPlus />} />
                    </div>
                    {/* Comment */}
                    <div className="flex items-center justify-center w-full">
                        <Input label="Izoh" color="indigo" required onChange={e => setEdit({ ...edit, comment: e.target.value })} value={edit?.comment} icon={<BiComment />} />
                    </div>
                </DialogBody>
                <DialogFooter className="gap-3">
                    <IconButton onClick={CloseEdit} autoFocus color="orange" className="text-[20px]">
                        <BiXCircle />
                    </IconButton>
                    <IconButton onClick={SubmitEdit} color="green" className="text-[20px]">
                        <BiSave />
                    </IconButton>
                </DialogFooter>
            </Dialog>
            {/* ARCHIVE */}
            <Dialog open={edit?._id !== '' && edit?.status === 'archive'} size="md">
                <DialogHeader>
                    <p className="text-[18px] text-black font-normal">ID: {edit?.id} buyurtmani arxivlash</p>
                </DialogHeader>
                <DialogBody className="border-y flex items-center justify-start flex-col gap-[10px]">
                    {/* Comment */}
                    <div className="flex items-center justify-center w-full">
                        <Input label="Izoh" color="indigo" required onChange={e => setEdit({ ...edit, comment: e.target.value })} value={edit?.comment} icon={<BiComment />} />
                    </div>
                </DialogBody>
                <DialogFooter className="gap-3">
                    <IconButton onClick={CloseEdit} autoFocus color="orange" className="text-[20px]">
                        <BiXCircle />
                    </IconButton>
                    <IconButton onClick={SubmitArchive} color="green" className="text-[20px]">
                        <BiSave />
                    </IconButton>
                </DialogFooter>
            </Dialog>
        </div>
    );
}

export default OperatorGetSuccessOrders;