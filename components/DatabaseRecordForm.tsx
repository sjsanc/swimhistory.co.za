import { Prisma } from ".prisma/client";
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { rowDataState, toastState } from "../atoms/atoms";
import { cleanTypeLabel } from "../utils/utils";

export default function DatabaseRecordForm({ table, model, types }) {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [updatingRecord, setUpdatingRecord] = useState<boolean>(false);

  // RECOIL
  const setToastState = useSetRecoilState(toastState);
  const selectedRowData = useRecoilValue(rowDataState);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<any>();

  const populateForm = (rowData) => {
    Object.entries(rowData).forEach((key, val) => {
      setValue(key[0], key[1]);
    });
  };

  useEffect(() => {
    if (isMounted) {
      setUpdatingRecord(true);
      populateForm(selectedRowData);
    }
    setIsMounted(true);
  }, [selectedRowData]);

  const postRecord = async (data) => {
    data["table"] = table;
    const post = await fetch("http://localhost:3000/api/maindb/postRecord", {
      method: "POST",
      body: JSON.stringify(data),
    }).then((res) => {
      if (res.status == 200) {
        setToastState({
          color: "success",
          text: "Record post successful",
        });
      } else {
        setToastState({
          color: "failure",
          text: "Record post failed",
        });
      }
    });
  };

  const onSubmit: SubmitHandler<any> = (data) => {
    console.log("Record submitted...");
    data["types"] = types; // attach the type data JSON
    postRecord(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-3 border-t border-gray-300">
      {updatingRecord && (
        <div
          className="flex items-center justify-center w-100
        border border-yellow-300 rounded bg-yellow-100 text-yellow-600 text-xs font-bold mb-3 p-1">
          UPDATING RECORD ID: {selectedRowData["id"]}
        </div>
      )}
      {model
        ? model
            .filter((w) => w !== "id")
            .map((key) => (
              <div className="flex flex-col mb-2">
                <div className="flex justify-between align-center">
                  <label className="mr-2 font-bold text-xs" htmlFor={key}>
                    {key.toUpperCase().replace("_", " ")}
                  </label>
                  <label className="text-xxs font-bold text-white bg-blue-500 px-1 rounded mb-1">
                    {cleanTypeLabel(
                      types.find((x) => x.Column_Name == key).Data_Type
                    ).toUpperCase()}
                  </label>
                </div>
                <input
                  className="border border-gray-300 p-1"
                  id={key}
                  key={key}
                  defaultValue=""
                  {...register(key)}
                />
              </div>
            ))
        : null}
      <div className="w-100 flex justify-end">
        {updatingRecord ? (
          <input
            type="submit"
            value="UPDATE RECORD"
            className="px-2 py-1 rounded text-sm font-bold border-blue-400 border bg-white text-blue-400 hover:text-blue-600 cursor-pointer"
          />
        ) : (
          <input
            type="submit"
            value="SUBMIT"
            className="px-2 py-1 rounded text-sm font-bold border-blue-400 border bg-white text-blue-400 hover:text-blue-600 cursor-pointer"
          />
        )}
      </div>
    </form>
  );
}
function cleanLabelType(arg0: any) {
  throw new Error("Function not implemented.");
}
