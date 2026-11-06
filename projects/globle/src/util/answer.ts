import { Country } from "../lib/country";
import { today } from "./dates";

const countryData: Country[] = require("../data/country_data.json").features;

countryData.sort((a, b) => {
  return a.properties.FLAG[1].localeCompare(b.properties.FLAG[1]);
});

function generateKeyNew(list: any[], day: string) {
  const [year, month, date] = day.split("-");
  const dayCode = Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(date));
  const SHUFFLE_KEY = process.env.REACT_APP_SHUFFLE_KEY || "1";
  const key = Math.floor(dayCode / parseInt(SHUFFLE_KEY + "5")) % list.length;
  return key;
}

function randomDate() {
	const today = new Date();
	var oneYearFromNow = new Date();
	oneYearFromNow.setFullYear(today.getFullYear() + 1);

	const randDate = new Date(today.getTime() + Math.random() * (oneYearFromNow.getTime()-today.getTime()));
	return randDate.toLocaleDateString("en-CA");
}

const key = generateKeyNew(countryData, randomDate());

export const answerCountry = countryData[key];
export const answerName = answerCountry.properties.NAME;
