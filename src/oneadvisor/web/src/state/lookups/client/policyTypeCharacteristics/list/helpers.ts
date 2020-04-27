import { PolicyTypeCharacteristic } from "../types";

export const getPolicyTypeCharacteristicName = (
    policyTypeCharacteristicId: string,
    policyTypeCharacteristics: PolicyTypeCharacteristic[]
): string => {
    const policyTypeCharacteristic = policyTypeCharacteristics.find(
        (c) => c.id === policyTypeCharacteristicId
    );

    if (!policyTypeCharacteristic) return "";

    return policyTypeCharacteristic.name;
};
