// @ts-nocheck
"use client"

import * as d3 from "d3"
import { Dispatch, MouseEvent, MutableRefObject, SetStateAction, useEffect, useRef, useState } from "react";
import { Relation, Wiki } from "../page";
import { ToastWraper } from "@/app/components/main";


export default function Graph({
	setCurrentWiki,
	_createWiki,
	_saveWiki,
	_deleteWiki,
	_connectWiki,
	_wikies
}: {
	setCurrentWiki: Dispatch<SetStateAction<Wiki | null>>,
	_createWiki: MutableRefObject<(() => Promise<void>) | undefined>
	_saveWiki: MutableRefObject<((id: number, body: { value?: string, content?: string }) => Promise<void>) | undefined>
	_deleteWiki: MutableRefObject<((id: number) => Promise<void>) | undefined>
	_connectWiki: MutableRefObject<((source: number, target: number) => Promise<void>) | undefined>
	_wikies: MutableRefObject<Wiki[]>
}
) {
	// const _wikies = useRef<Wiki[]>([]);
	const _relations = useRef<Relation[]>([]);
	const _update = useRef<(nodes, links) => void>();
	const _currentWiki = useRef<Wiki>();
	// const _svg = useRef<d3.Selection<d3.BaseType, unknown, HTMLElement, any>>();
	// const _simulation = useRef<d3.Simulation<d3.SimulationNodeDatum, undefined>>();
	// const _node = useRef<d3.Selection<d3.BaseType, unknown, SVGGElement, unknown>>();
	// const _link = useRef<d3.Selection<d3.BaseType, unknown, SVGGElement, unknown>>();


	_createWiki.current = async function() {
		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}:${process.env.NEXT_PUBLIC_API_PORT}/wiki/create`, {
				method: "POST",
				credentials: "include"
			}).then(res => res.json());
			if (!res.success) {
				ToastWraper("error", res.message, "/");
				return;
			}
			const newWiki = {
				id: res.data.id,
				value: res.data.value
			};
			_wikies.current.push(newWiki);
			_update.current(_wikies.current, _relations.current);
			setCurrentWiki(newWiki);
			ToastWraper("success", "생성되었습니다.")
		} catch {
			ToastWraper("error", "서버가 아파요 :(", "/");
		}
	}

	_deleteWiki.current = async function (id: number) {
		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}:${process.env.NEXT_PUBLIC_API_PORT}/wiki/remove`, {
				method: "DELETE",
				credentials: "include",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({ id: id })
			}).then(res => res);

			if (res.status === 500) {
				ToastWraper("error", "서버가 아파요 :(");
				return;
			}

			_wikies.current.splice(_wikies.current.findIndex(wiki => wiki.id === id), 1);
			for(let index = _relations.current.findIndex(relation => relation.source === id || relation.target === id); index !== -1; index = _relations.current.findIndex(relation => relation.source === id || relation.target === id)) {
				_relations.current.splice(index, 1);
			}
			_update.current(_wikies.current, _relations.current);
			setCurrentWiki(null);
			ToastWraper("success", "삭제되었습니다.");
		} catch (err) {
			console.log(err);
			ToastWraper("error", "서버가 아파요 :(")
		}
	}

	_saveWiki.current = async function (id: number, body: { value?: string, content?: string }) {
		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}:${process.env.NEXT_PUBLIC_API_PORT}/wiki/save`, {
				method: "PATCH",
				credentials: "include",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					id: id,
					value: body.value || null,
					content: body.content || null
				})
			}).then(res => res.json());

			if (!res.success) {
				ToastWraper("error", res.message, "/");
				return;
			}

			if (body.value) {
				const wiki = _wikies.current.find(wiki => wiki.id === id);

				if (wiki) {
					wiki.value = body.value;
					_update.current(_wikies.current, _relations.current);
					d3.select(`#id${id}`).select("text").text(body.value);
				}
			}

			ToastWraper("success", "저장되었습니다.");

		} catch {
			ToastWraper("error", "서버가 아파요 :(");
		}
	}

	_connectWiki.current = async function (source: number, target: number) {
		_relations.current.push({
			source: source,
			target: target
		});
		_update.current?.(_wikies.current, _relations.current);
	}

	useEffect(() => {
		async function init() {
			try {
				const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}:${process.env.NEXT_PUBLIC_API_PORT}/wiki/find/all`, {
					credentials: "include"
				}).then(res => res.json());

				if (!res.success) {
					ToastWraper("error", res.message, "/");
					return;
				}
				_wikies.current = res.data.wikies;
				_relations.current = res.data.relations;
			} catch {
				ToastWraper("error", "서버가 아파요 :(", "/")
			}

			const container = document.getElementById("container");
			const width = container ? container.clientWidth : 0;
			const height = container ? container.clientHeight : 0;

			const color = d3.scaleOrdinal(d3.schemeCategory10);

			const svg = d3.select("#container").append("svg")
				.attr("width", width)
				.attr("height", height)
				.attr("viewBox", [-width / 2, -height / 2, width, height]);

			const simulation = d3.forceSimulation()
				.force("charge", d3.forceManyBody().strength(-500))
				.force("link", d3.forceLink().id((d: any) => d.id).distance(10))
				.force("x", d3.forceX())
				.force("y", d3.forceY())
				.on("tick", ticked);

			let link = svg.append("g")
				.attr("stroke", "#000")
				.attr("stroke-width", 1)
				.attr("stroke-opacity", 0.2)
				.selectAll("line");

			let node = svg.append("g")
				.selectAll("g");

			function ticked() {
				node
					.selectAll("circle")
					.attr("cx", (d: any) => d.x)
					.attr("cy", (d: any) => d.y);

				node
					.selectAll("text")
					.attr("x", (d: any) => d.x + 3)
					.attr("y", (d: any) => d.y + 3);

				link
					.attr("x1", (d: any) => d.source.x)
					.attr("y1", (d: any) => d.source.y)
					.attr("x2", (d: any) => d.target.x)
					.attr("y2", (d: any) => d.target.y);
			}

			function dragstarted(event: any) {
				if (!event.active) simulation.alphaTarget(0.3).restart();
				event.subject.fx = event.subject.x;
				event.subject.fy = event.subject.y;
			}

			function dragged(event: any) {
				event.subject.fx = event.x;
				event.subject.fy = event.y;
			}

			function dragended(event: any) {
				if (!event.active) simulation.alphaTarget(0);
				event.subject.fx = null;
				event.subject.fy = null;
			}

			_update.current = function (nodes, links) {

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
						g.attr("id", d => `id${d.id}`);
						g.append("circle")
							.attr("r", 8)
							.attr("fill", d => color(d.id));
						g.append("text")
							.text(d => d.value)
							.attr("class", "fill-white")
							.attr("font-size", "1.5em")
							.style("stroke", "gray")
							.style("stroke-width", 1);
						return g;
					})
					.on("mouseover", (e, d) => {
						link.style("stroke-opacity", (l) => d === l.source || d === l.target ? 1 : 0.05);
						link.style("stroke-width", 2);
					})
					.on("mouseout", d => {
						link.style("stroke-opacity", 0.2);
						link.style("stroke-width", 1);
					})
					.on("click", (e, d) => {
						const newWiki = {
							id: d.id,
							value: d.value
						};
						setCurrentWiki(newWiki);
					})
					.call(
						d3.drag()
							.on("start", dragstarted)
							.on("drag", dragged)
							.on("end", dragended)
					);

				link = link
					.data(links, d => `${d.source.id}\t${d.target.id}`)
					.join("line");
			}

			_update.current(_wikies.current, _relations.current);
			window.addEventListener("resize", () => {
				const container = document.getElementById("container");
				const width = container ? container.clientWidth : 0;
				const height = container ? container.clientHeight : 0;

				svg
					.attr("width", width)
					.attr("height", height)
					.attr("viewBox", [-width / 2, -height / 2, width, height]);
			})
		}
		init();
	}, [])


	return (
		<div id="container" className="relative flex w-full h-full bg-gray-100 bg-gradient-to-tr">
		</div>
	)
}
