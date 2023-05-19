import Note from "./components/note"

export default function Write() {

	return (
		<form className="relative w-screen min-w-[350px] h-screen flex" action="">
			<div className="relative w-full h-full phone:pt-8 phone:px-12 pb-20 flex flex-col">
				<input autoFocus className="w-full font-noto font-semibold p-4 text-[250%] focus:outline-none" type="text" placeholder="제목을 입력하세요" />
				<div className="w-full p-4">
					<div className="mb-4 bg-black bg-opacity-70 w-16 h-[6px]"></div>
					<div className="border w-full h-16 p-4 mb-8">
						Tool Box
					</div>
				</div>

				{/* 글 작성 부분 */}
				<Note />

				<div className="absolute w-full h-fit left-0 bottom-0 z-10 flex justify-between shadow-2xl shadow-black font-noto text-lg px-4 py-4">
					<button className="py-2 px-4 hover:bg-gray-100 rounded-md">
						⬅ 나가기
					</button>
					<div className="flex gap-x-4">
						<button className="py-2 px-4 text-red-400 hover:bg-gray-100 rounded-md">
							임시저장
						</button>
						<button className="py-2 px-4 bg-red-300 text-white hover:bg-opacity-80  rounded-md">
							출간하기
						</button>
					</div>
				</div>
			</div>
			<div className="w-full p-12 hidden tablet:block bg-red-50 bg-opacity-70">
			</div>
		</form>
	)
}