import { Button, Chip, Input, Option, Select, Spinner } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaCheckCircle, FaNewspaper, FaSearch, FaStopwatch } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { API, ERROR_MSG } from "../config";
import toast from "react-hot-toast";

function SupplierProducts() {
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [isLoad, setIsLoad] = useState(false);
    const [products, setProducts] = useState([]);
    const { refresh } = useSelector(e => e?.config)
    useEffect(() => {
        setIsLoad(false);
        axios(`${API}/supplier/get-products`, {
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

    return (
        <div className="flex items-center justify-start flex-col w-full p-[10px_5px]">
            <div className="flex items-center justify-end w-full animate-fade-up">
                <Link to='/supplier/product-add'>
                    <Button color="white" className="rounded-[4px_4px_0_0]">Mahsulot qo'shish</Button>
                </Link>
            </div>
            <div className="flex items-center justify-start flex-col w-full bg-white p-[10px] rounded-[4px_0_4px_4px] gap-3 animate-fade-up z-[999]">
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
                    {/* NO */}
                    <p className="w-[50px] h-[50px] border-r border-black flex items-center justify-center text-[14px]">No</p>
                    {/* ID */}
                    <p className="w-[70px] h-[50px] border-r border-black flex items-center justify-center text-[14px]">ID</p>
                    {/* IMAGE */}
                    <p className="w-[70px] h-[50px] border-r border-black flex items-center justify-center text-[14px]">RASMI</p>
                    {/* IMAGE */}
                    <p className="w-[250px] h-[50px] border-r border-black flex items-center justify-center text-[14px]">NOMI</p>
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
                            <div key={i} className="flex items-center justify-start border min-w-full border-black border-t-0">
                                {/* NO */}
                                <p className="w-[50px] h-[50px] border-r border-black flex items-center justify-center text-[14px]">
                                    {i + 1}
                                </p>
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
                                {/* VALUE */}
                                <p className="w-[150px] h-[50px] border-r border-black flex items-center justify-center text-[14px] relative overflow-hidden">
                                    {p?.value}
                                    {p?.value < 1 &&
                                        <div className="absolute top-0 left-0 bg-red-500 w-[150px] h-[50px] flex items-center justify-center ">
                                            <p className="text-white">Mahsulot qolmagan!</p>
                                        </div>
                                    }
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
                                <p className="w-[150px] text-center h-[50px] flex items-center justify-center text-[14px]">
                                    {p?.verified && <Chip value="Aktiv" color="green" />}
                                    {!p?.verified && <Chip value="Tekshiruvda" color="orange" />}
                                </p>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
}

export default SupplierProducts;