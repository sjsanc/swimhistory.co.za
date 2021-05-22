import React, { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import Layout from "../components/Layout";
import * as _ from "lodash";
import VirtualisedTable from "../components/VirtualisedTable";
import { extractTypes, getColumns, getRows } from "../utils/utils";
import { Prisma, swimming_types, swimmers } from ".prisma/client";
import DatabaseRecordForm from "../components/DatabaseRecordForm";
import { DBTypeJSON } from "../types";
import DatabaseIcon from "../assets/site_images/database_icon.svg";

const Home: React.FC<any> = (props) => {
  const [dbStatus, setDbStatus] = useState<boolean>(false);
  const [currentTableData, setCurrentTableData] = useState<any[]>();
  const [currentTableName, setCurrentTableName] = useState<string>();
  const [currentTableTypes, setCurrentTableTypes] = useState<DBTypeJSON[]>();

  const VARS = {
    IP: "http://localhost",
    PORT: 3000,
  }; // this stuff is fine anyway

  // For building the Virtualized Table
  const [columns, setColumns] = useState<string[]>([]);
  const [rows, setRows] = useState();

  useEffect(() => {
    pingDb();
    const interval = setInterval(() => {
      pingDb();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const pingDb = async () => {
    await fetch(`http://localhost:3000/api/ping`).then((res) =>
      res.status == 200 ? setDbStatus(true) : setDbStatus(false)
    );
  };

  const fetchTableData = async (e: any) => {
    const table = e.target.innerText.toLowerCase();
    const res = await fetch(`http://localhost:3000/api/maindb/${table}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          setRows(data);
          setCurrentTableData(data);
          setCurrentTableName(table);
          setColumns(getColumns(data[0]));
          setCurrentTableTypes(extractTypes(props.typesData, table));
        } else {
          console.log("No table data found");
        }
      });
  };

  return (
    <Layout>
      <main>
        <div className="admin-dashboard rounded-md border-gray-300 border py-3 mb-3 grid grid-cols-2">
          <div className="border-r border-gray-300 px-3 flex justify-between">
            <div className="flex justify-center flex-col">
              <h2 className="text-3xl flex items-center">
                Swimhistory_db
                <DatabaseIcon className="ml-2" />
              </h2>
              <p className="text-md font-light">
                Primary database for swimmer records and details.
              </p>
            </div>
          </div>
          <div className="px-3 flex flex-col flex-wrap">
            <div className="mr-5">
              <label className="mr-2 text-gray-400 font-bold text-xs">
                IP ADDRESS:
              </label>
              <span className="">{VARS.IP}</span>
            </div>
            <div>
              <label className="mr-2 text-gray-400 font-bold text-xs">
                PORT:
              </label>
              <span>{VARS.PORT}</span>
            </div>
            <div>
              <label className="mr-2 text-gray-400 font-bold text-xs">
                STATUS:
              </label>
              <span
                className={`text-sm font-bold ${
                  dbStatus ? "text-green-500" : "text-red-500"
                }`}>
                {dbStatus ? "CONNECTED" : "UNAVAILABLE"}
              </span>
            </div>
          </div>
        </div>

        <div className="admin-table rounded-md border-gray-300 border p-3">
          <div className="flex mb-5 overflow-x-auto">
            {props.tables.map((header, i) => (
              <button
                className={`text-gray-400 border-b-2 px-5 py-2 hover:text-black focus:outline-none ${
                  currentTableName == header ? "border-blue-500" : ""
                }`}
                onClick={(e) => fetchTableData(e)}
                key={i}>
                {header}
              </button>
            ))}
          </div>
          <div className="grid gap-x-3 grid-cols-12 main-db">
            {currentTableData && columns.length > 0 ? (
              <div className="col-span-9 rounded-md border-gray-300 border">
                <VirtualisedTable cols={columns} rows={rows} />
              </div>
            ) : (
              <div className="col-span-9 rounded-md border-gray-300 border flex items-center justify-center">
                <h1 className="text-gray-400 mr-2 font-bold text-sm">
                  NOTHING HERE YET!
                </h1>
              </div>
            )}
            <div className="col-span-3 rounded-md border-gray-300 border">
              <div className="text-center py-1">
                <label className="mr-2 text-gray-400 font-bold text-xs">
                  RECORD MANAGER
                </label>
              </div>
              {columns && currentTableTypes ? (
                <DatabaseRecordForm
                  table={currentTableName}
                  model={columns}
                  types={currentTableTypes}
                />
              ) : null}
              {/* {columns ? columns.map((col) => <div>{col}</div>) : null} */}
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const typesReq = await fetch("http://localhost:3000/api/maindb/getAllTypes");
  const typesData = await typesReq.json();

  const tablesReq = await fetch("http://localhost:3000/api/maindb/getTables");
  const tablesData = await tablesReq.json();
  let tables = await _.flattenDeep(tablesData.map((x) => Object.values(x)));

  return {
    props: { tables, typesData },
  };
};

export default Home;
