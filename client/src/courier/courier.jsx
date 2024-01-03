import { useParams } from "react-router-dom";
import CourierNavbar from "./navbar";
import CourierDashboard from "./dashboard";
import CourierFinance from "./finance";
import CourierGetMyOrders from "./get-my-orders";
import CourierRecontactOrders from "./get-recontact-orders";
import CourierDeliveredOrders from "./get-delivered-orders";
import CourierRejectedsOrders from "./get-rejected-orders";
import CourierGetParties from "./get-parties";
import CourierGetParty from "./party";
import CourierSettings from "./settings";

function Courier() {
    const { path } = useParams();
    return (
        <div className="flex items-start justify-center xl:gap-[10px] w-full">
            <CourierNavbar />
            <div className="flex items-center justify-start flex-col w-full h-[100vh] overflow-y-scroll">
                {path === 'dashboard' && <CourierDashboard />}
                {path === 'finance' && <CourierFinance />}
                {path === 'my-orders' && <CourierGetMyOrders />}
                {path === 'recontacts' && <CourierRecontactOrders />}
                {path === 'delivered' && <CourierDeliveredOrders />}
                {path === 'reject' && <CourierRejectedsOrders />}
                {path === 'parties' && <CourierGetParties />}
                {path === 'party' && <CourierGetParty />}
                {path === 'settings' && <CourierSettings />}
            </div>
        </div>
    );
}

export default Courier;
