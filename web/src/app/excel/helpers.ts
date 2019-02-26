import { utils, writeFile } from 'xlsx';

export const downloadExcel = (data: any, fileName: string) => {
    const workbook = utils.book_new();
    const sheet = utils.json_to_sheet(data);
    utils.book_append_sheet(workbook, sheet);

    writeFile(workbook, fileName);
};
