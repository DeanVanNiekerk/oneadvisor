import dayjs from "dayjs";

export const SERVER_DATE_FORMAT = "YYYY-MM-DD";

export const DATE_FORMAT = "YYYY-MM-DD";
export const DATE_TIME_FORMAT = "YYYY-MM-DD HH:mm:ss";

export const formatExcelDate = (date: string): string => {
    if (!Number(date)) return dayjs(date).format(DATE_FORMAT);

    const excelDate = parseInt(date);

    const dateOject = getJsDateFromExcel(excelDate);

    const dayJsDate = dayjs(dateOject);

    return dayJsDate.format(DATE_FORMAT);
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
    let date = dayjs();
    date = date.month(month - 1);
    date = date.year(year);

    return {
        start: date.startOf("month").format(DATE_FORMAT),
        end: date.endOf("month").format(DATE_FORMAT),
    };
};

export const getMonthOptions = () => {
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    return months.map((m, i) => {
        return {
            number: i + 1,
            name: m,
        };
    });
};

export const getMonthName = (number: number) => {
    const month = getMonthOptions().find((m) => m.number === number);
    if (!month) return "";
    return month.name;
};

export const getYearOptions = () => {
    const years: number[] = [];
    const thisYear = dayjs().year();
    for (let i = thisYear - 20; i <= thisYear; i++) {
        years.push(i);
    }
    return years.reverse();
};

export const getAge = (dateOfBirth: string | null) => {
    if (!dateOfBirth) return "";

    const dob = dayjs(dateOfBirth);

    return dayjs().diff(dob, "year");
};
