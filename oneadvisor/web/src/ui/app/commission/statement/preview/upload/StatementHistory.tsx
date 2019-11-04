import { Card, Timeline, Typography } from "antd";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import { fetchStatementFiles, Statement, statementFilesSelector } from "@/state/app/commission/statements";
import { downloadFile } from "@/state/file";
import { RootState } from "@/state/rootReducer";
import { ContentLoader, Date } from "@/ui/controls";

const { Text } = Typography;

type Props = {
    statement: Statement;
}
    & PropsFromState
    & PropsFromDispatch;

const StatementHistory: React.FC<Props> = (props: Props) => {

    useEffect(() => {
        props.fetchStatementFiles(props.statement.id);
    }, []);

    const download = (url: string, fileName: string) => {
        props.downloadFile(fileName, url);
    };

    return (<ContentLoader isLoading={props.fetchingFiles}>
        <Card>
            <Timeline>
                {props.files.map(f => {
                    return (
                        <Timeline.Item key={f.url} color={f.deleted ? "red" : "blue"}>
                            <span className="downloadLink" onClick={() => download(f.url, f.name)}>
                                <Text delete={f.deleted}>{f.name}</Text> <Date date={f.created} />
                            </span>
                        </Timeline.Item>
                    );
                })}
            </Timeline>
        </Card>
    </ContentLoader>)
}

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const filesState = statementFilesSelector(state);
    return {
        files: filesState.items,
        fetchingFiles: filesState.fetching,
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        fetchStatementFiles: (commissionStatementId: string) => {
            dispatch(fetchStatementFiles(commissionStatementId));
        },
        downloadFile: (url: string, fileName: string) => {
            dispatch(downloadFile(fileName, url, () => { }));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StatementHistory);
