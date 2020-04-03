import { Card, Timeline, Typography } from "antd";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import { auditLogHistorySelector, fetchAuditHistory } from "@/state/directory/audit";
import { RootState } from "@/state/rootReducer";
import { ContentLoader, Date } from "@/ui/controls";

const { Text } = Typography;

type Props = {
    entity: string;
    entityId: string;
} & PropsFromState &
    PropsFromDispatch;

const AuditHistory: React.FC<Props> = (props: Props) => {
    useEffect(() => {
        props.fetchAuditHistory(props.entity, props.entityId);
    }, [props.entity, props.entityId]);

    return (
        <ContentLoader isLoading={props.fetching}>
            <Card>
                <Timeline>
                    {props.items.map((i) => {
                        return (
                            <Timeline.Item key={i.id}>
                                <Text>{i.action}</Text> <Date date={i.date} />
                            </Timeline.Item>
                        );
                    })}
                </Timeline>
            </Card>
        </ContentLoader>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const historyState = auditLogHistorySelector(state);
    return {
        items: historyState.items,
        fetching: historyState.fetching,
        limitReached: historyState.limitReached,
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        fetchAuditHistory: (entity: string, entityId: string) => {
            dispatch(fetchAuditHistory(entity, entityId));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AuditHistory);
