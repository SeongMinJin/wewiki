'use client'

import * as d3 from "d3"
import { MouseEvent, useEffect, useState } from "react"
import { Relation, Wiki } from "../page";

const _nodes: any[] = [

]

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
		.force("charge", d3.forceManyBody().strength(-50))
		.force("collide", d3.forceCollide(20))
		.force("x", d3.forceX())
		.force("y", d3.forceY())
		.on("tick", ticked);

	let node = SVG.append("g").selectAll("circle");
	let link = SVG.append("g").selectAll("line");

	function ticked() {
		node.attr("cx", d => d.x).attr("cy", d => d.y);
		link.attr("x1", d => d.source.x).attr("y1", d => d.source.y).attr("x2", d => d.target.x).attr("y2", d => d.target.y);
	}

	function dragstarted(event) {
    if (!event.active) SIMULATION.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  function dragged(event) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  function dragended(event) {
    if (!event.active) SIMULATION.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }

	const drag = d3.drag()
		.on("start", dragstarted)
		.on("drag", dragged)
		.on("end", dragended);


	function update(nodes: any, links: any) {
		const WIDTH = document.getElementById("graph")?.clientWidth || 0;
		const HEIGHT = document.getElementById("graph")?.clientHeight || 0;
		SVG.attr("viewBox", [-WIDTH / 2, -HEIGHT / 2, WIDTH, HEIGHT]);
		
		const old = new Map(node.data().map(d => [d.id, d]));
		nodes = nodes.map(d => Object.assign(old.get(d.id) || {}, d));
		links = links.map(d => Object.assign({}, d));


		SIMULATION.nodes(nodes);
		SIMULATION.alpha(1).restart();
		

		node = node
			.data(nodes, d => d.id)
			.join(enter => enter.append("circle")
				.attr("r", 5)
				.attr("fill", "orange"))
				.call(drag);

		link = link
			.data(links, d => `${d.source.id}\t${d.target.id}`)
			.join("line");
	}


	useEffect(() => {
	}, [])

	useEffect(() => {
		if (!wikies || !relations)	
			return;
		update(_nodes, relations);
	}, [wikies, currentWiki, relations])

	return (
		<div id="graph" className="relative flex w-full h-full">
			<button onClick={() => {
				_nodes.push({
					"id": _nodes.length + 1
				});
				update(_nodes, relations);
			}}>CLICK</button>
			<svg>
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