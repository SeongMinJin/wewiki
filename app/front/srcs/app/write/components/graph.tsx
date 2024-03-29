// @ts-nocheck
"use client"

import * as d3 from "d3"
import { Dispatch, MouseEvent, MutableRefObject, SetStateAction, useEffect, useRef, useState } from "react";
import { Relation, Wiki } from "../page";
import { ToastWraper } from "@/app/components/main";


export default function Graph({
	currentWiki,
	setCurrentWiki,
	setDisableDeleteButton,
	_createWiki,
	_saveWiki,
	_deleteWiki,
	_connectWiki,
	_disconnectWiki,
	_connectQueue,
	_disconnectQueue,
	_wikies
}: {
	currentWiki: Wiki | null,
	setCurrentWiki: Dispatch<SetStateAction<Wiki | null>>,
	setDisableDeleteButton: Dispatch<SetStateAction<boolean>>,
	_createWiki: MutableRefObject<(() => Promise<void>) | undefined>,
	_saveWiki: MutableRefObject<((id: number, body: { value?: string, content?: string }) => Promise<void>) | undefined>,
	_deleteWiki: MutableRefObject<((id: number) => Promise<void>) | undefined>,
	_connectWiki: MutableRefObject<((source: number, target: number) => Promise<void>) | undefined>,
	_disconnectWiki: MutableRefObject<((source: number, target: number) => Promise<void>) | undefined>,
	_connectQueue: MutableRefObject<Relation[]>,
	_disconnectQueue: MutableRefObject<Relation[]>,
	_wikies: MutableRefObject<Wiki[]>
}
) {
	// const _wikies = useRef<Wiki[]>([]);
	const _relations = useRef<Relation[]>([]);
	const _update = useRef<(nodes, links) => void>();
	// const _currentWiki = useRef<Wiki>();
	// const _svg = useRef<d3.Selection<d3.BaseType, unknown, HTMLElement, any>>();
	// const _simulation = useRef<d3.Simulation<d3.SimulationNodeDatum, undefined>>();
	// const _node = useRef<d3.Selection<d3.BaseType, unknown, SVGGElement, unknown>>();
	// const _link = useRef<d3.Selection<d3.BaseType, unknown, SVGGElement, unknown>>();


	_createWiki.current = async function () {
		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}:${process.env.NEXT_PUBLIC_API_PORT}/wiki/create`, {
				method: "POST",
				credentials: "include",
			}).then(res => res.json());
			if (!res.success) {
				ToastWraper("error", res.message, "/");
				return;
			}
			_wikies.current.push(res.data);
			_update.current(_wikies.current, _relations.current);
			setCurrentWiki(res.data);
			ToastWraper("success", "생성되었습니다.")
		} catch {
			ToastWraper("error", "서버가 아파요 :(", "/");
		}
	}

	_deleteWiki.current = async function (id: number) {
		if (_relations.current.find(relation => relation.source === id || relation.target === id)) {
			ToastWraper("warn", "위키 관계를 전부 삭제해주세요.");
			return;
		}

		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}:${process.env.NEXT_PUBLIC_API_PORT}/wiki/remove`, {
				method: "DELETE",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",

				},
				body: JSON.stringify({ id: id })
			}).then(res => res);

			if (res.status === 500) {
				ToastWraper("error", "서버가 아파요 :(");
				return;
			}

			_wikies.current.splice(_wikies.current.findIndex(wiki => wiki.id === id), 1);
			for (let index = _relations.current.findIndex(relation => relation.source === id || relation.target === id); index !== -1; index = _relations.current.findIndex(relation => relation.source === id || relation.target === id)) {
				_relations.current.splice(index, 1);
			}
			_update.current(_wikies.current, _relations.current);
			setCurrentWiki(null);
			ToastWraper("success", "삭제되었습니다.");
		} catch (err) {
			ToastWraper("error", "서버가 아파요 :(")
		}
	}

	_saveWiki.current = async function (id: number, body: { value?: string, content?: string }) {
		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}:${process.env.NEXT_PUBLIC_API_PORT}/wiki/save`, {
				method: "PATCH",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",

				},
				body: JSON.stringify({
					id: id,
					value: body.value || null,
					content: body.content || null,
					connectQueue: _connectQueue.current,
					disconnectQueue: _disconnectQueue.current
				})
			}).then(res => {

				if (res.status === 404) {
					ToastWraper("error", "존재하지 않는 위키입니다.");
				}

				if (res.status === 401) {
					ToastWraper("error", "로그인 해주세요.", "/");
				}

				return res.json()
			});

			if (!res.success) {
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
			setCurrentWiki({...currentWiki, updatedAt: res.data});
			setDisableDeleteButton(false);
			_connectQueue.current = [];
			_disconnectQueue.current = [];
			ToastWraper("success", "저장되었습니다.");

		} catch {
			ToastWraper("error", "서버가 아파요 :(");
		}
	}

	_connectWiki.current = function (source: number, target: number) {

		if (isNaN(source)) {
			return;
		}
		
		if (isNaN(target)) {
			return;
		}
		/**
		 * 이미 연결되어 있는지 확인
		 */
		if (_relations.current.find(relation => relation.source === source && relation.target === target)) {
			return;
		}

		/**
		 * disconnect Queue에 있는지 확인
		 * disconnect Queue에 있으면 여기서 지워준고
		 * disconnect Queue에 없으면 connect Queue에 넣어주고
		 */
		const index = _disconnectQueue.current.findIndex(relation => relation.source === source && relation.target === target)
		if (index !== -1) {  
			_disconnectQueue.current.splice(index, 1);
		} else {
			_connectQueue.current.push({
				source: source,
				target: target
			});
		}
		_relations.current.push({
			source: source,
			target: target
		});
		_update.current(_wikies.current, _relations.current);

		// try {
		// 	const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}:${process.env.NEXT_PUBLIC_API_PORT}/wiki/connect`, {
		// 		method: "POST",
		// 		credentials: "include",
		// 		headers: {
		// 			"Content-Type": "application/json",

		// 		},
		// 		body: JSON.stringify({
		// 			source: source,
		// 			target: target
		// 		})
		// 	}).then(res => {
		// 		if (res.status === 404) {
		// 			return res.json();
		// 		}

		// 		if (res.status === 401) {
		// 			ToastWraper("error", "로그인 해주세요.", "/");
		// 			return res.json();
		// 		}

		// 		if (res.status === 500) {
		// 			ToastWraper("error", "서버가 아파요 :(", "/");
		// 		}

		// 		return res.json();
		// 	});

		// 	if (res.success) {
		// 		_relations.current.push({
		// 			source: source,
		// 			target: target
		// 		});
		// 		_update.current?.(_wikies.current, _relations.current);
		// 		return;
		// 	}

		// } catch {
		// 	ToastWraper("error", "서버가 아파요 :(");
		// }
	}

	_disconnectWiki.current = function (source: number, target: number) {
		if (isNaN(source)) {
			return;
		}
		
		if (isNaN(target)) {
			return;
		}
		/**
		 * disconnect 이벤트가 제일 마지막 mention 요소에만 적용될 수 있게 확인
		 */
		if (document.querySelectorAll(`[data-id="${target}"]`).length) {
			return;
		}

		/**
		 * 이미 연결이 끊겨있는지 확인
		 * 연결되어있는 상태라면 끊어줌
		 */
		const index = _relations.current.findIndex(relation => relation.source === source && relation.target === target);

		if (index === -1) {
			return;
		}

		/**
		 * connect Queue에 등록되어있으면 connect Queue를 삭제해주고
		 * 아니면 disconnect Queue에 새로 등록
		 */
		const connectQueueIndex = _connectQueue.current.findIndex(relation => relation.source === source && relation.target === target);
		if (connectQueueIndex !== -1) {
			_connectQueue.current.splice(connectQueueIndex, 1);
		} else {
			_disconnectQueue.current.push({
				source: source,
				target: target
			});
		}

		_relations.current.splice(index, 1);
		_update.current(_wikies.current, _relations.current);
		// try {
		// 	const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}:${process.env.NEXT_PUBLIC_API_PORT}/wiki/disconnect`, {
		// 		method: "DELETE",
		// 		credentials: "include",
		// 		headers: {
		// 			"Content-Type": "application/json",

		// 		},
		// 		body: JSON.stringify({
		// 			source: source,
		// 			target: target
		// 		})
		// 	}).then(res => res);

		// 	if (res.status === 404) {
		// 		return;
		// 	}

		// 	if (res.status === 401) {
		// 		ToastWraper("error", "로그인 해주세요.", "/");
		// 		return;
		// 	}

		// 	if (res.status === 500) {
		// 		ToastWraper("error", "서버가 아파요 :(", "/");
		// 		return;
		// 	}

		// 	_relations.current.splice(index, 1);
		// 	_update.current?.(_wikies.current, _relations.current);

		// } catch {
		// 	ToastWraper("error", "서버가 아파요 :(");
		// }
	}


	useEffect(() => {
		async function init() {
			try {
				const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}:${process.env.NEXT_PUBLIC_API_PORT}/wiki/find/all`, {
					credentials: "include",
					headers: {
					}
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
							value: d.value,
							hd: d.hd,
							createdAt: d.createdAt,
							updatedAt: d.updatedAt
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
