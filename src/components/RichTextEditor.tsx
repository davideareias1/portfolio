'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Heading from '@tiptap/extension-heading'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import ListItem from '@tiptap/extension-list-item'
import Link from '@tiptap/extension-link'
import Blockquote from '@tiptap/extension-blockquote'
import CodeBlock from '@tiptap/extension-code-block'
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Heading1, 
  Heading2, 
  Heading3,
  Link as LinkIcon,
  Quote,
  Code
} from 'lucide-react'
import React from 'react'

interface RichTextEditorProps {
  content?: string
  onChange?: (content: string) => void
  editable?: boolean
}

const ToolbarButton = ({ 
  onClick, 
  isActive, 
  children, 
  ariaLabel 
}: { 
  onClick: () => void, 
  isActive: boolean, 
  children: React.ReactNode, 
  ariaLabel: string 
}) => (
    <button
        type="button"
        onClick={onClick}
        className={`p-2 rounded-md transition-colors duration-200 ${
            isActive
                ? 'bg-blue-500/20 text-blue-300'
                : 'hover:bg-white/10 text-gray-300'
        }`}
        aria-label={ariaLabel}
    >
        {children}
    </button>
)

export default function RichTextEditor({ 
  content = '', 
  onChange, 
  editable = true 
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
      }),
      Heading.configure({
        levels: [1, 2, 3],
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: 'list-disc list-inside space-y-1',
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: 'list-decimal list-inside space-y-1',
        },
      }),
      ListItem,
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          class: 'text-blue-400 hover:text-blue-300 underline cursor-pointer',
        },
      }),
      Blockquote.configure({
        HTMLAttributes: {
            class: 'border-l-4 border-gray-600 pl-4 italic',
        },
      }),
      CodeBlock.configure({
        HTMLAttributes: {
            class: 'bg-gray-800 text-white p-4 rounded-md text-sm font-mono',
        },
      }),
    ],
    content,
    editable,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-headings:text-gray-100 prose-p:text-gray-300 prose-a:text-blue-400 prose-strong:text-white prose-ul:text-gray-300 prose-ol:text-gray-300 prose-blockquote:text-gray-400 prose-code:text-pink-400 prose-code:bg-black/20 prose-code:p-1 prose-code:rounded-sm max-w-none min-h-[250px] p-4 focus:outline-none',
      },
    },
  })

  const addLink = React.useCallback(() => {
    const previousUrl = editor?.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    if (url === null) {
      return
    }

    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  if (!editor) return null

  return (
    <div className="bg-white/5 border border-gray-700/50 rounded-lg overflow-hidden shadow-md">
      {editable && (
        <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-700/50">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            ariaLabel="Toggle bold"
          >
            <Bold className="h-4 w-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            ariaLabel="Toggle italic"
          >
            <Italic className="h-4 w-4" />
          </ToolbarButton>

          <div className="w-px h-6 bg-gray-700/50 mx-1" />

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive('heading', { level: 1 })}
            ariaLabel="Toggle heading 1"
          >
            <Heading1 className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive('heading', { level: 2 })}
            ariaLabel="Toggle heading 2"
          >
            <Heading2 className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive('heading', { level: 3 })}
            ariaLabel="Toggle heading 3"
          >
            <Heading3 className="h-4 w-4" />
          </ToolbarButton>

          <div className="w-px h-6 bg-gray-700/50 mx-1" />

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            ariaLabel="Toggle bullet list"
          >
            <List className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            ariaLabel="Toggle ordered list"
          >
            <ListOrdered className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
            ariaLabel="Toggle blockquote"
          >
            <Quote className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            isActive={editor.isActive('codeBlock')}
            ariaLabel="Toggle code block"
          >
            <Code className="h-4 w-4" />
          </ToolbarButton>

          <div className="w-px h-6 bg-gray-700/50 mx-1" />

          <ToolbarButton
            onClick={addLink}
            isActive={editor.isActive('link')}
            ariaLabel="Add or edit link"
          >
            <LinkIcon className="h-4 w-4" />
          </ToolbarButton>
        </div>
      )}
      
      <EditorContent editor={editor} />
    </div>
  )
} 