import { StudioProject, file, folder } from '../../types';

/**
 * Code Playground — a runnable Code Studio project. Every file is editable
 * and .java / .js files execute with the ▶ Run button (JS in a sandboxed
 * Web Worker, Java on the Wandbox API — see ../../runner.ts).
 */

const README = `
# Code Playground

Write and run **Java** or **JavaScript** directly inside the Code Studio.

## How to run

1. Open a \`.java\` or \`.js\` file — or just edit one of the samples here.
2. Press the **▶ Run** button (top-right of the editor), or hit **Ctrl+Enter**.
3. The output appears in the panel at the bottom.

## How it works

- **JavaScript** runs locally in your browser inside a sandboxed Web Worker.
  \`console.log / info / warn / error\` are captured, top-level \`await\` works,
  and a 10-second time limit protects against infinite loops.
- **Java** is compiled and executed remotely by the free
  Wandbox API (wandbox.org, OpenJDK 22) — internet access is required.
  Whichever class has the \`main\` method is run, and the \`public\`
  modifier on top-level classes is removed automatically (the sandbox
  compiles the snippet as a single anonymous file).

## Notes

- Edits live only in this browser tab. Use **↺ Reset** to restore the
  original content of a file, or reload the page to reset everything.
- Each file runs on its own — imports between playground files are not resolved.
`;

// Blank templates: ready to type into, nothing to delete first.
// Worked examples live in the algorithms/ folder.
const MAIN_JAVA = `
public class Main {

    public static void main(String[] args) {
        // Write your code here, then press ▶ Run (or Ctrl+Enter)
        System.out.println("Hello World");
    }
}
`;

const HELLO_JS = `
// Write your code here, then press ▶ Run (or Ctrl+Enter)
console.log('Hello World');
`;

const BINARY_SEARCH_JAVA = `
import java.util.Arrays;

public class BinarySearch {

    public static void main(String[] args) {
        int[] sorted = { 2, 5, 8, 12, 16, 23, 38, 56, 72, 91 };
        System.out.println("Array: " + Arrays.toString(sorted));

        for (int target : new int[] { 23, 5, 91, 40 }) {
            int index = search(sorted, target);
            System.out.println(index >= 0
                    ? "Found " + target + " at index " + index
                    : target + " is not in the array");
        }
    }

    static int search(int[] a, int target) {
        int lo = 0, hi = a.length - 1;
        while (lo <= hi) {
            int mid = (lo + hi) >>> 1;
            if (a[mid] == target) return mid;
            if (a[mid] < target) lo = mid + 1;
            else hi = mid - 1;
        }
        return -1;
    }
}
`;

const QUICK_SORT_JS = `
// Classic quicksort — try changing the pivot strategy or the input.
function quickSort(arr) {
  if (arr.length <= 1) return arr;
  const [pivot, ...rest] = arr;
  const smaller = rest.filter((n) => n < pivot);
  const larger = rest.filter((n) => n >= pivot);
  return [...quickSort(smaller), pivot, ...quickSort(larger)];
}

const input = [38, 27, 43, 3, 9, 82, 10];
console.log('input :', input);
console.log('sorted:', quickSort(input));

// Micro-benchmark against the built-in sort:
const big = Array.from({ length: 20000 }, (_, i) => ((i * 2654435761) % 100000));
let t = performance.now();
quickSort(big);
console.log('quickSort  :', (performance.now() - t).toFixed(1), 'ms');

t = performance.now();
[...big].sort((a, b) => a - b);
console.log('Array.sort :', (performance.now() - t).toFixed(1), 'ms');
`;

export const codePlaygroundProject: StudioProject = {
  id: 'code-playground',
  name: 'Code Playground',
  description:
    'Write Java or JavaScript in the editor and run it instantly: JavaScript executes in a ' +
    'sandboxed worker in your browser, Java is compiled and run on the free Wandbox API.',
  tags: ['Runnable', 'Java', 'JavaScript', 'Compiler', 'Playground'],
  runnable: true,
  root: [
    folder('algorithms', [
      file('BinarySearch.java', BINARY_SEARCH_JAVA),
      file('quickSort.js', QUICK_SORT_JS),
    ]),
    file('Main.java', MAIN_JAVA),
    file('hello.js', HELLO_JS),
    file('README.md', README),
  ],
  databases: [],
  defaultOpenPaths: ['Main.java', 'hello.js', 'README.md'],
};
