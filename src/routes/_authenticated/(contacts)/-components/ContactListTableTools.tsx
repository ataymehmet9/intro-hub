import { useNavigate, useSearch } from '@tanstack/react-router'
import ContactListSearch from './ContactListSearch'

const ContactListTableTools = () => {
  const navigate = useNavigate()
  const searchParams = useSearch({
    from: '/_authenticated/(contacts)/contacts',
  })

  const handleInputChange = (val: string) => {
    // Update URL query params on every keystroke
    navigate({
      to: '/contacts',
      search: val ? { q: val, page: 1 } : { page: 1 },
      replace: true, // Use replace to avoid cluttering browser history
    })
  }

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
      <ContactListSearch
        onInputChange={handleInputChange}
        defaultValue={searchParams.q}
      />
    </div>
  )
}

export default ContactListTableTools

// Made with Bob
