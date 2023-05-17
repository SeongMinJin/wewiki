'use client'

import { KeyboardEvent, MouseEvent } from "react";


export default function Note() {
	
	const Enter = () => {
		const note = document.getElementById('note');
		const newP = document.createElement('pre');
		newP.classList.add('cursor-text');
		newP.innerText = 'Hello';
		newP.addEventListener('click', function(e) {
			e.stopPropagation();
			this.focus();
			console.log(this);
		})
		newP.addEventListener('keydown' , function(e) {
			console.log('asdasd');
		})
		note?.appendChild(newP);
	}

	const Backspace = () => {
		console.log('Backspace');
	}

	const Type = (e: KeyboardEvent | KeyboardEvent) => {
		if (e.key === 'Enter') {
			Enter();
			return;
		}

		if (e.key === 'Backspace') {
			Backspace();
			return;
		}

	}


	const Focus = (e: MouseEvent) => {
		console.log(e.target);
	}

	return (
		<div tabIndex={0} id="note" className="relative w-full h-full overflow-y-auto break-all mb-8 p-4">
			<p>asdasdas</p>
		</div>
	);
}