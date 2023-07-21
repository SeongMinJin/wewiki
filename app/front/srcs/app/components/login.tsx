'use client'

import { FormEvent, useContext, useState } from "react"
import { StateContext, StateDispatchContext } from "../state"
import { ToastWraper } from "./main";
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
	const state = useContext(StateContext);
	const dispatch = useContext(StateDispatchContext);
	const [signUp, setSignUp] = useState(false);
	const [id, setId] = useState("");
	const [password, setPassword] = useState("");

	return (
		<div className={`fixed w-full h-full min-w-[300px] bg-white ${state.isLoginOpen ? "top-0" : "top-full"}  phone:flex phone:justify-center phone:items-center phone:bg-opacity-70 phone:bg-none`}>
			<div className={`relative w-full h-full p-6 bg-white transition-transform duration-500 phone:w-[390px] phone:h-[500px] phone:shadow-2xl`}>
				<div className="flex justify-end w-full ">
					<button onClick={() => dispatch('closeLogin')}>
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
							<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>
				<div className="grid w-full mt-10 font-noto gap-y-6">
					<h2 className="text-xl font-bold">{signUp ? "회원가입" : "로그인"}</h2>
					<h4 className="font-bold text-black text-opacity-40">아이디로 {signUp ? "회원가입" : "로그인"}</h4>
					<div className="flex w-full">
						<form className="w-full" onSubmit={async (e: FormEvent) => {
							const res = await Submit(e, id, password, signUp);
							if (res && signUp) {
								setSignUp(false);
								setId("");
								setPassword("");
								document.getElementById("id")?.focus();
								return;
							}

							if (res && !signUp) {
								dispatch({ type: "closeLogin" });
								dispatch({ type: "login" });
								setId("");
								setPassword("");
							}
						}
						}>
							<div className="border divide-y">
								<input value={id} onChange={(e) => setId(e.target.value)} id="id" className="w-full p-3 focus-within:outline-red-200" type="text" placeholder="아이디를 입력하세요." />
								<input value={password} onChange={(e) => setPassword(e.target.value)} id="password" className="w-full p-3 focus-within:outline-red-200" type="password" placeholder={`${signUp ? "영문 숫자 특수기호 조합 8~15 자리." : "비밀번호를 입력하세요."}`} />
							</div>
							<button className="w-full p-3 whitespace-nowrap min-w-[100px] flex justify-center text-center bg-red-400 text-white hover:bg-red-300" type="submit">
								{signUp ? "회원가입" : "로그인"}
							</button>
						</form>
					</div>
				</div>
				<div className="absolute bottom-5 right-5">
					{signUp ? "이미 회원이신가요 ?" : "아직 회원이 아니신가요 ?"}
					<span>
						&nbsp;&nbsp;
						<button onClick={() => setSignUp(!signUp)} className="text-red-400 ">
							{signUp ? "로그인" : "회원가입"}
						</button>
					</span>
				</div>
			</div>
		</div>
	)
}

const Submit = async (e: FormEvent, id: string, password: string, signUp: boolean): Promise<boolean> => {
	e.preventDefault();
	if (id === "" || id === null || id === undefined) {
		ToastWraper("error", "아이디를 입력해주세요.");
		return false;
	}

	if (password === "" || password === null || password === undefined) {
		ToastWraper("error", "비밀번호를 입력해주세요.");
		return false;
	}

	return signUp ? SignUp(id, password) : SignIn(id, password);
}

const SignIn = async (id: string, password: string): Promise<boolean> => {
	try {
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}:${process.env.NEXT_PUBLIC_API_PORT}/auth/signin`, {
			headers: {
				"Content-Type": "application/json",
			},
			method: "post",
			body: JSON.stringify({
				id: id,
				password: password,
			}),
			credentials: 'include',
		});

		switch (res.status) {
			case 200:
				return true;
			case 401:
				ToastWraper("error", "로그인 정보가 유효하지 않습니다.");
				return false;
			case 500:
				ToastWraper("error", "서버가 아파요 :(");
				return false;
			default:
				return false;
		}
	} catch {
		ToastWraper("error", "서버가 아파요 :(");
		return false;
	}

}

const SignUp = async (id: string, password: string): Promise<boolean> => {
	const regex = new RegExp(/^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/);
	if (!regex.test(password)) {
		ToastWraper("error", "비밀번호 규칙을 확인해주세요.");
		return false;
	}

	try {
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}:${process.env.NEXT_PUBLIC_API_PORT}/auth/signup`, {
			headers: {
				"Content-Type": "application/json"
			},
			method: "post",
			body: JSON.stringify({
				id: id,
				password: password,
			}),
		});

		switch (res.status) {
			case 201:
				ToastWraper("success", "회원가입을 축하합니다!");
				return true;
			case 409:
				ToastWraper("error", "이미 사용중인 아이디입니다.");
				return false;
			case 500:
				ToastWraper("error", "서버가 아파요 :(");
				return false;
			default:
				return false;
		}
	} catch {
		ToastWraper("error", "서버가 아파요 :(");
		return false;

	}
}
