'use client'

import { FormEvent, useContext, useState } from "react"
import { StateContext, StateDispatchContext } from "./state"

export default function Login() {
	const state = useContext(StateContext);
	const dispatch = useContext(StateDispatchContext);
	const [signUp, setSignUp] = useState(false);
	const [id, setId] = useState("");
	const [password, setPassword] = useState("");

	return (
		<div className={`min-w-[300px] fixed p-6 ${state.isLoginOpen ? "top-0 scale-100" : "top-full scale-50"} w-full h-full transition-all duration-300 bg-white`}>
			<div className="w-full flex justify-end">
				<button onClick={() => dispatch('closeLogin')}>
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
						<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>

			<div className="font-noto w-full mt-10 grid gap-y-6">
				<h2 className="text-xl font-bold">{signUp ? "회원가입" : "로그인"}</h2>
				<h4 className="font-bold text-black text-opacity-40">아이디로 {signUp ? "회원가입" : "로그인"}</h4>
				<div className="w-full flex">
					<form className="w-full" onSubmit={(e: FormEvent) => Submit(e, id, password)}>
						<div className="divide-y border">
							<input required onChange={(e) => setId(e.target.value)} id="name" className="w-full p-3 focus-within:outline-red-200" type="text" placeholder="아이디를 입력하세요." />
							<input required onChange={(e) => setPassword(e.target.value)} id="password" className="w-full p-3 focus-within:outline-red-200" type="password" placeholder="비밀번호를 입력하세요." />
						</div>
						<button className="w-full p-3 whitespace-nowrap min-w-[100px] flex justify-center text-center bg-red-400 text-white hover:bg-red-300" type="submit" onClick={() => console.log(process.env.SERVER_IP)}>
							{signUp ? "회원가입" : "로그인"}
						</button>
					</form>
				</div>
			</div>

			<div className="absolute bottom-5 right-5">
				{ signUp ? "이미 회원이신가요 ?" :"아직 회원이 아니신가요 ?"}
				<span>
					&nbsp;&nbsp;
					<button onClick={() => setSignUp(!signUp)} className=" text-red-400">
						{signUp ? "로그인" : "회원가입"}
					</button>
				</span>
			</div>


		</div>
	)
}

const Submit = async (e: FormEvent, id: string, password: string) => {
	e.preventDefault();
	if (id === "" || id === null || id === undefined) return false;
	if (password === "" || password === null || password === undefined) return false;
}

const SignIn = (id: string, password: string) => {
	
}

const SignUp = (id: string, password: string) => {

}
