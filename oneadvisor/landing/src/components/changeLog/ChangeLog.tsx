import React from "react";
import ReactMarkdown from "react-markdown";

import { ChangeLog as ChangeLogModel } from "@/app/types";

type Props = {
    changeLog: ChangeLogModel;
};

const ChangeLog: React.FC<Props> = ({ changeLog }) => {
    return (
        <>
            <div className="mb-5">
                <h3 className="mb-3">{changeLog.versionNumber}</h3>
                <p className="text-monospace mb-3">{changeLog.releaseDate.substr(0, 10)}</p>
                <ReactMarkdown source={changeLog.log} escapeHtml={false} />
            </div>
            <hr className="mb-5" />
        </>
    );
};

export default ChangeLog;
