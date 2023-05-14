import Nav from "./nav"

export default function Main() {
	return (
		<div className="w-full flex justify-center px-6">
			<div className="w-full tablet:w-[1080px] laptop:w-[1440px] desktop:w-[1920px]">
				<Nav />
				{/* <Section></Section> */}
			</div>
		</div>
	)
}