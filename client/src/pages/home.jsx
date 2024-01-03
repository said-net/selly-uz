import { Button } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { FaBagShopping, FaBox, FaBoxesPacking, FaCartShopping, FaCircleCheck, FaGears, FaMoneyBill, FaNewspaper, FaTruck, FaUser } from 'react-icons/fa6'
function Home() {
    document.title = "SELLY | IMKONIYAT!"
    return (
        <>
            <div className="flex items-center justify-start flex-col w-full h-[100vh] snap-y snap-mandatory overflow-y-scroll scrollbar-hide">
                {/* INTRO */}
                <div className="snap-start flex items-center justify-center w-full min-h-[100vh] snap-mandatory flex-col">
                    {/*  */}
                    <h1 className="text-[60px] md:text-[80px] text-white animate-fade-down">SELLY.UZ</h1>
                    <p className=" text-[20px] sm:text-[30px] uppercase text-white text-center animate-fade-left">Virtual sotuv orqali</p>
                    <p className=" text-[20px] sm:text-[30px] uppercase text-white text-center animate-fade-right">Yuqori daromadga chiqing!</p>
                    {/*  */}
                    <div className="flex items-center justify-center gap-2 mt-[10px]">
                        <Link className="animate-fade-right" to={'/register'}>
                            <Button className="rounded-full text-[11px] sm:text-[20px]" color="red">
                                Ro'yhatdan o'tish
                            </Button>
                        </Link>
                        <Link className="animate-fade-left" to={'/auth'}>
                            <Button className="rounded-full text-[11px] sm:text-[20px]" color="orange">
                                Tizimga kirish
                            </Button>
                        </Link>
                    </div>
                </div>
                {/* SELLER */}
                <div className="snap-start flex-col flex items-center gap-2 justify-center w-full min-h-[100vh] snap-mandatory">
                    <h1 className="text-[50px] text-white">SOTUVCHI</h1>
                    <p className="gap-2 font-light flex items-center justify-center text-white">
                        <FaUser />
                        <span>Tizimda ro'yhatdan o'ting</span>
                    </p>
                    <p className="gap-2 font-light flex items-center justify-center text-white">
                        <FaBox />
                        <span>Mahsulot tanlang va oqim oching</span>
                    </p>
                    <p className="gap-2 font-light flex items-center justify-center text-white">
                        <FaCartShopping />
                        <span>Oqim orqali mahsulot soting</span>
                    </p>
                    <p className="gap-2 font-light flex items-center justify-center text-white">
                        <FaMoneyBill />
                        <span>Har bir sotuvdan daromad oling!</span>
                    </p>
                </div>
                {/* SUPPLIER */}
                <div className="snap-start flex-col flex items-center gap-2 justify-center w-full min-h-[100vh] snap-mandatory">
                    <h1 className="text-[50px] text-white">TA'MINOTCHI</h1>
                    <p className="gap-2 font-light flex items-center justify-center text-white">
                        <FaNewspaper />
                        <span>Biz bilan shartnoma tuzing</span>
                    </p>
                    <p className="gap-2 font-light flex items-center justify-center text-white">
                        <FaBoxesPacking />
                        <span>Mahsulotlaringizni joylashtiring</span>
                    </p>
                    <p className="gap-2 font-light flex items-center justify-center text-white">
                        <FaGears />
                        <span>Har bir sotuvni nazorat qiling</span>
                    </p>
                    <p className="gap-2 font-light flex items-center justify-center text-white">
                        <FaBagShopping />
                        <span>Mahsulotingiz sotuvidan daromad oling!</span>
                    </p>
                </div>
                {/* OPERATOR */}
                <div className="snap-start flex-col flex items-center gap-2 justify-center w-full min-h-[100vh] snap-mandatory">
                    <h1 className="text-[50px] text-white">OPERATOR</h1>
                    <p className="gap-2 font-light flex items-center justify-center text-white">
                        <FaNewspaper />
                        <span>Biz bilan shartnoma tuzing</span>
                    </p>
                    <p className="gap-2 font-light flex items-center justify-center text-white">
                        <FaTruck />
                        <span>Buyurtmachilar bilan bog'laning</span>
                    </p>
                    <p className="gap-2 font-light flex items-center justify-center text-white">
                        <FaCircleCheck />
                        <span>Buyurtmani rasmiylashtiring</span>
                    </p>
                    <p className="gap-2 font-light flex items-center justify-center text-white">
                        <FaMoneyBill />
                        <span>Sotilgan buyurtmalardan foyda oling</span>
                    </p>
                </div>
                {/* COURIER */}
                <div className="snap-start flex-col flex items-center gap-2 justify-center w-full min-h-[100vh] snap-mandatory">
                    <h1 className="text-[50px] text-white">KURYER</h1>
                    <p className="gap-2 font-light flex items-center justify-center text-white">
                        <FaNewspaper />
                        <span>Biz bilan shartnoma tuzing</span>
                    </p>
                    <p className="gap-2 font-light flex items-center justify-center text-white">
                        <FaTruck />
                        <span>Buyurtmalarni buyurtmachiga yetkazing</span>
                    </p>
                    <p className="gap-2 font-light flex items-center justify-center text-white">
                        <FaCircleCheck />
                        <span>Yetkazib berilgan buyurtmadan daromad oling</span>
                    </p>
                </div>
            </div>
        </>
    );
}

export default Home;