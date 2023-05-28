'use client'

import Nav from "./nav"
import Login from "./login";
import Section from "./section"
import { useContext } from "react";
import { StateContext, StateDispatchContext } from "./state";


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
		</div>
	)
}
