// THIS FUNCTION SERVES TO MAKE TIMES OF SPEEDRUN READABLE

module.exports = function run_time(time) {
	time = time.replace("PT", "")
	if (time.indexOf("H") != -1) {time = time.charAt(time.indexOf("H") + 2) == "M" ? time.replace("H", ":0") : time.replace("H", ":")}
	if (time.indexOf("M") != -1) {time = time.charAt(time.indexOf("M") + 2) == "." || time.charAt(time.indexOf("M") + 2) == "S" ? time.replace("M", ":0") : time.charAt(time.indexOf("M") + 1) == "" ? time.replace("M", ":00") : time.replace("M", ":")}
	time = time.replace("S", "")
	return time
}
