import type { KmNode } from '../../types';

export const forms: KmNode = {
  title: 'Forms',
  level: 'beginner',
  summary: 'How users type, pick and send data: inputs, labels, validation and submission.',
  simple:
    "A form is a paper form at the doctor's office. Each box has a label, some boxes are required, and you hand it in when it is done.",
  points: [
    'A <code>&lt;form&gt;</code> collects fields and sends them to a URL (or to your JavaScript).',
    'Every field needs a <code>name</code> to be sent and a label to be understood.',
    'The browser gives you free validation, keyboards and autofill if you use the right types.',
  ],
  children: [
    {
      title: 'Form Basics',
      level: 'beginner',
      summary: 'A form wraps fields; action is where data goes, method is how (GET or POST).',
      simple:
        'action is the address on the envelope; method is whether you write it on a postcard (GET, visible in the URL) or seal it in an envelope (POST).',
      points: [
        '<code>action</code>: the URL that receives the data. <code>method</code>: <code>get</code> or <code>post</code>.',
        'GET puts data in the URL; fine for search. POST puts it in the request body.',
        'Only fields with a <code>name</code> are sent.',
        'Pressing Enter in a text field submits the form, for free.',
      ],
      detail: `<pre><code>&lt;form action="/signup" method="post"&gt;
  &lt;label for="email"&gt;Email&lt;/label&gt;
  &lt;input id="email" name="email" type="email" required&gt;
  &lt;button&gt;Sign up&lt;/button&gt;
&lt;/form&gt;</code></pre>`,
    },
    {
      title: 'Labels',
      level: 'beginner',
      summary: 'A label names a field and links to it, so clicking the text focuses the field.',
      simple:
        'A label is the name tag on a box. Without it, a screen reader just says "edit text" and the user has to guess.',
      points: [
        'Link them with <code>for</code> matching the input <code>id</code>, or wrap the input inside the label.',
        'Clicking the label focuses the input, a bigger target on phones.',
        'A placeholder is not a label: it disappears when you type.',
        'Group related fields (like radio buttons) in <code>&lt;fieldset&gt;</code> with a <code>&lt;legend&gt;</code>.',
      ],
    },
    {
      title: 'Input Types',
      level: 'beginner',
      summary:
        'The type attribute picks the right control and phone keyboard: email, number, date, and more.',
      simple:
        'Like giving someone the right tool: a calendar for dates, a number pad for numbers, a checkbox for yes/no.',
      points: [
        'Text-like: <code>text</code>, <code>email</code>, <code>tel</code>, <code>url</code>, <code>password</code>, <code>search</code>.',
        'Pickers: <code>date</code>, <code>time</code>, <code>color</code>, <code>range</code>, <code>file</code>.',
        'Choices: <code>checkbox</code>, <code>radio</code> (same <code>name</code> = one group), <code>&lt;select&gt;</code>.',
        'Multi-line text: <code>&lt;textarea&gt;</code>.',
        '<code>autocomplete="email"</code>, <code>"current-password"</code> etc. make autofill work well.',
      ],
      tip: 'Use inputmode="numeric" for things like PIN codes; type="number" is for real quantities.',
    },
    {
      title: 'Built-in Validation',
      level: 'intermediate',
      summary:
        'Attributes like required, min and pattern let the browser check input before sending.',
      simple:
        'It is a bouncer at the door: if a field breaks a rule, the form is stopped and the user sees why.',
      points: [
        'Rules: <code>required</code>, <code>minlength</code>, <code>maxlength</code>, <code>min</code>, <code>max</code>, <code>pattern</code>.',
        'CSS can style states: <code>:invalid</code>, <code>:valid</code>, <code>:user-invalid</code> (only after the user interacts).',
        'JavaScript: <code>setCustomValidity()</code> for custom messages, <code>checkValidity()</code> to test.',
        'Use <code>novalidate</code> on the form if you show your own error UI.',
      ],
      detail: `<pre><code>const pw2 = document.querySelector('#pw2');
pw2.addEventListener('input', () =&gt; {
  const same = pw2.value === document.querySelector('#pw1').value;
  pw2.setCustomValidity(same ? '' : 'Passwords do not match');
});</code></pre>`,
      tip: 'Client-side checks are for user comfort only. Always validate again on the server.',
    },
    {
      title: 'Handling Submit in JS',
      level: 'intermediate',
      summary: 'Listen for the submit event, stop the page reload, and send FormData with fetch.',
      simple:
        'Instead of mailing the paper form, you photograph it and send it by message. Same data, but the page stays put.',
      points: [
        'Listen to <code>submit</code> on the form, not <code>click</code> on the button. Enter key works too.',
        '<code>event.preventDefault()</code> stops the full page reload.',
        '<code>new FormData(form)</code> grabs all named fields at once.',
        'Disable the button while sending so users do not submit twice.',
      ],
      detail: `<pre><code>form.addEventListener('submit', async (e) =&gt; {
  e.preventDefault();
  const data = new FormData(form);
  const res = await fetch('/signup', { method: 'POST', body: data });
  if (!res.ok) showError(await res.text());
});</code></pre>`,
    },
    {
      title: 'Styling Form Controls',
      level: 'intermediate',
      summary:
        'Form controls look different in every browser; a few CSS tools let you match your design.',
      simple:
        'Checkboxes and dropdowns come pre-painted by the browser. Some let you change the paint color, others you have to strip and repaint yourself.',
      points: [
        '<code>accent-color: royalblue</code> recolors checkboxes, radios and range sliders in one line.',
        '<code>appearance: none</code> removes the browser look so you can style from scratch.',
        'Inputs do not inherit fonts; add <code>font: inherit</code>.',
        '<code>field-sizing: content</code> lets a textarea grow with its text (Chromium first, not yet everywhere).',
        'Fully stylable <code>&lt;select&gt;</code> via <code>appearance: base-select</code> is new (Chrome 135, 2025); check support.',
      ],
      detail: `<pre><code>input, select, textarea, button { font: inherit; }
input[type="checkbox"] { accent-color: royalblue; }
textarea { field-sizing: content; min-height: 3lh; }</code></pre>`,
      tip: 'Restyle with care: a custom checkbox must still work with the keyboard and show focus.',
    },
  ],
};
