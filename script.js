/* ===== 1) Playlist ===== */
const songs = [
  { title: "Lost in the City Lights", src: "audio/lost-in-city-lights-145038.mp3", cover: "cover-1.jpg" },
  { title: "Forest Lullaby",         src: "audio/forest-lullaby-110624.mp3",      cover: "cover-2.jpg" }
];

/* ===== 2) Estado + elementos ===== */
let current = 0;
const audio = document.getElementById("player");
const titleEl = document.querySelector(".song-title");
const coverEl = document.querySelector(".cover-img");
const playBtn = document.querySelector(".play-btn");
const prevBtn = document.querySelector(".prev-btn");
const nextBtn = document.querySelector(".next-btn");
const bar = document.querySelector(".progress-bar");
const fill = document.querySelector(".progress");

audio.preload = "metadata";

/* ===== 3) Helpers ===== */
const setPlayUI = (on) => {
  playBtn.textContent = on ? "⏸️" : "▶️";
  playBtn.setAttribute("aria-pressed", String(on));
};
const format = s => {
  const m = Math.floor(s/60), ss = Math.floor(s%60).toString().padStart(2,"0");
  return `${m}:${ss}`;
};

/* ===== 4) Core ===== */
function load(i){
  const s = songs[i];
  current = i;
  audio.src = s.src;
  titleEl.textContent = s.title;
  coverEl.src = s.cover;
  coverEl.alt = s.title;
  fill.style.width = "0%";
  setPlayUI(false);
}
async function play(){ try{ await audio.play(); setPlayUI(true);}catch(e){ console.warn(e); setPlayUI(false);} }
function pause(){ audio.pause(); setPlayUI(false); }
function next(){ load((current+1)%songs.length); play(); }
function prev(){ load((current-1+songs.length)%songs.length); play(); }

/* ===== 5) Eventos ===== */
playBtn.addEventListener("click", ()=> audio.paused ? play() : pause());
nextBtn.addEventListener("click", next);
prevBtn.addEventListener("click", prev);

audio.addEventListener("timeupdate", ()=>{
  if(!audio.duration) return;
  fill.style.width = `${(audio.currentTime/audio.duration)*100}%`;
});
audio.addEventListener("ended", next);

// Evitar bucles si hay error de ruta
audio.addEventListener("error", ()=>{
  console.warn("No se pudo cargar:", audio.src);
  pause();
});

// Seek con clic
bar.addEventListener("click", (e)=>{
  if(!audio.duration) return;
  const r = bar.getBoundingClientRect();
  const pct = Math.min(Math.max((e.clientX - r.left)/r.width, 0), 1);
  audio.currentTime = pct * audio.duration;
});

/* ===== 6) Inicio ===== */
load(current);

const left = document.querySelector('.time-left');
const right = document.querySelector('.time-right');

function fmt(s){ const m=Math.floor(s/60), ss=Math.floor(s%60).toString().padStart(2,'0'); return `${m}:${ss}`; }

audio.addEventListener('loadedmetadata', ()=> { right.textContent = fmt(audio.duration || 0); });
audio.addEventListener('timeupdate', ()=> { left.textContent = fmt(audio.currentTime || 0); });
