import { useParams } from "react-router-dom";
import AdminNavbar from "./navbar";
import AdminDashboard from "./dashboard";
import AdminCategories from "./categories";
import AdminSuppliers from "./suppliers";
import AdminSellers from "./sellers";
import AdminOperators from "./operators";
import AdminCouriers from "./couriers";
import AdminProducts from "./products";
import AdminNewOrders from "./new-orders";
import AdminInOperatorOrders from "./inoperator-orders";
import AdminRecontactOrders from "./recontact-orders";
import AdminSuccessOrders from "./success-orders";
import AdminGetCheques from "./get-cheques";
import AdminSendedOrders from "./sended-orders";
import AdminParties from "./parties";
import AdminParty from "./party";
import AdminArchivedOrders from "./get-archived-orders";
import AdminHistoryOrders from "./get-history-orders";
import AdminSearchOrder from "./search-order";
import AdminGetDeliveredOrders from "./get-delivered-orders";
import AdminGetRejectedOrders from "./get-rejected-orders";
import AdminSettings from "./settings";
import AdminGetPayments from "./payments";

function Admin() {
    const { path } = useParams();
    return (
        <div className="flex items-start justify-center xl:gap-[10px] w-full">
            <AdminNavbar />
            <div className="flex items-center justify-start flex-col w-full h-[100vh] overflow-y-scroll">
                {path === 'dashboard' && <AdminDashboard />}
                {path === 'categories' && <AdminCategories />}
                {path === 'suppliers' && <AdminSuppliers />}
                {path === 'sellers' && <AdminSellers />}
                {path === 'operators' && <AdminOperators />}
                {path === 'couriers' && <AdminCouriers />}
                {path === 'products' && <AdminProducts />}
                {/* ORDERS */}
                {path === 'new-orders' && <AdminNewOrders />}
                {path === 'in-operator' && <AdminInOperatorOrders />}
                {path === 'recontacts' && <AdminRecontactOrders />}
                {path === 'success' && <AdminSuccessOrders />}
                {path === 'archive' && <AdminArchivedOrders />}
                {path === 'history' && <AdminHistoryOrders />}
                {path === 'cheques' && <AdminGetCheques />}
                {path === 'sended' && <AdminSendedOrders />}
                {path === 'delivered' && <AdminGetDeliveredOrders />}
                {path === 'reject' && <AdminGetRejectedOrders />}
                {path === 'parties' && <AdminParties />}
                {path === 'party' && <AdminParty />}
                {path === 'search' && <AdminSearchOrder />}
                {/*  */}
                {path === 'settings' && <AdminSettings />}
                {path === 'payments' && <AdminGetPayments />}
            </div>
        </div>
    );
}

export default Admin;
