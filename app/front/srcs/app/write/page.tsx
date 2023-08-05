'use client'

import { useState, useRef, useEffect } from "react"
import { ToastContainer } from "react-toastify"
import { useRouter } from "next/navigation"
import Graph from "./components/graph"
import 'react-toastify/dist/ReactToastify.css';
import dynamic from "next/dynamic"
import { ToastWraper } from "../components/main"
const Note = dynamic(() => import('./components/note'), {
	ssr: false,
})

export interface Wiki {
	id: number;
	value: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface Relation {
	source: number;
	target: number;
}

export default function Write() {
	const [currentWiki, setCurrentWiki] = useState<Wiki | null>(null);
	const _createWiki = useRef<() => Promise<void>>();
	const _saveWiki = useRef<(id: number, body: { value?: string, content?: any }) => Promise<void>>();
	const _deleteWiki = useRef<(id: number) => Promise<void>>();
	const _connectWiki = useRef<(target: number, source: number) => Promise<void>>();
	const _disconnectWiki = useRef<(target: number, source: number) => Promise<void>>();
	const _wikies = useRef<Wiki[]>([]);
	const _connectQueue = useRef<Relation[]>([]);
	const _disconnectQueue = useRef<Relation[]>([]);
	const timerId = useRef<Map<number, NodeJS.Timeout>>(new Map<number, NodeJS.Timeout>());

	const router = useRouter();

	return (
		<>
			<div className="relative w-screen min-w-[350px] h-screen flex tablet:grid tablet:grid-cols-2">
				{
					currentWiki ?

						<div className="relative flex flex-col w-full h-screen pb-28 phone:pt-8 phone:px-12">
							<input value={currentWiki.value} onChange={e => {
								const value = e.target.value;
								setCurrentWiki({ ...currentWiki, value: value });

								if (timerId.current?.get(currentWiki.id)) {
									clearTimeout(timerId.current?.get(currentWiki.id));
								}

								const id = setTimeout(() => {
									if (value === "") {
										ToastWraper("warn", "제목을 써주세요.");
										return;
									}
									_saveWiki.current?.(currentWiki.id, { value: value });
								}, 1000);
								timerId.current?.set(currentWiki.id, id);

							}} className="w-full font-noto font-semibold p-4 text-[230%] focus:outline-none" type="text" placeholder={`제목을 써주세요.`} />
							<div className="w-full p-4">
								<div className="mb-4 bg-black bg-opacity-70 w-16 h-[6px]"></div>
								<p className="italic text-s opacity-40" ><span className="font-bold">Updated </span>{currentWiki.updatedAt ? `${new Date(currentWiki.updatedAt).getFullYear()}년 ${new Date(currentWiki.updatedAt).getMonth() + 1}월 ${new Date(currentWiki.updatedAt).getDate()}일 ${new Date(currentWiki.updatedAt).getHours()}시 ${new Date(currentWiki.updatedAt).getMinutes()}분` : ""}</p>
							</div>

							{/* <Note currentWiki={currentWiki} _saveWiki={_saveWiki} /> */}
							<Note currentWiki={currentWiki} setCurrentWiki={setCurrentWiki} _saveWiki={_saveWiki} _connectWiki={_connectWiki} _disconnectWiki={_disconnectWiki} _wikies={_wikies}/>
							

							
							<div className="absolute bottom-0 left-0 z-10 flex justify-between w-full px-4 py-4 text-lg shadow-2xl h-fit shadow-black font-noto">
								<button onClick={() => router.back()} className="px-4 py-2 rounded-md whitespace-nowrap hover:bg-gray-100">
									⬅ 나가기
								</button>
								<div className="flex gap-x-4">
									<button className="px-4 py-2 text-white bg-red-500 rounded-md whitespace-nowrap hover:bg-opacity-80" onClick={() => _deleteWiki.current?.(currentWiki.id)}>
										삭제하기
									</button>
								</div>
							</div>
							<button className="absolute top-5 right-5" onClick={() => setCurrentWiki(null)}>
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
									<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>
						:
						/**
						 * 어떤 글도 선택되지 않았을 때 새로운 위키 만들기
						 */
						<div id="makeNewWiki" className="relative flex items-center justify-center w-full h-full text-center cursor-pointer"
							onClick={() => _createWiki.current?.()}>
							<span className="relative">
								<span className="absolute w-3 h-3 rounded-full opacity-75 -top-2 -right-3 animate-ping bg-[orange]"></span>
								<span className="absolute w-3 h-3 rounded-full opacity-75 -top-2 -right-3 bg-[orange]"></span>
								<h3 className="text-2xl font-noto-sans-kr">새로운 위키 만들기 +</h3>
							</span>
						</div>
				}
				<div className="relative hidden w-full h-screen tablet:block">
					<Graph currentWiki={currentWiki} _connectQueue={_connectQueue} _disconnectQueue={_disconnectQueue}  _createWiki={_createWiki} _saveWiki={_saveWiki} _deleteWiki={_deleteWiki} _disconnectWiki={_disconnectWiki} setCurrentWiki={setCurrentWiki} _connectWiki={_connectWiki} _wikies={_wikies}/>
				</div>
			</div>
			<ToastContainer
				className="absolute"
				position="top-right"
				autoClose={3000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="colored"
			/>
		</>
	)
}