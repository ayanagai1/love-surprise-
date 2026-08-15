const q=document.getElementById('questionScreen'),d=document.getElementById('dateScreen'),c=document.getElementById('cardsScreen');
const no=document.getElementById('noBtn'),hint=document.getElementById('noHint');
let clicks=0;
const hints=["Ты уверена?","Может, всё-таки да?","Я бы подумал ещё раз…","Нет становится всё меньше.","Последний шанс 🖤"];

no.onclick=()=>{
  clicks++;
  const scale=Math.max(.82,1-clicks*.05);
  no.style.transform=`scale(${scale})`;
  no.style.opacity=Math.max(.88,1-clicks*.03);
  hint.textContent=hints[Math.min(clicks-1,hints.length-1)];
  if(clicks>=5){
    no.classList.add('is-last-chance');
    no.style.transform='scale(.82)';
    no.style.opacity='.9';
  }
};

document.getElementById('yesBtn').onclick=()=>{q.classList.add('out');setTimeout(()=>{q.style.display='none';d.style.display='flex'},650)};

let selectedDate='';
document.querySelectorAll('.date-btn').forEach((button,index)=>{
  const oldIcon=button.lastElementChild;
  if(oldIcon&&oldIcon.tagName==='SPAN'){
    oldIcon.textContent='♥';
    oldIcon.classList.add('date-heart');
    oldIcon.setAttribute('aria-hidden','true');
  }else{
    const heart=document.createElement('span');
    heart.className='date-heart';
    heart.textContent='♥';
    heart.setAttribute('aria-hidden','true');
    button.appendChild(heart);
  }
  button.style.setProperty('--heart-delay',`${index*.18}s`);
  button.onclick=()=>{
    selectedDate=button.dataset.date;
    if(selectedDate==='Свой вариант'){
      const customDate=prompt('Какую дату ты хочешь?');
      if(!customDate)return;
      selectedDate=customDate;
    }
    document.querySelectorAll('.date-btn').forEach(item=>item.classList.remove('selected'));
    button.classList.add('selected');
    document.getElementById('continueBtn').classList.add('ready');
  };
});

document.getElementById('continueBtn').onclick=()=>{
  document.getElementById('chosenDateText').textContent='Ты выбрала: '+selectedDate;
  document.getElementById('dateCardText').textContent='Наш день — '+selectedDate;
  fetch('https://script.google.com/macros/s/AKfycbxThX3Q4Fo29BiuMcl7l2gqtkBY8hcslQ8JKbGZB32Efsqn8eup26ByZqmtpGZCtoXLBA/exec?answer=Да&date='+encodeURIComponent(selectedDate)).catch(()=>{});
  d.classList.add('out');
  setTimeout(()=>{d.style.display='none';c.style.display='flex'},650);
};

const audio=document.getElementById('audio'),play=document.getElementById('playBtn'),bar=document.getElementById('progressBar'),cur=document.getElementById('currentTime'),dur=document.getElementById('duration');
let started=false;
function ft(seconds){if(!Number.isFinite(seconds))return '—:—';return Math.floor(seconds/60)+':'+Math.floor(seconds%60).toString().padStart(2,'0')}
play.onclick=event=>{event.stopPropagation();if(!started){audio.currentTime=50;started=true}if(audio.paused){audio.play().then(()=>play.textContent='Ⅱ').catch(()=>alert('Добавь song.mp3 в репозиторий.'))}else{audio.pause();play.textContent='▶'}};
audio.onloadedmetadata=()=>dur.textContent=ft(audio.duration);
audio.ontimeupdate=()=>{const total=Math.max(1,audio.duration-50),elapsed=Math.max(0,audio.currentTime-50);bar.style.width=Math.min(100,elapsed/total*100)+'%';cur.textContent=ft(audio.currentTime)};
audio.onended=()=>{play.textContent='▶';started=false};
document.getElementById('songCard').onclick=event=>{if(!event.target.closest('button'))play.click()};

const text=`Несколько слов от тебя, моя любимая Алина, меняют моё настроение.

Да, ты можешь делать со мной всё что угодно. И завтра может быть и не завтра — я непременно умру, если звук твоего голоса и нежное прикосновение твоих губ не вдохнут в меня жизнь.

До конца дней своих я желал бы тебя и твой красивый голосок. Отдай мне шанс прикоснуться к твоей душе — и я непременно буду оберегать её, как оберегаю своё сердце и разум свой для тебя.`;
let timer;
document.getElementById('letterCard').onclick=()=>{document.getElementById('letterOverlay').classList.add('show');const writing=document.getElementById('handwriting');writing.textContent='';clearInterval(timer);let i=0;timer=setInterval(()=>{writing.textContent+=text[i++];if(i>=text.length)clearInterval(timer)},38)};
document.getElementById('closeLetter').onclick=()=>document.getElementById('letterOverlay').classList.remove('show');
