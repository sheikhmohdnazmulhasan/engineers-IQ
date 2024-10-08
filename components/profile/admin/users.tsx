import { DeleteIcon, EditIcon, EyeIcon } from "@/components/icons";
import Pagination from "@/components/pagination";
import UserName from "@/components/premium_acc_badge";
import useAllUsers from "@/hooks/use_all_users";
import formatDateReadable from "@/utils/format_date_readable";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Modal, ModalContent, useDisclosure, ModalBody, Spinner, Button } from "@nextui-org/react";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Users() {
    const [currentPage, setCurrentPage] = useState<number>(2);
    const { data, error } = useAllUsers(currentPage);
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [operationState, setOperationState] = useState<'danger' | 'loading' | 'success' | 'error'>('danger')


    // Handle error state
    if (error) {
        return (
            <div className="h-screen flex justify-center flex-col items-center -mt-32">
                <h2 className="text-center">Failed to load users. Please try again!</h2>
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
            <div className="">
                <Modal
                    backdrop='blur'
                    isOpen={isOpen}
                    placement="auto"
                    size='sm'
                    onOpenChange={onOpenChange}
                >
                    <ModalContent >
                        <>

                            <ModalBody>
                                <div className="flex flex-col py-4 items-center justify-center space-y-4">
                                    {
                                        operationState === 'danger' ? (
                                            <AlertTriangle color="red" size={60} />

                                        ) : operationState === 'loading' ? (
                                            <Spinner size="lg" />
                                        ) : operationState === 'success' ? (
                                            <CheckCircle color="green" size={55} />
                                        ) : (
                                            <XCircle color="red" size={50} />
                                        )
                                    }
                                    <h6 className="text-center text-sm font-medium opacity-70">
                                        {
                                            operationState === 'danger' ? 'This is a sensitive action. Think carefully before doing any operation' : operationState === 'loading' ? 'Operation will be completed after a while. Please wait.' : operationState === 'success' ? 'Operation successful.' : 'Something Bad Happened. Try again!'
                                        }
                                    </h6>
                                    <div className='w-full space-y-2'>
                                        <Button className="px-10 w-full" color="primary" variant="flat">Switch Role</Button>
                                        <Button className="px-10 w-full" color="danger" variant="flat">Block User</Button>
                                    </div>
                                </div>
                            </ModalBody>
                        </>
                    </ModalContent>
                </Modal>

                <Table removeWrapper aria-label="Users table">
                    <TableHeader>
                        <TableColumn>NAME</TableColumn>
                        <TableColumn>ROLE</TableColumn>
                        <TableColumn>STATUS</TableColumn>
                        <TableColumn>Last Login</TableColumn>
                        <TableColumn>ACTIONS</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {data.data?.map((user, index) => (
                            user && (
                                <TableRow key={user.id || index}>
                                    <TableCell>
                                        <UserName isPremium={user.isPremiumMember} name={user.name} />
                                    </TableCell>
                                    <TableCell>{user.role.charAt(0).toUpperCase() + user.role.slice(1) || "N/A"}</TableCell>

                                    <TableCell>{user.isBlocked ? <Chip size="sm" color="danger">Blcked</Chip> : <Chip size='sm' color="primary">Active</Chip>}</TableCell>
                                    <TableCell>{formatDateReadable(user.lastLogin as unknown as string) || "N/A"}</TableCell>
                                    <TableCell className="flex gap-3">
                                        <Link href={`/profile/${user.username}`} target="_blank">  <EyeIcon /></Link>
                                        <div onClick={onOpen}>
                                            <EditIcon />
                                        </div>
                                        <DeleteIcon />
                                    </TableCell>
                                </TableRow>
                            )
                        ))}
                    </TableBody>
                </Table>

                {data.pagination.totalUsers > 10 && (
                    <div className="mt-4">
                        <Pagination totalPages={data.pagination.totalPages} onPageChange={setCurrentPage} />
                    </div>
                )}
            </div>
        )
    }
}
