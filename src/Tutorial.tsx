import React from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'

export default function Tutorial() {
    const [markdown, setMarkdown] = React.useState('')

    React.useEffect(() => {
        fetch('/tutorial.md')
            .then(res => res.text())
            .then(setMarkdown)
    }, [])

    return (
        <ReactMarkdown children={markdown} rehypePlugins={[rehypeRaw]}/>
    )
}