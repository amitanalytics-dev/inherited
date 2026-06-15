'use client'

type TextNode = { type: 'text'; value: string; bold?: boolean; italic?: boolean }
type ListItemNode = { type: 'list-item'; children: TextNode[] }
type ListNode = { type: 'list'; listType: 'ordered' | 'unordered'; children: ListItemNode[] }
type ParagraphNode = { type: 'paragraph'; children: TextNode[] }
type HeadingNode = { type: 'heading'; level: number; children: TextNode[] }
type ChildNode = ParagraphNode | ListNode | HeadingNode

interface RootNode { type: 'root'; children: ChildNode[] }

function renderText(nodes: TextNode[]) {
  return nodes.map((t, i) => (
    <span
      key={i}
      className={[t.bold ? 'font-semibold text-brand-dark' : '', t.italic ? 'italic' : ''].filter(Boolean).join(' ') || undefined}
    >
      {t.value}
    </span>
  ))
}

export default function RichText({
  content,
  className = 'font-body text-base text-brand-muted leading-relaxed',
}: {
  content: string | RootNode
  className?: string
}) {
  let data: RootNode

  if (typeof content === 'string') {
    try {
      data = JSON.parse(content)
    } catch {
      return <p className={className}>{content}</p>
    }
  } else {
    data = content
  }

  if (data.type !== 'root' || !data.children) {
    return <p className={className}>{String(content)}</p>
  }

  return (
    <div className="space-y-3">
      {data.children.map((node, i) => {
        if (node.type === 'paragraph') {
          return (
            <p key={i} className={className}>
              {renderText(node.children as TextNode[])}
            </p>
          )
        }
        if (node.type === 'list') {
          const Tag = node.listType === 'ordered' ? 'ol' : 'ul'
          return (
            <Tag key={i} className={node.listType === 'ordered' ? 'list-decimal list-inside space-y-1.5' : 'list-none space-y-1.5'}>
              {(node.children as ListItemNode[]).map((item, j) => (
                <li key={j} className={className}>
                  {renderText(item.children as TextNode[])}
                </li>
              ))}
            </Tag>
          )
        }
        if (node.type === 'heading') {
          return (
            <p key={i} className="font-semibold text-brand-dark text-base">
              {renderText((node as HeadingNode).children)}
            </p>
          )
        }
        return null
      })}
    </div>
  )
}
