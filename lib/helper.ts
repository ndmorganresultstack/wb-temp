import { themeBalham } from "ag-grid-community";

export function roundToTwoDecimals(num: number): number {
	return Math.round(num * 100) / 100;
}

// to use myTheme in an application, pass it to the theme grid option
export const wbTheme = themeBalham.withParams({
	columnBorder: true,
	headerBackgroundColor: "#362B51",
	headerTextColor: "#FFFFFF",
	spacing: 1,
	fontFamily: {
		googleFont: "Roboto Condensed",
	},
	headerFontFamily: {
		googleFont: "Roboto Condensed",
	},
	pinnedRowFontWeight: "bold",
	pinnedSourceRowFontWeight: "bold",
	pinnedRowTextColor: "#000000",
});
