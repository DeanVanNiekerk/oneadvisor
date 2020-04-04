import { Select } from "antd";
import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import { RootState } from "@/state";
import {
    commissionStatementTemplateSelector,
    commissionStatementTemplateSheetPositionsSelector,
    receiveCommissionStatementTemplateSheetIndex,
} from "@/state/commission/templates";

type Props = PropsFromState & PropsFromDispatch;

const SheetSelector: React.FC<Props> = (props: Props) => {
    return (
        <Select<number>
            style={{ width: 150 }}
            onChange={(value) => props.updateSheetIndex(value)}
            value={props.sheetIndex}
        >
            {props.sheetPositions.map((p, index) => {
                return <Select.Option key={index} value={index}>{`Sheet ${p}`}</Select.Option>;
            })}
        </Select>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        sheetPositions: commissionStatementTemplateSheetPositionsSelector(state),
        sheetIndex: commissionStatementTemplateSelector(state).templateSheetIndex,
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        updateSheetIndex: (index: number) => {
            dispatch(receiveCommissionStatementTemplateSheetIndex(index));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SheetSelector);
