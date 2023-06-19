const input = document.querySelector(".input");
const dictionaryEl = document.querySelector(".dictionary");
const wordEl = document.querySelector(".word-info__title");
const transcriptionEl = document.querySelector(".word-info__transcription");
const audioEl = document.querySelector(".audio");
const playBtn = document.querySelector(".btn-play");
const listEl = document.querySelector(".dictionary__list");
const linkEl = document.querySelector(".link");
const loaderEl = document.querySelector("#loader")
const messageEl = document.querySelector(".message__title");
const themeCheckEl = document.querySelector("#theme-checkbox");
const URL = "https://api.dictionaryapi.dev/api/v2/entries/en/";
let searchQuery = "";

if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark');
  themeCheckEl.setAttribute("checked", "true")
}

themeCheckEl.addEventListener("change", (e) => {
  if (e.currentTarget.checked) {
    document.body.classList.remove("light");
    document.body.classList.add('dark');
    localStorage.setItem("theme", "dark")
  } else {
    document.body.classList.remove("dark");
    document.body.classList.add("light");
    localStorage.setItem("theme", "light")
  }
});

input.addEventListener("input", (e) => {
  searchQuery = e.target.value;
});
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && searchQuery.toLocaleLowerCase().trim().length > 0) {
    getWordInfo(URL, searchQuery);
  }
});
playBtn.addEventListener("click", () => {
  audioEl.play();
});


function renderDefinitions(item) {
  return `
  <li class="list__item">${item.definition}</li>
  `;
}

function getDefinitions(definitions) {
  return definitions.map(renderDefinitions).join("");
}

function renderListItem(item) {
  const syn = item.synonyms.join(" ");
  return `
    <div class="dictionary__noun">
        <h4 class="section-title">${item.partOfSpeech}</h4>
        <h3 class="title">Meaning</h3>
        <ul class="list">
                ${getDefinitions(item.definitions)}
        </ul>
        <h3 class="title">Synonyms <span class="synonyms">${syn}</span></h3>
    </div>
  `;
}
function renderList(data) {
  dictionaryEl.style.display = "block";
  listEl.innerHTML = "";
  data.forEach((el) => (listEl.innerHTML += renderListItem(el)));
}

function showData(data) {
  const wordData = {
    word: data[0].word,
    phonetic:
      data[0].phonetic || data[0].phonetics.map((el) => el.text).join(" "),
    audio: data[0].phonetics.map((el) => el.audio).find((el) => el.length > 1),
    meanings: data[0].meanings,
    link: data[0].sourceUrls[0],
  };
  messageEl.textContent = "You're word"
  wordEl.textContent = wordData.word;
  transcriptionEl.textContent = wordData.phonetic;
  audioEl.src = wordData.audio;
  linkEl.innerHTML = wordData.link;
  linkEl.setAttribute("href", wordData.link)

  renderList(wordData.meanings);
}

async function getWordInfo(url, query) {
  try {
    loaderEl.style.display = "block"
    const request = await fetch(url + query);
    const data = await request.json();
    if (request.status === 404) {
      Toastify({
        text: `${data.message}`,
        duration: 3000,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background:  "linear-gradient(to right, #ff5f6d, #ffc371)",
        },
        onClick: function(){} // Callback after click
      }).showToast();
    }
    loaderEl.style.display = "none"
    showData(data);
  } catch (error) {
    console.log(error);
  }
}
