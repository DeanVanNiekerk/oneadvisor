import { Col, Row } from 'antd';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';

import { ContentLoader } from '@/ui/controls';

type Props = {
    header: string;
    loading: boolean;
} & RouteComponentProps;

class Layout extends React.Component<Props> {
    redirectToSignIn = () => {
        this.props.history.push("/");
    };

    render() {
        return (
            <>
                <Row type="flex" justify="center">
                    <Col span={5} style={{ marginTop: "80px" }}>
                        <div
                            className="mb-2"
                            style={{
                                fontSize: "32px",
                                textAlign: "center",
                            }}
                            onClick={this.redirectToSignIn}
                        >
                            <span
                                style={{
                                    fontWeight: 100,
                                }}
                            >
                                ONE
                            </span>
                            <span
                                style={{
                                    fontWeight: 600,
                                }}
                            >
                                ADVISOR
                            </span>
                        </div>
                        <h3>{this.props.header}</h3>
                        <ContentLoader isLoading={this.props.loading}>
                            {this.props.children}
                        </ContentLoader>
                    </Col>
                </Row>
            </>
        );
    }
}

export default withRouter(Layout);
