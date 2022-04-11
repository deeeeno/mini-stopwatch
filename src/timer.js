import Stopwatch from './stopwatch.js';

export default class Timer{
  stopWatch;
  timerEl;
  lapResetBtnEl;
  lapResetBtnLabelEl;
  startStopBtnEl;
  startStopBtnLabelEl;
  lapsEl;

  minLap;
  maxLap;

  lapList;

  timerInterval;

  isPlay;
  

  constructor(){
    this.stopWatch = new Stopwatch();
    this.isPlay = false;
    this.lapList = [];
    this.minLap = [0,Infinity];
    this.maxLap = [0,0];
    
    this.setElement();
    this.setEventHandler();
  }
  setElement(){
    this.timerEl = document.getElementById('timer');
    this.lapResetBtnEl = document.getElementById('lap-reset-btn');
    this.lapResetBtnLabelEl = document.getElementById('lap-reset-btn-label');
    this.startStopBtnEl = document.getElementById('start-stop-btn');
    this.startStopBtnLabelEl = document.getElementById('start-stop-btn-label');
    this.lapsEl = document.getElementById('laps');
  }
  setEventHandler(){
    this.startStopBtnEl.addEventListener('click',this.onClickStartStopBtn.bind(this));
    this.lapResetBtnEl.addEventListener('click',this.onClickLapResetBtn.bind(this));
    document.addEventListener('keydown',this.onKeyDown.bind(this));
  }
  onKeyDown(e){
    if(/s|S|ㄴ/.test(e.key)){
      this.startStopBtnEl.click();
    }else if(/l|L|ㅣ/.test(e.key)){
      this.lapResetBtnEl.click();
    }
  }
  onClickLapResetBtn(){
    if(this.isPlay){
      //재생중이면 랩버튼
      const lap = this.stopWatch.createLap();
      const lapEl = this.createLapLi(lap);

      this.lapList.unshift(lap);
      this.lapsEl.prepend(lapEl);
      this.lapsEl.querySelector('.text-red-600')?.classList.remove('text-red-600');
      this.lapsEl.querySelector('.text-green-600')?.classList.remove('text-green-600');
      const [maxLap,minLap] = this.getLapMinMax();
      this.lapsEl.querySelector(`#lap-${maxLap}`)?.classList.add('text-red-600');
      this.lapsEl.querySelector(`#lap-${minLap}`)?.classList.add('text-green-600');

    }else{
      //일시정지 중이면 리셋버튼.
      this.stopWatch.reset();
      this.timerEl.innerHTML = this.getTimerByCenti(this.stopWatch.centisecond);
      this.lapsEl.innerHTML = '';
    }
  }
  onClickStartStopBtn(){
    this.isPlay = !this.isPlay;
    
    this.startStopBtnEl.classList.toggle('bg-green-600',!this.isPlay);
    this.startStopBtnEl.classList.toggle('bg-red-600',this.isPlay);
    this.startStopBtnLabelEl.innerHTML = (this.isPlay) ? '중단':'시작';
    this.lapResetBtnLabelEl.innerHTML = (this.isPlay) ? '랩':'리셋';
    if(this.isPlay){
      this.stopWatch.start();
      this.timerInterval = setInterval(()=>{
        this.timerEl.innerHTML = this.getTimerByCenti(this.stopWatch.centisecond);
      });
    }else{
      this.stopWatch.pause();
      clearInterval(this.timerInterval);
    }
  }
  createLapLi(lap){
    const li = document.createElement('li');
    li.id = `lap-${lap[1]}`;
    li.className = 'flex justify-between py-2 px-3 border-b-2';
    li.innerHTML = `
      <span>랩 ${lap[0]}</span>
      <span>${this.getTimerByCenti(lap[1])}</span>
    `;
    return li;
  }
  getTimerByCenti(centiSecond){
    const ms = centiSecond%100;
    const ss = Math.floor(centiSecond/100);
    const h = Math.floor(ss/60);
    const s = ss%60;

    return `${this.paddingZero(h)}:${this.paddingZero(s)}.${this.paddingZero(ms)}`;
  }
  paddingZero(num){
    //한자리수면 앞에 0 패딩함
    if((''+num).length === 1)
        return '0'+num;
    else
        return ''+num;
  }
  getLapMinMax(){
    
    if(this.lapList.length===1) 
      return [this.lapList[0][1],0];
    const lapSecondList = this.lapList.map((el)=>el[1]);
    return [Math.max(...lapSecondList),Math.min(...lapSecondList)];
  }
}