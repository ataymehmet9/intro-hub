import { TbEye, TbPencil, TbTrash } from 'react-icons/tb'
import cloneDeep from 'lodash/cloneDeep'
import { Avatar, Tooltip, Dialog, Button } from '@/components/ui'
import { Contact } from '@/schemas'
import { stringToColor } from '@/utils/colours'
import type { OnSortParam, ColumnDef, Row } from '@/components/shared/DataTable'
import DataTable from '@/components/shared/DataTable'
import { useMemo, useState } from 'react'
import { TableQueries } from '@/@types/common'
import { DateFormat } from '@/components/shared/common'
import { useContact } from '../-hooks/useContact'

type ContactListTableProps = {
  onSelectEditContact: (contact: Contact) => void
  onSelectViewContact: (contact: Contact) => void
}

const NameColumn = ({ row }: { row: Contact }) => {
  const avatarColor = stringToColor(row.name)

  return (
    <div className="flex items-center">
      <Avatar
        size={40}
        shape="circle"
        style={{ backgroundColor: avatarColor }}
        className="text-white font-semibold"
      >
        {row.name?.charAt(0) || 'U'}
      </Avatar>
      {row.name}
    </div>
  )
}

const ActionColumn = ({
  onEdit,
  onViewDetail,
  onDelete,
}: {
  onEdit: () => void
  onViewDetail: () => void
  onDelete: () => void
}) => {
  return (
    <div className="flex items-center gap-3">
      <Tooltip title="Edit">
        <div
          className={`text-xl cursor-pointer select-none font-semibold`}
          role="button"
          onClick={onEdit}
        >
          <TbPencil />
        </div>
      </Tooltip>
      <Tooltip title="View">
        <div
          className={`text-xl cursor-pointer select-none font-semibold`}
          role="button"
          onClick={onViewDetail}
        >
          <TbEye />
        </div>
      </Tooltip>
      <Tooltip title="Delete">
        <div
          className={`text-xl cursor-pointer select-none font-semibold`}
          role="button"
          onClick={onDelete}
        >
          <TbTrash />
        </div>
      </Tooltip>
    </div>
  )
}

const ContactListTable = ({
  onSelectEditContact,
  onSelectViewContact,
}: ContactListTableProps) => {
  const [deletingContact, setDeletingContact] = useState<Contact | null>(null)
  const {
    contacts,
    contactsTotal,
    tableData,
    isLoading,
    setTableData,
    setSelectAllContact,
    setSelectedContact,
    selectedContact,
    deleteContact,
  } = useContact({ enabled: false })

  const columns: ColumnDef<Contact>[] = useMemo(
    () => [
      {
        header: 'Name',
        accessorKey: 'name',
        cell: (props: { row: { original: Contact } }) => {
          const row = props.row.original
          return <NameColumn row={row} />
        },
      },
      {
        header: 'Email',
        accessorKey: 'email',
      },
      {
        header: 'Company',
        accessorKey: 'company',
      },
      {
        header: 'Position',
        accessorKey: 'position',
      },
      {
        header: 'Added',
        accessorKey: 'createdAt',
        cell: (props: { row: { original: Contact } }) => (
          <DateFormat date={props.row.original.createdAt} format="short" />
        ),
      },
      {
        header: '',
        id: 'action',
        cell: (props: { row: { original: Contact } }) => (
          <ActionColumn
            onEdit={() => onSelectEditContact(props.row.original)}
            onViewDetail={() => onSelectViewContact(props.row.original)}
            onDelete={() => setDeletingContact(props.row.original)}
          />
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const handleSetTableData = (data: TableQueries) => {
    setTableData(data)
    if (selectedContact.length > 0) {
      setSelectAllContact([])
    }
  }

  const handlePaginationChange = (page: number) => {
    const newTableData = cloneDeep(tableData)
    newTableData.pageIndex = page
    handleSetTableData(newTableData)
  }

  const handleSelectChange = (value: number) => {
    const newTableData = cloneDeep(tableData)
    newTableData.pageSize = Number(value)
    newTableData.pageIndex = 1
    handleSetTableData(newTableData)
  }

  const handleSort = (sort: OnSortParam) => {
    const newTableData = cloneDeep(tableData)
    newTableData.sort = sort
    handleSetTableData(newTableData)
  }

  const handleRowSelect = (checked: boolean, row: Contact) => {
    setSelectedContact(checked, row)
  }

  const handleAllRowSelect = (checked: boolean, rows: Row<Contact>[]) => {
    if (checked) {
      const originalRows = rows.map((row) => row.original)
      setSelectAllContact(originalRows)
    } else {
      setSelectAllContact([])
    }
  }

  const handleDeletingDialogClose = () => {
    setDeletingContact(null)
  }

  const handleDeleteContactConfirm = async () => {
    await deleteContact(deletingContact!.id)
    setDeletingContact(null)
  }

  return (
    <>
      <DataTable
        selectable
        columns={columns}
        data={contacts}
        noData={!isLoading && contacts.length === 0}
        skeletonAvatarColumns={[0]}
        skeletonAvatarProps={{ width: 28, height: 28 }}
        loading={isLoading}
        pagingData={{
          total: contactsTotal,
          pageIndex: tableData.pageIndex as number,
          pageSize: tableData.pageSize as number,
        }}
        checkboxChecked={(row) =>
          selectedContact.some((selected) => selected.id === row.id)
        }
        onPaginationChange={handlePaginationChange}
        onSelectChange={handleSelectChange}
        onSort={handleSort}
        onCheckBoxChange={handleRowSelect}
        onIndeterminateCheckBoxChange={handleAllRowSelect}
      />
      <Dialog
        isOpen={!!deletingContact}
        onClose={handleDeletingDialogClose}
        onRequestClose={handleDeletingDialogClose}
      >
        <h5 className="mb-4">Delete Contact?</h5>
        <p>
          Are you sure you want to delete the contact{' '}
          <strong>{deletingContact?.name}</strong>
        </p>
        <div className="text-right mt-6">
          <Button
            className="ltr:mr-2 rtl:ml-2"
            variant="plain"
            onClick={handleDeletingDialogClose}
          >
            Cancel
          </Button>
          <Button variant="solid" onClick={handleDeleteContactConfirm}>
            Delete
          </Button>
        </div>
      </Dialog>
    </>
  )
}

export default ContactListTable
