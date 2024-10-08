import { DeleteIcon, EditIcon, EyeIcon } from "@/components/icons";
import useAllUsers from "@/hooks/use_all_users";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner, Chip } from "@nextui-org/react";
import Link from "next/link";

export default function Users() {
    const { data, error, isLoading } = useAllUsers();

    // Handle error state
    if (error) {
        return (
            <div className="h-screen flex justify-center flex-col items-center -mt-32">
                <h2 className="text-center">Failed to load users. Please try again!</h2>
            </div>
        );
    }

    // Handle loading state
    if (isLoading) {
        return (
            <div className="h-screen flex justify-center flex-col items-center -mt-32">
                <Spinner size="lg" />
            </div>
        );
    }

    // Handle empty state
    if (!data || data.data?.length === 0) {
        return (
            <div className="h-screen flex justify-center flex-col items-center -mt-32">
                <h2 className="text-center">There are no users to display!</h2>
            </div>
        );
    };

    // render actual content
    if (data.data?.length) {
        return (
            <Table removeWrapper aria-label="Users table">
                <TableHeader>
                    <TableColumn>NAME</TableColumn>
                    <TableColumn>ROLE</TableColumn>
                    <TableColumn>STATUS</TableColumn>
                    <TableColumn>ACTIONS</TableColumn>
                </TableHeader>
                <TableBody>
                    {data.data?.map((user, index) => (
                        user && (
                            <TableRow key={user.id || index}>
                                <TableCell>{user.name || "N/A"}</TableCell>
                                <TableCell>{user.role.charAt(0).toUpperCase() + user.role.slice(1) || "N/A"}</TableCell>
                                <TableCell>{user.isBlocked ? <Chip size="sm" color="danger">Blcked</Chip> : <Chip size='sm' color="primary">Active</Chip>}</TableCell>
                                <TableCell className="flex gap-3">
                                    <Link href={`/profile/${user.username}`} target="_blank">  <EyeIcon /></Link>
                                    <EditIcon />
                                    <DeleteIcon />
                                </TableCell>
                            </TableRow>
                        )
                    ))}
                </TableBody>
            </Table>
        )
    }
}
