import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Input, Option, Select, Spinner, Textarea } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaBox, FaBoxesStacked, FaImages, FaInfinity, FaMoneyBill, FaUser, FaVideo } from 'react-icons/fa6'
import { API, ERROR_MSG } from "../config";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setLoad, setRefresh } from "../managers/config.manager";
import { useNavigate } from "react-router-dom";
function SupplierProductAdd() {
    const [state, setState] = useState({ title: '', about: '', price: '', for_seller: '', images: [], video: '', main_image: 0, value: '', category: '' });
    const [comission, setComission] = useState(0);// 0.01 === 1;
    const [for_operator, setForOperator] = useState(0);
    const [categories, setCategories] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const [reload, setReload] = useState(false);
    const [viewComission, setViewComission] = useState(false);
    useEffect(() => {
        if (state?.price > 10000 && state?.price <= 99999) {
            setComission(0.12);
            setForOperator(5000);
        } else if (state?.price > 99999 && state?.price <= 199999) {
            setComission(0.1);
            setForOperator(6000);
        } else if (state?.price > 199999 && state?.price <= 299999) {
            setComission(0.09);
            setForOperator(8000);
        } else if (state?.price > 299999) {
            setComission(0.08);
            setForOperator(10000);
        }
    }, [state]);
    // 
    useEffect(() => {
        setIsLoad(false);
        axios(`${API}/category/get-all`).then(res => {
            const { ok, data } = res.data;
            setIsLoad(true);
            if (ok) {
                setCategories(data);
            }
        }).catch(() => {
            // RELOAD
            setReload(!reload);
        });
    }, [reload]);
    // 
    function SetImages(images) {
        if ([...images].length > 5) {
            toast.error("5 tadan ko'p rasm tanlash mumkin emas!");
        } else {
            setState({ ...state, images });
        }
    }
    const dp = useDispatch();
    const nv = useNavigate()
    function Submit() {
        const { title, about, price, for_seller, images, video, value, category } = state;
        if (!title) {
            toast.error("Mahsulot nomini kiriting!");
        } else if (!about) {
            toast.error("Mahsulot tavsifini kiriting!");
        } else if (!for_seller || for_seller < 25000) {
            toast.error("Sotuvchi uchun summa belgilang ( MIN: 25 000 SO'M )");
        } else if (!price || price < 10000) {
            toast.error("Sotuv narxini belgilang ( MIN: 10 000 SO'M )");
        } else if (!value || value < 20) {
            toast.error("Eng kam mahsulot soni 20 ta bo'lishi kerak!");
        } else if (![...images][1]) {
            toast.error("Kamida 2 ta rasm tanlang!");
        } else if (!video) {
            toast.error("Video tanlang!");
        } else if (!category) {
            toast.error("Kategoriya tanlang!");
        } else {
            dp(setLoad(true));
            axios.postForm(`${API}/supplier/create-product`, { ...state, comission: Number(price * comission), for_operator, for_supplier: (Number(Number(price) - (Number(price * comission) + for_operator + Number(for_seller || 0)))) }, {
                headers: {
                    'x-auth-token': `Bearer ${localStorage.getItem('access')}`
                }
            }).then((res) => {
                const { ok, msg } = res.data;
                dp(setLoad(false));
                if (ok) {
                    toast.success(msg);
                    dp(setRefresh())
                    setTimeout(() => {
                        nv('/supplier/products');
                    }, 1000);
                } else {
                    toast.error(msg);
                }
            }).catch(() => {
                toast.error(ERROR_MSG);
                dp(setLoad(false));
            })
        }
    }
    return (
        <div className="flex items-center justify-start flex-col w-full p-[10px_5px] relative">
            <div className="flex items-center justify-end w-full animate-fade-up">
                <Button onClick={() => setViewComission(true)} color="white" className="rounded-[4px_4px_0_0]">
                    komissiya bilan tanishish
                </Button>
            </div>
            <div className="flex items-start justify-center w-full flex-wrap bg-white rounded-[4px_0_4px_4px] p-[10px] animate-fade-up gap-[10px]">
                {!isLoad &&
                    <div className="flex items-center justify-center gap-3">
                        <Spinner color="indigo" />
                        Kuting...
                    </div>
                }
                {isLoad &&
                    <>
                        <h1 className="text-indigo-500 text-[20px]">MAHSULOT QO'SHISH</h1>
                        {/* TITLE  & VALUE*/}
                        <div className="flex items-center justify-center w-full flex-col md:flex-row gap-[10px]">
                            <Input label="Mahsulot nomi" color="indigo" icon={<FaBox />} onChange={e => setState({ ...state, title: e.target.value })} value={state.title} required />
                            {/*  */}
                            <Input label="Nechta maxsulot mavjud" type="number" color="indigo" icon={<FaBoxesStacked />} onChange={e => setState({ ...state, value: e.target.value })} value={state.value} required />
                        </div>
                        {/* PRICE  & FOR_SELLER*/}
                        <div className="flex items-center justify-center w-full flex-col md:flex-row gap-[10px]">
                            <Input label="Mahsulot sotuv narxi( SO'M )" type="number" color="indigo" icon={<FaMoneyBill />} onChange={e => setState({ ...state, price: e.target.value })} value={state.price} required />
                            {/*  */}
                            <Input label="Sotuvchi uchun( SO'M )" type="number" color="indigo" icon={<FaUser />} onChange={e => setState({ ...state, for_seller: e.target.value })} value={state.for_seller} required />
                        </div>
                        {/* CATEGORY  & VIDEO*/}
                        <div className="flex items-center justify-center w-full flex-col md:flex-row gap-[10px]">
                            <Select label="Kategoriya tanlang" required color="indigo" onChange={e => setState({ ...state, category: e })} value={state?.category}>
                                {categories.map((c, i) =>
                                    <Option className="flex gap-2" key={i} value={c?._id}>
                                        <div className="items-center justify-center w-[20px] h-[20px] rounded-full p-[2px] border inline-flex" style={{ background: c?.color }}>
                                            <img src={c?.image} alt="c_img" />
                                        </div>
                                        {c?.title}
                                    </Option>
                                )}
                            </Select>
                            {/*  */}
                            <Input label="Mahsulot videosi( CREATIVE )" type="file" accept="video/*" color="indigo" icon={<FaVideo />} onChange={e => setState({ ...state, video: e.target.files[0] })} required />
                        </div>
                        {/* IMAGES & MAIN_IMAGE */}
                        <div className="flex items-center justify-center w-full flex-col md:flex-row gap-[10px]">
                            <Input label="Mahsulot rasmlari( MAX: 5 )" type="file" accept="image/*" multiple color="indigo" icon={<FaImages />} onChange={e => SetImages(e?.target?.files)} required />
                            {/*  */}
                            <div className="flex items-center justify-start gap-3 w-full border h-[40px] rounded-[6px] border-blue-gray-200 relative">
                                {/*  */}
                                <p className="text-[12px] text-blue-gray-300 absolute top-[-10px] left-[12px] bg-white px-[5px] rounded-full">Asosiy rasm</p>
                                {/*  */}
                                {!state?.images[0] && <p className="text-blue-gray-400 px-[12px]">Rasm tanlanmadi</p>}
                                {/*  */}
                                {state?.images[0] &&
                                    <div className="flex items-center justify-start w-full px-[20px] gap-3">
                                        {[...state?.images]?.map((img, i) => {
                                            return (
                                                <div key={i} onClick={() => setState({ ...state, main_image: i })} className={`flex items-center justify-center w-[30px] h-[30px] rounded border ${state?.main_image === i ? 'border-indigo-500 border-2' : 'border-blue-gray-400'} overflow-hidden cursor-pointer`}>
                                                    <img src={URL.createObjectURL(img)} alt="" />
                                                </div>
                                            )
                                        })}
                                    </div>
                                }
                            </div>
                        </div>
                        {/*ABOUT*/}
                        <div className="flex items-center justify-center w-full flex-col md:flex-row gap-[10px]">
                            <Textarea rows={10} label="Mahsulot tavsifi" color="indigo" onChange={e => setState({ ...state, about: e.target.value })} value={state.about} required />
                        </div>
                        {state?.value > 0 && state?.price > 10000 &&
                            <>
                                {/* CALCULATE */}
                                <div className="flex items-center justify-center w-full gap-3">
                                    <span className="w-[10%] md:w-[28%] h-[2px] bg-blue-gray-300 rounded" />
                                    <p className="uppercase md:text-[16px] text-[10px]">hisobot</p>
                                    <span className="w-[10%] md:w-[28%] h-[2px] bg-blue-gray-300 rounded" />
                                </div>
                                <div className="flex items-start justify-start w-full overflow-x-scroll flex-col">
                                    {/* STRUCT */}
                                    <div className="flex items-center justify-start border border-black">
                                        {/* TYPE / INDIVIDUAL / TOTAL */}
                                        <p className="w-[150px] text-[12px] flex items-center justify-center h-[50px] border-r border-black">TURI</p>
                                        {/* COMISSION */}
                                        <p className="w-[150px] text-[12px] flex items-center justify-center h-[50px] border-r border-black">KOMISSIYA( SO'M )</p>
                                        {/* FOR OPERS */}
                                        <p className="w-[180px] text-[12px] flex items-center justify-center h-[50px] border-r border-black">OPERATOR ULUSHI( SO'M )</p>
                                        {/* FOR SELLERS */}
                                        <p className="w-[180px] text-[12px] flex items-center justify-center h-[50px] border-r border-black">SOTUVCHI ULUSHI( SO'M )</p>
                                        {/* PROFIT */}
                                        <p className="w-[180px] text-[12px] flex items-center justify-center h-[50px] border-black">SIZ UCHUN FOYDA( SO'M )</p>
                                    </div>
                                    {/* INDIVIDUAL */}
                                    <div className="flex items-center border-t-0 justify-start border border-black">
                                        {/* TYPE / INDIVIDUAL / TOTAL */}
                                        <p className="w-[150px] text-[12px] flex items-center justify-center h-[50px] border-r border-black">1 - TA MAHSULOT</p>
                                        {/* COMISSION */}
                                        <p className="w-[150px] text-[12px] flex items-center justify-center h-[50px] border-r border-black">
                                            {Number(state?.price * comission)?.toLocaleString()}
                                        </p>
                                        {/* FOR OPERS */}
                                        <p className="w-[180px] text-[12px] flex items-center justify-center h-[50px] border-r border-black">
                                            {for_operator?.toLocaleString()}
                                        </p>
                                        {/* FOR SELLERS */}
                                        <p className="w-[180px] text-[12px] flex items-center justify-center h-[50px] border-r border-black">
                                            {Number(state?.for_seller)?.toLocaleString()}
                                        </p>
                                        {/* PROFIT */}
                                        <p className="w-[180px] text-[12px] flex items-center justify-center h-[50px] border-black">
                                            {(Number(Number(state?.price) - (Number(state?.price * comission) + for_operator + Number(state?.for_seller || 0))))?.toLocaleString()}
                                        </p>
                                    </div>
                                    {/* TOTAL */}
                                    <div className="flex items-center border-t-0 justify-start border border-black">
                                        {/* TYPE / INDIVIDUAL / TOTAL */}
                                        <p className="w-[150px] text-[12px] flex items-center justify-center h-[50px] border-r border-black">{Number(state?.value)?.toLocaleString()} - TA MAHSULOT</p>
                                        {/* COMISSION */}
                                        <p className="w-[150px] text-[12px] flex items-center justify-center h-[50px] border-r border-black">
                                            {Number(state?.price * comission * state?.value)?.toLocaleString()}
                                        </p>
                                        {/* FOR OPERS */}
                                        <p className="w-[180px] text-[12px] flex items-center justify-center h-[50px] border-r border-black">
                                            {Number(for_operator * state?.value)?.toLocaleString()}
                                        </p>
                                        {/* FOR SELLERS */}
                                        <p className="w-[180px] text-[12px] flex items-center justify-center h-[50px] border-r border-black">
                                            {Number(state?.for_seller * state?.value)?.toLocaleString()}
                                        </p>
                                        {/* PROFIT */}
                                        <p className="w-[180px] text-[12px] flex items-center justify-center h-[50px] border-black">
                                            {(Number(Number(state?.price) - (Number(state?.price * comission) + for_operator + Number(state?.for_seller || 0))) * state?.value)?.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                                <Button className="w-full" color="indigo" onClick={Submit}>Saqlash & Tekshiruvga yuborish</Button>
                            </>
                        }
                    </>
                }

            </div>
            {/* VIEW COMISSION */}
            <Dialog size="xl" open={viewComission}>
                <DialogHeader>
                    <p className="text-[16px]">Komissiya tuzulishi</p>
                </DialogHeader>
                <DialogBody className="border-y p-[5px] overflow-scroll">
                    {/*  */}
                    <div className="flex items-center justify-start border-black border border-r-0 min-w-max h-[50px]">
                        {/* NO */}
                        <p className="min-w-[50px] h-[50px] border-black border-r flex items-center justify-center text-[12px] text-black">No</p>
                        {/* DAN */}
                        <p className="min-w-[120px] h-[50px] border-black border-r flex items-center justify-center text-[12px] text-black">SO'M DAN</p>
                        {/* GACHA */}
                        <p className="min-w-[120px] h-[50px] border-black border-r flex items-center justify-center text-[12px] text-black">SO'M GACHA</p>
                        {/* COMISSION */}
                        <p className="min-w-[120px] h-[50px] border-black border-r flex items-center justify-center text-[12px] text-black">KOMISSIYA %</p>
                        {/* FOR OPERATOR */}
                        <p className="min-w-[150px] h-[50px] border-black border-r flex items-center justify-center text-[12px] text-black">OPERATOR ULUSHI</p>
                        {/* FOR SELLER */}
                        <p className="min-w-[150px] h-[50px] border-black border-r flex items-center justify-center text-[12px] text-black">SOTUVCHI ULUSHI</p>
                        {/* FOYDA STRUCTURASI */}
                        <p className="min-w-[362px] h-[50px] border-black border-r flex items-center justify-center text-[12px] text-black">FOYDA STRUKTURASI</p>
                    </div>
                    {/* 1 */}
                    <div className="flex items-center justify-start border-black border-r-0 border border-t-0 min-w-max h-[50px]">
                        {/* NO */}
                        <p className="min-w-[50px] h-[50px] border-black border-r flex items-center justify-center text-[12px] text-black">1</p>
                        {/* DAN */}
                        <p className="min-w-[120px] h-[50px] border-black border-r flex items-center justify-center text-[12px] text-black">
                            10 000
                        </p>
                        {/* GACHA */}
                        <p className="min-w-[120px] h-[50px] border-black border-r flex items-center justify-center text-[12px] text-black">
                            99 999
                        </p>
                        {/* COMISSION */}
                        <p className="min-w-[120px] h-[50px] border-black border-r flex items-center justify-center text-[12px] text-black">
                            12 %
                        </p>
                        {/* FOR OPERATOR */}
                        <p className="min-w-[150px] h-[50px] border-black border-r flex items-center justify-center text-[12px] text-black">
                            5 000
                        </p>
                        {/* FOR SELLER */}
                        <p className="min-w-[150px] h-[50px] border-black border-r flex items-center justify-center text-[12px] text-black">
                            Ixtiyoriy
                        </p>
                        {/* FOYDA STRUCTURASI */}
                        <p className="min-w-[362px] h-[50px] border-black border-r flex items-center justify-center text-[12px] text-black">
                            SOTUV NARXI - (KOMISSIYA + OPERATOR + SOTUVCHI)
                        </p>
                    </div>
                    {/* 2 */}
                    <div className="flex items-center justify-start border-black border-r-0 border border-t-0 min-w-max h-[50px]">
                        {/* NO */}
                        <p className="min-w-[50px] h-[50px] border-black border-r flex items-center justify-center text-[12px] text-black">2</p>
                        {/* DAN */}
                        <p className="min-w-[120px] h-[50px] border-black border-r flex items-center justify-center text-[12px] text-black">
                            100 000
                        </p>
                        {/* GACHA */}
                        <p className="min-w-[120px] h-[50px] border-black border-r flex items-center justify-center text-[12px] text-black">
                            199 999
                        </p>
                        {/* COMISSION */}
                        <p className="min-w-[120px] h-[50px] border-black border-r flex items-center justify-center text-[12px] text-black">
                            10 %
                        </p>
                        {/* FOR OPERATOR */}
                        <p className="min-w-[150px] h-[50px] border-black border-r flex items-center justify-center text-[12px] text-black">
                            6 000
                        </p>
                        {/* FOR SELLER */}
                        <p className="min-w-[150px] h-[50px] border-black border-r flex items-center justify-center text-[12px] text-black">
                            Ixtiyoriy
                        </p>
                        {/* FOYDA STRUCTURASI */}
                        <p className="min-w-[362px] h-[50px] border-black border-r flex items-center justify-center text-[12px] text-black">
                            SOTUV NARXI - (KOMISSIYA + OPERATOR + SOTUVCHI)
                        </p>
                    </div>
                    {/* 3 */}
                    <div className="flex items-center justify-start border-black border-r-0 border border-t-0 min-w-max h-[50px]">
                        {/* NO */}
                        <p className="min-w-[50px] h-[50px] border-black border-r flex items-center justify-center text-[12px] text-black">3</p>
                        {/* DAN */}
                        <p className="min-w-[120px] h-[50px] border-black border-r flex items-center justify-center text-[12px] text-black">
                            200 000
                        </p>
                        {/* GACHA */}
                        <p className="min-w-[120px] h-[50px] border-black border-r flex items-center justify-center text-[12px] text-black">
                            299 999
                        </p>
                        {/* COMISSION */}
                        <p className="min-w-[120px] h-[50px] border-black border-r flex items-center justify-center text-[12px] text-black">
                            9 %
                        </p>
                        {/* FOR OPERATOR */}
                        <p className="min-w-[150px] h-[50px] border-black border-r flex items-center justify-center text-[12px] text-black">
                            8 000
                        </p>
                        {/* FOR SELLER */}
                        <p className="min-w-[150px] h-[50px] border-black border-r flex items-center justify-center text-[12px] text-black">
                            Ixtiyoriy
                        </p>
                        {/* FOYDA STRUCTURASI */}
                        <p className="min-w-[362px] h-[50px] border-black border-r flex items-center justify-center text-[12px] text-black">
                            SOTUV NARXI - (KOMISSIYA + OPERATOR + SOTUVCHI)
                        </p>
                    </div>
                    {/* 4 */}
                    <div className="flex items-center justify-start border-black border-r-0 border border-t-0 min-w-max h-[50px]">
                        {/* NO */}
                        <p className="min-w-[50px] h-[50px] border-black border-r flex items-center justify-center text-[12px] text-black">1</p>
                        {/* DAN */}
                        <p className="min-w-[120px] h-[50px] border-black border-r flex items-center justify-center text-[12px] text-black">
                            300 000
                        </p>
                        {/* GACHA */}
                        <p className="min-w-[120px] h-[50px] border-black border-r flex items-center justify-center text-[12px] text-black">
                            <FaInfinity />
                        </p>
                        {/* COMISSION */}
                        <p className="min-w-[120px] h-[50px] border-black border-r flex items-center justify-center text-[12px] text-black">
                            8 %
                        </p>
                        {/* FOR OPERATOR */}
                        <p className="min-w-[150px] h-[50px] border-black border-r flex items-center justify-center text-[12px] text-black">
                            10 000
                        </p>
                        {/* FOR SELLER */}
                        <p className="min-w-[150px] h-[50px] border-black border-r flex items-center justify-center text-[12px] text-black">
                            Ixtiyoriy
                        </p>
                        {/* FOYDA STRUCTURASI */}
                        <p className="min-w-[362px] h-[50px] border-black border-r flex items-center justify-center text-[12px] text-black">
                            SOTUV NARXI - (KOMISSIYA + OPERATOR + SOTUVCHI)
                        </p>
                    </div>
                </DialogBody>
                <DialogFooter>
                    <Button color="indigo" onClick={() => setViewComission(false)}>
                        Ortga
                    </Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
}

export default SupplierProductAdd;