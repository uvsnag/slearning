import type { KmNode } from '../../types';

export const renderingModel: KmNode = {
  title: 'How React Renders',
  level: 'intermediate',
  summary:
    'What happens between "state changed" and "pixels on screen": render, commit and reconciliation.',
  simple:
    'Think of a restaurant: an order comes in (trigger), the kitchen cooks (render), the waiter serves the plate (commit). Only the changed dishes get re-served.',
  points: [
    'Rendering means React calls your component functions. It is not the same as updating the DOM.',
    'React compares the new element tree with the old one and changes only what differs.',
    'Knowing this model explains most performance and "why did it re-render?" questions.',
  ],
  children: [
    {
      title: 'Trigger → Render → Commit',
      level: 'intermediate',
      summary: 'The three steps of every screen update in React.',
      simple:
        'Trigger: someone orders. Render: the kitchen prepares the dish (no customer sees it yet). Commit: the plate goes on the table.',
      points: [
        'Trigger: the first <code>root.render()</code>, or a state update.',
        'Render: React calls your components to get new JSX. Pure work, can be paused or thrown away.',
        'Commit: React applies the minimal DOM changes, then runs ref callbacks and effects.',
        'After commit, the browser paints the screen.',
      ],
    },
    {
      title: 'What Causes a Re-render',
      level: 'intermediate',
      summary:
        'A component re-renders when its state changes, its parent re-renders, or a context it reads changes.',
      simple:
        'When a parent re-renders, all its kids re-render too by default, like a family photo where everyone has to pose again.',
      points: [
        'Its own state update (if the new value differs by <code>Object.is</code>).',
        'Its parent re-rendered, even if the props look the same.',
        'A context it uses got a new value.',
        'Props changing alone don’t trigger anything; the parent re-rendering does.',
        'Re-renders are usually cheap. Only optimize when you measure a real problem.',
      ],
      tip: 'Interview trap: "Does a child re-render when props change?" Yes, but because the parent re-rendered. With the same props and no memo, it re-renders anyway.',
    },
    {
      title: 'Virtual DOM',
      level: 'intermediate',
      summary: 'The tree of lightweight JavaScript objects (React elements) that describes the UI.',
      simple:
        'It’s a blueprint of the house. Changing the blueprint is cheap; React then rebuilds only the walls that actually moved.',
      points: [
        'JSX creates plain objects like <code>{ type: "h1", props: {...} }</code>.',
        'React compares the new blueprint to the previous one, then updates the real DOM.',
        'The real win is the declarative model, not raw speed; hand-written DOM code can be faster.',
        'The React docs rarely use the term now; they talk about the element tree and rendering.',
      ],
    },
    {
      title: 'Reconciliation',
      level: 'advanced',
      summary:
        'The diffing step where React decides which parts of the old tree to keep, update or replace.',
      simple:
        'Like spot-the-difference between two pictures, but with simple rules so it stays fast.',
      points: [
        'Different element type at the same spot (e.g. <code>div</code> → <code>section</code>): throw away the subtree and its state.',
        'Same type: keep the DOM node and state, update changed attributes.',
        'Lists are matched by <code>key</code>, not by position (when keys are given).',
        'State belongs to a position in the tree, not to the component function.',
        'These rules make diffing about O(n) instead of the O(n³) of a perfect tree diff.',
      ],
      tip: 'Same component at the same position keeps its state. Want a fresh one? Give it a different key.',
    },
    {
      title: 'Fiber & Scheduling',
      level: 'expert',
      summary:
        'Fiber is React’s internal engine (since React 16) that splits rendering into small, interruptible units of work.',
      points: [
        'Each component instance has a fiber node: its type, props, state, hooks and links to parent/child/sibling.',
        'React keeps two trees: the current one on screen and a work-in-progress one being built.',
        'Work can be paused, resumed or thrown away, which makes concurrent rendering possible.',
        'Updates get priorities (lanes): typing beats a background list update.',
        'Hooks are stored as a linked list on the fiber, which is why hook order must never change.',
      ],
    },
  ],
};
