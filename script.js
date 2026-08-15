const q=document.getElementById('questionScreen'),d=document.getElementById('dateScreen'),c=document.getElementById('cardsScreen');
const no=document.getElementById('noBtn'),hint=document.getElementById('noHint');
let clicks=0;
const hints=["Ты уверена?","Может, всё-таки да?","Я бы подумал ещё раз…","Нет становится всё меньше.","Кажется, выбора почти не осталось.","Последний шанс 🖤"];
no.onclick=()=>{clicks++;let s=Math.max(.08,1-clicks*.15);no.style.transform=`scale(${s})`;no.style.opacity=s;no.style.padding=`${Math.max(4,15-clicks*2)}px ${Math.max(6,25-clicks*3)}px`;hint.textContent=hints[Math.min(clicks-1,hints.length-1)];if(clicks>=7){no.style.display="none";hint.textContent="Вот теперь остаётся только один вариант."}};
document.getElementById('yesBtn').onclick=()=>{q.classList.add('out');setTimeout(()=>{q.style.display="none";d.style.display="flex"},650)};

let selectedDate="";
document.querySelectorAll('.date-btn').forEach(b=>b.onclick=()=>{selectedDate=b.dataset.date;if(selectedDate==="Свой вариант"){let x=prompt("Какую дату ты хочешь?");if(!x)return;selectedDate=x}document.querySelectorAll('.date-btn').forEach(z=>z.classList.remove('selected'));b.classList.add('selected');document.getElementById('continueBtn').classList.add('ready')});
document.getElementById('continueBtn').onclick=()=>{
  document.getElementById('chosenDateText').textContent="Ты выбрала: "+selectedDate;
  document.getElementById('dateCardText').textContent="Наш день — "+selectedDate;

  fetch("https://script.google.com/macros/s/AKfycbxThX3Q4Fo29BiuMcl7l2gqtkBY8hcslQ8JKbGZB32Efsqn8eup26ByZqmtpGZCtoXLBA/exec?answer=Да&date="+encodeURIComponent(selectedDate))
    .catch(()=>{});

  d.classList.add('out');
  setTimeout(()=>{
    d.style.display="none";
    c.style.display="flex";
  },650);
};

const audio=document.getElementById('audio'),play=document.getElementById('playBtn'),bar=document.getElementById('progressBar'),cur=document.getElementById('currentTime'),dur=document.getElementById('duration');let started=false;
function ft(s){if(!Number.isFinite(s))return"—:—";return Math.floor(s/60)+":"+Math.floor(s%60).toString().padStart(2,"0")}
play.onclick=e=>{e.stopPropagation();if(!started){audio.currentTime=50;started=true}if(audio.paused){audio.play().then(()=>play.textContent="Ⅱ").catch(()=>alert("Добавь song.mp3 в репозиторий."))}else{audio.pause();play.textContent="▶"}};
audio.onloadedmetadata=()=>dur.textContent=ft(audio.duration);
audio.ontimeupdate=()=>{let total=Math.max(1,audio.duration-50),elapsed=Math.max(0,audio.currentTime-50);bar.style.width=Math.min(100,elapsed/total*100)+"%";cur.textContent=ft(audio.currentTime)};
audio.onended=()=>{play.textContent="▶";started=false};
document.getElementById('songCard').onclick=e=>{if(!e.target.closest("button"))play.click()};

const text=`Несколько слов от тебя, моя любимая Алина, меняют моё настроение.

Да, ты можешь делать со мной всё что угодно. И завтра может быть и не завтра — я непременно умру, если звук твоего голоса и нежное прикосновение твоих губ не вдохнут в меня жизнь.

До конца дней своих я желал бы тебя и твой красивый голосок. Отдай мне шанс прикоснуться к твоей душе — и я непременно буду оберегать её, как оберегаю своё сердце и разум свой для тебя.`;
let timer;
document.getElementById('letterCard').onclick=()=>{document.getElementById('letterOverlay').classList.add('show');let el=document.getElementById('handwriting');el.textContent="";clearInterval(timer);let i=0;timer=setInterval(()=>{el.textContent+=text[i++];if(i>=text.length)clearInterval(timer)},38)};
document.getElementById('closeLetter').onclick=()=>document.getElementById('letterOverlay').classList.remove('show');
