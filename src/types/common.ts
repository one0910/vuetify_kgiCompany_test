export type PageSigEntry = {
  formId: string;
  sname: string;
  signId: string;
  signimg: string;
  sigIndex: number;
  isSign: boolean;
  type: string;
  signIndex: string;
  xy: string;
  documentHeight: number;
  pageHeight: number;
  pageIndex: number;
  signDate: string;
  pageTypeIndex: number
};

export type clickableRectsType = {
  x: number;
  y: number;
  width: number;
  height: number;
  xy: string,
  index: { pageIndex: number, sigIndex: number, type: number }
}