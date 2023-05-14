'use client'
import { useState } from "react"
import Image from "next/image";
import Fab from "./fab";

export default function Nav() {
	const [isLogin, setIsLogin] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

	return (
		<nav className="my-8 h-[40px] flex justify-between">
			<div className="flex items-center font-abril-fatface tracking-widest text-2xl opacity-70r">
				<a href="">jelog</a>
			</div>
			<div className="flex items-center font-noto">
				{
					isLogin ?
						<>
							<div className="flex items-center gap-x-6">
								<button className="hidden tablet:block border border-black rounded-3xl py-1 px-4 w-auto text-[100%] hover:bg-black hover:text-white whitespace-nowrap duration-500">
									새 글 작성
								</button>
								<div className="flex items-center">
									<Image
										src="/건빵.png"
										width={40}
										height={40}
										alt="Image of Avatar"
										className="rounded-full shadow-lg"
									/>
									<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 hover:stroke-2">
										<path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
									</svg>
								</div>
							</div>
							<Fab />
						</> :
						<button onClick={() => setIsLogin(!isLogin)} className="rounded-3xl py-1 px-4 bg-black text-white hover:opacity-70 whitespace-nowrap">
							로그인
						</button>
				}
			</div>
		</nav>
	)
}