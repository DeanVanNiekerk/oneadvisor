import moment from "moment";
import React, { useState } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import { DATE_FORMAT } from "@/app/utils";
import {
    CommissionErrorsFilters,
    downloadCommissionErrors,
    getCommissionErrors,
} from "@/state/app/commission/errors";
import {
    statementPreviewIsLoadingSelector,
    statementPreviewSelector,
} from "@/state/app/commission/statements";
import { organisationCompaniesSelector } from "@/state/app/directory/lookups";
import { RootState } from "@/state/rootReducer";
import ErrorList from "@/ui/app/commission/error/list/ErrorList";
import { Button, Drawer, DrawerFooter, PreviewCard } from "@/ui/controls";
import { DownloadOutlined, ToolOutlined, WarningOutlined } from "@ant-design/icons";

type Props = {
    cardHeight: string;
    onErrorChanged: () => void;
} & PropsFromState &
    PropsFromDispatch;

const MappingErrorsCardComponent: React.FC<Props> = (props: Props) => {
    if (!props.statement || props.statement.mappingErrorCount === 0) return <React.Fragment />;

    const [errorListVisible, setErrorListVisible] = useState<boolean>(false);

    const getCompanyName = () => {
        let companyId = "";
        if (props.statement !== null) companyId = props.statement.companyId;
        const company = props.companies.find((u) => u.id === companyId);
        return company ? company.name : "";
    };

    const downloadMappingErrors = () => {
        if (props.statement === null) return;

        const filters: CommissionErrorsFilters = {
            commissionStatementId: [props.statement.id],
        };

        props.downloadCommissionErrors(props.statement.date, getCompanyName(), filters);
    };

    const color = props.statement.mappingErrorCount === 0 ? "text-success" : "text-error";

    return (
        <>
            <PreviewCard
                title="Mapping Errors"
                iconName="file-exclamation"
                isLoading={props.loading}
                rows={3}
                onClick={() => setErrorListVisible(true)}
                requiredUseCase="com_edit_commission_statements"
                actions={[
                    <ToolOutlined key={"1"} />,
                    <DownloadOutlined
                        key={"2"}
                        onClick={(event) => {
                            downloadMappingErrors();
                            event.stopPropagation();
                        }}
                    />,
                ]}
                height={props.cardHeight}
            >
                <div
                    className={`${color} text-center`}
                    style={{
                        fontSize: "1.1em",
                        padding: "17px",
                    }}
                >
                    <WarningOutlined /> There are <b>{props.statement.mappingErrorCount}</b> mapping
                    errors, please click here to resolve them
                </div>
            </PreviewCard>

            <Drawer
                title={`Mapping Errors - ${props.statement.mappingErrorCount} remaining`}
                iconName="file-exclamation"
                visible={errorListVisible}
                onClose={() => setErrorListVisible(false)}
            >
                <ErrorList statement={props.statement} onSaved={props.onErrorChanged} />
                <DrawerFooter>
                    <Button onClick={() => setErrorListVisible(false)}>Close</Button>
                </DrawerFooter>
            </Drawer>
        </>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const statementState = statementPreviewSelector(state);
    const companiesState = organisationCompaniesSelector(state);
    return {
        statement: statementState.statement,
        loading: statementPreviewIsLoadingSelector(state),
        companies: companiesState,
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        downloadCommissionErrors: (
            date: string,
            companyName: string,
            filters: CommissionErrorsFilters
        ) => {
            dispatch(
                getCommissionErrors(filters, (errors) => {
                    downloadCommissionErrors(errors, companyName, moment(date).format(DATE_FORMAT));
                })
            );
        },
    };
};

const MappingErrorsCard = connect(mapStateToProps, mapDispatchToProps)(MappingErrorsCardComponent);

export { MappingErrorsCard };
