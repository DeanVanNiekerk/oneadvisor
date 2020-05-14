import { Upload } from "antd";
import update from "immutability-helper";
import React, { useState } from "react";
import { connect } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

import { downloadExcel, readExcel } from "@/app/excel/helpers";
import { RootState } from "@/state";
import {
    commissionStatementTemplateCommissionTypesConfigSelector,
    commissionStatementTemplateSelector,
    CommissionType,
    CommissionTypes,
    modifyCommissionStatementTemplateCommissionTypes,
} from "@/state/commission/templates";
import { Button } from "@/ui/controls";

type DataRow = {
    [key in string]: string;
};

type Props = PropsFromState & PropsFromDispatch;

const ExportImportCommissionTypes: React.FC<Props> = (props: Props) => {
    const [isExporting, setIsExporting] = useState<boolean>(false);
    const [isImporting, setIsImporting] = useState<boolean>(false);

    if (!props.commissionTypes) return <React.Fragment />;

    const exportCommissionTypes = async () => {
        if (!props.commissionTypes) return;

        setIsExporting(true);

        const data: DataRow[] = props.commissionTypes.types.map((type) => {
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
            };
        });
        await downloadExcel(data, `${props.templateName}_CommissionTypes.xlsx`);

        setIsExporting(false);
    };

    const importCommissionTypes = ({ file, onSuccess }) => {
        setIsImporting(true);

        const reader = new FileReader();

        reader.readAsArrayBuffer(file);

        reader.onload = async () => {
            const data = await readExcel(reader);

            //Remove header
            data.shift();

            const types: CommissionType[] = data.map((cells) => {
                const type: CommissionType = {
                    commissionTypeCode: "",
                    value: "",
                };

                if (cells.length < 2) return type;

                type.commissionTypeCode = cells[cells.length - 1];

                //Remove the last item (the code)
                cells.pop();

                type.value = cells.join(";");

                return type;
            });

            if (props.commissionTypes) props.updateTypes(types, props.commissionTypes);

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
        commissionTypes: commissionStatementTemplateCommissionTypesConfigSelector(state),
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    return {
        updateTypes: (types: CommissionType[], commissionTypes: CommissionTypes) => {
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
