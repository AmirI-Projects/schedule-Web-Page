//JavaScript Code V9.1
/*
--Added code in the webJavascript.js file--


/******************************************************************************************************
************************************	Golobal Variables Section   ***********************************
*******************************************************************************************************/
//current year
var cur_year = 0;
//current month in number
var cur_month = 0;
//current date
var cur_date = 0;
//current day of the week in number
var cur_dayofWe = 0;
//declearing and initializing the interval stat
var intv_stat = -1;
//This variable will contain the total minute of the current time
var curTimeMinutes = 0;
//set the miniute interval (every 15 min.) for timeTape, DateTape, and data table update 
const intv = 15;
//total number of interval ticks in the timeTape
const ticksTotal = 50;
//middile tick number
const midTick = 17;
//mid tick and time color code 
const midTickColor = "#FFDF01"
//Width of the hourly ticks
const wHrTick = "50%";
//width of the 1/2 hour ticks
const wHhTick = "30%";
//width of the 1/4 hour ticks
const wQrtTick = "13%";
//create a list of information for every ticks in timeTape
var ticksData = [];
//cuurent time font size for hourly ticks
const curFontH = "1.1vh";
//current time font size for smaller ticks
const curFonSt = "0.9vh";
//Tick height for the timeTape
const tickHeight = 1.3;
var xhr = null;
var dataReply = [];
var strTosend =
{
	'request': "updatexml",
	'date': "2023-11, MON  27",
	'timeRange': "230-630"
};
var strTosend_2 =
{
	'request': "B737",
	'startT': "1400,2023-12, SAT  23",
	'endT': "2200,2023-12, SAT  23"
};
var strTosend_3 =
{
	'request': "B787",
	'startT': "1400,2023-12, SAT  23",
	'endT': "2200,2023-12, SAT  23"
};
var strTosend_4 =
{
	'request': "Q400",
	'startT': "1400,2023-12, SAT  23",
	'endT': "2200,2023-12, SAT  23"
};
var strTosend_5 =
{
	'request': "Dash8FFS",
	'startT': "1400,2023-12, SAT  23",
	'endT': "2200,2023-12, SAT  23"
};
var strTosend_6 =
{
	'request': "allDevices",
	'startT': "1400,2023-12, SAT  23",
	'endT': "2200,2023-12, SAT  23"
};

/******************************************************************************************************
************************************	Left Main Header Section   ************************************
*******************************************************************************************************/

//Function for the clock Left Main Header

/***************************************************************
	   Function: function startTime()
	   
	Description: This function will display the current 
				 time and date on "clock" element id.
				 
		  Input: None.
		  
		 Output: clock element ID = hr + ":" + min + ":" + sec

***************************************************************/
function startTime()
{
	var today = new Date();
	var hr = today.getHours()
	var min = today.getMinutes();
	var sec = today.getSeconds();
	
	var ap = (hr < 12 ) ? "<span>AM</span>" : "<span>PM</span>"
	
	//Add Zero in front of numbers that are < 10
	
	hr = setZero(hr);
	min = setZero(min);
	sec = setZero(sec);
	
	//display the time on the clock IDed tag
	document.getElementById('clock').innerHTML = hr + ":" + min + ":" + sec;	
	
	//Code for displaying date
	var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	var curWeekDay = days[today.getDay()];
	cur_dayofWe = today.getDay();
	var curDay = today.getDate();
	cur_date = today.getDate();
	var curMonth = months[today.getMonth()];
	cur_month = today.getMonth();
	var curYear = today.getFullYear();
	cur_year = today.getFullYear();
	var date = curWeekDay+", "+curDay+" "+curMonth+" "+curYear;
	document.getElementById("date").innerHTML = date;
	

	var diradd = window.location.pathname;
	var newdir = diradd.substring(0, diradd.lastIndexOf('/'));

	intervalUpdate(hr, min);

	var time = setTimeout(function(){ startTime() }, 300);
	
}

/***************************************************************
	   Function: function setZero(num)
	   
	Description: This function will checks and sets zero's in
				 front of numbers that are less than 10.
				 
				 
		  Input: num;
		  
		 Output: variable number with zero in fron if less than 
				 10. (ex: 01, 00, 02, and so on)

***************************************************************/
function setZero(num)
{
	if(num < 10)
	{
		num = "0" + num;
	}
	
	return num;
}
/******************************************************************************************************
************************************	Left Main Body Section   **************************************
*******************************************************************************************************/

/*============================================================================

					The Working Code for getting xml data

=============================================================================*/

/******************************************************************************
*****************   Function For time Tape Starts Here   **********************
******************************************************************************/

/**********************************************************************
	   Function: function intervalUpdate(hr, min)
	   
	Description: This function will update the timeTape,
				 dateTape, and data table sections based on the 
				 change in intervals set in Golobalvariable section.	 
				 
				 
		  Input: hr, repersents the current hours
		  
				 min, repersents the current minutes				 
				 
		  
		 Output: non;
				 

***********************************************************************/
function intervalUpdate(hr, min)
{
	//new minutes value
	var newMin = 0;
	var dataReceived = "";
	var data_element = "";
	var vHight = window.innerHeight;
	var vWidth = window.innerWidth;
	//get all the elemts in the timeTape
	//const tTape_ele = document.getElementsByClassName("timeTape");
	
	if(Math.floor((min / intv)) != intv_stat)
	{
		intv_stat = Math.floor(min / intv);		
		
		//calculate the minutes based on the value of the interval 

		
		newMin = intv_stat * intv;
		updateTimeTape(hr, newMin);
				

		console.log("The Viewport Hight is: " + vHight + ", The Viewport Width is: " + vWidth);
	
		console.log("requestAllDeviceData function: " + requestAllDeviceData());
		console.log("The strTosend_6 is: " + strTosend_6);
		asyncGetData(requestAllDeviceData());

	}

	
	curTimeMinutes = (hr * 60) + min;
	
}

//============================================================> Test Functions <=======================================================

//async function delayfunc3000()
//{
//	await sleep(3000);
//	//console.log("delayfunc3000 is called");
//}
//
//async function delayfunc5000()
//{
//	await sleep(5000);
//	//console.log("delayfunc5000 is called");
//}
//
//function project(cI) {
//  setTimeout(function(){
//   // console.log("Delay function, 4000ms * : " + cI);
//  }, 4000 * cI );
//}
//
//function loadDoc() {
//	
//	//var xmlF = document.all("writersXML").XMLDocument;
//	//var parser= new DOMParser();
//	//var xmlDoc = parser.parseFromString(xmlF, "text/xml");
//	//
//	//console.log(xmlDoc.getElementsByTagName("week").nodeValue);
//	
//	
//  
//}
//
//function myFunction() {
//	
//
//}
//function fetchData() {
//    setTimeout(function () {
//        showxmlData();
//        // recursive call
//        //fetchData();
//    }, 3000);
//}
//
///*****************************************************************/



/***********************************************************************
	   Function: function updateTimeTape(hr, newmin)
	   
	Description: This function will update the timeTape based on
				 given new minutes and hour. This function also 
				 updates the ticksData array for tracking the h-position
				 and minutes value of every tick.
				 
		  Input: hr, repersents the current hours
		  
				 newmin, repersents the new interval minutes (increments of interval).				 
				 
		  
		 Output: non;
				 

************************************************************************/
function updateTimeTape(hr, newmin)
{	
	var tickTypeVal = wHrTick;
	var curtotalMin = (hr * 60) + newmin;
	var topTick = curtotalMin - ((midTick + 15) * intv);
	
	var tempElementWidth = 0;
	
	
	const rowElements = document.getElementsByClassName("tickRow");
	var rowHeight = rowElements[0].clientHeight;
	const timeTapeHpos = document.getElementsByClassName("leftMainColumn_body").clientHeight;
	//clear the ticksData array
	ticksData = [];

	var text2 = "";

	
	
	if (topTick < 0)
	{
		topTick = (24 * 60) + topTick;
	}
	
	for(var i = -15; i <= (rowElements.length); i++)
	{

		if (i >= 1)
		{	


			if(topTick > (24 * 60))
			{
				topTick = topTick - (24 * 60);
			}
			tickTypeVal = tickType(topTick);		
			
			if(tickTypeVal == wHrTick)
			{
				document.getElementById("tickRow" + i).style.width = wHrTick;						
				document.getElementById("tickTime" + i).innerHTML = Math.floor((topTick / 60)) + ":" + "00";
				tempElementWidth = wHrTick;
				
			}
			else if(tickTypeVal == wHhTick)
			{
				document.getElementById("tickRow" + i).style.width = wHhTick;
				document.getElementById("tickTime" + i).innerHTML = "";
				tempElementWidth = wHhTick;
			}
			else
			{
				document.getElementById("tickRow" + i).style.width = wQrtTick;
				document.getElementById("tickTime" + i).innerHTML = "";
				tempElementWidth = wQrtTick;
			}
			
			if(i == midTick)
			{
				document.getElementById("tickTime" + i).innerHTML = "";
				tempElementWidth = document.getElementById("tickRow" + i).style.width;
				if(tempElementWidth == wHrTick)
				{
					document.getElementById("curTimeOfTapeText").innerHTML = Math.floor((topTick / 60)) + ":" + "00";
					document.getElementById("curTimeOfTapeText").style.fontSize = curFontH;								
				}
				else
				{
					document.getElementById("curTimeOfTapeText").innerHTML = Math.floor((topTick / 60)) + ":" + newmin;
					document.getElementById("curTimeOfTapeText").style.fontSize = curFonSt;
				}
				
			}
		}
		
		updateTickData(i, topTick, tickHeight, curtotalMin);
		text2 += "The tick row count is: " + i + " is: " + tickTypeVal + " and tick minutes value is: " + ticksData[i+15].minutes + " The Tick position is: "+ ticksData[i+15].h_posi + " The Tick Month is: " + (ticksData[i+15].tMonth + 1) + " The Tick Date is: " + ticksData[i+15].tDate + " The Tick Week Day is: "+ ticksData[i+15].tDayOfWe+ " The Tick Year is: "+ ticksData[i+15].tYear + "<br>";
		topTick = topTick +  intv;		
		
	}

	document.getElementById("stat-3").innerHTML = text2;
}
/********************************************************************************
	   Function: function tickType(minC)
	   
	Description: This function will determine type of tick size
				 will be displayed on every tick row based on the 
				 given minute count (minC) Value.
				.				 
				 
		  Input: minC, This input repersents given minute count.		  				 
				 
		  
		 Output: result, The function will return wHrTick for hourly long tick,
						 the return value wHhTick is half-hour for mid size tick,
						 and value wQrtTick for quarter hour short tick.				 

********************************************************************************/
function tickType(minC)
{
	var result = "";
	var minVal = 0;
	var temptminC = minC;
	
	
	minVal = temptminC % 60;	
	
	if(minVal == 0)
	{
		result = wHrTick;
	}
	else
	{
		minVal = minVal / intv;
		
		if (minVal == 2)
		{
			result = wHhTick;
		}
		else
		{
			result = wQrtTick;
		}
	}

	return result;
}

/********************************************************************************
	   Function: function updateTickData(tIndex, minC, tH)
	   
	Description: This function will add structure data to ticksData array containig
				 minutes count and calculated position height based on the given 
				 given height of tick rows and tick index in the time tape.	.				 
				 
		  Input: tIndex, This input repersents tick index number.
				
				 minC, This input contains the minute count for the given tick.
				 
				 tH, This input contains the pixel height of tick row.
				 
				 curNewTime, This input repersents the current new time in minutes.
				 
		  
		 Output: none, The function will add structure data to ticksData array.						 				 

********************************************************************************/
function updateTickData(tIndex, minC, tH, curNewTime)
{
	var cTH = tIndex * tH;
	var getDate = getTickDate(tIndex, curNewTime, minC);
	var text = "";

		
	var tickdat = {
		minutes: minC,
		h_posi: cTH,
		tYear: getDate.year,
		tMonth: getDate.month,
		tDate: getDate.date,
		tDayOfWe: getDate.dayofWe,		
	};

	ticksData.push(tickdat);	
}

/********************************************************************************
	   Function: function getTickDate(indexT, curNewMin, minofT)
	   
	Description: This function will get the date information for a given tick.
				 This function will determine if the given tick must have today,
				 tomorrow or previous date information.
				 				 
				 
		  Input: indexT, This input repersents tick index number.
				
				 curNewMin, This input contains the minute count for current time.
				 				 
				 minofT, This input repersents the minute count for the current tick.
				 
		  
		 Output: dateT, The function will return structure of date information
				 for a given tick.						 				 

********************************************************************************/
function getTickDate(indexT, curNewMin, minofT)
{
	//var text = "";
	var dateT = {
		year: 0,
		month: 0,
		date: 0,
		dayofWe: 0,
	};
	
	
	if(minofT <= curNewMin)
	{
		if(indexT <= midTick)
		{			
			dateT.year = getCurrDate().c_year;
			dateT.month = getCurrDate().c_month;
			dateT.date = getCurrDate().c_date;
			dateT.dayofWe = getCurrDate().c_dofWe;
						
		}
		if(indexT > midTick)
		{
			dateT.year = getTomorrowDate().t_year;
			dateT.month = getTomorrowDate().t_month;
			dateT.date = getTomorrowDate().t_date;
			dateT.dayofWe = getTomorrowDate().t_doft;
		}
	}
	if(minofT > curNewMin)
	{
		if(indexT > midTick)
		{
			dateT.year = getCurrDate().c_year;
			dateT.month = getCurrDate().c_month;
			dateT.date = getCurrDate().c_date;
			dateT.dayofWe = getCurrDate().c_dofWe;
		}
		if(indexT < midTick)
		{
			dateT = getPreviousDate();
			dateT.year = getPreviousDate().p_year;
			dateT.month = getPreviousDate().p_month;
			dateT.date = getPreviousDate().p_date;
			dateT.dayofWe = getPreviousDate().p_dofp;
		}
	}

	return dateT;
}

/********************************************************************************
	   Function: function getCurrDate()
	   
	Description: This function will get the current date (in structure of numbers).				 
				 
		  Input: non.
				 
		  
		 Output: cDate, The function will return a structure consist of tomarrow's date. 						 				 

********************************************************************************/
function getCurrDate()
{
	var cDate = {
		
		c_year: cur_year,
		c_month: cur_month,
		c_date: cur_date,
		c_dofWe: cur_dayofWe,
		
	};
	
	return cDate;
}

/********************************************************************************
	   Function: function getTomorrowDate()
	   
	Description: This function will get the tomarrow's date (in structure of numbers).				 
				 
		  Input: non.
				 
		  
		 Output: tDate, The function will return a structure consist of tomarrow's date. 						 				 

********************************************************************************/
function getTomorrowDate()
{
	const tomorrow = new Date();
	
	var tDate = {
		
		t_year: 0,
		t_month: 0,
		t_date: 0,
		t_doft: 0,
		
	};
	
	tomorrow.setDate(new Date().getDate() + 1);
	
	tDate.t_year = tomorrow.getFullYear();
	tDate.t_month = tomorrow.getMonth();
	tDate.t_date = tomorrow.getDate();
	tDate.t_doft = tomorrow.getDay();
	
	return tDate;
}

/********************************************************************************
	   Function: function getPreviousDate()
	   
	Description: This function will get the previous date (in structure of numbers).				 
				 
		  Input: non.
				 
		  
		 Output: tDate, The function will return a structure consist of previous date. 						 				 

********************************************************************************/
function getPreviousDate()
{
	const previous = new Date();
	
	var pDate = {
		
		p_year: 0,
		p_month: 0,
		p_date: 0,
		p_dofp: 0,
		
	};
	
	previous.setDate(new Date().getDate() - 1);
	
	pDate.p_year = previous.getFullYear();
	pDate.p_month = previous.getMonth();
	pDate.p_date = previous.getDate();
	pDate.p_dofp = previous.getDay();
	

	return pDate;
}

/*****************************************************************************************************************
************************************	Client Server Comunication Code Section  *********************************
*****************************************************************************************************************/

/*******************************************************************************
	   Function: getXmlHttpRequestObject = function ()
	   
	   Description: The following function will will assign and XMLHttpRequest
					object to the getXmlHttpRequestObject if it is not already
					been created.
					
			Input: non,
			
			Output: xhr,   XMLHttpRequest object.
	

*******************************************************************************/
getXmlHttpRequestObject = function () {
    if (!xhr) {
        // Create a new XMLHttpRequest object 
        xhr = new XMLHttpRequest();
    }
    return xhr;
};

/*******************************************************************************
	   Function: function syncGetData(val)
	   
	   Description: The following function will send a request (JASON data) to the 
					client server synchronously and it will receive data from client
					server in array of JASON format.
					
			Input: val, JSON object containing the request, date and time.
			
			Output: xhr.responseText, This contains array of JASON data.
					Note: the xhr.responseText is used in JSON.parse() to parse the 
						  text format array in to acual array JSON data.	   
	

*******************************************************************************/
function syncGetData(val) 
{
	//var data_r = null;
    console.log("Send Request to Server Client...");
    xhr = getXmlHttpRequestObject();
    //=>xhr.onreadystatechange = dataCallback;
    // synchronous requests
    xhr.open("POST", "http://localhost:6969/data", false);
	xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    // Send the request over the network
    //xhr.send(JSON.stringify({"device": "Q400", "date": "2023-11, MON  27"}));
	xhr.send(JSON.stringify(val));
	//dataReply = JSON.parse(xhr.responseText);
	
	return JSON.parse(xhr.responseText);
}

/*******************************************************************************
	   Function: function asyncGetData(val)
	   
	   Description: The following function will send a request (JASON data) to the 
					client server asynchronously and it will receive data from client
					server in array of JASON format inside the callback function.
					
			Input: val, JSON object containing the request, date and time.
			
			Output: non, The dataCallback function will be called once the data has
					been received.					   
	

*******************************************************************************/
function asyncGetData(val) 
{

    console.log("Send Request to Server Client...");
    xhr = getXmlHttpRequestObject();
    xhr.onreadystatechange = dataCallback;
    // asynchronous requests
    xhr.open("POST", "http://localhost:6969/data", true);
	xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

	xhr.send(JSON.stringify(val));
	
}
/*******************************************************************************
	   Function: function dataCallback()
	   
	   Description: The following function call back function for the asynchronous
					usage XMLHttpRequest client server calls with the 
					use of asyncGetData() function.					
					
			Input: non.
			
			Output: non, This dataCallback function will call other functions to 
					process the received that (xhr.responseText).

*******************************************************************************/
function dataCallback() 
{
    // Check response is ready or not
	var dataR = "";
    if (xhr.readyState == 4 && xhr.status == 201) {
        console.log("User data received!");
               

		dataR = JSON.parse(xhr.responseText);
		
		processReceivedData(dataR);

    }
}

/*******************************************************************************
	   Function: function processReceivedData(dataRec)
	   
	   Description: This function will be used for the asynchronous or synchronous
	   				client server request and once the data is received it will 
					call aproperiate functions to process the data, based on the 
					request.
									
					
			Input: dataRec, JSON object data structure (array of structure data)

							where it contains array of request results, data, and
							the request type.

			
			Output: non, 					

*******************************************************************************/
function processReceivedData(dataRec)
{
	console.log(dataRec);
}

/****************************************************
 * *********** Test Function ****************
****************************************************/
function setReceivedData(dataRec)
{
	let someVar = dataRec;
	dataReply = someVar;
	console.log(dataReply[0]);
	someVariable = 1;
}

/*******************************************************************************
	   Function: function getStartEndDate()
	   
	   Description: This function will get the required start, and end date and 
	   				time for the required sessions of every simulator. These start 
	   				and end date and time are taken from start and end of every
	   				tick in the time tape.
					
			Input: Non.
			
			Output: timeFrame, This is an array containg of two elements for start
							  and end time.

*******************************************************************************/
function getStartEndDate()
{	
	var startT = ticksData[0].minutes;
	var endT = ticksData[ticksData.length - 1].minutes;
	startT = minToTime(startT);
	endT = minToTime(endT);
	var startD = startT + "," + getStartDate();
	var endD = endT + "," + getEndDate();

	return [startD, endD]
}
/*******************************************************************************
	   Function: function minToTime(minutes)
	   
	   Description: This function will convert the number of minutes to the string
	   				of HoursMinutes time.
					
			Input: minutes, It contains the number of minutes.
			
			Output: rTime, This is a string of time ex: "1400".

*******************************************************************************/
function minToTime(minutes)
{
	var hrT = minutes / 60;
	hrT = Math.floor(hrT);
	var minT = minutes % 60;

	if (minT == 0)
	{
		minT = minT.toString() + "0";
	}
	var rTime = hrT.toString() + minT;

	return rTime;
}
/*******************************************************************************
	   Function: function getStartDate()
	   
	   Description: This function will get the start date of the schedule date..
					
			Input: non.
			
			Output: rDate, This is a string of date ex: "2024-01, FRI  26".

*******************************************************************************/
function getStartDate()
{
	var weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
	var rDate = "";
	var tempYear = (ticksData[0].tYear).toString();
	var tempMonth = (ticksData[0].tMonth) + 1;
	var tempWeekDay = weekDays[ticksData[0].tDayOfWe];
	var tempDate = (ticksData[0].tDate).toString();

	if(tempMonth < 10)
	{
		tempMonth = "0" + tempMonth.toString();
	}

	rDate = tempYear + "-" + tempMonth + "," + " " + tempWeekDay + "  " + tempDate;
	return rDate;
}

/*******************************************************************************
	   Function: function getEndDate()
	   
	   Description: This function will get the end date of the schedule date..
					
			Input: non.
			
			Output: rDate, This is a string of date ex: "2024-01, FRI  26".

*******************************************************************************/
function getEndDate()
{
	var weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
	var rDate = "";
	var tempYear = (ticksData[ticksData.length - 1].tYear).toString();
	var tempMonth = (ticksData[ticksData.length - 1].tMonth) + 1;
	var tempWeekDay = weekDays[ticksData[ticksData.length - 1].tDayOfWe];
	var tempDate = (ticksData[ticksData.length - 1].tDate).toString();

	if(tempMonth < 10)
	{
		tempMonth = "0" + tempMonth.toString();
	}

	rDate = tempYear + "-" + tempMonth + "," + " " + tempWeekDay + "  " + tempDate;
	return rDate;

}

/*******************************************************************************
	   Function: function requestAllDeviceData()
	   
	   Description: This function will get generate a request structure command for
	   				all the devices, with time and date time frame of the time 
	   				tape of the schedule webpage.
					
			Input: Non.
			
			Output: reqCMD, It contains the "allDevice" command and the start 
							and end time,date for the request in structure format. 

*******************************************************************************/
function requestAllDeviceData()
{
	var rangeDate = getStartEndDate();

	var reqCMD =
	{
		'request': "allDevices",
		'startT': rangeDate[0],
		'endT': rangeDate[1]
	};

	return reqCMD;
}

/*****************************************************************************************************************
**************************************** Data Block Processing Code Section  *************************************
*****************************************************************************************************************/
/**********************************************************************************
	   Function: function requestAllDeviceData()
	   
	   Description: This function will get generate a request structure command for
	   				all the devices, with time and date time frame of the time 
	   				tape of the schedule webpage.
					
			Input: Non.
			
			Output: reqCMD, It contains the "allDevice" command and the start 
							and end time,date for the request in structure format. 

*********************************************************************************/
function setDataBlockElements()
{

}


/******************************************************************************************************
************************************	Middle Splitter Code Section  *********************************
*******************************************************************************************************/


/************************************************************************
	   Function: document.addEventListener()
	   
	   Description: The following function will add event listener 
					to Document Object Model (DOM) when its loaded.
					This event listener will add mouse handlers for
					moving splitter / resizer of schedual body columns. 
					
			Input: 'DOMContentLoaded'
					
	   
	

************************************************************************/

document.addEventListener('DOMContentLoaded', function () {
	
	const resizer = document.getElementById('splitter');
	const leftMinorColumn = resizer.previousElementSibling;
	const rightMinorColumn = resizer.nextElementSibling;
	
	var x = 0;
	var y = 0;
	var leftColumn = 0;
	var rightColumn = 0;

	const mouseDownHandler = function (e) {
		
		x = e.clientX;
		y = e.clientY;
		leftColumn = leftMinorColumn.getBoundingClientRect().width;
		resizerWidth = resizer.parentNode.getBoundingClientRect().width;

		
		document.addEventListener('mousemove', mouseMoveHandler);
		document.addEventListener('mouseup', mouseUpHandler);		
	};
	
	
	const mouseMoveHandler = function (e) {

		
		const dx = e.clientX - x;
		const dy = e.clientY - y;
		
		const newLeftWidth = ((leftColumn + dx) * 100) / resizerWidth;
		leftMinorColumn.style.width = newLeftWidth + '%';
		
		rightMinorColumn.style.width = (99 - newLeftWidth) + '%';

		
		

		
		resizer.style.width = resizerWidth;
		
		resizer.style.cursor = 'col-resize';
		
		leftMinorColumn.style.userSelect = 'none';
		leftMinorColumn.style.pointerEvents = 'none';
		
		rightMinorColumn.style.userSelect = 'none';
		rightMinorColumn.style.pointerEvents = 'none';	
		
	};
	
	const mouseUpHandler = function () {
		
		resizer.style.removeProperty('cursor');
		document.body.style.removeProperty('cursor');
		
		leftMinorColumn.style.removeProperty('user-select');
		leftMinorColumn.style.removeProperty('pointer-events');
		
		rightMinorColumn.style.removeProperty('user-select');
		rightMinorColumn.style.removeProperty('pointer-events');
		
		document.removeEventListener('mousemove', mouseMoveHandler);
		document.removeEventListener('mouseup', mouseUpHandler);		
			
	};
	
	resizer.addEventListener('mousedown', mouseDownHandler);
	
});




