import { Button, Input } from "@material-tailwind/react";
import { useState } from "react";
import { FaEnvelope } from "react-icons/fa6";
import InputMask from "react-input-mask";
import { useDispatch } from "react-redux";
import { setLoad } from "../managers/config.manager";
import { setRefreshAuth } from "../managers/auth.manager";
import toast from "react-hot-toast";
import { API, ERROR_MSG } from "../config";
import axios from "axios";

function SellerNoActive() {
  const [smsCode, setSmsCode] = useState("");
  const dp = useDispatch();
  function Submit() {
    dp(setLoad(true));
    const sms_code = smsCode?.replaceAll("_", "")?.replaceAll("-", "");
    axios
      .post(
        `${API}/user/activate`,
        { sms_code },
        {
          headers: {
            "x-auth-token": `Bearer ${localStorage.getItem("access")}`,
          },
        }
      )
      .then((res) => {
        const { ok, msg } = res.data;
        dp(setLoad(false));
        if (!ok) {
          toast.error(msg);
        } else {
          toast.success(msg);
          setTimeout(() => {
            dp(setRefreshAuth());
          }, 1000);
        }
      })
      .catch(() => {
        toast.error(ERROR_MSG);
        dp(setLoad(false));
      });
  }
  function ReSendSMS() {
    dp(setLoad(true));
    axios
      .post(
        `${API}/user/resend-sms`,
        {},
        {
          headers: {
            "x-auth-token": `Bearer ${localStorage.getItem("access")}`,
          },
        }
      )
      .then((res) => {
        const { ok, msg } = res.data;
        dp(setLoad(false));
        if (!ok) {
          toast.error(msg);
        } else {
          toast.success(msg);
        }
      })
      .catch(() => {
        toast.error(ERROR_MSG);
        dp(setLoad(false));
      });
  }
  return (
    <div className="flex items-center justify-center w-full h-[100vh] bg-[#2723717d] backdrop-blur-sm fixed top-0 left-0 z-[9999] p-[5px]">
      <div className="flex items-center gap-[10px] justify-start flex-col w-full p-[5px] sm:w-[500px] bg-white rounded">
        <h1 >PROFILNI AKTIVLASHTIRISH</h1>
        <InputMask
          mask="999-999"
          value={smsCode}
          onChange={(e) => setSmsCode(e.target.value)}
        >
          {(p) => (
            <Input
              {...p}
              color="indigo"
              className="text-indigo-500"
              label="SMS Kodni kiriting"
              icon={<FaEnvelope />}
            />
          )}
        </InputMask>
        <Button
          color="indigo"
          onClick={Submit}
          disabled={
            smsCode?.replaceAll("_", "")?.replaceAll("-", "")?.length !== 6
          }
          fullWidth
        >
          Tasdiqlash
        </Button>
        <div className="flex items-center justify-end w-full">
          <p
            onClick={ReSendSMS}
            className="text-[12px] underline cursor-pointer"
          >
            Yangi SMS kod yuborish
          </p>
        </div>
      </div>
    </div>
  );
}

export default SellerNoActive;
