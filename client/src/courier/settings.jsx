import { Switch } from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { setAnimation } from "../managers/config.manager";

function CourierSettings() {
    const dp = useDispatch();
    const { config: { animation } } = useSelector(e => e);
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
            </div>
            {/*  */}
        </div>
    );
}

export default CourierSettings;