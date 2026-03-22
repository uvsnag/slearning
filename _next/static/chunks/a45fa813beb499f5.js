(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,28297,e=>{"use strict";let a=(0,e.i(65902).default)(()=>e.A(6766),{loadableGenerated:{modules:[35916]},ssr:!1});e.s(["default",0,a])},77758,e=>{"use strict";var a=e.i(71866),i=e.i(80744),n=e.i(58078),s=e.i(2579),t=e.i(46086),l=e.i(80642),o=e.i(28297);let r="Talking to a foreign colleague during lunch",c=t.SHEET_AUTO.find(e=>"ABoard7"===e.name)?.range||"AUTO!Y2:AA500";e.s(["default",0,()=>{let[e,t]=(0,i.useState)([]),[u,p]=(0,i.useState)(r);(0,i.useEffect)(()=>{(0,s.getDataFromExcel)(c,e=>{let a=e.map(e=>e.eng?.trim()).filter(e=>!!e);if(t(a),a.length>0){let e=Math.floor(Math.random()*a.length);p(a[e])}})},[]);let m=(0,i.useMemo)(()=>`
Scenario: ${u}


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
  `,[u]);return(0,a.jsxs)("div",{className:"mobile speak-ai-page",children:[(0,a.jsxs)("select",{className:"common-input inline speak-ai-scenario",style:{width:"100%",textAlign:"left"},value:u,onChange:e=>p(e.target.value),children:[0===e.length&&(0,a.jsx)("option",{value:r,children:r}),e.map(e=>(0,a.jsx)("option",{value:e,children:e},e))]}),(0,a.jsx)(n.default,{index:0,prefix:"speak-ai",enableHis:"Y",heightRes:380,isSpeak:"L",speakSplitter:"Continue conversation:",isMini:null,firstAsk:m,collapse:"N",title:"Board"},u),(0,a.jsx)("div",{className:"common-toggle",onClick:()=>(0,l.toggleCollapse)("mul-ai"),children:"Mul-AI"}),(0,a.jsx)("div",{id:"mul-ai",className:"collapse-content ui-sub-panel speak-ai-mulai",children:(0,a.jsx)(o.default,{heightRes:180,cols:1,configs:[{instanceNo:0,prefix:"yts",enableHis:"N",collapse:"N"},{instanceNo:1,prefix:"yts",enableHis:"N",collapse:"N"},{instanceNo:2,prefix:"yts",enableHis:"Y",collapse:"Y"}]})})]})}])},49829,e=>{e.n(e.i(77758))},6766,e=>{e.v(a=>Promise.all(["static/chunks/6ece1fd8235c2622.js"].map(a=>e.l(a))).then(()=>a(35916)))}]);