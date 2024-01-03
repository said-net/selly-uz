import { Spinner } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaCartShopping, FaChartBar, FaCheckDouble, FaClock, FaCoins, FaCreditCard, FaLink, FaMoneyBill1, FaMoneyBillTransfer, FaTruck } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { API, ERROR_MSG } from "../config";
import toast from "react-hot-toast";

function SellerDashboard() {
  const [state, setState] = useState({
    balance: 0,
    hold_balance: 0,
    comming_payment: 0,
    payment: 0,
    // coins: 0,
    sended: 0,
    delivered: 0,
  });
  const [isLoad, setIsLoad] = useState(false);
  document.title = "DASHBOARD"
  // 
  const nv = useNavigate();
  const { refresh } = useSelector(e => e?.config)
  useEffect(() => {
    setIsLoad(false);
    axios(`${API}/seller/get-dashboard`, {
      headers: {
        'x-auth-token': `Bearer ${localStorage.access}`
      }
    }).then(res=>{
      const {ok, data, msg} = res.data;
      setIsLoad(true);
      if(!ok){
        toast.error(msg);
      }else{
        setState(data);
      }
    }).catch(()=>{
      toast.error(ERROR_MSG);
      setIsLoad(true);
    })
  }, [refresh])
  //CLASSESS

  const className = `flex items-center justify-start w-full md:w-[300px] h-[100px] bg-white rounded shadow-sm relative hover:shadow-lg p-[5px] gap-2 animate-fade-up `;

  const classNameB = `flex items-center justify-start w-full md:w-[400px] h-[100px] bg-white rounded shadow-sm relative hover:shadow-lg p-[5px] gap-2 animate-fade-up cursor-pointer `;

  const className2 = `flex items-center justify-center w-[60px] h-[60px] rounded-full `;
  //
  return (
    <div className="flex items-center justify-start flex-col w-full p-1">
      {/*  */}
      <div className="flex items-center xl:items-start justify-center xl:justify-start flex-col w-full mb-[10px]">
        <h1 className="text-[30px] sm:text-[40px] text-white animate-fade-down">DASHBOARD</h1>
      </div>
      {/*  */}
      <div className="flex items-center justify-center w-full gap-2 flex-wrap">
        {/* BALANCE */}
        <div className={className + ' animate-delay-[150ms]'}>
          <div className={className2 + "bg-blue-100 text-[30px] text-blue-600"}>
            <FaCreditCard />
          </div>
          <p className="absolute top-1 right-1 text-[20px] text-indigo-900 uppercase">
            Hisobingiz
          </p>
          {!isLoad ? (
            <Spinner color="indigo" />
          ) : (
            <p className="text-[25px] text-indigo-900">
              {state?.balance?.toLocaleString()} so'm
            </p>
          )}
        </div>
        {/* HOLD BALANCE */}
        <div className={className + ' animate-delay-[200ms]'}>
          <div className={className2 + "bg-orange-100 text-[30px] text-orange-600"}>
            <FaMoneyBill1 />
          </div>
          <p className="absolute top-1 right-1 text-[20px] text-indigo-900 uppercase">
            Hold
          </p>
          {!isLoad ? (
            <Spinner color="indigo" />
          ) : (
            <p className="text-[25px] text-indigo-900">
              {state?.hold_balance?.toLocaleString()} so'm
            </p>
          )}
        </div>
        {/* COINS */}
        {/* <div className={className + ' animate-delay-[250ms]'}>
          <div className={className2 + "bg-light-green-100 text-[30px] text-light-green-600"}>
            <FaCoins />
          </div>
          <p className="absolute top-1 right-1 text-[20px] text-indigo-900 uppercase">
            Coins
          </p>
          {!isLoad ? (
            <Spinner color="indigo" />
          ) : (
            <p className="text-[25px] text-indigo-900">
              {state?.balance?.toLocaleString()} ta
            </p>
          )}
        </div> */}
        {/* PAYMENTS */}
        <div className={className + ' animate-delay-[250ms]'}>
          <div className={className2 + "bg-purple-100 text-[30px] text-purple-600"}>
            <FaClock />
          </div>
          <p className="absolute top-1 right-1 text-[20px] text-purple-900 uppercase">
            Tekshiruvdagi to'lov
          </p>
          {!isLoad ? (
            <Spinner color="indigo" />
          ) : (
            <p className="text-[25px] text-indigo-900">
              {state?.comming_payment?.toLocaleString()} so'm
            </p>
          )}
        </div>
        <div className={className + ' animate-delay-[300ms]'}>
          <div className={className2 + "bg-indigo-100 text-[30px] text-indigo-600"}>
            <FaMoneyBillTransfer />
          </div>
          <p className="absolute top-1 right-1 text-[20px] text-indigo-900 uppercase">
            Chiqarib olgansiz
          </p>
          {!isLoad ? (
            <Spinner color="indigo" />
          ) : (
            <p className="text-[25px] text-indigo-900">
              {state?.payment?.toLocaleString()} so'm
            </p>
          )}
        </div>
        {/* SENDED */}
        <div className={className + ' animate-delay-[350ms]'}>
          <div className={className2 + "bg-red-100 text-[30px] text-red-600"}>
            <FaTruck />
          </div>
          <p className="absolute top-1 right-1 text-[20px] text-indigo-900 uppercase">
            Yetkazilmoqda
          </p>
          {!isLoad ? (
            <Spinner color="indigo" />
          ) : (
            <p className="text-[25px] text-indigo-900">
              {state?.sended?.toLocaleString()} ta
            </p>
          )}
        </div>
        {/* SENDED */}
        <div className={className + ' animate-delay-[400ms]'}>
          <div className={className2 + "bg-green-100 text-[30px] text-green-600"}>
            <FaCheckDouble />
          </div>
          <p className="absolute top-1 right-1 text-[20px] text-indigo-900 uppercase">
            Yetkazilgan
          </p>
          {!isLoad ? (
            <Spinner color="indigo" />
          ) : (
            <p className="text-[25px] text-indigo-900">
              {state?.delivered?.toLocaleString()} ta
            </p>
          )}
        </div>
      </div>
      {/*  */}
      <div className="h-[1px] w-[80%] bg-white my-[20px] animate-fade-left"></div>
      {/*  */}
      <div className="flex items-center justify-center w-full flex-wrap gap-4">
        <div onClick={() => nv('/seller/market')} className={classNameB + ' animate-delay-[450ms]'}>
          <div className={className2 + "bg-red-100 text-[30px] text-red-600"}>
            <FaCartShopping />
          </div>
          <p className="text-[25px] text-indigo-900 uppercase">
            MARKET
          </p>
        </div>
        {/*  */}
        <div onClick={() => nv('/seller/streams')} className={classNameB + ' animate-delay-[500ms]'}>
          <div className={className2 + "bg-orange-100 text-[30px] text-orange-600"}>
            <FaLink />
          </div>
          <p className="text-[25px] text-indigo-900 uppercase">
            OQIMLAR
          </p>
        </div>
        {/*  */}
        <div onClick={() => nv('/seller/stats')} className={classNameB + ' animate-delay-[500ms]'}>
          <div className={className2 + "bg-blue-100 text-[30px] text-blue-600"}>
            <FaChartBar />
          </div>
          <p className="text-[25px] text-indigo-900 uppercase">
            STATISTIKA
          </p>
        </div>
        {/*  */}
        <div onClick={() => nv('/seller/balance')} className={classNameB + ' animate-delay-[500ms]'}>
          <div className={className2 + "bg-green-100 text-[30px] text-green-600"}>
            <FaCreditCard />
          </div>
          <p className="text-[25px] text-indigo-900 uppercase">
            MOLIYA
          </p>
        </div>
      </div>

    </div>
  );
}

export default SellerDashboard;
