
// RightPanel component to display on the right half of the page
export interface RightPanelProps {
  children?: React.ReactNode; // Allow adding content later
}

export function RightPanel({ children }: RightPanelProps) {
  return (
    <div className="flex-1 bg-gray-100 rounded-lg p-4 h-full overflow-y-auto">
      {children ? (
        children
      ) : (
        <div className="text-gray-500 text-sm">
          Nothing Here
        </div>
      )}
    </div>
  );
}