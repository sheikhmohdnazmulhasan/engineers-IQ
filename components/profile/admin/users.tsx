import { DeleteIcon, EditIcon, EyeIcon } from "@/components/icons";
import useAllUsers from "@/hooks/use_all_users";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";

export default function Users() {

    const { data } = useAllUsers();

    console.log(data);

    return (
        <Table removeWrapper aria-label="Example static collection table">
            <TableHeader>
                <TableColumn>NAME</TableColumn>
                <TableColumn>ROLE</TableColumn>
                <TableColumn>STATUS</TableColumn>
                <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody>
                <TableRow key="1">
                    <TableCell>William Howard</TableCell>
                    <TableCell>Community Manager</TableCell>
                    <TableCell>Community Manager</TableCell>
                    <TableCell className="flex gap-3">
                        <EyeIcon />
                        <EditIcon />
                        <DeleteIcon />
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    );
}