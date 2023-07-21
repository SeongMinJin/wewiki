'use client'

import * as d3 from "d3"
import { MouseEvent, useEffect, useState } from "react"
import { Wiki } from "../page";
import { ToastWraper } from "@/app/components/main";

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

export default function Graph({
	wikies,
	currentWiki
}: {
	wikies: Wiki[],
	currentWiki: Wiki | undefined,
}) {

	function draw() {
		const WIDTH = document.getElementById("graph")?.parentElement?.clientWidth || 0;
		const HEIGHT = document.getElementById("graph")?.parentElement?.clientHeight || 0;

		const svg = d3.select("svg");
		
		svg.attr("width", WIDTH).attr("height", HEIGHT);

		function mouseOver(d) {
			d3.select(this)
				.style("stroke", "red");
			console.log(this);
		}
	
		// const links = svg.append("g")
		// 	.selectAll("line")
		// 	.data(data.links)
		// 	.enter()
		// 	.append("line")
		// 	.attr("stroke-width", 3)
		// 	.style("stroke", "pink");

		const nodes = svg.append("g")
			.selectAll("circle")
			.data(wikies)
			.enter()
			.append("circle")
			.attr("id", (d) => "id" + d.id)
			.on("mouseover", (i, j) => {
				d3.select(i.target)
					.style("stroke", "red")
					.style("stroke-width", 3)
			})
			.on("mouseleave", (i, j) => {
				d3.select(i.target)
					.style("stroke", "none")
			})
			// .on("mouseover", mouseOver)
			.attr("r", "10")
			.style("fill", (d) => d.id === currentWiki?.id ? "red" : "orange")


		function ticked() {
			// links
			// 	.attr("x1", (d) => d.source.x)
			// 	.attr("y1", (d) => d.source.y)
			// 	.attr("x2", (d) => d.target.x)
			// 	.attr("y2", (d) => d.target.y)

			nodes
				.attr("cx", (d) => d.x)
				.attr("cy", (d) => d.y)
		}

		const simulation = d3.forceSimulation(wikies)
			// .force("link", d3.forceLink(data.links).id(d => d.id || 1))
			.force("charge", d3.forceManyBody().strength(-20))
			// .force("charge", d3.forceManyBody().strength(-30).distanceMax(100))
			.force("center", d3.forceCenter(WIDTH / 2, HEIGHT / 2))
			.force("collide", d3.forceCollide(20))
			.force("position", d3.forceRadial(20, WIDTH / 2, HEIGHT / 2))
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
	}

	function erase() {
		const svg = d3.select("svg");
		svg.selectAll("g").remove();
	}
	
	useEffect(() => {
	}, [])

	function trigger() {
		// @ts-ignore
		if (window.timerId) {
			// @ts-ignore
			clearTimeout(window.timerId);
		}
		// @ts-ignore
		window.timerId = setTimeout(() => {erase(); draw();}, 1000);
	}
	
	useEffect(() => {
		window.removeEventListener("resize", trigger);
		erase();
		draw();
		window.addEventListener("resize", trigger);
	}, [wikies])

	return (
		<div id="graph" className="relative flex w-full">
			<svg>
			</svg>
		</div>
	)
}