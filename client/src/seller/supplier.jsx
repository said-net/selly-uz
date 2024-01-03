import { Button, Spinner } from "@material-tailwind/react";
import { useEffect } from "react";
import { FaBoxesPacking } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function SellerSupplier() {
    const { supplier } = useSelector(e => e?.auth);
    const nv = useNavigate();
    useEffect(() => {
        if (supplier) {
            nv('/supplier/dashboard');
        }
    }, [supplier]);
    return (
        <div className="flex items-center justify-center w-full h-[100vh]">
            {!supplier &&
                <div className="flex items-center justify-center flex-col">
                    <div className="flex items-center justify-center w-[200px] h-[200px] rounded-full bg-blue-200 animate-fade-down">
                        <FaBoxesPacking className="text-[150px] text-blue-500" />
                    </div>
                    <p className="text-white font-light animate-flip-up text-center">Biz bilan ta'minotchi sifatida ish boshlash uchun telegramdan murojat qiling</p>
                    <Button color="blue" className="w-[200px] animate-fade-up" onClick={() => window.open('https://t.me/sellyuzb')}>Telegram</Button>
                </div>
            }
            {supplier &&
                <div className="flex items-center justify-center gap-3 text-white">
                    <Spinner /> Kuting...
                </div>
            }
        </div>
    );
}

export default SellerSupplier;