import { Button } from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { setAnimation } from "../managers/config.manager";

function Navbar() {
    const dp = useDispatch();
    const { animation } = useSelector(e => e?.config)
    return (
        <>
            <div className="fixed top-2 right-2 z-[999]">
                <Button onClick={() => dp(setAnimation(!animation))} className="font-[ubuntu] p-[5px]" color={animation ? 'green' : 'red'}>Animatsiya: {animation?'ON':'OFF'}</Button>
            </div>
        </>
    );
}

export default Navbar;