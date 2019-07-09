import { utils, writeFile } from "xlsx";

export type Sheet = {
    name?: string;
    data: any;
};

export const downloadExcel = (data: any, fileName: string) => {
    const workbook = utils.book_new();
    const sheet = utils.json_to_sheet(data);
    utils.book_append_sheet(workbook, sheet);

    writeFile(workbook, fileName);
};

export const downloadExcelSheets = (sheets: Sheet[], fileName: string) => {
    const workbook = utils.book_new();

    sheets.forEach(s => {
        const sheet = utils.json_to_sheet(s.data);
        utils.book_append_sheet(workbook, sheet, s.name);
    });

    writeFile(workbook, fileName);
};
