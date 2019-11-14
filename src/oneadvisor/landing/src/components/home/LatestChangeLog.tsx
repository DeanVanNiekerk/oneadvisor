import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { changeLogLatestApi } from "@/app/api";

import ChangeLog from "../changeLog/ChangeLog";

const LatestChangeLog: React.FC = () => {
    const [changeLog, setChangeLog] = useState();

    async function fetchLatestChangeLog() {
        const response = await fetch(changeLogLatestApi);
        const log = await response.json();
        setChangeLog(log);
    }

    useEffect(() => {
        fetchLatestChangeLog();
    }, []);

    return (
        <div className="container section">
            <div className="row">
                <div className="col text-center pb-5">
                    <h2 className="border-bottom border-secondary d-inline border-width-2">LATEST CHANGES</h2>
                </div>
            </div>

            <div className="row">
                <div className="col">{changeLog && <ChangeLog changeLog={changeLog} />}</div>
            </div>

            <div className="row">
                <div className="col text-center pb-3">
                    <Link to="/change-log" className="btn btn-small btn-secondary clickable text-white">
                        FULL CHANGE LOG
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LatestChangeLog;
