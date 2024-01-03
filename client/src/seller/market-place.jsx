import { Button, Card, CardBody, CardFooter, CardHeader, Dialog, DialogBody, DialogFooter, DialogHeader, IconButton, Input, Radio, Spinner, Typography } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { API, ERROR_MSG } from "../config";
import toast from "react-hot-toast";
import { FaBoxesStacked, FaCalendar, FaIdBadge, FaMoneyBill, FaT, FaUser } from "react-icons/fa6";
import { FaSave, FaShoppingCart } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLoad } from "../managers/config.manager";

function SellerMarketPlace() {
    const [isLoad, setIsLaod] = useState(true);
    const [products, setProducts] = useState([]);
    const [param, setParam] = useSearchParams();
    const [supplier, setSupplier] = useState({ id: 0, name: '', created: '', products: 0 });
    const id = param?.get('id');
    useEffect(() => {
        setIsLaod(false);
        axios(`${API}/seller/get-market-place/${id}`, {
            headers: {
                'x-auth-token': `Bearer ${localStorage?.access}`
            }
        }).then(res => {
            const { ok, data, msg, supplier } = res.data;
            setIsLaod(true);
            if (!ok) {
                toast.error(msg);
            } else {
                setProducts(data);
                setSupplier(supplier);
            }
        }).catch(() => {
            setIsLaod(true);
            toast.error(ERROR_MSG);
        })
    }, [id]);
    const [openStream, setOpenStream] = useState({ _id: '', title: '', product: '', price: 0, for_seller: 0, additional: 0, type: '' });
    function CloseOpenStream() {
        setOpenStream({ _id: '', title: '', product: '', price: 0, for_seller: 0, additional: 0, type: '' });
    }
    const nv = useNavigate();
    const dp = useDispatch();
    function SubmitOpenStream() {
        dp(setLoad(true));
        const { title, _id, additional, type } = openStream;
        axios.post(`${API}/seller/create-stream`, {
            title,
            _id,
            additional: type === 'plus' ? +additional : -additional,
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
                nv('/seller/streams');
            }
        }).catch(() => {
            toast.error(ERROR_MSG);
            dp(setLoad(false));
        });
    }
    return (
        <div className="flex items-center justify-start flex-col w-full p-1 pb-[50px]">
            {/* TOP */}
            <div className="flex items-center xl:items-start justify-center xl:justify-start flex-col w-full mb-[10px]">
                <h1 className="text-[30px] sm:text-[40px] text-white animate-fade-down">MARKET</h1>
            </div>
            {/* isLoad */}
            {!isLoad &&
                <div className="flex items-center justify-center w-full h-[70vh] gap-3 text-white animate-fade-up">
                    <Spinner color="indigo" /> Kuting...
                </div>
            }
            {isLoad && !products[0] &&
                <div className="flex items-center justify-center w-full h-[70vh] gap-3 text-white animate-fade-up">
                    <p>Mahsulotlar mavjud emas : (</p>
                </div>
            }
            {/* CATEGORIES & PRODUCTS -> MAPPING */}
            {isLoad && products[0] &&
                <>
                    <div className="flex bg-white rounded p-[5px] items-start justify-start w-[90%] flex-col mb-[10px] animate-fade-down">
                        <p className="flex items-center justify-start gap-1 text-[14px] sm:text-[16px]">
                            <FaUser className="text-gray-700" />
                            Ta'minotchi: <b>{supplier?.name}</b>
                        </p>
                        <p className="flex items-center justify-start gap-1 text-[14px] sm:text-[16px]">
                            <FaIdBadge className="text-gray-700" />
                            Ta'minotchi ID: <b>{supplier?.id}</b>
                        </p>
                        <p className="flex items-center justify-start gap-1 text-[14px] sm:text-[16px]">
                            <FaBoxesStacked className="text-gray-700" />
                            Mahsulotlar: <b>{supplier?.products}</b> ta
                        </p>
                        <p className="flex items-center justify-start gap-1 text-[14px] sm:text-[16px]">
                            <FaCalendar className="text-gray-700" />
                            Loyihada: <b>{supplier?.created}</b> dan buyon
                        </p>
                    </div>
                    {/* PRODUCTS */}
                    <div className="flex items-start justify-center w-full flex-wrap gap-2">
                        {products?.map((p, i) => {
                            return (
                                <Card key={i} className="w-[90%] sm:w-[320px] animate-fade-up">
                                    <CardHeader shadow={false} floated={false} className="h-[250px]">
                                        <img
                                            src={p?.image}
                                            alt="card-image"
                                            className="h-full w-full object-cover"
                                        />
                                    </CardHeader>
                                    <CardBody>
                                        <div className="mb-2 flex items-center justify-between">
                                            <Typography color="indigo" className="font-bold">
                                                {p?.title?.length > 15 ? p?.title?.slice(0, 15) + '...' : p?.title}
                                            </Typography>
                                            <Typography color="indigo" className="font-bold">
                                                {p?.price?.toLocaleString()} so'm
                                            </Typography>
                                        </div>
                                        <div className="mb-2 flex items-center justify-between">
                                            <Typography color="gray" className="font-medium">
                                                Sotuvchi bonusi
                                            </Typography>
                                            <Typography color="gray" className="font-medium">
                                                {p?.for_seller?.toLocaleString()} so'm
                                            </Typography>
                                        </div>
                                        <div className="mb-2 flex items-center justify-between">
                                            <Typography color="gray" className="font-medium">
                                                Mavjud
                                            </Typography>
                                            <Typography color="gray" className="font-medium">
                                                {p?.value?.toLocaleString()} ta
                                            </Typography>
                                        </div>
                                    </CardBody>
                                    <CardFooter className="pt-0">
                                        <div className={`${p?.value <= 0 && 'cursor-not-allowed'}`}>
                                            <Button color="blue-gray" onClick={() => (p?.value > 0) && setOpenStream({ _id: p?._id, title: p?.title + ' - uchun oqim', product: p?.title, price: p?.price, for_seller: p?.for_seller, additional: 0, type: 'plus' })} disabled={p?.value <= 0} className={`w-full font-medium`}>
                                                Oqim ochish
                                            </Button>
                                        </div>
                                    </CardFooter>
                                </Card>
                            )
                        })}
                    </div>
                </>
            }
            <Dialog open={openStream?._id !== ''} size="md">
                <DialogHeader>
                    <p className="text-[14px] font-normal">Mahsulot: <b>{openStream?.product}</b></p>
                </DialogHeader>
                <DialogBody className="border-y">
                    {/*  TITLE */}
                    <div className="flex items-center justify-center w-full mb-[10px]">
                        <Input label="Oqim nomi: TARGET || KANAL NOMI || ..." color="indigo" onChange={e => setOpenStream({ ...openStream, title: e.target.value })} value={openStream?.title} icon={<FaT />} />
                    </div>
                    {/* + - */}
                    <div className="flex items-center justify-center w-full mb-[10px]">
                        <Input label={"Qo'shimcha ( + - ) so'm"} type="number" color="indigo" onChange={e => setOpenStream({ ...openStream, additional: e.target.value })} value={openStream?.additional} icon={<FaMoneyBill />} />
                    </div>
                    {/* TYPE */}
                    <div className="flex items-start justify-center flex-col w-full mb-[10px]">
                        {/* PLUS */}
                        <Radio id="type-1" checked={openStream?.type === 'plus'} onChange={() => setOpenStream({ ...openStream, type: 'plus' })} label="Admin puliga qo'shimcha" color="indigo" name="type" />
                        {/* MINUS */}
                        <Radio id="type-2" checked={openStream?.type === 'minus'} onChange={() => setOpenStream({ ...openStream, type: 'minus' })} label="Admin pulidan chegirma" color="indigo" name="type" />
                    </div>
                    {/* RESULT */}
                    <div className="flex items-start justify-start flex-col w-full text-[12px]">
                        {/* PRICE */}
                        <p className="flex items-center justify-center gap-[5px]"><FaShoppingCart />Sotuv narxi: <s className="text-red-500">{Number(openStream?.price)?.toLocaleString()}</s> → <span className="text-green-500">{Number(openStream?.price + (openStream?.type === 'minus' ? -openStream?.additional : +openStream?.additional))?.toLocaleString()}</span> so'm</p>
                        {/* FOR_SELLER */}
                        <p className="flex items-center justify-center gap-[5px]"><FaMoneyBill />Sotuvchi bonusi: <s className="text-red-500">{Number(openStream?.for_seller)?.toLocaleString()}</s> → <span className="text-green-500">{Number(openStream?.for_seller + (openStream?.type === 'minus' ? -openStream?.additional : +openStream?.additional))?.toLocaleString()}</span> so'm</p>
                    </div>
                </DialogBody>
                <DialogFooter className="gap-[10px]">
                    <Button color="orange" onClick={CloseOpenStream}>Ortga</Button>
                    <IconButton onClick={SubmitOpenStream} color="green">
                        <FaSave />
                    </IconButton>
                </DialogFooter>
            </Dialog>
        </div>
    );
}

export default SellerMarketPlace;