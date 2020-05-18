import { Col, Row } from "antd";
import React, { useState } from "react";
import { connect } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

import { RootState } from "@/state";
import { downloadUserMonthlyCommissionExcel } from "@/state/commission/reports";
import { Button, Header } from "@/ui/controls";

type Props = PropsFromDispatch;

const UserMonthlyCommissionHeader: React.FC<Props> = (props: Props) => {
    const [isDownloading, setIsDownloading] = useState<boolean>(false);

    const download = () => {
        setIsDownloading(true);

        props.download(() => {
            setIsDownloading(false);
        });
    };

    return (
        <Header
            iconName="pie-chart"
            actions={
                <Row gutter={10} align="middle">
                    <Col>
                        <Button
                            iconName="download"
                            onClick={download}
                            noLeftMargin={true}
                            loading={isDownloading}
                        >
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
        download: (onComplete: () => void) => {
            dispatch(downloadUserMonthlyCommissionExcel(onComplete));
        },
    };
};

export default connect(null, mapDispatchToProps)(UserMonthlyCommissionHeader);
