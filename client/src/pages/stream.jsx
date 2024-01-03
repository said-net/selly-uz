import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, IconButton, Input, Spinner } from "@material-tailwind/react";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { API, ERROR_MSG } from "../config";
import toast from "react-hot-toast";
import { BiCheckCircle, BiPlus, BiXCircle } from 'react-icons/bi';
import InputMask from 'react-input-mask';
import { FaPhone, FaUser, FaVideo } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { setLoad } from "../managers/config.manager";

function Stream() {
    const { id } = useParams();
    const [product, setProduct] = useState({ _id: '', category: '', title: '', about: '', images: [], video: '', main_image: 0, price: 0, value: 0 });
    const [form, setForm] = useState({ open: false, name: '', phone: '' });
    const [isLoad, setIsLoad] = useState(false);
    const [showMore, setShowMore] = useState(false);
    const [isShop, setIsShop] = useState(false);
    document.title = !isLoad ? "Kuting..." : product?.title;
    const [openVideo, setOpenVideo] = useState(false);
    useEffect(() => {
        setIsLoad(false);
        axios(`${API}/order/get-stream/${id}`).then(res => {
            const { ok, data, msg } = res.data;
            if (ok) {
                setProduct(data);
                setIsLoad(true);
            } else {
                toast.error(msg)
            }
        }).catch(() => {
            toast.error(ERROR_MSG);
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        });
    }, []);
    const dp = useDispatch();
    function CreateOrder() {
        dp(setLoad(true));
        axios.post(`${API}/order/create`, {
            name: form?.name,
            phone: form?.phone,
            _id: product?._id
        }).then(res => {
            const { ok, msg } = res.data;
            dp(setLoad(false));
            if (ok) {
                toast.success(msg);
                setIsShop(true);
            } else {
                toast.error(msg);
            }
        }).catch(() => {
            toast.error(ERROR_MSG);
            dp(setLoad(false));
        });
    }
    return (
        <>{
            !isShop && <div className="flex items-center justify-center w-full h-[100vh] backdrop-blur-sm bg-[#09061553] overflow-y-scroll scrollbar-hide">
                {/*  */}
                <div className="flex items-center justify-start flex-col w-[90%] sm:w-[400px] bg-white min-h-[300px] p-[7px] rounded-[15px] shadow-sm gap-2">
                    {/* TOP */}
                    <div className="flex items-center justify-start w-full flex-col gap-2">
                        {/* IMAGE */}
                        <div className="flex items-center justify-center w-full h-[300px] overflow-hidden rounded-[15px] shadow-md">
                            {!isLoad && <Spinner color="indigo" />}
                            {isLoad &&
                                <img src={product?.images[product?.main_image]} alt="p_img" />
                            }
                        </div>
                        <div className="flex items-center justify-start w-full gap-2">
                            {!isLoad &&
                                <>
                                    <div className="flex items-center justify-center w-[40px] h-[40px] border rounded-full overflow-hidden border-blue-gray-100">
                                        <Spinner color="indigo" />
                                    </div>
                                    <div className="flex items-center justify-center w-[40px] h-[40px] border rounded-full overflow-hidden border-blue-gray-100">
                                        <Spinner color="indigo" />
                                    </div>
                                    <div className="flex items-center justify-center w-[40px] h-[40px] border rounded-full overflow-hidden border-blue-gray-100">
                                        <Spinner color="indigo" />
                                    </div>
                                    <div className="flex items-center justify-center w-[40px] h-[40px] border rounded-full overflow-hidden border-blue-gray-100">
                                        <Spinner color="indigo" />
                                    </div>
                                    <div className="flex items-center justify-center w-[40px] h-[40px] border rounded-full overflow-hidden border-blue-gray-100">
                                        <Spinner color="indigo" />
                                    </div>
                                </>
                            }
                            {isLoad &&
                                product?.images?.map((img, i) => {
                                    return (

                                        <div key={i} onClick={() => setProduct({ ...product, main_image: i })} className={`flex items-center justify-center w-[40px] h-[40px] border rounded-full overflow-hidden ${product?.main_image === i ? "border-indigo-500" : "border-blue-gray-100"} cursor-pointer hover:shadow-md`}>
                                            <img src={img} alt="p_e_img" />
                                        </div>
                                    )
                                })
                            }
                            {
                                <div onClick={() => setOpenVideo(true)} className="flex items-center justify-center w-[40px] h-[40px] border rounded-full overflow-hidden border-blue-gray-100 text-[20px]">
                                    <FaVideo className="text-indigo-500" />
                                </div>
                            }
                        </div>
                    </div>
                    {/* TITLE & SHOW MORE */}
                    <div className="flex items-center justify-between w-full">
                        <p className="font-bold text-blue-gray-900">{product?.title?.slice(0, 20)}</p>
                        <div>
                            <IconButton onClick={() => setShowMore(true)} className="w-[30px] h-[30px] rounded-full text-[20px]" color="indigo">
                                <BiPlus />
                            </IconButton>
                        </div>
                    </div>
                    {/* CATEGORY */}
                    <div className="flex items-center justify-between w-full">
                        <p className="text-[14px] text-gray-700">{product?.category}</p>
                    </div>
                    <div className="flex items-start justify-between w-full flex-col">
                        <p className="text-[14px] text-gray-800">Mavjud: {product?.value} ta</p>
                    </div>
                    {/* PRICE */}
                    <div className="flex items-center justify-between w-full mt-[-8px]">
                        <p className="font-bold">{product?.price?.toLocaleString()} so'm</p>
                        <Button disabled={product?.value < 1} className="rounded-[40px] " color="red" onClick={() => setForm({ ...form, open: true })}>Sotib olish</Button>
                    </div>
                </div>
                {/* SHOW MORE */}
                <Dialog open={showMore} size="md">
                    <DialogHeader className="relative flex items-center justify-between">
                        <p className="text-[17px]">{product?.title}</p>
                        <IconButton onClick={() => setShowMore(false)} className="w-[40px] h-[40px] rounded-full text-[20px]" color="indigo">
                            <BiXCircle />
                        </IconButton>
                    </DialogHeader>
                    <DialogBody className="flex items-start justify-start flex-col w-full border-y gap-1 max-h-[400px] overflow-y-scroll scrollbar-hide">
                        <p className="text-blue-gray-900 font-normal" dangerouslySetInnerHTML={{ __html: product?.about?.replaceAll('\n', '<br/>') }}></p>
                        <p className="font-bold text-black">Narxi: {product?.price?.toLocaleString()} so'm</p>
                        <p className="text-[14px] text-black">Yetkazib berish hizmati: {product?.delivery_price?.toLocaleString()} so'm</p>
                        <p className="flex items-center justify-center gap-[5px] text-[14px] text-blue-gray-900">
                            <BiCheckCircle />
                            Hududgacha yetkazib berish
                        </p>
                        <p className="flex items-center justify-center gap-[5px] text-[14px] text-blue-gray-900">
                            <BiCheckCircle />
                            Borganda to'lov
                        </p>
                        <p className="flex items-center justify-center gap-[5px] text-[14px] text-blue-gray-900">
                            <BiCheckCircle />
                            Tekshirib olish
                        </p>
                        <p className="text-blue-gray-900 font-normal text-center" >
                            Be'pul yetkazib berish 2 ta yoki ko'proq mahsulot uchun amal qiladi!
                        </p>
                    </DialogBody>
                    <DialogFooter>
                        <Button disabled={product?.value < 1} className="rounded-[40px] " fullWidth color="red" onClick={() => setForm({ ...form, open: true })}>Sotib olish</Button>
                    </DialogFooter>
                </Dialog>
                {/* FORM */}
                <Dialog open={form?.open} size="md">
                    <DialogHeader className="relative flex items-center justify-between">
                        <p className="text-[17px]">{product?.title}</p>
                        <IconButton onClick={() => setForm({ ...form, open: false })} className="w-[40px] h-[40px] rounded-full text-[20px]" color="indigo">
                            <BiXCircle />
                        </IconButton>
                    </DialogHeader>
                    <DialogBody className="flex items-start justify-start flex-col w-full border-y gap-1 max-h-[400px] overflow-y-scroll scrollbar-hide">
                        <div className="w-full mb-[10px]">
                            <Input className="text-indigo-500" label="Ismingiz" color="indigo" value={form?.name} onChange={e => setForm({ ...form, name: e.target.value })} icon={<FaUser />} />
                        </div>
                        {/*  */}
                        <div className="w-full mb-[10px]">
                            <InputMask type="tel" mask="+\9\9\8-(99)-999-99-99" value={form?.phone} onChange={e => setForm({ ...form, phone: e.target.value })}>
                                {(p) => <Input {...p} color="indigo" className="text-indigo-500" label="Raqamingiz" icon={<FaPhone />} />}
                            </InputMask>
                        </div>
                    </DialogBody>
                    <DialogFooter>
                        <Button disabled={product?.value < 1} className="rounded-[40px]" onClick={CreateOrder} fullWidth color="red">Qabul qilish</Button>
                    </DialogFooter>
                </Dialog>
                {/* VIDEO */}
                <Dialog open={openVideo} size="md">
                    <DialogHeader className="relative flex items-center justify-between">
                        <p className="text-[17px]">{product?.title}</p>
                        <IconButton onClick={() => setOpenVideo(false)} className="w-[40px] h-[40px] rounded-full text-[20px]" color="indigo">
                            <BiXCircle />
                        </IconButton>
                    </DialogHeader>
                    <DialogBody className="flex items-start justify-start flex-col w-full border-y gap-1 max-h-[450px] overflow-y-scroll scrollbar-hide">
                        <video src={product?.video} controls></video>
                    </DialogBody>
                    <DialogFooter>

                    </DialogFooter>
                </Dialog>
            </div>}
            {isShop &&
                <div className="flex items-center justify-center w-full h-[100vh]">
                    <div className="flex items-center justify-start flex-col w-full min-h-[400px] md:w-[500px] bg-white rounded-[15px] p-[10px]">
                        {/* THANKS */}
                        <p className="text-[20px] text-indigo-500">Buyurtma qabul qilindi!</p>
                        <BiCheckCircle className="text-[150px] text-green-500" />
                        <p className="text-[20px] text-indigo-500">Operatorimiz siz bilan bog'lanadi!</p>
                        <div className="w-full h-[1px] bg-gray-500 my-2"></div>
                        <p className="w-full text-blue-gray-800 mb-[10px]">Shaxsiy <b>veb-sayt</b>ga ega bo'lmoqchimisiz?</p>
                        <p className="w-full text-blue-gray-800 mb-[10px]">Yoki <b>telegram bot</b> kerakmi?</p>
                        <p className="w-full text-blue-gray-800 mb-[10px]">Unda <span className="underline cursor-pointer" onClick={() => window.open('https://t.me/saidweb')}>biz bilan bog'laning!</span> Sizning talabingizga qarab <b>veb-sayt</b> yoki <b>telegram bot</b> ochib beramiz</p>
                        <Button fullWidth onClick={() => window.open('https://t.me/saidweb')}>Bog'lanish</Button>
                    </div>
                </div>
            }
        </>
    );
}

export default Stream;