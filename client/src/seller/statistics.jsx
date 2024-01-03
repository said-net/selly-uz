import axios from "axios";
import { useEffect, useState } from "react";
import { API, ERROR_MSG } from "../config";
import toast from "react-hot-toast";
import { Button, Spinner } from "@material-tailwind/react";
import { Link } from "react-router-dom";

function SellerStatistics() {
    const [streams, setStreams] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    useEffect(() => {
        axios(`${API}/seller/get-stats`, {
            headers: {
                'x-auth-token': `Bearer ${localStorage?.access}`
            }
        }).then(res => {
            setIsLoad(true);
            const { ok, data, msg } = res.data;
            if (!ok) {
                toast.error(msg);
            } else {
                setStreams(data);
            }
        }).catch(() => {
            setIsLoad(true);
            toast.error(ERROR_MSG);
        });
    }, []);

    return (
        <div className="flex items-center justify-start flex-col w-full p-1">
            {/*  */}
            <div className="flex items-center xl:items-start justify-center xl:justify-start flex-col w-full mb-[10px]">
                <h1 className="text-[30px] sm:text-[40px] text-white animate-fade-down">STATISTIKA</h1>
            </div>
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
                <div className="animate-fade-up flex flex-col items-start justify-start w-full bg-white rounded overflow-x-scroll p-[5px]">
                    {/* STRUCT */}
                    <div className="flex items-start justify-start border border-black">
                        {/* NO */}
                        <p className="text-[14px] w-[50px] h-[50px] flex items-center justify-center border-r border-black">No</p>
                        {/* ID */}
                        <p className="text-[14px] w-[70px] h-[50px] flex items-center justify-center border-r border-black">ID</p>
                        {/* TITLE */}
                        <p className="text-[14px] w-[150px] h-[50px] flex items-center justify-center border-r border-black">NOMI</p>
                        {/* IMAGE */}
                        <p className="text-[14px] w-[100px] h-[50px] flex items-center justify-center border-r border-black">RASMI</p>
                        {/* PRODUCT */}
                        <p className="text-[14px] w-[150px] h-[50px] flex items-center justify-center border-r border-black">MAHSULOT</p>
                        {/* PRICE */}
                        <p className="text-[14px] w-[150px] h-[50px] flex items-center justify-center border-r border-black">NARXI( SO'M )</p>
                        {/* FOR_SELLER */}
                        <p className="text-[14px] w-[150px] h-[50px] flex items-center justify-center border-r border-black">BONUS( SO'M )</p>
                        {/* CREATED */}
                        <p className="text-[14px] w-[150px] h-[50px] flex items-center justify-center border-r border-black">OCHILGAN SANA</p>
                        {/* VIEWS */}
                        <p className="text-[14px] text-center w-[150px] h-[50px] flex items-center justify-center border-r border-black">TASHRIFLAR</p>
                        {/* NEW ORDERS */}
                        <p className="text-[14px] text-center w-[150px] h-[50px] flex items-center justify-center border-r border-black">YANGI BUYURTMALAR</p>
                        {/* COPY */}
                        <p className="text-[14px] text-center w-[150px] h-[50px] flex items-center justify-center border-r border-black">KOPIYA( DUBLIKAT )</p>
                        {/* ARCHIVE */}
                        <p className="text-[14px] text-center w-[150px] h-[50px] flex items-center justify-center border-r border-black">ARXIVLAR</p>
                        {/* REJECT */}
                        <p className="text-[14px] text-center w-[150px] h-[50px] flex items-center justify-center border-r border-black">BEKOR QILINGAN</p>
                        {/* RECONTACT */}
                        <p className="text-[14px] text-center w-[150px] h-[50px] flex items-center justify-center border-r border-black">QAYTA ALOQA</p>
                        {/* SUCCESS */}
                        <p className="text-[14px] text-center w-[150px] h-[50px] flex items-center justify-center border-r border-black">QABUL QILINGAN</p>
                        {/* SENDED */}
                        <p className="text-[14px] text-center w-[150px] h-[50px] flex items-center justify-center border-r border-black">YUBORILGAN</p>
                        {/* DELIVERED */}
                        <p className="text-[14px] text-center w-[150px] h-[50px] flex items-center justify-center border-r border-black">YETKAZILGAN</p>
                        {/* COMMING_PROFIT */}
                        <p className="text-[14px] text-center p-[5px] w-[150px] h-[50px] flex items-center justify-center border-r border-black">KUTILAYOTGAN FOYDA ( SO'M )</p>
                        {/* PROFIT */}
                        <p className="text-[14px] text-center p-[5px] w-[150px] h-[50px] flex items-center justify-center">FOYDA ( SO'M )</p>
                    </div>
                    {/* MAPPING */}
                    {streams?.map((s, i) => {
                        return (
                            <div key={i} className="flex items-start justify-start border border-black border-t-0">
                                {/* NO */}
                                <p className="text-[14px] w-[50px] h-[50px] flex items-center justify-center border-r border-black">
                                    {i + 1}
                                </p>
                                {/* ID */}
                                <p className="text-[14px] w-[70px] h-[50px] flex items-center justify-center border-r border-black">
                                    {s?.id}
                                </p>
                                {/* TITLE */}
                                <p className="text-[14px] w-[150px] h-[50px] flex items-center justify-center border-r border-black text-center">
                                    {s?.title}
                                </p>
                                {/* IMAGE */}
                                <div className="text-[14px] w-[100px] h-[50px] flex items-center justify-center border-r border-black">
                                    <div className="flex items-center justify-center w-[45px] h-[45px] rounded-full border overflow-hidden">
                                        <img src={s?.image} />
                                    </div>
                                </div>
                                {/* PRODUCT */}
                                <p className="text-[14px] w-[150px] h-[50px] flex items-center justify-center border-r border-black text-center">
                                    {s?.product}
                                </p>
                                {/* PRICE */}
                                <p className="text-[14px] w-[150px] h-[50px] flex items-center justify-center border-r border-black">
                                    {Number(s?.price)?.toLocaleString()}
                                </p>
                                {/* FOR_SELLER */}
                                <p className="text-[14px] w-[150px] h-[50px] flex items-center justify-center border-r border-black">
                                    {Number(s?.for_seller)?.toLocaleString()}
                                </p>
                                {/* CREATED */}
                                <p className="text-[14px] w-[150px] h-[50px] flex items-center justify-center border-r border-black">
                                    {s?.created}
                                </p>
                                {/* VIEWS */}
                                <p className="text-[14px] text-center w-[150px] h-[50px] flex items-center justify-center border-r border-black">
                                    {s?.views}
                                </p>
                                {/* NEW ORDERS */}
                                <p className="text-[14px] text-center w-[150px] h-[50px] flex items-center justify-center border-r border-black">
                                    {s?.news}
                                </p>
                                {/* COPY */}
                                <p className="text-[14px] text-center w-[150px] h-[50px] flex items-center justify-center border-r border-black">
                                    {s?.copy}
                                </p>
                                {/* ARCHIVE */}
                                <p className="text-[14px] text-center w-[150px] h-[50px] flex items-center justify-center border-r border-black">
                                    {s?.archive}
                                </p>
                                {/* REJECT */}
                                <p className="text-[14px] text-center w-[150px] h-[50px] flex items-center justify-center border-r border-black">
                                    {s?.reject}
                                </p>
                                {/* RECONTACT */}
                                <p className="text-[14px] text-center w-[150px] h-[50px] flex items-center justify-center border-r border-black">
                                    {s?.recontact}
                                </p>
                                {/* SUCCESS */}
                                <p className="text-[14px] text-center w-[150px] h-[50px] flex items-center justify-center border-r border-black">
                                    {s?.success}
                                </p>
                                {/* SENDED */}
                                <p className="text-[14px] text-center w-[150px] h-[50px] flex items-center justify-center border-r border-black">
                                    {s?.sended}
                                </p>
                                {/* DELIVERED */}
                                <p className="text-[14px] text-center w-[150px] h-[50px] flex items-center justify-center border-r border-black">
                                    {s?.delivered}
                                </p>
                                {/* COMMING_PROFIT */}
                                <p className="text-[14px] text-center p-[5px] w-[150px] h-[50px] flex items-center justify-center border-r border-black">
                                    {Number(s?.comming_profit)?.toLocaleString()}
                                </p>
                                {/* PROFIT */}
                                <p className="text-[14px] text-center p-[5px] w-[150px] h-[50px] flex items-center justify-center">
                                    {Number(s?.profit)?.toLocaleString()}
                                </p>
                            </div>
                        )
                    })}
                </div>
            }
        </div>
    );
}

export default SellerStatistics;