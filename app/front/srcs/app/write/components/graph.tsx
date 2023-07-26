import * as d3 from "d3"
import { Dispatch, MouseEvent, MutableRefObject, SetStateAction, useEffect, useRef, useState } from "react";
import { Relation, Wiki } from "../page";
import { ToastWraper } from "@/app/components/main";


export default function Graph({
	setCurrentWiki,
	_createWiki,
	_saveWiki,
	_closeWiki,
}: {
	setCurrentWiki: Dispatch<SetStateAction<Wiki | null>>,
	_createWiki: MutableRefObject<(() => Promise<void>) | undefined>
	_saveWiki: MutableRefObject<((id: number, title: string, content: any) => Promise<void>) | undefined>
	_closeWiki: MutableRefObject<(() => void) | undefined>
}
) {
	const _wikies = useRef<Wiki[]>([]);
	const _relations = useRef<Relation[]>([]);
	const _currentWiki = useRef<Wiki>();
	const _svg = useRef<d3.Selection<d3.BaseType, unknown, HTMLElement, any>>();
	const _tooltip = useRef<d3.Selection<HTMLDivElement, unknown, HTMLElement, any>>();
	const _simulation = useRef<d3.Simulation<d3.SimulationNodeDatum, undefined>>();
	const _node = useRef<d3.Selection<d3.BaseType, unknown, SVGGElement, unknown>>();
	const _link = useRef<d3.Selection<d3.BaseType, unknown, SVGGElement, unknown>>();
	const _drag = useRef<d3.DragBehavior<Element, unknown, unknown>>();

	function update(nodes: any, links: any) {
		const old = new Map(_node.current?.data().map((d: any) => [d.id, d]));
		nodes = nodes.map((d: any) => Object.assign(old.get(d.id) || {}, d));
		links = links.map((d: any) => Object.assign({}, d));

		_simulation.current?.nodes(nodes);
		_simulation.current?.alpha(1).restart();

		_node.current = _node.current?.data(nodes, (d: any) => d.id)
			.join((enter: any) => enter
				.append("circle")
				.attr("r", 8)
				.attr("id", (d: any) => `id${d.id}`)
				.attr("fill", "orange"))
			.on("click", (event: MouseEvent, node: any) => {
				if (_currentWiki.current) {
					d3.select(`#id${_currentWiki.current.id}`).attr("fill", "orange");
				}
				const newWiki = {
					"id": node.id,
					"title": node.title
				}
				_currentWiki.current = newWiki;
				setCurrentWiki(newWiki);
				d3.select(`#id${node.id}`).attr("fill", "red");
			})
			.on("mouseover", (event: MouseEvent, node: any) => {
				_tooltip.current?.style("opacity", 1);
				d3.select(`#id${node.id}`).style("stroke", "black").style("stroke-width", 2);
			})
			.on("mousemove", (event: MouseEvent, node: any) => {
				_tooltip.current?.
				style("left", `${event.clientX}px`)
				.style("top", `${event.clientY}px`)
				.html(node.id);
			})
			.on("mouseleave", (event: MouseEvent, node: any) => {
				d3.select(`#id${node.id}`).style("stroke", "none");
			})
			// @ts-ignore
			.call(_drag.current);

		_link.current = _link.current?.data(links, (d: any) => `${d.source.id}\t${d.target.id}`)
			.join("line");
	}

	_createWiki.current = async function () {
		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}:${process.env.NEXT_PUBLIC_API_PORT}/wiki/create`, {
				method: "post",
				credentials: "include",
			}).then(res => res.json());

			if (res.success) {

				const newWiki = {
					"id": res.data.id,
					"title": res.data.title
				}
				_wikies.current.push(newWiki);
				update(_wikies.current, _relations.current);

				d3.select(`#id${newWiki.id}`).attr("fill", "red");
				d3.select(`#id${_currentWiki.current?.id}`).attr("fill", "orange");
				_currentWiki.current = newWiki;
				setCurrentWiki(newWiki);

			} else {
				ToastWraper("error", res.message);
			}

		} catch (err) {
			ToastWraper("error", "서버가 아파요 :(");
		}

	}

	_saveWiki.current = async function (id: number, title: string, content: any) {

		if (!title) {
			ToastWraper("warn", "제목을 입력해주세요.");
			return;
		}


		try {
			const body = {
				id: id,
				title: title,
				content: content
			};

			const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}:${process.env.NEXT_PUBLIC_API_PORT}/wiki/save`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify(body),
			}).then(res => res.json());

			if (res.success) {
				const wiki = _wikies.current.find(wiki => wiki.id === id);
				if (wiki) {
					wiki.title = title;
				};
				ToastWraper("success", "저장 되었습니다 :)")
				update(_wikies.current, _relations.current);
				localStorage.removeItem(`${id}`);
			} else {
				ToastWraper("error", res.message, "/");
			}

		} catch (err) {
			ToastWraper("error", "서버가 아파요 :(");
		}
	}

	_closeWiki.current = function() {

		d3.select(`#id${_currentWiki.current?.id}`).style("fill", "orange");
		_currentWiki.current = undefined;
		setCurrentWiki(null);
	}

	useEffect(() => {
		_svg.current = d3.select("#svg");
		_tooltip.current = d3.select("#graph").append("div")
			.style("opacity", 0)
			.style("background-color", "white")
			.style("border", "solid")
			.style("border-width", "2px")
			.style("border-radius", "5px")
			.style("padding", "5px")
			.style("position", "absolute")
			.style("z-index", 10)

		_simulation.current = d3.forceSimulation()
			.force("charge", d3.forceManyBody().strength(-50))
			.force("collide", d3.forceCollide(20))
			.force("x", d3.forceX())
			.force("y", d3.forceY())
			.on("tick", ticked);

		_node.current = _svg.current.append("g").selectAll("circle");
		_link.current = _svg.current.append("g").selectAll("line");

		function ticked() {
			_node.current?.attr("cx", (d: any) => d.x).attr("cy", (d: any) => d.y);
			_link.current?.attr("x1", (d: any) => d.source.x).attr("y1", (d: any) => d.source.y).attr("x2", (d: any) => d.target.x).attr("y2", (d: any) => d.target.y);
		}

		function dragstarted(event: any) {
			if (!event.active) _simulation.current?.alphaTarget(0.3).restart();
			event.subject.fx = event.subject.x;
			event.subject.fy = event.subject.y;
		}

		function dragged(event: any) {
			event.subject.fx = event.x;
			event.subject.fy = event.y;
		}

		function dragended(event: any) {
			if (!event.active) _simulation.current?.alphaTarget(0);
			event.subject.fx = null;
			event.subject.fy = null;
		}

		_drag.current = d3.drag()
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
					_wikies.current = res.data.wikies;
					_relations.current = res.data.relations;

					const WIDTH = document.getElementById("graph")?.clientWidth || 0;
					const HEIGHT = document.getElementById("graph")?.clientHeight || 0;
					_svg.current?.attr("viewBox", [-WIDTH / 2, -HEIGHT / 2, WIDTH, HEIGHT]);

				} else {
					ToastWraper("error", res.message, "/");
				}
			} catch (err) {
				ToastWraper("error", "서버가 아파요 :(");
			}

			update(_wikies.current, _relations.current);
		}


		init();
		window.addEventListener("resize", () => {
			const WIDTH = document.getElementById("graph")?.clientWidth || 0;
			const HEIGHT = document.getElementById("graph")?.clientHeight || 0;
			_svg.current?.attr("viewBox", [-WIDTH / 2, -HEIGHT / 2, WIDTH, HEIGHT]);
			_simulation.current?.restart();
		});

	}, [])

	return (
		<div id="graph" className="relative flex w-full h-full bg-gray-100 bg-gradient-to-tr">
			<svg id="svg"></svg>
		</div>
	)
}
