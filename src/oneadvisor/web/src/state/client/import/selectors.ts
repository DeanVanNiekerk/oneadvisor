import { createSelector, OutputSelector } from "reselect";
import { v4 } from "uuid";

import { formatExcelDate } from "@/app/utils";
import { RootState } from "@/state/rootReducer";

import { ImportState, ImportTableRow } from "./";
import { ImportColumn } from "./types";

const rootSelector = (state: RootState): ImportState => state.client.import;

export const clientImportSelector: OutputSelector<
    RootState,
    ImportState,
    (state: ImportState) => ImportState
> = createSelector(rootSelector, (root) => root);

export const clientImportTableRowsSelector: OutputSelector<
    RootState,
    ImportTableRow[],
    (state: ImportState) => ImportTableRow[]
> = createSelector(rootSelector, (root) => {
    return root.data.map((d) => {
        const record = {
            _id: v4(),
        };

        root.selectedColumns.forEach((column, index) => {
            let value = d[index];
            if (column === "dateOfBirth" || column === "policyStartDate") {
                value = formatExcelDate(value);
            }

            record[column] = value;
        });
        return record;
    });
});

export const clientImportSelectedColumnsSelector: OutputSelector<
    RootState,
    ImportColumn[],
    (state: ImportState) => ImportColumn[]
> = createSelector(rootSelector, (root) => {
    return root.selectedColumns.map((sc) => {
        const column = root.columns.find((c) => c.id === sc);
        return column ? column : { id: "_id", name: "no match" };
    });
});

export const clientImportProgressPercentSelector: (state: RootState) => number = createSelector(
    rootSelector,
    (root) => {
        return Math.floor(
            ((root.resultsSuccess.length + root.resultsFailure.length) / root.clients.length) * 100
        );
    }
);
