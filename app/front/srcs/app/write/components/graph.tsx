'use client'

import * as d3 from "d3"
import { MouseEvent, useEffect, useState } from "react"
import { Relation, Wiki } from "../page";
import { ToastWraper } from "@/app/components/main";


export default function Graph({
	wikies,
	relations,
	currentWiki,
}: {
	wikies: Wiki[],
	relations: Relation[],
	currentWiki: Wiki | undefined,
}) {


	const SVG = d3.select("svg");

	const SIMULATION = d3.forceSimulation()
		.force("charge", d3.forceManyBody().strength(-30).distanceMax(100))
		.force("collide", d3.forceCollide(20));
	

	// let links = SVG.append("g")
	// 	.attr("stroke", "#000")
	// 	.attr("stroke-width", 1.5)
	// 	.selectAll("line");

	
		// .attr("stroke", "#fff")
		// .attr("stroke-width", 1.5)

	function ticked() {
		// node
		// 	.attr("cx", d => d.x)
		// 	.attr("cy", d => d.y)

		// links.attr("x1", d => d.source.x)
		// 	.attr("y1", d => d.source.y)
		// 	.attr("x2", d => d.target.x)
		// 	.attr("y2", d => d.target.y);
	}

	// function ticked() {
	// 	nodes.attr("cx", d => d.x)
	// 			.attr("cy", d => d.y)

		// links.attr("x1", d => d.source.x)
		// 		.attr("y1", d => d.source.y)
		// 		.attr("x2", d => d.target.x)
		// 		.attr("y2", d => d.target.y);
	// }
	const [isInit, setIsInit] = useState<boolean>(true);

	


	function draw() {
		setIsInit(false);
		const WIDTH = document.getElementById("graph")?.parentElement?.clientWidth || 0;
		const HEIGHT = document.getElementById("graph")?.parentElement?.clientHeight || 0;

		
		SVG.attr("width", WIDTH).attr("height", HEIGHT);

		const nodes = SVG.select("g")
			.selectAll("circle")
			.data(wikies)

		const newNodes = nodes
			.enter()
			.append("circle")
			.attr("id", (d) => "id" + d.id)
			.attr("r", "10")
			.style("fill", (d) => d.id === currentWiki?.id ? "red" : "orange");

			// .on("mouseover", (i, j) => {
			// 	d3.select(i.target)
			// 		.style("stroke", "red")
			// 		.style("stroke-width", 3)
			// })
			// .on("mouseleave", (i, j) => {
			// 	d3.select(i.target)
			// 		.style("stroke", "none")
			// })
			// .on("mouseover", mouseOver)

		// nodes.exit().remove();
		
		function ticked() {
			newNodes
				// .attr("cx", d => {console.log(d); return d.x;})
				.attr("cy", d => d.y);

			// newLinks.attr("x1", d => d.source.x)
			// 	.attr("y1", d => d.source.y)
			// 	.attr("x2", d => d.target.x)
			// 	.attr("y2", d => d.target.y);
		}

		// console.log(newNodes);
		console.log(wikies);
		SIMULATION
		.nodes(wikies)
		.force("center", d3.forceCenter(WIDTH / 2, HEIGHT / 2))
		.force("position", d3.forceRadial(100, WIDTH / 2, HEIGHT / 2))
		.on("tick", ticked);

		// newNodes.call(drag)
	}

	function erase() {
		const svg = d3.select("svg");
		svg.selectAll("g").remove();
	}

	function update() {
		const old = new Map(SIMULATION.nodes().map(d => [d.id, d]));
    const nodes = wikies.map(d => Object.assign(old.get(d.id) || {}, d));
		
		SIMULATION.nodes(nodes);

		// d3.selectAll("circle")
		// 	.data(nodes, d => d.id)
		// 	.join(enter => enter.append("circle")
		// 	.attr("r", 8)
		// 	.attr("fill", "orange"))
		// 	.attr("cx", d => d.x)
		// 	.attr("cy", d => d.y);

		// function ticked() {
		// 	nodes.attr("cx", d => d.x)
		// 		.attr("cy", d => d.y)

		// 	// newLinks.attr("x1", d => d.source.x)
		// 	// 	.attr("y1", d => d.source.y)
		// 	// 	.attr("x2", d => d.target.x)
		// 	// 	.attr("y2", d => d.target.y);
		// }
	}


	function trigger() {
		// @ts-ignore
		if (window.timerId) {
			// @ts-ignore
			clearTimeout(window.timerId);
		}
		// @ts-ignore
		window.timerId = setTimeout(() => { draw(); }, 1000);
	}

	useEffect(() => {
		// window.removeEventListener("resize", trigger);
		if (!wikies || !relations || !currentWiki)	
			return;
		// erase();
		isInit ? draw() : update();
		// chart.update(wikies, relations, currentWiki);
		// window.addEventListener("resize", trigger);
	}, [wikies, currentWiki, relations])

	return (
		<div id="graph" className="relative flex w-full">
			{/* <button onClick={() => update()}>CLICK</button> */}
			<svg>
				<g></g>
			</svg>
		</div>
	)
}








		// const links = SVG.append("g")
		// 	.selectAll("line")
		// 	.data(relations)

		// const newLinks = links
		// 	.enter()
		// 	.append("line")
		// 	.attr("stroke-width", 3)
		// 	.style("stroke", "pink");

		// links.exit().remove();



// function dragStarted(d) {
	// 	SIMULATION.alphaTarget(0.3).restart();
	// 	d.subject.fx = d.subject.x;
	// 	d.subject.fy = d.subject.y;
	// }

	// function dragged(d) {
	// 	d.subject.fx = d.x;
	// 	d.subject.fy = d.y;
	// }

	// function dragEnded(d) {
	// 	SIMULATION.alphaTarget(0);
	// 	d.subject.fx = null;
	// 	d.subject.fy = null;
	// }

	// const drag = d3.drag()
	// 	.on("start", dragStarted)
	// 	.on("drag", dragged)
	// 	.on("end", dragEnded);

	// .on("tick", ticked);
	// .force("link", d3.forceLink(relations).id(d => d.id || 1))
	// .force("charge", d3.forceManyBody().strength(-30).distanceMax(100))
	// .force("center", d3.forceCenter(WIDTH / 2, HEIGHT / 2))
	// .force("position", d3.forceRadial(70, WIDTH / 2, HEIGHT / 2))