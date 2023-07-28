// @ts-nocheck
'use client'



import * as d3 from "d3";
import { useEffect, useRef } from "react";
import data from "../../public/miserables.json";

export default function Test() {

	useEffect(() => {

		// Specify the dimensions of the chart.
		const width = window.innerWidth;
		const height = window.innerHeight;

		// Specify the color scale.
		const color = d3.scaleOrdinal(d3.schemeCategory10);

		// The force simulation mutates links and nodes, so create a copy
		// so that re-evaluating this cell produces the same result.
		let links = data.links.map(d => ({ ...d }));
		let nodes = data.nodes.map(d => ({ ...d }));

		const svg = d3.select("#container").append("svg")
			.attr("width", width)
			.attr("height", height)
			.attr("viewBox", [-width / 2, -height / 2, width, height]);

		const simulation = d3.forceSimulation()
			.force("charge", d3.forceManyBody().strength(-1000))
			.force("link", d3.forceLink().id(d => d.id).distance(10))
			.force("x", d3.forceX())
			.force("y", d3.forceY())
			.on("tick", ticked);

		let link = svg.append("g")
			.attr("stroke", "#000")
			.attr("stroke-width", 1.5)
			.selectAll("line");

		let node = svg.append("g")
			.selectAll("g");
		// .attr("stroke", "#fff")
		// .attr("stroke-width", 1.5)


		function ticked() {
			node
				.selectAll("circle")
				.attr("cx", d => d.x)
				.attr("cy", d => d.y);

			node
				.selectAll("text")
				.attr("x", d => d.x + 3)
				.attr("y", d => d.y + 3);

			link.attr("x1", d => d.source.x)
				.attr("y1", d => d.source.y)
				.attr("x2", d => d.target.x)
				.attr("y2", d => d.target.y);
		}

		function update({ nodes, links }) {

			// Make a shallow copy to protect against mutation, while
			// recycling old nodes to preserve position and velocity.
			const old = new Map(node.data().map(d => [d.id, d]));
			nodes = nodes.map(d => Object.assign(old.get(d.id) || {}, d));
			links = links.map(d => Object.assign({}, d));

			simulation.nodes(nodes);
			simulation.force("link").links(links);
			simulation.alpha(1).restart();

			node = node
				.data(nodes, d => d.id)
				.join(enter => {
					const g = enter.append("g");
					g.append("circle")
						.attr("r", 8)
						.attr("fill", d => color(d.id));
					g.append("text")
						.text(d => d.id)
						.attr("class", "fill-white")
						.attr("font-size", "1.5em")
						.style("stroke", "gray")
						.style("stroke-width", 1);
					return g;
				});

			link = link
				.data(links, d => `${d.source.id}\t${d.target.id}`)
				.join("line");
		}

		update({nodes, links});

	// 	setInterval(() => {
	// 		const id = Date.now().toString();
	// 		nodes.push({
	// 			id: id,
	// 			group: 1
	// 		});

	// 		links.push({
	// 			source: id,
	// 			target: "Javert",
	// 			"value": 1
	// 		});

	// 		update({nodes, links});
	// 	}, 1000)
	});

	return (
		<div className="w-full h-screen bg-red-200" id="container">
			<button id="add"> 노드 추가</button>
		</div>
	)
}