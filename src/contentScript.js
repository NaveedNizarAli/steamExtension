'use strict';


var activeTabId
var urlname
var command



function fillStepOne(data){

    var unRegisteredArray = [];

    var fulldata = data;

    data.forEach(function(element,idx){     
        if(!element.steam_profile_url)
        {
            unRegisteredArray.push(element);
        }
    });

    console.log('unRegisteredArray',unRegisteredArray);
    console.log('fulldata',fulldata);

    document.getElementById('email').value = unRegisteredArray[0].email;
    document.getElementById('reenter_email').value = unRegisteredArray[0].email;


    document.getElementById('createAccountButton').addEventListener("click", function(){
       
        chrome.runtime.sendMessage({text: unRegisteredArray[0], fulldata: fulldata}, function(response){
            console.log('response',response);
        });
    });

}


function fillstepTwo(data){
    console.log('final data', data);

    document.getElementById('rcmloginuser').value = data.data.email;
    document.getElementById('rcmloginpwd').value = data.data.email_password;

    document.getElementById('rcmloginsubmit').addEventListener("click", function(){
       
        chrome.runtime.sendMessage({unread: data.data, fulldata: data.fulldata}, function(response){
            console.log('response',response);
        });
    });
  
    document.getElementById('rcmloginsubmit').click()

  

}

function checkUnread(data){
    console.log('unread data', data);
    const unreadMessage = document.getElementsByClassName('message unread')[0].childNodes[1].childNodes[2].childNodes[1]


    unreadMessage.addEventListener("click", function(){ 
        chrome.runtime.sendMessage({verifypage: data.data, fulldata: data.fulldata}, function(response){
            console.log('response',response);
        });
    });
  

    console.log('unread messages', unreadMessage.click());

}


function verifypage(data){
    console.log('verify page', data);

    var s1 = document.createElement("script");
    s1.type = "text/javascript";
    s1.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.8.0/jszip.js";

    var s2 = document.createElement("script");
    s2.type = "text/javascript";
    s2.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.8.0/xlsx.js";

    document.head.appendChild(s1)
    document.head.appendChild(s2)
    

    
    const verifylink = document.querySelectorAll('[rel="noreferrer"]')[0];


    console.log('verifylink', verifylink )

    data.fulldata.forEach((element, idx)=>{
        if(element.email === data.data.email)
        {
            element.steam_profile_url = verifylink.href
        }
    })

    
    console.log('fulldata', data.fulldata )

    
    setTimeout(function(){
        var filename ='C:/Users/pc/Downloads/ExtensionProject.xlsx';
        data=data.fulldata
        var ws = XLSX.utils.json_to_sheet(data);
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "People");
        XLSX.writeFile(wb,filename);
    }, 5000)



    document.getElementById('rcmbtn105').addEventListener('click',function(){ 
        chrome.runtime.sendMessage({verifylink: verifylink.href, fulldata: data.fulldata}, function(response){
            console.log('response',response);
        });
    })


    document.getElementById('rcmbtn105').click()


}






chrome.runtime.onMessage.addListener(
    function(request, sender){
        console.log(request.activeTabId + "from the extension" + request.command);
        command = request.command;
        activeTabId = request.activeTabId;
        if (command === 'tab id'){
            console.log('req', request.data)
            // data = request.data;

            fillStepOne(request.data);
        }

        if(command === 'verifyEmailStep')
        {
            fillstepTwo(request.data);
        }
        if(command === 'checkUnreadMsg')
        {
            checkUnread(request.data);
        }
        if(command === 'verifypage')
        {
            verifypage(request.data)
        }
    }

);
