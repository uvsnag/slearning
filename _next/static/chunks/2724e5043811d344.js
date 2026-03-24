(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,77758,e=>{"use strict";var n=e.i(71866),a=e.i(80744),i=e.i(58078),t=e.i(2579),o=e.i(46086);let s="Talking to a foreign colleague during lunch",l=o.SHEET_AUTO.find(e=>"ABoard7"===e.name)?.range||"AUTO!Y2:AA500";e.s(["default",0,()=>{let[e,o]=(0,a.useState)([]),[r,c]=(0,a.useState)(s);(0,a.useEffect)(()=>{(0,t.getDataFromExcel)(l,e=>{let n=e.map(e=>e.eng?.trim()).filter(e=>!!e);if(o(n),n.length>0){let e=Math.floor(Math.random()*n.length);c(n[e])}})},[]);let u=(0,a.useMemo)(()=>`
Scenario: ${r}


You are my professional English speaking coach.

My goal is to improve my spoken English for real-life situations, especially for work and daily communication.

Rules:

I will speak first (my English may be broken or unnatural).

After I finish speaking, you must:

Correct my grammar clearly (ignores upper/lower case, and ignores punctuation).

Rewrite my sentence in natural, confident spoken English.

Briefly explain my main mistakes.

Then continue the conversation naturally based on the scenario.

Keep the conversation realistic and practical.

Focus on spoken English (not academic writing).

Ask follow-up questions to make the conversation deeper.

Keep explanations short and clear.

Format your response like this:

Correction:
(Natural version)

Explanation:
(Short explanation of mistakes)

Continue conversation:
(Continue naturally and ask me something)

You talk first. Let's start the conversation now!
  `,[r]);return(0,n.jsxs)("div",{className:"mobile speak-ai-page",children:[(0,n.jsxs)("select",{className:"common-input inline speak-ai-scenario",style:{width:"100%",textAlign:"left"},value:r,onChange:e=>c(e.target.value),children:[0===e.length&&(0,n.jsx)("option",{value:s,children:s}),e.map(e=>(0,n.jsx)("option",{value:e,children:e},e))]}),(0,n.jsx)(i.default,{index:0,prefix:"speak-ai",enableHis:"Y",heightRes:380,isSpeak:"L",speakSplitter:"Continue conversation:",isMini:null,firstAsk:u,collapse:"N",title:"Board"},r)]})}])},49829,e=>{e.n(e.i(77758))}]);