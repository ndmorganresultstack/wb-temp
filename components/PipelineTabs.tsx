import SearchIcon from "@/components/icons/SearchIcon";
import { Table } from "@/components/Overlay";
import { PlusIcon, StickyNote } from "lucide-react";



export function PropertyListTab() {
	return (
		<>
			<div className="flex gap-x-10 justify-between items-center -mb-4">
				<label className="relative flex items-center">
					<SearchIcon className="absolute left-2 size-4" />
					<input
						placeholder="Search for Property"
						className="border border-gray-200 rounded-xs py-1 text-sm pl-7 pr-2"
					/>
				</label>

				<button className="button button-solid text-sm flex items-center gap-x-1">
					<PlusIcon className="size-3" />
					Add Property
				</button>
			</div>
			<Table
				headerRow={[
					"Property ID",
					"Property Name",
					"Address",
					"Contact",
					"Phone",
					"Email",
					"Last Update",
				]}
				bodyRows={[
					[
						"001234",
						"Golden Moon Apts",
						"1233 Burberry Lane Cost City FL 0000",
						"Isabella Johnson",
						"555-555-5560",
						"example@gmail.com",
						"4/25/2024",
					],
					[
						"001234",
						"Golden Moon Apts",
						"1233 Burberry Lane Cost City FL 0000",
						"Isabella Johnson",
						"555-555-5560",
						"example@gmail.com",
						"4/25/2024",
					],
					[
						"001234",
						"Golden Moon Apts",
						"1233 Burberry Lane Cost City FL 0000",
						"Isabella Johnson",
						"555-555-5560",
						"example@gmail.com",
						"4/25/2024",
					],
					[
						"001234",
						"Golden Moon Apts",
						"1233 Burberry Lane Cost City FL 0000",
						"Isabella Johnson",
						"555-555-5560",
						"example@gmail.com",
						"4/25/2024",
					],
					[
						"001234",
						"Golden Moon Apts",
						"1233 Burberry Lane Cost City FL 0000",
						"Isabella Johnson",
						"555-555-5560",
						"example@gmail.com",
						"4/25/2024",
					],
					[
						"001234",
						"Golden Moon Apts",
						"1233 Burberry Lane Cost City FL 0000",
						"Isabella Johnson",
						"555-555-5560",
						"example@gmail.com",
						"4/25/2024",
					],
					[
						"001234",
						"Golden Moon Apts",
						"1233 Burberry Lane Cost City FL 0000",
						"Isabella Johnson",
						"555-555-5560",
						"example@gmail.com",
						"4/25/2024",
					],
					[
						"001234",
						"Golden Moon Apts",
						"1233 Burberry Lane Cost City FL 0000",
						"Isabella Johnson",
						"555-555-5560",
						"example@gmail.com",
						"4/25/2024",
					],
				]}
			/>
		</>
	);
}

export function AttachmentsTab() {
	return (
		<>
			<div className="flex gap-x-10 justify-between items-center -mb-4">
				<label className="relative flex items-center">
					<SearchIcon className="absolute left-2 size-4" />
					<input
						placeholder="Search for Attachment"
						className="border border-gray-200 rounded-xs py-1 text-sm pl-7 pr-2"
					/>
				</label>

				<button className="button button-solid text-sm flex items-center gap-x-1">
					<PlusIcon className="size-3" />
					Add Attachment
				</button>
			</div>

			<Table
				headerRow={["Agreements", "Date", "Type of Doc", "Office Location", "Added By"]}
				bodyRows={[
					[
						"Closingstatement.pdf",
						"6/25/25",
						"Disclosure Statements",
						"Atlanta Office",
						"Josah Schatterman",
					],
					[
						"LeaseAgreement.pdf",
						"6/25/25",
						"Disclosure Statements",
						"Atlanta Office",
						"Josah Schatterman",
					],
					[
						"InspectionReport.pdf",
						"6/25/25",
						"Disclosure Statements",
						"Atlanta Office",
						"Josah Schatterman",
					],
					[
						"SalesContract.docx",
						"6/25/25",
						"Disclosure Statements",
						"Atlanta Office",
						"Josah Schatterman",
					],
					[
						"PropertyAppraisal.pdf",
						"6/25/25",
						"Disclosure Statements",
						"Atlanta Office",
						"Josah Schatterman",
					],
				]}
			/>
		</>
	);
}

export function CallNotesTab() {
	return (
		<>
			<div className="px-2 py-4 flex flex-col border rounded-md border-gray-200 gap-y-4">
				<div className="flex gap-x-2 items-center">
					<StickyNote className="size-5" />
					<span className="text-gray-400 font-semibold">Notes (2)</span>
				</div>

				<div
					className="flex flex-col overflow-y-scroll max-h-[200px]"
					style={{ scrollbarWidth: "thin" }}
				>
					<NoteItem />
					<NoteItem />
					<NoteItem />
					<NoteItem />
					<NoteItem />
					<NoteItem />
					<NoteItem />
				</div>
			</div>

			<div className="flex gap-x-2 items-center">
				<button className="button-solid rounded-full px-7 text-sm py-2 font-semibold">
					Phone Call
				</button>
				<button className="bg-gray-200 rounded-full px-7 text-sm py-2 font-semibold">
					Email
				</button>
				<button className="bg-gray-200 rounded-full px-7 text-sm py-2 font-semibold">
					Meeting
				</button>
				<button className="bg-gray-200 rounded-full px-7 text-sm py-2 font-semibold">
					Documents
				</button>
			</div>

			<div className="flex flex-col gap-y-2">
				<span>Add Note</span>
				<textarea
					className="bg-gray-200 rounded-md min-h-[200px] p-2"
					placeholder="Write your note here..."
				/>
				<button className="button button-outline ml-auto text-sm">Save Note</button>
			</div>
		</>
	);
}

function NoteItem() {
	return (
		<div className="flex flex-col gap-y-2 py-5">
			<div className="flex items-center gap-x-10">
				<b className="text-sm">Josiah Schatterman</b>
				<span className="text-xs font-semibold text-gray-400">7/10/2025 3:00PM</span>
			</div>

			<span className="text-sm">
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vulputate ex in enim
				cursus malesuada. Ut pharetra, velit eu efficitur faucibus, massa dui tempus leo,
			</span>
		</div>
	);
}
