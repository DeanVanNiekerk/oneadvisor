import moment from "moment";

export const SERVER_DATE_FORMAT = "YYYY-MM-DD";

export const DATE_FORMAT = "YYYY-MM-DD";
export const DATE_TIME_FORMAT = "YYYY-MM-DD HH:mm:ss";

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

type TDateRange = {
    start: string;
    end: string;
};

export const getMonthDateRange = (month: number, year: number): TDateRange => {
    var date = moment();
    date = date.month(month - 1);
    date = date.year(year);

    return {
        start: date.startOf("month").format(DATE_FORMAT),
        end: date.endOf("month").format(DATE_FORMAT),
    };
};

export const getMonthOptions = () => {
    return moment.months().map((m, i) => {
        return {
            number: i + 1,
            name: m,
        };
    });
};

export const getMonthName = (number: number) => {
    const month = getMonthOptions().find(m => m.number === number);
    if (!month) return "";
    return month.name;
};

export const getYearOptions = () => {
    let years: number[] = [];
    const thisYear = moment().year();
    for (let i = thisYear - 20; i <= thisYear; i++) {
        years.push(i);
    }
    return years.reverse();
};

export const getAge = (dateOfBirth: string | null) => {
    if (!dateOfBirth) return "";

    const dob = moment(dateOfBirth);

    return moment().diff(dob, "years");
};
