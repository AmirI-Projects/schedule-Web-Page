#Server Client Code V9.1

#*************************************************************************************************************************
# --Added code in the webJavascript.js file--
#
#
#
#
#
#*************************************************************************************************************************

import os
import shutil
import random, time

from flask import Flask, request
import flask
import json

from flask_cors import CORS
import xml.etree.ElementTree as ET
from colorama import Fore



#*************************************************************************************
#
#
#			Function name:	def procesRequest(dataJ):
#
#			Input:	dataJ, It contains the JSON data format to be processed.
#								
#
#			Output:	result_process, This will contain the array of JSON objects. 
#					 				NOTE: json.dumps must be used to convert the python 
#									array into a array of JSON objects.
#
#			Description:	This function will process the JSON data that is received 
#							from web browser, and it will call apropriate functions to 
#							process. This 
#							 							
#
#*************************************************************************************
def procesRequest(dataJ):
	
	result_process = 0
	message = ""
	temp = 0
	
	if dataJ['request'] == "updatexml":
		
		result_process = updateXML()
	
	elif reqDevices(dataJ['request'])[0]:
		
		temp = reqDevices(dataJ['request'])[1]
		result_process = getDeviceData(temp, dataJ['startT'], dataJ['endT'])
		message = "\nDevice is found, the index in the device_data is: " + str(temp)
		print(message)
	
	elif (dataJ['request'] == "allDevices"):
		
		result_process = getAllDeviceData(dataJ['startT'], dataJ['endT'])
	
	else:
		message = "********** Invalid Request **********"
		print(message)
		result_process = [{'results' : 1, 'message': message, 'request': dataJ['request']}]
	
	return json.dumps(result_process)

	
#*************************************************************************************
#
#
#			Function name:	def getAllDeviceData(start, end):
#
#			Input:	start, Contains string of start time and date of the top of the time tape.
#
#					end, Contains the string of end time and date of the bottom of the time tape.								
#
#			Output:	res, This will contain array of structure (JASON format) of extracted data for the 
#						 data blocks of the device.
#						 
# 
#			Description:	This function will get all the data for every device in the 
#							device_data array structure, and then it will provide a data
#							array structure (JSON format) for every device.
#							
#
#*************************************************************************************
def getAllDeviceData(start, end):

	res = []
	
	for dev in enumerate(device_data):
	
		res.extend(getDeviceData(dev[0], start, end))
		
	
	return res
		


#*************************************************************************************
#
#
#			Function name:	def reqDevices(req):
#
#			Input:	req, It contains the requested device.
#								
#
#			Output:	res, This will contain array of 2 elements, first element is true or
#						 false depending if the device request exist in the device_data
#						 structure array. Second element repersents the index of the device
#						 requested in the device_data element.
# 
#			Description:	This function will check if the requested device is in the  
#							device_data structure array, and it will return an array of
#							two element with true, or false and index of the requested 
#							device in the device_data array.
#							
#
#*************************************************************************************
def reqDevices(req):
	
	res = [False, len(device_data)]
	
	i = 1
	
	
	while i <= len(device_data):
		
		if req == device_data[i - 1].get("device"):
				
			res = [True, (i - 1)]
			break
		else:
			
			i += 1
	
	return res	

#************************************************************************************************
#
#
#			Function name:	def getDeviceData(indexD, start, end):
#
#			Input:	indexD, Contains the index number of the device in the device_data array.
#					
#					start, Contains string of start time and date of the top of the time tape.
#
#					end, Contains the string of end time and date of the bottom of the time tape.
#								
#
#			Output:	res, This will contain array of structure of extracted data for the 
#						 data blocks of the device.						 
#						 
# 
#			Description:	This function will get all the block data for the given device index
#							from the device XML file between the start and end time and date. This 
#							function will return array of structures. The first structure will 
#							contain the success or failure of this process and the rest of the 
#							structures data will contain the all the block data.
#							
#*************************************************************************************************
def getDeviceData(indexD, start, end):
    
    xmlCheck = 0
    xmlFile = ""
    data = 0
    tempElement = ""
    res = [{"results": -1, "message": "", 'request': device_data[indexD].get("device")}]
    tempData = []
    
    #check if all the xml files for the given device exists
    xmlCheck = checkXmlFile(indexD)
    if xmlCheck[0]:
        
        print(xmlCheck[1])
        xmlFile = (xml_dir + device_data[indexD].get("cur_xml"))
        print("\nGetting the data from the current file: " + xmlFile)
        tempData.extend(getXmlData(xmlFile, indexD, start, end))
        xmlFile = (xml_dir + device_data[indexD].get("pre_xml"))
        print("\nGetting the data from the current file: " + xmlFile)
        tempData.extend(getXmlData(xmlFile, indexD, start, end))
        xmlFile = (xml_dir + device_data[indexD].get("next_xml"))
        print("\nGetting the data from the current file: " + xmlFile)
        tempData.extend(getXmlData(xmlFile, indexD, start, end))

        if len(tempData) > 0:
            res = []
            res = tempData
            print(P + "\n****Results Data are: *****" + Fore.WHITE)
            print(O +"\n" + str(res) + Fore.WHITE)
        else:
            res[0].update({"message": "No Data"})
            tempElement = json.dumps(res[0])
            res = []
            res.append(tempElement)

        
    else:
        
        print(xmlCheck[1])
        res[0].update({"message": xmlCheck[1]})
        tempElement = json.dumps(res[0])
        res = []
        res.append(tempElement)


        
    return res
    
#************************************************************************************************
#
#
#			Function name:	def getXmlData(indexDev):
#
#			Input:	xmlPath, It contains the string of the xml file path (path + file name).
#			
#					start, It contains the string which repersent the beginning of data set time and date.		
#
#					end, It contains the string which repersent the end of data set time and date.
#       
#                   deviceIndex, It contains the device Index in the device_data array.
#
#			Output:	res, This will contain array of structure data of the given device, in the range
#						 of start and end time/date range.
#						 
#						 
# 
#			Description:	This function will get all the simulator's data from the xml file of 
#							 given simulator. These data will be within the range of start and end 
#							time/date.
#							
#							
#							
#*************************************************************************************************
def getXmlData(xmlPath, deviceIndex, start, end):

    dataPool = []
    tempData = ""
    tD = []
    session = {

        "results": 1,
        "request": device_data[deviceIndex].get("device"),
        "date": "",
        "time": "",
        "title": "",
        "data": ""
    }

    tree = ET.parse(xmlPath)
    root = tree.getroot()
    sessionData = root.findall(".//session")
    print("\nThe length of the sessionData array is: " + str(len(sessionData)))

    if len(sessionData) > 0:

        for se in sessionData:
            tempData = str(se.find('data').text)

            if tempData != "None":
                tempData = str(se.find('date').text)
                tempData2 = str(se.find('hrs').text)
                print("*****New Session Data*******")
                print("\nThe date of the session is: " + tempData)
                print("\nThe data of the session is: " + "\n" + str(se.find('data').text))
                print("\nThe hour of the session is: " + tempData2)
                
                if (checkTimeDate(tempData2, tempData, start, end)):

                    session["date"] = tempData
                    session["time"] = tempData2
                    data = str(se.find('data').text)
                    deviceD = device_data[deviceIndex].get("device")
                    tD = getTitleandData(data, deviceD)
                    session["title"] = tD[0]
                    session["data"] = tD[1]
                    dataPool.append(json.dumps(session))


    return dataPool

#************************************************************************************************
#
#
#           Function name:  def checkTimeDate(hour, date, startD, endD):
#
#           Input:  start, It contains the string which repersent the beginning of data set time and date.
#           
#                   end, It contains the string which repersent the end of data set time and date.      
#
#                   
#
#           Output: res, The will contain either True or False if the session data date and hour are 
#                        with in the given Start and end time and date.
#                        
#                        
# 
#           Description:    This function will check if the given hour and date of the session data 
#                           are within the start and end. This function will then return a True or
#                           False logic if the session data are within start and end date and time.
#                           
#                           
#*************************************************************************************************
def checkTimeDate(hour, date, startD, endD):

    res = False
    res2 = False
    hrStart = int(hour.split("-")[0])
    startHr = startD.split(",")[0]
    startHr = int(startHr)
    startDate = startD.split(",")[1] + "," +startD.split(",")[2]
    endHr = endD.split(",")[0]
    endHr = int(endHr)
    endDate = endD.split(",")[1] + "," + endD.split(",")[2]

    if (startDate == date) or (endDate == date):
        res = True
        if hrStart >= startHr:
            res2 = True
        if (hrStart <= endHr) and (date != startDate):
            res2 = True

    print("\nThe startHR is: " + str(startHr) + " ,startDate is: " + startDate)
    print("The endHR is: " + str(endHr) + " ,endDate is: " + endDate)
    if res:
        print(Fore.RED + "The Session Date are within the start or end dates: " + str(res) + Fore.WHITE)
        
    else:
        print(Fore.WHITE + "The Session Date are within the start or end dates: " + str(res))

    if res2:
        print(Fore.GREEN + "The Session Hour is within the startD or endD Time: " + str(res2) + Fore.WHITE)
    else:
        print(Fore.WHITE + "The Session Hour is within the startD or endD Time: " + str(res2))

    return (res and res2)


#************************************************************************************************
#
#
#           Function name:  def getTitleandData(data, device):
#
#           Input:  data, It contains the string of session's data.
#           
#                   device, It contains the device name.      
#
#                   
#
#           Output: res, The will contain array of two strings, first one is the title and the 
#                         second one contains the data of the session.
#                        
#                        
# 
#           Description:    This function will seperate the title of the session from the session's 
#                           data, and will return an array of two string elemts for title and 
#                           sessions data
#                           
#*************************************************************************************************
def getTitleandData(data, device):

    gemiData = []
    tempDeiveData = ""
    tempDeiveTile = ""

    if (device in gemini_devices):
        tempDeiveData = data[13:]
        gemiData = getGeminiTitleData(tempDeiveData)
        tempDeiveTile = gemiData[0]
        tempDeiveData = gemiData[1]

    else:
        tempDeiveData = data.split("  ")[1]
        tempDeiveTile = data.split("  ")[0]
        print("The session's Title is: " + tempDeiveTile + ", The Data is: " + tempDeiveData)

    return [tempDeiveTile, tempDeiveData]

#************************************************************************************************
#
#
#           Function name:  def getGeminiTitleData(data):
#
#           Input:  data, It contains the string of session's data.
#               
#                  
#
#           Output: res, The will contain array of two strings, first one is the title and the 
#                         second one contains the data of the session.
#                        
#                        
# 
#           Description:    This function will seperate the title of the session from the Gemini 
#                           session's data, and will return an array of two string elemts for title 
#                           and sessions data
#                           
#*************************************************************************************************
def getGeminiTitleData(data):

    tempIndex = 0
    tempIndex2 = 0
    title = ""
    sData = ""

    if "(System Placeholder)" in data:
        title = "(System Placeholder)"
        sData = "(Maintenance)"
        print("The Title is: " + title + ", The data is: " + sData)
    elif "(MAINTENANCE)" in data:
        title = "(MAINTENANCE)"
        sData = "(Maintenance)"
        print("The Title is: " + title + ", The data is: " + sData)
    elif "(CUSTOMER:" in data:
        tempIndex = data.index("(CUSTOMER: ")        
        print("The index of the CUSTOMER: is: " + str(tempIndex))
        sData = data[(tempIndex + 11):]
        title = sData.split(") ")[0]
        sData = sData.split(") ")[1]
        print("The Title is: " + title + ", The data is: " + sData)

    return [title, sData]


#************************************************************************************************
#
#
#			Function name:	def checkXmlFile(indexDevice):
#
#			Input:	indexDevice, Contains the index number of the device in the device_data array.			
#
#			Output:	res, This will contain array of 2 elememts. First element has boolean True/False
#						 to indicate that the xml folder and all of the xml files for the device is 
#						 exists. The second the element contains message for success or failure.
#						 
# 
#			Description:	This function will check for xml folder and all the xml files related 
#							to the given device index are all exist. This function will return an array 
#							of 2 elements containig boolean and string message for success or failure
#							of this operation.
#							
#							
#*************************************************************************************************
def checkXmlFile(indexDevice):
	
	res = [False, ""]
	
	#check if the xml directory still exists
	if os.path.isdir(xml_dir) == True:
		
		if os.path.exists(xml_dir + device_data[indexDevice].get("cur_xml")):
			
			if os.path.exists(xml_dir + device_data[indexDevice].get("pre_xml")):
				
				if os.path.exists(xml_dir + device_data[indexDevice].get("next_xml")):
					
					res[0] = True
					res[1] = "\nAll XML files for " + device_data[indexDevice].get("device") + " are found !"
				
				else:
					res[0] = False
					res[1] = "\nCould not find the following XML file: " + device_data[indexDevice].get("next_xml")
			
			else:
				res[0] = False
				res[1] = "\nCould not find the following XML file: " + device_data[indexDevice].get("pre_xml")
		
		else:
			res[0] = False		
			res[1] = "\nCould not find the following XML file: " + device_data[indexDevice].get("cur_xml")
	
	else:
		res[0] = False
		res[1] = "\nCould not find the web page XML directory: " + xml_dir
		
	return res
		
	
#*********************************************************************************
#
#
#			Function name:	def updateXML():
#
#			Input:	non, 
#								
#
#			Output:	result_ls, This contains array of JSON oject that has status of 
#								every copyover operation. 
#					 
#					
#
#			Description:	This function will update the all the XML files for every 
#							devices in the xmls folder of this webpage directory, and 
#							outputs the status of every copy over operation.
#							 							
#
#*******************************************************************************
def updateXML():
        
    result_ls = []
    rData = ""
    
    for dataInfo in device_data:
        
        rData = copyOver(dataInfo.get("cur_xml"), dataInfo.get("cur_xml"), dataInfo.get("sour_dir"), xml_dir)
        rData.update({'request': "updatexml"})
        result_ls.append(json.dumps(rData))
        rData = copyOver(dataInfo.get("pre_xml"), dataInfo.get("pre_xml"), dataInfo.get("sour_dir"), xml_dir)
        rData.update({'request': "updatexml"})
        result_ls.append(json.dumps(rData))
        rData = copyOver(dataInfo.get("next_xml"), dataInfo.get("next_xml"), dataInfo.get("sour_dir"), xml_dir)
        rData.update({'request': "updatexml"})
        result_ls.append(json.dumps(rData))
    
    return result_ls
    

#*********************************************************************************
#
#
#			Function name:	def copyOver(oldName, newName, curDir, desDir):
#
#			Input:	newName, It contains the string of the new File name.
#					
#					curDir, contains the string for current directory address.			
#
#					desDir, contains the destenation directory address.
#					
#					oldName, It contains the string of the old File name.
#
#			Output:	
#					 
#					
#
#			Description:	This function will rename and compy over the html and 
#							PDF files for the simulator into the designaed folder 
#							address in "desDir"
#							
#													
#							
#
#*******************************************************************************
def copyOver(oldName, newName, curDir, desDir):
	
	result = {'results' : -1, 'message': "non"}
	messge = "non"
	#check if the destenation directory is available
	if os.path.isdir(desDir) == True:
		
		#check if the old file in current working directory exists
		if os.path.exists(curDir + oldName):
			shutil.copy(curDir + oldName, desDir + newName)
			print("\n********* File Transfer Complete *********\n")
			print("The following destenation and file is transfered: \n" + desDir + newName)
			messge = "The following destenation and file is transfered: \n" + desDir + newName
			result['results'] = 1
			result['message'] = "** File Transfer Complete ** " + messge
			
		
		else:
			print("\n********** Could not find the file below: **********\n")
			print(curDir + oldName)
			result['results'] = -1
			message = curDir + oldName
			result['message'] = "** File Transfer Complete ** " + messge
		
	else:
		print("\n********** Could not reach the destination folder! **********")
		print("\n destination folder trying to reach is: " + desDir)
		print("\n*** Please check if destination directoy is available and address is correct. ***")
		result['results'] = -1
		message = "\n destination folder trying to reach is: " + desDir
		result['message'] = "** Could not reach the destination folder! ** " + messge
		
	return result

#***********************************************************************************************************
#****************************************** Golobal Variable Section ***************************************
#***********************************************************************************************************		


cur_dir = os.getcwd() + "\\"

xml_dir = cur_dir + "xmls\\"

gemini_devices = ("Q400", "Dash8FFS", "Dash8IPT1")

device_data = [
{
	"device": "Q400",
	"cur_xml": "currentWeek-Q400FFS.xml",
	"pre_xml": "previousWeek-Q400FFS.xml",
	"next_xml": "nextWeek-Q400FFS.xml",
	"sour_dir": "C:\Projects\Sim Schedule Project\\"
},
{
    "device": "Dash8FFS",
    "cur_xml": "currentWeek-Q400FFS.xml",
    "pre_xml": "previousWeek-Q400FFS.xml",
    "next_xml": "nextWeek-Q400FFS.xml",
    "sour_dir": "C:\Projects\Sim Schedule Project\\"
},
{
	"device": "A320",
	"cur_xml": "currentMonth-a3202.xml",
	"pre_xml": "PreviousMonth-a3202.xml",
	"next_xml": "nextMonth-a3202.xml",
	"sour_dir": "C:\Projects\Sim Schedule Project\\"
},
{
	"device": "B737",
	"cur_xml": "currentMonth-b737.xml",
	"pre_xml": "PreviousMonth-b737.xml",
	"next_xml": "nextMonth-b737.xml",
	"sour_dir": "C:\Projects\Sim Schedule Project\\"
},
{
	"device": "B787",
	"cur_xml": "currentMonth-b787.xml",
	"pre_xml": "PreviousMonth-b787.xml",
	"next_xml": "nextMonth-b787.xml",
	"sour_dir": "C:\Projects\Sim Schedule Project\\"
}
]

#************* Define Color Codes for Concel*****************
W  = '\033[0m'  # white (normal)
R  = '\033[31m' # red
G  = '\033[32m' # green
O  = '\033[33m' # orange
B  = '\033[34m' # blue
P  = '\033[35m' # purple 

#***********************************************************************************************************
#***************************************** Flask Client Server Section *************************************
#***********************************************************************************************************

app = Flask(__name__)
CORS(app)

#http://localhost:6969
@app.route("/")
def hello():
    return "This is a Test of Local Server,\n" + "Hello, World!"

#http://localhost:6969/data
@app.route('/data', methods=["GET", "POST"])
def data():    
	print("Getting the request on backend....\n")
    
	if request.method == "GET":
		return "This is a test for getting data from Python Code"
        
	if request.method == "POST":
		recived_data = request.get_json()
		#recived_data = int.from_bytes(recived_data, "big")
		print("The recived data is: " + str(recived_data))
		#data1 = recived_data['device']
		#data2 = recived_data['date']
		#updateXML()
		data_to_send = procesRequest(recived_data)
		print("\nCurrent working directory is: " + cur_dir + "\n")
		

    
    #dataFile = "This is a test for getting data from Python Code"
    #result = dataOne + 2
	#return flask.Response(response="The device Name is: " + data1 + ", date is: " + data2, status=201)
	#return flask.Response(response="The Data is: " + str(data_to_send[0]), status=201)
	return flask.Response(response=data_to_send, status=201)
    
if __name__ == "__main__":
    app.run("localhost", 6969)
	