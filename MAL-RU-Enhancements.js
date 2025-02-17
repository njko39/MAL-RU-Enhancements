// ==UserScript==
// @name        MAL RU Enhancements
// @namespace   Violentmonkey Scripts
// @match       https://myanimelist.net/anime/*
// @match       https://myanimelist.net/manga/*
// @grant       none
// @version     1.0
// @author      njko39
// @description 17/02/2025, 21:54:55
// ==/UserScript==

// ОПИСАНИЯ
function createTabHtml(newDescription, originalDescription) {
  const tabHtml = `
    <div>
      <div class="tab-button-container">
        <button class="tablinks" onclick="openTab(event, 'newDescription')">RUS</button>
        <button class="tablinks" onclick="openTab(event, 'originalDescription')">ENG</button>
      </div>

      <div id="newDescription" class="tabcontent">
        ${newDescription}
      </div>

      <div id="originalDescription" class="tabcontent" style="display:none;">
        ${originalDescription}
      </div>
    </div>
  `;
  return tabHtml;
}

function replaceDescriptionText() {
  const descElement = document.querySelector('p[itemprop="description"]');

  // Get the current URL
  const currentPageUrl = window.location.href;

  // Extract the "anime/54492" part from the URL
  const urlParts = currentPageUrl.split('/');
  const idPart = urlParts.slice(-2, -1).join('/');

  // Remove any non-numeric characters from the idPart
  const animeId = idPart.replace(/\D+/g, '');

  // Construct the Shikimori API URL
  const shikimoriApiUrl = `https://shikimori.one/api/animes/${animeId}`;

  // Fetch the anime data from the Shikimori API
  fetch(shikimoriApiUrl)
    .then(response => response.json())
    .then(data => {
      // Extract the description from the anime data
      const description = data.description;

      // Add the tab CSS
      const style = document.createElement('style');
      style.innerHTML = `
          .contributors {
            float: right;
            clear: right;
          }
          .contributors img {
            margin-right: 0.5em;
          }
          .key, .b-user16 {
            display: inline-block;
          }
          .block {
            padding-bottom: 1.5em;
          }
          .tab-button-container {
            margin-bottom: 1.5em;
          }
      `;
      document.head.appendChild(style);

      // Add the tab JavaScript
      const script = document.createElement('script');
      script.innerHTML = `
        function openTab(evt, tabName) {
          var i, tabcontent, tablinks;
          tabcontent = document.getElementsByClassName("tabcontent");
          for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
          }
          tablinks = document.getElementsByClassName("tablinks");
          for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
          }
          document.getElementById(tabName).style.display = "block";
          evt.currentTarget.className += " active";
        }
      `;
      document.body.appendChild(script);

      // Create the tab content
      const originalDescription = descElement.innerHTML;

      let newDescription;
      if (description === null || description === '') {
        newDescription = `У аниме пока что нет описания на русском. Вы можете предложить его на <a href="https://shikimori.one${data.url}" target="_blank">Шикимори</a>, и оно появится здесь.`;
      } else {
        newDescription = description;
      }

      const tabHtml = createTabHtml(newDescription, originalDescription);
      descElement.outerHTML = tabHtml;
      document.getElementsByClassName("tablinks")[0].click();
    })
    .catch(error => {
      descElement.textContent = 'Error fetching file: ' + error;
    });
}

window.addEventListener('load', replaceDescriptionText);





















