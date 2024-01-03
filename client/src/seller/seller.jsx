import { useParams } from "react-router-dom";
import SellerNavbar from "./navbar";
import SellerDashboard from "./dashboard";
import { useSelector } from "react-redux";
import SellerNoActive from "./noactive";
import SellerSettings from "./settings";
import SellerSupplier from "./supplier";
import SellerMarket from "./market";
import SellerStreams from "./streams";
import SellerStatistics from "./statistics";
import SellerBalance from "./balance";
import SellerOrders from "./orders";
import SellerMarketPlace from "./market-place";

function Seller() {
  const { path } = useParams();
  const { active } = useSelector((e) => e?.auth);
  return (
    <div className="flex items-start justify-center xl:gap-[10px] w-full">
      <SellerNavbar />
      <div className="flex items-center justify-start flex-col w-full h-[100vh] overflow-y-scroll">
        {!active && <SellerNoActive />}
        {path === "dashboard" && <SellerDashboard />}
        {path === "settings" && <SellerSettings />}
        {path === "supplier" && <SellerSupplier />}
        {path === "market" && <SellerMarket />}
        {path === "streams" && <SellerStreams />}
        {path === "stats" && <SellerStatistics />}
        {path === "balance" && <SellerBalance />}
        {path === "orders" && <SellerOrders />}
        {path === "market-place" && <SellerMarketPlace />}
      </div>
    </div>
  );
}

export default Seller;
