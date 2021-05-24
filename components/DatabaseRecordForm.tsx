import { Prisma } from ".prisma/client";
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { rowDataState, toastState } from "../atoms/atoms";
import { cleanTypeLabel } from "../utils/utils";
import PlusIcon from "../assets/site_images/plus-square.svg";

export default function DatabaseRecordForm({ table, model, types }) {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [updatingRecord, setUpdatingRecord] = useState<boolean>(false);

  // RECOIL
  const setToastState = useSetRecoilState(toastState);
  const selectedRowData = useRecoilValue(rowDataState);
  const setRowDataState = useSetRecoilState(rowDataState);

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
    // Prevent the form from populating on first load
    if (isMounted && Object.keys(selectedRowData).length > 0) {
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
        return true;
      } else {
        setToastState({
          color: "failure",
          text: "Record post failed",
        });
        return false;
      }
    });
  };

  const formReset = (e) => {
    e.target.reset();
    setUpdatingRecord(false);
    setRowDataState({});
  };

  const updateRecord = async (data) => {
    data["table"] = table;
    const update = await fetch(
      "http://localhost:3000/api/maindb/updateRecord",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    ).then((res) => {
      if (res.status == 200) {
        setToastState({ color: "success", text: "Record update successful" });
        return true;
      } else {
        setToastState({ color: "failure", text: "Record update failed" });
        return false;
      }
    });
  };

  const deleteRecord = async (data) => {
    data["table"] = table;
    const eradicate = await fetch(
      "http://localhost:3000/api/maindb/updateRecord",
      {
        method: "DELETE",
        body: JSON.stringify(data),
      }
    ).then((res) => {
      if (res.status == 200) {
        setToastState({
          color: "success",
          text: "Record deleted successfully",
        });
        return true;
      } else {
        setToastState({ color: "failure", text: "Record delete failed" });
        return false;
      }
    });
  };

  const onSubmit: SubmitHandler<any> = (data, event) => {
    const type = event.nativeEvent["submitter"].getAttribute("data-type");
    switch (type) {
      case "create":
        formReset(event);
        break;
      case "post": // posting a new record
        data["types"] = types; // attach the type data JSON
        postRecord(data) ? formReset(event) : null;
        break;
      case "delete":
        deleteRecord(data) ? formReset(event) : null;
        break;
      case "update":
        updateRecord(data) ? formReset(event) : null;
      default:
        null;
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-3 border-t border-gray-300">
      {updatingRecord && (
        <div className="flex justify-between items-center mb-3">
          <div
            className="flex items-center justify-center w-100
        border border-yellow-300 rounded bg-yellow-100 text-yellow-600 text-xs font-bold p-1">
            UPDATING RECORD ID: {selectedRowData["id"]}
          </div>
          <input
            type="submit"
            data-type="delete"
            value="DELETE RECORD"
            className="rounded text-xs font-bold bg-white text-red-500 py-1 px-2 hover:bg-red-100 cursor-pointer"
          />
        </div>
      )}
      {model
        ? model
            .filter((w) => w !== "id")
            .map((key) => (
              <div key={key} className="flex flex-col mb-2">
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
      <div className="w-100 flex justify-between">
        {updatingRecord ? (
          <>
            <input
              type="submit"
              data-type="create"
              value="NEW RECORD"
              className="px-2 py-1 rounded text-sm font-bold border-blue-400 border bg-white text-blue-400 hover:bg-blue-100 cursor-pointer"
            />
            <input
              type="submit"
              data-type="update"
              value="UPDATE RECORD"
              className="px-2 py-1 rounded text-sm font-bold border-yellow-500 border bg-white text-yellow-500 hover:bg-yellow-100 cursor-pointer"
            />
          </>
        ) : (
          <input
            type="submit"
            data-type="post"
            value="SUBMIT"
            className="px-2 py-1 rounded text-sm font-bold border-blue-400 border bg-white text-blue-400 hover:text-blue-600 cursor-pointer ml-auto"
          />
        )}
      </div>
    </form>
  );
}
function cleanLabelType(arg0: any) {
  throw new Error("Function not implemented.");
}
