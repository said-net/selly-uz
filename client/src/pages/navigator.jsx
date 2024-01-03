import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Load from "../components/load";

function NavigatorPages() {
    const nv = useNavigate();
    const { seller, admin, operator, courier } = useSelector(e => e?.auth);
    useEffect(() => {
        { seller && nv('/seller/dashboard') }
        { admin && nv('/admin/dashboard') }
        { operator && nv('/operator/dashboard') }
        { courier && nv('/courier/dashboard') }
    }, []);
    return (
        <>
            <Load />
        </>
    );
}

export default NavigatorPages;