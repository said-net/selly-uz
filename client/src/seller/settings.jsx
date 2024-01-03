import { IconButton, Input, Switch } from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { setAnimation, setLoad } from "../managers/config.manager";
import { useState } from "react";
import { BiSave } from "react-icons/bi";
import axios from "axios";
import { API, ERROR_MSG } from "../config";
import toast from "react-hot-toast";

function SellerSettings() {
    const dp = useDispatch();
    const { config: { animation }, auth: { name, telegram } } = useSelector(e => e);
    const [state, setState] = useState({ name, telegram, password: '', newPassword: '', reNewPassword: '', checked: '' });
    document.title = "SOZLAMALR"

    function EditName() {
        dp(setLoad(true));
        axios.put(`${API}/user/edit-name`, { name: state?.name }, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { ok, msg } = res.data;
            dp(setLoad(false));
            if (!ok) {
                toast.error(msg);
            } else {
                toast.success(msg);
            }
        }).catch(() => {
            dp(setLoad(false));
            toast.error(ERROR_MSG)
        })
    }
    function SetTelegram() {
        dp(setLoad(true));
        axios.post(`${API}/seller/set-telegram`, { telegram: state?.telegram }, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { ok, msg } = res.data;
            dp(setLoad(false));
            if (!ok) {
                toast.error(msg);
            } else {
                toast.success(msg);
            }
        }).catch(() => {
            dp(setLoad(false));
            toast.error(ERROR_MSG)
        })
    }
    return (
        <div className="flex items-center justify-start flex-col w-full p-1">
            {/*  */}
            <div className="flex items-center xl:items-start justify-center xl:justify-start flex-col w-full mb-[10px]">
                <h1 className="text-[30px] sm:text-[40px] text-white animate-fade-down">SOZLAMALAR</h1>
            </div>
            {/*  */}
            <div className="flex items-start justify-start flex-col w-full bg-white rounded p-[5px] gap-2 animate-fade-up animate-delay-[200ms] mb-[10px]">
                <div className="flex items-center justify-center w-full gap-3">
                    <h1 className="text-[12px] md:text-[20px] text-indigo-900">SAYT SOZLAMALARI</h1>
                </div>
                <label className="flex items-center justify-center gap-2">
                    Animatsiya: <Switch defaultChecked={animation} color="indigo" onChange={e => dp(setAnimation(e.target.checked))} />
                </label>
                <div className="flex items-center justify-center w-full gap-3">
                    <h1 className="text-[12px] md:text-[20px] text-indigo-900">PROFIL SOZLAMALARI</h1>
                </div>
                <div className="flex items-center justify-center w-full relative">
                    <Input label="Ismingiz" color="indigo" value={state.name} onChange={e => setState({ ...state, name: e.target.value })} />
                    <div className="absolute right-[1px]">
                        <IconButton onClick={EditName} disabled={state?.name?.lengt < 3 || state?.name === name} className="rounded text-[20px] w-[35px] h-[38px]">
                            <BiSave />
                        </IconButton>
                    </div>
                </div>
                <div className="flex items-center justify-center w-full relative flex-col">
                    <Input label="Telegram ID" type="number" color="indigo" value={state.telegram} onChange={e => setState({ ...state, telegram: e.target.value })} />
                    <div className="absolute right-[1px] top-[1px]">
                        <IconButton onClick={SetTelegram} disabled={state?.telegram?.lengt < 5 || state?.telegram === telegram} className="rounded text-[20px] w-[35px] h-[38px]">
                            <BiSave />
                        </IconButton>
                    </div>
                    <p className="w-full">Telegram BOT: <b className="text-blue-500 cursor-pointer" onClick={()=>window.open('https://t.me/sellyuzbot')}>@sellyuzbot</b></p>
                </div>
            </div>
            {/*  */}
        </div>
    );
}

export default SellerSettings;