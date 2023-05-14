import Nav from "./nav"
import Section from "./section"

export default function Main() {
	return (
		<div className="w-screen min-w-[300px] min-h-screen flex justify-center px-6">
			<div className="w-full tablet:w-[1024px] laptop:w-[1440px] desktop:w-[1920px]">
				<Nav />
				<Section />
			</div>
		</div>
	)
}