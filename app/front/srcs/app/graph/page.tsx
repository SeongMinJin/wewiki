'use client'

import * as d3 from "d3"
import { useEffect, useRef } from "react"


export default function Graph() {
	const ref = useRef(null);

	const data = {
		"nodes": [
			{
				id: 1,
				title: "제목123"
			},
			{
				id: 2,
				title: "제목456",
			},
			{
				id: 3,
				title: "제목789",
			},
			{
				id: 4,
				title: "제목4",
			},
			{
				id: 5,
				title: "제목5",
			},
		],
		"links": [
			{
				source: 1,
				target: 2
			},
			{
				source: 1,
				target: 5
			},
			{
				source: 4,
				target: 3
			},
		]
	}

	// set the dimensions and margins of the graph
	const margin = { top: 10, right: 30, bottom: 30, left: 40 },
		width = 1600 - margin.left - margin.right,
		height = 400 - margin.top - margin.bottom;

	

	useEffect(() => {
		// append the svg object to the body of the page
		var svgElem = d3.select("#my_dataviz")
			.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		const link = svgElem
			.selectAll("line")
			.data(data.links)
			.enter()
			.append("line")
      .style("stroke", "#aaa")

		const node = svgElem
			.selectAll("circle")
			.data(data.nodes)
			.enter()
			.append("circle")
			.attr("r", 20)
			.style("fill", "#69b3a2")

		const simulation = d3.forceSimulation(data.nodes)
			.force("link", d3.forceLink()
				.id(d => d.id || 1)
				.links(data.links)
			)
			.force("charge", d3.forceManyBody().strength(-400))         // This adds repulsion between nodes. Play with the -400 for the repulsion strength
			.force("center", d3.forceCenter(width / 2, height / 2))     // This force attracts nodes to the center of the svg area
			.on("end", ticked);

		function ticked() {
			link
				.attr("x1", d => d.source.x)
				.attr("y1", d => d.source.y)
				.attr("x2", d => d.target.x)
				.attr("y2", d => d.target.y);

			node
				.attr("cx", d => d.x + 6)
				.attr("cy", d => d.y - 6);
		}
		// const line = svgElem.selectAll("div");
		// .data(data.links)
		// .enter()
		// .append("line")
		// .style("storke", "#aaa");

		// const node = svgElem.selectAll("circle")
		// .data(data.nodes)
		// .enter()
		// .append("circle")
		// .attr("r", 20)
		// .style("file", "#69b3a2");

		// const simulation = d3.forceSimulation(data.nodes)
		// 	.force("link", d3.forceLink()
		// 		.id(function(d) { return d.id; })
		// 		.links(data.links)
		// 	)
		// 	.force("charge", d3.forceManyBody().strength(-400))
		// 	.force("center", d3.forceCenter(width / 2, height / 2))

		// function ticked() {
		// 	link
		// 		.attr("x1", function (d) { return d.source.x; })
		// 		.attr("y1", function (d) { return d.source.y; })
		// 		.attr("x2", function (d) { return d.target.x; })
		// 		.attr("y2", function (d) { return d.target.y; });

		// 	node
		// 		.attr("cx", function (d) { return d.x + 6; })
		// 		.attr("cy", function (d) { return d.y - 6; });
		// }
	}, [])


	return (
		<main className="relative w-full h-screen p-32">
			<div id="my_dataviz"></div>
		</main>
	)
}