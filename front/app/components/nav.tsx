'use client'
import { useState } from "react"
import Image from "next/image";
import Fab from "./fab";
import Link from "next/link";

export default function Nav() {
	const [isLogin, setIsLogin] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	return (
		<nav className="w-full relative my-8 h-[40px] flex justify-between">
			<div className="w-auto flex items-center font-abril-fatface tracking-widest text-[140%] opacity-70">
				<a href="">weWiki</a>
			</div>
			<div className="w-auto relative flex items-center font-noto">
				{
					isLogin ?
						<>
							<div className="flex items-center gap-x-6">
								<Link href="/write" className="hidden tablet:block border border-black rounded-3xl py-1 px-4 w-auto text-[100%] hover:bg-black hover:text-white whitespace-nowrap duration-500">
									새 글 작성
								</Link>
								<div onClick={() => setIsOpen(!isOpen)} className="flex items-center cursor-pointer group/avatar">
									<Image
										src="/건빵.png"
										width={40}
										height={40}
										alt="Image of Avatar"
										style={{
											minWidth: '40px',
											minHeight: '40px',
										}}
										className="rounded-full shadow-lg"
									/>
									<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 group-hover/avatar:stroke-2 duration-300">
										<path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
									</svg>
								</div>
							</div>
							<Fab />
						</> :
						<button onClick={() => setIsLogin(!isLogin)} className=" shrink-0 text-[100%] rounded-3xl py-1 px-4 bg-black text-white hover:opacity-70">
							로그인
						</button>
				}
				{
					isOpen ? <Drawer /> : null
				}
			</div>
		</nav>
	)
}

function Drawer() {
	return (
		<div className="absolute w-64 place-self-stretch top-[100%] right-0">
			<ul className="relative shadow-2xl border mt-4 bg-white z-10">
				<li className="hover:bg-red-100 hover:bg-opacity-30 hover:text-red-400 p-3 whitespace-nowrap"><Link href="/my">내 위키</Link></li>
				<li className="hover:bg-red-100 hover:bg-opacity-30 hover:text-red-400 p-3 whitespace-nowrap"><Link href="/temp">임시 글</Link></li>
				<li className="hover:bg-red-100 hover:bg-opacity-30 hover:text-red-400 p-3 whitespace-nowrap"><><button>로그아웃</button></></li>
			</ul>
		</div>
	)
}