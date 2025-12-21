import { useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import './ContentPanel.css'

interface PortfolioItem {
  id: string
  title: string
  description: string
  content: string
  tags?: string[]
}

interface ContentPanelProps {
  item: PortfolioItem
  onClose: () => void
}

export default function ContentPanel({ item, onClose }: ContentPanelProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  return (
    <div className="content-panel-overlay" onClick={onClose}>
      <div className="content-panel" onClick={(e) => e.stopPropagation()}>
        <button className="content-panel-close" onClick={onClose}>
          ×
        </button>
        <div className="content-panel-header">
          <h2>{item.title}</h2>
          {item.description && (
            <p className="content-panel-description">{item.description}</p>
          )}
        </div>
        <div className="content-panel-body">
          <ReactMarkdown>{item.content}</ReactMarkdown>
        </div>
        {item.tags && item.tags.length > 0 && (
          <div className="content-panel-tags">
            {item.tags.map((tag) => (
              <span key={tag} className="content-panel-tag">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

