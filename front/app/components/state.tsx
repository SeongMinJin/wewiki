'use client'

import { createContext, useReducer } from "react"
import type { Dispatch } from "react";

const initialState = {
	isLogin: false,
	isOpen: false,
	isLoginOpen: false,
}

export const StateContext = createContext(initialState);
export const StateDispatchContext = createContext((() => undefined) as Dispatch<any>);

export default function Provider({
	children
}: {
	children: React.ReactNode
}) {

	const [state, dispatch] = useReducer(StateReducer, initialState);

	return (
		<StateContext.Provider value={state}>
			<StateDispatchContext.Provider value={dispatch}>
				{children}
			</StateDispatchContext.Provider>
		</StateContext.Provider>
	)
}

function StateReducer(state: any, action: { type: string }) {
	switch (action.type) {
		case 'login': {
			return {
				...state,
				isLogin: true,
			}
		}
		case 'logout': {
			return {
				...state,
				isLogin: false,
			}
		}
		case 'open': {
			return {
				...state,
				isOpen: true,
			}
		}
		case 'close': {
			return {
				...state,
				isOpen: false,
			}
		}
		case 'openLogin': {
			document.getElementById("id")?.focus();
			return {
				...state,
				isLoginOpen: true,
			}
		}
		case 'closeLogin': {
			return {
				...state,
				isLoginOpen: false,
			}
		}
		default:
			return;
	}
}