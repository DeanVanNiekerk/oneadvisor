import React, { Component } from "react";
import { connect, DispatchProp } from "react-redux";

import { clientImportSelector } from "@/state/app/client/import";
import { RootState } from "@/state/rootReducer";
import { Header } from "@/ui/controls";

import Configure from "./steps/Configure";
import Import from "./steps/Import";
import Upload from "./steps/Upload";
import Verify from "./steps/Verify";

type Props = {
    currentStepIndex: number;
} & DispatchProp;

type State = {
    steps: React.ReactNode[];
};

class ClientImport extends Component<Props, State> {
    constructor(props) {
        super(props);

        this.state = {
            steps: [<Upload key={"1"} />, <Configure key={"2"} />, <Verify key={"3"} />, <Import key={"4"} />],
        };
    }

    render() {
        const { steps } = this.state;
        const { currentStepIndex } = this.props;

        return (
            <>
                <Header icon="import">Import Client Data</Header>

                <div>{steps[currentStepIndex]}</div>
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const importState = clientImportSelector(state);

    return {
        currentStepIndex: importState.currentStepIndex,
    };
};

export default connect(mapStateToProps)(ClientImport);
