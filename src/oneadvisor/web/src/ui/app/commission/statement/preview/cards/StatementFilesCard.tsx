import { Tooltip } from "antd";
import React, { useState } from "react";
import { connect } from "react-redux";

import { RootState } from "@/state";
import {
    statementPreviewIsLoadingSelector,
    statementPreviewSelector,
} from "@/state/commission/statements";
import { Button, Drawer, PreviewCard } from "@/ui/controls";
import { FileExcelOutlined, ReloadOutlined, UploadOutlined } from "@ant-design/icons";

import ReimportStatement from "../reimport/ReimportStatement";
import UploadStatement from "../upload/UploadStatement";

type Props = {
    cardHeight: string;
    onCommissionsChanged: () => void;
} & PropsFromState;

const StatementFilesCardComponent: React.FC<Props> = (props: Props) => {
    const [uploadStatementVisible, setUploadStatementVisible] = useState<boolean>(false);
    const [reimportStatementVisible, setReimportStatementVisible] = useState<boolean>(false);

    const getStatementFilesActions = () => {
        const actions = [
            <Tooltip key={"1"} title="Upload Commission Statement" mouseEnterDelay={0.5}>
                <UploadOutlined onClick={() => setUploadStatementVisible(true)} />
            </Tooltip>,
        ];

        if (
            props.statement &&
            (props.statement.commissionCount > 0 || props.statement.mappingErrorCount > 0)
        )
            actions.unshift(
                <Tooltip key={"2"} title="Reimport Commission Statement File" mouseEnterDelay={0.5}>
                    <ReloadOutlined
                        className="text-primary"
                        onClick={(event) => {
                            setReimportStatementVisible(true);
                            event.stopPropagation();
                        }}
                    />
                </Tooltip>
            );

        return actions;
    };

    return (
        <>
            <PreviewCard
                title="Statement Files"
                iconName="file-excel"
                onClick={() => setUploadStatementVisible(true)}
                isLoading={props.loading}
                rows={3}
                height={props.cardHeight}
                requiredUseCase="com_import_commissions"
                actions={getStatementFilesActions()}
            >
                <div className="text-center">
                    <FileExcelOutlined
                        style={{
                            fontSize: "36px",
                            paddingTop: "25px",
                        }}
                    />
                </div>
            </PreviewCard>

            <Drawer
                title="Statement Files"
                iconName="file-excel"
                visible={uploadStatementVisible}
                onClose={() => setUploadStatementVisible(false)}
                footer={<Button onClick={() => setUploadStatementVisible(false)}>Close</Button>}
            >
                {props.statement && (
                    <UploadStatement
                        statement={props.statement}
                        onSuccess={() => {
                            props.onCommissionsChanged();
                            setUploadStatementVisible(false);
                        }}
                    />
                )}
            </Drawer>

            <Drawer
                title="Reimport Statement"
                iconName="file-excel"
                visible={reimportStatementVisible}
                onClose={() => setReimportStatementVisible(false)}
                footer={<Button onClick={() => setReimportStatementVisible(false)}>Close</Button>}
            >
                {props.statement && (
                    <ReimportStatement
                        statement={props.statement}
                        onReimported={() => {
                            props.onCommissionsChanged();
                            setReimportStatementVisible(false);
                        }}
                    />
                )}
            </Drawer>
        </>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const statementState = statementPreviewSelector(state);
    return {
        statement: statementState.statement,
        loading: statementPreviewIsLoadingSelector(state),
    };
};

const StatementFilesCard = connect(mapStateToProps)(StatementFilesCardComponent);

export { StatementFilesCard };
