"use client"

import { MutableRefObject, useEffect, useRef, useState } from "react"
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { Wiki } from "../page";
import { ToastWraper } from "@/app/components/main";
import Quill from "quill";
// @ts-ignore
import QuillMarkdown from "quilljs-markdown";

export default function Note({
  currentWiki,
  _saveWiki,
}: {
  currentWiki: Wiki,
  _saveWiki: MutableRefObject<((id: number, body : {title?: string, content?: string}) => Promise<void>) | undefined>
}) {

  const [value, setValue] = useState<string>("")
  const timerId = useRef<Map<number, NodeJS.Timeout>>(new Map());

  async function loadContent() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}:${process.env.NEXT_PUBLIC_API_PORT}/wiki/find/content/${currentWiki.id}`, {
        credentials: "include"
      }).then(res => res.json());

      if (!res.success) {
        ToastWraper("error", res.message, "/");
        return;
      }

      editor.current?.setContents(editor.current?.clipboard.convert(res.data), "silent")

    } catch (err) {
      ToastWraper("error", "서버가 아파요 :(");
    }
  }

  const editor = useRef<Quill>();

  useEffect(() => {
    editor.current = new Quill("#editor", {
      theme: "snow",
      modules: {
        toolbar: [
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
          ['blockquote', 'code-block'],
          ['bold', 'italic', 'underline', 'strike', 'link', 'image'], 
          [{ 'color': [] }, { 'background': [] }],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          [{ 'align': [] }],
        ]
      },
    });

    const markdown = new QuillMarkdown(editor.current);
    return (() => {
      document.querySelector(".ql-toolbar")?.remove();
      markdown.destroy();
    });
  }, []);

  useEffect(() => {
    loadContent();
  }, [currentWiki])


  return (
    <div id="editor" className="relative w-full overflow-y-auto h-fit"></div>
    // <ReactQuill theme="snow" value={value} onChange={(value: string) => {
    //   setValue(value);

    //   if (timerId.current?.get(currentWiki.id)) {
    //     clearTimeout(timerId.current?.get(currentWiki.id));
    //   }

    //   const id = setTimeout(() => {
    //     _saveWiki.current?.(currentWiki.id, { content: value });
    //   }, 2500);

    //   timerId.current?.set(currentWiki.id, id);
    // }}/>
  )
}