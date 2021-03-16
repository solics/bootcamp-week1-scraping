const btnScrapProfile = document.getElementById('scrap-profile')

btnScrapProfile.addEventListener("click",async ()=>{
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab!=null){
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: scrapingProfile,
          });
    }
})

async function scrapingProfile() {

    const wait = function(milliseconds){
        return new Promise(function(resolve){
            setTimeout(function() {
                resolve();
            }, milliseconds);
        });
    };

    console.log('session 1')

}
