'use client'

import Quill from 'quill';
// @ts-ignore
import QuillMarkdown from 'quilljs-markdown'
import React, { useEffect } from 'react';
import "react-quill/dist/quill.bubble.css";
import "react-quill/dist/quill.snow.css";

export default function Note2() {


	useEffect(() => {
		const editor = new Quill('#editor', {
			modules: {
				toolbar: false,    // Snow includes toolbar by default
			},
			theme: "snow"
		});
		new QuillMarkdown(editor);
	
	}, []);

	return (
		<div id="editor" className='overflow-auto text-lg font-noto-sans-kr'></div>
	);
}