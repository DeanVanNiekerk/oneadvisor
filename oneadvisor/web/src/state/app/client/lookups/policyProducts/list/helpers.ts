import { CascaderOptionType } from 'antd/lib/cascader';

import { PolicyProduct, PolicyProductType, PolicyType } from '../..';

export const policyProductCascade = (
    policyTypes: PolicyType[],
    policyProductTypes: PolicyProductType[],
    policyProducts: PolicyProduct[],
    companyId: string
): CascaderOptionType[] => {
    return policyTypes.map(policyType => {
        const item = {
            value: policyType.id,
            label: policyType.name,
            children: policyProductTypes
                .filter(
                    productType => productType.policyTypeId === policyType.id
                )
                .map(productType => {
                    const item = {
                        value: productType.id,
                        label: productType.name,
                        children: policyProducts
                            .filter(product => {
                                if (
                                    product.policyProductTypeId ===
                                    productType.id
                                ) {
                                    if (
                                        companyId === "" ||
                                        companyId !== product.companyId
                                    )
                                        return false;

                                    return true;
                                }

                                return false;
                            })
                            .map(product => {
                                return {
                                    value: product.id,
                                    label: product.name,
                                };
                            }),
                    };

                    if (item.children.length === 0) delete item.children;

                    return item;
                }),
        };

        if (item.children.length === 0) delete item.children;

        return item;
    });
};
