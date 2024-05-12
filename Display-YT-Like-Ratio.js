// ==UserScript==
// @name         Like ratio
// @namespace    http://tampermonkey.net/
// @version      2024-05-12
// @description  Display the like to views ratio of a YouTube video next to the like button
// @author       You
// @match        https://www.youtube.com/watch?v=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    // console.log("Script started.");

    // Function to convert view and like counts from text to number
    function parseCounts(text) {
        const multipliers = { 'K': 1e3, 'M': 1e6, 'B': 1e9 };
        const matched = text.match(/(\d+(?:\.\d+)?)\s*([KMB])?/);
        if (matched) {
            const num = parseFloat(matched[1]);
            const mult = multipliers[matched[2]] || 1;
            // console.log(`Parsed count: ${num * mult} (${matched[1]} * ${mult})`);
            return num * mult;
        }
        // console.log("Failed to parse count.");
        return 0;
    }

    // Check for the presence of the like button and views regularly
    const checkExist = setInterval(function() {
        // console.log("Checking for like button and views...");
        const likeButton = document.querySelector('#top-level-buttons-computed > segmented-like-dislike-button-view-model > yt-smartimation > div > div > like-button-view-model > toggle-button-view-model > button-view-model > button > div.yt-spec-button-shape-next__button-text-content');
        const viewCountSpan = document.querySelector('#info > span:nth-child(1)');

        if (likeButton && viewCountSpan) {
            // console.log("Like button and views found.");
            clearInterval(checkExist);

            const likes = parseCounts(likeButton.textContent);
            // console.log(`Likes: ${likes}`);
            const views = parseCounts(viewCountSpan.textContent);
            // console.log(`Views: ${views}`);
            const ratio = views ? (likes / views * 100).toFixed(2) + '%' : 'N/A';

            // Create a new span to display the like-to-views ratio
            const ratioSpan = document.createElement('span');
            ratioSpan.textContent = ` Like-to-View Ratio: ${ratio}`;
            ratioSpan.style.marginLeft = '8px';
            ratioSpan.style.color = '#808080';

            // Append the new span next to the like button
            likeButton.parentElement.appendChild(ratioSpan);
            // console.log("Ratio span appended.");
        // } else if (!likeButton && !viewCountSpan) {
        //     console.log("Like button and views not found yet.");
        // } else if (!likeButton) {
        //     console.log("Like button not found yet.");
        // } else {
        //     console.log("Views not found yet.");
        }
    }, 1000); // Check every second
})();
