import { useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useHelpContent } from './-hooks/useHelpContent'
import { ArticleContent } from './-types/Content'
import ArticleBody from './-components/ArticleBody'

const termsConditionsContent: ArticleContent = {
  id: 'terms-and-conditions',
  title: 'Terms and Conditions',
  tableOfContents: [
    {
      id: 'introduction',
      label: 'Introduction',
    },
    {
      id: 'license-to-use-website',
      label: 'License to use website',
    },
  ],
  sections: [
    {
      id: 'introduction',
      title: 'Introduction',
      content:
        "<p>Welcome to our website. If you continue to browse and use this website, you are agreeing to comply with and be bound by the following terms and conditions of use, which together with our privacy policy govern [business name]'s relationship with you in relation to this website. If you disagree with any part of these terms and conditions, please do not use our website.</p>",
    },
    {
      id: 'license-to-use-website',
      title: 'License to use website',
      content:
        '<p>Unless otherwise stated, [business name] and/or its licensors own the intellectual property rights in the website and material on the website. Subject to the license below, all these intellectual property rights are reserved.</p>',
    },
  ],
}

export const Route = createFileRoute('/_help/terms-and-conditions')({
  component: RouteComponent,
})

function RouteComponent() {
  const { content, setContent } = useHelpContent()

  useEffect(() => {
    setContent(termsConditionsContent)
  }, [setContent])

  return <ArticleBody content={content} />
}
