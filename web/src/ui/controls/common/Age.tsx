import moment from 'moment';
import React from 'react';

type Props = {
    dateOfBirth: string | null;
};

const Age = (props: Props) => {
    if (!props.dateOfBirth) return <span />;

    const dob = moment(props.dateOfBirth);

    return <span>{moment().diff(dob, 'years')}</span>;
};

export { Age };
