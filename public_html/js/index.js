var jpdbBaseUrl = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var dbName = "STUDENT-DB";
var dbRelationName = "STUDENT-TABLE";
var connToken = "90932803|-31949279190160469|90948108";




function resetForm(){
    $('#roll').val("");
    $('#name').val("");
    $('#dob').val("");
    $('#address').val("");
    $('#enrollDate').val("");
    
    $('#roll').prop("disabled",false);
    $('#save').prop("disabled",true);
    $('#change').prop("disabled",true);
    $('#reset').prop("disabled",true);

    $('#roll').focus();

}


function saveData(){
    var jsonStrObj = validateData();
    if(jsonStrObj === ''){
        return "";
    }
    var putRequest = createPUTRequest(connToken,jsonStrObj,dbName,dbRelationName);
    jQuery.ajaxSetup({async:false});
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest,jpdbBaseUrl,jpdbIML);
    jQuery.ajaxSetup({async:true});
    resetForm();
    $('#roll').focus();
}


function validateData(){
    var roll,name,dob,address,enrollDate;
    roll = $('#roll').val();
    name = $('#name').val();
    dob = $('#dob').val();
    address = $('#address').val();
    enrollDate = $('#enrollDate').val();
    
    if(roll===''){
        alert('Student roll number is missing');
        $('#roll').focus();
        return "";
    }
    if(name===''){
        alert('Student name is missing');
        $('#name').focus();
        return "";
    }
     if(dob===''){
        alert('Student birth date is missing');
        $('#dob').focus();
        return "";
    }
     if(address===''){
        alert('Student address is missing');
        $('#address').focus();
        return "";
    }
     if(enrollDate===''){
        alert('Student enrollment date is missing');
        $('#enrollDate').focus();
        return "";
    }

    var jsonStrObj = {
        rollNo : roll,
        name : name,
        birthDate: dob,
        address : address,
        enrollmentDate : enrollDate
    };
    return JSON.stringify(jsonStrObj);
    
}

function changeData(){
    $('#change').prop('disabled',true);
    jsonChg = validateData();
    var updateRequest = createUPDATERecordRequest(connToken,jsonChg,dbName,dbRelationName,localStorage.getItem("recno"));
    jQuery.ajaxSetup({async:false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest,jpdbBaseUrl,jpdbIML);
    jQuery.ajaxSetup({async:true});
    console.log(resJsonObj);
    resetForm();
    $('#roll').focus();
}
function saveRecNo2LS(jsonObj){
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno",lvData.rec_no);
}

function fillData(jsonObj){
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $('#roll').val(record.rollNo);
    $('#name').val(record.name);
    $('#dob').val(record.birthDate);
    $('#address').val(record.address);
    $('#enrollDate').val(record.enrollmentDate);
}

function getRollAsJsonObj(){
    var roll = $('#roll').val();
    var jsonStr = {
        rollNo : roll
    };
    return JSON.stringify(jsonStr);
}
function getRoll(){
    var rollJsonObj = getRollAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken,dbName,dbRelationName,rollJsonObj);
    jQuery.ajaxSetup({async:false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest,jpdbBaseUrl,jpdbIRL);
    jQuery.ajaxSetup({async:true});
    
    if(resJsonObj.status === 400){
        $('#save').prop("disabled",false);
        $('#change').prop("disabled",true);
      $('#reset').prop("disabled",false);
      $('#roll').focus();
    }
    else if(resJsonObj.status === 200){
        $('#roll').prop("disabled",true);
        fillData(resJsonObj);
        $("#save").prop("disabled",true);
        $('#change').prop("disabled",false);
      $('#reset').prop("disabled",false);
      $('#name').focus();
    }
}

