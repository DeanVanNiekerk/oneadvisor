import { Icon, Menu } from "antd";
import React from "react";
import { connect } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

import {
    commissionStatementTemplateSelector,
    commissionStatementTemplateVisible,
    confirmCancelCommissionStatementTemplate,
    saveCommissionStatementTemplate,
} from "@/state/app/commission/templates";
import { RootState } from "@/state/rootReducer";
import { Button, ContentLoader, Drawer, DrawerFooter, DropdownButton } from "@/ui/controls";
import { showConfirm } from "@/ui/feedback/modal/confirm";

import EditTemplateTitle from "./EditTemplateTitle";
import TemplateForm from "./form/TemplateForm";

type Props = {
    onSaved?: () => void;
} & PropsFromState &
    PropsFromDispatch;

const EditTemplate: React.FC<Props> = (props: Props) => {
    const close = () => props.setVisible(false);

    const cancel = () => {
        props.confirmCancel(close);
    };

    const menu = (
        <Menu>
            <Menu.Item
                key="save_and_update"
                onClick={() => props.saveTemplate(true, props.onSaved)}
            >
                <Icon type="tool" />
                Save {"&"} Update Unknown Commission Types
            </Menu.Item>
        </Menu>
    );

    return (
        <Drawer
            title={<EditTemplateTitle />}
            icon="block"
            visible={props.visible}
            onClose={cancel}
            noTopPadding={true}
        >
            <ContentLoader isLoading={props.updating}>
                {/* <TemplateForm
                    onChange={this.onChange}
                    saveTemplate={(
                        onSuccess?: ApiOnSuccess,
                        onFailure?: ApiOnFailure,
                        disableSuccessMessage?: boolean
                    ) => this.save(false, onSuccess, onFailure, disableSuccessMessage)}
                /> */}
                <TemplateForm />
            </ContentLoader>
            <DrawerFooter>
                <Button onClick={cancel} disabled={props.updating}>
                    Close
                </Button>

                <DropdownButton
                    type="primary"
                    overlay={menu}
                    icon={<Icon type="down" />}
                    onClick={() => props.saveTemplate(false, props.onSaved)}
                >
                    Save
                </DropdownButton>
            </DrawerFooter>
        </Drawer>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const templateState = commissionStatementTemplateSelector(state);

    return {
        visible: templateState.visible,
        updating: templateState.updating || templateState.fetching,
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    return {
        confirmCancel: (onCancelled: () => void) => {
            dispatch(confirmCancelCommissionStatementTemplate(showConfirm, onCancelled));
        },
        saveTemplate: (updateUnknownCommissionTypes: boolean, onSaved?: () => void) => {
            dispatch(
                saveCommissionStatementTemplate(updateUnknownCommissionTypes, () => {
                    if (onSaved) onSaved();
                    dispatch(commissionStatementTemplateVisible(false));
                })
            );
        },
        setVisible: (visible: boolean) => {
            dispatch(commissionStatementTemplateVisible(visible));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditTemplate);
