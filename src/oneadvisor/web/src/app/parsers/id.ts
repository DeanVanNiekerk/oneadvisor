import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

type Gender = "M" | "F";

type Result = {
    success: boolean;
    dateOfBirth?: string;
    gender?: Gender;
};

export const parseIdNumber = (input: string): Result => {
    const result = {
        success: false,
    };

    if (isNaN(parseInt(input))) return { success: false };

    if (input.length < 6) return { success: false };

    const dateString = input.substring(0, 6);
    let dateOfBirth = dayjs(dateString, "YYMMDD");

    //Check that is not parsing invalid dates
    //https://github.com/iamkun/dayjs/issues/605
    if (dateString !== dateOfBirth.format("YYMMDD")) return { success: false };

    if (dateOfBirth.isAfter(dayjs())) {
        dateOfBirth = dateOfBirth.subtract(100, "year");
    }

    const dateOfBirthFormatted = dateOfBirth.format("YYYY-MM-DD");

    if (input.length < 10)
        return {
            success: false,
            dateOfBirth: dateOfBirthFormatted,
        };

    const genderCode = input.substring(6, 10);
    const gender = parseInt(genderCode) < 5000 ? "F" : "M";

    if (input.length < 13)
        return {
            success: false,
            dateOfBirth: dateOfBirthFormatted,
            gender: gender,
        };

    //Apply Luhn formula for check-digits
    let tempTotal = 0;
    let checkSum = 0;
    let multiplier = 1;
    for (let i = 0; i < 13; ++i) {
        tempTotal = parseInt(input.charAt(i)) * multiplier;
        if (tempTotal > 9) {
            tempTotal =
                parseInt(tempTotal.toString().charAt(0)) + parseInt(tempTotal.toString().charAt(1));
        }
        checkSum = checkSum + tempTotal;
        multiplier = multiplier % 2 == 0 ? 1 : 2;
    }

    //Check if valid
    if (checkSum % 10 != 0) {
        return {
            success: false,
            dateOfBirth: dateOfBirthFormatted,
            gender: gender,
        };
    }

    return {
        success: true,
        dateOfBirth: dateOfBirthFormatted,
        gender: gender,
    };

    return result;
};
