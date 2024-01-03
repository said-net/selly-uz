import axios from "axios";
import { useEffect, useState } from "react";
import { API, ERROR_MSG } from "../config";
import toast from "react-hot-toast";
import Logo from '../assets/logo.png'
import { Link } from "react-router-dom";
import { FaBoxesStacked, FaImages, FaInfo, FaPhone, FaQuestion, FaUser } from "react-icons/fa6";
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, IconButton, Input } from "@material-tailwind/react";
import { FaVideo } from "react-icons/fa";
import { BiCheckCircle, BiXCircle } from "react-icons/bi";
import InputMask from 'react-input-mask';
import { setLoad } from "../managers/config.manager";
import { useDispatch } from "react-redux";
function MainMenu() {
    const [products, setProducts] = useState([]);
    const [isLoad, setIsLaod] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectCategory, setSelectedCategory] = useState('');
    const [openImages, setOpenImages] = useState({ _id: '', title: '', images: [], value: 0 });
    const [openVideo, setOpenVideo] = useState({ _id: '', title: '', video: '', value: 0 });
    const [openInfo, setOpenInfo] = useState({ _id: '', title: '', about: '', price: '', delivery_price: '', value: 0 });
    const [openShop, setOpenShop] = useState({ _id: '', title: '', name: '', phone: '', value: 0 });
    function CloseInfo() {
        setOpenInfo({ _id: '', title: '', about: '', price: '', delivery_price: '', value: '' });
        setOpenVideo({ _id: '', title: '', video: '' });
        setOpenImages({ _id: '', title: '', images: [] });
        setOpenShop({ _id: '', title: '', phone: '', name: '' })
    }
    useEffect(() => {
        setIsLaod(false);
        axios(`${API}/user/get-main-menu`).then((res) => {
            setIsLaod(true);
            const { ok, msg, products, categories } = res?.data;
            if (!ok) {
                toast.error(msg);
            } else {
                setProducts(products);
                setCategories(categories);
            }
        }).catch(() => {
            toast.error(ERROR_MSG);
            setIsLaod(true);
        })
    }, []);
    // 
    const dp = useDispatch();
    function CreateOrder() {
        dp(setLoad(true));
        axios.post(`${API}/order/create-order-no-stream`, {
            name: openShop?.name,
            phone: openShop?.phone,
            _id: openShop?._id
        }).then(res => {
            const { ok, msg } = res.data;
            dp(setLoad(false));
            if (ok) {
                toast.success(msg);
                CloseInfo();
            } else {
                toast.error(msg);
            }
        }).catch(() => {
            toast.error(ERROR_MSG);
            dp(setLoad(false));
        });
    }
    return (
        <div className="flex items-center justify-start flex-col w-full min-h-screen bg-gray-100 z-[999] py-[80px]">
            {/* NAV */}
            <div className="flex items-center justify-between w-full fixed top-0 left-0 bg-white px-[2%] h-[70px] border-b animate-fade-down z-[99]">
                {/* LOGO */}
                <div className="flex w-[100px]">
                    <img src={Logo} alt="logo" />
                </div>
                {/* BTNS */}
                <div className="flex items-center justify-start gap-5">
                    {/* Mobile< */}
                    <Link to='/intro' className="text-blue-gray-400 items-center justify-center gap-1 hover:text-blue-gray-500 hidden sm:flex">
                        <FaQuestion />
                        Selly nima
                    </Link>
                    <Link to='/auth' className="text-blue-gray-400 items-center justify-center gap-1 hover:text-blue-gray-500 hidden sm:flex">
                        <FaUser />
                        Kirish
                    </Link>
                    {/* Mobile> */}
                    <Link to='/intro' className="sm:hidden flex">
                        <IconButton color="indigo" className="text-[20px]">
                            <FaQuestion />
                        </IconButton>
                    </Link>
                    <Link to='/auth' className="sm:hidden flex">
                        <IconButton color="green" className="text-[20px]">
                            <FaUser />
                        </IconButton>
                    </Link>
                </div>
            </div>
            {/* CATEGORY MOBILE < */}
            <div className="lg:flex items-center justify-center flex-wrap gap-5 hidden mb-[10px]">
                <div onClick={() => setSelectedCategory('')} className="flex items-center justify-start flex-col cursor-pointer hover:bg-white rounded w-[120px] hover:shadow-sm p-[5px] animate-fade-down" style={!selectCategory ? { background: 'white' } : {}}>
                    <div className="flex items-center justify-center w-[100px] h-[100px] rounded-full overflow-hidden p-[15px] bg-indigo-200">
                        <FaBoxesStacked className="text-[70px] text-white" />
                    </div>
                    <p className="text-[14px] text-gray-600">Barchasi</p>
                </div>
                {isLoad && categories[0] &&
                    categories?.map((c, i) => {
                        return (
                            <div key={i} onClick={() => setSelectedCategory(c?._id)} className={`flex items-center justify-start flex-col cursor-pointer hover:bg-white rounded w-[120px] hover:shadow-sm p-[5px] animate-fade-down ${selectCategory === c?._id ? ' bg-white' : ''}`} style={{ animationDelay: i + '00ms' }}>
                                <div className="flex items-center justify-center w-[100px] h-[100px] rounded-full overflow-hidden p-[15px]" style={{ background: c?.color }}>
                                    <img src={c?.image} alt="c_img" />
                                </div>
                                <p className="text-[14px] text-gray-600">{c?.title}</p>
                            </div>
                        )
                    })
                }
            </div>
            {/* CATEGORY MOBILE > */}
            <div className="flex items-center justify-start overflow-x-scroll snap-x gap-5 lg:hidden w-full mb-[10px]">
                <div onClick={() => setSelectedCategory('')} className="flex items-center justify-start snap-start flex-col cursor-pointer hover:bg-white rounded w-[120px] hover:shadow-sm p-[5px] animate-fade-down" style={!selectCategory ? { background: 'white' } : {}}>
                    <div className="flex items-center justify-center w-[100px] h-[100px] rounded-full overflow-hidden p-[15px] bg-indigo-200">
                        <FaBoxesStacked className="text-[70px] text-white" />
                    </div>
                    <p className="text-[14px] text-gray-600">Barchasi</p>
                </div>
                {isLoad && categories[0] &&
                    categories?.map((c, i) => {
                        return (
                            <div key={i} onClick={() => setSelectedCategory(c?._id)} className={`flex snap-start items-center justify-start flex-col cursor-pointer hover:bg-white rounded w-[120px] hover:shadow-sm p-[5px] animate-fade-down ${selectCategory === c?._id ? ' bg-white' : ''}`} style={{ animationDelay: i + '00ms' }}>
                                <div className="flex items-center justify-center w-[100px] h-[100px] rounded-full overflow-hidden p-[15px]" style={{ background: c?.color }}>
                                    <img src={c?.image} alt="c_img" />
                                </div>
                                <p className="text-[14px] text-gray-600">{c?.title}</p>
                            </div>
                        )
                    })
                }
            </div>
            {/* PRODUCTS */}
            <div className="flex items-start justify-center gap-3 flex-wrap w-full">
                {isLoad && products[0] &&
                    products?.filter(p => p?.category?.includes(selectCategory))?.map((p, i) => {
                        return (
                            <div key={i} className="flex items-start justify-start flex-col w-[90%] sm:w-[300px] h-[400px] bg-white p-[10px] gap-1 rounded-[10px] shadow-sm animate-fade-up">
                                {/* IMG */}
                                <div className="flex items-center justify-start w-full h-[300px] rounded-[10px] overflow-hidden shadow-sm">
                                    <img src={p?.image} alt="p_img" />
                                </div>
                                <div className="flex items-start justify-start flex-col w-full relative">
                                    {/* TITLE */}
                                    <p className="font-bold text-[18px] text-blue-gray-800">{p?.title[20] ? p?.title?.slice(0, 17) + '...' : p?.title}</p>
                                    {/* CATEGORY */}
                                    <p className="text-[16px] text-gray-600">{categories?.find(c => c?._id === p?.category)?.title}</p>
                                    {/* value */}
                                    <p className="text-[16px] text-gray-800">Mavjud: {p?.value} ta</p>
                                    {/* PRICE */}
                                    <p className="font-bold text-[18px] text-black">{p?.price?.toLocaleString()} so'm</p>
                                    {/* BTNS */}
                                    <div className="absolute top-0 right-0 gap-1 flex items-center justify-center">
                                        {/* IMAGES */}
                                        <IconButton onClick={() => setOpenImages({ value: p?.value, _id: p?._id, title: p?.title, images: p?.images })} color="blue" className="text-[18px] w-[30px] h-[30px] rounded-full">
                                            <FaImages />
                                        </IconButton>
                                        {/* VIDEO */}
                                        <IconButton onClick={() => setOpenVideo({ value: p?.value, _id: p?._id, title: p?.title, video: p?.video })} color="green" className="text-[18px] w-[30px] h-[30px] rounded-full">
                                            <FaVideo />
                                        </IconButton>
                                        {/* INFO */}
                                        <IconButton onClick={() => setOpenInfo({ _id: p?._id, title: p?.title, about: p?.about, price: p?.price, delivery_price: p?.delivery_price, value: p?.value })} color="indigo" className="text-[18px] w-[30px] h-[30px] rounded-full">
                                            <FaInfo />
                                        </IconButton>
                                    </div>
                                    <div className="absolute bottom-0 right-0">
                                        <Button onClick={() => setOpenShop({ ...openShop, _id: p?._id, title: p?.title, value: p?.value })} color="green" className="rounded-full font-normal">
                                            Sotib olish
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            {/* SHOW MORE */}
            <Dialog open={openInfo?._id !== ''} size="md">
                <DialogHeader className="relative flex items-center justify-between">
                    <p className="text-[17px] w-[90%]">{openInfo?.title}</p>
                    <IconButton onClick={CloseInfo} className="w-[40px] h-[40px] rounded-full text-[20px]" color="indigo">
                        <BiXCircle />
                    </IconButton>
                </DialogHeader>
                <DialogBody className="flex items-start justify-start flex-col w-full border-y gap-1 max-h-[400px] overflow-y-scroll scrollbar-hide">
                    <p className="text-blue-gray-900 font-normal" dangerouslySetInnerHTML={{ __html: openInfo?.about?.replaceAll('\n', '<br/>→ ') }}></p>
                    <p className="font-bold text-black">Narxi: {openInfo?.price?.toLocaleString()} so'm</p>
                    <p className="text-[14px] text-black">Yetkazib berish hizmati: {openInfo?.delivery_price?.toLocaleString()} so'm</p>
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
                    <Button disabled={openInfo?.value < 1} className="rounded-[40px] " fullWidth color="red" onClick={() => setOpenShop({ ...openShop, _id: openInfo?._id, title: openInfo?.title, value: openInfo?.value })}>Sotib olish</Button>
                </DialogFooter>
            </Dialog>
            {/* SHOW VIDEO */}
            <Dialog open={openVideo?._id !== ''} size="lg">
                <DialogHeader className="relative flex items-center justify-between">
                    <p className="text-[17px] w-[90%]">{openVideo?.title}</p>
                    <IconButton onClick={CloseInfo} className="w-[40px] h-[40px] rounded-full text-[20px]" color="indigo">
                        <BiXCircle />
                    </IconButton>
                </DialogHeader>
                <DialogBody className="flex items-center justify-start w-full flex-col border-y gap-1 scrollbar-hide p-[10px]">
                    <video className="w-[300px] rounded-[10px]" src={openVideo?.video} controls></video>
                </DialogBody>
                <DialogFooter>
                    <Button disabled={openVideo?.value < 1} className="rounded-[40px] " fullWidth color="red" onClick={() => setOpenShop({ ...openShop, _id: openVideo?._id, title: openVideo?.title, value: openVideo?.value })}>Sotib olish</Button>
                </DialogFooter>
            </Dialog>
            {/* SHOW IMAGES */}
            <Dialog open={openImages?._id !== ''} size="lg">
                <DialogHeader className="relative flex items-center justify-between">
                    <p className="text-[17px] w-[90%]">{openImages?.title}</p>
                    <IconButton onClick={CloseInfo} className="w-[40px] h-[40px] rounded-full text-[20px]" color="indigo">
                        <BiXCircle />
                    </IconButton>
                </DialogHeader>
                <DialogBody className="flex items-center justify-start flex-wrap w-full max-h-[400px] overflow-y-scroll gap-1">
                    {openImages?.images?.map((img, i) => {
                        return (
                            <div key={i} className="flex items-center justify-center w-[250px] h-[250px] rounded-[10px] overflow-hidden">
                                <img src={img} alt="p_img" />
                            </div>
                        )
                    })}
                </DialogBody>
                <DialogFooter>
                    <Button disabled={openImages?.value < 1} className="rounded-[40px] " fullWidth color="red" onClick={() => setOpenShop({ ...openShop, _id: openImages?._id, title: openImages?.title, value: openImages?.value })}>Sotib olish</Button>
                </DialogFooter>
            </Dialog>
            {/* FORM */}
            <Dialog open={openShop?._id !== ''} size="md">
                <DialogHeader className="relative flex items-center justify-between">
                    <p className="text-[17px] w-[90%]">{openShop?.title}</p>
                    <IconButton onClick={CloseInfo} className="w-[40px] h-[40px] rounded-full text-[20px]" color="indigo">
                        <BiXCircle />
                    </IconButton>
                </DialogHeader>
                <DialogBody className="flex items-start justify-start flex-col w-full border-y gap-1 max-h-[400px] overflow-y-scroll scrollbar-hide">
                    <div className="w-full mb-[10px]">
                        <Input className="text-indigo-500" label="Ismingiz" color="indigo" value={openShop?.name} onChange={e => setOpenShop({ ...openShop, name: e.target.value })} icon={<FaUser />} />
                    </div>
                    {/*  */}
                    <div className="w-full mb-[10px]">
                        <InputMask type="tel" mask="+\9\9\8-(99)-999-99-99" value={openShop?.phone} onChange={e => setOpenShop({ ...openShop, phone: e.target.value })}>
                            {(p) => <Input {...p} color="indigo" className="text-indigo-500" label="Raqamingiz" icon={<FaPhone />} />}
                        </InputMask>
                    </div>
                </DialogBody>
                <DialogFooter>
                    <Button disabled={openShop?.value < 1} className="rounded-[40px]" onClick={CreateOrder} fullWidth color="red">Qabul qilish</Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
}

export default MainMenu;