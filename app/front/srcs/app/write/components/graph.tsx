import * as d3 from "d3"
import { Dispatch, MouseEvent, SetStateAction, useEffect, useState } from "react";
import { Relation, Wiki } from "../page";
import { ToastWraper } from "@/app/components/main";


export default function Graph({
	tickAddNewWiki,
	setTickAddNewWiki,
	setCurrentWiki,
} : {
	tickAddNewWiki: boolean,
	setTickAddNewWiki: Dispatch<SetStateAction<boolean>>,
	setCurrentWiki: Dispatch<SetStateAction<Wiki | null>>
}
) {

	let _wikies: Wiki[] = [];
	let _relations: Relation[] = [];
	let _currentWiki: Wiki | null = null;
	
	let SVG: any
	let SIMULATION: any;
	let DRAG: any;
	let node: any;
	let link: any;

	function update(nodes: any, links: any) {

		const old = new Map(node.data().map((d: any) => [d.id, d]));
		nodes = nodes.map((d: any) => Object.assign(old.get(d.id) || {}, d));
		links = links.map((d: any) => Object.assign({}, d));

		SIMULATION.nodes(nodes);
		SIMULATION.alpha(1).restart();
		

		node = node
			.data(nodes, (d: any) => d.id)
			.join((enter: any) => enter
				.append("circle")
				.attr("r", 5)
				.attr("id", (d: any) => `id${d.id}`)
				.attr("fill", "orange"))
				.on("click", (event: MouseEvent, node: any) => {
					if (_currentWiki) {
						d3.select(`#id${_currentWiki.id}`).attr("fill", "orange");
					}
					_currentWiki = {
						"id": node.id,
						"title": node.title
					}

					d3.select(`#id${node.id}`).attr("fill", "red");
					setCurrentWiki(_currentWiki);
				})
				.call(DRAG);

		link = link
			.data(links, (d: any) => `${d.source.id}\t${d.target.id}`)
			.join("line");
	}

	async function createWiki() {

		console.log(SIMULATION);

		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}:${process.env.NEXT_PUBLIC_API_PORT}/wiki/create`, {
				method: "post",
				credentials: "include",
			}).then(res => res.json());

			if (res.success) {
				console.log(res);
				const newWiki = res.data;
				_wikies.push({
					id: newWiki.id,
					title: newWiki.title
				});

				// update(_wikies, _relations);
				// setCurrentWiki(newWiki);

				// if (_currentWiki) {
				// 	d3.select(`#id${_currentWiki.id}`).attr("fill", "orange");
				// }

				// _currentWiki = newWiki;
				// d3.select(`#id${newWiki.id}`).attr("fill", "red");

			} else {
				ToastWraper("error", res.message);
			}

		} catch (err) {
			console.log(err);
			ToastWraper("error", "서버가 아파요 :(");
		}

	}

	useEffect(() => {
		SVG = d3.select("svg");
		SIMULATION = d3.forceSimulation()
			.force("charge", d3.forceManyBody().strength(-50))
			.force("collide", d3.forceCollide(20))
			.force("x", d3.forceX())
			.force("y", d3.forceY())
			.on("tick", ticked);

		node = SVG.append("g").selectAll("circle");
		link = SVG.append("g").selectAll("line");

		function ticked() {
			node.attr("cx", (d: any) => d.x).attr("cy", (d: any) => d.y);
			link.attr("x1", (d: any) => d.source.x).attr("y1", (d: any) => d.source.y).attr("x2", (d: any) => d.target.x).attr("y2", (d: any) => d.target.y);
		}
	
		function dragstarted(event: any) {
			if (!event.active) SIMULATION.alphaTarget(0.3).restart();
			event.subject.fx = event.subject.x;
			event.subject.fy = event.subject.y;
		}
	
		function dragged(event: any) {
			event.subject.fx = event.x;
			event.subject.fy = event.y;
		}
	
		function dragended(event: any) {
			if (!event.active) SIMULATION.alphaTarget(0);
			event.subject.fx = null;
			event.subject.fy = null;
		}
	
		DRAG = d3.drag()
			.on("start", dragstarted)
			.on("drag", dragged)
			.on("end", dragended);

		async function init() {
			/**
			 * Wiki Node와 Link 초기화
			 */
			try {
				const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}:${process.env.NEXT_PUBLIC_API_PORT}/wiki/find/all`, {
					credentials: "include",
				}).then(res => res.json());
	
				if (res.success) {
					_wikies = res.data.wikies;
					_relations = res.data.relations;

					const WIDTH = document.getElementById("graph")?.clientWidth || 0;
					const HEIGHT = document.getElementById("graph")?.clientHeight || 0;
					SVG.attr("viewBox", [-WIDTH / 2, -HEIGHT / 2, WIDTH, HEIGHT]);

				} else {
					ToastWraper("error", res.message, "/");
				}
			} catch (err) {
				ToastWraper("error", "서버가 아파요 :(", "/");
			}
			
			update(_wikies, _relations);
			return [_wikies, _relations];
		}


		init();
		window.addEventListener("resize", () => {
			const WIDTH = document.getElementById("graph")?.clientWidth || 0;
			const HEIGHT = document.getElementById("graph")?.clientHeight || 0;
			SVG.attr("viewBox", [-WIDTH / 2, -HEIGHT / 2, WIDTH, HEIGHT]);
			SIMULATION.restart();
		});

	}, [])

	useEffect(() => {
		if (!tickAddNewWiki)
			return;
		console.log("?");
		// createWiki()
		setTickAddNewWiki(!tickAddNewWiki);
	}, [tickAddNewWiki])

	return (
		<div id="graph" className="relative flex w-full h-full bg-gray-100 bg-gradient-to-tr">
			<svg></svg>
		</div>
	)
}
