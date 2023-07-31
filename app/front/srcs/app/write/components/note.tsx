// @ts-nocheck
"use client"

import QuillMarkdown from "quilljs-markdown";
import { MutableRefObject, useEffect, useRef } from "react"
import 'react-quill/dist/quill.snow.css';
import "quill-mention";
import { Wiki } from "../page";
import { ToastWraper } from "@/app/components/main";
import Quill from "quill";
import "quill-mention/dist/quill.mention.css"

export default function Note({
  currentWiki,
  setCurrentWiki,
  _saveWiki,
  _connectWiki,
  _disconnectWiki,
  _wikies,
}: {
  currentWiki: Wiki,
  setCurrentWiki: Dispatch<SetStateAction<Wiki | null>>,
  _saveWiki: MutableRefObject<((id: number, body: { value?: string, content?: string }) => Promise<void>) | undefined>,
	_connectWiki: MutableRefObject<((source: number, target: number) => Promise<void>) | undefined>,
	_disconnectWiki: MutableRefObject<((source: number, target: number) => Promise<void>) | undefined>,
  _wikies: MutableRefObject<Wiki[]>
}) {
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
    // window.addEventListener('mention-clicked', (event) => setCurrentWiki({ id: event.value.id, value: event.value.value }), false);
  }, []);

  useEffect(() => {
    editor.current = new Quill("#editor", {
      theme: "snow",
      modules: {
        toolbar: [
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
          ['blockquote', 'code-block'],
          ['bold', 'italic', 'underline', 'strike', 'link', 'image'],
          [{ 'color': [] }, { 'background': [] }],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          [{ 'align': [] }],
        ],
        mention: {
          allowedChars: /^[A-Za-z0-9_ㄱ-ㅎ가-힣 ]*$/,
          mentionDenotationChars: ["@"],
          source: function (searchTerm, renderList, mentionChar) {
            let values;

            if (mentionChar === "@") {
              values = _wikies.current?.filter(wiki => wiki.id !== currentWiki.id);
            } else {
              return;
            }

            if (searchTerm.length === 0) {
              renderList(values, searchTerm);
            } else {
              const matches = [];
              for (let i = 0; i < values.length; i++)
                if (
                  ~values[i].value.toLowerCase().indexOf(searchTerm.toLowerCase())
                )
                  matches.push(values[i]);
              renderList(matches, searchTerm);
            }
          }
        }
      },
    });

    editor.current?.on("text-change", () => {
      const value = editor.current?.root.innerHTML;

      if (timerId.current?.get(currentWiki.id)) {
        clearTimeout(timerId.current?.get(currentWiki.id));
      }

      const id = setTimeout(() => {
        _saveWiki.current?.(currentWiki.id, { content: value });
      }, 2500);

      timerId.current?.set(currentWiki.id, id);
    });


    const targetNode = document.querySelector(".ql-editor");
    const config = { attribues: false, childList: true, subtree: true };

    const callback = (mutationList) => {
      for (const elem of mutationList) {
        if (elem.addedNodes.length) {
          if (elem.addedNodes[0] instanceof HTMLSpanElement) {
            _connectWiki.current?.(currentWiki.id, parseInt(elem.addedNodes[0].getAttribute("data-id")));
          }
          continue;
        } 

        if (elem.removedNodes.length) {
          if (elem.removedNodes[0] instanceof HTMLSpanElement) {
            _disconnectWiki.current?.(currentWiki.id, parseInt(elem.removedNodes[0].getAttribute("data-id")));
          }
          continue;
        }
      }
    };

    // 콜백 함수에 연결된 감지기 인스턴스 생성
    const observer = new MutationObserver(callback);

    // 설정한 변경의 감지 시작
    observer.observe(targetNode, config);

    const markdown = new QuillMarkdown(editor.current);
    loadContent();
    return (() => {
      document.querySelector(".ql-toolbar")?.remove();
      markdown.destroy();
      observer.disconnect();
    });
  }, [currentWiki])


  return (
    <div id="editor" className="relative w-full overflow-y-auto h-fit"></div>
  )
}