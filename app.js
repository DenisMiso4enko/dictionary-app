const input = document.querySelector(".input");
const dictionaryEl = document.querySelector(".dictionary");
const wordEl = document.querySelector(".word-info__title");
const transcriptionEl = document.querySelector(".word-info__transcription");
const audioEl = document.querySelector(".audio");
const playBtn = document.querySelector(".btn-play");
const listEl = document.querySelector(".dictionary__list");
const linkEl = document.querySelector(".link");

const URL = "https://api.dictionaryapi.dev/api/v2/entries/en/";
let searchQuery = "";

function renderDefinitions(item) {
  return `
  <li class="list__item">${item.definition}</li>
  `;
}

function getDefinitions(definitions) {
  return definitions.map(renderDefinitions).join("");
}

function renderListItem(item) {
  const syn = item.synonyms.join(", ");
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
  console.log(wordData.phonetic);
  wordEl.textContent = wordData.word;
  transcriptionEl.textContent = wordData.phonetic;
  audioEl.src = wordData.audio;
  linkEl.innerHTML = wordData.link;

  renderList(wordData.meanings);
}

async function getWordInfo(url, query) {
  try {
    const request = await fetch(url + query);
    const data = await request.json();
    // if (!request.status.ok) {
    //   templateError(data);
    // }
    showData(data);
  } catch (error) {
    console.log(error);
  }
}
// getWordInfo(URL, "hello");

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
