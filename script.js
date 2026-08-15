const q=document.getElementById('questionScreen');
const d=document.getElementById('dateScreen');
const c=document.getElementById('cardsScreen');
const no=document.getElementById('noBtn');
const hint=document.getElementById('noHint');

const iconReset=document.createElement('style');

iconReset.textContent=`
  #songCard .card-icon::before,#songCard .card-icon::after,
  #letterCard .card-icon::before,#letterCard .card-icon::after,
  #cardsScreen .card .card-icon::before,#cardsScreen .card .card-icon::after,
  .date-btn .date-icon::before,.date-btn .date-icon::after,
  .date-btn span:last-child::before,.date-btn span:last-child::after{
    content:none!important;
    animation:none!important;
  }

  #songCard .card-icon,#letterCard .card-icon,#cardsScreen .card .card-icon,
  .date-btn .date-icon,.date-btn span:last-child{
    animation:none!important;
  }
`;

document.head.append(iconReset);

function animateIcon(icon,delay=0){
  icon.getAnimations().forEach(animation=>animation.cancel());
  icon.style.transform='rotate(45deg)';

  icon.animate([
    {
      transform:'rotate(45deg) scale(1)',
      boxShadow:'inset 0 0 0 1px rgba(255,255,255,.45),0 5px 14px rgba(0,0,0,.24)'
    },
    {
      transform:'rotate(45deg) scale(1.13)',
      boxShadow:'inset 0 0 0 1px rgba(255,255,255,.9),0 0 20px rgba(255,255,255,.22)'
    },
    {
      transform:'rotate(45deg) scale(1)',
      boxShadow:'inset 0 0 0 1px rgba(255,255,255,.45),0 5px 14px rgba(0,0,0,.24)'
    }
  ],{
    duration:1700,
    delay,
    iterations:Infinity,
    easing:'ease-in-out'
  });
}

function buildGothicIcon(icon,type,delay=0,size=52){
  icon.replaceChildren();

  Object.assign(icon.style,{
    width:`${size}px`,
    height:`${size}px`,
    flex:`0 0 ${size}px`,
    position:'relative',
    overflow:'visible',
    display:'grid',
    placeItems:'center',
    borderRadius:size===52?'16px':'50%',
    background:'transparent',
    color:'#eeeae6',
    fontSize:'0',
    lineHeight:'1',
    boxShadow:'inset 0 0 0 1px rgba(255,255,255,.45),0 5px 14px rgba(0,0,0,.24)'
  });

  if(type==='gift'){
    const box=document.createElement('span');

    Object.assign(box.style,{
      position:'absolute',
      left:'50%',
      top:'50%',
      width:size===52?'19px':'15px',
      height:size===52?'14px':'11px',
      border:'1.5px solid #eeeae6',
      borderRadius:'2px',
      background:'linear-gradient(90deg,transparent 44%,#eeeae6 45% 55%,transparent 56%)',
      transform:'translate(-50%,-50%) rotate(-45deg)'
    });

    const bow=document.createElement('span');
    bow.textContent='⋈';

    Object.assign(bow.style,{
      position:'absolute',
      left:'50%',
      top:size===52?'4px':'1px',
      color:'#eeeae6',
      font:`${size===52?'22px':'17px'}/1 Georgia,serif`,
      transform:'translateX(-50%) rotate(-45deg)'
    });

    icon.append(box,bow);
  }else{
    const glyph=document.createElement('span');
    glyph.textContent=type==='music'?'♫':'✦';

    Object.assign(glyph.style,{
      display:'block',
      color:'#eeeae6',
      font:`${type==='music'?(size===52?'28px':'24px'):(size===52?'31px':'27px')}/1 "Playfair Display",Georgia,serif`,
      transform:'rotate(-45deg)'
    });

    icon.appendChild(glyph);
  }

  animateIcon(icon,delay);
}

let clicks=0;

const hints=[
  'Ты уверена?',
  'Может, всё-таки да?',
  'Я бы подумал ещё раз…',
  'Может, всё-таки да?',
  'Последний шанс 🖤'
];

no.onclick=()=>{
  clicks++;
  no.style.transform='scale(1)';
  no.style.opacity='1';
  hint.textContent=hints[Math.min(clicks-1,hints.length-1)];
};

document.getElementById('yesBtn').onclick=()=>{
  q.classList.add('out');

  setTimeout(()=>{
    q.style.display='none';
    d.style.display='flex';
  },650);
};

let selectedDate='';
const dateButtons=[...document.querySelectorAll('.date-btn')];

dateButtons.forEach((button,index)=>{
  let icon=[...button.children].find(child=>
    /^[♡♥✎✦]$/.test(child.textContent.trim())
  );

  if(!icon&&button.children.length>1){
    icon=button.lastElementChild;
  }

  if(!icon){
    icon=document.createElement('span');
    button.appendChild(icon);
  }

  buildGothicIcon(icon,'star',index*180,32);

  button.onclick=()=>{
    selectedDate=button.dataset.date;

    if(selectedDate==='Свой вариант'){
      const customDate=prompt('Какую дату ты хочешь?');
      if(!customDate)return;

      selectedDate=customDate;
    }

    dateButtons.forEach(item=>item.classList.remove('selected'));
    button.classList.add('selected');
    document.getElementById('continueBtn').classList.add('ready');
  };
});

buildGothicIcon(document.querySelector('#songCard .card-icon'),'music',0,52);
buildGothicIcon(document.querySelector('#letterCard .card-icon'),'gift',180,52);

const finalCards=[...document.querySelectorAll('#cardsScreen .card')];

const dateCard=
  finalCards.find(card=>/наша дата/i.test(card.textContent))||
  finalCards.at(-1);

if(dateCard?.querySelector('.card-icon')){
  buildGothicIcon(dateCard.querySelector('.card-icon'),'star',360,52);
}

const cardsTitle=document.querySelector('#cardsScreen h1');

if(cardsTitle){
  Object.assign(cardsTitle.style,{
    fontFamily:'"Playfair Display", Georgia, serif',
    fontSize:'clamp(31px, 8vw, 43px)',
    lineHeight:'1.15',
    fontWeight:'500',
    letterSpacing:'normal',
    color:'#121214',
    background:'transparent',
    border:'0',
    boxShadow:'none',
    padding:'0'
  });
}

document.getElementById('continueBtn').onclick=()=>{
  document.getElementById('chosenDateText').textContent='Ты выбрала: '+selectedDate;
  document.getElementById('dateCardText').textContent='Наш день — '+selectedDate;

  fetch(
    'https://script.google.com/macros/s/AKfycbxThX3Q4Fo29BiuMcl7l2gqtkBY8hcslQ8JKbGZB32Efsqn8eup26ByZqmtpGZCtoXLBA/exec?answer=Да&date='+encodeURIComponent(selectedDate)
  ).catch(()=>{});

  d.classList.add('out');

  setTimeout(()=>{
    d.style.display='none';
    c.style.display='flex';
  },650);
};

const audio=document.getElementById('audio');
const play=document.getElementById('playBtn');
const bar=document.getElementById('progressBar');
const cur=document.getElementById('currentTime');
const dur=document.getElementById('duration');

let started=false;

function ft(seconds){
  if(!Number.isFinite(seconds))return '—:—';

  return Math.floor(seconds/60)+':'+
    Math.floor(seconds%60).toString().padStart(2,'0');
}

play.onclick=event=>{
  event.stopPropagation();

  if(!started){
    audio.currentTime=50;
    started=true;
  }

  if(audio.paused){
    audio.play()
      .then(()=>play.textContent='Ⅱ')
      .catch(()=>alert('Добавь song.mp3 в репозиторий.'));
  }else{
    audio.pause();
    play.textContent='▶';
  }
};

audio.onloadedmetadata=()=>{
  dur.textContent=ft(audio.duration);
};

audio.ontimeupdate=()=>{
  const total=Math.max(1,audio.duration-50);
  const elapsed=Math.max(0,audio.currentTime-50);

  bar.style.width=Math.min(100,elapsed/total*100)+'%';
  cur.textContent=ft(audio.currentTime);
};

audio.onended=()=>{
  play.textContent='▶';
  started=false;
};

document.getElementById('songCard').onclick=event=>{
  if(!event.target.closest('button')){
    play.click();
  }
};

const text=`Несколько слов от тебя, моя любимая Алина, меняют моё настроение.

Да, ты можешь делать со мной всё что угодно. И завтра может быть и не завтра — я непременно умру, если звук твоего голоса и нежное прикосновение твоих губ не вдохнут в меня жизнь.

До конца дней своих я желал бы тебя и твой красивый голосок. Отдай мне шанс прикоснуться к твоей душе — и я непременно буду оберегать её, как оберегаю своё сердце и разум свой для тебя.`;

let timer;

document.getElementById('letterCard').onclick=()=>{
  document.getElementById('letterOverlay').classList.add('show');

  const writing=document.getElementById('handwriting');
  writing.textContent='';

  clearInterval(timer);

  let i=0;

  timer=setInterval(()=>{
    writing.textContent+=text[i++];

    if(i>=text.length){
      clearInterval(timer);
    }
  },38);
};

document.getElementById('closeLetter').onclick=()=>{
  document.getElementById('letterOverlay').classList.remove('show');
};
