import { Input } from "antd";
import { ColumnProps } from "antd/lib/table";
import React, { useEffect, useState } from "react";
import { connect, DispatchProp } from "react-redux";

import { applyLike } from "@/app/query";
import { Filters, getColumnDefinition, PageOptions, SortOptions } from "@/app/table";
import { Client } from "@/state/client/clients/types";
import { getClients } from "@/state/lookups/client";
import { Age, getTable } from "@/ui/controls";
import { SearchOutlined } from "@ant-design/icons";

const Table = getTable<Client>();

type Props = {
    onSelect: (clientId: string) => void;
    defaultSearchText?: string;
} & DispatchProp;

const ClientSearchComponent: React.FC<Props> = (props) => {
    const [searchText, setSearchText] = useState<string>(props.defaultSearchText || "");
    const [fetching, setFetching] = useState<boolean>(false);
    const [clients, setClients] = useState<Client[]>([]);

    useEffect(() => {
        loadClients();
    }, [searchText]);

    const loadClients = () => {
        let filters: Filters<Client> = {
            lastName: [searchText],
        };

        filters = applyLike(filters, ["lastName"]);

        const pageOptions: PageOptions = {
            number: 1,
            size: 100,
        };

        const sortOptions: SortOptions = {
            column: "lastName",
            direction: "asc",
        };

        setFetching(true);

        props.dispatch(
            getClients(
                filters,
                pageOptions,
                sortOptions,
                //Success
                (result) => {
                    setClients(result.items);
                },
                //Always
                () => {
                    setFetching(false);
                }
            )
        );
    };

    const selectClient = (id: string) => {
        props.onSelect(id);
    };

    const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    };

    return (
        <>
            <Input
                autoFocus={true}
                size="large"
                placeholder="Last Name"
                prefix={<SearchOutlined />}
                allowClear={true}
                value={searchText}
                onChange={onSearchChange}
                className="mb-1"
            />
            <Table
                rowKey="id"
                columns={getColumns()}
                dataSource={clients}
                loading={fetching}
                onRowClick={(client) => selectClient(client.id)}
            />
        </>
    );
};

const getColumns = (): ColumnProps<Client>[] => {
    const getColumn = getColumnDefinition<Client>();

    return [
        getColumn("lastName", "Last Name", {}, { sorter: false }),
        getColumn("initials", "Initials", {}, { sorter: false }),
        getColumn(
            "dateOfBirth",
            "Age",
            {},
            {
                sorter: false,
                render: (dateOfBirth: string) => {
                    return <Age dateOfBirth={dateOfBirth} />;
                },
            }
        ),
        getColumn("idNumber", "ID Number", {}, { sorter: false }),
    ];
};

const ClientSearch = connect()(ClientSearchComponent);

export { ClientSearch };
