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
	const WIDTH = window.innerWidth;
	const HEIGHT = window.innerHeight;

	useEffect(() => {
		const svg = d3.select("svg");
		svg.attr("width", WIDTH).attr("height", HEIGHT);

		const links = svg.append("g")
			.selectAll("line")
			.data(data.links)
			.enter()
			.append("line")
			.attr("stroke-width", 3)
			.style("stroke", "pink");

		const nodes = svg.append("g")
			.selectAll("circle")
			.data(data.nodes)
			.enter()
			.append("circle")
			.attr("r", "10")
			.style("fill", "orange");

		function ticked() {
			links
				.attr("x1", (d) => d.source.x)
				.attr("y1", (d) => d.source.y)
				.attr("x2", (d) => d.target.x)
				.attr("y2", (d) => d.target.y)

			nodes
				.attr("cx", (d) => d.x)
				.attr("cy", (d) => d.y)
		}

		const simulation = d3.forceSimulation(data.nodes)
			.force("link", d3.forceLink(data.links).id(d => d.id || 1))
			.force("charge", d3.forceManyBody().strength(-50))
			.force("center", d3.forceCenter(WIDTH / 2, HEIGHT / 2))
			.on("tick", ticked);

		function dragStarted(d) {
			simulation.alphaTarget(0.3).restart();
			d.subject.fx = d.subject.x;
			d.subject.fy = d.subject.y;
		}

		function dragged(d) {
			d.subject.fx = d.x;
			d.subject.fy = d.y;
		}

		function dragEnded(d) {
			simulation.alphaTarget(0);
			d.subject.fx = null;
			d.subject.fy = null;
		}

		const drag = d3.drag()
			.on("start", dragStarted)
			.on("drag", dragged)
			.on("end", dragEnded);
		
		nodes.call(drag)
	}, [])


	return (
		<div className="relative flex w-full">
			<svg>

			</svg>
		</div>
	)
}