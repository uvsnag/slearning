// Interview data: ALGORITHMS & DATA STRUCTURES
import type { PvTopic } from '../../types';

export const topics: PvTopic[] = [
  {
    id: 'algorithms',
    name: 'Algorithms',
    icon: '🧮',
    questions: [
      {
        q: 'What is Big O Notation and why does it matter?',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>Big O describes how the cost of an algorithm grows as the input grows, focusing on scaling rather than exact time, so it drops constants and lower-order terms. It is useful to know the common order from fast to slow: O(1), O(log n), O(n), O(n log n), O(n squared), and O(2 to the n). It usually means the worst case unless stated, but average and amortized cost often matter more in practice. Because constants are ignored, a simpler algorithm can still win for small inputs, so measuring still matters.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Big O mô tả chi phí của một thuật toán tăng lên như thế nào khi đầu vào tăng, tập trung vào khả năng mở rộng thay vì thời gian chính xác, nên nó bỏ đi các hằng số và các số hạng bậc thấp. Nên nắm thứ tự phổ biến từ nhanh đến chậm: O(1), O(log n), O(n), O(n log n), O(n bình phương) và O(2 mũ n). Nó thường ám chỉ trường hợp xấu nhất trừ khi nói khác đi, nhưng chi phí trung bình và amortized thường quan trọng hơn trong thực tế. Vì các hằng số bị bỏ qua, một thuật toán đơn giản hơn vẫn có thể thắng với đầu vào nhỏ, nên việc đo đạc vẫn quan trọng.</p></details>
<p><strong>Big O Notation</strong> describes how the runtime or memory of an algorithm grows as the input size grows. It answers: <em>"If I double my data, how much slower does it get?"</em></p>
<p><strong>Analogy:</strong> You're looking for a friend in a crowd.</p>
<ul>
<li><strong>O(1)</strong>: Your friend is always at the front door. Crowd size doesn't matter → <strong>constant</strong>.</li>
<li><strong>O(log n)</strong>: You split the crowd in half each time (like binary search) → <strong>logarithmic</strong>.</li>
<li><strong>O(n)</strong>: You check every person one by one → <strong>linear</strong>.</li>
<li><strong>O(n log n)</strong>: Like sorting a deck of cards efficiently (merge sort) → <strong>linearithmic</strong>.</li>
<li><strong>O(n²)</strong>: You compare every person with every other person → <strong>quadratic</strong>.</li>
</ul>
<pre>Speed ranking (best to worst):
  O(1) → O(log n) → O(n) → O(n log n) → O(n²) → O(2ⁿ) → O(n!)

Example with n = 1,000,000:
  O(1)      → 1 operation
  O(log n)  → ~20 operations
  O(n)      → 1,000,000 operations
  O(n²)     → 1,000,000,000,000 operations (too slow!)</pre>
<div class="key-point">In interviews, always state the Big O of your solution. If it's O(n²), ask yourself: "Can I do better?" — usually you can with the right data structure.</div>`,
      },
      {
        q: 'What is an Array vs a Linked List? When to use which?',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>An array stores elements in contiguous memory, giving O(1) access by index and good cache performance. A linked list stores nodes anywhere with pointers, giving O(1) insert or delete when the node is known but O(n) to reach an element. In practice dynamic arrays are the default choice because contiguous memory is fast on modern CPUs. Linked lists are best for O(1) splicing, queues and deques, or when the node reference is already held, such as in an LRU cache.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Array lưu các phần tử trong vùng nhớ liền kề, cho phép truy cập theo index với O(1) và hiệu năng cache tốt. Linked list lưu các node ở bất cứ đâu với các con trỏ, cho phép insert hoặc delete O(1) khi đã biết node nhưng phải mất O(n) để tới được một phần tử. Trong thực tế, dynamic array là lựa chọn mặc định vì vùng nhớ liền kề chạy nhanh trên các CPU hiện đại. Linked list phù hợp nhất khi cần splicing O(1), cho queue và deque, hoặc khi đã có sẵn tham chiếu tới node, chẳng hạn trong một LRU cache.</p></details>
<p><strong>Array</strong>: Elements stored in <strong>contiguous</strong> (side-by-side) memory. Access by index is instant.</p>
<p><strong>Linked List</strong>: Elements (nodes) stored anywhere in memory, each pointing to the next one.</p>
<p><strong>Analogy:</strong></p>
<ul>
<li><strong>Array</strong> = Movie theater seats in a row. Seat #5 is easy to find (just count). But inserting a new seat in the middle means moving everyone over.</li>
<li><strong>Linked List</strong> = Scavenger hunt. Each clue tells you where the next clue is. Easy to add/remove clues anywhere, but finding clue #5 means following all previous clues.</li>
</ul>
<pre>Array:      [10][20][30][40][50]   (contiguous in memory)
             0   1   2   3   4    (instant access by index)

Linked List: [10]→[20]→[30]→[40]→[50]→null
             (must walk from head to find element)</pre>
<table><tr><th>Operation</th><th>Array</th><th>Linked List</th></tr>
<tr><td>Access by index</td><td>O(1) ✅</td><td>O(n) ❌</td></tr>
<tr><td>Insert at beginning</td><td>O(n) ❌</td><td>O(1) ✅</td></tr>
<tr><td>Insert at end</td><td>O(1) amortized</td><td>O(1) with tail ptr</td></tr>
<tr><td>Delete from middle</td><td>O(n)</td><td>O(1) if you have the node</td></tr>
<tr><td>Memory</td><td>Compact</td><td>Extra space for pointers</td></tr></table>
<div class="key-point">Use <strong>Array</strong> when you need fast random access (arr[i]). Use <strong>Linked List</strong> when you frequently insert/delete at the beginning or middle.</div>`,
      },
      {
        q: 'What is a Stack and a Queue?',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>A stack is Last In First Out and a queue is First In First Out, and both keep their main operations at O(1). Stacks are used for the call stack, undo and redo, expression parsing, bracket matching, and iterative DFS. Queues are used for order-preserving work such as BFS, task scheduling, and buffering. Useful variants include the deque (double-ended), the priority queue backed by a heap, and the circular buffer; in Java, prefer <code>ArrayDeque</code> over the old <code>Stack</code> class.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Stack là Last In First Out còn queue là First In First Out, và cả hai đều giữ các thao tác chính ở mức O(1). Stack được dùng cho call stack, undo và redo, phân tích biểu thức, kiểm tra dấu ngoặc, và DFS theo kiểu lặp. Queue được dùng cho các công việc cần giữ đúng thứ tự như BFS, lập lịch tác vụ, và buffering. Các biến thể hữu ích gồm deque (hai đầu), priority queue dựng trên heap, và circular buffer; trong Java, nên dùng <code>ArrayDeque</code> thay cho class <code>Stack</code> cũ.</p></details>
<p><strong>Stack</strong> = Last In, First Out (LIFO). Like a stack of plates — you add and remove from the top.</p>
<p><strong>Queue</strong> = First In, First Out (FIFO). Like a line at a coffee shop — first person in line is served first.</p>
<pre>Stack (LIFO):             Queue (FIFO):
  push(1) → [1]            enqueue(1) → [1]
  push(2) → [1,2]          enqueue(2) → [1,2]
  push(3) → [1,2,3]        enqueue(3) → [1,2,3]
  pop()   → 3  [1,2]       dequeue()  → 1  [2,3]
  pop()   → 2  [1]         dequeue()  → 2  [3]</pre>
<p><strong>Real-world uses:</strong></p>
<ul>
<li><strong>Stack</strong>: Browser back button (go back to the last page), Undo/Redo, function call stack, balanced parentheses check.</li>
<li><strong>Queue</strong>: Print queue (first document sent prints first), BFS traversal, task scheduling, message queues.</li>
</ul>
<pre>// Stack example: Check balanced parentheses
Input: "({[]})"
  '(' → push → ['(']
  '{' → push → ['(', '{']
  '[' → push → ['(', '{', '[']
  ']' → pop '[' matches → ['(', '{']
  '}' → pop '{' matches → ['(']
  ')' → pop '(' matches → []
  Stack empty → BALANCED ✅</pre>
<div class="key-point">Both Stack and Queue have <strong>O(1)</strong> push/pop and enqueue/dequeue. In Java: use <code>Deque</code> (ArrayDeque) for stack, <code>Queue</code> (LinkedList) for queue.</div>`,
      },
      {
        q: 'What is a Hash Map (Hash Table) and how does it work?',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>A hash map gives O(1) average lookup by hashing a key to a bucket index, and most of the design is about handling collisions. Collisions are resolved by chaining or open addressing, and the map resizes and rehashes when it gets full, which is why the cost is amortized rather than guaranteed. Bad or malicious hashing can degrade it to O(n), so Java 8 turns long chains into balanced trees for O(log n) per bucket. A correct hashCode and equals pair is required, and keys must not be changed after insertion.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Hash map cho phép tra cứu trung bình O(1) bằng cách hash một key thành index của bucket, và phần lớn thiết kế xoay quanh việc xử lý collision. Collision được giải quyết bằng chaining hoặc open addressing, và map sẽ resize rồi rehash khi bị đầy, đó là lý do chi phí là amortized chứ không phải được đảm bảo. Việc hash kém hoặc bị tấn công có thể khiến nó suy giảm về O(n), nên Java 8 chuyển các chuỗi dài thành cây cân bằng để đạt O(log n) mỗi bucket. Cần một cặp hashCode và equals đúng đắn, và không được thay đổi key sau khi đã chèn.</p></details>
<p>A <strong>Hash Map</strong> stores key-value pairs and provides <strong>O(1)</strong> average lookup, insert, and delete.</p>
<p><strong>Analogy:</strong> A library filing system. Each book (value) has a unique call number (key). The librarian uses a formula (hash function) to calculate exactly which shelf to go to — no need to search every shelf.</p>
<pre>How it works:
1. hash("apple") → 3    (hash function converts key to array index)
2. Store at index 3: buckets[3] = { "apple": 5 }
3. Lookup: hash("apple") → 3 → buckets[3] → value is 5  ✅

Buckets array:
  [0] → null
  [1] → null
  [2] → {"banana": 2}
  [3] → {"apple": 5} → {"grape": 7}  ← collision! (linked list)
  [4] → null</pre>
<p><strong>Collision handling:</strong> When two keys hash to the same index:</p>
<ul>
<li><strong>Chaining</strong>: Each bucket holds a linked list of entries (most common).</li>
<li><strong>Open Addressing</strong>: Find the next empty slot (linear probing).</li>
</ul>
<pre>// Java example:
Map&lt;String, Integer&gt; prices = new HashMap&lt;&gt;();
prices.put("apple", 5);    // O(1)
prices.get("apple");        // O(1) → 5
prices.containsKey("apple"); // O(1) → true</pre>
<div class="key-point">Hash Map is the <strong>#1 most useful data structure</strong> in interviews. It solves "find duplicates", "count frequency", "two sum", and many more in O(n) instead of O(n²).</div>`,
      },
      {
        q: 'What is Binary Search and when can you use it?',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>Binary search halves the search space each step for O(log n), but the data must be sorted or otherwise monotonic. It is more general than searching a sorted array: it can also search over a range of possible answers when feasibility is monotonic. The common bugs are integer overflow in <code>mid = (lo + hi) / 2</code>, which is fixed by writing <code>lo + (hi - lo) / 2</code>, and off-by-one errors or infinite loops from careless boundary updates. Keeping the loop invariant clear helps avoid these mistakes.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Binary search cắt đôi không gian tìm kiếm ở mỗi bước để đạt O(log n), nhưng dữ liệu phải được sắp xếp hoặc có tính đơn điệu. Nó tổng quát hơn việc chỉ tìm trong một mảng đã sắp xếp: nó còn có thể tìm trên một khoảng các đáp án khả dĩ khi tính khả thi có tính đơn điệu. Các lỗi phổ biến là tràn số nguyên trong <code>mid = (lo + hi) / 2</code>, khắc phục bằng cách viết <code>lo + (hi - lo) / 2</code>, và các lỗi lệch một đơn vị hoặc vòng lặp vô hạn do cập nhật biên cẩu thả. Giữ cho loop invariant rõ ràng sẽ giúp tránh những sai sót này.</p></details>
<p><strong>Binary Search</strong> finds a target in a <strong>sorted</strong> array by repeatedly cutting the search space in half. It's O(log n) — extremely fast.</p>
<p><strong>Analogy:</strong> Guessing a number between 1-100. Instead of guessing 1, 2, 3... you say "50?" → "Too high" → "25?" → "Too low" → "37?" Each guess eliminates half the numbers.</p>
<pre>Find 23 in [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]:

Step 1: mid = 16, 23 > 16 → search right half
Step 2: mid = 38, 23 < 38 → search left half  
Step 3: mid = 23 → FOUND! ✅  (only 3 steps instead of 6)

In 1 billion items: only ~30 steps!</pre>
<pre>// Java implementation:
int binarySearch(int[] arr, int target) {
    int left = 0, right = arr.length - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;  // avoid overflow
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;  // not found
}</pre>
<p><strong>Can use binary search when:</strong></p>
<ul>
<li>Data is <strong>sorted</strong> (or has a monotonic property)</li>
<li>You can eliminate half the search space each step</li>
</ul>
<div class="key-point">Common trick: Binary search isn't just for sorted arrays. It works on any problem where you can answer "too high or too low?" — like finding minimum speed to finish on time, or the first bad version in a release.</div>`,
      },
      {
        q: 'Explain Bubble Sort, Selection Sort, and Insertion Sort.',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>Bubble sort, selection sort, and insertion sort are all O(n squared) and too slow for large data. Insertion sort is the most useful: it runs in O(n) on nearly-sorted data, is stable and in-place, and is used inside faster sorts like Timsort for small parts. Selection sort makes the fewest swaps, which helps when writes are costly, but it is never adaptive. Bubble sort is mainly a teaching tool, useful only for detecting already-sorted input in one pass.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Bubble sort, selection sort và insertion sort đều là O(n bình phương) và quá chậm với dữ liệu lớn. Insertion sort là hữu ích nhất: nó chạy O(n) trên dữ liệu gần như đã sắp xếp, ổn định (stable) và tại chỗ (in-place), và được dùng bên trong các thuật toán sort nhanh hơn như Timsort cho các phần nhỏ. Selection sort thực hiện ít swap nhất, hữu ích khi việc ghi tốn kém, nhưng nó không bao giờ mang tính thích ứng. Bubble sort chủ yếu là công cụ dạy học, chỉ hữu ích để phát hiện đầu vào đã sắp xếp sẵn trong một lượt duyệt.</p></details>
<p>These are three simple sorting algorithms, all O(n²). Great for learning but too slow for large data.</p>
<p><strong>1. Bubble Sort</strong> — Repeatedly swap adjacent elements if they're in the wrong order. Like bubbles rising to the surface.</p>
<pre>[5, 3, 8, 1] → compare pairs and swap:
  5,3 → swap → [3, 5, 8, 1]
  5,8 → ok   → [3, 5, 8, 1]
  8,1 → swap → [3, 5, 1, 8]  (8 "bubbled" to the end)
  ...repeat until sorted</pre>
<p><strong>2. Selection Sort</strong> — Find the minimum element and put it at the front. Like selecting the shortest person in a line and moving them to the left.</p>
<pre>[5, 3, 8, 1] → find min (1), swap with first:
  [1, 3, 8, 5] → find min in remaining (3), already in place:
  [1, 3, 8, 5] → find min in remaining (5), swap with 8:
  [1, 3, 5, 8] ✅</pre>
<p><strong>3. Insertion Sort</strong> — Build the sorted portion one element at a time. Like sorting a hand of playing cards — pick up each card and insert it in the right position.</p>
<pre>[5, 3, 8, 1]:
  [5] | 3, 8, 1  → insert 3 → [3, 5]
  [3, 5] | 8, 1  → insert 8 → [3, 5, 8]
  [3, 5, 8] | 1  → insert 1 → [1, 3, 5, 8] ✅</pre>
<table><tr><th>Algorithm</th><th>Best</th><th>Average</th><th>Worst</th><th>Stable?</th></tr>
<tr><td>Bubble</td><td>O(n)</td><td>O(n²)</td><td>O(n²)</td><td>Yes</td></tr>
<tr><td>Selection</td><td>O(n²)</td><td>O(n²)</td><td>O(n²)</td><td>No</td></tr>
<tr><td>Insertion</td><td>O(n)</td><td>O(n²)</td><td>O(n²)</td><td>Yes</td></tr></table>
<div class="key-point"><strong>Insertion Sort</strong> is the best of the three — it's fast on nearly-sorted data (O(n)) and is used as a subroutine in Timsort (Python/Java's default sort).</div>`,
      },
      {
        q: 'Explain Merge Sort. How does it work?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Merge sort uses divide and conquer: it splits the array in half, sorts each half, then merges them, always in O(n log n). Its strengths are a guaranteed worst case with no bad-pivot risk, plus stability, at the cost of O(n) extra space for the merge. It is a good fit for linked lists and for external sorting when data does not fit in memory, since sorted runs can be merged from disk. Choose merge sort when stability or a worst-case guarantee is needed, and quicksort when in-place speed matters more.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Merge sort dùng chia để trị: nó chia mảng làm đôi, sắp xếp từng nửa, rồi trộn (merge) chúng lại, luôn ở mức O(n log n). Điểm mạnh của nó là đảm bảo trường hợp xấu nhất mà không có rủi ro chọn pivot tệ, cùng với tính ổn định, đổi lại tốn O(n) bộ nhớ phụ cho việc merge. Nó phù hợp với linked list và với external sorting khi dữ liệu không vừa trong bộ nhớ, vì các đoạn đã sắp xếp có thể được merge từ đĩa. Hãy chọn merge sort khi cần tính ổn định hoặc đảm bảo trường hợp xấu nhất, và chọn quicksort khi tốc độ tại chỗ quan trọng hơn.</p></details>
<p><strong>Merge Sort</strong> uses <strong>Divide and Conquer</strong>: split the array in half, sort each half, then merge the two sorted halves. Always O(n log n).</p>
<p><strong>Analogy:</strong> Sorting a deck of cards. Split the deck in half. Split each half again. Keep splitting until you have single cards (already sorted). Then merge pairs of sorted piles by comparing their top cards.</p>
<pre>Merge Sort [38, 27, 43, 3, 9, 82, 10]:

Split:  [38, 27, 43, 3]  |  [9, 82, 10]
Split:  [38, 27] [43, 3] | [9, 82] [10]
Split:  [38][27] [43][3] | [9][82] [10]

Merge:  [27,38] [3,43]   | [9,82] [10]
Merge:  [3, 27, 38, 43]  | [9, 10, 82]
Merge:  [3, 9, 10, 27, 38, 43, 82] ✅</pre>
<p><strong>How merging works:</strong></p>
<pre>Merge [3, 27] and [9, 10]:
  Compare 3 vs 9 → take 3  → [3]
  Compare 27 vs 9 → take 9  → [3, 9]
  Compare 27 vs 10 → take 10 → [3, 9, 10]
  Take remaining 27 → [3, 9, 10, 27] ✅</pre>
<pre>// Java implementation:
void mergeSort(int[] arr, int left, int right) {
    if (left >= right) return;
    int mid = (left + right) / 2;
    mergeSort(arr, left, mid);      // sort left half
    mergeSort(arr, mid + 1, right); // sort right half
    merge(arr, left, mid, right);   // merge sorted halves
}</pre>
<table><tr><th>Property</th><th>Value</th></tr>
<tr><td>Time</td><td>O(n log n) always</td></tr>
<tr><td>Space</td><td>O(n) extra (for temp arrays)</td></tr>
<tr><td>Stable</td><td>Yes</td></tr></table>
<div class="key-point">Merge Sort is <strong>guaranteed O(n log n)</strong> (no worst case like Quick Sort). Used for sorting linked lists and external sorting (data that doesn't fit in memory).</div>`,
      },
      {
        q: 'Explain Quick Sort. How does it work?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Quicksort picks a pivot, partitions elements smaller to the left and larger to the right, then recurses, running in O(n log n) on average and in-place with good cache performance. Its weaknesses are an O(n squared) worst case with consistently bad pivots and that it is not stable. These are handled by choosing a random pivot or median-of-three, and by introsort, which most libraries use, switching to heapsort when recursion gets too deep to keep O(n log n). Three-way partitioning also helps when there are many duplicate keys.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Quicksort chọn một pivot, phân hoạch các phần tử nhỏ hơn về bên trái và lớn hơn về bên phải, rồi đệ quy, chạy trung bình O(n log n) và tại chỗ với hiệu năng cache tốt. Điểm yếu của nó là trường hợp xấu nhất O(n bình phương) khi liên tục chọn pivot tệ và nó không ổn định. Những điều này được xử lý bằng cách chọn pivot ngẫu nhiên hoặc median-of-three, và bằng introsort, thứ mà hầu hết các thư viện dùng, chuyển sang heapsort khi đệ quy quá sâu để giữ được O(n log n). Phân hoạch ba chiều (three-way) cũng hữu ích khi có nhiều key trùng lặp.</p></details>
<p><strong>Quick Sort</strong> picks a "pivot" element, partitions the array so everything smaller goes left and everything larger goes right, then recursively sorts left and right.</p>
<p><strong>Analogy:</strong> Organizing books on a shelf. Pick one book (pivot). Put all shorter books to the left, taller books to the right. Then do the same for each side.</p>
<pre>Quick Sort [8, 3, 1, 7, 0, 10, 2]:
  Pivot = 7
  Partition: [3, 1, 0, 2] [7] [8, 10]
            (all ≤ 7)      ↑   (all > 7)

  Sort left:  Pivot = 1 → [0] [1] [3, 2]
  Sort [3,2]: Pivot = 2 → [2] [3]

  Result: [0, 1, 2, 3, 7, 8, 10] ✅</pre>
<pre>// Java implementation:
void quickSort(int[] arr, int low, int high) {
    if (low >= high) return;
    int pivotIdx = partition(arr, low, high);
    quickSort(arr, low, pivotIdx - 1);
    quickSort(arr, pivotIdx + 1, high);
}

int partition(int[] arr, int low, int high) {
    int pivot = arr[high];  // pick last element as pivot
    int i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            swap(arr, i, j);
        }
    }
    swap(arr, i + 1, high);
    return i + 1;
}</pre>
<table><tr><th>Property</th><th>Value</th></tr>
<tr><td>Best/Average</td><td>O(n log n)</td></tr>
<tr><td>Worst case</td><td>O(n²) — when pivot is always min/max</td></tr>
<tr><td>Space</td><td>O(log n) — in-place</td></tr>
<tr><td>Stable</td><td>No</td></tr></table>
<div class="key-point">Quick Sort is <strong>faster in practice</strong> than Merge Sort due to cache locality (in-place). Fix worst case by choosing a <strong>random pivot</strong> or <strong>median-of-three</strong>.</div>`,
      },
      {
        q: 'What is a Binary Tree and a Binary Search Tree (BST)?',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>A binary tree has nodes with up to two children, and a binary search tree adds the rule that the left subtree is smaller and the right subtree is larger, giving O(log n) search, insert, and delete. This only holds when the tree is balanced; inserting sorted data into a plain BST turns it into a linked list with O(n) cost. That is why self-balancing trees such as red-black and AVL trees exist and rebalance on change. An in-order traversal of a BST returns values in sorted order.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Binary tree có các node với tối đa hai con, còn binary search tree thêm quy tắc là cây con bên trái nhỏ hơn và cây con bên phải lớn hơn, cho phép search, insert và delete ở mức O(log n). Điều này chỉ đúng khi cây cân bằng; chèn dữ liệu đã sắp xếp vào một BST thường sẽ biến nó thành một linked list với chi phí O(n). Đó là lý do tồn tại các cây tự cân bằng như red-black tree và AVL tree, vốn tự tái cân bằng khi có thay đổi. Duyệt in-order một BST sẽ trả về các giá trị theo thứ tự đã sắp xếp.</p></details>
<p><strong>Binary Tree</strong>: Each node has at most 2 children (left and right).</p>
<p><strong>Binary Search Tree (BST)</strong>: A binary tree where left child < parent < right child. This ordering makes searching fast.</p>
<p><strong>Analogy:</strong> A BST is like a "20 Questions" game. "Is the number > 50?" → No → "Is it > 25?" → Yes → "Is it > 37?" Each question eliminates half the possibilities.</p>
<pre>BST Example:
           8
         /   \\
        3     10
       / \\      \\
      1   6     14
         / \\   /
        4   7 13

Search for 7:
  8 → 7 < 8 → go left
  3 → 7 > 3 → go right
  6 → 7 > 6 → go right
  7 → FOUND! ✅  (4 steps, not all 9 nodes)</pre>
<p><strong>BST operations:</strong></p>
<table><tr><th>Operation</th><th>Average</th><th>Worst (unbalanced)</th></tr>
<tr><td>Search</td><td>O(log n)</td><td>O(n)</td></tr>
<tr><td>Insert</td><td>O(log n)</td><td>O(n)</td></tr>
<tr><td>Delete</td><td>O(log n)</td><td>O(n)</td></tr></table>
<pre>// Java: Insert into BST
TreeNode insert(TreeNode root, int val) {
    if (root == null) return new TreeNode(val);
    if (val < root.val) root.left = insert(root.left, val);
    else root.right = insert(root.right, val);
    return root;
}</pre>
<div class="key-point">A BST becomes O(n) when it's unbalanced (like a linked list). That's why we use <strong>self-balancing BSTs</strong> like AVL Tree or Red-Black Tree (used in Java TreeMap).</div>`,
      },
      {
        q: 'What are tree traversals: Inorder, Preorder, Postorder, and Level-order?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>The three depth-first traversals differ by when the node is visited relative to its children. Pre-order (node, left, right) suits copying or serializing a tree, in-order (left, node, right) gives sorted output on a BST, and post-order (left, right, node) suits deletion or evaluating expression trees. Level-order is breadth-first and visits by depth using a queue, useful for shortest paths by edges or printing level by level. These are naturally recursive but can be done with an explicit stack, or with Morris traversal for O(1) space.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Ba kiểu duyệt theo chiều sâu khác nhau ở thời điểm node được thăm so với các con của nó. Pre-order (node, trái, phải) phù hợp để sao chép hoặc serialize một cây, in-order (trái, node, phải) cho kết quả đã sắp xếp trên một BST, còn post-order (trái, phải, node) phù hợp để xóa cây hoặc tính toán cây biểu thức. Level-order là duyệt theo chiều rộng và thăm theo từng độ sâu bằng một queue, hữu ích để tìm đường đi ngắn nhất theo số cạnh hoặc in theo từng tầng. Những cách này vốn tự nhiên là đệ quy nhưng có thể làm bằng một stack tường minh, hoặc bằng Morris traversal để đạt bộ nhớ O(1).</p></details>
<p>Tree traversals are ways to visit every node in a tree. The order you visit determines the traversal type.</p>
<pre>Example tree:
        1
       / \\
      2   3
     / \\
    4   5</pre>
<p><strong>1. Inorder (Left → Root → Right):</strong> Visit left subtree, then root, then right.</p>
<pre>Result: [4, 2, 5, 1, 3]
Use: BST inorder gives nodes in SORTED order!</pre>
<p><strong>2. Preorder (Root → Left → Right):</strong> Visit root first, then left, then right.</p>
<pre>Result: [1, 2, 4, 5, 3]
Use: Copying/serializing a tree.</pre>
<p><strong>3. Postorder (Left → Right → Root):</strong> Visit children first, then root.</p>
<pre>Result: [4, 5, 2, 3, 1]
Use: Deleting a tree (delete children before parent), calculating folder sizes.</pre>
<p><strong>4. Level-order (BFS):</strong> Visit level by level, left to right.</p>
<pre>Result: [1, 2, 3, 4, 5]
Use: Finding shortest path, printing tree by levels.</pre>
<pre>// Java: Inorder traversal
void inorder(TreeNode node) {
    if (node == null) return;
    inorder(node.left);           // L
    System.out.print(node.val);   // Root
    inorder(node.right);          // R
}

// Level-order (BFS) with queue:
void levelOrder(TreeNode root) {
    Queue&lt;TreeNode&gt; q = new LinkedList&lt;&gt;();
    q.add(root);
    while (!q.isEmpty()) {
        TreeNode node = q.poll();
        System.out.print(node.val);
        if (node.left != null) q.add(node.left);
        if (node.right != null) q.add(node.right);
    }
}</pre>
<div class="key-point">Memory trick: <strong>In</strong>order = root <strong>In</strong> the middle. <strong>Pre</strong>order = root comes <strong>first</strong>. <strong>Post</strong>order = root comes <strong>last</strong>.</div>`,
      },
      {
        q: 'What is a Heap (Priority Queue) and how does it work?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>A heap is a complete binary tree where each parent is greater than or equal to (or less than or equal to) its children, giving O(1) peek at the min or max and O(log n) insert and remove. It is stored in a flat array using index math, so no pointers are needed. It is the right choice when the current extreme is needed repeatedly, such as priority queues, Dijkstra, task scheduling, and top-K problems. A heap is only partly ordered, so it is not useful for search or sorted iteration, and building one from an array is O(n).</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Heap là một cây nhị phân đầy đủ nơi mỗi node cha lớn hơn hoặc bằng (hoặc nhỏ hơn hoặc bằng) các con của nó, cho phép peek phần tử min hoặc max ở O(1) và insert cùng remove ở O(log n). Nó được lưu trong một mảng phẳng bằng phép toán trên index, nên không cần con trỏ. Nó là lựa chọn đúng khi cần lấy phần tử cực trị hiện tại nhiều lần, chẳng hạn priority queue, Dijkstra, lập lịch tác vụ, và các bài toán top-K. Một heap chỉ được sắp xếp một phần, nên nó không hữu ích để search hay duyệt theo thứ tự, và việc dựng heap từ một mảng là O(n).</p></details>
<p>A <strong>Heap</strong> is a complete binary tree where the parent is always greater (Max-Heap) or smaller (Min-Heap) than its children. It gives you the min/max element in O(1).</p>
<p><strong>Analogy:</strong> A company hierarchy. In a Min-Heap, the CEO (smallest number) is always at the top. New employees (inserts) start at the bottom and "bubble up" if they outrank their manager.</p>
<pre>Min-Heap:
        1
       / \\
      3   5
     / \\
    7   4

- Root is always the MINIMUM (1)
- Not fully sorted! Just parent ≤ children

Operations:
  peek()   → 1          O(1)
  insert(2) → add at bottom, bubble up  O(log n)
  poll()   → remove root (1), move last to root, bubble down  O(log n)</pre>
<pre>// Java: PriorityQueue is a Min-Heap by default
PriorityQueue&lt;Integer&gt; minHeap = new PriorityQueue&lt;&gt;();
minHeap.add(5);  // [5]
minHeap.add(1);  // [1, 5]
minHeap.add(3);  // [1, 5, 3]
minHeap.poll();  // returns 1, heap becomes [3, 5]

// Max-Heap:
PriorityQueue&lt;Integer&gt; maxHeap = new PriorityQueue&lt;&gt;(Collections.reverseOrder());</pre>
<p><strong>Common uses:</strong></p>
<ul>
<li><strong>Top K elements</strong>: "Find the 10 largest numbers" → use a Min-Heap of size 10</li>
<li><strong>Merge K sorted lists</strong>: Put heads of all lists in a Min-Heap</li>
<li><strong>Dijkstra's shortest path</strong>: Always process the nearest unvisited node</li>
<li><strong>Task scheduling</strong>: Process highest-priority task first</li>
</ul>
<div class="key-point">A Heap is stored as an <strong>array</strong> under the hood. For node at index i: left child = 2i+1, right child = 2i+2, parent = (i-1)/2.</div>`,
      },
      {
        q: 'What is Recursion? Explain with examples.',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>Recursion solves a problem by reducing it to smaller versions until it reaches a base case, so a correct base case and steady progress toward it are essential to avoid infinite recursion. It expresses naturally recursive structures cleanly, such as trees, graphs, divide and conquer, and backtracking. Each call uses a stack frame, so deep recursion can overflow the stack, and naive recursion can recompute overlapping subproblems, which memoization and dynamic programming fix. Tail-call optimization helps in some languages but not on the JVM.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Đệ quy giải một bài toán bằng cách rút gọn nó thành các phiên bản nhỏ hơn cho tới khi chạm base case, nên một base case đúng đắn và tiến trình đều đặn tới nó là thiết yếu để tránh đệ quy vô hạn. Nó thể hiện gọn gàng các cấu trúc vốn tự nhiên là đệ quy, chẳng hạn cây, đồ thị, chia để trị, và backtracking. Mỗi lần gọi dùng một stack frame, nên đệ quy quá sâu có thể tràn stack, và đệ quy ngây thơ có thể tính lại các bài toán con chồng chéo, điều mà memoization và dynamic programming khắc phục. Tail-call optimization giúp ích ở một số ngôn ngữ nhưng không có trên JVM.</p></details>
<p><strong>Recursion</strong> = a function that calls itself to solve smaller versions of the same problem until it reaches a base case.</p>
<p><strong>Analogy:</strong> Russian nesting dolls (Matryoshka). Open a doll → there's a smaller doll inside. Keep opening until you reach the tiniest doll (base case). Then put them all back together.</p>
<pre>// Factorial: 5! = 5 × 4 × 3 × 2 × 1
int factorial(int n) {
    if (n <= 1) return 1;       // base case: stop here!
    return n * factorial(n - 1); // recursive case: call yourself
}

factorial(5)
  = 5 * factorial(4)
  = 5 * 4 * factorial(3)
  = 5 * 4 * 3 * factorial(2)
  = 5 * 4 * 3 * 2 * factorial(1)
  = 5 * 4 * 3 * 2 * 1
  = 120</pre>
<pre>// Fibonacci: 0, 1, 1, 2, 3, 5, 8, 13...
int fib(int n) {
    if (n <= 1) return n;        // base cases: fib(0)=0, fib(1)=1
    return fib(n - 1) + fib(n - 2);
}
// ⚠️ This is O(2ⁿ) — very slow! Use memoization (see DP question)</pre>
<p><strong>Two rules of recursion:</strong></p>
<ol>
<li><strong>Base case</strong>: When to stop (prevents infinite loop)</li>
<li><strong>Recursive case</strong>: Break the problem into a smaller version of itself</li>
</ol>
<div class="key-point">Every recursion can be converted to iteration (using a stack). Watch out for <strong>StackOverflowError</strong> if recursion is too deep. Optimize with <strong>memoization</strong> or <strong>tail recursion</strong>.</div>`,
      },
      {
        q: 'What is Dynamic Programming (DP)?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Dynamic programming applies when a problem has optimal substructure and overlapping subproblems, so each sub-answer is computed once and reused, turning exponential work into polynomial. The key steps are defining the state and the recurrence clearly. It can be written top-down with memoization (recursion plus a cache) or bottom-up with tabulation (iterative, often allowing space savings). Many DP solutions only need the last row or two, which reduces memory, and the hardest part is recognizing the problem and defining the state.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Dynamic programming áp dụng khi một bài toán có optimal substructure và các bài toán con chồng chéo, nên mỗi đáp án con chỉ được tính một lần rồi tái sử dụng, biến công việc mũ thành đa thức. Các bước then chốt là định nghĩa rõ ràng state và công thức truy hồi. Nó có thể viết theo hướng top-down với memoization (đệ quy cộng một cache) hoặc bottom-up với tabulation (theo kiểu lặp, thường cho phép tiết kiệm bộ nhớ). Nhiều lời giải DP chỉ cần một hoặc hai hàng cuối, giúp giảm bộ nhớ, và phần khó nhất là nhận ra bài toán và định nghĩa state.</p></details>
<p><strong>Dynamic Programming</strong> = solving complex problems by breaking them into overlapping subproblems and storing results to avoid recomputing them.</p>
<p><strong>Analogy:</strong> Imagine calculating "1+1+1+1+1+1+1+1". That's 8. Now add "+1". You don't start over! You remember the previous result (8) and just add 1 = 9. That's DP — <strong>remembering answers</strong>.</p>
<p><strong>Two approaches:</strong></p>
<pre>1. Top-Down (Memoization): Start from big problem, store results as you go
2. Bottom-Up (Tabulation): Start from smallest subproblems, build up

// Fibonacci WITHOUT DP → O(2ⁿ) 💀
fib(5) calls fib(4) and fib(3)
fib(4) calls fib(3) and fib(2)   ← fib(3) computed TWICE!

// Fibonacci WITH Memoization → O(n) ✅
int[] memo = new int[n + 1];
int fib(int n) {
    if (n <= 1) return n;
    if (memo[n] != 0) return memo[n];  // already computed!
    memo[n] = fib(n - 1) + fib(n - 2);
    return memo[n];
}

// Fibonacci Bottom-Up → O(n), O(1) space
int fib(int n) {
    int a = 0, b = 1;
    for (int i = 2; i <= n; i++) {
        int temp = a + b;
        a = b;
        b = temp;
    }
    return b;
}</pre>
<p><strong>When to use DP:</strong></p>
<ul>
<li>Problem has <strong>overlapping subproblems</strong> (same calculation repeated)</li>
<li>Problem has <strong>optimal substructure</strong> (optimal solution built from optimal sub-solutions)</li>
<li>Common DP problems: Fibonacci, Longest Common Subsequence, Knapsack, Coin Change</li>
</ul>
<div class="key-point">DP trick: If a recursion tree has repeated branches, it's a DP problem. Draw the recursion tree first, then add memoization.</div>`,
      },
      {
        q: 'Explain BFS (Breadth-First Search) and DFS (Depth-First Search).',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>BFS and DFS both explore a graph, and the choice depends on the goal. BFS explores level by level with a queue and finds the shortest path in an unweighted graph, using memory proportional to the width. DFS goes deep with a stack or recursion, using memory proportional to the depth, and fits path exploration, cycle detection, topological sort, and connected components. Both are O(V+E); remember to mark visited nodes to avoid loops, and use iteration when depth is large to avoid stack overflow.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>BFS và DFS đều duyệt một đồ thị, và lựa chọn tùy thuộc vào mục tiêu. BFS duyệt theo từng tầng bằng một queue và tìm đường đi ngắn nhất trong đồ thị không trọng số, dùng bộ nhớ tỉ lệ với chiều rộng. DFS đi sâu bằng một stack hoặc đệ quy, dùng bộ nhớ tỉ lệ với chiều sâu, và phù hợp để khám phá đường đi, phát hiện chu trình, sắp xếp topo, và tìm thành phần liên thông. Cả hai đều là O(V+E); nhớ đánh dấu các node đã thăm để tránh lặp vòng, và dùng cách lặp khi độ sâu lớn để tránh tràn stack.</p></details>
<p>BFS and DFS are two ways to visit all nodes in a graph or tree.</p>
<p><strong>Analogy — Searching for keys in a house:</strong></p>
<ul>
<li><strong>BFS</strong>: Check every room on floor 1 first, then every room on floor 2, etc. (level by level)</li>
<li><strong>DFS</strong>: Enter a room, if there's a door, go through it immediately. Keep going deeper until you hit a dead end, then backtrack.</li>
</ul>
<pre>Graph:
    1 --- 2
    |     |
    3 --- 4 --- 5

BFS (starting from 1): 1 → 2 → 3 → 4 → 5  (level by level)
DFS (starting from 1): 1 → 2 → 4 → 3 → 5  (go deep first)</pre>
<pre>// BFS uses a QUEUE:
void bfs(int start) {
    Queue&lt;Integer&gt; queue = new LinkedList&lt;&gt;();
    Set&lt;Integer&gt; visited = new HashSet&lt;&gt;();
    queue.add(start);
    visited.add(start);
    while (!queue.isEmpty()) {
        int node = queue.poll();
        for (int neighbor : graph.get(node)) {
            if (!visited.contains(neighbor)) {
                visited.add(neighbor);
                queue.add(neighbor);
            }
        }
    }
}

// DFS uses a STACK (or recursion):
void dfs(int node, Set&lt;Integer&gt; visited) {
    visited.add(node);
    for (int neighbor : graph.get(node)) {
        if (!visited.contains(neighbor)) {
            dfs(neighbor, visited);
        }
    }
}</pre>
<table><tr><th>Feature</th><th>BFS</th><th>DFS</th></tr>
<tr><td>Data structure</td><td>Queue</td><td>Stack / Recursion</td></tr>
<tr><td>Finds shortest path?</td><td>Yes (unweighted)</td><td>No</td></tr>
<tr><td>Memory</td><td>Higher (stores entire level)</td><td>Lower</td></tr>
<tr><td>Use case</td><td>Shortest path, level-order</td><td>Cycle detection, topological sort</td></tr></table>
<div class="key-point">Use <strong>BFS</strong> for "shortest path" or "minimum steps" problems. Use <strong>DFS</strong> for "explore all paths", "detect cycles", or when solutions are deep in the graph.</div>`,
      },
      {
        q: 'What is the Two Pointer technique?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>The two-pointer technique replaces an O(n squared) brute force with O(n) by moving two indices instead of nesting loops. One common shape has pointers starting at opposite ends and converging, used for finding a pair with a target sum in a sorted array or checking palindromes. Another has a fast and a slow pointer moving the same direction, used for cycle detection or in-place removal of duplicates. The converging form usually needs a sorted array, and the sliding window is a close relative.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Kỹ thuật two-pointer thay thế cách brute force O(n bình phương) bằng O(n) bằng cách di chuyển hai chỉ số thay vì lồng các vòng lặp. Một dạng phổ biến có hai con trỏ bắt đầu ở hai đầu đối diện và tiến về nhau, dùng để tìm một cặp có tổng bằng giá trị đích trong mảng đã sắp xếp hoặc kiểm tra chuỗi đối xứng (palindrome). Một dạng khác có con trỏ nhanh và con trỏ chậm cùng đi một hướng, dùng để phát hiện chu trình hoặc loại bỏ phần tử trùng lặp tại chỗ. Dạng tiến về nhau thường cần một mảng đã sắp xếp, và sliding window là một họ hàng gần của nó.</p></details>
<p><strong>Two Pointers</strong> = use two indices that move through an array, usually from both ends or at different speeds, to solve problems in O(n).</p>
<p><strong>Analogy:</strong> Two people searching a hallway of lockers — one starts from the left, one from the right. They walk toward each other and meet in the middle.</p>
<p><strong>Example 1: Two Sum (sorted array)</strong></p>
<pre>Find two numbers that add to 9 in [1, 2, 4, 6, 8, 10]:

left = 0 (value 1), right = 5 (value 10)
  1 + 10 = 11 > 9 → move right ← 
  1 + 8 = 9 → FOUND! ✅

// O(n) instead of O(n²) brute force!</pre>
<p><strong>Example 2: Remove duplicates from sorted array</strong></p>
<pre>[1, 1, 2, 2, 3] → [1, 2, 3, _, _]

slow = 0, fast = 1
  fast=1: arr[1]==arr[0], skip
  fast=2: arr[2]!=arr[1], slow++, arr[slow]=arr[fast] → [1,2,2,2,3]
  fast=3: arr[3]==arr[2], skip
  fast=4: arr[4]!=arr[3], slow++, arr[slow]=arr[fast] → [1,2,3,2,3]
Result: first 3 elements = [1, 2, 3] ✅</pre>
<p><strong>Example 3: Is Palindrome?</strong></p>
<pre>"racecar": left='r', right='r' ✅ → left='a', right='a' ✅ → ... → palindrome!</pre>
<p><strong>Patterns:</strong></p>
<ul>
<li><strong>Opposite ends</strong>: Left at start, right at end (two sum, palindrome, container with most water)</li>
<li><strong>Same direction</strong>: Slow and fast pointer (remove duplicates, fast/slow linked list cycle)</li>
</ul>
<div class="key-point">Two pointers usually reduce O(n²) to O(n). Works best on <strong>sorted arrays</strong> or when you need to compare elements from both ends.</div>`,
      },
      {
        q: 'What is the Sliding Window technique?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>The sliding window technique turns repeated recomputation over every subarray or substring into O(n) by keeping a running window and updating it as it moves. A fixed-size window, such as the maximum sum of k consecutive elements, slides by adding the new element and dropping the old one. A variable-size window, such as the longest substring without repeating characters, expands on the right and shrinks on the left when a constraint breaks. It often pairs with a hash map, and the tricky part is shrinking the window correctly.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Kỹ thuật sliding window biến việc tính đi tính lại trên mọi mảng con hoặc chuỗi con thành O(n) bằng cách giữ một cửa sổ đang chạy và cập nhật nó khi nó di chuyển. Một cửa sổ kích thước cố định, chẳng hạn tổng lớn nhất của k phần tử liên tiếp, trượt đi bằng cách thêm phần tử mới và bỏ phần tử cũ. Một cửa sổ kích thước thay đổi, chẳng hạn chuỗi con dài nhất không có ký tự lặp lại, mở rộng ở bên phải và co lại ở bên trái khi một ràng buộc bị vi phạm. Nó thường đi cùng với một hash map, và phần khó là co cửa sổ lại cho đúng.</p></details>
<p><strong>Sliding Window</strong> = maintain a "window" (subarray/substring) that expands or shrinks as you move through the array. Avoids recomputing from scratch each time.</p>
<p><strong>Analogy:</strong> A magnifying glass sliding over a book page. You can see a fixed-size chunk of text at a time. As you slide it right, you lose one character from the left and gain one from the right.</p>
<p><strong>Example 1: Maximum sum of subarray of size K</strong></p>
<pre>Array: [2, 1, 5, 1, 3, 2], K = 3
Find max sum of 3 consecutive elements.

Brute force: Calculate sum of EVERY subarray of size 3 → O(n*k)

Sliding Window: 
  Window [2,1,5] sum = 8
  Slide: remove 2, add 1 → [1,5,1] sum = 8 - 2 + 1 = 7
  Slide: remove 1, add 3 → [5,1,3] sum = 7 - 1 + 3 = 9 ✅ (max!)
  Slide: remove 5, add 2 → [1,3,2] sum = 9 - 5 + 2 = 6
→ O(n)!</pre>
<pre>// Java: Max sum subarray of size k
int maxSum(int[] arr, int k) {
    int windowSum = 0, maxSum = 0;
    for (int i = 0; i < arr.length; i++) {
        windowSum += arr[i];            // add right element
        if (i >= k) windowSum -= arr[i - k]; // remove left element
        if (i >= k - 1) maxSum = Math.max(maxSum, windowSum);
    }
    return maxSum;
}</pre>
<p><strong>Two types:</strong></p>
<ul>
<li><strong>Fixed-size window</strong>: Window always has K elements (max sum subarray)</li>
<li><strong>Variable-size window</strong>: Expand right, shrink left based on condition (longest substring without repeating chars)</li>
</ul>
<div class="key-point">Sliding window turns O(n*k) or O(n²) into O(n). Look for keywords: "contiguous subarray", "substring", "window of size K".</div>`,
      },
      {
        q: 'How does a Graph work? Adjacency List vs Adjacency Matrix.',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>A graph is a set of nodes connected by edges, and the first decision is how to represent it based on density. An adjacency list stores each vertex's neighbors, uses O(V+E) space, and is the default for sparse graphs with fast neighbor iteration. An adjacency matrix is a V by V grid that uses O(V squared) space but gives O(1) edge lookup, so it fits dense graphs or frequent edge checks. It also helps to decide early whether the graph is directed or undirected and weighted or unweighted, and to avoid a matrix on a large sparse graph.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Đồ thị là một tập hợp các node được nối bởi các cạnh, và quyết định đầu tiên là biểu diễn nó thế nào dựa trên mật độ. Adjacency list lưu các node kề của từng đỉnh, dùng bộ nhớ O(V+E), và là lựa chọn mặc định cho đồ thị thưa với việc duyệt node kề nhanh. Adjacency matrix là một lưới V nhân V dùng bộ nhớ O(V bình phương) nhưng cho phép tra cứu cạnh ở O(1), nên phù hợp với đồ thị dày hoặc khi thường xuyên kiểm tra cạnh. Cũng nên quyết định sớm xem đồ thị là có hướng hay vô hướng, có trọng số hay không, và tránh dùng matrix trên một đồ thị thưa và lớn.</p></details>
<p>A <strong>Graph</strong> is a collection of nodes (vertices) connected by edges. It models relationships: social networks, roads, web pages, dependencies.</p>
<p><strong>Types:</strong></p>
<ul>
<li><strong>Directed</strong>: Edges have direction (Twitter follow: A→B doesn't mean B→A)</li>
<li><strong>Undirected</strong>: Edges go both ways (Facebook friendship: mutual)</li>
<li><strong>Weighted</strong>: Edges have values (road distances, flight costs)</li>
</ul>
<p><strong>Two ways to store a graph:</strong></p>
<pre>Graph: 0--1--2
       |     |
       3-----+

Adjacency List (most common):
  0: [1, 3]
  1: [0, 2]
  2: [1, 3]
  3: [0, 2]

Adjacency Matrix:
     0  1  2  3
  0 [0, 1, 0, 1]
  1 [1, 0, 1, 0]
  2 [0, 1, 0, 1]
  3 [1, 0, 1, 0]</pre>
<table><tr><th>Operation</th><th>Adjacency List</th><th>Adjacency Matrix</th></tr>
<tr><td>Space</td><td>O(V + E) ✅</td><td>O(V²)</td></tr>
<tr><td>Check if edge exists</td><td>O(degree)</td><td>O(1) ✅</td></tr>
<tr><td>Find all neighbors</td><td>O(degree) ✅</td><td>O(V)</td></tr>
<tr><td>Best for</td><td>Sparse graphs</td><td>Dense graphs</td></tr></table>
<pre>// Java: Adjacency List
Map&lt;Integer, List&lt;Integer&gt;&gt; graph = new HashMap&lt;&gt;();
graph.put(0, Arrays.asList(1, 3));
graph.put(1, Arrays.asList(0, 2));
// etc.</pre>
<div class="key-point">Most real-world graphs are <strong>sparse</strong> (few edges relative to nodes), so <strong>adjacency list</strong> is the default choice. Use adjacency matrix only for small, dense graphs.</div>`,
      },
      {
        q: "What is Dijkstra's Algorithm?",
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Dijkstra's algorithm finds the shortest paths from one start node to all other nodes in a graph with non-negative edge weights. It uses a min-heap to always pick the closest unvisited node, giving <code>O((V+E) log V)</code> time. It does not work with negative edge weights; for those, use <strong>Bellman-Ford</strong>, which also detects negative cycles. For unweighted graphs, plain <strong>BFS</strong> is enough, and <strong>A*</strong> is Dijkstra plus a heuristic when there is a fixed target.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Thuật toán Dijkstra tìm đường đi ngắn nhất từ một node bắt đầu tới tất cả các node khác trong đồ thị có trọng số cạnh không âm. Nó dùng min-heap để luôn chọn node gần nhất chưa thăm, cho độ phức tạp <code>O((V+E) log V)</code>. Dijkstra không hoạt động với trọng số cạnh âm; trong trường hợp đó hãy dùng <strong>Bellman-Ford</strong>, thuật toán này còn phát hiện được chu trình âm. Với đồ thị không trọng số thì <strong>BFS</strong> thông thường là đủ, còn <strong>A*</strong> chính là Dijkstra cộng thêm một hàm heuristic khi đã có đích cố định.</p></details>
<p><strong>Dijkstra's Algorithm</strong> finds the <strong>shortest path</strong> from a source node to all other nodes in a <strong>weighted graph</strong> (non-negative weights).</p>
<p><strong>Analogy:</strong> You're at a city (node A) and want the shortest route to every other city. You start by visiting the nearest city first, then update distances to its neighbors. Always visit the unvisited city with the smallest known distance.</p>
<pre>Graph:
  A --1-- B --3-- D
  |       |       |
  4       2       1
  |       |       |
  C --5-- E --2-- F

Dijkstra from A:
  Start: dist = {A:0, B:∞, C:∞, D:∞, E:∞, F:∞}
  
  Visit A(0): Update B=1, C=4
  Visit B(1): Update D=4, E=3
  Visit E(3): Update C=min(4,8)=4, F=5
  Visit C(4): no improvement
  Visit D(4): Update F=min(5,5)=5
  Visit F(5): done

  Shortest paths from A: {A:0, B:1, C:4, D:4, E:3, F:5}</pre>
<pre>// Java: Dijkstra with Priority Queue
void dijkstra(int[][] graph, int src) {
    int[] dist = new int[n];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[src] = 0;
    PriorityQueue&lt;int[]&gt; pq = new PriorityQueue&lt;&gt;((a,b) -> a[1]-b[1]);
    pq.add(new int[]{src, 0});
    
    while (!pq.isEmpty()) {
        int[] curr = pq.poll();
        int u = curr[0], d = curr[1];
        if (d > dist[u]) continue; // already found shorter
        for (int[] neighbor : adj.get(u)) {
            int v = neighbor[0], w = neighbor[1];
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.add(new int[]{v, dist[v]});
            }
        }
    }
}</pre>
<p><strong>Time:</strong> O((V + E) log V) with priority queue.</p>
<div class="key-point">Dijkstra <strong>does NOT work</strong> with negative edge weights. For negative weights, use <strong>Bellman-Ford</strong>. Google Maps uses a variant of Dijkstra to find shortest routes.</div>`,
      },
      {
        q: 'What is the Greedy Algorithm approach?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>A greedy algorithm makes the best local choice at each step and never changes it. It is fast and simple, but it only gives the correct global answer for some problems, such as interval scheduling, Huffman coding, Dijkstra, and minimum spanning trees. A common trap is coin change: greedy works for standard coins but can fail for other coin sets, where <strong>Dynamic Programming</strong> is needed. Greedy should be tested with a counterexample before trusting it.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Thuật toán tham lam (greedy) chọn phương án tốt nhất tại mỗi bước và không bao giờ thay đổi lại lựa chọn đó. Nó nhanh và đơn giản, nhưng chỉ cho ra đáp án tối ưu toàn cục với một số bài toán nhất định, như lập lịch khoảng thời gian (interval scheduling), mã hóa Huffman, Dijkstra, và cây khung nhỏ nhất (minimum spanning tree). Một cái bẫy thường gặp là bài toán đổi tiền: greedy đúng với bộ tiền tiêu chuẩn nhưng có thể sai với các bộ tiền khác, khi đó cần đến <strong>Dynamic Programming</strong>. Nên kiểm tra greedy bằng một phản ví dụ trước khi tin tưởng vào nó.</p></details>
<p>A <strong>Greedy Algorithm</strong> makes the <strong>locally optimal choice</strong> at each step, hoping it leads to the globally optimal solution.</p>
<p><strong>Analogy:</strong> Climbing a mountain in fog. You can only see a few meters ahead. At each step, you walk in the direction that goes UP the most. This doesn't always get you to the highest peak, but for many problems, it works perfectly.</p>
<p><strong>Example 1: Coin Change (Greedy works here)</strong></p>
<pre>Make change for 36 cents using fewest coins [25, 10, 5, 1]:
  Greedy: Take largest coin first
  25 → remaining 11
  10 → remaining 1
  1  → remaining 0
  Answer: 3 coins [25, 10, 1] ✅</pre>
<p><strong>Example 2: Activity Selection</strong></p>
<pre>Select max non-overlapping activities:
  Activities: [(1,3), (2,5), (3,4), (5,7), (6,8)]
  
  Greedy: Sort by end time, pick earliest ending activity
  Pick (1,3) → Pick (3,4) → Skip (2,5) overlaps → Pick (5,7) → Skip (6,8)
  Answer: 3 activities [(1,3), (3,4), (5,7)] ✅</pre>
<p><strong>When greedy works:</strong></p>
<ul>
<li>Problem has <strong>greedy-choice property</strong>: local optimal → global optimal</li>
<li>Fractional knapsack, Huffman coding, Dijkstra's, minimum spanning tree</li>
</ul>
<p><strong>When greedy FAILS:</strong></p>
<pre>Coins [1, 3, 4], amount = 6:
  Greedy: 4 + 1 + 1 = 3 coins
  Optimal: 3 + 3 = 2 coins ← greedy fails! Need DP instead.</pre>
<div class="key-point">Greedy is <strong>fast and simple</strong> but doesn't always give the optimal answer. If greedy doesn't work, try <strong>Dynamic Programming</strong>.</div>`,
      },
      {
        q: 'What is Backtracking?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Backtracking builds a solution one step at a time and undoes the last choice when a path cannot lead to a valid answer. It stops bad branches early through <strong>pruning</strong>, which makes it better than plain brute force. It fits constraint problems like permutations, combinations, subsets, N-Queens, and Sudoku. The template is <strong>choose, explore, un-choose</strong>, and forgetting the un-choose step corrupts the state for other branches.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Backtracking xây dựng lời giải từng bước một và hoàn tác lại lựa chọn gần nhất khi một hướng đi không thể dẫn tới đáp án hợp lệ. Nó loại bỏ sớm các nhánh xấu nhờ <strong>pruning</strong> (cắt tỉa), nên hiệu quả hơn brute force thuần túy. Kỹ thuật này phù hợp với các bài toán ràng buộc như hoán vị, tổ hợp, tập con, N-Queens và Sudoku. Khuôn mẫu của nó là <strong>choose, explore, un-choose</strong> (chọn, khám phá, bỏ chọn), và nếu quên bước un-choose thì trạng thái sẽ bị hỏng cho các nhánh khác.</p></details>
<p><strong>Backtracking</strong> = try all possible options, and when you hit a dead end, undo the last choice and try a different path. It's like solving a maze — if you hit a wall, go back and try another turn.</p>
<p><strong>Analogy:</strong> Trying combinations on a lock. Try 000, 001, 002... If you know the first digit is 3 (constraint), you skip 000-299 entirely. That's the power of backtracking — <strong>pruning</strong> bad choices early.</p>
<p><strong>Example: Generate all permutations of [1, 2, 3]</strong></p>
<pre>                 []
          /      |      \\
        [1]     [2]     [3]
       /   \\   /   \\   /   \\
    [1,2] [1,3] [2,1] [2,3] [3,1] [3,2]
      |     |     |     |     |     |
  [1,2,3] [1,3,2] [2,1,3] [2,3,1] [3,1,2] [3,2,1]</pre>
<pre>// Java: Permutations
void permute(int[] nums, List&lt;Integer&gt; current, boolean[] used, List&lt;List&lt;Integer&gt;&gt; result) {
    if (current.size() == nums.length) {
        result.add(new ArrayList&lt;&gt;(current));
        return;
    }
    for (int i = 0; i < nums.length; i++) {
        if (used[i]) continue;       // skip if already used
        used[i] = true;              // choose
        current.add(nums[i]);
        permute(nums, current, used, result); // explore
        current.remove(current.size() - 1);   // un-choose (backtrack!)
        used[i] = false;
    }
}</pre>
<p><strong>Classic backtracking problems:</strong></p>
<ul>
<li>N-Queens: Place N queens on a chessboard so none attack each other</li>
<li>Sudoku solver: Try numbers 1-9, backtrack if conflict</li>
<li>Subsets, Combinations, Permutations</li>
<li>Word search in a grid</li>
</ul>
<div class="key-point">Backtracking template: <strong>Choose → Explore → Un-choose</strong>. The "un-choose" step is what makes it backtracking. Always add <strong>pruning conditions</strong> to skip obviously bad paths.</div>`,
      },
      {
        q: 'What is the difference between Stable and Unstable sorting?',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>A <strong>stable</strong> sort keeps equal elements in their original order, while an <strong>unstable</strong> sort may reorder them. Stability matters when sorting by more than one key, because it preserves the earlier ordering within equal groups. Merge sort and insertion sort are stable; quicksort and heapsort are not. This is why Java uses stable Timsort for objects but an unstable quicksort for primitives, where equal values look the same anyway.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Sắp xếp <strong>ổn định</strong> (stable) giữ nguyên thứ tự ban đầu của các phần tử bằng nhau, trong khi sắp xếp <strong>không ổn định</strong> (unstable) có thể đảo lộn chúng. Tính ổn định quan trọng khi sắp xếp theo nhiều khóa, vì nó bảo toàn thứ tự trước đó bên trong các nhóm phần tử bằng nhau. Merge sort và insertion sort là ổn định; còn quicksort và heapsort thì không. Đây là lý do vì sao Java dùng Timsort ổn định cho object nhưng lại dùng quicksort không ổn định cho kiểu nguyên thủy, nơi mà các giá trị bằng nhau trông vẫn giống hệt nhau.</p></details>
<p>A <strong>stable</strong> sort preserves the relative order of equal elements. An <strong>unstable</strong> sort doesn't guarantee it.</p>
<p><strong>Analogy:</strong> You have a list of students sorted by name. Now sort by grade. With a <strong>stable</strong> sort, students with the same grade remain alphabetically ordered. With an unstable sort, their name order might get shuffled.</p>
<pre>Original (sorted by name):
  Alice: B
  Bob: A
  Charlie: B
  David: A

Stable sort by grade:
  Bob: A      ← David after Bob (original order preserved)
  David: A
  Alice: B    ← Charlie after Alice (original order preserved)
  Charlie: B

Unstable sort by grade:
  David: A    ← order of A's might be swapped!
  Bob: A
  Charlie: B  ← order of B's might be swapped!
  Alice: B</pre>
<table><tr><th>Stable Sorts</th><th>Unstable Sorts</th></tr>
<tr><td>Merge Sort</td><td>Quick Sort</td></tr>
<tr><td>Insertion Sort</td><td>Heap Sort</td></tr>
<tr><td>Bubble Sort</td><td>Selection Sort</td></tr>
<tr><td>Timsort (Java/Python)</td><td></td></tr></table>
<div class="key-point">Stability matters when you sort by multiple criteria (e.g., sort by date, then by priority). Java's <code>Arrays.sort()</code> uses <strong>Timsort (stable)</strong> for objects and <strong>Dual-Pivot Quicksort (unstable)</strong> for primitives.</div>`,
      },
      {
        q: 'How do you detect a cycle in a Linked List?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>A cycle in a linked list is detected with <strong>Floyd's tortoise and hare</strong>: a slow pointer moves one step and a fast pointer moves two. If they meet, there is a cycle; if the fast pointer reaches the end, there is none. This runs in <code>O(n)</code> time and <code>O(1)</code> space, better than storing visited nodes in a hash set. To find where the cycle starts, move one pointer back to the head, then advance both one step until they meet again.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Chu trình trong linked list được phát hiện bằng <strong>thuật toán rùa và thỏ của Floyd</strong>: một con trỏ chậm đi một bước và một con trỏ nhanh đi hai bước. Nếu chúng gặp nhau thì có chu trình; nếu con trỏ nhanh chạm cuối danh sách thì không có. Cách này chạy với thời gian <code>O(n)</code> và bộ nhớ <code>O(1)</code>, tốt hơn việc lưu các node đã thăm vào một hash set. Để tìm điểm bắt đầu của chu trình, đưa một con trỏ về lại đầu danh sách, rồi cho cả hai cùng tiến một bước cho tới khi gặp lại nhau.</p></details>
<p>Use <strong>Floyd's Tortoise and Hare</strong> algorithm: two pointers, one moves 1 step (slow), the other moves 2 steps (fast). If there's a cycle, they'll eventually meet.</p>
<p><strong>Analogy:</strong> Two runners on a circular track. The fast runner laps the slow runner — they MUST meet. On a straight track (no cycle), the fast runner just reaches the end.</p>
<pre>Linked List with cycle:
  1 → 2 → 3 → 4 → 5
              ↑       ↓
              8 ← 7 ← 6

Step 1: slow=1, fast=1
Step 2: slow=2, fast=3
Step 3: slow=3, fast=5
Step 4: slow=4, fast=7
Step 5: slow=5, fast=3
Step 6: slow=6, fast=5
Step 7: slow=7, fast=7 → MEET! Cycle detected! ✅</pre>
<pre>// Java: Floyd's Cycle Detection
boolean hasCycle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;         // 1 step
        fast = fast.next.next;    // 2 steps
        if (slow == fast) return true;  // they met → cycle!
    }
    return false;  // fast reached end → no cycle
}

// Find WHERE the cycle starts:
ListNode findCycleStart(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) {
            slow = head;  // reset slow to head
            while (slow != fast) {  // move both 1 step
                slow = slow.next;
                fast = fast.next;
            }
            return slow;  // meeting point = cycle start
        }
    }
    return null;
}</pre>
<div class="key-point">Time: O(n), Space: O(1). This is much better than using a HashSet (O(n) space). Floyd's algorithm is a classic interview question!</div>`,
      },
      {
        q: 'What is a Trie (Prefix Tree) and when is it used?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>A <strong>trie</strong> stores strings by sharing common prefixes, where each node is a character. Insert and lookup take <code>O(L)</code> time based on the key length, no matter how many words are stored. Its main strength is prefix queries, which makes it good for autocomplete, spell-check, and IP routing. The tradeoff is memory use, so real versions often use a map per node or a compressed trie; for plain exact matches a hash map is usually simpler.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Một <strong>trie</strong> lưu trữ các chuỗi bằng cách chia sẻ các tiền tố chung, trong đó mỗi node là một ký tự. Thao tác insert và tra cứu mất thời gian <code>O(L)</code> theo độ dài khóa, bất kể có bao nhiêu từ được lưu. Điểm mạnh chính của nó là truy vấn theo tiền tố, nên phù hợp cho autocomplete, kiểm tra chính tả và định tuyến IP. Đánh đổi là mức tiêu tốn bộ nhớ, nên các phiên bản thực tế thường dùng một map cho mỗi node hoặc trie nén; với các phép so khớp chính xác thuần túy thì một hash map thường đơn giản hơn.</p></details>
<p>A <strong>Trie</strong> is a tree-like data structure for storing strings where each node represents a character. It's extremely fast for prefix-based lookups.</p>
<p><strong>Analogy:</strong> A dictionary organized letter by letter. To find "cat", go to 'c', then 'a', then 't'. To find all words starting with "ca", follow 'c' → 'a' and you immediately see all options.</p>
<pre>Trie storing ["cat", "car", "card", "dog"]:

        root
       /    \\
      c      d
      |      |
      a      o
     / \\     |
    t*  r*   g*
        |
        d*
  (* = end of word)

Search "car": c→a→r (found, marked as word ✅)
Search "ca":  c→a (found prefix, but not a complete word)
Prefix "ca":  Follow c→a → find all children: "cat", "car", "card"</pre>
<pre>// Java: Trie implementation
class TrieNode {
    TrieNode[] children = new TrieNode[26];
    boolean isWord = false;
}

class Trie {
    TrieNode root = new TrieNode();
    
    void insert(String word) {
        TrieNode node = root;
        for (char c : word.toCharArray()) {
            if (node.children[c - 'a'] == null)
                node.children[c - 'a'] = new TrieNode();
            node = node.children[c - 'a'];
        }
        node.isWord = true;
    }
    
    boolean search(String word) {
        TrieNode node = find(word);
        return node != null && node.isWord;
    }
    
    boolean startsWith(String prefix) {
        return find(prefix) != null;
    }
}</pre>
<p><strong>Use cases:</strong></p>
<ul>
<li><strong>Autocomplete</strong>: "Type 'goo' → suggest google, good, goose"</li>
<li><strong>Spell checker</strong>: Check if a word exists quickly</li>
<li><strong>IP routing</strong>: Longest prefix matching</li>
<li><strong>Word games</strong>: Boggle, Scrabble word validation</li>
</ul>
<div class="key-point">Trie search is <strong>O(L)</strong> where L is length of the word — independent of how many words are stored! Much faster than HashSet for prefix queries.</div>`,
      },
      {
        q: 'What is the Knapsack Problem?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>The knapsack problem picks items to get the most value without going over a weight limit, and it is a classic <strong>Dynamic Programming</strong> problem. The key split is <strong>0/1</strong> (each item once) versus <strong>unbounded</strong> (unlimited copies), which changes the recurrence. The state <code>dp[i][w]</code> is the best value using the first i items within capacity w, and it can be reduced to a 1D array. Its cost is <code>O(n*W)</code>, which is only pseudo-polynomial, so 0/1 knapsack is NP-hard; greedy solves only the fractional version.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Bài toán knapsack (cái túi) chọn các món đồ để đạt giá trị lớn nhất mà không vượt quá giới hạn trọng lượng, và đây là một bài toán kinh điển của <strong>Dynamic Programming</strong>. Sự phân biệt then chốt là <strong>0/1</strong> (mỗi món chỉ lấy một lần) so với <strong>unbounded</strong> (lấy không giới hạn số bản), điều này làm thay đổi công thức truy hồi. Trạng thái <code>dp[i][w]</code> là giá trị tốt nhất khi dùng i món đầu tiên trong sức chứa w, và có thể rút gọn về mảng 1 chiều. Chi phí của nó là <code>O(n*W)</code>, chỉ là giả đa thức (pseudo-polynomial), nên 0/1 knapsack là bài toán NP-hard; greedy chỉ giải được phiên bản phân số (fractional).</p></details>
<p>The <strong>Knapsack Problem</strong>: Given items with weights and values, select items to maximize total value without exceeding a weight limit.</p>
<p><strong>Analogy:</strong> You're packing for a hike with a backpack that holds 10kg. You have a tent (3kg, value 5), sleeping bag (4kg, value 7), food (5kg, value 8), camera (2kg, value 4). What do you take to maximize usefulness?</p>
<p><strong>0/1 Knapsack (can't split items):</strong></p>
<pre>Items: [{weight:3, value:5}, {weight:4, value:7}, 
        {weight:5, value:8}, {weight:2, value:4}]
Capacity: 10kg

Brute force: Try all combinations (2ⁿ) → too slow!

DP approach: Build a table
     weight →  0  1  2  3  4  5  6  7  8  9  10
item 0 (3,5):  0  0  0  5  5  5  5  5  5  5   5
item 1 (4,7):  0  0  0  5  7  7  7  12 12 12  12
item 2 (5,8):  0  0  0  5  7  8  8  12 13 15  15
item 3 (2,4):  0  0  4  5  7  9  11 12 12 16  17

Answer: 17 (take items: sleeping bag + food + camera = 4+5+2=11... 
             actually: 5+7+4+... let me recalculate)
Best: sleeping bag(7) + food(8) + camera(4) = 19? weight = 4+5+2 = 11 > 10
Take: tent(5) + sleeping bag(7) + camera(4) = 16, weight = 3+4+2 = 9 ✅</pre>
<pre>// Java: 0/1 Knapsack DP
int knapsack(int[] weights, int[] values, int capacity) {
    int n = weights.length;
    int[][] dp = new int[n + 1][capacity + 1];
    for (int i = 1; i <= n; i++) {
        for (int w = 0; w <= capacity; w++) {
            dp[i][w] = dp[i-1][w]; // don't take item i
            if (weights[i-1] <= w)
                dp[i][w] = Math.max(dp[i][w], 
                    dp[i-1][w - weights[i-1]] + values[i-1]); // take it
        }
    }
    return dp[n][capacity];
}</pre>
<div class="key-point">0/1 Knapsack is a classic <strong>DP problem</strong>: O(n × capacity). Variations: Unbounded Knapsack (unlimited copies), Fractional Knapsack (can split items — use Greedy).</div>`,
      },
      {
        q: 'What is Topological Sort?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Topological sort orders the nodes of a directed acyclic graph so that every edge points forward. It solves dependency problems like build order, task scheduling, and course prerequisites. Two standard methods are <strong>Kahn's algorithm</strong> (BFS using in-degrees) and DFS with a finish stack, both <code>O(V+E)</code>. It only exists if the graph has no cycle, so it also works as cycle detection: if the full order cannot be produced, there is a cycle.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Topological sort sắp xếp các node của một đồ thị có hướng không chu trình (DAG) sao cho mọi cạnh đều hướng về phía trước. Nó giải các bài toán phụ thuộc như thứ tự build, lập lịch tác vụ, và điều kiện tiên quyết môn học. Hai phương pháp tiêu chuẩn là <strong>thuật toán Kahn</strong> (BFS dùng bậc vào - in-degree) và DFS với ngăn xếp hoàn thành, cả hai đều <code>O(V+E)</code>. Nó chỉ tồn tại khi đồ thị không có chu trình, nên còn dùng được để phát hiện chu trình: nếu không tạo ra được thứ tự đầy đủ thì có chu trình.</p></details>
<p><strong>Topological Sort</strong> orders nodes in a <strong>directed acyclic graph (DAG)</strong> such that for every edge A→B, A comes before B.</p>
<p><strong>Analogy:</strong> Getting dressed. You must put on underwear before pants, socks before shoes. There's a dependency order. Topological sort gives you a valid order to get dressed.</p>
<pre>Dependencies:
  underwear → pants → belt
  shirt → belt → jacket
  socks → shoes
  pants → shoes

Topological Sort: underwear, socks, shirt, pants, belt, shoes, jacket
(Any valid order where dependencies come first)</pre>
<pre>Graph:
  A → B → D
  A → C → D

Topological order: A, B, C, D (or A, C, B, D) — both valid</pre>
<pre>// Java: Topological Sort using BFS (Kahn's Algorithm)
List&lt;Integer&gt; topologicalSort(int n, List&lt;List&lt;Integer&gt;&gt; adj) {
    int[] inDegree = new int[n];
    for (int u = 0; u < n; u++)
        for (int v : adj.get(u)) inDegree[v]++;
    
    Queue&lt;Integer&gt; queue = new LinkedList&lt;&gt;();
    for (int i = 0; i < n; i++)
        if (inDegree[i] == 0) queue.add(i); // no dependencies
    
    List&lt;Integer&gt; order = new ArrayList&lt;&gt;();
    while (!queue.isEmpty()) {
        int u = queue.poll();
        order.add(u);
        for (int v : adj.get(u)) {
            if (--inDegree[v] == 0) queue.add(v);
        }
    }
    return order.size() == n ? order : null; // null = has cycle!
}</pre>
<p><strong>Use cases:</strong></p>
<ul>
<li>Build systems (compile A before B)</li>
<li>Task scheduling with dependencies</li>
<li>Course prerequisite ordering</li>
<li>Package dependency resolution (npm, Maven)</li>
</ul>
<div class="key-point">Topological sort only works on <strong>DAGs</strong> (directed graphs with no cycles). If there's a cycle, no valid ordering exists. Kahn's algorithm detects cycles: if result size < n, there's a cycle.</div>`,
      },
      {
        q: 'What is the Union-Find (Disjoint Set) data structure?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p><strong>Union-Find</strong> (disjoint set) groups elements into non-overlapping sets and answers whether two elements are in the same set or merges two sets. With <strong>path compression</strong> and <strong>union by rank or size</strong>, both operations run in nearly constant time. It fits dynamic connectivity problems like Kruskal's MST, cycle detection in undirected graphs, and counting connected components. It handles merging well but is not designed for splitting sets apart.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><strong>Union-Find</strong> (disjoint set) nhóm các phần tử thành các tập không giao nhau và trả lời được liệu hai phần tử có cùng một tập hay không, hoặc gộp hai tập lại. Với <strong>path compression</strong> (nén đường đi) và <strong>union by rank hoặc size</strong>, cả hai thao tác đều chạy gần như trong thời gian hằng số. Nó phù hợp với các bài toán liên thông động như MST của Kruskal, phát hiện chu trình trong đồ thị vô hướng, và đếm số thành phần liên thông. Nó xử lý việc gộp rất tốt nhưng không được thiết kế để tách các tập ra.</p></details>
<p><strong>Union-Find</strong> tracks a collection of elements partitioned into disjoint (non-overlapping) sets. It supports two operations efficiently: <strong>Find</strong> (which set does this element belong to?) and <strong>Union</strong> (merge two sets).</p>
<p><strong>Analogy:</strong> Social groups at a party. Each group has a leader. When two groups decide to merge, one leader becomes the new leader. To check if two people are in the same group, check if they have the same leader.</p>
<pre>Initially: Each person is their own group
  {A} {B} {C} {D} {E}

Union(A, B): A and B in same group → {A,B} {C} {D} {E}
Union(C, D): → {A,B} {C,D} {E}
Union(B, D): merge groups → {A,B,C,D} {E}
Find(A) == Find(C)? → YES, same group ✅
Find(A) == Find(E)? → NO, different groups ❌</pre>
<pre>// Java: Union-Find with path compression + union by rank
class UnionFind {
    int[] parent, rank;
    
    UnionFind(int n) {
        parent = new int[n];
        rank = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i; // each is own parent
    }
    
    int find(int x) {
        if (parent[x] != x)
            parent[x] = find(parent[x]); // path compression!
        return parent[x];
    }
    
    void union(int x, int y) {
        int px = find(x), py = find(y);
        if (px == py) return; // already same group
        if (rank[px] < rank[py]) parent[px] = py;      // union by rank
        else if (rank[px] > rank[py]) parent[py] = px;
        else { parent[py] = px; rank[px]++; }
    }
    
    boolean connected(int x, int y) {
        return find(x) == find(y);
    }
}</pre>
<p><strong>Use cases:</strong></p>
<ul>
<li>Detect cycle in undirected graph</li>
<li>Kruskal's minimum spanning tree</li>
<li>Connected components (number of islands)</li>
<li>Network connectivity</li>
</ul>
<div class="key-point">With path compression + union by rank, both Find and Union are nearly <strong>O(1)</strong> — technically O(α(n)) which is ≤ 4 for any practical input size.</div>`,
      },
      {
        q: "How do you solve the 'Two Sum' problem?",
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>Two Sum finds two numbers in an array that add up to a target. The brute-force nested loop is <code>O(n^2)</code>, but a single pass with a hash map of value to index is <code>O(n)</code> time and <code>O(n)</code> space, checking if the needed complement was already seen. If the array is sorted, two pointers moving inward use <code>O(1)</code> extra space. Common concerns are duplicates, not reusing the same element, and returning indices versus values.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Two Sum tìm hai số trong một mảng có tổng bằng target. Vòng lặp lồng brute-force là <code>O(n^2)</code>, nhưng một lần duyệt duy nhất với hash map ánh xạ giá trị tới chỉ số cho ra thời gian <code>O(n)</code> và bộ nhớ <code>O(n)</code>, kiểm tra xem phần bù cần tìm đã xuất hiện chưa. Nếu mảng đã được sắp xếp, hai con trỏ dịch vào trong dùng thêm bộ nhớ <code>O(1)</code>. Các điểm cần lưu ý thường là phần tử trùng, không tái sử dụng cùng một phần tử, và trả về chỉ số hay trả về giá trị.</p></details>
<p><strong>Problem:</strong> Given an array and a target, find two numbers that add up to the target. Return their indices.</p>
<p><strong>Analogy:</strong> You have a jar of numbered balls. You pick one ball and ask: "Is there another ball that, together, adds up to the target?" Instead of checking every pair (slow), you remember what you've already seen.</p>
<pre>Array: [2, 7, 11, 15], Target: 9

Brute Force O(n²):
  Check every pair: (2,7)=9 ✅ found!
  But slow for large arrays.

HashMap O(n):
  For each number, check if (target - number) exists in the map.
  
  num=2: need 9-2=7, map={} → not found, store {2:0}
  num=7: need 9-7=2, map={2:0} → FOUND! ✅ indices [0, 1]</pre>
<pre>// Java: Two Sum with HashMap
int[] twoSum(int[] nums, int target) {
    Map&lt;Integer, Integer&gt; map = new HashMap&lt;&gt;();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (map.containsKey(complement)) {
            return new int[]{map.get(complement), i};
        }
        map.put(nums[i], i);
    }
    return new int[]{};
}

// If array is SORTED → use Two Pointers instead:
int left = 0, right = arr.length - 1;
while (left < right) {
    int sum = arr[left] + arr[right];
    if (sum == target) return new int[]{left, right};
    else if (sum < target) left++;
    else right--;
}</pre>
<div class="key-point">"Two Sum" is the <strong>#1 most asked interview question</strong> (LeetCode #1). The HashMap approach trades space for time: O(n) time, O(n) space. It's a pattern: when you need to find a complement, use a HashMap.</div>`,
      },
      {
        q: 'What is Bit Manipulation and common bitwise tricks?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Bit manipulation works directly on the binary form of numbers and is very fast. Useful idioms include <code>x & 1</code> for odd or even, <code>x & (x-1)</code> to clear the lowest set bit, XOR to find an unpaired element since <code>a ^ a = 0</code>, and shifts to multiply or divide by powers of two. Bitmasks can store a small set inside one integer, which supports bitmask DP for subset problems. Watch out for signedness, right-shift type, and operator precedence, so use parentheses.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Bit manipulation làm việc trực tiếp trên dạng nhị phân của các số và rất nhanh. Các thủ thuật hữu ích gồm <code>x & 1</code> để kiểm tra chẵn lẻ, <code>x & (x-1)</code> để xóa bit thấp nhất đang bật, XOR để tìm phần tử lẻ đôi vì <code>a ^ a = 0</code>, và phép dịch bit để nhân hoặc chia cho lũy thừa của hai. Bitmask có thể lưu một tập nhỏ bên trong một số nguyên, hỗ trợ bitmask DP cho các bài toán tập con. Cần cẩn thận với dấu, kiểu của phép dịch phải, và độ ưu tiên toán tử, nên hãy dùng dấu ngoặc.</p></details>
<p><strong>Bit Manipulation</strong> = working directly with binary representations of numbers. Extremely fast and memory-efficient.</p>
<p><strong>Analogy:</strong> Normal math uses decimal (base 10). Computers think in binary (base 10 → base 2). Bit manipulation is "speaking the computer's native language".</p>
<pre>Basic operators:
  AND (&):  1010 & 1100 = 1000  (both bits must be 1)
  OR  (|):  1010 | 1100 = 1110  (either bit is 1)
  XOR (^):  1010 ^ 1100 = 0110  (bits are different)
  NOT (~):  ~1010 = 0101        (flip all bits)
  LEFT SHIFT (<<):  0001 << 2 = 0100  (multiply by 2^n)
  RIGHT SHIFT (>>): 1000 >> 2 = 0010  (divide by 2^n)</pre>
<p><strong>Common tricks:</strong></p>
<pre>// Check if number is even or odd:
(n & 1) == 0  →  even   (last bit is 0)
(n & 1) == 1  →  odd    (last bit is 1)

// Multiply/divide by 2:
n << 1  →  n * 2
n >> 1  →  n / 2

// Check if power of 2:
(n & (n - 1)) == 0  →  is power of 2
// 8 = 1000, 7 = 0111 → 1000 & 0111 = 0000 ✅

// Swap without temp variable:
a ^= b; b ^= a; a ^= b;

// Find the only non-duplicate in array:
// [2, 3, 2, 4, 3] → XOR all: 2^3^2^4^3 = 4
// (because x ^ x = 0, and x ^ 0 = x)</pre>
<pre>// Java: Count number of 1 bits
int hammingWeight(int n) {
    int count = 0;
    while (n != 0) {
        count += (n & 1);
        n >>>= 1;  // unsigned right shift
    }
    return count;
}</pre>
<div class="key-point">XOR is the most useful bit operator in interviews. Key properties: <code>x ^ x = 0</code>, <code>x ^ 0 = x</code>. This solves "find the single number" in O(n) time, O(1) space.</div>`,
      },
      {
        q: 'What is Memoization vs Tabulation in Dynamic Programming?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Memoization and tabulation are the two ways to implement Dynamic Programming and compute the same result. <strong>Memoization</strong> is top-down: write the natural recursion and cache results, so only reached states are computed and it is easier to write. <strong>Tabulation</strong> is bottom-up: fill a table in dependency order, which avoids recursion overhead and stack overflow and makes space saving clearer. A good approach is to prototype with memoization, then switch to tabulation for speed or deep recursion.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Memoization và tabulation là hai cách để triển khai Dynamic Programming và cùng tính ra một kết quả. <strong>Memoization</strong> là top-down: viết đệ quy tự nhiên và cache lại kết quả, nên chỉ các trạng thái được chạm tới mới được tính và nó dễ viết hơn. <strong>Tabulation</strong> là bottom-up: điền vào một bảng theo thứ tự phụ thuộc, giúp tránh chi phí đệ quy và tràn stack, đồng thời làm cho việc tiết kiệm bộ nhớ rõ ràng hơn. Một cách tiếp cận tốt là làm nháp bằng memoization, rồi chuyển sang tabulation để tăng tốc hoặc khi đệ quy sâu.</p></details>
<p>Both are strategies for DP. They store computed results to avoid redundant work.</p>
<p><strong>Memoization (Top-Down):</strong> Start from the big problem, recursively break it down, and <strong>cache</strong> results as you go.</p>
<p><strong>Tabulation (Bottom-Up):</strong> Start from the smallest sub-problems, iteratively build up to the answer using a <strong>table</strong>.</p>
<p><strong>Analogy — Building a staircase to floor 10:</strong></p>
<ul>
<li><strong>Memoization</strong>: Start at floor 10, ask "how do I get here?" → need floor 9 → need floor 8... Eventually reach floor 1 (base case). Remember each floor's answer.</li>
<li><strong>Tabulation</strong>: Start at floor 1, calculate ways to reach floor 2, then floor 3... build up to floor 10.</li>
</ul>
<pre>// Climbing Stairs: How many ways to reach step n? (1 or 2 steps at a time)

// Memoization (Top-Down):
int[] memo = new int[n + 1];
int climb(int n) {
    if (n <= 2) return n;
    if (memo[n] != 0) return memo[n];
    memo[n] = climb(n - 1) + climb(n - 2);  // recurse + cache
    return memo[n];
}

// Tabulation (Bottom-Up):
int climb(int n) {
    int[] dp = new int[n + 1];
    dp[1] = 1; dp[2] = 2;
    for (int i = 3; i <= n; i++) {
        dp[i] = dp[i-1] + dp[i-2];  // build from small to big
    }
    return dp[n];
}</pre>
<table><tr><th>Feature</th><th>Memoization</th><th>Tabulation</th></tr>
<tr><td>Direction</td><td>Top → Down</td><td>Bottom → Up</td></tr>
<tr><td>Technique</td><td>Recursion + cache</td><td>Iteration + table</td></tr>
<tr><td>Computes</td><td>Only needed subproblems</td><td>All subproblems</td></tr>
<tr><td>Stack overflow?</td><td>Possible (deep recursion)</td><td>No</td></tr></table>
<div class="key-point">Memoization is usually <strong>easier to write</strong> (just add cache to recursion). Tabulation is <strong>more efficient</strong> (no recursion overhead) and avoids stack overflow. In interviews, start with memoization, then optimize to tabulation if asked.</div>`,
      },
      {
        q: 'How does Counting Sort / Radix Sort work? When are they faster than O(n log n)?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Counting sort and radix sort are non-comparison sorts, so they can beat the <code>O(n log n)</code> comparison limit. <strong>Counting sort</strong> tallies each key and rebuilds output in <code>O(n + k)</code>, which is only fast when the value range k is small. <strong>Radix sort</strong> applies a stable counting sort digit by digit, running in <code>O(d*(n + b))</code>, good for fixed-width integers or strings. They only work on integer-like keys with a bounded range and use extra memory; counting sort's stability is what makes radix sort correct.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Counting sort và radix sort là các thuật toán sắp xếp không so sánh, nên chúng có thể vượt qua giới hạn <code>O(n log n)</code> của sắp xếp so sánh. <strong>Counting sort</strong> đếm số lần xuất hiện của mỗi khóa và dựng lại đầu ra trong <code>O(n + k)</code>, chỉ nhanh khi khoảng giá trị k nhỏ. <strong>Radix sort</strong> áp dụng counting sort ổn định theo từng chữ số, chạy trong <code>O(d*(n + b))</code>, phù hợp cho số nguyên độ rộng cố định hoặc chuỗi. Chúng chỉ hoạt động trên các khóa dạng số nguyên với khoảng giá trị bị chặn và tốn thêm bộ nhớ; chính tính ổn định của counting sort là điều làm cho radix sort đúng.</p></details>
<p><strong>Counting Sort</strong> and <strong>Radix Sort</strong> are non-comparison sorts that can beat the O(n log n) barrier by using the structure of the data itself.</p>
<p><strong>Counting Sort — O(n + k)</strong> where k is the range of values:</p>
<p><strong>Analogy:</strong> You have 100 exam scores from 0-100. Instead of comparing scores, just count how many students got each score and rebuild the sorted list.</p>
<pre>Input: [4, 2, 2, 8, 3, 3, 1]

Step 1: Count occurrences:
  index: 0  1  2  3  4  5  6  7  8
  count: 0  1  2  2  1  0  0  0  1

Step 2: Build sorted output by reading counts:
  1 appears 1 time → [1]
  2 appears 2 times → [1, 2, 2]
  3 appears 2 times → [1, 2, 2, 3, 3]
  4 appears 1 time → [1, 2, 2, 3, 3, 4]
  8 appears 1 time → [1, 2, 2, 3, 3, 4, 8] ✅</pre>
<p><strong>Radix Sort — O(d × (n + k))</strong> where d = number of digits:</p>
<pre>Sort [170, 45, 75, 90, 802, 24, 2, 66]:

Sort by 1s digit:  [170, 90, 802, 2, 24, 45, 75, 66]
Sort by 10s digit: [802, 2, 24, 45, 66, 170, 75, 90]
Sort by 100s digit:[2, 24, 45, 66, 75, 90, 170, 802] ✅</pre>
<table><tr><th>Algorithm</th><th>Time</th><th>Works when</th></tr>
<tr><td>Counting Sort</td><td>O(n + k)</td><td>Small range of integers (e.g., ages 0-150)</td></tr>
<tr><td>Radix Sort</td><td>O(d(n+k))</td><td>Fixed-length integers or strings</td></tr></table>
<div class="key-point">These sorts are <strong>faster than Quick/Merge Sort</strong> when the data range is limited. Counting Sort is used inside Radix Sort as a subroutine. Not suitable for arbitrary floating-point numbers.</div>`,
      },
      {
        q: 'What is a Monotonic Stack and when do you use it?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>A <strong>monotonic stack</strong> keeps its elements in increasing or decreasing order by popping any element that would break the order. It solves next or previous greater and smaller element problems in <code>O(n)</code> instead of <code>O(n^2)</code>, since each element is pushed and popped at most once. Common uses are daily temperatures, largest rectangle in a histogram, and stock span. It usually stores indices so distances can be computed, and the order direction must match the question.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Một <strong>monotonic stack</strong> giữ các phần tử của nó theo thứ tự tăng hoặc giảm bằng cách pop bất kỳ phần tử nào sẽ phá vỡ thứ tự đó. Nó giải các bài toán phần tử lớn/nhỏ hơn kế tiếp hoặc trước đó trong <code>O(n)</code> thay vì <code>O(n^2)</code>, vì mỗi phần tử chỉ được push và pop tối đa một lần. Các ứng dụng thường gặp là daily temperatures, hình chữ nhật lớn nhất trong histogram, và stock span. Nó thường lưu chỉ số để tính được khoảng cách, và hướng thứ tự phải khớp với yêu cầu bài toán.</p></details>
<p>A <strong>Monotonic Stack</strong> is a stack that maintains elements in a strictly increasing or decreasing order. Elements are popped when the ordering would be violated.</p>
<p><strong>Analogy:</strong> A line of people sorted by height. When a tall person arrives, everyone shorter in front of them steps out of line. The line stays in order.</p>
<p><strong>Classic problem: Next Greater Element</strong></p>
<pre>Input: [2, 1, 2, 4, 3]
Output: [4, 2, 4, -1, -1]   (next element that is GREATER)

For each number, what's the next bigger number to its right?
  2 → next greater is 4
  1 → next greater is 2
  2 → next greater is 4
  4 → nothing bigger → -1
  3 → nothing bigger → -1

Using Monotonic Stack (decreasing):
  i=0: stack=[], push 0 → stack=[0(2)]
  i=1: 1 < 2, push 1 → stack=[0(2), 1(1)]
  i=2: 2 > 1, pop 1 → answer[1]=2. 2 == 2, push 2 → stack=[0(2), 2(2)]
  i=3: 4 > 2, pop 2 → answer[2]=4. 4 > 2, pop 0 → answer[0]=4. push 3 → stack=[3(4)]
  i=4: 3 < 4, push 4 → stack=[3(4), 4(3)]
  Remaining: answer[3]=-1, answer[4]=-1</pre>
<pre>// Java: Next Greater Element
int[] nextGreater(int[] nums) {
    int[] result = new int[nums.length];
    Arrays.fill(result, -1);
    Deque&lt;Integer&gt; stack = new ArrayDeque&lt;&gt;(); // stores indices
    
    for (int i = 0; i < nums.length; i++) {
        while (!stack.isEmpty() && nums[stack.peek()] < nums[i]) {
            result[stack.pop()] = nums[i]; // found next greater!
        }
        stack.push(i);
    }
    return result;
}</pre>
<p><strong>Use cases:</strong> Next greater/smaller element, largest rectangle in histogram, stock span problem, trapping rain water.</p>
<div class="key-point">Monotonic stack solves "next greater/smaller element" problems in <strong>O(n)</strong> instead of O(n²). Each element is pushed and popped at most once.</div>`,
      },
      {
        q: 'What is Binary Search on Answer?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Binary search on answer searches over the range of possible answers instead of over an array. For each candidate value it runs a feasibility check, such as whether the task can be done with that value. It requires <strong>monotonicity</strong>: once a value works, all values above or below it also work, which lets half the range be dropped each step. It fits minimize-the-maximum or maximize-the-minimum problems, with cost <code>O(log(range) * check)</code>; the check is often a simple greedy pass.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Binary search on answer tìm kiếm trên khoảng các đáp án khả dĩ thay vì trên một mảng. Với mỗi giá trị ứng viên, nó chạy một phép kiểm tra tính khả thi, chẳng hạn liệu công việc có thể hoàn thành với giá trị đó hay không. Nó đòi hỏi <strong>tính đơn điệu</strong>: một khi một giá trị thỏa thì mọi giá trị lớn hơn hoặc nhỏ hơn nó cũng thỏa, cho phép loại bỏ một nửa khoảng ở mỗi bước. Nó phù hợp với các bài toán minimize-the-maximum hoặc maximize-the-minimum, với chi phí <code>O(log(range) * check)</code>; phép kiểm tra thường chỉ là một lượt greedy đơn giản.</p></details>
<p><strong>Binary Search on Answer</strong> = instead of searching for an element in an array, you binary search over the <strong>range of possible answers</strong> to find the optimal one.</p>
<p><strong>Analogy:</strong> "What's the minimum speed to deliver all packages within 8 hours?" Speed could be 1-1000. Instead of trying each, binary search: "Is speed 500 enough? Yes → try 250. No → try 750."</p>
<p><strong>Example: Koko Eating Bananas</strong></p>
<pre>Problem: Koko has piles of bananas [3, 6, 7, 11]. 
Guard returns in 8 hours. Find minimum eating speed.

At speed k: time = ceil(3/k) + ceil(6/k) + ceil(7/k) + ceil(11/k)

Binary search on k (answer range: 1 to max(piles) = 11):
  mid=6: time = 1+1+2+2 = 6 ≤ 8 ✅ → try smaller → right=6
  mid=3: time = 1+2+3+4 = 10 > 8 ❌ → try bigger → left=4
  mid=5: time = 1+2+2+3 = 8 ≤ 8 ✅ → try smaller → right=5
  mid=4: time = 1+2+2+3 = 8 ≤ 8 ✅ → try smaller → right=4
  left=4, right=4 → Answer: 4 🍌/hour</pre>
<pre>// Java: Binary Search on Answer
int minEatingSpeed(int[] piles, int h) {
    int left = 1, right = Arrays.stream(piles).max().getAsInt();
    while (left < right) {
        int mid = (left + right) / 2;
        if (canFinish(piles, h, mid)) right = mid;
        else left = mid + 1;
    }
    return left;
}

boolean canFinish(int[] piles, int h, int speed) {
    int hours = 0;
    for (int pile : piles) hours += (pile + speed - 1) / speed;
    return hours <= h;
}</pre>
<p><strong>Pattern recognition:</strong> If the problem asks "find minimum/maximum X such that condition Y is satisfied" and the condition is <strong>monotonic</strong> (once true, stays true), use binary search on answer.</p>
<div class="key-point">This pattern appears in: splitting array, capacity to ship packages, magnetic force between balls, minimized maximum. Always ask: "Can I binary search the answer?"</div>`,
      },
      {
        q: 'What is the difference between a Set, Map, and List?',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>A <strong>List</strong> is an ordered sequence that allows duplicates and is indexed by position. A <strong>Set</strong> holds unique elements and is optimized for membership tests. A <strong>Map</strong> stores key-value pairs with unique keys for lookup by key. The choice starts with the interface (what operations are needed), then the implementation: hash-based for <code>O(1)</code> average but no order, tree-based for <code>O(log n)</code> with sorted order, and linked variants for insertion-order iteration.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Một <strong>List</strong> là một dãy có thứ tự cho phép trùng lặp và được truy cập theo vị trí. Một <strong>Set</strong> chứa các phần tử duy nhất và được tối ưu cho việc kiểm tra thành viên. Một <strong>Map</strong> lưu các cặp key-value với các khóa duy nhất để tra cứu theo key. Việc lựa chọn bắt đầu từ interface (cần những thao tác nào), rồi tới implementation: dựa trên hash để đạt <code>O(1)</code> trung bình nhưng không có thứ tự, dựa trên cây để đạt <code>O(log n)</code> với thứ tự đã sắp, và các biến thể linked để duyệt theo thứ tự chèn.</p></details>
<p>Three fundamental collection types in programming:</p>
<p><strong>Analogy:</strong></p>
<ul>
<li><strong>List</strong> = Shopping list: ordered, can have duplicates ("buy milk, eggs, milk").</li>
<li><strong>Set</strong> = Guest list at a party: no duplicates allowed ("John" appears only once).</li>
<li><strong>Map</strong> = Phone book: each name (key) maps to a phone number (value).</li>
</ul>
<pre>List:  [1, 2, 3, 2, 1]  → ordered, duplicates OK
Set:   {1, 2, 3}         → no duplicates, no guaranteed order
Map:   {"a":1, "b":2}    → key-value pairs, keys are unique</pre>
<table><tr><th>Feature</th><th>List (ArrayList)</th><th>Set (HashSet)</th><th>Map (HashMap)</th></tr>
<tr><td>Duplicates</td><td>Yes</td><td>No</td><td>Keys: No, Values: Yes</td></tr>
<tr><td>Order</td><td>Maintained</td><td>Not guaranteed*</td><td>Not guaranteed*</td></tr>
<tr><td>Access</td><td>By index O(1)</td><td>By value O(1)</td><td>By key O(1)</td></tr>
<tr><td>Use case</td><td>Ordered collection</td><td>Unique elements</td><td>Key→Value lookup</td></tr></table>
<pre>// Java examples:
List&lt;String&gt; list = new ArrayList&lt;&gt;();
list.add("apple"); list.add("apple"); // [apple, apple] ✅

Set&lt;String&gt; set = new HashSet&lt;&gt;();
set.add("apple"); set.add("apple"); // {apple} (only one!)

Map&lt;String, Integer&gt; map = new HashMap&lt;&gt;();
map.put("apple", 5); map.get("apple"); // 5</pre>
<div class="key-point">*Use <code>LinkedHashSet</code>/<code>LinkedHashMap</code> for insertion order, <code>TreeSet</code>/<code>TreeMap</code> for sorted order. In interviews, choose the right collection: need uniqueness? Set. Need key-value? Map. Need ordering? List.</div>`,
      },
      {
        q: 'Design an LRU Cache with O(1) get and put.',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>An LRU cache removes the item that has not been used for the longest time and needs <code>O(1)</code> for both get and put. No single structure does this, so it combines a hash map for <code>O(1)</code> key lookup with a doubly-linked list that tracks recency order. On access the node moves to the front, and on eviction the tail node is dropped, all in constant time. The node must store its key so eviction can also clean the map; in real code a <code>LinkedHashMap</code> in access-order does the same.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Một LRU cache loại bỏ phần tử lâu chưa được dùng nhất và cần <code>O(1)</code> cho cả get lẫn put. Không cấu trúc đơn lẻ nào làm được điều này, nên nó kết hợp một hash map để tra cứu key <code>O(1)</code> với một doubly-linked list theo dõi thứ tự mức độ gần đây. Khi truy cập, node được chuyển lên đầu, và khi loại bỏ, node ở cuối bị bỏ đi, tất cả trong thời gian hằng số. Node phải lưu key của nó để việc loại bỏ còn dọn được map; trong code thực tế thì một <code>LinkedHashMap</code> ở chế độ access-order làm được điều tương tự.</p></details>
<p>THE classic senior coding question. An LRU (Least Recently Used) cache evicts the item that hasn't been touched for the longest time. The trick: <strong>no single structure gives O(1) for everything</strong>, so you combine two:</p>
<ul>
<li><strong>HashMap</strong>: key → node. O(1) lookup — but no notion of "order of use".</li>
<li><strong>Doubly-linked list</strong>: nodes ordered by recency (head = most recent, tail = LRU victim). O(1) move-to-front and remove — but O(n) lookup.</li>
</ul>
<p>Why <em>doubly</em> linked? To remove a node in O(1) you need its <code>prev</code> pointer. Why not an array/ArrayList for order? Moving an element to the front is O(n). Each structure covers the other's weakness.</p>
<pre>class LRUCache {
  constructor(capacity) {
    this.cap = capacity;
    this.map = new Map();           // key -> node
    this.head = {}; this.tail = {}; // sentinel nodes: no null checks
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }
  _remove(n)  { n.prev.next = n.next; n.next.prev = n.prev; }
  _addFront(n){ n.next = this.head.next; n.prev = this.head;
                this.head.next.prev = n; this.head.next = n; }

  get(key) {
    const n = this.map.get(key);
    if (!n) return -1;
    this._remove(n); this._addFront(n);  // touch = move to front
    return n.value;
  }
  put(key, value) {
    if (this.map.has(key)) this._remove(this.map.get(key));
    const n = { key, value };
    this._addFront(n); this.map.set(key, n);
    if (this.map.size > this.cap) {
      const lru = this.tail.prev;        // real LRU node
      this._remove(lru);
      this.map.delete(lru.key);          // node stores key for this!
    }
  }
}</pre>
<pre>// Walkthrough, capacity 2:
put(1,A) → [1]        put(2,B) → [2,1]
get(1)   → A, [1,2]   // 1 touched, now most recent
put(3,C) → evict tail = 2 → [3,1]
get(2)   → -1         // gone</pre>
<p><strong>Java one-liner (mention it, then still code the real thing):</strong></p>
<pre>new LinkedHashMap&lt;K,V&gt;(16, 0.75f, true) {  // true = accessOrder!
  protected boolean removeEldestEntry(Map.Entry&lt;K,V&gt; e) {
    return size() > capacity;
  }
};</pre>
<p><strong>Follow-ups to expect:</strong> classic pitfalls (forgetting to store the key in the node — you can't delete from the map on eviction without it; forgetting that <code>get</code> also reorders); thread safety (lock striping, or segment the cache like old ConcurrentHashMap); LFU as the harder sequel; TTL expiry on top.</p>
<div class="key-point">LRU = HashMap for O(1) lookup + doubly-linked list for O(1) recency updates; each structure exists to fix the other's O(n) weakness, and the node must carry its key so eviction can clean the map.</div>`,
      },
      {
        q: 'How do you find the Top-K elements from a huge stream of data?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Sorting everything to take the top K is <code>O(n log n)</code> and needs all data in memory, which fails on a stream. A <strong>min-heap of size K</strong> processes one pass and keeps only the K largest seen, using <code>O(n log K)</code> time and <code>O(K)</code> space. For top-K largest, a min-heap is used so the weakest kept item is easy to remove. For an in-memory array, <strong>Quickselect</strong> gives <code>O(n)</code> average, and at large scale it becomes a distributed partial-top-K then merge problem.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Sắp xếp toàn bộ để lấy top K là <code>O(n log n)</code> và cần toàn bộ dữ liệu nằm trong bộ nhớ, điều này thất bại với một luồng (stream). Một <strong>min-heap kích thước K</strong> xử lý trong một lượt và chỉ giữ K phần tử lớn nhất đã thấy, dùng thời gian <code>O(n log K)</code> và bộ nhớ <code>O(K)</code>. Với top-K lớn nhất, min-heap được dùng để dễ dàng loại bỏ phần tử yếu nhất đang giữ. Với một mảng trong bộ nhớ, <strong>Quickselect</strong> cho <code>O(n)</code> trung bình, và ở quy mô lớn nó trở thành bài toán top-K cục bộ phân tán rồi hợp nhất (merge).</p></details>
<p>The naive answer — sort everything, take the first K — is O(n log n) and requires holding all n items. The senior answer: keep a <strong>min-heap of size K</strong>.</p>
<pre>// Top-K largest with a MIN-heap (yes, MIN — the counterintuitive part):
// The heap root is the SMALLEST of the current top K —
// i.e. the "weakest member of the club" = the cheapest to test against.
function topK(stream, k) {
  const heap = new MinHeap();
  for (const x of stream) {
    if (heap.size() < k) heap.push(x);
    else if (x > heap.peek()) {   // beats the weakest member?
      heap.pop();                 // kick it out
      heap.push(x);               // O(log k)
    }                             // else: ignore in O(1)
  }
  return heap.toArray();          // the top K
}

// Trace: k=3, stream = 5, 1, 9, 3, 7, 6
// [5] → [1,5] → [1,5,9] → 3>1? yes → [3,5,9]
// → 7>3? yes → [5,7,9] → 6>5? yes → [6,7,9]  ✓ top 3</pre>
<table><tr><th>Approach</th><th>Time</th><th>Space</th><th>Streaming?</th></tr>
<tr><td>Full sort</td><td>O(n log n)</td><td>O(n)</td><td>No — needs all data</td></tr>
<tr><td>Min-heap of size K</td><td>O(n log k)</td><td><strong>O(k)</strong></td><td><strong>Yes</strong></td></tr>
<tr><td>Quickselect</td><td>O(n) average</td><td>O(n), in-place</td><td>No — needs random access</td></tr></table>
<p><strong>Why O(n log k) matters:</strong> for n = 1 billion and k = 100, log k ≈ 7 vs log n ≈ 30 — and O(k) memory means the billion items never need to fit in RAM. That's what makes it work on a <em>stream</em>.</p>
<p><strong>When quickselect wins:</strong> the data already sits in an in-memory array, you only need this once, and you don't need the K results sorted — quickselect partitions around the K-th element in O(n) average. Its downsides: O(n²) worst case (mitigate with random pivots), destroys input order, useless for streams.</p>
<p><strong>Follow-ups to expect:</strong> "top K <em>frequent</em> elements" (hash map of counts first, then heap over the entries); "top K across many machines" (each node computes local top K, merge the K·m candidates); "K comparable to n" (just sort).</p>
<div class="key-point">Min-heap of size K: the root is the weakest of the current winners, so each new item needs one O(1) comparison and at most an O(log k) replace — O(n log k) time, O(k) space, and it works when the data can't fit in memory.</div>`,
      },
      {
        q: 'How do you sort a 100 GB file with only 1 GB of RAM?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>A file larger than RAM is sorted with <strong>external merge sort</strong>. First, read the file in chunks that fit in memory, sort each chunk, and write it back as a sorted run on disk. Then do a k-way merge of the runs using a min-heap that holds one element per run, streaming the output to disk. The main cost is disk I/O, so the design favors large sequential reads and writes; too many runs may need a multi-pass merge.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Một file lớn hơn RAM được sắp xếp bằng <strong>external merge sort</strong>. Đầu tiên, đọc file theo từng khối (chunk) vừa với bộ nhớ, sắp xếp mỗi khối, và ghi ngược lại thành một run đã sắp trên đĩa. Sau đó thực hiện k-way merge các run bằng một min-heap giữ một phần tử cho mỗi run, ghi luồng đầu ra ra đĩa. Chi phí chính là disk I/O, nên thiết kế ưu tiên các lượt đọc/ghi tuần tự lớn; nếu có quá nhiều run thì có thể cần merge nhiều lượt (multi-pass).</p></details>
<p>The systems-flavored sorting question — it checks whether you know that sorting doesn't stop working when data exceeds RAM. The answer is <strong>external merge sort</strong>, the same algorithm inside databases (ORDER BY spills), MapReduce shuffles, and Unix <code>sort</code>.</p>
<pre>// Phase 1: CHUNK → SORT → SPILL
// Read ~1 GB at a time, sort in memory, write sorted "run" to disk.
100 GB input
  → read chunk 1 (1 GB) → quicksort in RAM → write run_001 (sorted)
  → read chunk 2 (1 GB) → sort           → write run_002
  → ... → 100 sorted run files on disk

// Phase 2: K-WAY MERGE with a min-heap of size K (= 100)
// Open all runs; heap holds ONE current element per run.
heap = MinHeap of (value, runId)
push first element of each run                  // 100 entries
while heap not empty:
    (v, run) = heap.pop()        // global minimum across all runs
    output.write(v)              // buffered writes!
    if run has next: heap.push(next element of run)

// Memory in phase 2: 100 input buffers × ~10 MB + heap of 100
// entries + output buffer — comfortably under 1 GB.</pre>
<p><strong>Why a heap for the merge?</strong> Picking the minimum of K run-heads naively is O(K) per output element; the heap makes it O(log K). Total: O(n log K) merge after O(n log(chunk)) sorting — overall the classic O(n log n), just I/O-aware.</p>
<p><strong>What actually dominates: disk I/O, not CPU.</strong> Every element is read twice and written twice (once per phase) — so the design goal is minimizing <em>passes</em>:</p>
<ul>
<li>Use large sequential, buffered reads/writes per run — random 4 KB I/O would destroy throughput, especially on HDDs.</li>
<li>If runs outnumber what you can merge at once (too many open buffers), do <strong>multi-pass</strong> merging: merge 100 runs into 1 in groups, repeat. Passes = ceil(log_K(runs)).</li>
<li>Replacement selection (heap-based run generation) produces runs ~2× RAM size on average → fewer runs → fewer merge passes.</li>
</ul>
<p><strong>Follow-ups to expect:</strong> "what if it's 100 TB?" → shard across machines, external-sort locally, then distributed merge (this is essentially the MapReduce shuffle); "what if lines are variable-length records?" → same idea, count bytes not rows; "how does your database do ORDER BY without an index?" → exactly this, look for "external sort" in the query plan.</p>
<div class="key-point">External merge sort = sort RAM-sized chunks into sorted runs, then k-way merge them with a min-heap; the real engineering is minimizing disk passes with big sequential buffered I/O, because I/O — not comparisons — is the bottleneck.</div>`,
      },
      {
        q: 'Find the missing or duplicate number in an array of 1..n — compare the three classic solutions.',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>Finding a missing or duplicate number in an array of 1..n has three classic solutions. A hash set or boolean array is <code>O(n)</code> time and <code>O(n)</code> space and works generally. The sum formula, expected minus actual sum, is <code>O(n)</code> time and <code>O(1)</code> space but can overflow for large n. The XOR method cancels matching pairs to leave the answer, is <code>O(n)</code> time and <code>O(1)</code> space, and cannot overflow, so it is the cleanest; cyclic sort or index-marking also works if the array can be changed.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Việc tìm số bị thiếu hoặc số trùng trong một mảng 1..n có ba lời giải kinh điển. Một hash set hoặc mảng boolean là <code>O(n)</code> thời gian và <code>O(n)</code> bộ nhớ và hoạt động tổng quát. Công thức tổng, tức tổng kỳ vọng trừ tổng thực tế, là <code>O(n)</code> thời gian và <code>O(1)</code> bộ nhớ nhưng có thể tràn số với n lớn. Phương pháp XOR triệt tiêu các cặp khớp nhau để còn lại đáp án, là <code>O(n)</code> thời gian và <code>O(1)</code> bộ nhớ, và không thể tràn số, nên nó gọn gàng nhất; cyclic sort hoặc đánh dấu theo chỉ số cũng dùng được nếu mảng được phép thay đổi.</p></details>
<p>Deceptively simple, but interviewers use it to see how many tools you have — and whether you know each one's failure mode. Setup: array of numbers from 1..n with one missing (or one duplicated).</p>
<pre>// Solution 1: Sum formula — O(n) time, O(1) space
// Expected sum of 1..n = n(n+1)/2
function findMissing(nums, n) {
  let expected = n * (n + 1) / 2;
  let actual = nums.reduce((a, b) => a + b, 0);
  return expected - actual;
}
// FAILURE MODE: overflow. n = 10^9 → sum ≈ 5×10^17, past 2^53
// (and past int32/int64 in other languages much sooner).
// JS numbers silently lose precision → wrong answer, no error.</pre>
<pre>// Solution 2: XOR trick — O(n) time, O(1) space, NO overflow
// x ^ x = 0,  x ^ 0 = x,  XOR is commutative.
// XOR all indices 1..n AND all values: pairs cancel,
// only the missing number survives.
function findMissing(nums, n) {
  let x = 0;
  for (let i = 1; i <= n; i++) x ^= i;
  for (const v of nums) x ^= v;
  return x;
}
// Why no overflow: XOR never carries — the result always fits
// in the same bit-width as the inputs. This is the "why XOR"
// answer interviewers fish for.</pre>
<pre>// Solution 3: Floyd's cycle detection — for the DUPLICATE variant
// (n+1 numbers in range 1..n, exactly one repeated;
//  constraint: no modifying the array, O(1) space)
// Treat value nums[i] as a pointer to index nums[i]:
// a duplicate value = two arrows into the same node = a cycle.
// The duplicate is the cycle's ENTRY point.
function findDuplicate(nums) {
  let slow = nums[0], fast = nums[0];
  do { slow = nums[slow]; fast = nums[nums[fast]]; }
  while (slow !== fast);        // phase 1: meet inside cycle
  slow = nums[0];
  while (slow !== fast) {       // phase 2: entry = duplicate
    slow = nums[slow]; fast = nums[fast];
  }
  return slow;
}
// Same algorithm as linked-list cycle detection — recognizing
// the array-as-implicit-linked-list mapping is the senior move.</pre>
<table><tr><th>Approach</th><th>Time</th><th>Space</th><th>Gotcha</th></tr>
<tr><td>Sum formula</td><td>O(n)</td><td>O(1)</td><td>Overflow on large n</td></tr>
<tr><td>XOR</td><td>O(n)</td><td>O(1)</td><td>None — carry-free</td></tr>
<tr><td>Floyd's</td><td>O(n)</td><td>O(1)</td><td>Only for duplicate; needs values as valid indices</td></tr></table>
<p><strong>Follow-ups to expect:</strong> "TWO numbers missing?" (XOR gives a^b; split all numbers into two groups by any set bit of a^b, XOR each group separately); "duplicates AND missing together?" (XOR pairs or index-marking by negation if mutation is allowed).</p>
<div class="key-point">Sum formula is the obvious answer with a silent overflow bug; XOR is carry-free so it can't overflow; and Floyd's works because an array of values-in-range IS an implicit linked list — the duplicate is the cycle entrance.</div>`,
      },
      {
        q: 'What is Reservoir Sampling? How do you pick a random item from a stream of unknown length?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>Reservoir sampling picks a uniformly random item from a stream of unknown length using <code>O(1)</code> space. For a single item, keep the current pick and replace it with the i-th item with probability <code>1/i</code>, which makes every item end with probability <code>1/n</code>. For a sample of size k, keep k items and replace with probability <code>k/i</code>. It runs in one pass without knowing n, which suits log sampling and picking a random line from a huge file; the replacement probability must be exact to avoid bias.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Reservoir sampling chọn một phần tử ngẫu nhiên đều từ một luồng có độ dài không biết trước với bộ nhớ <code>O(1)</code>. Với một phần tử duy nhất, giữ lựa chọn hiện tại và thay nó bằng phần tử thứ i với xác suất <code>1/i</code>, khiến mỗi phần tử cuối cùng đều có xác suất <code>1/n</code>. Với một mẫu kích thước k, giữ k phần tử và thay với xác suất <code>k/i</code>. Nó chạy trong một lượt mà không cần biết n, phù hợp cho việc lấy mẫu log và chọn một dòng ngẫu nhiên từ một file khổng lồ; xác suất thay thế phải chính xác để tránh sai lệch (bias).</p></details>
<p>Problem: items arrive one at a time; you don't know how many will come and can't store them all. When the stream ends, you must hold ONE item chosen <strong>uniformly at random</strong> — every item with probability exactly 1/n — using O(1) space.</p>
<pre>// Reservoir sampling (k = 1):
function sample(stream) {
  let chosen = null, i = 0;
  for (const item of stream) {
    i++;
    if (Math.floor(Math.random() * i) === 0) {  // probability 1/i
      chosen = item;    // replace with prob 1/i
    }
  }
  return chosen;
}
// item 1: kept with prob 1/1 (always, it's all we have)
// item 2: replaces with prob 1/2
// item 3: replaces with prob 1/3 ... item i: prob 1/i</pre>
<p><strong>The proof (this IS the interview):</strong> why does "replace with probability 1/i" make every item end up with probability 1/n? Item j survives if it's chosen at step j AND never replaced afterwards:</p>
<pre>P(item j survives)
  = P(chosen at step j) × P(not replaced at j+1) × ... × P(not replaced at n)
  = (1/j) × (j/(j+1)) × ((j+1)/(j+2)) × ... × ((n-1)/n)
        ↑ telescoping: every numerator cancels the previous denominator
  = 1/n            — same for EVERY j. Uniform. ∎

// Sanity check, n = 3:
// item 1: 1 × 1/2 × 2/3 = 1/3
// item 2: 1/2 × 2/3     = 1/3
// item 3: 1/3           = 1/3   ✓</pre>
<p><strong>General k (Algorithm R):</strong> keep the first k items; for item i &gt; k, pick a random index r in [0, i); if r &lt; k, evict <code>reservoir[r]</code>. Each item ends with probability k/n, in O(k) space.</p>
<pre>function reservoirK(stream, k) {
  const res = []; let i = 0;
  for (const item of stream) {
    i++;
    if (res.length < k) res.push(item);
    else {
      const r = Math.floor(Math.random() * i);   // 0..i-1
      if (r < k) res[r] = item;                  // prob k/i
    }
  }
  return res;
}</pre>
<p><strong>Where it shows up in real systems:</strong> log/trace sampling ("keep 1000 random requests from today"), online ML training-set selection, picking a random row from a huge table scan — anywhere n is unknown or too big to hold.</p>
<p><strong>Follow-ups to expect:</strong> weighted reservoir sampling (Efraimidis–Spirakis: keep the k items with largest random^(1/weight) keys); distributed streams (sample per shard, then merge with counts); and the classic "prove it" — practice writing the telescoping product on a whiteboard.</p>
<div class="key-point">Replace the held item with probability 1/i and the survival probabilities telescope to exactly 1/n for every item — uniform sampling from an unknown-length stream in O(1) space; be ready to write that two-line proof.</div>`,
      },
    ],
  },
];
