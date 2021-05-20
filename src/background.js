var activeTabId;
var tabUrl
var urlname

function start(data){
    chrome.tabs.onActivated.addListener(function(tabId, changeInfo, tab){
        chrome.runtime.reload();
    })
    chrome.tabs.query({active: true, currentWindow: true}, 
        function(tabs) {
            console.log('tabs',tabs);
            if(!activeTabId && tabs[0]){
                activeTabId = tabs[0].id;
                tabUrl = tabs[0].url;
            }
            chrome.tabs.sendMessage(activeTabId, {
                command: 'tab id',
                data: data,
                activeTabId: tabUrl,
            },  function(){});

            console.log('tab url',tabUrl);      
            chrome.tabs.executeScript(activeTabId, {file: 'contentScript.js' }, function(){}); 
            
        }
    );
}




function startVerify(data){
    chrome.tabs.onActivated.addListener(function(tabId, changeInfo, tab){
        chrome.runtime.reload();
    })
    chrome.tabs.query({active: true, currentWindow: true}, 
        function(tabs) {
            if(!activeTabId && tabs[0]){
                activeTabId = tabs[0].id;
                tabUrl = tabs[0].url;
            }
            chrome.tabs.sendMessage(activeTabId, {
                command: 'verifyEmailStep',
                data: data,
                activeTabId: tabs[0].url,
            },  function(){});

            console.log('tab url',tabUrl);      
            chrome.tabs.executeScript(activeTabId, {file: 'contentScript.js' }, function(){}); 
            
        }
    );
}



function startUnreadCheck(data){
    chrome.tabs.onActivated.addListener(function(tabId, changeInfo, tab){
        chrome.runtime.reload();
    })
    chrome.tabs.query({active: true, currentWindow: true}, 
        function(tabs) {
            if(!activeTabId && tabs[0]){
                activeTabId = tabs[0].id;
                tabUrl = tabs[0].url;
            }
            chrome.tabs.sendMessage(activeTabId, {
                command: 'checkUnreadMsg',
                data: data,
                activeTabId: tabs[0].url,
            },  function(){});

            console.log('tab url',tabUrl);      
            chrome.tabs.executeScript(activeTabId, {file: 'contentScript.js' }, function(){}); 
            
        }
    );
}




function verifypage(data){
    chrome.tabs.onActivated.addListener(function(tabId, changeInfo, tab){
        chrome.runtime.reload();
    })
    chrome.tabs.query({active: true, currentWindow: true}, 
        function(tabs) {
            if(!activeTabId && tabs[0]){
                activeTabId = tabs[0].id;
                tabUrl = tabs[0].url;
            }
            chrome.tabs.sendMessage(activeTabId, {
                command: 'verifypage',
                data: data,
                activeTabId: tabs[0].url,
            },  function(){});

            console.log('tab url',tabUrl);      
            chrome.tabs.executeScript(activeTabId, {file: 'contentScript.js' }, function(){}); 
            
        }
    );
}



function logout(data){
    chrome.tabs.onActivated.addListener(function(tabId, changeInfo, tab){
        chrome.runtime.reload();
    })
    chrome.tabs.query({active: true, currentWindow: true}, 
        function(tabs) {
            if(!activeTabId && tabs[0]){
                activeTabId = tabs[0].id;
                tabUrl = tabs[0].url;
            }
            chrome.tabs.sendMessage(activeTabId, {
                command: 'logout',
                data: data,
                activeTabId: tabs[0].url,
            },  function(){});

            console.log('tab url',tabUrl);      
            chrome.tabs.executeScript(activeTabId, {file: 'contentScript.js' }, function(){}); 
            
        }
    );
}



chrome.runtime.onMessage.addListener(
    function(request, sender){
        command = request.command;
        data = request.data;
        console.log(data)
        urlname = request.urlname;
        if (command === 'start'){    
            start(data);
        }
    }
);


chrome.runtime.onMessage.addListener(function(data, sender, sendResponse) {
    console.log("Received %o from %o, frame", data, sender.tab, sender.frameId);
    console.log('data main email',data)
    const error = document.getElementById('error_display');
    console.log('error', data.fulldata);
    if(data.text && error === null && data.fulldata)
    {
        chrome.tabs.update({url: "https://mail.zsthost.com/"})
        setTimeout(function(){ startVerify({data : data.text,  fulldata : data.fulldata}); }, 3000);
       
    }
    else if(data.unread)
    {
        setTimeout(function(){ startUnreadCheck({data : data.unread,  fulldata : data.fulldata}); }, 3000);
    }
    else if(data.verifypage)
    {
        setTimeout(function(){ verifypage({data : data.verifypage,  fulldata : data.fulldata}); }, 3000);
    }
    else if(data.verifylink)
    {
        setTimeout(function(){ 
            chrome.tabs.update({url: data.verifylink})
        }, 2000); 
        
        setTimeout(function(){ 
            
            setTimeout(function(){ 
                start(data.fulldata); 
            }, 3000); 
            
            chrome.tabs.update({url: 'https://store.steampowered.com/join/'})
        }, 4000);
    }


});
