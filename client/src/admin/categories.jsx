import axios from "axios";
import { useEffect, useState } from "react";
import { API, ERROR_MSG } from "../config";
import toast from "react-hot-toast";
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, IconButton, Input, Menu, MenuHandler, MenuItem, MenuList, Spinner, Switch } from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { FaImage, FaPencil, FaT } from "react-icons/fa6";
import { BiColorFill, BiDotsVertical, BiSave } from "react-icons/bi";
import { setLoad, setRefresh } from "../managers/config.manager";
import { FaEdit } from "react-icons/fa";
function AdminCategories() {
    const [categories, setCategories] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const { refresh } = useSelector(e => e?.config);
    document.title = "SELLY - KATEGRIYALAR";
    const dp = useDispatch();
    useEffect(() => {
        setIsLoad(false);
        axios(`${API}/category/get-all-to-admin`, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            setIsLoad(true);
            const { ok, data } = res.data;
            if (ok) {
                setCategories(data);
            }
        }).catch(() => {
            dp(setLoad(false));
            toast.error(ERROR_MSG);
        });
    }, [refresh]);
    // 
    const [add, setAdd] = useState({ open: false, title: '', image: '', color: '#FFFFFF' });
    function CloseAdd() {
        setAdd({ open: false, title: '', image: '', color: '#FFFFFF' });
    }
    function SubmitAdd() {
        dp(setLoad(true))
        axios.postForm(`${API}/category/create`, add, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { ok, msg } = res.data;
            dp(setLoad(false));
            if (!ok) {
                toast.error(msg);
            } else {
                toast.success(msg);
                CloseAdd();
                dp(setRefresh());
            }
        }).catch(() => {
            toast.error(ERROR_MSG);
        })
    }
    // 
    const [edit, setEdit] = useState({ _id: '', type: '', image: '', title: '', color: '' });
    function CloseEdit() {
        setEdit({ _id: '', type: '', image: '', title: '', color: '' })
    }
    // 
    function EditImage(_id, image) {
        dp(setLoad(true));
        axios.putForm(`${API}/category/edit-image`, { _id, image }, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { ok, msg } = res.data;
            dp(setLoad(false));
            if (!ok) {
                toast.error(msg);
            } else {
                toast.success(msg);
                CloseEdit()
                dp(setRefresh());
            }
        }).catch(() => {
            dp(setLoad(false));
            toast.error(ERROR_MSG);
        });
    }
    // 
    function EditTitle() {
        dp(setLoad(true));
        const { title, _id } = edit;
        axios.put(`${API}/category/edit-title`, { _id, title }, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { ok, msg } = res.data;
            dp(setLoad(false));
            if (!ok) {
                toast.error(msg);
            } else {
                toast.success(msg);
                CloseEdit()
                dp(setRefresh());
            }
        }).catch(() => {
            dp(setLoad(false));
            toast.error(ERROR_MSG);
        });
    }
    function EditColor() {
        dp(setLoad(true));
        const { color, _id } = edit;
        axios.put(`${API}/category/edit-color`, { _id, color }, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { ok, msg } = res.data;
            dp(setLoad(false));
            if (!ok) {
                toast.error(msg);
            } else {
                toast.success(msg);
                CloseEdit()
                dp(setRefresh());
            }
        }).catch(() => {
            dp(setLoad(false));
            toast.error(ERROR_MSG);
        });
    }
    function SetActive(_id, active) {
        dp(setLoad(true));
        axios.put(`${API}/category/set-active`, { _id, active }, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { ok, msg } = res.data;
            dp(setLoad(false));
            if (!ok) {
                toast.error(msg);
            } else {
                toast.success(msg);
            }
        }).catch(() => {
            dp(setLoad(false));
            toast.error(ERROR_MSG);
        });
    }
    return (
        <div className="flex items-center justify-start flex-col w-full p-[10px_5px]">
            {/* ADD-HADLER */}
            <div className="flex items-center justify-center w-full animate-fade-up">
                <Button onClick={() => setAdd({ ...add, open: true })} color="white" className="rounded-[4px_4px_0_0]">Kategoriya qo'shish</Button>
            </div>
            {/* MAPPING */}
            <div className="flex items-start justify-start w-full bg-white p-[10px] rounded overflow-x-scroll md:overflow-auto flex-col md:w-auto animate-fade-up">
                {/* TOP */}
                <div className="flex items-center justify-start border border-r-0 border-gray-500">
                    {/* ID */}
                    <p className="w-[70px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">ID</p>
                    {/* IMAGE */}
                    <p className="w-[80px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">RASMI</p>
                    {/* TITLE */}
                    <p className="w-[120px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">NOMI</p>
                    {/* PRODUCTS */}
                    <p className="w-[120px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">MAHSULOTLAR</p>
                    {/* CREATED */}
                    <p className="w-[200px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">HOSIL QILINGAN SANA</p>
                    {/* ACTIVE */}
                    <p className="w-[70px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">
                        HOLAT
                    </p>
                    {/* MENU */}
                    <p className="w-[70px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">MENU</p>
                    {/* END */}
                </div>
                {/*  */}
                {!isLoad &&
                    <div className="flex items-center justify-center w-full gap-3 h-[50vh]">
                        <Spinner color="indigo" />
                        Kuting...
                    </div>
                }
                {isLoad && !categories[0] &&
                    <div className="flex items-center justify-center w-full gap-3 h-[50vh]">
                        <p>Kategoriyalar mavud emas</p>
                    </div>
                }
                {isLoad && categories[0] &&
                    categories?.map((c, i) => {
                        return (
                            <div key={i} className="flex items-center justify-start border border-r-0 border-gray-500 border-t-0">
                                {/* ID */}
                                <p className="w-[70px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">
                                    {c?.id}
                                </p>
                                {/* IMAGE */}
                                <div className="w-[80px] h-[50px] border-r flex items-center justify-center border-r-gray-500">
                                    <div className="flex items-center justify-center w-[45px] h-[45px] rounded-full overflow-hidden p-[5px]" style={{ background: c?.color }}>
                                        <img src={c?.image} alt="c_img" />
                                    </div>
                                </div>
                                {/* TITLE */}
                                <p className="w-[120px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">
                                    {c?.title}
                                </p>
                                {/* PRODUCTS */}
                                <p className="w-[120px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">
                                    {c?.products}
                                </p>
                                {/* CREATED */}
                                <p className="w-[200px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">
                                    {c?.created}
                                </p>
                                {/* ACTIVE */}
                                <p className="w-[70px] h-[50px] border-r flex items-center justify-center border-r-gray-500 text-[14px]">
                                    <Switch onChange={e => SetActive(c?._id, e.target.checked)} id={c?.id} color="green" defaultChecked={c?.active} />
                                </p>
                                {/* MENU */}
                                <div className="w-[70px] h-[50px] border-r flex items-center justify-center border-r-gray-500">
                                    <Menu>
                                        <MenuHandler>
                                            <IconButton className="rounded-full text-[20px]" color="indigo">
                                                <BiDotsVertical />
                                            </IconButton>
                                        </MenuHandler>
                                        <MenuList>
                                            <MenuItem>
                                                <label htmlFor="edit-image" className="flex items-center justify-start gap-1 cursor-pointer" onClick={() => setEdit({ ...edit, type: 'image', _id: c?._id })}>
                                                    <FaImage />
                                                    Rasmni o'zgartirish
                                                </label>
                                            </MenuItem>
                                            <MenuItem className="flex items-center justify-start gap-1" onClick={() => setEdit({ ...edit, type: 'title', _id: c?._id, title: c?.title })}>
                                                <FaEdit />
                                                Nomini o'zgartirish
                                            </MenuItem>
                                            <MenuItem className="flex items-center justify-start gap-1" onClick={() => setEdit({ ...edit, type: 'color', _id: c?._id, color: c?.color, image: c?.image })}>
                                                <BiColorFill />
                                                Orqa fonni o'zgartirish
                                            </MenuItem>
                                        </MenuList>
                                    </Menu>
                                </div>
                                {/* END */}
                            </div>
                        )
                    })
                }
            </div>
            {/* ADD-POPOVER */}
            <Dialog open={add?.open} size="md">
                <DialogHeader>
                    <p className="text-[16px]">Kategoriya qo'shish</p>
                </DialogHeader>
                <DialogBody className="border-y gap-[10px] flex items-center justify-start flex-col overflow-y-scroll h-[400px]">
                    {/* TITLE */}
                    <Input required label="Kategoriya nomi" color="indigo" onChange={e => setAdd({ ...add, title: e.target.value })} value={add?.title} icon={<FaT />} />
                    {/* IMAGE */}
                    <Input required label="Kategoriya rasmi" type="file" accept="image/*" color="indigo" onChange={e => setAdd({ ...add, image: e.target.files[0] })} icon={<FaImage />} />
                    {/* COLOR */}
                    <Input required type="color" label="Kategoriya orqa foni" color="indigo" onChange={e => setAdd({ ...add, color: e.target.value })} value={add?.color} icon={<FaPencil />} />
                    {/* RESULT */}
                    <div className="flex items-center justify-center w-full gap-3">
                        <span className="w-[30%] bg-gray-400 h-[1px]" />
                        <p className="text-black">NATIJA</p>
                        <span className="w-[30%] bg-gray-400 h-[1px]" />
                    </div>
                    {/*  */}
                    <div className="flex items-center justify-center min-w-[200px] min-h-[200px] rounded-full border overflow-hidden" style={{ background: add?.color }}>
                        {!add?.image &&
                            <FaImage className="text-[100px]" />
                        }
                        {add?.image &&
                            <img className="w-[180px]" src={URL?.createObjectURL(add.image)} alt="c_img" />
                        }
                    </div>
                    <p className="text-[20px] text-black">{add?.title}</p>
                </DialogBody>
                <DialogFooter className="gap-[10px]">
                    <Button color="red" onClick={CloseAdd}>Ortga</Button>
                    <IconButton onClick={SubmitAdd} color="indigo" className="text-[20px]"><BiSave /></IconButton>
                </DialogFooter>
            </Dialog>
            {/* EDIT_IMAGE */}
            <input type="file" id="edit-image" accept="image/*" className="hidden" onChange={e => EditImage(edit?._id, e?.target?.files[0])} />
            {/*  */}
            {/* EDIT TILE */}
            <Dialog open={edit?.type === 'title'} size="md">
                <DialogHeader>
                    <p className="text-[16px]">Kategoriya nomini o'zgartirish</p>
                </DialogHeader>
                <DialogBody className="border-y">
                    {/* TITLE */}
                    <Input required label="Kategoriya nomi" color="indigo" onChange={e => setEdit({ ...edit, title: e.target.value })} value={edit?.title} icon={<FaT />} />
                </DialogBody>
                <DialogFooter className="gap-[10px]">
                    <Button color="red" onClick={CloseEdit}>Ortga</Button>
                    <IconButton onClick={EditTitle} color="indigo" className="text-[20px]"><BiSave /></IconButton>
                </DialogFooter>
            </Dialog>
            {/* EDIT COLOR */}
            <Dialog open={edit?.type === 'color'} size="md">
                <DialogHeader>
                    <p className="text-[16px]">Kategoriya orqa fon rangini o'zgartirish</p>
                </DialogHeader>
                <DialogBody className="border-y flex items-center justify-start flex-col ">
                    {/* COLOR */}
                    <Input type="color" required label="Orqa fon" color="indigo" onChange={e => setEdit({ ...edit, color: e.target.value })} value={edit?.color} icon={<FaPencil />} />
                    <div className="flex items-center justify-center w-full gap-3">
                        <span className="w-[30%] bg-gray-400 h-[1px]" />
                        <p className="text-black">NATIJA</p>
                        <span className="w-[30%] bg-gray-400 h-[1px]" />
                    </div>
                    {/*  */}
                    <div className="flex items-center justify-center min-w-[200px] min-h-[200px] rounded-full border overflow-hidden" style={{ background: edit?.color }}>
                        <img className="w-[180px]" src={edit?.image} alt="c_img" />
                    </div>
                </DialogBody>
                <DialogFooter className="gap-[10px]">
                    <Button color="red" onClick={CloseEdit}>Ortga</Button>
                    <IconButton onClick={EditColor} color="indigo" className="text-[20px]"><BiSave /></IconButton>
                </DialogFooter>
            </Dialog>
        </div>
    );
}

export default AdminCategories;