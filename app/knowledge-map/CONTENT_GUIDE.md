# Knowledge Map — content guide

How to write (or add) a topic for the Knowledge Map page (`/knowledge-map`).

## Where things live

```
app/knowledge-map/
  types.ts                 KmNode / KmTopic types (read this first)
  image/<topic>.png        optional overview picture, shown on the root node
  data/index.ts            KM_TOPICS registry — add every new topic here
  data/<topic>/index.ts    the topic: root node + list of branches
  data/<topic>/<branch>.ts one or two branches per file (export const <name>: KmNode)
```

A topic is one tree: root → 8–12 branches → concepts → (optional) sub-concepts.
Max depth 4 (root = 1). Aim for 70–110 nodes in total.

## Order = learning path

The page walks the tree depth-first with Prev / Next, so order everything
**from beginner to expert**: first branch = absolute basics, last branch =
internals / expert topics. Inside a branch, put easy concepts first.

Every node has a `level`: `beginner` | `intermediate` | `advanced` | `expert`.
Be honest — the level filter relies on it.

## Writing style (most important)

Write like you are explaining to a friend over coffee:

- Use **"you"**, short sentences, everyday words. No academic or marketing tone.
- Avoid difficult words. If a technical term is needed, explain it right away
  in a few plain words — e.g. "offset (the record's line number)".
- Concise: say it once, clearly. No filler like "It is important to note that…".
- Be accurate. Mention version numbers when behaviour changed (e.g. "default since Java 21").
- English text.

Field by field:

| Field     | Rule                                                                                             |
| --------- | ------------------------------------------------------------------------------------------------ |
| `title`   | 1–4 words, the concept name.                                                                     |
| `summary` | One sentence, max ~20 words: what it is, in plain words.                                         |
| `simple`  | 1–3 sentences with an everyday analogy ("It's like…"). Required for beginner/intermediate nodes. |
| `points`  | 3–6 bullets, each max ~20 words, one idea per bullet.                                            |
| `detail`  | Optional HTML. Only for a short code example or tiny diagram.                                    |
| `tip`     | Optional, 1–2 sentences: a common mistake, a rule of thumb, or how to answer in an interview.    |

## Code examples

- **Java or JavaScript only** (no shell, YAML, SQL dumps…). Pick whichever fits the topic.
- Short: max ~15 lines, only the lines that teach the idea.
- Put code in `detail` as `<pre><code>…</code></pre>`.
- `detail`, `points` are rendered as HTML, so escape `<` → `&lt;`, `>` → `&gt;`,
  `&` → `&amp;` (e.g. `List&lt;String&gt;`, `a -&gt; b`). Plain-text fields
  (`title`, `summary`, `simple`, `tip`) must NOT be escaped.
- Inside TS template literals escape backslashes (`\\n`) and backticks.

## Example node

```ts
{
  title: 'Consumer Group',
  level: 'beginner',
  summary: 'A team of consumers that share the work of reading one topic.',
  simple:
    'Think of a team sorting mail. Each mailbox goes to exactly one person on the team, so nobody sorts the same letter twice.',
  points: [
    'Consumers with the same <code>group.id</code> split the partitions between them.',
    'One partition is read by only one consumer in the group.',
    'More consumers than partitions? The extra ones just wait.',
    'Another group reads the same data on its own, from its own position.',
  ],
  detail: `<pre><code>props.put("group.id", "billing");
consumer.subscribe(List.of("orders"));</code></pre>`,
  tip: 'Your partition count is the max number of consumers that can work in parallel in one group.',
},
```

## Overview image (optional)

Drop `image/<topic>.png` and wire it in `data/<topic>/index.ts`:

```ts
import overview from '../../image/<topic>.png';
// …
image: { src: overview.src, alt: '<Topic> overview diagram' },
```

## Checklist before finishing

1. `data/index.ts` includes the new topic.
2. `npx tsc --noEmit -p .` and `npx eslint app/knowledge-map` pass.
3. Open `/knowledge-map`, pick the topic, click through a few nodes, try Prev / Next.

---

## Prompt to add a new topic

Copy, fill in the topic name, and send to Claude:

> Add a new topic **"&lt;TOPIC&gt;"** to the Knowledge Map in `app/knowledge-map/`.
> Read `app/knowledge-map/CONTENT_GUIDE.md`, `types.ts` and the existing `data/kafka/` and
> `data/java/` folders first, and follow the guide exactly.
> Cover everything from beginner to expert that a developer needs to know about &lt;TOPIC&gt;,
> as 8–12 branches ordered as a learning path (about 70–110 nodes).
> Explain concisely and clearly in a natural, friendly tone, like talking to a friend, avoiding
> difficult words. Code examples in Java or JavaScript only.
> If `app/knowledge-map/image/<topic>.png` exists, use it as the overview image.
> Register the topic in `data/index.ts`, then run tsc + eslint and check the page.
