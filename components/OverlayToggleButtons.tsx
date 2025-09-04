import { ListBulletIcon } from "@heroicons/react/24/solid";
import { SquaresPlusIcon } from "@heroicons/react/24/outline";

export function OverlayToggleButtons({
	showOverlay,
	setShowOverlay,
}: {
	showOverlay: boolean;
	setShowOverlay: (showOverlay: boolean) => void;
}) {
	return (
		<div className="flex gap-x-2 items-center justify-end">
			<button
				className="bg-gray-100 rounded-sm p-1 hover:bg-gray-200"
				style={{ backgroundColor: showOverlay ? undefined : "#4E357D66" }}
				onClick={() => setShowOverlay(false)}
			>
				<ListBulletIcon className="size-5" />
			</button>

			<button
				className="bg-gray-100 rounded-sm p-1 hover:bg-gray-200"
				style={{ backgroundColor: showOverlay ? "#4E357D66" : undefined }}
				onClick={() => setShowOverlay(true)}
			>
				<SquaresPlusIcon className="size-5" />
			</button>
		</div>
	);
}
