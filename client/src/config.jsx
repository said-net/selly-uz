import ErrorMsc from './assets/error.mp3';
import SuccessMsc from './assets/success.mp3';

// export const API = 'http://localhost:5000/api';
// export const API = 'http://192.168.1.5:5000/api';
export const API = 'https://api.selly.uz/api';
export const ERROR_MSG = "Aloqani tekshirib qayta urinib ko'ring!"
// MUSICS
export const ERROR_EFFECT = () => {
    try {
        const audio = new Audio(ErrorMsc);
        audio?.play();
    } catch { }
}
export const SUCCESS_EFFECT = () => {
    try {
        const audio = new Audio(SuccessMsc);
        audio?.play();
    } catch { }
}