import { atom } from "recoil";
import { ToastType } from "../types";

export const toastState = atom<ToastType>({
  key: "todoListState",
  default: {
    text: "",
    color: "",
  },
});
