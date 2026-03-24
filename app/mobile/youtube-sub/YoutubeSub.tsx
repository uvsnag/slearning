'use client';
import { useEffect, useState, FC } from 'react';
import './style-yout-sub.css';
import _ from 'lodash';
import { Sub } from './Subtitle';
import { toggleCollapse, KEY_YT_CONTROLS, COMMON_PROMPT } from '@/common/common.js';
import MulAI, { MulAIContainerProps } from '@/app/multi-ai/MultiAI';
import StackBtn from '@/app/common/components/StackButton';
import StickyPracticeInput from '../../common/components/sticky/StickyPracticeInput';
import { DataItem, getDataFromExcel } from '@/app/common/hooks/useSheetData';
import { SHEET_AUTO } from '@/app/common/components/SheetDataEditor';

// Type definitions
interface YouTubePlayer {
  getPlayerState: () => number;
  getCurrentTime: () => number;
  getDuration: () => number;
  playVideo: () => void;
  pauseVideo: () => void;
  setSize: (width: number, height: number) => void;
  loadVideoById: (videoId: string, startSeconds: number) => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getVideoUrl: () => string;
  destroy: () => void;
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
const bookmarkTimeNm: string = 'yt-bookmark-time';
const KEY_YT_PLAYER_SIZE: string = 'yt-player-size';
const SOURCE_RANGE = SHEET_AUTO.find((item) => item.name === 'ABoard6')?.range || 'AUTO!U2:W500';

const formatTime = (timeInSeconds: number): string => {
  if (isNaN(timeInSeconds)) {
    return '00:00';
  }
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');
  return `${formattedMinutes}:${formattedSeconds}`;
};

const YoutubeSub: FC = () => {
  const MUL_PROP: MulAIContainerProps = {
    heightRes: 180,
    cols: 1,
    configs: [
      {
        instanceNo: 0,
        prefix: 'yts',
        enableHis: 'N',
        collapse: 'N',
        title: 'Add Excel',
        isSpeak: 'F',
        speakSplitter: `\n`,
        defaultPrompt: COMMON_PROMPT.ADD_EXCEL_ENG,
      },
      // { instanceNo: 1, prefix: 'yts', enableHis: 'N', collapse: 'N' },
      // { instanceNo: 2, prefix: 'yts', enableHis: 'Y', collapse: 'Y' },
    ],
  };

  const REPLAY_NO: string = 'REPLACE_NO';
  const [arrSub, setArrSub] = useState<Sub[]>([]);
  const [customLoopAs, setCustomLoopAs] = useState<string>('');
  const [customLoopBs, setCustomLoopBs] = useState<string>('');
  const [size, setSize] = useState<number>(200);
  const [subHeight, setSubHeight] = useState<number>(300);
  const [url, setUrl] = useState<string>('');
  const [sourceOptions, setSourceOptions] = useState<DataItem[]>([]);
  const [bookmarkTime, setBookmarkTime] = useState<string>('');
  const [ytControls, setYtControls] = useState<string>('0');
  const [videoPercent, setVideoPercent] = useState<number>(0);
  const [duration, setDuration] = useState<string>('');

  const LOOP_CUSTOM: string = 'LOOP_CUSTOM';
  const NOT_VALUE_TIME: number = 1;
  const FIXED_VALUE: number = 3;

  useEffect((): (() => void) => {
    if (!_.isEmpty(localStorage)) {
      setUrl(localStorage.getItem(urlCookieNm) || '');
      setBookmarkTime(localStorage.getItem(bookmarkTimeNm) || '');
      setYtControls(localStorage.getItem(KEY_YT_CONTROLS) || '0');
      const storedSize = Number(localStorage.getItem(KEY_YT_PLAYER_SIZE));
      if (Number.isFinite(storedSize) && storedSize > 0) {
        setSize(storedSize);
      }
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
  useEffect((): void => {
    localStorage.setItem(KEY_YT_PLAYER_SIZE, String(size));
    if (player) {
      player.setSize(size * (16 / 9), size);
    }
  }, [size]);
  useEffect((): void => {
    getDataFromExcel(SOURCE_RANGE, (items: DataItem[]): void => {
      const sources = items.filter((item): boolean => Boolean(item.eng?.trim()));
      setSourceOptions(sources);
    });
  }, []);

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
      if (!customLoopAs) {
        return;
      }
      let value = (Number(customLoopAs) + (isCre ? SECOND_UNIT : -SECOND_UNIT)).toFixed(
        FIXED_VALUE,
      );
      setCustomLoopAs(value);
      if (intervalCusLoop) clearInterval(intervalCusLoop);
      customLoopAVal = Number(value);
      createInteval();
    } else {
      if (!customLoopBs) {
        return;
      }
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
  };
  const onYouTubeIframeAPIReady = (): void => {
    const windowWithYT = window as WindowWithYT;
    if (!windowWithYT.YT) return;

    if (interval) clearInterval(interval);
    if (player && typeof player.destroy === 'function') {
      try {
        player.destroy();
      } catch (e) {
        console.error('Error destroying player:', e);
      }
    }

    const ytControlsVal = Number(localStorage.getItem(KEY_YT_CONTROLS) ?? '0');
    const DEFAULT_HEIGHT = Number(localStorage.getItem(KEY_YT_PLAYER_SIZE)) ?? 175;
    player = new windowWithYT.YT.Player('player', {
      height: DEFAULT_HEIGHT,
      width: DEFAULT_HEIGHT * (16 / 9),
      videoId: '',
      playerVars: {
        fs: 0,
        iv_load_policy: 3,
        playsinline: 1,
        modestbranding: 0,

        controls: ytControlsVal,
        cc_lang_pref: 'en',
        cc_load_policy: 1,
        rel: 0,
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
      // format setDuration to 00:00 / 00:00
      if (player) {
        setDuration(`${formatTime(player.getCurrentTime())} / ${formatTime(player.getDuration())}`);
      }
      // setVideoPercent(Number(((player.getCurrentTime() / player.getDuration()) * 100).toFixed(2)));
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
    const txtSrcMedia = (document.getElementById('txtSrcMedia') as HTMLInputElement)?.value || '';
    const input = txtSrcMedia.trim();
    let url = input;

    if (input.includes('youtube.com/watch')) {
      const params = new URL(input).searchParams;
      url = params.get('v') || '';
    } else if (input.includes('youtu.be/')) {
      const shortPath = input.split('youtu.be/')[1] || '';
      url = shortPath.split('?')[0];
    }

    if (player) {
      player.loadVideoById(url, 0);
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      onProcess();
    }
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
    <div
      className="yt-sub mobile"
      id="main-content"
      tabIndex={0}
      onKeyDown={(e) => onControlKey(e)}
    >
      <div id="maincontent-yt" className="">
        <div id="vd-control" className="yt-video-col">
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
          <div id="player"></div>
          <br />
          <div style={{}} className="inline common-btn btn-mobile">
            {duration}
          </div>
        </div>
        {/* <div className="common-toggle">Control</div> */}
        <div className="yt-controls-col">
          <div className="right">
            <div id="cus-loop-control">
              <div className="mobile-control-group">
                <input
                  className="common-input"
                  type="text"
                  style={{ width: 45 }}
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
              </div>
              <div className="mobile-control-group">
                <input
                  type="text"
                  style={{ width: 45 }}
                  className="common-input"
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

            <div className="mobile-control-parent-group">
              <div className="mobile-control-group">
                <input
                  type="submit"
                  className="common-btn btn-mobile"
                  value="<"
                  onClick={() => previous()}
                />
              </div>
              <div className="mobile-control-group">
                <input
                  type="submit"
                  style={{ width: 85 }}
                  className="common-btn btn-mobile"
                  value=">"
                  onClick={() => next()}
                />
                <input
                  type="submit"
                  className="common-btn btn-mobile"
                  value="||"
                  onClick={() => onStartStop({} as React.MouseEvent<HTMLInputElement>)}
                />
              </div>
            </div>
            <div className="mobile-control-parent-group">
              <div className="mobile-control-group">
                <input className="common-input input-mobile" style={{ width: 35 }} id="timemisus" />
                <input
                  type="submit"
                  className="common-btn btn-mobile "
                  value="Change"
                  onClick={() => changeTime()}
                />
              </div>
              <div className="mobile-control-group">
                <input
                  type="submit"
                  className="common-btn btn-mobile "
                  value="Add"
                  onClick={() => onAddPoint()}
                />
                <input
                  type="submit"
                  className="common-btn btn-mobile "
                  value="clear"
                  onClick={() => onClearCusLoop()}
                />
              </div>
            </div>
          </div>
        </div>
        {/* <StickyPracticeInput voiceIndex="youtube-speech-practice" /> */}
      </div>
      <div></div>
      {/* <div className="common-toggle" onClick={() => toggleCollapse('mul-ai')}>
        Mul-AI
      </div> */}

      {/* <div id="mul-ai" className="collapse-content ui-sub-panel">
        <MulAI {...MUL_PROP}></MulAI>
      </div> */}
      <div id="media-processing">
        <input
          type="text"
          id="txtSrcMedia"
          style={{ width: 100 }}
          className="common-input inline"
          value={url}
          onKeyDown={(e) => handleKeyDown(e)}
          onChange={(event) => {
            setUrl(event.target.value);
          }}
        />
        <select
          style={{ width: 110 }}
          className="common-input inline"
          value=""
          onChange={(event) => {
            if (event.target.value) {
              setUrl(event.target.value);
            }
          }}
        >
          <option value="">Select from ABoard6</option>
          {sourceOptions.map((option) => (
            <option key={`${option.eng}-${option.vi || ''}`} value={option.eng}>
              {`${option.vi}${option.vi ? ` - ${option.eng}` : ''}`}
            </option>
          ))}
        </select>
        <input
          type="submit"
          className="common-btn"
          value="Load"
          id="btnExecute"
          onClick={() => onProcess()}
        />
        <br />
        <input
          type="text"
          style={{ width: 70 }}
          className="common-input inline"
          value={bookmarkTime}
          onChange={(event) => {
            setBookmarkTime(event.target.value);
            localStorage.setItem(bookmarkTimeNm, event.target.value);
          }}
          placeholder="time(s)"
        />
        <input
          type="submit"
          className="common-btn"
          value="Set"
          onClick={() => {
            if (player) {
              const t = Number(player.getCurrentTime().toFixed(FIXED_VALUE));
              const tStr = t.toString();
              setBookmarkTime(tStr);
              localStorage.setItem(bookmarkTimeNm, tStr);
            }
          }}
        />
        <input
          type="submit"
          className="common-btn"
          value="Load"
          onClick={() => {
            if (player && bookmarkTime) {
              player.seekTo(Number(bookmarkTime), true);
            }
          }}
        />
        <div
          className="home-config-grid"
          style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <span style={{ fontSize: '13px', fontWeight: 'bold' }}>Controls:</span>
          <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}>
            <input
              type="radio"
              name="ytControls"
              value="0"
              checked={ytControls === '0'}
              onChange={(e) => {
                const val = e.target.value;
                setYtControls(val);
                localStorage.setItem(KEY_YT_CONTROLS, val);
                onYouTubeIframeAPIReady();
              }}
            />
            Hide
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}>
            <input
              type="radio"
              name="ytControls"
              value="1"
              checked={ytControls === '1'}
              onChange={(e) => {
                const val = e.target.value;
                setYtControls(val);
                localStorage.setItem(KEY_YT_CONTROLS, val);
                onYouTubeIframeAPIReady();
              }}
            />
            Show
          </label>
        </div>
      </div>
    </div>
  );
};
export default YoutubeSub;
