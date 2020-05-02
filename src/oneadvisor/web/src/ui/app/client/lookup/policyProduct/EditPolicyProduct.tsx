import React, { Component } from "react";
import { connect, DispatchProp } from "react-redux";

import { areEqual } from "@/app/utils";
import { ValidationResult } from "@/app/validation/types";
import { RootState } from "@/state";
import {
    insertPolicyProduct,
    policyProductSelector,
    updatePolicyProduct,
} from "@/state/lookups/client";
import { PolicyProductEdit } from "@/state/lookups/client/policyProducts/types";
import { Button, ContentLoader, Drawer } from "@/ui/controls";
import { showConfirm } from "@/ui/feedback/modal/confirm";

import PolicyProductForm from "./PolicyProductForm";

type Props = {
    visible: boolean;
    onClose: (cancelled: boolean) => void;
    policyProduct: PolicyProductEdit | null;
    updating: boolean;
    validationResults: ValidationResult[];
} & DispatchProp;

type State = {
    policyProductEdited: PolicyProductEdit | null;
};

class EditPolicyProduct extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            policyProductEdited: props.policyProduct,
        };
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.policyProduct != prevProps.policyProduct)
            this.setState({
                policyProductEdited: this.props.policyProduct,
            });
    }

    close = () => {
        this.props.onClose(false);
    };

    confirmCancel = () => {
        if (!areEqual(this.props.policyProduct, this.state.policyProductEdited))
            return showConfirm({ onOk: this.cancel });

        this.cancel();
    };

    cancel = () => {
        this.props.onClose(true);
    };

    save = () => {
        if (!this.state.policyProductEdited) {
            this.close();
            return;
        }

        if (this.state.policyProductEdited.id) {
            this.props.dispatch(updatePolicyProduct(this.state.policyProductEdited, this.close));
        } else {
            this.props.dispatch(insertPolicyProduct(this.state.policyProductEdited, this.close));
        }
    };

    onChange = (policyProduct: PolicyProductEdit) => {
        this.setState({
            policyProductEdited: policyProduct,
        });
    };

    isLoading = () => {
        return this.props.updating;
    };

    getTitle = () => {
        const { policyProduct } = this.props;

        if (policyProduct && policyProduct.id) return `Policy Product: ${policyProduct.name}`;

        return "New Policy Product";
    };

    render() {
        const { policyProduct, validationResults, visible } = this.props;

        return (
            <Drawer
                title={this.getTitle()}
                iconName="database"
                visible={visible}
                onClose={this.confirmCancel}
                footer={
                    <React.Fragment>
                        <Button onClick={this.confirmCancel} disabled={this.isLoading()}>
                            Cancel
                        </Button>
                        <Button onClick={this.save} type="primary" disabled={this.isLoading()}>
                            Save
                        </Button>
                    </React.Fragment>
                }
            >
                <ContentLoader isLoading={this.isLoading()}>
                    {policyProduct && (
                        <PolicyProductForm
                            policyProduct={policyProduct}
                            validationResults={validationResults}
                            onChange={this.onChange}
                        />
                    )}
                </ContentLoader>
            </Drawer>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const policyProductState = policyProductSelector(state);

    return {
        policyProduct: policyProductState.policyProduct,
        updating: policyProductState.updating,
        validationResults: policyProductState.validationResults,
    };
};

export default connect(mapStateToProps)(EditPolicyProduct);
