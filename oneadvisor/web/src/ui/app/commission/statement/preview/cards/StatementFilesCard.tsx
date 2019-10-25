import React, { useState } from "react";
import { connect } from "react-redux";

import { statementPreviewSelector } from "@/state/app/commission/statements";
import { RootState } from "@/state/rootReducer";
import { Button, Drawer, DrawerFooter, Icon, PreviewCard } from "@/ui/controls";

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
            <Icon tooltip="Upload Commission Statement" type="upload" onClick={() => setUploadStatementVisible(true)} />,
        ];

        if (
            props.statement &&
            (props.statement.commissionCount > 0 || props.statement.mappingErrorCount > 0)
        )
            actions.unshift(
                <Icon
                    tooltip="Reimport Commission Statement File"
                    type="reload"
                    className="text-primary"
                    onClick={event => {
                        setReimportStatementVisible(true);
                        event.stopPropagation();
                    }}
                />
            );

        return actions;
    };

    return (
        <>
            <PreviewCard
                title="Statement Files"
                icon="file-excel"
                onClick={() => setUploadStatementVisible(true)}
                isLoading={props.loading}
                rows={4}
                height={props.cardHeight}
                requiredUseCase="com_import_commissions"
                actions={getStatementFilesActions()}
            >
                <div className="text-center">
                    <Icon
                        type="file-excel"
                        style={{
                            fontSize: "36px",
                            paddingTop: "25px",
                        }}
                    />
                </div>
            </PreviewCard>

            <Drawer
                title="Statement Files"
                icon="file-excel"
                visible={uploadStatementVisible}
                onClose={() => setUploadStatementVisible(false)}
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

                <DrawerFooter>
                    <Button onClick={() => setUploadStatementVisible(false)}>Close</Button>
                </DrawerFooter>
            </Drawer>

            <Drawer
                title="Reimport Statement"
                icon="file-excel"
                visible={reimportStatementVisible}
                onClose={() => setReimportStatementVisible(false)}
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

                <DrawerFooter>
                    <Button onClick={() => setReimportStatementVisible(false)}>Close</Button>
                </DrawerFooter>
            </Drawer>
        </>

    )
}

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const statementState = statementPreviewSelector(state);
    return {
        statement: statementState.statement,
        loading: statementState.fetching || !statementState.statement,
    };
};

const StatementFilesCard = connect(mapStateToProps)(StatementFilesCardComponent);

export { StatementFilesCard };
