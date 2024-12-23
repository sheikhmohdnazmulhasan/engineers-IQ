
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Modal, ModalContent, useDisclosure, ModalBody, Spinner, Button } from "@nextui-org/react";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { DeleteIcon, EditIcon, EyeIcon } from "@/components/icons";
import Pagination from "@/components/pagination";
import UserName from "@/components/premium_acc_badge";
import useAllUsers from "@/hooks/use_all_users";
import axiosInstance from "@/libs/axiosInstance";
import formatDateReadable from "@/utils/format_date_readable";
import useUser from "@/hooks/useUser";
import { encrypt } from "@/utils/text_encryptor";

export default function Users() {
    const [currentPage, setCurrentPage] = useState<number>(2);
    const { data, error, revalidate } = useAllUsers(currentPage);
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const { isOpen: isOpen2, onOpen: onOpen2, onOpenChange: onOpenChange2, onClose: onClose2 } = useDisclosure();
    const [operationState, setOperationState] = useState<'danger' | 'loading' | 'success' | 'error'>('danger');
    const [operationState2, setOperationState2] = useState<'danger' | 'loading' | 'success' | 'error'>('danger');
    const [targetedUser, setTargetedUser] = useState<string | null>(null);
    const { currentUser } = useUser();

    async function handleUserManagement(action: 'role' | 'status') {
        if (targetedUser === currentUser?._id) {
            setOperationState('error');

            setTimeout(() => {
                onClose();
                setTargetedUser(null);
                setOperationState('danger');
            }, 1000);
            return
        };

        const token = encrypt(currentUser?._id as unknown as string);

        setOperationState('danger');
        try {
            setOperationState('loading');
            const res = await axiosInstance.patch(`/analytics/admin/users?_id=${targetedUser}&action=${action}&token=${token}`);

            if (res.status === 200) {
                setOperationState('success');
                revalidate();
                setTargetedUser(null);

                setTimeout(() => {
                    onClose();
                    setTargetedUser(null);
                    setOperationState('danger');
                }, 1000);

            } else {
                setOperationState('error');

                setTimeout(() => {
                    onClose();
                    setTargetedUser(null);
                    setOperationState('danger');
                }, 1000);
            }
        } catch (error) {
            setOperationState('error');

            setTimeout(() => {
                onClose();
                setTargetedUser(null);
                setOperationState('danger');
            }, 100);
        }
    };

    async function handleDeleteUserPermanently() {
        if (targetedUser === currentUser?._id) {
            setOperationState2('error');

            setTimeout(() => {
                onClose2();
                setTargetedUser(null);
                setOperationState2('danger');
            }, 1000);

            return
        }

        const token = encrypt(currentUser?._id as unknown as string);

        setOperationState2('danger')
        try {
            setOperationState2('loading')
            const res = await axiosInstance.delete(`/analytics/admin/users?_id=${targetedUser}&token=${token}`);

            if (res.status === 200) {
                setOperationState2('success');
                setTargetedUser(null);
                revalidate();

                setTimeout(() => {
                    onClose2();
                    setOperationState2('danger');
                }, 1000);

            } else {
                setOperationState2('error');
                setTargetedUser(null);

                setTimeout(() => {
                    onClose2();
                    setOperationState2('danger');
                }, 1000);

            }
        } catch (error) {
            setOperationState2('error');
            setTargetedUser(null);

            setTimeout(() => {
                onClose2();
                setOperationState2('danger');
            }, 1000);
        }
    };

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
                                        <Button className="px-10 w-full" color="primary" variant="flat" onClick={() => handleUserManagement('role')}>Switch Role</Button>
                                        <Button className="px-10 w-full" color="danger" variant="flat" onClick={() => handleUserManagement('status')}>Switch Status</Button>
                                    </div>
                                </div>
                            </ModalBody>
                        </>
                    </ModalContent>
                </Modal>

                {/* deletion */}
                <Modal
                    backdrop='blur'
                    isOpen={isOpen2}
                    placement="auto"
                    size='sm'
                    onOpenChange={onOpenChange2}
                >
                    <ModalContent >
                        <>

                            <ModalBody>
                                <div className="flex flex-col py-4 items-center justify-center space-y-4">
                                    {
                                        operationState2 === 'danger' ? (
                                            <AlertTriangle color="red" size={60} />

                                        ) : operationState2 === 'loading' ? (
                                            <Spinner size="lg" />
                                        ) : operationState2 === 'success' ? (
                                            <CheckCircle color="green" size={55} />
                                        ) : (
                                            <XCircle color="red" size={50} />
                                        )
                                    }
                                    <h6 className="text-center text-sm font-medium opacity-70">
                                        {
                                            operationState2 === 'danger' ? 'If you delete a user once, all data related to this user will be permanently deleted and can never be recovered!' : operationState2 === 'loading' ? 'Operation will be completed after a while. Please wait.' : operationState2 === 'success' ? 'Operation successful.' : 'Something Bad Happened. Try again!'
                                        }
                                    </h6>
                                    <div className='w-full space-y-2'>
                                        <Button className="px-10 w-full" color="danger" variant="flat" onClick={handleDeleteUserPermanently}>Delete User</Button>
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
                        <TableColumn>LAST LOGIN</TableColumn>
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

                                    <TableCell>{user.isBlocked ? <Chip color="danger" size="sm">Blcked</Chip> : <Chip color="primary" size='sm'>Active</Chip>}</TableCell>
                                    <TableCell>{user.lastLogin ? formatDateReadable(user.lastLogin as unknown as string) : "N/A"}</TableCell>
                                    <TableCell className="flex gap-3">
                                        <Link href={`/profile/${user.username}`} target="_blank">  <EyeIcon /></Link>
                                        <div onClick={() => {
                                            onOpen();
                                            setTargetedUser(user._id);
                                        }}>
                                            <EditIcon />
                                        </div>
                                        <div onClick={() => {
                                            onOpen2();
                                            setTargetedUser(user._id)
                                        }}>
                                            <DeleteIcon />
                                        </div>
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

    return (
        <div className="h-screen flex justify-center flex-col items-center -mt-32">
            <h2 className="text-center">Something Bad Happened!</h2>
        </div>
    )
}
