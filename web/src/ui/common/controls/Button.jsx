// @flow

import * as React from 'react';
import ButtonMui from '@material-ui/core/Button';
import styled from 'styled-components';

const ButtonStyled = styled(ButtonMui)`
   margin-left: 8px !important;
`;

type Props = {
    children: React.Node
};

const Button = ({ ...props }: Props) => (
     <ButtonStyled variant="contained" {...props}>
        {props.children}
    </ButtonStyled>
)

export { Button };

