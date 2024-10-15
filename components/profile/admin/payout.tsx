'use client'

import formatDateReadable from "@/utils/format_date_readable";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import axios from "axios";
import useSWR from "swr";

const fetcher = (url: string) => axios.get(url).then(res => res.data.data);
export default function Payout() {

    const { data } = useSWR('/api/pay/record', fetcher);

    return (
        <Table aria-label="Example static collection table">
            <TableHeader>
                <TableColumn>NAME</TableColumn>
                <TableColumn>DATE</TableColumn>
                <TableColumn>AMOUNT</TableColumn>
            </TableHeader>
            <TableBody>
                {data?.map((pay: {
                    name: string;
                    createdAt: Date;
                }) => (
                    <TableRow key={pay?.name}>
                        <TableCell>{pay?.name}</TableCell>
                        <TableCell>{formatDateReadable(pay.createdAt as unknown as string)}</TableCell>
                        <TableCell>USD 20</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}