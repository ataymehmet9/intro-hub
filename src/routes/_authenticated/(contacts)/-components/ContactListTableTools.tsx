import cloneDeep from 'lodash/cloneDeep'
import ContactListSearch from './ContactListSearch'
import { useContact } from '../-hooks/useContact'

const ContactListTableTools = () => {
  // Disable query in this component - only need store access
  const { tableData, setTableData } = useContact({ enabled: false })

  const handleInputChange = (val: string) => {
    const newTableData = cloneDeep(tableData)
    newTableData.query = val
    newTableData.pageIndex = 1
    if (typeof val === 'string' && val.length > 1) {
      setTableData(newTableData)
    }

    if (typeof val === 'string' && val.length === 0) {
      setTableData(newTableData)
    }
  }

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
      <ContactListSearch onInputChange={handleInputChange} />
    </div>
  )
}

export default ContactListTableTools
