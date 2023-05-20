'use client'

import dynamic from "next/dynamic"
import { useState, useEffect } from "react"
const Note = dynamic(() => import('./components/note'), {
	ssr: false,
})

export default function Write() {
	const [title, setTitle] = useState('');
	useEffect(() => {
		const content = localStorage.getItem('title');
		if (content) setTitle(content);
	}, []);
	return (
		<div className="relative w-screen min-w-[350px] h-screen">
			<div className="relative w-full h-full phone:pt-8 phone:px-12 pb-20 flex flex-col">
				<input value={title} onChange={e => {
						setTitle(e.target.value);
						localStorage.setItem('title', e.target.value);
					}} className="w-full font-noto font-semibold p-4 text-[230%] focus:outline-none" type="text" placeholder="제목을 입력하세요"/>
				<div className="w-full p-4">
					<div className="mb-4 bg-black bg-opacity-70 w-16 h-[6px]"></div>
				</div>

				{/* 글 작성 부분 */}
				<Note title={title}/>

				<div className="absolute w-full h-fit left-0 bottom-0 z-10 flex justify-between shadow-2xl shadow-black font-noto text-lg px-4 py-4">
					<button className="py-2 px-4 hover:bg-gray-100 rounded-md">
						⬅ 나가기
					</button>
					<div className="flex gap-x-4">
						<button className="py-2 px-4 text-red-400 hover:bg-gray-100 rounded-md">
							임시저장
						</button>
						<button className="py-2 px-4 bg-red-300 text-white hover:bg-opacity-80  rounded-md" onClick={() => console.log(localStorage.getItem('content'))}>
							출간하기
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}