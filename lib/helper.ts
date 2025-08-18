import { themeBalham } from "ag-grid-community";
import { Roboto_Condensed } from "next/font/google";

export function roundToTwoDecimals(num: number): number {
        return Math.round(num * 100) / 100;
}

 

import { themeQuartz } from 'ag-grid-community';

// to use myTheme in an application, pass it to the theme grid option
export const wbTheme = themeBalham
	.withParams({ 
        columnBorder: true, 
        headerBackgroundColor: "#0076CC",
        headerTextColor: "#FFFFFF",
        spacing: 1,
        fontFamily:{
                googleFont:"Roboto"
        }
    });
