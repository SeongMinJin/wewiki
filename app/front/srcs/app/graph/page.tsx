'use client'

import * as d3 from "d3"
import { useEffect } from "react"

interface Node {
	id: number | undefined;
	title: string | undefined;
}

interface Link {
	source: number,
	target: number,
}

const data: {
	nodes: Node[],
	links: Link[]
} = {
	nodes: [
		{
			id: 1,
			title: "Node.js"
		},
		{
			id: 2,
			title: "Javascript"
		},
		{
			id: 3,
			title: "두부 김치"
		},
		{
			id: 4,
			title: "술안주"
		},
		{
			id: 5,
			title: "프로그래밍 언어"
		}
	],
	links: [
		{
			source: 1,
			target: 5
		},
		{
			source: 2,
			target: 5
		},
		{
			source: 3,
			target: 4
		}
	]
}

export default function Graph() {
	useEffect(() => {

		
	}, [])


	return (
		<div className="relative flex w-full">
			<div className="flex gap-10 p-32" id="box">
			</div>
		</div>
	)
}