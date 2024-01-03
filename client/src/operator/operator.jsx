import { useParams } from "react-router-dom";
import OperatorNavbar from "./navbar";
import OperatorDashboard from "./dashboard";
import OperatorFinance from "./finance";
import OperatorGetMyOrders from "./get-my-orders";
import OperatorGetNewOrders from "./get-new-orders";
import OperatorGetRecontactOrders from "./get-recontact-orders";
import OperatorGetSuccessOrders from "./get-success-orders";
import OperatorGetSendedOrders from "./get-sended-orders";
import OperatorGetRejectedOrders from "./get-rejected-orders";
import OperatorSettings from "./settings";

function Operator() {
    const { path } = useParams();
    return (
        <div className="flex items-start justify-center xl:gap-[10px] w-full">
            <OperatorNavbar />
            <div className="flex items-center justify-start flex-col w-full h-[100vh] overflow-y-scroll">
                {path === 'dashboard' && <OperatorDashboard />}
                {path === 'finance' && <OperatorFinance />}
                {path === 'my-orders' && <OperatorGetMyOrders />}
                {path === 'new-orders' && <OperatorGetNewOrders />}
                {path === 'recontacts' && <OperatorGetRecontactOrders />}
                {path === 'success' && <OperatorGetSuccessOrders />}
                {path === 'sended' && <OperatorGetSendedOrders />}
                {path === 'reject' && <OperatorGetRejectedOrders />}
                {path === 'settings' && <OperatorSettings />}
            </div>
        </div>
    );
}

export default Operator;
