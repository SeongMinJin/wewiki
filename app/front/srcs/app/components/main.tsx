'use client'

import Nav from "./nav"
import Login from "./login";
import Section from "./section"
import { useContext } from "react";
import { StateContext, StateDispatchContext } from "../state";
import { ToastContainer, toast } from "react-toastify";
import { redirect, useRouter } from "next/navigation";

export default function Main() {

	const state = useContext(StateContext);
	const dispatch = useContext(StateDispatchContext);

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
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "colored",
				onClose: () => {path ? redirect(path) : null}
			})
		case "warn":
			return toast.warn(message, {
				position: "top-right",
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "colored",
			})
		case "success":
			return toast.success(message, {
				position: "top-right",
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "colored",
			})
		default:
			return;
	}
}