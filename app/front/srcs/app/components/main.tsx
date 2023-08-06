'use client'

import Nav from "./nav"
import Login from "./login";
import Section from "./section"
import { useContext, useEffect } from "react";
import { StateContext, StateDispatchContext } from "../state";
import { ToastContainer, toast, Flip } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { redirect } from "next/navigation";

export default function Main() {

	const state = useContext(StateContext);
	const dispatch = useContext(StateDispatchContext);

	const check = async function() {
		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}:${process.env.NEXT_PUBLIC_API_PORT}/auth/check`, {
				method: "GET",
				credentials: "include"
			}).then(res => res.json());
	
			if (!res.success) {
				return;
			}

			if (!res.data.user) {
				return;
			}

			dispatch({type: "login"});

		} catch (err) {
			console.log(err);
		}

	}

	useEffect(() => {
		check();
	}, [])

	return (
		<div id="root" className="relative w-screen min-w-[300px] min-h-screen flex justify-center px-6" onClick={(e: any) => {
			const avatar = document.getElementById('avatar');
			avatar?.contains(e.target) ? dispatch({ type: state.isOpen ? 'close' : 'open' }) : dispatch({ type: 'close' });
		}}>
			<div className="relative w-full tablet:w-[1024px] laptop:w-[1440px] desktop:w-[1920px]">
				<Nav />
				<Section />
			</div>
			<Login />
			<ToastContainer
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
		</div>
	)
}

export function ToastWraper(type: string, message: string, path: string | null = null) {
	switch (type) {
		case "error":
			return toast.error(message, {
				position: "top-right",
				autoClose: 1500,
				transition: Flip,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "dark",
				onClose: () => {path ? redirect(path) : null}
			})
		case "warn":
			return toast.warn(message, {
				position: "top-right",
				autoClose: 1500,
				transition: Flip,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "dark",
			})
		case "success":
			return toast.success(message, {
				position: "top-right",
				autoClose: 1500,
				transition: Flip,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "dark",
			})
		default:
			return;
	}
}