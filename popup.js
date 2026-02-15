const API_KEY=config.API_KEY;
document.getElementById("searchBtn").addEventListener("click", async()=>{
    const query = document.getElementById("searchInput").value;
    const resultsDiv = document.getElementById("results");

    if(!query){
        return;
    }
    resultsDiv.innerHTML="searching api.."

    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const urlParams = new URLSearchParams(new URL(tab.url).search);
    const videoId = urlParams.get("v");

    if (!videoId) {
    resultsDiv.innerHTML = "Error: Not a YouTube video.";
    return;
    }

    const apiUrl = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&searchTerms=${query}&maxResults=20&key=${API_KEY}`;

    try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    resultsDiv.innerHTML = "";

    if(!data.items||data.items.length==0){
        resultsDiv.innerHTML="comment not found";
        return;
    }
    data.items.forEach(item => {
        const comment = item.snippet.topLevelComment.snippet;
        const commentId = item.id;

        const div = document.createElement("div");
        div.className = "comment-item";
      
        const linkUrl = `https://www.youtube.com/watch?v=${videoId}&lc=${commentId}`;

        div.innerHTML = `
        <div class="author">${comment.authorDisplayName}</div>
        <div class="text">${comment.textDisplay}</div>
        <a class="link" href="${linkUrl}" target="_blank">Go to comment</a>`;
      
        resultsDiv.appendChild(div);
    });
    }
    catch(error){
        console.error(error)
        resultsDiv.innerHTML("error fetching key lol");
    }
})