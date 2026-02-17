import DebounceInput from '@/components/shared/DebouceInput'
import { TbSearch } from 'react-icons/tb'
import { Ref } from 'react'

type ContactListSearchProps = {
  onInputChange: (value: string) => void
  defaultValue?: string
  ref?: Ref<HTMLInputElement>
}

const ContactListSearch = (props: ContactListSearchProps) => {
  const { onInputChange, defaultValue, ref } = props

  return (
    <DebounceInput
      ref={ref}
      placeholder="Quick search..."
      suffix={<TbSearch className="text-lg" />}
      defaultValue={defaultValue}
      onChange={(e: { target: { value: string } }) =>
        onInputChange(e.target.value)
      }
    />
  )
}

export default ContactListSearch
