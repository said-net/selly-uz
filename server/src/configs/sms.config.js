const { default: axios } = require("axios")

module.exports = (phone, text, type) => {
    if (type === 'activator') {
        return axios(`https://api.xssh.uz/smsv1/spes.php/?id=1315&token=ALasZMthHKjeRUTvgknimBSQJyrxudIbNlFGqVDOfPoEpYX&number=${phone?.slice(4,)}&text=TASDIQLASH KODI | ${text?.slice(0, 3) + '-' + text?.slice(3,)} | WWW.XBAZAR.UZ`)
    }else if (type === 'resend') {
        return axios(`https://api.xssh.uz/smsv1/spes.php/?id=1315&token=ALasZMthHKjeRUTvgknimBSQJyrxudIbNlFGqVDOfPoEpYX&number=${phone?.slice(4,)}&text=QAYTA TASDIQLASH KODI | ${text?.slice(0, 3) + '-' + text?.slice(3,)} | WWW.XBAZAR.UZ`)
    }else if (type === 'recovery') {
        return axios(`https://api.xssh.uz/smsv1/spes.php/?id=1315&token=ALasZMthHKjeRUTvgknimBSQJyrxudIbNlFGqVDOfPoEpYX&number=${phone?.slice(4,)}&text=YANGI PAROL | ${text} | WWW.XBAZAR.UZ`)
    }
}