'use client'

import React, { KeyboardEvent, useCallback, useState } from 'react'
import { createEditor, Editor, Element, Node, Text, Transforms } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import { BaseEditor, Descendant } from 'slate'
import { ReactEditor } from 'slate-react'

type CustomElement = {
	type: 'paragraph';
	children: CustomText[]
}

type CustomText = { text: string, bold?: boolean, highlight?: boolean }

declare module 'slate' {
	interface CustomTypes {
		Editor: BaseEditor & ReactEditor
		Element: CustomElement
		Text: CustomText
	}
}


export default function Note() {

	const initialValue: Descendant[] = [
		{
			type: 'paragraph',
			children: [{ text: '' }],
		},
	];

	const [editor] = useState(() => withReact(createEditor()));

	const renderElement = useCallback((props: any) => {
		switch (props.element.type) {
			case 'code':
				return <CodeElement {...props} />
			default:
				return <DefaultElement {...props} />
		}
	}, []);


	const renderLeaf = useCallback((props: any) => {
		return <Leaf {...props} />
	}, []);


	return (
		<div className='relative w-full h-full overflow-y-auto mb-8 p-4 text-lg'>
			<Slate editor={editor} value={initialValue}>
				<Editable
					placeholder='당신만의 위키를 만들어보세요...'
					renderElement={renderElement}
					renderLeaf={renderLeaf}
					onKeyDown={(e: KeyboardEvent) => {
						if (!e.ctrlKey) return;

						switch (e.key) {
							case '`': {
								e.preventDefault();

								const [match] = Editor.nodes(editor, {
									match: (n: Node) => n.highlight
								});

								Transforms.setNodes(
									editor,
									{ highlight: !match },
									{ match: (n: Node) => Text.isText(n), split: true }
								)
								break;
							}
							case 'b': {
								const [match] = Editor.nodes(editor, {
									match: (n: Node) => n.bold
								});

								console.log('bold');
								e.preventDefault();
								Transforms.setNodes(
									editor,
									{ bold: !match },
									{ match: (n: Node) => Text.isText(n), split: true }
								)
								break;
							}
						}
					}}
				/>
			</Slate>
		</div>
	);
}


const CodeElement = (props: any) => {
	return (
		<pre {...props.attributes}>
			<code>{props.children}</code>
		</pre>
	)
}

const DefaultElement = (props: any) => {
	return (
		<p {...props.attributes}>{props.children}</p>
	)
}

const Leaf = (props: any) => {
	return (
		<span
			{...props.attributes}
			className={`
				${props.leaf.bold ? 'font-bold' : 'font-normal'}
			`}
		>
			{props.children}
		</span>
	)
}