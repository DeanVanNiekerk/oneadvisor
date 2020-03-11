import React from "react";
import { connect } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

import {
    confirmCancelMappingError,
    fetchNextMappingError,
    mappingErrorCanSaveSelector,
    mappingErrorIsLoadingSelector,
    mappingErrorSelector,
    mappingErrorVisible,
    saveMappingError,
} from "@/state/app/commission/errors";
import { Statement } from "@/state/app/commission/statements";
import { RootState } from "@/state/rootReducer";
import { Button, ContentLoader, Drawer, DrawerFooter } from "@/ui/controls";
import { showConfirm } from "@/ui/feedback/modal/confirm";
import { RightOutlined } from "@ant-design/icons";

import MappingErrorForm from "./form/MappingErrorForm";

type Props = {
    statement: Statement;
    onSaved?: () => void;
} & PropsFromState &
    PropsFromDispatch;

const EditMappingError: React.FC<Props> = (props: Props) => {
    const close = () => props.setVisible(false);
    const cancel = () => props.confirmCancel(close);

    const save = (resolveNext: boolean) => {
        props.saveMappingError(
            props.statement.id,
            // OnSaved
            () => {
                if (props.onSaved) props.onSaved();

                if (resolveNext) {
                    props.fetchNextMappingError(props.statement.id);
                } else {
                    close();
                }
            }
        );
    };

    const getTitle = () => {
        if (props.loading) return "Loading Mapping Error";

        return `Resolve Mapping Error - ${props.statement.mappingErrorCount} remaining`;
    };

    return (
        <>
            <Drawer
                title={getTitle()}
                visible={props.visible}
                onClose={cancel}
                noTopPadding={true}
                icon="file-exclamation"
            >
                <ContentLoader isLoading={props.loading}>
                    <MappingErrorForm statement={props.statement} />
                </ContentLoader>
                <DrawerFooter>
                    <Button onClick={cancel} disabled={props.loading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={() => save(false)}
                        type="primary"
                        disabled={!props.canSave}
                        requiredUseCase="com_edit_commission_statements"
                    >
                        Save
                    </Button>
                    {props.statement.mappingErrorCount > 1 && (
                        <Button
                            onClick={() => save(true)}
                            type="primary"
                            disabled={!props.canSave}
                            requiredUseCase="com_edit_commission_statements"
                        >
                            <span>
                                {"Save & Resolve Next "}
                                <RightOutlined />
                            </span>
                        </Button>
                    )}
                </DrawerFooter>
            </Drawer>
        </>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const mappingErrorState = mappingErrorSelector(state);
    return {
        visible: mappingErrorState.visible,
        loading: mappingErrorIsLoadingSelector(state),
        canSave: mappingErrorCanSaveSelector(state),
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    return {
        fetchNextMappingError: (statementId: string) => {
            dispatch(fetchNextMappingError(statementId));
        },
        confirmCancel: (onCancelled: () => void) => {
            dispatch(confirmCancelMappingError(showConfirm, onCancelled));
        },
        saveMappingError: (statementId: string, onSaved?: () => void) => {
            dispatch(saveMappingError(statementId, onSaved));
        },
        setVisible: (visible: boolean) => {
            dispatch(mappingErrorVisible(visible));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditMappingError);
