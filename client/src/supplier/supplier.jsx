import { useParams } from "react-router-dom";
import SupplierDashboard from "./dashboard";
import SupplierNavbar from "./navbar";
import SupplierProducts from "./products";
import SupplierProductAdd from "./product-add";
import SupplierNewOrders from "./new-orders";
import SupplierRejectedOrders from "./rejected-orders";
import SupplierArchivedOrders from "./archived-orders";
import SupplierRecontactOrders from "./recontact-orders";
import SupplierSuccessOrders from "./success-orders";
import SupplierSendedOrders from "./sended-orders";
import SupplierDeliveredOrders from "./delivered-orders";
import SupplierFinance from "./finance";

function Supplier() {
    const { path } = useParams();
    return (
        <div className="flex items-start justify-center xl:gap-[10px] w-full">
            <SupplierNavbar />
            <div className="flex items-center justify-start flex-col w-full h-[100vh] overflow-y-scroll">
                {path === 'dashboard' && <SupplierDashboard />}
                {path === 'products' && <SupplierProducts />}
                {path === 'product-add' && <SupplierProductAdd />}
                {path === 'new-orders' && <SupplierNewOrders />}
                {path === 'reject' && <SupplierRejectedOrders />}
                {path === 'archive' && <SupplierArchivedOrders />}
                {path === 'recontacts' && <SupplierRecontactOrders />}
                {path === 'success' && <SupplierSuccessOrders />}
                {path === 'sended' && <SupplierSendedOrders />}
                {path === 'delivered' && <SupplierDeliveredOrders />}
                {path === 'finance' && <SupplierFinance />}
            </div>
        </div>
    );
}

export default Supplier;
