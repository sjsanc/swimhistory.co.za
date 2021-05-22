import { DBTypeJSON } from "../types";

type Obj = { [key: string]: any };

// Extract column headers from a raw data array
export const getColumns = (data: Obj): string[] => {
  return Object.keys(data).length > 0 ? Object.keys(data) : [];
};

export const getRows = (data) => {
  return data.map((row) => Object.values(row));
};

export const extractTypes = (typeJSON: DBTypeJSON[], tableName) => {
  return typeJSON.filter((record) => record.Table_Name == tableName);
};

export const cleanTypeLabel = (typeLabel: string): string => {
  return typeLabel
    .replace("varchar", "string")
    .replace("int", "numeric")
    .replace("bit", "boolean");
};
