import Image from "next/image";

export default function Section() {
	const post = [
		{
			id: '1',
			path: '/1.JPG',
			title: '부산에 초밥먹으러 갔어요',
			content: '이모랑 같이 부산에 초밥집에 갔는데 진짜 맛있더라',
			date: new Date(Date.now()),
			author: 'seojin'
		},
		{
			id: '2',
			path: '/2.JPG',
			title: '아는 동생이랑 이태원에 갔다',
			content: '피자를 테이크아웃해서 맥주랑 마시는데 맥주가 진짜 기가막히더라',
			date: new Date(Date.now()),
			author: 'seojin'
		},
		{
			id: '3',
			path: '/3.JPG',
			title: 'ㅋㅋ 코드 리뷰',
			content: '아는 동생이 철학자 문제 코드 리뷰좀 해달라고해서 해주는데 갑자기 사진을 찍는..',
			date: new Date(Date.now()),
			author: 'seojin'
		},
		{
			id: '4',
			path: '/4.JPG',
			title: '부산에서 친구들이랑 스티커사진',
			content: '막간을 이용해서 스티커 사진을 찍었다',
			date: new Date(Date.now()),
			author: 'seojin'
		},
		{
			id: '5',
			path: '/5.JPG',
			title: '펜션 놀러갔다가 찍은 사진인데 너무 잘 나왔네',
			content: '재밌었는데, 또 놀러가고 싶다',
			date: new Date(Date.now()),
			author: 'seojin'
		},
		{
			id: '6',
			path: '/6.JPG',
			title: '펜션 단체샷',
			content: '다같이 단체샷을 찍었다. 뒤에 날씨가 너무 좋았다.',
			date: new Date(Date.now()),
			author: 'seojin'
		},
		{
			id: '7',
			path: '/7.JPG',
			title: '낮술 ㅋ',
			content: '갑자기 낮술 하자고 해서 나도 모르게 따라갔다 ㅋㅋㅋ',
			date: new Date(Date.now()),
			author: 'seojin'
		},
	];

	return (
		<ul className="grid gap-8 place-items-stretch phone:grid-cols-2 tablet:grid-cols-3 laptop:grid-cols-4 desktop:grid-cols-5">
			{
				post.map(elem => (
					<li id={elem.id}>
						<Post path={elem.path} title={elem.title} content={elem.content} date={elem.date} author={elem.author} />
					</li>
				))
			}
		</ul>
	)
}


function Post({
	path,
	title,
	content,
	date,
	author
}: {
	path: string,
	title: string,
	content: string,
	date: Date,
	author: string,
}) {
	return (
		<div className="font-noto shadow hover:-translate-y-3 rounded duration-500 cursor-pointer">
			<Image
				src={path}
				width={600}
				height={600}
				style={{
					objectFit: 'cover',
					aspectRatio: '16 / 9',
				}}
				className="rounded-t"
				alt="Image of Thumbnail"
			/>
			<div className="p-3">
				<div>
					<h4 className="text-[100%] font-medium">{title}</h4>
					<p className="text-[80%] line-clamp-3 opacity-70 text-ellipsis leading-5 min-h-[3.75rem]">{content}</p>
				</div>
				<div>
					<p className="text-[80%] opacity-50">{date.getFullYear()}년 {date.getMonth()}월 {date.getDate()}일</p>
				</div>
			</div>
			<div className="p-4 border-t flex gap-x-2 items-center">
				<Image
				src="/건빵.png"
				width={25}
				height={25}
				alt="Image of author's avatar"
				/>
				<p className="text-[80%]">
					<span className="opacity-50">by&nbsp;</span>
					{author}
				</p>
			</div>
		</div>
	)
}

