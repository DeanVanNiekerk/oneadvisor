import moment from 'moment';

export const DATE_FORMAT = 'YYYY-MM-DD';

export const formatExcelDate = (date: string): string => {
    if (!Number(date)) return moment(date).format(DATE_FORMAT);

    const excelDate = parseInt(date);

    const dateOject = getJsDateFromExcel(excelDate);

    const momentDate = moment(dateOject);

    return momentDate.format(DATE_FORMAT);
};

const getJsDateFromExcel = (excelDate: number) => {
    const secondsInDay = 24 * 60 * 60;
    const missingLeapYearDay = secondsInDay * 1000;
    const delta = excelDate - (25567 + 2);
    const parsed = delta * missingLeapYearDay;
    return new Date(parsed);
};
