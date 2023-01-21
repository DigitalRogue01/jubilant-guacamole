function doGet() {
  return HtmlService.createHtmlOutputFromFile("Timeclock")
}

function clockInOut(payload){
    const today = (new Date().getDay() + 6) % 7;
    const ss = SpreadsheetApp.getActiveSpreadsheet()
    const wsData = ss.getSheetByName("Inputs")
    const wsEmployees = ss.getSheetByName("Employees")
    const wsSchedules = ss.getSheetByName("Schedules")
    const employeeData = wsEmployees.getRange(2,1,wsEmployees.getLastRow()-1,1).getValues()
    const scheduleData = wsSchedules.getRange(2,1,wsSchedules.getLastRow()-1,1).getValues()
    const matchingEmployees = employeeData.filter(r => r[0].toString() === payload.empid)
    const matchingSchedules = scheduleData.filter(r => r[0].toString() === payload.locode)
    Logger.log(matchingEmployees)
    Logger.log(matchingSchedules)
    
    if(matchingEmployees.length !== 1 && matchingSchedules.length !== 1){
      throw new Error("Sign In or Out Failed")
      return
    }
    const shiftRequirement = matchingSchedules[0][today];
    if(payload.action === "Clock In" && shiftRequirement !== "IN"){
      throw new Error("Invalid Shift for Clock In")
      return
    }
    if(payload.action === "Clock Out" && shiftRequirement !== "OUT"){
      throw new Error("Invalid Shift for Clock Out")
      return
    }

    wsData.appendRow([new Date(),payload.action,payload.empid,payload.locode,payload.comment.trim()])
}
