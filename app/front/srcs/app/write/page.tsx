'use client'

import dynamic from "next/dynamic"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Graph from "./components/graph"
import { ToastWraper } from "../components/main"
const Note = dynamic(() => import('./components/note'), {
	ssr: false,
})

export interface Wiki {
	id: number;
	title: string;
}

export interface Relation {
	source: number;
	target: number;
}

export default function Write() {
	const [title, setTitle] = useState('');
	const [currentWiki, setCurrentWiki] = useState<Wiki>();
	const [currentWidth, setCurrentWidth] = useState<number>(0);
	const [wikies, setWikies] = useState<Wiki[]>([]);
	const [relations, setRelations] = useState<Relation[]>([]);

	
	async function createNewWiki() {
		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}:${process.env.NEXT_PUBLIC_API_PORT}/wiki/create`, {
				method: "post",
				credentials: "include",
			}).then(res => res.json());

			if (res.success) {
				setCurrentWiki(res.data.created);
				setWikies(res.data.wikies);
				setRelations(res.data.relations);
			} else {
				ToastWraper("error", res.message);
			}

		} catch (err) {
			ToastWraper("error", "서버가 아파요 :(");
		}
	}

	useEffect(() => {
		const content = localStorage.getItem('title');
		if (content) setTitle(content);
		

		// async function initWiki() {
		// 	try {
		// 		const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}:${process.env.NEXT_PUBLIC_API_PORT}/wiki/find/all`)
		// 			.then(res => res.json());
				
		// 			if (res.success) {
		// 				setWikies(res.data);
		// 			}
	
		// 	} catch (err) {
		// 		ToastWraper("error", "서버가 아파요 :(");
		// 	}
		// }

		async function init() {
			await createNewWiki();
			// await initWiki();
		}

		setCurrentWidth(window.innerWidth);
		window.addEventListener("resize", () => {
			setCurrentWidth(window.innerWidth);
		})
		init();
	}, []);

	const router = useRouter();

	return (
		<div className="relative w-screen min-w-[350px] h-screen flex tablet:grid tablet:grid-cols-2">
			<div className="relative flex flex-col w-full h-full pb-20 phone:pt-8 phone:px-12">
				<input value={title} onChange={e => {
						setTitle(e.target.value);
						localStorage.setItem('title', e.target.value);
					}} className="w-full font-noto font-semibold p-4 text-[230%] focus:outline-none" type="text" placeholder="제목을 입력하세요"/>
				<div className="w-full p-4">
					<div className="mb-4 bg-black bg-opacity-70 w-16 h-[6px]"></div>
				</div>

				{/* 글 작성 부분 */}
				<Note title={title}/>

				<div className="absolute bottom-0 left-0 z-10 flex justify-between w-full px-4 py-4 text-lg shadow-2xl h-fit shadow-black font-noto">
					<button onClick={() => router.back()} className="px-4 py-2 rounded-md whitespace-nowrap hover:bg-gray-100">
						⬅ 나가기
					</button>
					<div className="flex gap-x-4">
						<button className="px-4 py-2 text-red-400 rounded-md whitespace-nowrap hover:bg-gray-100">
							임시저장
						</button>
						<button className="px-4 py-2 text-white bg-red-300 rounded-md whitespace-nowrap hover:bg-opacity-80" onClick={() => createNewWiki()}>
							출간하기
						</button>
					</div>
				</div>
			</div>

			{
				currentWidth > 1023 ?
				<div className="relative w-full tablet:block">
					<Graph wikies={wikies} relations={relations} currentWiki={currentWiki} />
				</div> : null
			}
		</div>
	)
}