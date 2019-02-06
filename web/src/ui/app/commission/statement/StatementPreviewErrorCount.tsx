import React from 'react';

type Props = {
    count: number;
};

const StatementPreviewErrorCount = (props: Props) => {
    const color = props.count === 0 ? 'text-success' : 'text-error';

    return (
        <div
            className={`${color} text-center`}
            style={{
                fontSize: '2.8em',
                padding: '10px'
            }}
        >
            {props.count}
        </div>
    );
};

export { StatementPreviewErrorCount };
