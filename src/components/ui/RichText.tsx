'use client'

interface TextNode {
  type: 'text'
  value: string
  bold?: boolean
  italic?: boolean
}

interface ParagraphNode {
  type: 'paragraph'
  children: TextNode[]
}

interface RootNode {
  type: 'root'
  children: ParagraphNode[]
}

export default function RichText({ content }: { content: string | RootNode }) {
  if (typeof content === 'string') {
    return <p className="font-body text-sm text-brand-muted leading-relaxed">{content}</p>
  }

  const data: RootNode = typeof content === 'string' ? JSON.parse(content) : content

  if (data.type !== 'root' || !data.children) {
    return <p className="font-body text-sm text-brand-muted leading-relaxed">{String(content)}</p>
  }

  return (
    <div className="space-y-3">
      {data.children.map((node, idx) => {
        if (node.type === 'paragraph') {
          return (
            <p key={idx} className="font-body text-sm text-brand-muted leading-relaxed">
              {node.children.map((textNode, tIdx) => {
                if (textNode.type === 'text') {
                  return (
                    <span
                      key={tIdx}
                      className={textNode.bold ? 'font-semibold text-brand-dark' : ''}
                      style={textNode.italic ? { fontStyle: 'italic' } : {}}
                    >
                      {textNode.value}
                    </span>
                  )
                }
                return null
              })}
            </p>
          )
        }
        return null
      })}
    </div>
  )
}
