#!/usr/bin/env node

import moment from 'moment-timezone'

import fetch from 'node-fetch'

import minimist from 'minimist'

const args = minimist(process.argv.slice(2))

const help = args.h || 1
var north = args.n || args.s
var east = args.e || args.w
var timezone = args.z
var day = args.d || 1
var json = args.j

if (help !== 1) {
	console.log("Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE");
	console.log("    -h            Show this help message and exit.");
	console.log("    -n, -s        Latitude: N positive; S negative.");
	console.log("    -e, -w        Longitude: E positive; W negative.");
	console.log("    -z            Time zone: uses tz.guess() from moment-timezone by default.");
	console.log("    -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.");
	console.log("    -j            Echo pretty JSON from open-meteo API and exit.");
	process.exit(0);
}
if (typeof timezone == 'undefined') {
	timezone = moment.tz.guess();
}

if (json) {
	const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' + north + '&longitude=' + east + '&daily=weathercode&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph&timezone=' + timezone + '&past_days=1');
	  var json_data = await response.json();
	  json_data.latitude = parseFloat((json_data.latitude).toFixed(3));
	  json_data.longitude = parseFloat((json_data.longitude).toFixed(3));
	  console.log(json_data);
	  process.exit(0);
}

const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' + north + '&longitude=' + east + '&hourly=temperature_2m,windspeed_10m,winddirection_10m&daily=weathercode,precipitation_hours&current_weather=true&timezone=' + timezone + '&past_days=' + day);
const data = await response.json();

if (day == 0) {
	  console.log("It is raining " + data.daily.precipitation_hours[0] + " hours today.")
} else if (day > 1) {
	  console.log("It is raining " + data.daily.precipitation_hours[day] + "in " + day + " days.")
} else {
	  console.log("It is raining " + data.daily.precipitation_hours[1] + " hours tomorrow.")
}
