'use client';
import { useEffect, useRef, useState, ReactNode, FC, JSXElementConstructor } from 'react';
import './style-yout-sub.css';
import _ from 'lodash';
import { Sub } from './Subtitle';
import { toggleCollapse, COMMON_PROMPT } from '@/common/common.js';
import MulAI, { MulAIContainerProps } from '@/app/multi-ai/MultiAI';
import StackBtn from '@/app/common/components/StackButton';
import PracticeWords from '../practice-word/PracticeWords';
import { DataItem, getDataFromExcel } from '@/app/common/hooks/useSheetData';
import { SHEET_AUTO } from '@/app/common/components/SheetDataEditor';
import TranslateVieEngInput from '../common/components/TranslateVieEngInput';
import SystemAudioCaption from '@/app/common/components/SystemAudioCaption';

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
  destroy: () => void;
  getVideoData?: () => { video_id?: string };
  setOption?: (module: string, option: string, value: unknown) => void;
  loadModule?: (module: string) => void;
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
const KEY_YT_PLAYER_SIZE: string = 'yt-player-size';
const KEY_YT_HIDE_CONTROLS: string = 'yt-hide-controls';
const isHideControlsStored = (): boolean => localStorage.getItem(KEY_YT_HIDE_CONTROLS) === 'Y';
const KEY_YT_TIME_STEPS: string = 'yt-time-steps';
const DEFAULT_TIME_STEPS: string = '2, 3, 5';
// Parse "2, 5, 10" -> [2, 5, 10]; ignores invalid / non-positive entries.
const parseTimeSteps = (text: string): number[] => {
  const steps = text
    .split(/[,\s]+/)
    .map((s) => Number(s))
    .filter((n) => Number.isFinite(n) && n > 0);
  return steps.length > 0 ? steps : parseTimeSteps(DEFAULT_TIME_STEPS);
};
let captionVideoId: string = ''; // video for which English captions were already applied

// Turn on English captions.
// NOTE: use only { languageCode: 'en' } — passing a track object taken from 'tracklist' stops captions
// from rendering (verified in Chrome). loadModule() is called only here, never from onApiChange.
const applyEnglishCaptions = (p: YouTubePlayer): void => {
  captionVideoId = p.getVideoData?.()?.video_id || '';
  try {
    p.loadModule?.('captions');
    p.setOption?.('captions', 'track', { languageCode: 'en' });
  } catch (e) {
    console.error(e);
  }
};

const SOURCE_RANGE = SHEET_AUTO.find((item) => item.name === 'ABoard6')?.range || 'AUTO!U2:W500';

const YoutubeSub: FC = () => {
  const MUL_PROP: MulAIContainerProps = {
    heightRes: 180,
    configs: [
      {
        instanceNo: 0,
        prefix: 'yts',
        enableHis: 'N',
        collapse: 'N',
        title: 'Grammar',
        defaultPrompt: COMMON_PROMPT.CHECK_GRAMMAR,
      },
      {
        instanceNo: 1,
        prefix: 'yts',
        enableHis: 'N',
        collapse: 'N',
        title: 'Eng-Vie',
        defaultPrompt: COMMON_PROMPT.TRANSLATE_EN_VI,
      },
      {
        instanceNo: 2,
        prefix: 'yts',
        enableHis: 'N',
        collapse: 'N',
        title: 'Vie-Eng',
        defaultPrompt: COMMON_PROMPT.TRANSLATE_VI_EN,
      },
    ],
  };

  const REPLAY_NO: string = 'REPLACE_NO';
  const REPLAY_YES: string = 'REPLACE_YES';
  const [arrSub, setArrSub] = useState<Sub[]>([]);
  const [customLoopAs, setCustomLoopAs] = useState<string>('');
  const [customLoopBs, setCustomLoopBs] = useState<string>('');
  const [tempText, setTempText] = useState<string>('');
  const [size, setSize] = useState<number>(390);
  const [height, setHeight] = useState<number>(10);
  const [top, setTop] = useState<number>(0);
  const [subHeight, setSubHeight] = useState<number>(300);
  const [hideControls, setHideControls] = useState<boolean>(false);
  const [timeStepsText, setTimeStepsText] = useState<string>(DEFAULT_TIME_STEPS);

  const [modeReplay, setModeReplay] = useState<string>(REPLAY_NO);
  const [modeKara, setModeKara] = useState<string>('N');

  const [url, setUrl] = useState<string>('');
  const [sub, setSub] = useState<string>('');
  const [sourceOptions, setSourceOptions] = useState<DataItem[]>([]);

  const LOOP_CUSTOM: string = 'LOOP_CUSTOM';

  const NOT_VALUE_TIME: number = 1;
  const FIXED_VALUE: number = 3;
  const TIME_MAIN_INTERVAL: number = 500;

  useEffect((): (() => void) => {
    if (!_.isEmpty(localStorage)) {
      setUrl(localStorage.getItem(urlCookieNm) || '');
      setSub(localStorage.getItem(subCookieNm) || '');
      const storedSize = Number(localStorage.getItem(KEY_YT_PLAYER_SIZE));
      if (Number.isFinite(storedSize) && storedSize > 0) {
        setSize(storedSize);
      }
      setHideControls(isHideControlsStored());
      const storedSteps = localStorage.getItem(KEY_YT_TIME_STEPS);
      if (storedSteps) {
        setTimeStepsText(storedSteps);
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
    toggleCollapse('mobile-control');
    // toggleCollapse("hide2");
    toggleCollapse('ai-section-yt');
    toggleCollapse('hide-control-frame');
    toggleCollapse('yts-translate-panel');
    const cusLoopControl = document.getElementById(`cus-loop-control`);
    if (cusLoopControl) {
      cusLoopControl.style.display = 'block';
    }
    const timemisuEl = document.getElementById(`timemisus`) as HTMLInputElement;
    if (timemisuEl) {
      timemisuEl.value = String(parseTimeSteps(localStorage.getItem(KEY_YT_TIME_STEPS) || DEFAULT_TIME_STEPS)[0]);
    }
    customLoopMode = LOOP_CUSTOM;
    customLoopAVal = NOT_VALUE_TIME;
    customLoopBVal = NOT_VALUE_TIME;
    return () => {
      if (interval) clearInterval(interval);
      if (intervalCusLoop) clearInterval(intervalCusLoop);
    };
  }, []);
  // latest onControlKey, for the document-level keydown listener used in fullscreen
  const controlKeyRef = useRef<((e: React.KeyboardEvent<HTMLDivElement>) => void) | null>(null);
  // The YouTube player is a cross-origin iframe: once it has focus, key events never reach
  // this page, so onControlKey stops working. When the iframe steals focus (e.g. user clicks
  // the video), give focus back to #main-content so the arrow-key controls keep working.
  useEffect(() => {
    // in fullscreen, focus must stay inside the fullscreen element (#vd-control), otherwise use #main-content
    const focusKeyTarget = (): void => {
      const fs = document.fullscreenElement as HTMLElement | null;
      const target = fs && fs.tagName !== 'IFRAME' ? fs : document.getElementById('main-content');
      target?.focus({ preventScroll: true });
    };
    const reclaimFocus = (): void => {
      setTimeout(() => {
        const active = document.activeElement;
        if (active && active.tagName === 'IFRAME' && document.getElementById('vd-control')?.contains(active)) {
          focusKeyTarget();
        }
      }, 0);
    };
    // entering/leaving fullscreen can leave focus in the iframe / outside the fullscreen element -> reclaim it
    const onFullscreenChange = (): void => {
      focusKeyTarget();
      reclaimFocus();
    };
    // In fullscreen, key events don't reliably reach #main-content's onKeyDown -> listen on the document
    const onDocKeyDown = (e: KeyboardEvent): void => {
      if (!document.fullscreenElement) return; // normal mode is handled by onKeyDown on #main-content
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      controlKeyRef.current?.(e as unknown as React.KeyboardEvent<HTMLDivElement>);
    };
    window.addEventListener('blur', reclaimFocus);
    document.addEventListener('fullscreenchange', onFullscreenChange);
    document.addEventListener('keydown', onDocKeyDown);
    return () => {
      window.removeEventListener('blur', reclaimFocus);
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      document.removeEventListener('keydown', onDocKeyDown);
    };
  }, []);
  // Fullscreen the wrapper (not the iframe) so the page keeps keyboard focus -> onControlKey keeps working
  const toggleFullscreen = (): void => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(console.error);
      return;
    }
    // requestFullscreen is missing on iPhone Safari for non-video elements
    document.getElementById('vd-control')?.requestFullscreen?.()?.catch(console.error);
  };
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
    localStorage.setItem(subCookieNm, sub);
  }, [sub]);

  useEffect((): void => {
    localStorage.setItem(subCookieNm, sub);
    const subControl = document.getElementById(`sub-control`);
    if (subControl) {
      subControl.style.height = `${subHeight}px`;
    }
  }, [subHeight]);

  const handleSizeChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    let valueSz = Number(event.target.value);
    setSize(valueSz);
    setHeight(10);
    setTop(0);
    setAttTop(0);
  };
  const handleSubChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSubHeight(Number(event.target.value));
  };
  const handleMaskMedia = (event: React.ChangeEvent<HTMLInputElement>): void => {
    console.log(size);
    const heightVal = Number(event.target.value);
    setHeight(heightVal);
    if (player) {
      player.setSize(size * (16 / 9), size * (heightVal / 10));
    }
  };
  const handleTop = (event: React.ChangeEvent<HTMLInputElement>): void => {
    let valueSz = Number(event.target.value);
    setAttTop(valueSz);
  };
  const setAttTop = (valueSz: number): void => {
    setTop(valueSz);
    const div = document.getElementById('main-content');
    if (div) {
      div.style.top = `-${valueSz}px`;
    }
  };
  const onYouTubeIframeAPIReady = (resume?: { videoId: string; startSeconds: number }): void => {
    const windowWithYT = window as WindowWithYT;
    if (!windowWithYT.YT) return;
    const DEFAULT_HEIGHT = Number(localStorage.getItem(KEY_YT_PLAYER_SIZE)) || 729;
    const playerVars: Record<string, unknown> = {
      fs: 0, // hide YouTube's fullscreen button (use our "Fullscreen" link so key controls keep working)
      iv_load_policy: 3,
      playsinline: 1,
      modestbranding: 0,
      // English subtitles on by default
      cc_load_policy: 1,
      cc_lang_pref: 'en',
      hl: 'en',
    };
    if (isHideControlsStored()) {
      playerVars.controls = 0;
    }
    if (resume?.videoId) {
      // give the video to the constructor so cc_load_policy applies to it
      playerVars.start = Math.floor(resume.startSeconds);
    }
    captionVideoId = '';
    player = new windowWithYT.YT.Player('player', {
      height: DEFAULT_HEIGHT,
      width: DEFAULT_HEIGHT * (16 / 9),
      videoId: resume?.videoId || '',
      playerVars,
      events: {
        onReady: (event: { target: YouTubePlayer }) => {
          onPlayerReady(event);
          if (resume?.videoId) {
            event.target.seekTo(resume.startSeconds, true);
          }
        },
        onStateChange: (event: { target: YouTubePlayer; data: number }) => {
          // 1 = playing: apply English captions once per video (incl. videos loaded via Load)
          if (event.data !== 1) return;
          const vid = event.target.getVideoData?.()?.video_id || '';
          if (vid && vid !== captionVideoId) applyEnglishCaptions(event.target);
        },
      },
    });
  };
  const toggleHideControls = (): void => {
    const next = !hideControls;
    setHideControls(next);
    localStorage.setItem(KEY_YT_HIDE_CONTROLS, next ? 'Y' : 'N');
    // controls can only be set at creation time -> rebuild the player, keeping video + position
    let resume: { videoId: string; startSeconds: number } | undefined;
    if (player) {
      try {
        const videoId = player.getVideoData?.()?.video_id || '';
        resume = { videoId, startSeconds: player.getCurrentTime() || 0 };
        player.destroy();
      } catch (e) {
        console.error(e);
      }
      player = null;
    }
    if (interval) clearInterval(interval);
    if (!document.getElementById('player')) {
      const holder = document.createElement('div');
      holder.id = 'player';
      document.getElementById('vd-control')?.prepend(holder);
    }
    onYouTubeIframeAPIReady(resume);
  };
  const onPlayerReady = (event: { target: YouTubePlayer }): void => {
    event.target.playVideo();
    if (interval) clearInterval(interval);

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

  const loadSub = (): void => {
    var txtSub = (document.getElementById('media-sub') as HTMLTextAreaElement)?.value || '';
    var lineSubArr = txtSub.split('\n');
    let count = 1;
    let tempTime = '';
    let arrTemp: Sub[] = [];
    arrTime = [];
    let istime = false;

    const timeRegex = /^\d{1,2}:\d{2}/;

    lineSubArr.forEach((line, index) => {
      if (!istime && !timeRegex.test(line)) {
        return;
      }
      if (timeRegex.test(line)) {
        istime = true;
      } else {
        istime = false;
      }
      let lineSub = line.trim();
      if (count === 1) {
        tempTime = lineSub;
        arrTime.push(tempTime);
      }
      if (count === 2) {
        arrTemp.push(new Sub(tempTime, lineSub));
        count = 0;
      }
      count++;
    });

    setArrSub(arrTemp);
    if (!_.isEmpty(arrTemp)) {
      const loadSubEl = document.getElementById('load-sub');
      if (loadSubEl) {
        loadSubEl.style.display = 'none';
      }
    }
  };

  const LineSub = (props: { time: string; value: string }): React.ReactElement => {
    return (
      <div
        role="button"
        className={`sub-item`}
        id={`sub-item${props.time}`}
        onClick={(e) => onClickSub(props.time, props.value)}
      >
        {props.time}: {props.value}
      </div>
    );
  };
  const onClickSub = (time: string, value: string): void => {
    console.log('=====onClickSub=====');
    isReplay = true;
    indexOfCurrSub = arrSub.length - 1;

    for (let i = 0; i < arrSub.length; i++) {
      if (_.isEqual(arrSub[i].time, time)) {
        indexOfCurrSub = i;
      }
    }
    if (modeReplay === REPLAY_YES) {
      loopSub(arrSub[indexOfCurrSub], arrSub[indexOfCurrSub + 1]);
    } else {
      // let startTime = getTimeFromSub(arrSub[indexOfCurrSub]);
      // // player.seekTo(startTime, true)
      // onReplay(startTime)
    }
  };
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
  const onChangeReplay = (): void => {
    isReplay = false;
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      onProcess();
    }
  };
  const onShowHide = (e: React.MouseEvent<HTMLInputElement>): void => {
    let elm = document.getElementById('load-sub');
    if (elm && elm.style.display === 'none') {
      elm.style.display = 'block';
    } else if (elm) {
      elm.style.display = 'none';
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
  const onNextLine = (e: React.MouseEvent<HTMLInputElement>): void => {
    indexOfCurrSub++;
    loopSub(arrSub[indexOfCurrSub], arrSub[indexOfCurrSub + 1]);
  };
  const onPrevLine = (e: React.MouseEvent<HTMLInputElement>): void => {
    if (indexOfCurrSub > 0) {
      indexOfCurrSub--;
      loopSub(arrSub[indexOfCurrSub], arrSub[indexOfCurrSub + 1]);
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
    // Cycle through the configured steps (e.g. 2 -> 3 -> 5 -> 2 ...)
    const steps = parseTimeSteps(timeStepsText);
    const idx = steps.indexOf(Number(timemisuEl.value));
    timemisuEl.value = String(steps[(idx + 1) % steps.length]);
  };
  const onChangeTimeSteps = (text: string): void => {
    setTimeStepsText(text);
    localStorage.setItem(KEY_YT_TIME_STEPS, text);
  };
  const onControlKey = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    console.log(e.key);
    if (e.key === 'ArrowLeft') {
      // e.preventDefault();
      previous();
    }
    if (e.key === 'ArrowRight') {
      // e.preventDefault();
      next();
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      onStartStop(e as unknown as React.MouseEvent<HTMLInputElement>);
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      changeTime();
    }
    if (e.key === 'Shift') {
      // e.preventDefault();
      onAddPoint();
    }
    if (e.key === 'Control') {
      // e.preventDefault();
      onClearCusLoop();
    }
    if (e.key === '.') {
      // e.preventDefault();
      changeTimeLoop(false, false);
    }
    if (e.key === '/') {
      // e.preventDefault();
      changeTimeLoop(false, true);
    }
    if (e.key === ';') {
      // e.preventDefault();
      changeTimeLoop(true, false);
    }
    if (e.key === "'") {
      // e.preventDefault();
      changeTimeLoop(true, true);
    }
  };
  controlKeyRef.current = onControlKey;

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

  const onShowAll = (): void => {
    let hide1 = document.getElementById('hide1');
    let hide2 = document.getElementById('hide2');
    if (hide1) hide1.style.display = 'block';
    if (hide2) hide2.style.display = 'block';
  };
  const onHideAll = (): void => {
    let hide1 = document.getElementById('hide1');
    let hide2 = document.getElementById('hide2');
    if (hide1) hide1.style.display = 'none';
    if (hide2) hide2.style.display = 'none';
  };
  return (
    <div
      className="yt-sub yts-page"
      id="main-content"
      tabIndex={0}
      onKeyDown={(e) => {
        // in fullscreen the document-level listener handles keys (avoid running twice)
        if (document.fullscreenElement) return;
        onControlKey(e);
      }}
    >
      <div id="maincontent-yt" className="media-left yts-shell">
        <div id="vd-control" tabIndex={-1}>
          <div id="player"></div>
          <br />
        </div>
        <div className="yts-inline-control">
          <input type="number" className="width-60 right common-input" id="timemisus" />
          <br />
          <span className="yts-toggle-link" onClick={() => toggleCollapse('hide-control-frame')}>
            +/-
          </span>{' '}
          <span
            className="yts-toggle-link"
            title="Hide/show YouTube player controls (hidden = English subtitles on)"
            onClick={() => toggleHideControls()}
          >
            {hideControls ? 'Show control' : 'Hide control'}
          </span>{' '}
          <span
            className="yts-toggle-link"
            title="Fullscreen video (arrow-key controls keep working, Esc to exit)"
            onClick={() => toggleFullscreen()}
          >
            Fullscreen
          </span>{' '}
          <SystemAudioCaption overlayContainerId="vd-control" language="en-US" />{' '}
          <input
            type="text"
            className="width-60 common-input"
            title="Time steps (seconds) cycled with ArrowUp, comma separated, e.g. 2, 5, 10"
            value={timeStepsText}
            onChange={(e) => onChangeTimeSteps(e.target.value)}
            onKeyDown={(e) => e.stopPropagation()}
          />
          <div id="hide-control-frame" className="collapse-content ui-sub-panel yts-resize-panel">
            <input
              type="range"
              className="range-input"
              style={{
                width: 440,
              }}
              id="size"
              name="vol"
              min="0"
              max="1300"
              value={size}
              onChange={handleSizeChange}
            ></input>
            <br />
            {/* <input type="range" className="range-input" id="size" name="vol" min="5" max="20" value={height} onChange={handleMaskMedia}></input><br />
                        <input type="range" className="range-input" id="size" name="vol" min="5" max="700" value={top} onChange={handleTop}></input><br /> */}
          </div>
        </div>

        <div className="common-toggle " onClick={() => toggleCollapse('yts-translate-panel')}>
          Translate
        </div>
        <div id="yts-translate-panel" className="collapse-content ui-sub-panel yts-ai-panel">
          <TranslateVieEngInput />
        </div>
        <div className="common-toggle " onClick={() => toggleCollapse('ai-section-yt')}>
          AI
        </div>
        <div id="ai-section-yt" className="collapse-content ui-sub-panel yts-ai-panel">
          <PracticeWords prefix="prc-yts" enableHis="N" isMini={true} showPract="A" />
        </div>
        <div className="common-toggle " onClick={() => toggleCollapse('mobile-control')}>
          Control
        </div>
        <div id="mobile-control" className="collapse-content ui-sub-panel yts-control-panel">
          <input
            type="text"
            id="txtSrcMedia"
            className="common-input responsive-input-full"
            value={url}
            onKeyDown={(e) => handleKeyDown(e)}
            onChange={(event) => {
              setUrl(event.target.value);
            }}
          />
          <select
            className="common-input responsive-input-full"
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
                {`${option.eng}${option.vi ? ` - ${option.vi}` : ''}`}
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
          <input
            type="submit"
            className="common-btn"
            value="Remove Info"
            onClick={() => removeLogo()}
          />
          <input
            type="submit"
            className="common-btn"
            value="+/-"
            onClick={() => onShowHideVideo({} as React.MouseEvent<HTMLInputElement>)}
          />
          {/* <br /> */}

          <input type="submit" className="common-btn" value="<" onClick={() => previous()} />
          <input
            type="submit"
            className="common-btn"
            value="||"
            onClick={() => onStartStop({} as React.MouseEvent<HTMLInputElement>)}
          />
          <input type="submit" className="common-btn" value=">" onClick={() => next()} />
          <input
            type="submit"
            className="common-btn"
            value="Change times"
            onClick={() => changeTime()}
          />
          {/* <br /> */}

          <input
            type="submit"
            className="common-btn"
            value="Add point"
            onClick={() => onAddPoint()}
          />
          <input
            type="submit"
            className="common-btn"
            value="clear"
            onClick={() => onClearCusLoop()}
          />
          <div id="cus-loop-control" className="yts-loop-control">
            <input
              className="common-input"
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
        {/* <div className="common-toggle " onClick={() => toggleCollapse('speech-temp')}>
          Speech
        </div>
        <div id="speech-temp" className="collapse-content ui-sub-panel yts-ai-panel">
          <StickyPracticeInput voiceIndex="youtube-speech-practice" type="TEXTAREA" rows={3} />
        </div> */}

        {/* <div className="common-toggle " onClick={() => toggleCollapse('mul-ai')}>
          Mul-AI
        </div> */}
      </div>

      {/* <div id="mul-ai" className="collapse-content ui-sub-panel yts-mulai-panel">
        <MulAI {...MUL_PROP}></MulAI>
      </div> */}
      <div className="common-toggle " onClick={() => toggleCollapse('hide2')}>
        Sub
      </div>

      <div id="hide2" className="collapse-content ui-sub-panel yts-sub-panel">
        <div id="hide1"></div>
        <div className="tooltip yts-tooltip">
          ???
          <span className="tooltiptext">arrow , and Crtl: clear/ shift: loop</span>
        </div>

        <div id="subline-control">
          <input
            type="range"
            className="range-input"
            id="size"
            name="vol"
            min="30"
            max="500"
            value={subHeight}
            onChange={handleSubChange}
          ></input>
          <br />
          <select
            value={modeReplay}
            onChange={(e) => {
              setModeReplay(e.target.value);
            }}
          >
            <option value={REPLAY_YES}>REPLAY_YES</option>
            <option value={REPLAY_NO}>REPLAY_NO</option>
          </select>
          <select
            value={modeKara}
            onChange={(e) => {
              setModeKara(e.target.value);
            }}
          >
            <option value="Y">Y</option>
            <option value="N">N</option>
          </select>
          <input type="submit" value="Continue" onClick={() => onChangeReplay()} />

          {/* <input className="width-30" placeholder="control-form" onKeyDown={e => onControlKeyListen(e)} /> */}
          <input
            type="submit"
            value="<<"
            onClick={() => onPrevLine({} as React.MouseEvent<HTMLInputElement>)}
          />
          <input
            type="submit"
            value=">>"
            onClick={() => onNextLine({} as React.MouseEvent<HTMLInputElement>)}
          />
          <div id="sub-control" className="yts-sub-list">
            {arrSub.map((item, index) => (
              <LineSub key={`${item.time}${item.value}`} time={item.time} value={item.value} />
            ))}
          </div>
          <input
            type="submit"
            value="+/-"
            onClick={() => onShowHide({} as React.MouseEvent<HTMLInputElement>)}
          />
        </div>

        <div className="option-right">
          {' '}
          <br />
        </div>
        <div id="load-sub" className="yts-load-sub">
          <input
            type="submit"
            className="common-btn margin-zr"
            value="loadSub"
            id="btnLoadSube"
            onClick={() => loadSub()}
          />
          <br />
          <textarea
            id="media-sub"
            value={sub}
            onChange={(event) => {
              setSub(event.target.value);
            }}
          ></textarea>
        </div>

        <br />
        <input type="submit" value="H" id="btnHide" onClick={() => onHideAll()} />
        <input type="submit" value="S" id="btnShow" onClick={() => onShowAll()} />
      </div>
    </div>
  );
};
export default YoutubeSub;
