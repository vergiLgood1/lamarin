"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

interface DataTablePaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  startItem: number;
  endItem: number;
  itemLabel?: string;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

interface DataTableProps {
  title?: string;
  description?: string;
  actions?: ReactNode;
  emptyState?: ReactNode;
  isEmpty?: boolean;
  children: ReactNode;
  footer?: ReactNode;
  pagination?: DataTablePaginationProps;
  className?: string;
  contentClassName?: string;
  tableClassName?: string;
  scrollClassName?: string;
}

function DataTablePagination({
  page,
  totalPages,
  totalItems,
  startItem,
  endItem,
  itemLabel = "items",
  onPreviousPage,
  onNextPage,
}: DataTablePaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Showing {startItem} to {endItem} of {totalItems} {itemLabel}
      </p>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onPreviousPage}
          disabled={page === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <div className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onNextPage}
          disabled={page === totalPages}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export function DataTable({
  title,
  description,
  actions,
  emptyState,
  isEmpty = false,
  children,
  footer,
  pagination,
  className,
  contentClassName,
  tableClassName,
  scrollClassName,
}: DataTableProps) {
  return (
    <Card className={cn("flex h-full flex-col", className)}>
      {(title || description || actions) && (
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            {title ? <CardTitle>{title}</CardTitle> : null}
            {description ? <CardDescription>{description}</CardDescription> : null}
          </div>
          {actions ? <div className="self-start sm:self-auto">{actions}</div> : null}
        </CardHeader>
      )}

      <CardContent className={cn("min-h-0 flex-1 space-y-4", contentClassName)}>
        {isEmpty ? (
          emptyState
        ) : (
          <>
            <ScrollArea
              className={cn(
                "h-[560px] rounded-xl border",
                scrollClassName,
              )}
            >
              <Table className={tableClassName}>{children}</Table>
            </ScrollArea>
            {footer ?? (pagination ? <DataTablePagination {...pagination} /> : null)}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export { TableBody, TableCell, TableHead, TableHeader, TableRow };
