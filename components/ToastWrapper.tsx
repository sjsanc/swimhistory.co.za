import React, { useEffect, useState } from "react";
import { atom, useRecoilValue, useSetRecoilState } from "recoil";
import Toast from "./Toast";
import { toastState } from "../atoms/atoms";

export default function ToastWrapper() {
  const [isToasting, setIsToasting] = useState<boolean>(false);
  const [visibletoastClass, setVisibleToastClass] = useState<boolean>(false);
  const [toastColor, setToastColor] = useState<string>();
  const [toastText, setToastText] = useState<string>();

  const toast = useRecoilValue(toastState);

  // EXAMPLE

  //   <button
  //   onClick={() => {
  //     setToastState({ color: "failure", text: "failure" });
  //   }}>
  //   Toast
  // </button>

  useEffect(() => {
    spawnToast(toast.text, toast.color);
  }, [toast]);

  const spawnToast = (text, color) => {
    setToastColor(color);
    setToastText(text);
    setIsToasting(true);
    setVisibleToastClass(true);
    setTimeout(() => {
      setVisibleToastClass(false);
    }, 3000);
    setTimeout(() => {
      setIsToasting(false);
    }, 5000);
  };

  return (
    <div className="toast-wrapper">
      {isToasting && (
        <Toast
          text={toastText}
          color={toastColor}
          visible={visibletoastClass}
        />
      )}
    </div>
  );
}
