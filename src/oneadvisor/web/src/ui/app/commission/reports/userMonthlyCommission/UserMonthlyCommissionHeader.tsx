import { Col, Row } from "antd";
import React from "react";
import { connect } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

import { RootState } from "@/state";
import { downloadUserMonthlyCommissionExcel } from "@/state/commission/reports";
import { Button, Header } from "@/ui/controls";

type Props = PropsFromDispatch;

const UserMonthlyCommissionHeader: React.FC<Props> = (props: Props) => {
    return (
        <Header
            iconName="pie-chart"
            actions={
                <Row gutter={10} align="middle">
                    <Col>
                        <Button iconName="download" onClick={props.download} noLeftMargin={true}>
                            Download
                        </Button>
                    </Col>
                </Row>
            }
        >
            Broker Monthly Commission Report
        </Header>
    );
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    return {
        download: () => {
            dispatch(downloadUserMonthlyCommissionExcel());
        },
    };
};

export default connect(null, mapDispatchToProps)(UserMonthlyCommissionHeader);
