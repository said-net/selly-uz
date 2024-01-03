import { Button, Checkbox, Input } from "@material-tailwind/react";
import { useState } from "react";
import { FaKey, FaLock, FaPhone, FaUser } from "react-icons/fa6";
import InputMask from 'react-input-mask';
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { setLoad } from "../managers/config.manager";
import axios from "axios";
import { API, ERROR_MSG } from "../config";
import toast from "react-hot-toast";
import { setRefreshAuth } from "../managers/auth.manager";
function Register() {
    const [state, setState] = useState({ phone: '', name: '', password: '', repassword: '', check: false });
    const dp = useDispatch();

    document.title = "Ro'yhatdan o'tish"
    function Submit() {
        const { phone, name, password, repassword } = state;
        dp(setLoad(true));
        const form = {
            name,
            password,
            repassword,
            phone
        };
        axios.post(`${API}/user/register`, form).then(res => {
            const { ok, msg, access } = res.data;
            dp(setLoad(false));
            if (!ok) {
                toast.error(msg);
            } else {
                toast.success(msg);
                localStorage.setItem('access', access);
                setTimeout(() => {
                    dp(setRefreshAuth());
                }, 1000);
            }
        }).catch(() => {
            toast.error(ERROR_MSG);
            dp(setLoad(false));
        })
    }
    return (
        <div className="flex items-center justify-center w-full h-[100vh]">
            <div className="flex items-center justify-start flex-col bg-white w-[90%] md:w-[500px] p-[5px] rounded-[10px] animate-fade-up">
                <h1 className="text-[20px] mr-[5px] text-indigo-500">Ro'yhatdan o'tish</h1>
                {/*  */}
                <div className="w-full mb-[10px]">
                    <Input className="text-indigo-500" label="Ismingiz" color="indigo" value={state?.name} onChange={e => setState({ ...state, name: e.target.value })} icon={<FaUser />} />
                </div>
                {/*  */}
                <div className="w-full mb-[10px]">
                    <InputMask type="tel" mask="+\9\9\8-(99)-999-99-99" value={state?.phone} onChange={e => setState({ ...state, phone: e.target.value })}>
                        {(p) => <Input {...p} color="indigo" className="text-indigo-500" label="Raqamingiz" icon={<FaPhone />} />}
                    </InputMask>
                </div>
                {/*  */}
                <div className="w-full mb-[10px]">
                    <Input className="text-indigo-500" label="Parolingiz" color="indigo" value={state?.password} onChange={e => setState({ ...state, password: e.target.value })} icon={<FaLock />} />
                </div>
                {/*  */}
                <div className="w-full mb-[10px]">
                    <Input className="text-indigo-500" label="Parolni qayta kiriting" color="indigo" value={state?.repassword} onChange={e => setState({ ...state, repassword: e.target.value })} icon={<FaKey />} />
                </div>
                {/*  */}
                <div className="w-full mb-[10px]">
                    <Checkbox value={state?.check} onChange={e => setState({ ...state, check: e.target.checked })} className="rounded-full" color="indigo" label="Qoidalarga rozilik bildiraman" />
                </div>
                {/*  */}
                <div className="w-full mb-[10px]">
                    <Button onClick={Submit} color="indigo" disabled={!state?.check} fullWidth>Qabul qilish</Button>
                </div>
                {/*  */}
                <div className="flex items-center justify-end w-full">
                    <p className="text-[12px]">Ro'yhatdan o'tganmisiz? <Link to={'/auth'} className="underline">Kirish</Link></p>
                </div>
            </div>
        </div>
    );
}

export default Register;