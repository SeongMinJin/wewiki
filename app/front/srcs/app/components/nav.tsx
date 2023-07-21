'use client'
import { useContext } from "react"
import Image from "next/image";
import Fab from "./fab";
import Link from "next/link";
import { StateContext, StateDispatchContext } from "../state";
import { ToastWraper } from "./main";

export default function Nav() {

	const state = useContext(StateContext);
	const dispatch = useContext(StateDispatchContext);

	return (
		<nav className="w-full relative my-8 h-[40px] flex justify-between">
			<div className="w-auto flex items-center font-abril-fatface tracking-widest text-[140%] opacity-70">
				<a href="">weWiki</a>
			</div>
			<div className="relative flex items-center w-auto font-noto">
				{
					state.isLogin ?
						<>
							<div className="flex items-center gap-x-6">
								<Link href="/write" className="hidden tablet:block border border-black rounded-3xl py-1 px-4 w-auto text-[100%] hover:bg-black hover:text-white whitespace-nowrap duration-500">
									새 글 작성
								</Link>
								<div id="avatar" className="flex items-center cursor-pointer group/avatar">
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
									<span className="duration-300 opacity-50 group-hover/avatar:opacity-100">▾</span>
								</div>
							</div>
							<Fab />
						</> :
						<button onClick={() => dispatch({ type: 'openLogin' })} className=" shrink-0 text-[100%] rounded-3xl py-1 px-4 bg-black text-white hover:opacity-70">
							로그인
						</button>
				}
				{
					state.isOpen ? <Drawer /> : null
				}
			</div>
		</nav>
	)
}

function Drawer() {
	// const state = useContext(StateContext);
	const dispatch = useContext(StateDispatchContext);
	return (
		<div className="absolute w-64 place-self-stretch top-[100%] right-0">
			<ul className="relative z-10 mt-4 bg-white border shadow-2xl">
				<li className="p-3 cursor-pointer hover:bg-red-100 hover:bg-opacity-30 hover:text-red-400 whitespace-nowrap"><Link href="/my">내 위키</Link></li>
				<li className="p-3 cursor-pointer hover:bg-red-100 hover:bg-opacity-30 hover:text-red-400 whitespace-nowrap"><Link href="/temp">임시 글</Link></li>
				<li onClick={async () => {
					const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}:${process.env.NEXT_PUBLIC_API_PORT}/auth/signout`, {
						credentials: "include",
					})
					switch (res.status) {
						case 200:
							dispatch({ type: 'logout' });
							return;
						default:
							ToastWraper("error", "서버가 아파요 :(");
					}
				}} className="p-3 cursor-pointer hover:bg-red-100 hover:bg-opacity-30 hover:text-red-400 whitespace-nowrap"><button>로그아웃</button></li>
			</ul>
		</div>
	)
}