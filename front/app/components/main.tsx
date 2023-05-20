'use client'

import { useState } from "react"

import Nav from "./nav"
import Section from "./section"

export default function Main() {
	const [isOpen, setIsopen] = useState(false);
	return (
		<div className="w-screen min-w-[300px] min-h-screen flex justify-center px-6" onClick={(e: any) => {
			const avatar = document.getElementById('avatar');
			avatar?.contains(e.target) ? setIsopen(!isOpen) : setIsopen(false);
		}}>
			<div className="w-full tablet:w-[1024px] laptop:w-[1440px] desktop:w-[1920px]">
				<Nav isOpen={isOpen}/>
				<Section />
			</div>
		</div>
	)
}