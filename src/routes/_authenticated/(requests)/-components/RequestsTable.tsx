import { TbCheck, TbX, TbTrash } from 'react-icons/tb'
import { Avatar, Tooltip, Badge, Dialog, Button } from '@/components/ui'
import { stringToColor } from '@/utils/colours'
import type { OnSortParam, ColumnDef, Row } from '@/components/shared/DataTable'
import DataTable from '@/components/shared/DataTable'
import { useMemo, useState } from 'react'
import { DateFormat } from '@/components/shared/common'
import { useRequests } from '../-hooks/useRequests'
import type { IntroductionRequestWithDetails } from '../-store/requestStore'

type RequestsTableProps = {
  onSelectAcceptRequest: (request: IntroductionRequestWithDetails) => void
  onSelectRejectRequest: (request: IntroductionRequestWithDetails) => void
}

const RequesterColumn = ({ row }: { row: IntroductionRequestWithDetails }) => {
  const avatarColor = stringToColor(row.requesterName)

  return (
    <div className="flex items-center gap-3">
      <Avatar
        size={40}
        shape="circle"
        style={{ backgroundColor: avatarColor }}
        className="text-white font-semibold flex-shrink-0 p-4"
      >
        {row.requesterName?.charAt(0) || 'U'}
      </Avatar>
      <div>
        <div className="font-medium text-gray-900 dark:text-gray-100">
          {row.requesterName}
        </div>
        {row.requesterCompany && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {row.requesterCompany}
          </div>
        )}
      </div>
    </div>
  )
}

const ContactColumn = ({ row }: { row: IntroductionRequestWithDetails }) => {
  return (
    <div>
      <div className="font-medium text-gray-900 dark:text-gray-100">
        {row.targetContactName}
      </div>
      {row.targetContactCompany && (
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {row.targetContactCompany}
        </div>
      )}
    </div>
  )
}

const StatusColumn = ({ status }: { status: string }) => {
  const statusConfig = {
    pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
    approved: { color: 'bg-green-100 text-green-800', label: 'Approved' },
    declined: { color: 'bg-red-100 text-red-800', label: 'Declined' },
  }

  const config =
    statusConfig[status as keyof typeof statusConfig] || statusConfig.pending

  return <Badge className={config.color}>{config.label}</Badge>
}

const ActionColumn = ({
  row,
  onAccept,
  onReject,
  onDelete,
}: {
  row: IntroductionRequestWithDetails
  onAccept: () => void
  onReject: () => void
  onDelete: () => void
}) => {
  // Only show accept/reject for pending requests
  if (row.status === 'pending') {
    return (
      <div className="flex items-center gap-3">
        <Tooltip title="Accept">
          <div
            className="text-xl cursor-pointer select-none font-semibold text-green-600 hover:text-green-700"
            role="button"
            onClick={onAccept}
          >
            <TbCheck />
          </div>
        </Tooltip>
        <Tooltip title="Reject">
          <div
            className="text-xl cursor-pointer select-none font-semibold text-red-600 hover:text-red-700"
            role="button"
            onClick={onReject}
          >
            <TbX />
          </div>
        </Tooltip>
        <Tooltip title="Delete">
          <div
            className="text-xl cursor-pointer select-none font-semibold text-gray-600 hover:text-gray-700"
            role="button"
            onClick={onDelete}
          >
            <TbTrash />
          </div>
        </Tooltip>
      </div>
    )
  }

  // For processed requests, only show delete
  return (
    <div className="flex items-center gap-3">
      <Tooltip title="Delete">
        <div
          className="text-xl cursor-pointer select-none font-semibold text-gray-600 hover:text-gray-700"
          role="button"
          onClick={onDelete}
        >
          <TbTrash />
        </div>
      </Tooltip>
    </div>
  )
}

const RequestsTable = ({
  onSelectAcceptRequest,
  onSelectRejectRequest,
}: RequestsTableProps) => {
  const [deletingRequest, setDeletingRequest] =
    useState<IntroductionRequestWithDetails | null>(null)

  const {
    requests,
    isLoading,
    setSelectAllRequests,
    setSelectedRequest,
    selectedRequests,
    deleteRequest,
  } = useRequests()

  const columns: ColumnDef<IntroductionRequestWithDetails>[] = useMemo(
    () => [
      {
        header: 'Requester',
        accessorKey: 'requesterName',
        cell: (props: {
          row: { original: IntroductionRequestWithDetails }
        }) => {
          const row = props.row.original
          return <RequesterColumn row={row} />
        },
      },
      {
        header: 'Contact',
        accessorKey: 'targetContactName',
        cell: (props: {
          row: { original: IntroductionRequestWithDetails }
        }) => {
          const row = props.row.original
          return <ContactColumn row={row} />
        },
      },
      {
        header: 'Status',
        accessorKey: 'status',
        cell: (props: {
          row: { original: IntroductionRequestWithDetails }
        }) => <StatusColumn status={props.row.original.status} />,
      },
      {
        header: 'Requested',
        accessorKey: 'createdAt',
        cell: (props: {
          row: { original: IntroductionRequestWithDetails }
        }) => <DateFormat date={props.row.original.createdAt} format="short" />,
      },
      {
        header: '',
        id: 'action',
        cell: (props: {
          row: { original: IntroductionRequestWithDetails }
        }) => (
          <ActionColumn
            row={props.row.original}
            onAccept={() => onSelectAcceptRequest(props.row.original)}
            onReject={() => onSelectRejectRequest(props.row.original)}
            onDelete={() => setDeletingRequest(props.row.original)}
          />
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const handleSort = (sort: OnSortParam) => {
    console.log('Sort:', sort)
  }

  const handleRowSelect = (
    checked: boolean,
    row: IntroductionRequestWithDetails,
  ) => {
    setSelectedRequest(checked, row)
  }

  const handleAllRowSelect = (
    checked: boolean,
    rows: Row<IntroductionRequestWithDetails>[],
  ) => {
    if (checked) {
      const originalRows = rows.map((row) => row.original)
      setSelectAllRequests(originalRows)
    } else {
      setSelectAllRequests([])
    }
  }

  const handleDeletingDialogClose = () => {
    setDeletingRequest(null)
  }

  const handleDeleteRequestConfirm = async () => {
    if (deletingRequest) {
      await deleteRequest(deletingRequest.id)
      setDeletingRequest(null)
    }
  }

  return (
    <>
      <DataTable
        selectable
        columns={columns}
        data={requests}
        noData={!isLoading && requests.length === 0}
        skeletonAvatarColumns={[0]}
        skeletonAvatarProps={{ width: 28, height: 28 }}
        loading={isLoading}
        checkboxChecked={(row) =>
          selectedRequests.some((selected) => selected.id === row.id)
        }
        onSort={handleSort}
        onCheckBoxChange={handleRowSelect}
        onIndeterminateCheckBoxChange={handleAllRowSelect}
      />
      <Dialog
        isOpen={!!deletingRequest}
        onClose={handleDeletingDialogClose}
        onRequestClose={handleDeletingDialogClose}
      >
        <h5 className="mb-4">Delete Request?</h5>
        <p>
          Are you sure you want to delete the request from{' '}
          <strong>{deletingRequest?.requesterName}</strong> to connect with{' '}
          <strong>{deletingRequest?.targetContactName}</strong>?
        </p>
        <div className="text-right mt-6">
          <Button
            className="ltr:mr-2 rtl:ml-2"
            variant="plain"
            onClick={handleDeletingDialogClose}
          >
            Cancel
          </Button>
          <Button variant="solid" onClick={handleDeleteRequestConfirm}>
            Delete
          </Button>
        </div>
      </Dialog>
    </>
  )
}

export default RequestsTable

// Made with Bob
