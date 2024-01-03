import { useEffect, useState } from "react";
import Logo from '../assets/logo.png';
import { useDispatch, useSelector } from "react-redux";
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, IconButton, Input, Spinner } from "@material-tailwind/react";
import axios from "axios";
import { API, ERROR_MSG } from "../config";
import toast from "react-hot-toast";
import { FaCreditCard, FaMoneyBill, FaXmark } from "react-icons/fa6";
import InputMask from 'react-input-mask';
import { setLoad } from "../managers/config.manager";

function CourierFinance() {
    const [balance, setBalance] = useState(0);
    const [isLoad, setIsLoad] = useState(false);
    const { name } = useSelector(e => e?.auth)
    useEffect(() => {
        setIsLoad(false);
        axios(`${API}/courier/get-balance`, {
            headers: {
                'x-auth-token': `Bearer ${localStorage?.access}`
            }
        }).then(res => {
            const { ok, balance, msg } = res.data;
            setIsLoad(true);
            if (!ok) {
                toast.error(msg);
            } else {
                setBalance(balance);
            }
        }).catch(() => {
            toast.error(ERROR_MSG);
            setIsLoad(true);
        });
    }, []);
    const [createPayment, setCreatePayment] = useState({ open: false, card: '', value: '' });
    function CloseCreatePayment() {
        setCreatePayment({ open: false, card: '', value: '' });
    }
    const dp = useDispatch();
    function SubmitCreatePayment() {
        dp(setLoad(true));
        const { card, value } = createPayment;
        axios.post(`${API}/courier/create-payment`, { card: card?.replaceAll(' ',''), value }, {
            headers: {
                'x-auth-token': `Bearer ${localStorage?.access}`
            }
        }).then(res => {
            const { ok, msg } = res.data;
            dp(setLoad(false));
            if (!ok) {
                toast.error(msg);
            } else {
                toast.success(msg);
                setBalance(balance - value);
                CloseCreatePayment()
            }
        }).catch(() => {
            toast.error(ERROR_MSG);
            dp(setLoad(false));
        })
    }
    return (
        <div className="flex items-center justify-start flex-col w-full p-1">
            {/* TOP */}
            <div className="flex items-center xl:items-start justify-center xl:justify-start flex-col w-full mb-[10px]">
                <h1 className="text-[30px] sm:text-[40px] text-white animate-fade-down">MOLIYA</h1>
            </div>
            {/* BALANCE */}
            <div className="flex items-center justify-center w-full h-[80vh]">
                {/* CARD */}
                <div className="flex items-center justify-center w-[300px] md:w-[500px] h-[200px] md:h-[300px] bg-[#fff] rounded-[10px] p-[10px] relative overflow-hidden animate-flip-down animate-delay-[25ms]">
                    {/* LOGO */}
                    <div className="flex items-start justify-center absolute top-[10px] left-[10px] animate-fade-down animate-delay-100">
                        <img src={Logo} alt="logo" className="w-[60px] md:w-[100px]" />
                        <p className="text-[20px] text-indigo-500">CARD</p>
                    </div>
                    {/* NAME */}
                    <div className="flex items-center justify-center animate-fade-up animate-delay-300 absolute bottom-[10px] left-[10px]">
                        <p className="text-[20px] text-blue-500">{name}</p>
                    </div>
                    {/* CURRENCY */}
                    <div className="flex items-center justify-center animate-fade-down animate-delay-200 absolute top-[10px] right-[10px]">
                        <p className="text-[20px] text-orange-500">SO'M</p>
                    </div>
                    {/* BTN */}
                    <div className="animate-fade-up animate-delay-400 flex items-center justify-center absolute bottom-[10px] right-[10px]">
                        <Button onClick={() => setCreatePayment({ ...createPayment, open: true })} disabled={!isLoad || balance < 1} className="text-[12px] p-[5px_10px] rounded font-thin" color="indigo">
                            CHIQARIB OLISH
                        </Button>
                    </div>
                    {/* BALANCE */}
                    <p className="md:text-[50px] text-blue-gray-800 text-[30px] animate-flip-up animate-delay-500">
                        {!isLoad && <Spinner color="indigo" />}
                        {isLoad && balance?.toLocaleString()}
                    </p>
                </div>
                {/*  */}
            </div>
            {/* DIALOG */}
            <Dialog open={createPayment?.open} size="sm">
                <DialogHeader className="relative">
                    <p className="text-[14px] md:text-[16px]">Mablag'ni chiqarib olish</p>
                    <div className="absolute top-[-10px] right-[-10px]">
                        <IconButton onClick={CloseCreatePayment} className="rounded-full  text-[20px]" color="orange">
                            <FaXmark />
                        </IconButton>
                    </div>
                </DialogHeader>
                <DialogBody className="border-y flex items-center justify-start flex-col gap-[10px]">
                    <p className="text-blue-gray-800">Hisobingiz: <span className="text-indigo-500">{balance?.toLocaleString()}</span> so'm</p>
                    <div className="w-full">
                        <Input label="Summa( RAQAMLARDA )" color="indigo" type="number" onChange={e => (e.target.value <= balance) && setCreatePayment({ ...createPayment, value: e.target.value })} value={createPayment?.value} icon={<FaMoneyBill />} />
                    </div>
                    <div className="w-full">
                        <InputMask type="tel"mask="9999 9999 9999 9999" value={createPayment?.card} onChange={e => setCreatePayment({ ...createPayment, card: e.target.value })}>
                            {(p) => <Input {...p} color="indigo" className="text-indigo-500" label="Karta raqamingiz" icon={<FaCreditCard />} />}
                        </InputMask>
                    </div>
                </DialogBody>
                <DialogFooter>
                    <Button onClick={SubmitCreatePayment} color="indigo" fullWidth>Chiqarib olish</Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
}

export default CourierFinance;