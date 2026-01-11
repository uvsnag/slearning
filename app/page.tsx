'use client';
import Link from 'next/link';
import React, { useEffect, useState, FC, ChangeEvent } from 'react';
import { toggleCollapse, KEY_GPT_NM, KEY_GEMINI_NM, KEY_GOOGLE_SHEET_NM } from '@/common/common';

const Home: FC = () => {
  const [gemKey, setGemKey] = useState<string | null>(null);
  const [gptKey, setGptKey] = useState<string | null>(null);
  const [googleSheetKey, setGoogleSheetKey] = useState<string | null>(null);
  useEffect(() => {
    let locGem = localStorage.getItem(KEY_GEMINI_NM);
    let locgpt = localStorage.getItem(KEY_GPT_NM);
    let locGoogleSheet = localStorage.getItem(KEY_GOOGLE_SHEET_NM);
    setGemKey(locGem);
    setGptKey(locgpt);
    setGoogleSheetKey(locGoogleSheet);
  }, []);
  useEffect(() => {
    if (gemKey) {
      localStorage.setItem(KEY_GEMINI_NM, gemKey);
    }
  }, [gemKey]);

  useEffect(() => {
    if (gptKey) {
      localStorage.setItem(KEY_GPT_NM, gptKey);
    }
  }, [gptKey]);

  useEffect(() => {
    if (googleSheetKey) {
      localStorage.setItem(KEY_GOOGLE_SHEET_NM, googleSheetKey);
    }
  }, [googleSheetKey]);

  return (
    <div className="App">
      <ul className="mst-menu">
        <li className="mst-menu-li">
          <Link href="/notify">Notify</Link>
        </li>
        <li className="mst-menu-li">
          <Link href="/youtube-sub">YT-Sub</Link>
        </li>
        <li className="mst-menu-li">
          <Link href="/next-sent">Next-Sentence</Link>
        </li>
        <li className="mst-menu-li">
          <Link href="/listen">Listen Word Prac</Link>
        </li>
        <li className="mst-menu-li">
          <Link href="/voiceToText">Speed To Text</Link>
        </li>
        <li className="mst-menu-li">
          <Link href="/dash-board1">Board1</Link>
        </li>
        {/* <li className="mst-menu-li">
          <Link href="/ai">AI</Link>
        </li> */}
        <li className="mst-menu-li" onClick={() => toggleCollapse(`config`)}>
          Config
        </li>
      </ul>
      <div id="config" className="collapse-content bolder">
        <span>gem:</span>
        <input
          type="text"
          value={gemKey ?? ''}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            setGemKey(event.target.value);
          }}
          placeholder="gem"
        />
        <span>gpt:</span>
        <input
          type="text"
          value={gptKey ?? ''}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            setGptKey(event.target.value);
          }}
          placeholder="gpt"
        />
        <br />
        <span>Google sheet:</span>
        <input
          type="text"
          value={googleSheetKey ?? ''}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            setGoogleSheetKey(event.target.value);
          }}
          placeholder="google sheet key"
        />
        <br />
      </div>
    </div>
  );
};

export default Home;
