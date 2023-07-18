'use client'

import { Editable, ReactEditor, Slate, withReact } from "slate-react";
import React, { useCallback, useMemo } from "react";
import {
  createEditor,
  Editor,
  Element as SlateElement,
  Node as SlateNode,
  Point,
  Range,
  Transforms,
} from "slate";

import { withHistory } from "slate-history";
import { BulletedListElement, OrderedListElement } from "./custom-type";

const SHORTCUTS = {
  '-': 'list-item',
  '1.': 'list-item',
  '#': 'heading-one',
  '##': 'heading-two',
}




const withShortcuts = (editor: Editor) => {
  const { deleteBackward, insertText } = editor

  editor.insertText = text => {
    const { selection } = editor;

    if (text.endsWith(' ') && selection && Range.isCollapsed(selection)) {
      const { anchor } = selection
      const block = Editor.above(editor, {
        match: n => SlateElement.isElement(n) && Editor.isBlock(editor, n),
      })
      const path = block ? block[1] : []
      const start = Editor.start(editor, path)
      const range = { anchor, focus: start }
      const beforeText = Editor.string(editor, range) + text.slice(0, -1)
      // @ts-ignore
      const type = SHORTCUTS[beforeText]

      if (type) {
        Transforms.select(editor, range)

        if (!Range.isCollapsed(range)) {
          Transforms.delete(editor)
        }

        const newProperties: Partial<SlateElement> = {
          type,
        }
        Transforms.setNodes<SlateElement>(editor, newProperties, {
          match: n => SlateElement.isElement(n) && Editor.isBlock(editor, n),
        })

        if (type === 'list-item') {
          const list: BulletedListElement | OrderedListElement = beforeText === '-' ? {
            type: 'bulleted-list',
            children: [],
          } : {
            type: 'ordered-list',
            children: [],
          };

          Transforms.wrapNodes(editor, list, {
            match: n =>
              !Editor.isEditor(n) &&
              SlateElement.isElement(n) &&
              n.type === 'list-item'
          })
        }
        return
      }
    }

    insertText(text)
  }

  editor.deleteBackward = (...args) => {
    const { selection } = editor

    if (selection && Range.isCollapsed(selection)) {
      const match = Editor.above(editor, {
        match: n => SlateElement.isElement(n) && Editor.isBlock(editor, n),
      })

      if (match) {
        const [block, path] = match
        const start = Editor.start(editor, path)

        if (
          !Editor.isEditor(block) &&
          SlateElement.isElement(block) &&
          block.type !== 'paragraph' &&
          Point.equals(selection.anchor, start)
        ) {
          const newProperties: Partial<SlateElement> = {
            type: 'paragraph',
          }
          Transforms.setNodes(editor, newProperties)

          if (block.type === 'list-item') {
            Transforms.unwrapNodes(editor, {
              match: n =>
                !Editor.isEditor(n) &&
                SlateElement.isElement(n) &&
                (n.type === 'bulleted-list' || n.type === 'ordered-list'),
              split: true,
            })
          }

          return
        }
      }

      deleteBackward(...args)
    }
  }

  return editor
}

const Element = ({ attributes, children, element }: {
  attributes: any,
  children: any,
  element: any,
}) => {
  switch (element.type) {
    case 'block-quote':
      return <blockquote {...attributes}>{children}</blockquote>
    case 'bulleted-list':
      return <ul className="list-disc list-inside" {...attributes}>{children}</ul>
    case 'ordered-list':
      return <ul className="list-decimal list-inside" {...attributes}>{children}</ul>
    case 'heading-one':
      return <h1 className="text-3xl font-bold" {...attributes}>{children}</h1>
    case 'heading-two':
      return <h2 className="text-2xl font-bold" {...attributes}>{children}</h2>
    case 'list-item':
      return <li {...attributes}>{children}</li>
    default:
      return <p {...attributes}>{children}</p>
  }
}


export default function Note({ title }: {
  title: string,
}) {

  const renderElement = useCallback((props: any) => <Element {...props} />, [])
  const editor = useMemo(
    () => withShortcuts(withReact(withHistory(createEditor()))),
    []
  )
  const handleDOMBeforeInput = useCallback(
    (e: InputEvent) => {
      queueMicrotask(() => {
        const pendingDiffs = ReactEditor.androidPendingDiffs(editor)

        const scheduleFlush = pendingDiffs?.some(({ diff, path }) => {
          if (!diff.text.endsWith(' ')) {
            return false
          }

          const { text } = SlateNode.leaf(editor, path)
          const beforeText = text.slice(0, diff.start) + diff.text.slice(0, -1)
          if (!(beforeText in SHORTCUTS)) {
            return
          }

          const blockEntry = Editor.above(editor, {
            at: path,
            match: n => SlateElement.isElement(n) && Editor.isBlock(editor, n),
          })
          if (!blockEntry) {
            return false
          }

          const [, blockPath] = blockEntry
          return Editor.isStart(editor, Editor.start(editor, path), blockPath)
        })

        if (scheduleFlush) {
          ReactEditor.androidScheduleFlush(editor)
        }
      })
    },
    [editor]
  )
  const initialValue = useMemo(
    () => {
        const content = localStorage.getItem('content');
        return content ? JSON.parse(content) : [
          {
            type: 'paragraph',
            children: [{ text: '' }],
          },
        ]
    }, []
  )
  

  return (
    <div id="content" className="relative w-full overflow-y-auto">
      <Slate editor={editor} value={initialValue} onChange={
        value => {
          const isAstChange = editor.operations.some(
            op => 'set_selection' !== op.type
          )
          if (isAstChange) {
            // Save the value to Local Storage.
            const content = JSON.stringify(value)
            localStorage.setItem('content', content)
          }
        }
      }>
        <Editable
          onDOMBeforeInput={handleDOMBeforeInput}
          renderElement={renderElement}
          spellCheck
          placeholder={`내 인생에서 ${title}(이)란...`}
          className="text-lg m-4"
        />
      </Slate>
    </div>
  )
}