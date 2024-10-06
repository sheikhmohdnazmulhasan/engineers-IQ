import { usePagination, PaginationItemType, cn } from "@nextui-org/react";

import { ChevronIcon } from "./icons";
import { useEffect } from "react";

interface PaginationProps {
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ totalPages, onPageChange }: PaginationProps) {

    const { activePage, range, setPage, onNext, onPrevious } = usePagination({
        total: totalPages,
        showControls: true,
        siblings: 10,
        boundaries: 10,
    });

    useEffect(() => {
        onPageChange(activePage);
    }, [activePage])

    console.log('form pp', activePage);

    return (
        <div className="flex flex-col gap-2 justify-center">
            <ul className="flex gap-2 items-center justify-center">
                {range.map((page) => {
                    if (page === PaginationItemType.NEXT) {
                        return (
                            <li key={page} aria-label="next page" className="w-4 h-4">
                                <button
                                    className="w-full h-full bg-default-200 rounded-full"
                                    onClick={onNext}
                                >
                                    <ChevronIcon className="rotate-180" />
                                </button>
                            </li>
                        );
                    }

                    if (page === PaginationItemType.PREV) {
                        return (
                            <li key={page} aria-label="previous page" className="w-4 h-4">
                                <button
                                    className="w-full h-full bg-default-200 rounded-full"
                                    onClick={onPrevious}
                                >
                                    <ChevronIcon />
                                </button>
                            </li>
                        );
                    }

                    if (page === PaginationItemType.DOTS) {
                        return (
                            <li key={page} className="w-4 h-4">
                                ...
                            </li>
                        );
                    }

                    return (
                        <li key={page} aria-label={`page ${page}`} className="w-4 h-4">
                            <button
                                className={cn(
                                    "w-full h-full bg-default-300 rounded-full",
                                    activePage === page && "bg-secondary"
                                )}
                                onClick={() => onPageChange(page)}
                            />
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}