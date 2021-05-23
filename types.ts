export type DBTypeJSON = {
  Table_Name: string;
  Column_Name: string;
  Data_Type: string;
};

export type ToastType = {
  text: string;
  color: string;
};

export type RowClickEvent = {
  event: any;
  index: number;
  rowData: Record<string, any>;
};
