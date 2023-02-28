const input = document.querySelector(".input");
const dictionaryContainer = document.querySelector(".dictionary__container");

const URL = "https://api.dictionaryapi.dev/api/v2/entries/en/";
let searchQuery = "";

function renderTemplate(element) {
  dictionaryContainer.innerHTML = element;
}
function renderError(el) {
  dictionaryContainer.innerHTML = el;
}
function renderList() {
  const list = document.querySelector(".list");
  console.log(list);
}

function templateListItem(item) {
  const htmlListItem = `
    <li class="list__item">${item}</li>
    `;
  renderList();
}

function templateError({ message, title }) {
  const htmlError = `
    <div class="error">
        <h2>${title}</h2>
        <p>${message}</p>
    </div>
    `;

  renderError(htmlError);
}

function template(data) {
  const wordData = {
    word: data[0].word,
    phonetic: data[0].phonetic || data[0].phonetics.map((el) => el.text),
    audio: data[0].phonetics.map((el) => el.audio).find((el) => el.length > 1),
    meanings: data[0].meanings,
  };
  wordData.meanings.forEach((elem) => {
    const deep = elem.definitions;
    deep.forEach((elem) => {
      console.log(elem.definition);
      templateListItem();
    });
  });
  console.log(wordData);
  const htmlTemplate = `
    <div class="dictionary__head">
        <div class="word-info">
            <h1 class="word-info__title">${wordData.word}</h1>
            <p class="word-info__transcription">${wordData.phonetic}</p>
        </div>
        <div class="player-action">
            <audio class="audio" src=${wordData.audio}></audio>
            <button class="btn btn-play">play</button>
        </div>
    </div>
    <div class="dictionary__noun">
            <h4 class="section-title">noun</h4>
            <h3 class="title">Meaning</h3>
            <ul class="list">
              <li class="list__item">(etc.) A set of keys used to operate a typewriter, computer etc.</li>
              <li class="list__item">A component of many instruments including the piano, organ, and harpsichord consisting of usually black and white keys that cause different tones to be produced when struck.</li>
              <li class="list__item">A device with keys of a musical keyboard, used to control electronic sound-producing devices which may be built into or separate from the keyboard device.</li>
            </ul>
            <h3 class="title">Synonyms <span class="synonyms">electronic kevboard</span></h3>

          </div>
          <div class="dictionary__verb">
            <h4 class="section-title">verb</h4>
            <h3 class="title">Meaning</h3>
            <ul class="list">
              <li class="list__item">(etc.) A set of keys used to operate a typewriter, computer etc. <br>
                <p class="meaning-span">"Keyboarding is the part of this job I hate the most."</p></li>
            </ul>
          </div>
          <div class="dictionary__source">
            <p>Source</p>
            <a class="link" href="#">https://en.wiktionarv.org/wiki</a>
          </div>
  `;

  renderTemplate(htmlTemplate);
}

async function getWordInfo(url, query) {
  try {
    const request = await fetch(url + query);
    const data = await request.json();
    if (!request.status.ok) {
      templateError(data);
    }

    template(data);
  } catch (error) {
    console.log(error);
  }
}

input.addEventListener("input", (e) => {
  searchQuery = e.target.value;
});
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && searchQuery.toLocaleLowerCase().trim().length > 0) {
    getWordInfo(URL, searchQuery);
  } else {
    return;
  }
});

// play audio
dictionaryContainer.addEventListener("click", (e) => {
  if (!e.target.classList.contains("btn-play")) return;
  const parent = e.target.parentNode;
  const audio = parent.querySelector(".audio");
  audio.play();
});
