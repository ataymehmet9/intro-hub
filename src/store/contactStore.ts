import { create } from 'zustand'
import { Contact } from '@/schemas'
import type { TableQueries } from '@/@types/common'

export const initialTableData: TableQueries = {
  pageIndex: 1,
  pageSize: 10,
  query: '',
  sort: {
    order: '',
    key: '',
  },
}

type ContactState = {
  tableData: TableQueries
  selectedContact: Partial<Contact>[]
}

type ContactAction = {
  setTableData: (payload: TableQueries) => void
  setSelectedContact: (checked: boolean, contact: Contact) => void
  setSelectAllContact: (contact: Contact[]) => void
}

const initialState: ContactState = {
  tableData: initialTableData,
  selectedContact: [],
}

export const useContactStore = create<ContactState & ContactAction>((set) => ({
  ...initialState,
  setTableData: (payload) => set(() => ({ tableData: payload })),
  setSelectedContact: (checked, row) =>
    set((state) => {
      const prevData = state.selectedContact
      if (checked) {
        return { selectedContact: [...prevData, ...[row]] }
      } else {
        if (prevData.some((prevContact) => row.id === prevContact.id)) {
          return {
            selectedContact: prevData.filter(
              (prevContact) => prevContact.id !== row.id,
            ),
          }
        }
        return { selectedContact: prevData }
      }
    }),

  setSelectAllContact: (row) => set(() => ({ selectedContact: row })),
}))
