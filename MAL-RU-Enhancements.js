// ==UserScript==
// @name        MAL-RU-Enhancements
// @namespace   https://github.com/njko39/MAL-RU-Enhancements
// @match       https://myanimelist.net/anime/*
// @match       https://myanimelist.net/manga/*
// @grant       none
// @version     1.1
// @author      njko39
// @description Translate some of MAL elements into russian
// @downloadURL https://github.com/njko39/MAL-RU-Enhancements/raw/refs/heads/main/MAL-RU-Enhancements.js
// @homepageURL https://github.com/njko39/MAL-RU-Enhancements
// ==/UserScript==

/*
    Эта часть скрипта заменяет описание и название через API.
*/

// Function to create the tab HTML
function createTabHtml(newDescription, originalDescription, shikimoriUrl) {
  const tabHtml = `
    <div class="block">
      <div class="tab-button-container">
        <button class="tablinks" onclick="openTab(event, 'newDescription')">RUS</button>
        <button class="tablinks" onclick="openTab(event, 'originalDescription')">ENG</button>
      </div>

      <div id="newDescription" class="tabcontent">
        ${newDescription || ''}
        <div class="source">
          Источник: <a href="https://shikimori.one${shikimoriUrl}" target="_blank">Шикимори</a>
        </div>
      </div>

      <div id="originalDescription" class="tabcontent" style="display:none;">
        ${originalDescription}
      </div>
    </div>
  `;
  return tabHtml;
}

// Function to replace special tags with links
function processContentLinks(description) {
  if (typeof description !== 'string' || description === '') {
    return '';
  }

  // Process [character] tags
  const characterRegex = /\[character=(\d+)\](.*?)\[\/character\]/g;
  let processedDescription = description.replace(characterRegex, (_, id, text) => {
    return `<a href="https://myanimelist.net/character/${id}" target="_blank">${text}</a>`;
  });

  // Process [anime] tags
  const animeRegex = /\[anime=(\d+)\](.*?)\[\/anime\]/g;
  processedDescription = processedDescription.replace(animeRegex, (_, id, text) => {
    return `<a href="https://myanimelist.net/anime/${id}" target="_blank">${text}</a>`;
  });

  // Process [person] tags
  const personRegex = /\[person=(\d+)\](.*?)\[\/person\]/g;
  processedDescription = processedDescription.replace(personRegex, (_, id, text) => {
    return `<a href="https://myanimelist.net/people/${id}" target="_blank">${text}</a>`;
  });

  return processedDescription;
}

// Function to replace the description text and title
function replaceDescriptionTextAndTitle() {
  const currentPageUrl = window.location.href;
  const urlParts = currentPageUrl.split('/');
  const idPart = urlParts.slice(-2, -1).join('/');
  const animeId = idPart.replace(/\D+/g, '');

  const shikimoriApiUrl = `https://shikimori.one/api/animes/${animeId}`;

  fetch(shikimoriApiUrl)
    .then(response => response.json())
    .then(data => {
      let description = data.description;
      const russianName = data.russian;
      const shikimoriPageUrl = data.url;

      // Check if description exists
      let processedDescription = '';
      if (typeof description === 'string' && description !== '') {
        processedDescription = processContentLinks(description);
      } else {
        processedDescription = `У аниме пока что нет описания на русском. Вы можете предложить его на <a href="https://shikimori.one${data.url}" target="_blank">Шикимори</a>, и оно появится.`;
      }

      // Add tab CSS (including styling for the source block)
      const style = document.createElement('style');
      style.innerHTML = `
          .block {
            padding-bottom: 1.5em;
          }
          .tab-button-container {
            margin-bottom: 1.5em;
          }
          .source {
            text-align: right;
            font-size: 0.8em;
            color: #666;
            margin-top: 1em;
          }
          .source a {
            color: #999;
            text-decoration: none;
          }
          .source a:hover {
            text-decoration: underline;
          }
      `;
      document.head.appendChild(style);

      // Add tab JavaScript
      const script = document.createElement('script');
      script.innerHTML = `
        function openTab(evt, tabName) {
          const tabcontent = document.getElementsByClassName("tabcontent");
          for (let i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
          }
          const tablinks = document.getElementsByClassName("tablinks");
          for (let i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
          }
          document.getElementById(tabName).style.display = "block";
          evt.currentTarget.className += " active";
        }
      `;
      document.body.appendChild(script);

      // Replace title with Russian name and move original title
      const titleElement = document.querySelector('h1.title-name.h1_bold_none strong');
      const englishTitleElement = document.querySelector('p.title-english.title-inherit');
      if (titleElement && russianName) {
        const originalTitle = titleElement.textContent;
        titleElement.textContent = russianName;
        if (englishTitleElement) {
          englishTitleElement.textContent = originalTitle;
        } else {
          const newEnglishTitleElement = document.createElement('p');
          newEnglishTitleElement.className = 'title-english title-inherit';
          newEnglishTitleElement.textContent = originalTitle;
          titleElement.parentNode.appendChild(newEnglishTitleElement);
        }
      }

      // Create tab for descriptions
      const descElement = document.querySelector('p[itemprop="description"]');
      const originalDescription = descElement.innerHTML;

      const processedDescriptionWithSource = processedDescription;

      // Pass shikimoriPageUrl when creating the tab HTML
      const tabHtml = createTabHtml(processedDescriptionWithSource, originalDescription, shikimoriPageUrl);
      descElement.outerHTML = tabHtml;
      document.getElementsByClassName("tablinks")[0].click();
    })
    .catch(error => {
      const descElement = document.querySelector('p[itemprop="description"]');
      descElement.textContent = 'Error fetching description: ' + error;
    });
}

// Run the function when the page loads
window.addEventListener('load', replaceDescriptionTextAndTitle);

/*
    В этой части статичный перевод, который не зависит от API.
*/

function replaceText(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    node.textContent = node.textContent
      .replace(/Favorites/g, "В избранном")
      .replace(/Members/g, "В списках")
      .replace(/Popularity/g, "Популярность")
      .replace(/Ranked/g, "Топ")
      .replace(/Score/g, "Оценка")
      .replace(/Rating/g, "Рейтинг")
      .replace(/Duration/g, "Длительность")
      .replace(/Source/g, "Первоисточник")
      .replace(/Studios/g, "Студии")
      .replace(/Licensors/g, "Лицензировано")
      .replace(/Producers/g, "Продюсеры")
      .replace(/Broadcast/g, "Показ")
      .replace(/Premiered/g, "Пьера")
      .replace(/Aired/g, "Дата")
      .replace(/Status/g, "Статус")
      .replace(/Episodes/g, "Эпизоды")
      .replace(/Type/g, "Тип")
      .replace(/Genres/g, "Жанры")
      .replace(/Themes/g, "Темы");
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    for (let child of node.childNodes) {
      replaceText(child);
    }
  }
}

// Process .spaceit_pad elements for original translations
const spaceitElements = document.querySelectorAll('.spaceit_pad');
spaceitElements.forEach(element => {
  replaceText(element);
});

// Process #menu_left div for "Anime" and "Manga" translations
function replaceMenuText(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    node.textContent = node.textContent
      .replace(/Anime/g, "Аниме")
      .replace(/Manga/g, "Манга");
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    for (let child of node.childNodes) {
      replaceMenuText(child);
    }
  }
}

const menuLeft = document.querySelector('#menu_left');
if (menuLeft) {
  replaceMenuText(menuLeft);
}

// Process .stats-block divs for specific translations
function replaceStatsText(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    node.textContent = node.textContent
      .replace(/Spring/g, "Весна")
      .replace(/Winter/g, "Зима")
      .replace(/Fall/g, "Осень")
      .replace(/Summer/g, "Лето")
      .replace(/Ranked/g, "Топ")
      .replace(/Popularity/g, "Популярность")
      .replace(/Members/g, "В списках");
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    for (let child of node.childNodes) {
      replaceStatsText(child);
    }
  }
}

const statsBlocks = document.querySelectorAll('.stats-block.po-r.clearfix');
statsBlocks.forEach(block => {
  replaceStatsText(block);
});

// Update the .fl-l.score div's attributes
function updateScoreAttributes() {
  const scoreDivs = document.querySelectorAll('.fl-l.score');
  scoreDivs.forEach(div => {
    div.setAttribute('data-title', 'Рейтинг');
    const userValue = div.getAttribute('data-user');
    if (userValue) {
      div.setAttribute('data-user', userValue.replace(/users$/, 'оценок'));
    }
  });
}

updateScoreAttributes();

// Process .user-status-block div for specific translations and adjust select width
function replaceUserStatusText(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    node.textContent = node.textContent
      .replace(/Appalling/g, "Провал")
      .replace(/Horrible/g, "Ужасно")
      .replace(/Very Bad/g, "Очень плохо")
      .replace(/Bad/g, "Плохо")
      .replace(/Average/g, "Нормально")
      .replace(/Fine/g, "Неплохо")
      .replace(/Very Good/g, "Очень хорошо")
      .replace(/Good/g, "Хорошо")
      .replace(/Great/g, "Отлично")
      .replace(/Masterpiece/g, "Шедевр")
      .replace(/Select/g, "Оценить")
      .replace(/Dropped/g, "Брошено")
      .replace(/On-Hold/g, "Отложено")
      .replace(/Watching/g, "Смотрю")
      .replace(/Plan to Watch/g, "Запланировано")
      .replace(/Completed/g, "Просмотрено")
      .replace(/Episodes:/g, "Эпизоды:");
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    for (let child of node.childNodes) {
      replaceUserStatusText(child);
    }

    const selectElement = node.querySelector('select#myinfo_status');
    if (selectElement) {
      selectElement.style.width = '111px'; // Adjusted width for better text fit
    }
  }
}

const userStatusBlocks = document.querySelectorAll(
  '.user-status-block.js-user-status-block.fn-grey6.clearfix.al.mt8.po-r'
);
userStatusBlocks.forEach(block => {
  replaceUserStatusText(block);
});

// New function to handle translations in #addtolist element
function replaceAddToListText(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    node.textContent = node.textContent
      .replace(/Appalling/g, "Провал")
      .replace(/Horrible/g, "Ужасно")
      .replace(/Very Bad/g, "Очень плохо")
      .replace(/Bad/g, "Плохо")
      .replace(/Average/g, "Нормально")
      .replace(/Fine/g, "Неплохо")
      .replace(/Very Good/g, "Очень хорошо")
      .replace(/Good/g, "Хорошо")
      .replace(/Great/g, "Отлично")
      .replace(/Masterpiece/g, "Шедевр")
      .replace(/Select/g, "Нет")
      .replace(/Dropped/g, "Брошено")
      .replace(/On-Hold/g, "Отложено")
      .replace(/Watching/g, "Смотрю")
      .replace(/Plan to Watch/g, "Запланировано")
      .replace(/Completed/g, "Просмотрено")
      .replace(/Status:/g, "Статус:")
      .replace(/Eps Seen:/g, "Прогресс:")
      .replace(/Your Score:/g, "Оценка:")
      .replace(/Edit Details/g, "Редактировать");
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    for (let child of node.childNodes) {
      replaceAddToListText(child);
    }

    // Target the specific input button and change its value
    const updateButton = node.querySelector('input[name="myinfo_submit"]');
    if (updateButton && updateButton.classList.contains('js-anime-update-button')) {
      updateButton.value = "Обновить";
    }
  }
}

// Process #addtolist div
const addToListElement = document.getElementById('addtolist');
if (addToListElement) {
  replaceAddToListText(addToListElement);
}

// New functionality to replace text in .notice_open_public
function replaceNoticeText() {
  const noticeSpans = document.querySelectorAll('.notice_open_public');
  noticeSpans.forEach(span => {
    // Replace all text content in the span
    span.textContent = '* Ваш список публичный по умолчанию.';
  });
}

// Run the new functionality
replaceNoticeText();



