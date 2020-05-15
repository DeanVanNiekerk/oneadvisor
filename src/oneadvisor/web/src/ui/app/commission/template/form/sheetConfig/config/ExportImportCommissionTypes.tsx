import { Upload } from "antd";
import update from "immutability-helper";
import React, { useState } from "react";
import { connect } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

import { downloadExcel, readExcel } from "@/app/excel/helpers";
import { RootState } from "@/state";
import {
    commissionEarningsTypesSelector,
    CommissionType,
    commissionTypesSelector,
} from "@/state/commission/lookups";
import {
    commissionStatementTemplateCommissionTypesConfigSelector,
    commissionStatementTemplateSelector,
    CommissionType as ConfigCommissionType,
    CommissionTypes,
    modifyCommissionStatementTemplateCommissionTypes,
} from "@/state/commission/templates";
import { policyTypesSelector } from "@/state/lookups/client";
import { Button } from "@/ui/controls";

type DataRow = {
    [key in string]: string;
};

type Props = PropsFromState & PropsFromDispatch;

const ExportImportCommissionTypes: React.FC<Props> = (props: Props) => {
    const [isExporting, setIsExporting] = useState<boolean>(false);
    const [isImporting, setIsImporting] = useState<boolean>(false);

    if (!props.templateCommissionTypes) return <React.Fragment />;

    const exportCommissionTypes = async () => {
        if (!props.templateCommissionTypes) return;

        setIsExporting(true);

        const data: DataRow[] = props.templateCommissionTypes.types.map((type) => {
            const commissionType = getCommissionType(type.commissionTypeCode);
            const fragments = type.value.split(";");
            const rowData = fragments.reduce((p, c, i) => {
                return {
                    ...p,
                    [`Fragment ${i + 1}`]: c,
                };
            }, {});
            return {
                ...rowData,
                CommissionTypeCode: type.commissionTypeCode,
                PolicyType: getPolicyTypeName(commissionType),
                EarningsType: getEarningsTypeName(commissionType),
            };
        });
        await downloadExcel(data, `${props.templateName}_CommissionTypes.xlsx`);

        setIsExporting(false);
    };

    const getCommissionType = (commissionTypeCode: string): CommissionType | undefined => {
        return props.commissionTypes.find((c) => c.code === commissionTypeCode);
    };

    const getPolicyTypeName = (commissionType?: CommissionType): string => {
        if (!commissionType) return "";
        const policyType = props.policyTypes.find((p) => p.id === commissionType.policyTypeId);
        return policyType ? policyType.name : "";
    };

    const getEarningsTypeName = (commissionType?: CommissionType): string => {
        if (!commissionType) return "";
        const earningsType = props.earningsTypes.find(
            (p) => p.id === commissionType.commissionEarningsTypeId
        );
        return earningsType ? earningsType.name : "";
    };

    const importCommissionTypes = ({ file, onSuccess }) => {
        setIsImporting(true);

        const reader = new FileReader();

        reader.readAsArrayBuffer(file);

        reader.onload = async () => {
            const data = await readExcel(reader);

            //Remove header
            data.shift();

            const types: ConfigCommissionType[] = data.map((cells) => {
                const type: ConfigCommissionType = {
                    commissionTypeCode: "",
                    value: "",
                };

                if (cells.length < 2) return type;

                type.commissionTypeCode = cells[cells.length - 3];

                //Remove the last 3 item2 (commissionTypeCode, earningsType, policyType)
                cells.pop();
                cells.pop();
                cells.pop();

                type.value = cells.join(";");

                return type;
            });

            if (props.templateCommissionTypes)
                props.updateTypes(types, props.templateCommissionTypes);

            setIsImporting(false);

            onSuccess("done", file);
        };
    };

    return (
        <>
            <Upload
                name="file"
                listType="text"
                className="pull-right"
                customRequest={importCommissionTypes}
                showUploadList={false}
                disabled={isImporting || isExporting}
            >
                <Button disabled={isImporting} iconName="import">
                    Import
                </Button>
            </Upload>
            <Button
                className="pull-right"
                onClick={exportCommissionTypes}
                disabled={isExporting || isExporting}
                iconName="export"
            >
                Export
            </Button>
        </>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const templateState = commissionStatementTemplateSelector(state);
    return {
        templateName: templateState.template ? templateState.template.name : "",
        templateCommissionTypes: commissionStatementTemplateCommissionTypesConfigSelector(state),
        commissionTypes: commissionTypesSelector(state).items,
        earningsTypes: commissionEarningsTypesSelector(state).items,
        policyTypes: policyTypesSelector(state).items,
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    return {
        updateTypes: (types: ConfigCommissionType[], commissionTypes: CommissionTypes) => {
            const modifiedCommissionTypes = update(commissionTypes, {
                types: {
                    $set: [...types],
                },
            });
            dispatch(modifyCommissionStatementTemplateCommissionTypes(modifiedCommissionTypes));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ExportImportCommissionTypes);
