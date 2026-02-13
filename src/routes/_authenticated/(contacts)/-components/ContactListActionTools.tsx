import { TbUserPlus } from 'react-icons/tb'
import { Button } from '@/components/ui'

type CustomerListActionToolsProps = {
  onAddClick: () => void
}

const CustomerListActionTools = ({
  onAddClick,
}: CustomerListActionToolsProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-3">
      <Button
        variant="solid"
        icon={<TbUserPlus className="text-xl" />}
        onClick={onAddClick}
      >
        Add/Import Contacts
      </Button>
    </div>
  )
}

export default CustomerListActionTools
