'use client';
import { useEffect, useState, FC } from 'react';
import './style-yout-sub.css';
import _ from 'lodash';
import { Sub } from './Subtitle';
import { toggleCollapse } from '@/common/common.js';
import MulAI, { MulAIContainerProps } from '@/app/multi-ai/MultiAI';
import StackBtn from '@/app/common/components/StackButton';

// Type definitions
interface YouTubePlayer {
  getPlayerState: () => number;
  getCurrentTime: () => number;
  playVideo: () => void;
  pauseVideo: () => void;
  setSize: (width: number, height: number) => void;
  loadVideoById: (videoId: string, startSeconds: number) => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getVideoUrl: () => string;
}

interface WindowWithYT extends Window {
  YT?: {
    Player: new (elementId: string, options: Record<string, unknown>) => YouTubePlayer;
  };
  onYouTubeIframeAPIReady?: () => void;
}

interface ArrayTimeItem {
  str: string;
  num: number;
  timeS: number;
}

let player: YouTubePlayer | null = null;
let interval: NodeJS.Timeout | null = null;
let oldClickClass: string | null = null;
let isReplay: boolean = true;
let indexOfCurrSub: number = 0;

let customLoopMode: string | null = null;
let customLoopAVal: number | null = null;
let customLoopBVal: number | null = null;
let intervalCusLoop: NodeJS.Timeout | null = null;

let arrTime: string[] = [];
const urlCookieNm: string = 'lis-url';
const subCookieNm: string = 'lis-sub';

const YoutubeSub: FC = () => {
  const MUL_PROP: MulAIContainerProps = {
    heightRes: 180,
    cols: 1,
    configs: [
      { instanceNo: 0, prefix: 'yts', enableHis: 'N', collapse: 'N' },
      // { instanceNo: 1, prefix: 'yts', enableHis: 'N', collapse: 'N' },
      // { instanceNo: 2, prefix: 'yts', enableHis: 'Y', collapse: 'Y' },
    ],
  };

  const REPLAY_NO: string = 'REPLACE_NO';
  const REPLAY_YES: string = 'REPLACE_YES';
  const [arrSub, setArrSub] = useState<Sub[]>([]);
  const [customLoopAs, setCustomLoopAs] = useState<string>('');
  const [customLoopBs, setCustomLoopBs] = useState<string>('');
  const [size, setSize] = useState<number>(390 / 2);
  const [subHeight, setSubHeight] = useState<number>(300);
  const [modeReplay] = useState<string>(REPLAY_NO);
  const [url, setUrl] = useState<string>('');

  const LOOP_CUSTOM: string = 'LOOP_CUSTOM';
  const NOT_VALUE_TIME: number = 1;
  const FIXED_VALUE: number = 3;

  useEffect((): (() => void) => {
    if (!_.isEmpty(localStorage)) {
      setUrl(localStorage.getItem(urlCookieNm) || '');
    }

    const windowWithYT = window as WindowWithYT;
    if (!windowWithYT.YT) {
      // If not, load the script asynchronously
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';

      windowWithYT.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;

      const firstScriptTag = document.getElementsByTagName('script')[0];
      if (firstScriptTag?.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      }
    } else {
      // If script is already there, load the video directly
      onYouTubeIframeAPIReady();
    }
    const cusLoopControl = document.getElementById(`cus-loop-control`);
    if (cusLoopControl) {
      cusLoopControl.style.display = 'block';
    }
    const timemisuEl = document.getElementById(`timemisus`) as HTMLInputElement;
    if (timemisuEl) {
      timemisuEl.value = '2';
    }
    customLoopMode = LOOP_CUSTOM;
    customLoopAVal = NOT_VALUE_TIME;
    customLoopBVal = NOT_VALUE_TIME;
    return () => {
      if (interval) clearInterval(interval);
      if (intervalCusLoop) clearInterval(intervalCusLoop);
    };
  }, []);
  useEffect((): void => {
    if (_.isEmpty(arrSub)) {
      const sublineControl = document.getElementById('subline-control');
      if (sublineControl) {
        sublineControl.style.display = 'none';
      }
    } else {
      const sublineControl = document.getElementById('subline-control');
      if (sublineControl) {
        sublineControl.style.display = 'block';
      }
    }
  }, [arrSub]);

  useEffect((): void => {
    localStorage.setItem(urlCookieNm, url);
  }, [url]);

  const handleBlurA = (): void => {
    if (customLoopAs) {
      customLoopAVal = Number(customLoopAs);
      if (intervalCusLoop) clearInterval(intervalCusLoop);
      createInteval();
    }
  };
  const handleBlurB = (): void => {
    if (customLoopBs) {
      customLoopBVal = Number(customLoopBs);
      if (intervalCusLoop) clearInterval(intervalCusLoop);
      createInteval();
    }
  };

  const changeTimeLoop = (isStart: boolean, isCre: boolean): void => {
    const SECOND_UNIT: number = 0.1;
    if (isStart) {
      let value = (Number(customLoopAs) + (isCre ? SECOND_UNIT : -SECOND_UNIT)).toFixed(
        FIXED_VALUE,
      );
      setCustomLoopAs(value);
      if (intervalCusLoop) clearInterval(intervalCusLoop);
      customLoopAVal = Number(value);
      createInteval();
    } else {
      let value = (Number(customLoopBs) + (isCre ? SECOND_UNIT : -SECOND_UNIT)).toFixed(
        FIXED_VALUE,
      );
      setCustomLoopBs(value);
      if (intervalCusLoop) clearInterval(intervalCusLoop);
      customLoopBVal = Number(value);
      createInteval();
    }
  };

  useEffect((): void => {
    const subControl = document.getElementById(`sub-control`);
    if (subControl) {
      subControl.style.height = `${subHeight}px`;
    }
  }, [subHeight]);

  const handleSizeChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    let valueSz = Number(event.target.value);
    setSize(valueSz);
    if (player) {
      player.setSize(valueSz * 1.7, valueSz);
    }
  };
  const onYouTubeIframeAPIReady = (): void => {
    const windowWithYT = window as WindowWithYT;
    if (!windowWithYT.YT) return;

    player = new windowWithYT.YT.Player('player', {
      height: 390 / 1.6,
      width: 640 / 1.6,
      videoId: '',
      playerVars: {
        fs: 0,
        iv_load_policy: 3,
        playsinline: 1,
        modestbranding: 0,
        // controls: 0
      },
      events: {
        onReady: onPlayerReady,
      },
    });
  };
  const onPlayerReady = (event: { target: YouTubePlayer }): void => {
    event.target.playVideo();

    interval = setInterval((): void => {
      if (!player || player?.getPlayerState() !== 1) return;
      let currTime = player.getCurrentTime().toString();
      if (currTime.includes('.')) {
        currTime = currTime.substring(0, currTime.lastIndexOf('.'));
      }

      let min = Math.floor(player.getCurrentTime() / 60);
      let sec = Math.floor(player.getCurrentTime() % 60);
      let hour = 0;
      if (min > 60) {
        hour = Math.floor(min / 60);
        min = Math.floor(min % 60);
      }
      let mmss: string = sec > 9 ? `${min}:${sec}` : `${min}:0${sec}`;
      if (hour > 0) {
        if (mmss.length < 5) {
          mmss = `0${mmss}`;
        }
        mmss = `${hour}:${mmss}`;
      }
      let currentSubEle: HTMLElement | null = null;
      let offsetOgr = document.getElementById(`sub-item0:00`);
      let arrTimeNums: ArrayTimeItem[] = arrTime.map((itm: string) => {
        return {
          str: itm,
          num: Number(itm.replaceAll(':', '')),
          timeS: toSeconds(itm),
        };
      });

      let currTm = Number(`${mmss}`.replaceAll(':', ''));
      for (let i = 0; i < arrTimeNums.length; i++) {
        if (currTm < arrTimeNums[i].num) {
          let oldClass = document.getElementById(`${oldClickClass}`);
          if (oldClass) {
            oldClass.classList.remove('active');
            oldClass.style.background = 'transparent';
          }
          mmss = arrTimeNums[i >= 1 ? i - 1 : i].str;
          currentSubEle = document.getElementById(`sub-item${mmss}`);
          if (currentSubEle) {
            currentSubEle.classList.add('active');
            oldClickClass = `sub-item${mmss}`;

            if (i > 0) {
              let percentBar: number = 100;
              let periodLoop = arrTimeNums[i].timeS - arrTimeNums[i - 1].timeS;
              let passedTime = player.getCurrentTime() - arrTimeNums[i - 1].timeS;
              percentBar =
                periodLoop === 0 ? 0 : Number(((passedTime / periodLoop) * 100).toFixed(0));
              currentSubEle.style.setProperty(
                'background',
                `linear-gradient(to right, #a6a6a6 ${Math.abs(percentBar == 0 ? 10 : percentBar)}%, transparent 0)`,
                'important',
              );
            }
          }

          break;
        }
      }

      if (currentSubEle && offsetOgr) {
        let MINUS_TOP = (document.getElementById(`sub-control`)?.offsetHeight || 0) / 3;
        let distanTop = offsetOgr ? offsetOgr.offsetTop : 0;
        var scrollDiv = currentSubEle.offsetTop - distanTop - MINUS_TOP;
        let subControl = document.getElementById('sub-control');
        if (subControl) {
          subControl.scrollTo({ top: scrollDiv, behavior: 'smooth' });
        }
      }
    }, 200);
  };

  function toSeconds(timeStr: string): number {
    const parts = timeStr.split(':').map(Number);

    if (parts.length === 1) {
      // SS
      return parts[0];
    } else if (parts.length === 2) {
      // MM:SS
      const [m, s] = parts;
      return m * 60 + s;
    } else if (parts.length === 3) {
      // HH:MM:SS
      const [h, m, s] = parts;
      return h * 3600 + m * 60 + s;
    } else {
      throw new Error('Invalid time format');
    }
  }
  const onReplay = (startTime: number): void => {
    if (player) {
      player.seekTo(startTime, true);
    }
  };
  const onProcess = (): void => {
    var txtSrcMedia = (document.getElementById('txtSrcMedia') as HTMLInputElement)?.value || '';
    var url = txtSrcMedia.substring(txtSrcMedia.lastIndexOf('=') + 1, txtSrcMedia.length).trim();
    if (player) {
      player.loadVideoById(url, 0);
    }
  };
  const removeLogo = (): void => {
    var icon = document.querySelectorAll('.ytp-player-content.ytp-iv-player-content');
    if (icon && icon[0]) {
      (icon[0] as HTMLElement).style.display = 'none';
    }
    console.log(
      `document.querySelectorAll(".ytp-player-content.ytp-iv-player-content")[0].style.display="none"`,
    );
    navigator.clipboard.writeText(
      `document.querySelectorAll(".ytp-player-content.ytp-iv-player-content")[0].style.display="none"`,
    );
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      onProcess();
    }
  };
  const onShowHideVideo = (e: React.MouseEvent<HTMLInputElement>): void => {
    let elm = document.getElementById('vd-control');
    if (elm && elm.style.display === 'none') {
      elm.style.display = 'block';
    } else if (elm) {
      elm.style.display = 'none';
    }
  };
  const loopSub = (currtSub: Sub | undefined, nextSub: Sub | undefined): void => {
    const aVal = getTimeFromSub(currtSub);
    const bVal = getTimeFromSub(nextSub);
    customLoopAVal = aVal;
    customLoopBVal = bVal;
    setCustomLoopBs(bVal?.toString() || '');
    setCustomLoopAs(aVal?.toString() || '');
    if (intervalCusLoop) clearInterval(intervalCusLoop);
    createInteval();
  };
  const getTimeFromSub = (sub: Sub | undefined): number => {
    if (!sub) return NOT_VALUE_TIME;
    return Number(
      sub.time
        .split(':')
        .reduce((acc: number, time: string) => 60 * acc + +time)
        .toFixed(FIXED_VALUE),
    );
  };

  const onStartStop = (e: React.MouseEvent<HTMLInputElement>): void => {
    if (!player) return;
    if (player.getVideoUrl() === 'https://www.youtube.com/watch') {
      onProcess();
    }
    if (player.getPlayerState() !== 1) {
      player.playVideo();
    } else {
      player.pauseVideo();
    }
    console.log(player);
  };

  const previous = (): void => {
    if (!player) return;
    let currTime = player.getCurrentTime();
    let timemisus = (document.getElementById('timemisus') as HTMLInputElement)?.value || '2';
    onReplay(Number(currTime - Number(timemisus)));
  };
  const next = (): void => {
    if (!player) return;
    let currTime = player.getCurrentTime();
    let timemisus = (document.getElementById('timemisus') as HTMLInputElement)?.value || '2';
    onReplay(Number(currTime + Number(timemisus)));
  };
  const changeTime = (): void => {
    let timemisuEl = document.getElementById('timemisus') as HTMLInputElement;
    if (!timemisuEl) return;
    let timemisus = timemisuEl.value;
    if (timemisus == '5') {
      timemisuEl.value = '2';
    } else if (timemisus == '2') {
      timemisuEl.value = '3';
    } else if (timemisus == '3') {
      timemisuEl.value = '5';
    } else {
      timemisuEl.value = '3';
    }
  };
  const onControlKey = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    console.log(e.key);
    if (e.key === 'ArrowLeft') {
      previous();
    }
    if (e.key === 'ArrowRight') {
      next();
    }
    if (e.key === 'ArrowDown') {
      onStartStop(e as unknown as React.MouseEvent<HTMLInputElement>);
    }
    if (e.key === 'ArrowUp') {
      changeTime();
    }
    if (e.key === 'Shift') {
      onAddPoint();
    }
    if (e.key === 'Control') {
      onClearCusLoop();
    }
    if (e.key === '.') {
      changeTimeLoop(false, false);
    }
    if (e.key === '/') {
      changeTimeLoop(false, true);
    }
    if (e.key === ';') {
      changeTimeLoop(true, false);
    }
    if (e.key === "'") {
      changeTimeLoop(true, true);
    }
  };

  const onClearCusLoop = (): void => {
    customLoopAVal = NOT_VALUE_TIME;
    customLoopBVal = NOT_VALUE_TIME;
    setCustomLoopAs('');
    setCustomLoopBs('');
  };
  const onAddPoint = (): void => {
    if (!player) return;
    if (customLoopAVal !== NOT_VALUE_TIME && customLoopBVal !== NOT_VALUE_TIME) {
      onClearCusLoop();
    }

    if (customLoopAVal === NOT_VALUE_TIME) {
      customLoopAVal = Number(player.getCurrentTime().toFixed(FIXED_VALUE));
      setCustomLoopAs(customLoopAVal.toString());
      console.log('destroy intervalCusLoop:' + intervalCusLoop);
      if (intervalCusLoop) clearInterval(intervalCusLoop);
    } else if (customLoopBVal === NOT_VALUE_TIME) {
      customLoopBVal = Number(player.getCurrentTime().toFixed(FIXED_VALUE));
      setCustomLoopBs(customLoopBVal.toString());
      if (
        isReplay === true &&
        customLoopAVal !== null &&
        customLoopAVal > 1 &&
        customLoopBVal !== null &&
        customLoopBVal > 1
      ) {
        createInteval();
      }
    }
  };

  const createInteval = (): void => {
    if (!player || customLoopAVal === null || customLoopBVal === null) return;
    let periodLoop = customLoopBVal - customLoopAVal;
    onReplay(customLoopAVal);
    intervalCusLoop = setInterval((): void => {
      if (customLoopAVal == NOT_VALUE_TIME || customLoopBVal == NOT_VALUE_TIME) {
        if (intervalCusLoop) clearInterval(intervalCusLoop);
        return;
      }
      if (_.isEqual(customLoopMode, LOOP_CUSTOM)) {
        if (isReplay === true) {
          console.log('replay at:' + customLoopAVal);
          if (customLoopAVal !== null) {
            onReplay(customLoopAVal);
          }
        }
      }
    }, periodLoop * 1000);
  };
  return (
    <div className="yt-sub" id="main-content" tabIndex={0} onKeyDown={(e) => onControlKey(e)}>
      <div id="maincontent-yt" className="">
        <input
          type="range"
          className="range-input"
          id="size"
          name="vol"
          min="0"
          max="1000"
          value={size}
          onChange={handleSizeChange}
        ></input>
        <div id="vd-control">
          <div id="player"></div>
          <br />
        </div>
        <div className="width-100">Control</div>
        <div id="mobile-control" className="bolder">
          {/* <input
            type="submit"
            className="common-btn inline"
            value="Remove Info"
            onClick={() => removeLogo()}
          /> */}
          {/* <input
            type="submit"
            className="common-btn inline"
            value="+/-"
            onClick={() => onShowHideVideo({} as React.MouseEvent<HTMLInputElement>)}
          /> */}
          {/* <br /> */}

          <input
            type="submit"
            className="common-btn inline btn-mobile"
            value="<"
            onClick={() => previous()}
          />
          <input
            type="submit"
            className="common-btn inline btn-mobile"
            value="||"
            onClick={() => onStartStop({} as React.MouseEvent<HTMLInputElement>)}
          />
          <input
            type="submit"
            className="common-btn inline btn-mobile"
            value=">"
            onClick={() => next()}
          />
          <br />

          {/* <br /> */}

          <input
            type="submit"
            className="common-btn inline btn-mobile"
            value="Add point"
            onClick={() => onAddPoint()}
          />
          <input
            type="submit"
            className="common-btn inline btn-mobile"
            value="clear"
            onClick={() => onClearCusLoop()}
          />
          <br />
          <br />
          <input type="number" className="common-input input-mobile" id="timemisus" />
          <input
            type="submit"
            className="common-btn inline btn-mobile"
            value="Change"
            onClick={() => changeTime()}
          />
          <br />
          <br />

          <input
            type="text"
            id="txtSrcMedia"
            className="common-input"
            value={url}
            onKeyDown={(e) => handleKeyDown(e)}
            onChange={(event) => {
              setUrl(event.target.value);
            }}
          />
          <input
            type="submit"
            className="common-btn inline"
            value="Load"
            id="btnExecute"
            onClick={() => onProcess()}
          />
          <div id="cus-loop-control">
            <input
              className="common-input width-100"
              type="text"
              value={customLoopAs}
              onChange={(event) => {
                setCustomLoopAs(event.target.value);
              }}
              onBlur={handleBlurA}
            />
            <StackBtn
              onUp={() => changeTimeLoop(true, true)}
              onDown={() => changeTimeLoop(true, false)}
            ></StackBtn>
            <span>-</span>
            <input
              type="text"
              className="common-input width-100"
              value={customLoopBs}
              onChange={(event) => {
                setCustomLoopBs(event.target.value);
              }}
              onBlur={handleBlurB}
            />
            <StackBtn
              onUp={() => changeTimeLoop(false, true)}
              onDown={() => changeTimeLoop(false, false)}
            ></StackBtn>
          </div>
        </div>

        <div className="width-100" onClick={() => toggleCollapse('mul-ai')}>
          Mul-AI
        </div>
      </div>

      <div id="mul-ai" className="collapse-content bolder">
        <MulAI {...MUL_PROP}></MulAI>
      </div>
    </div>
  );
};
export default YoutubeSub;
