export type Sheet = {
    name?: string;
    data: unknown[];
};

export const downloadExcel = async (data: unknown[], fileName: string) => {
    const { utils, writeFile } = await import(/* webpackChunkName: "xlsx" */ "xlsx");

    const workbook = utils.book_new();
    const sheet = utils.json_to_sheet(data);
    utils.book_append_sheet(workbook, sheet);

    writeFile(workbook, fileName);
};

export const downloadExcelSheets = async (sheets: Sheet[], fileName: string) => {
    const { utils, writeFile } = await import(/* webpackChunkName: "xlsx" */ "xlsx");

    const workbook = utils.book_new();

    sheets.forEach((s) => {
        const sheet = utils.json_to_sheet(s.data);
        utils.book_append_sheet(workbook, sheet, s.name);
    });

    writeFile(workbook, fileName);
};

export const readExcel = async <T = string[]>(reader: FileReader): Promise<T[]> => {
    const { utils, read } = await import(/* webpackChunkName: "xlsx" */ "xlsx");

    const fileContents = reader.result;
    const workbook = read(fileContents, { type: "array" });

    const sheetName1 = workbook.SheetNames[0];
    const sheet1 = workbook.Sheets[sheetName1];

    return utils.sheet_to_json<T>(sheet1, {
        header: 1,
        blankrows: false,
    });
};
