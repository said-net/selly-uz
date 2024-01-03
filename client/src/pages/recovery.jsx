import { Button, Checkbox, Input } from "@material-tailwind/react";
import { useState } from "react";
import { FaPhone } from "react-icons/fa6";
import InputMask from 'react-input-mask';
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setLoad } from "../managers/config.manager";
import axios from "axios";
import { API, ERROR_MSG } from "../config";
import toast from "react-hot-toast";
function Recovery() {
    const [state, setState] = useState({ phone: '', check: false });
    const dp = useDispatch();
    const nv = useNavigate();
    document.title = "Qayta tiklash"
    function Submit() {
        const { phone } = state;
        dp(setLoad(true));
        axios.post(`${API}/user/recovery-pass`, { phone }).then(res => {
            const { ok, msg, access } = res.data;
            dp(setLoad(false));
            if (!ok) {
                toast.error(msg);
            } else {
                toast.success(msg);
                localStorage.setItem('access', access);
                setTimeout(() => {
                    nv('/auth')
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
                <h1 className="text-[20px] mr-[5px] text-indigo-500">Parolni tiklash</h1>
                {/*  */}
                <div className="w-full mb-[10px]">
                    <InputMask type="tel" mask="+\9\9\8-(99)-999-99-99" value={state?.phone} onChange={e => setState({ ...state, phone: e.target.value })}>
                        {(p) => <Input {...p} color="indigo" className="text-indigo-500" label="Raqamingiz" icon={<FaPhone />} />}
                    </InputMask>
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
                    <p className=" text-[12px]">Ro'yhatdan o'tmaganmisiz? <Link to={'/register'} className="underline">Ro'yhatdan o'tish</Link></p>
                </div>
                {/*  */}
                <div className="flex items-center justify-end w-full">
                    <p className="text-gray-700 text-[12px]">Profilingiz bormi? <Link to={'/auth'} className="underline">Kirish</Link></p>
                </div>
            </div>
        </div>
    );
}

export default Recovery;