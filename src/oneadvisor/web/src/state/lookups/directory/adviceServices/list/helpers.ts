import { AdviceService } from "../types";

export const getAdviceServiceName = (
    adviceServiceId: string,
    adviceServices: AdviceService[]
): string => {
    const adviceService = adviceServices.find((c) => c.id === adviceServiceId);

    if (!adviceService) return "";

    return adviceService.name;
};
