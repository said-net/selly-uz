import { Button, Chip, Dialog, DialogBody, DialogFooter, DialogHeader, IconButton, Input, Menu, MenuHandler, MenuItem, MenuList, Option, Popover, PopoverContent, PopoverHandler, Select, Spinner, Switch, Textarea } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaBox, FaCheckCircle, FaEdit, FaMoneyBill, FaNewspaper, FaPercent, FaPhone, FaSave, FaSearch, FaStopwatch, FaTruck } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { API, ERROR_MSG } from "../config";
import toast from "react-hot-toast";
import { BiDotsVerticalRounded, BiImageAdd } from "react-icons/bi";
import { FaBoxesPacking, FaEye, FaImage, FaRepeat, FaShop, FaTrash } from "react-icons/fa6";
import { setLoad, setRefresh } from "../managers/config.manager";

function AdminProducts() {
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [isLoad, setIsLoad] = useState(false);
    const [products, setProducts] = useState([]);
    const { refresh } = useSelector(e => e?.config);
    const [select, setSelect] = useState('');
    useEffect(() => {
        setIsLoad(false);
        axios(`${API}/admin/get-products`, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.access}`
            }
        }).then(res => {
            const { ok, data, msg } = res.data;
            setIsLoad(true);
            if (!ok) {
                toast.error(msg);
            } else {
                setProducts(data);
            }
        }).catch(() => {
            toast.error(ERROR_MSG);
            setIsLoad(true);
        })
    }, [refresh]);
    const dp = useDispatch();
    function SetActive(_id, active) {
        dp(setLoad(true));
        axios.put(`${API}/admin/set-active-product`, {
            _id,
            active
        },
            {
                headers: {
                    'x-auth-token': `Bearer ${localStorage.access}`
                }
            }
        ).then(res => {
            const { ok, msg } = res.data;
            dp(setLoad(false));
            if (!ok) {
                toast.error(msg);
            } else {
                toast.success(msg);
            }
        }).catch(() => {
            dp(setLoad(false));
            toast.error(ERROR_MSG);
        })
    }
    const [getId, setGetId] = useState({ _id: '', type: '', refresh: false });
    const [productInfo, setProductInfo] = useState({ _id: '', id: '', title: '', price: '', for_seller: '', for_operator: '', for_supplier: '', category: '', delivery_price: '', comission: '', about: '' });
    const [categories, setCategories] = useState([]);
    const [loadProduct, setLoadProduct] = useState(false);
    const [productMedia, setProductMedia] = useState({ images: [], video: '', main_image: 0 });
    // 
    useEffect(() => {
        if (getId?._id && getId?.type === 'info') {
            setLoadProduct(false);
            axios(`${API}/admin/get-product-info/${getId?._id}`, {
                headers: {
                    'x-auth-token': `Bearer ${localStorage.access}`
                }
            }).then(res => {
                const { ok, msg, data, categories } = res.data;
                setLoadProduct(true);
                if (!ok) {
                    toast.error(msg);
                } else {
                    setProductInfo(data);
                    setCategories(categories);
                }
            }).catch(() => {
                setLoadProduct(true);
                toast.error(ERROR_MSG);
            })
        } else if (getId?._id && getId?.type === 'media') {
            setLoadProduct(false);
            axios(`${API}/admin/get-product-media/${getId?._id}`, {
                headers: {
                    'x-auth-token': `Bearer ${localStorage.access}`
                }
            }).then(res => {
                const { ok, msg, data } = res.data;
                setLoadProduct(true);
                if (!ok) {
                    toast.error(msg);
                } else {
                    setProductMedia(data);
                }
            }).catch(() => {
                setLoadProduct(true);
                toast.error(ERROR_MSG);
            })
        }
    }, [getId]);
    // 
    const [forSupplier, setForSupplier] = useState(0);
    // 
    useEffect(() => {
        const { price, for_seller, for_operator, comission } = productInfo
        setForSupplier(Number(price) - (Number(for_seller) + Number(for_operator) + Number(comission)))
    }, [productInfo]);
    // 

    function CloseProductInfo() {
        setGetId({ _id: '', type: '' });
        setProductInfo({ _id: '', id: '', title: '', price: '', for_seller: '', for_operator: '', for_supplier: '', category: '', delivery_price: '', comission: '' });
        setCategories([]);
        setLoadProduct(false);
        setForSupplier(0);
    }
    function SetProductInfo() {
        dp(setLoad(true));
        const { title, price, for_seller, _id, for_operator, category, comission, about, delivery_price } = productInfo;
        axios.put(`${API}/admin/set-product-info`, {
            title,
            price,
            for_seller,
            for_supplier: forSupplier,
            _id,
            for_operator,
            category,
            comission,
            about,
            delivery_price
        },
            {
                headers: {
                    'x-auth-token': `Bearer ${localStorage.access}`
                }
            }
        ).then(res => {
            const { ok, msg } = res.data;
            dp(setLoad(false));
            if (!ok) {
                toast.error(msg);
            } else {
                toast.success(msg);
                CloseProductInfo();
                dp(setRefresh())
            }
        }).catch(() => {
            dp(setLoad(false));
            toast.error(ERROR_MSG);
        })
    }
    function SetProductMainImage(main_image) {
        dp(setLoad(true));
        axios.put(`${API}/admin/edit-product-main-image`, {
            _id: getId?._id,
            main_image
        }, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.access}`
            }
        }).then(res => {
            dp(setLoad(false));
            const { ok, msg } = res.data;
            if (!ok) {
                toast.error(msg);
            } else {
                toast.success(msg);
                setProductMedia({ ...productMedia, main_image });
                dp(setRefresh());
            }
        }).catch(() => {
            dp(setLoad(false));
            toast.error(ERROR_MSG);
        })
    }
    function EditImageProduct(index, img) {
        dp(setLoad(true));
        axios.putForm(`${API}/admin/edit-product-image`, {
            _id: getId?._id,
            index,
            image: img
        }, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.access}`
            }
        }).then(res => {
            dp(setLoad(false));
            const { ok, msg } = res.data;
            if (!ok) {
                toast.error(msg);
            } else {
                toast.success(msg);
                dp(setRefresh());
                setGetId({ ...getId, refresh: !getId?.refresh })
            }
        }).catch(() => {
            dp(setLoad(false));
            toast.error(ERROR_MSG);
        })
    }
    function DeleteImageProduct(index) {
        dp(setLoad(true));
        axios.delete(`${API}/admin/delete-product-image/${getId?._id}/${index}`, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.access}`
            }
        }).then(res => {
            dp(setLoad(false));
            const { ok, msg } = res.data;
            if (!ok) {
                toast.error(msg);
            } else {
                toast.success(msg);
                dp(setRefresh());
                setGetId({ ...getId, refresh: !getId?.refresh })
            }
        }).catch(() => {
            dp(setLoad(false));
            toast.error(ERROR_MSG);
        })
    }
    function AddImageProduct(image) {
        dp(setLoad(true));
        axios.postForm(`${API}/admin/add-product-image`, {
            _id: getId?._id,
            image
        }, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.access}`
            }
        }).then(res => {
            dp(setLoad(false));
            const { ok, msg } = res.data;
            if (!ok) {
                toast.error(msg);
            } else {
                toast.success(msg);
                dp(setRefresh());
                setGetId({ ...getId, refresh: !getId?.refresh })
            }
        }).catch(() => {
            dp(setLoad(false));
            toast.error(ERROR_MSG);
        })

    }
    function EditVideoProduct(video) {
        dp(setLoad(true));
        axios.putForm(`${API}/admin/edit-product-video`, {
            _id: getId?._id,
            video
        }, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.access}`
            }
        }).then(res => {
            dp(setLoad(false));
            const { ok, msg } = res.data;
            if (!ok) {
                toast.error(msg);
            } else {
                toast.success(msg);
                dp(setRefresh());
                setGetId({ ...getId, refresh: !getId?.refresh })
            }
        }).catch(() => {
            dp(setLoad(false));
            toast.error(ERROR_MSG);
        })
    }
    // 
    function RejectProduct(_id) {
        dp(setLoad(true));
        axios.post(`${API}/admin/reject-product`, {
            _id,
        }, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.access}`
            }
        }).then(res => {
            dp(setLoad(false));
            const { ok, msg } = res.data;
            if (!ok) {
                toast.error(msg);
            } else {
                toast.success(msg);
                dp(setRefresh());
            }
        }).catch(() => {
            dp(setLoad(false));
            toast.error(ERROR_MSG);
        })
    }
    function VerifyProduct(_id) {
        dp(setLoad(true));
        axios.post(`${API}/admin/verify-product`, {
            _id
        }, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.access}`
            }
        }).then(res => {
            dp(setLoad(false));
            const { ok, msg } = res.data;
            if (!ok) {
                toast.error(msg);
            } else {
                toast.success(msg);
                dp(setRefresh());
            }
        }).catch(() => {
            dp(setLoad(false));
            toast.error(ERROR_MSG);
        })
    }
    return (
        <div className="flex items-center justify-start flex-col w-full p-[50px_5px] xl:py-[10px]">
            <div className="flex items-center justify-start flex-col w-full bg-white p-[10px] rounded gap-3 animate-fade-up z-[999]">
                <Input label="Mahsulot nomi" color="indigo" onChange={e => setSearch(e.target.value)} value={search} icon={<FaSearch />} />
                <Select color="indigo" onChange={e => setFilter(e)} value={filter} label="Status filteri" >
                    <Option value="all">
                        <FaNewspaper className="inline" />
                        Barchasi
                    </Option>
                    <Option value="pending">
                        <FaStopwatch className="inline" />
                        Tekshiruvda
                    </Option>
                    <Option value="active">
                        <FaCheckCircle className="inline" />
                        Aktiv
                    </Option>
                </Select>
            </div>
            <div className="flex bg-white rounded items-start p-[10px] justify-start flex-col w-full overflow-x-scroll mt-[10px] animate-fade-up">
                {/* SCHEMA */}
                <div className="flex items-center justify-start border min-w-full border-black">
                    {/* ACTION */}
                    <p className="w-[70px] h-[50px] border-r border-black flex items-center justify-center text-[14px]">
                        MENU
                    </p>
                    {/* NO */}
                    <p className="w-[50px] h-[50px] border-r border-black flex items-center justify-center text-[14px]">No</p>
                    {/* STATUS */}
                    <p className="w-[100px] h-[50px] border-r border-black flex items-center justify-center text-[14px]">STATUS</p>
                    {/* ID */}
                    <p className="w-[70px] h-[50px] border-r border-black flex items-center justify-center text-[14px]">ID</p>
                    {/* IMAGE */}
                    <p className="w-[70px] h-[50px] border-r border-black flex items-center justify-center text-[14px]">RASMI</p>
                    {/* IMAGE */}
                    <p className="w-[250px] h-[50px] border-r border-black flex items-center justify-center text-[14px]">NOMI</p>
                    {/* SUPPLIER NAME */}
                    <p className="w-[150px] h-[50px] border-r border-black flex items-center justify-center text-[14px]">TAMINOTCHI</p>
                    {/* SUPPLIER ID */}
                    <p className="w-[150px] h-[50px] border-r border-black flex items-center justify-center text-[14px]">TAMINOTCHI ID'si</p>
                    {/* SUPPLIER_PHONE */}
                    <p className="w-[150px] h-[50px] border-r border-black flex items-center justify-center text-[14px]">TAMINOTCHI RAQAMI</p>
                    {/* VALUE */}
                    <p className="w-[150px] h-[50px] border-r border-black flex items-center justify-center text-[14px]">MAVJUD( TA )</p>
                    {/* CATEGORY */}
                    <p className="w-[150px] h-[50px] border-r border-black flex items-center justify-center text-[14px]">KATEGORIYA</p>
                    {/* PRICE */}
                    <p className="w-[150px] h-[50px] border-r border-black flex items-center justify-center text-[14px]">NARXI( SO'M )</p>
                    {/* COMISSION */}
                    <p className="w-[150px] h-[50px] border-r border-black flex items-center justify-center text-[14px]">KOMISSIYA( SO'M )</p>
                    {/* FOR_SELLER */}
                    <p className="w-[180px] text-center h-[50px] border-r border-black flex items-center justify-center text-[14px]">SOTUVCHI UCHUN( SO'M )</p>
                    {/* FOR_OPERATOR */}
                    <p className="w-[180px] text-center h-[50px] border-r border-black flex items-center justify-center text-[14px]">OPERATOR UCHUN( SO'M )</p>
                    {/* FOR_SUPPLIER */}
                    <p className="w-[180px] text-center h-[50px] border-r border-black flex items-center justify-center text-[14px]">QOLADI( SO'M )</p>
                    {/* CREATED */}
                    <p className="w-[180px] text-center h-[50px] border-r border-black flex items-center justify-center text-[14px]">SAYTAG KIRITILGAN</p>
                    {/* NEW_ORDERS */}
                    <p className="w-[180px] text-center h-[50px] border-r border-black flex items-center justify-center text-[14px]">YANGI BUYURTMALAR( TA )</p>
                    {/* SUCCESS_ORDER */}
                    <p className="w-[180px] text-center h-[50px] border-r border-black flex items-center justify-center text-[14px]">QABUL QILINGAN BUYURTMALAR( TA )</p>
                    {/* SENDED_ORDERS */}
                    <p className="w-[180px] text-center h-[50px] border-r border-black flex items-center justify-center text-[14px]">YUBORILGAN BUYURTMALAR( TA )</p>
                    {/* DELIVERED_ORDERS */}
                    <p className="w-[180px] text-center h-[50px] border-r border-black flex items-center justify-center text-[14px]">YETKAZILGAN BUYURTMALAR( TA )</p>
                    {/* COMMING_PROFIT */}
                    <p className="w-[180px] text-center h-[50px] border-r border-black flex items-center justify-center text-[14px]">KUTILAYOTGAN FOYDA( SO'M )</p>
                    {/* PROFIT */}
                    <p className="w-[180px] text-center h-[50px] border-r border-black flex items-center justify-center text-[14px]">FOYDA( SO'M )</p>
                    {/* STATUS */}
                    <p className="w-[150px] text-center h-[50px] flex items-center justify-center text-[14px]">HOLAT</p>
                </div>
                {/* ISLOAD */}
                {!isLoad &&
                    <div className="flex items-center justify-center gap-3 w-full h-[40vh]">
                        <Spinner color="indigo" />
                        Kuting...
                    </div>
                }
                {isLoad && !products[0] &&
                    <div className="flex items-center justify-center gap-3 w-full h-[40vh]">
                        <p>Mahsulotlar mavjud emas!</p>
                    </div>
                }
                {isLoad && products[0] &&
                    products?.filter(p => filter === 'all' ? p : filter === 'active' ? p?.verified : !p?.verified)?.filter(p => p?.title?.toLowerCase()?.includes(search?.toLowerCase()))?.map((p, i) => {
                        return (
                            <div onClick={() => setSelect(p?._id)} key={i} className={`flex items-center justify-start border min-w-full border-black border-t-0 ${select === p?._id && 'bg-gray-300'}`}>
                                {/* ACTION */}
                                <div className="w-[70px] h-[50px] border-r border-black flex items-center justify-center text-[14px]">
                                    <Menu placement="bottom-start">
                                        <MenuHandler>
                                            <IconButton className="rounded-full text-[20px]" color="indigo">
                                                <BiDotsVerticalRounded />
                                            </IconButton>
                                        </MenuHandler>
                                        <MenuList>
                                            <MenuItem onClick={() => setGetId({ ...getId, _id: p?._id, type: 'media' })} className="flex items-center justify-start gap-2">
                                                <FaImage />
                                                Video & Rasmlarni taxrirlash
                                            </MenuItem>
                                            <MenuItem onClick={() => setGetId({ ...getId, _id: p?._id, type: 'info' })} className="flex items-center justify-start gap-2">
                                                <FaEdit />
                                                Ma'lumotlarni taxrirlash
                                            </MenuItem>
                                            <div className={`w-full h-[2px] bg-blue-gray-300 ${!p?.verified ? 'flex' : 'hidden'}`}></div>
                                            <MenuItem onClick={()=>VerifyProduct(p?._id)} className={`text-green-500 items-center justify-start gap-2 ${!p?.verified ? 'flex' : 'hidden'}`}>
                                                <FaCheckCircle />
                                                Tasdiqlash
                                            </MenuItem>
                                            <MenuItem onClick={()=>RejectProduct(p?._id)} className={`text-red-500 items-center justify-start gap-2 ${!p?.verified ? 'flex' : 'hidden'}`}>
                                                <FaTrash />
                                                Rad etish & O'chirib tashlash
                                            </MenuItem>
                                        </MenuList>
                                    </Menu>
                                </div>
                                {/* NO */}
                                <p className="w-[50px] h-[50px] border-r border-black flex items-center justify-center text-[14px]">
                                    {i + 1}
                                </p>
                                {/* STATUS */}
                                <div className="w-[100px] h-[50px] border-r border-black flex items-center justify-center text-[14px]">
                                    <Switch disabled={p?.value < 1} defaultChecked={p?.active} color="green" onChange={e => SetActive(p?._id, e.target.checked)} id={p?.id} />
                                </div>
                                {/* ID */}
                                <p className="w-[70px] h-[50px] border-r border-black flex items-center justify-center text-[14px]">
                                    {p?.id}
                                </p>
                                {/* IMAGE */}
                                <div className="w-[70px] h-[50px] border-r border-black flex items-center justify-center text-[14px]">
                                    <div className="flex items-center justify-center w-[40px] h-[40px] rounded-full overflow-hidden border">
                                        <img src={p?.image} alt="p_img" />
                                    </div>
                                </div>
                                {/* TITLE */}
                                <p className="w-[250px] h-[50px] border-r border-black flex items-center justify-center text-[14px] text-center">
                                    {p?.title}
                                </p>
                                <p className="w-[150px] h-[50px] border-r border-black flex items-center justify-center text-[14px]">
                                    {p?.supplier}
                                </p>
                                {/* SUPPLIER ID */}
                                <p className="w-[150px] h-[50px] border-r border-black flex items-center justify-center text-[14px]">
                                    {p?.supplier_id}
                                </p>
                                {/* SUPPLIER_PHONE */}
                                <p className="w-[150px] h-[50px] border-r border-black flex items-center justify-center text-[14px]">
                                    {p?.supplier_phone}
                                </p>
                                {/* VALUE */}
                                <p className="w-[150px] h-[50px] border-r border-black flex items-center justify-center text-[14px]">
                                    {p?.value}
                                </p>
                                {/* CATEGORY */}
                                <div className="w-[150px] h-[50px] border-r border-black flex items-center justify-center text-[14px] gap-1">
                                    <div className="flex items-center justify-center w-[30px] h-[30px] overflow-hidden border rounded-full p-[5px]" style={{ background: p?.category_color }}>
                                        <img src={p?.category_image} alt="c_img" />
                                    </div>
                                    <p>{p?.category}</p>
                                </div>
                                {/* PRICE */}
                                <p className="w-[150px] h-[50px] border-r border-black flex items-center justify-center text-[14px]">
                                    {p?.price?.toLocaleString()}
                                </p>
                                {/* COMISSION */}
                                <p className="w-[150px] h-[50px] border-r border-black flex items-center justify-center text-[14px]">
                                    {p?.comission?.toLocaleString()}
                                </p>
                                {/* FOR_SELLER */}
                                <p className="w-[180px] text-center h-[50px] border-r border-black flex items-center justify-center text-[14px]">
                                    {p?.for_seller?.toLocaleString()}
                                </p>
                                {/* FOR_OPERATOR */}
                                <p className="w-[180px] text-center h-[50px] border-r border-black flex items-center justify-center text-[14px]">
                                    {p?.for_operator?.toLocaleString()}
                                </p>
                                {/* FOR_SUPPLIER */}
                                <p className="w-[180px] text-center h-[50px] border-r border-black flex items-center justify-center text-[14px]">
                                    {p?.for_supplier?.toLocaleString()}
                                </p>
                                {/* CREATED */}
                                <p className="w-[180px] text-center h-[50px] border-r border-black flex items-center justify-center text-[14px]">
                                    {p?.created}
                                </p>
                                {/* NEW_ORDERS */}
                                <p className="w-[180px] text-center h-[50px] border-r border-black flex items-center justify-center text-[14px]">
                                    {p?.new_orders?.toLocaleString()}
                                </p>
                                {/* SUCCESS_ORDER */}
                                <p className="w-[180px] text-center h-[50px] border-r border-black flex items-center justify-center text-[14px]">
                                    {p?.success?.toLocaleString()}
                                </p>
                                {/* SENDED_ORDERS */}
                                <p className="w-[180px] text-center h-[50px] border-r border-black flex items-center justify-center text-[14px]">
                                    {p?.sended?.toLocaleString()}
                                </p>
                                {/* DELIVERED_ORDERS */}
                                <p className="w-[180px] text-center h-[50px] border-r border-black flex items-center justify-center text-[14px]">
                                    {p?.delivered?.toLocaleString()}
                                </p>
                                {/* COMMING_PROFIT */}
                                <p className="w-[180px] text-center h-[50px] border-r border-black flex items-center justify-center text-[14px]">
                                    {p?.comming_profit?.toLocaleString()}
                                </p>
                                {/* PROFIT */}
                                <p className="w-[180px] text-center h-[50px] border-r border-black flex items-center justify-center text-[14px]">
                                    {p?.profit?.toLocaleString()}
                                </p>
                                {/* STATUS */}
                                <div className="w-[150px] text-center h-[50px] flex items-center justify-center text-[14px]">
                                    {p?.verified && <Chip value="Aktiv" color="green" />}
                                    {!p?.verified && <Chip value="Tekshiruvda" color="orange" />}
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            {/* INFO */}
            <Dialog size="xl" open={getId?._id !== '' && getId?.type === 'info'}>
                <DialogHeader>
                    <p className="text-[16px]">Mahsulotni taxririlash</p>
                </DialogHeader>
                <DialogBody className="border-y overflow-y-scroll h-[400px]">
                    {!loadProduct &&
                        <div className="flex items-center justify-center gap-3 w-full h-[450px]">
                            <Spinner color="indigo" /> Kuting...
                        </div>
                    }
                    {loadProduct &&
                        <>
                            {/* TITLE & PRICE */}
                            <div className="flex items-center justify-center w-full gap-3 flex-col md:flex-row mb-[10px]">
                                <Input color="indigo" label="Mahsulot nomi" required onChange={e => setProductInfo({ ...productInfo, title: e.target.value })} value={productInfo?.title} icon={<FaBox />} />
                                <Input color="indigo" type="number" label="Sotuv narxi( SO'M )" required onChange={e => setProductInfo({ ...productInfo, price: e.target.value })} value={productInfo?.price} icon={<FaMoneyBill />} />
                            </div>
                            {/* FOR SELLER & FOR OPERATOR */}
                            <div className="flex items-center justify-center w-full gap-3 flex-col md:flex-row mb-[10px]">
                                <Input color="indigo" type="number" label="Sotuvchi uchun( SO'M )" required onChange={e => setProductInfo({ ...productInfo, for_seller: e.target.value })} value={productInfo?.for_seller} icon={<FaShop />} />
                                <Input color="indigo" type="number" label="Operator uchun( SO'M )" required onChange={e => setProductInfo({ ...productInfo, for_operator: e.target.value })} value={productInfo?.for_operator} icon={<FaPhone />} />
                            </div>
                            {/* COMISSION & FOR SUPPLIER */}
                            <div className="flex items-center justify-center w-full gap-3 flex-col md:flex-row mb-[10px]">
                                <Input color="indigo" type="number" label="Komissiya( SO'M )" required onChange={e => setProductInfo({ ...productInfo, comission: e.target.value })} value={productInfo?.comission} icon={<FaPercent />} />
                                <Input onChange={() => { }} color="indigo" type="number" label="Ta'minotchi uchun( SO'M )" required value={forSupplier} icon={<FaBoxesPacking />} />
                            </div>
                            {/* CATEGORY & DELIVERY_PRICE */}
                            <div className="flex items-center justify-center w-full gap-3 flex-col md:flex-row mb-[10px]">
                                <Select label="Kategoriya tanlang" required color="indigo" onChange={e => setProductInfo({ ...productInfo, category: e })} value={productInfo?.category}>
                                    {categories.map((c, i) =>
                                        <Option className="flex gap-2" key={i} value={c?._id}>
                                            <div className="items-center justify-center w-[20px] h-[20px] rounded-full p-[2px] border inline-flex" style={{ background: c?.color }}>
                                                <img src={c?.image} alt="c_img" />
                                            </div>
                                            {c?.title}
                                        </Option>
                                    )}
                                </Select>
                                <Input onChange={e => setProductInfo({ ...productInfo, delivery_price: e.target.value })} color="indigo" type="number" label="Yetkzaib berish xizmati( SO'M )" required value={productInfo?.delivery_price} icon={<FaTruck />} />
                            </div>
                            {/* ABOUT */}
                            <div className="flex items-center justify-center w-full gap-3 flex-col md:flex-row mb-[10px]">
                                <Textarea rows={7} label="Mahsulot tavsifi" color="indigo" onChange={e => setProductInfo({ ...productInfo, about: e.target.value })} value={productInfo.about} />
                            </div>
                        </>
                    }
                </DialogBody>
                <DialogFooter className="gap-3">
                    <Button color="orange" onClick={CloseProductInfo}>Ortga</Button>
                    <IconButton onClick={SetProductInfo} color="green" className="text-[20px]">
                        <FaSave />
                    </IconButton>
                </DialogFooter>
            </Dialog>
            {/* MEDIA */}
            <Dialog size="xl" open={getId?._id !== '' && getId?.type === 'media'}>
                <DialogHeader>
                    <p className="text-[16px]">Mahsulot mediasini taxririlash</p>
                </DialogHeader>
                <DialogBody className="border-y overflow-y-scroll h-[400px]">
                    {!loadProduct &&
                        <div className="flex items-center justify-center gap-3 w-full h-[450px]">
                            <Spinner color="indigo" /> Kuting...
                        </div>
                    }
                    {loadProduct &&
                        <>
                            {/* IMAGES */}
                            <div className="flex items-center justify-center gap-[10px] w-full">
                                <span className="w-[30%] h-[1px] bg-blue-gray-300" />
                                <p>RASMLAR</p>
                                <span className="w-[30%] h-[1px] bg-blue-gray-300" />
                            </div>
                            <div className="flex items-center justify-center w-full flex-wrap gap-3">
                                <div className="flex items-center justify-center w-[100px] md:w-[150px] h-[100px] md:h-[150px] rounded border border-gray-500 overflow-hidden relative">
                                    <label className="w-[100px] md:w-[150px] h-[100px] md:h-[150px] flex items-center justify-center">
                                        <BiImageAdd className="text-[60px]" />
                                        <input type="file" accept="image/*" className="hidden" onChange={e => AddImageProduct(e.target.files[0])} />
                                    </label>
                                </div>
                                {/* MAPPING */}
                                {productMedia?.images?.map((img, i) => {
                                    return (
                                        <div key={i} className="flex items-center justify-center w-[100px] md:w-[150px] h-[100px] md:h-[150px] rounded border border-gray-500 overflow-hidden relative">
                                            {/* IMG */}
                                            <div className="absolute flex items-center justify-center top-0 right-0 bg-white rounded-[0_4px_0_4px] border p-[5px_10px] gap-1">
                                                <label>
                                                    <FaRepeat className="text-[12px] cursor-pointer text-indigo-500" />
                                                    <input type="file" accept="image/*" className="hidden" onChange={e => EditImageProduct(i, e.target.files[0])} />
                                                </label>
                                                {i !== productMedia?.main_image &&
                                                    <FaTrash onClick={() => DeleteImageProduct(i)} className="text-[12px] cursor-pointer text-red-500" />
                                                }
                                            </div>
                                            <img src={img} alt="p_img" />
                                            {/* MAIN_IMAGE */}
                                            <div onClick={() => SetProductMainImage(i)} className={`flex items-center justify-center absolute bottom-0 left-0 w-full cursor-pointer ${productMedia?.main_image === i ? 'bg-indigo-500 text-white' : 'bg-gray-300 text-gray-600'}`}>
                                                <p className="text-[12px]">Asosiy rasm</p>
                                            </div>
                                        </div>
                                    )
                                })}
                                <div className="flex items-center justify-center gap-[10px] w-full">
                                    <span className="w-[30%] h-[1px] bg-blue-gray-300" />
                                    <p>VIDEO</p>
                                    <span className="w-[30%] h-[1px] bg-blue-gray-300" />
                                </div>
                                <div className="flex items-center justify-center w-[180px] h-[320px]  rounded border border-gray-500 overflow-hidden relative">
                                    <div className="absolute flex items-center justify-center top-0 right-0 bg-white rounded-[0_4px_0_4px] border p-[5px_10px] gap-1">
                                        <label>
                                            <FaRepeat className="text-[12px] cursor-pointer text-indigo-500" />
                                            <input type="file" accept="video/mp4" className="hidden" onChange={e => EditVideoProduct(e.target.files[0])} />
                                        </label>
                                    </div>
                                    <video src={productMedia?.video} controls />
                                </div>
                            </div>
                        </>
                    }
                </DialogBody>
                <DialogFooter className="gap-3">
                    <Button color="orange" onClick={CloseProductInfo}>Ortga</Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
}

export default AdminProducts;