// Interview data: GIT (source control)
import type { PvTopic } from '../types';

export const topics: PvTopic[] = [
  {
    id: 'git',
    name: 'Git',
    icon: '🌿',
    questions: [
      {
        q: 'How does Git store data? Explain commits, trees, blobs and refs.',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Git is a content-addressable object store, not a list of diffs. Every piece of content is hashed and saved as an object: a <strong>blob</strong> is file content, a <strong>tree</strong> is a directory listing pointing at blobs and other trees, and a <strong>commit</strong> points at one tree plus its parent commit(s) with author and message. Because each commit's hash includes its parent's hash, history is an immutable chain — which is why rewriting one commit changes every hash after it. A <strong>branch</strong> is nothing more than a movable file containing a commit id, and <code>HEAD</code> is a pointer to the current branch. Understanding this makes the rest of Git obvious: commands mostly move refs or build new objects, and almost nothing is ever destroyed immediately.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Git là một kho lưu object được đánh địa chỉ theo nội dung, chứ không phải một danh sách các bản diff. Mọi nội dung đều được băm rồi lưu thành object: <strong>blob</strong> là nội dung file, <strong>tree</strong> là danh sách thư mục trỏ tới các blob và các tree khác, còn <strong>commit</strong> trỏ tới một tree cộng với commit cha, kèm tác giả và message. Vì hash của mỗi commit có bao gồm hash của commit cha, nên lịch sử là một chuỗi không thể sửa — và đó chính là lý do sửa một commit thì mọi hash phía sau đều đổi theo. Một <strong>branch</strong> thật ra chỉ là một file nhỏ chứa id của một commit, còn <code>HEAD</code> là con trỏ tới branch hiện tại. Hiểu được điều này thì phần còn lại của Git trở nên hiển nhiên: các lệnh phần lớn chỉ dịch chuyển ref hoặc tạo object mới, và gần như không có gì bị xoá ngay lập tức.</p></details>
<pre>commit a1b2c3   ← "add checkout button"
 ├─ tree 9f8e7d              (the whole project snapshot)
 │   ├─ blob  "README.md"
 │   └─ tree  "src/"
 │        └─ blob "Button.tsx"
 └─ parent 4d5e6f            ← previous commit

.git/refs/heads/main   → a1b2c3        # a branch IS this file
.git/HEAD              → ref: refs/heads/main
# Snapshots, not diffs: unchanged files reuse the SAME blob object, so
# storage stays small (and identical content anywhere = one object).

git cat-file -p HEAD         # inspect the commit object
git cat-file -p HEAD^{tree}  # inspect its tree
git rev-parse HEAD           # the current commit hash</pre>
<pre># The three areas — every Git command moves data between them
working tree  →  index (staging)  →  repository (commits)
   git add ──────────┘                    │
   git commit ────────────────────────────┘
git status              # what is where
git diff                # working tree vs index (unstaged changes)
git diff --staged       # index vs HEAD (what will be committed)
git add -p              # stage selected hunks → small, reviewable commits

# HEAD navigation (asked constantly)
HEAD~1   = first parent, one back        HEAD~3 = three back
HEAD^1   = first parent                  HEAD^2 = SECOND parent (merges only)
# ~ walks back along first parents, ^ chooses WHICH parent.</pre>
<div class="key-point">Git stores immutable, content-addressed snapshots: blobs (content) → trees (structure) → commits (snapshot + parent). Branches and HEAD are just pointers, so "changing history" always means creating new objects and moving refs — the old ones survive until garbage collection.</div>`,
      },
      {
        q: 'Merge vs rebase — what is the difference and when do you use each?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p><strong>Merge</strong> creates a new commit with two parents, preserving exactly what happened including the branch shape. <strong>Rebase</strong> replays your commits on top of the target branch, producing new commits with new hashes and a linear history that reads as if you had started from the latest main. I use rebase for <em>my own unpushed work</em> — to update a feature branch and to clean up commits before review — and merge for integrating a reviewed branch into a shared branch. The rule that matters is: never rebase commits other people have already pulled, because you are rewriting history they are building on. Many teams settle on "rebase locally, merge (or squash) into main", which gives readable history without rewriting anything shared.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><strong>Merge</strong> tạo ra một commit mới có hai cha, giữ lại đúng những gì đã diễn ra kể cả hình dạng nhánh. <strong>Rebase</strong> phát lại các commit của bạn lên trên nhánh đích, sinh ra các commit mới với hash mới và một lịch sử thẳng, đọc như thể bạn vừa bắt đầu từ main mới nhất. Tôi dùng rebase cho <em>phần việc của mình chưa push</em> — để cập nhật nhánh feature và để dọn commit trước khi review — còn dùng merge để đưa một nhánh đã review vào nhánh chung. Quy tắc quan trọng nhất: đừng bao giờ rebase những commit mà người khác đã pull về, vì như vậy là bạn viết lại lịch sử mà họ đang dựa lên. Nhiều team chốt phương án "rebase ở local, merge (hoặc squash) vào main" — vừa có lịch sử dễ đọc, vừa không viết lại thứ gì đã chia sẻ.</p></details>
<pre># Merge — preserves the true shape, adds a merge commit
main    A---B---C-------M
                 \\     /
feature           D---E
git switch main && git merge feature
# ✅ non-destructive, safe on shared branches, keeps context of the branch
# ❌ "Merge branch 'main' into feature" commits everywhere = noisy history

# Rebase — replays D,E as NEW commits D',E' on top of C
main    A---B---C---D'---E'
git switch feature && git rebase main
# ✅ linear, bisect-friendly, clean PR diff
# ❌ rewrites hashes → force-push needed; conflicts may repeat per commit
#    (use git rerere, or --interactive to squash first)

# Fast-forward: no divergence, so the branch pointer just moves
main A---B---C---D---E      (git merge --ff-only)</pre>
<pre># Practical workflow
git switch feature
git fetch origin
git rebase origin/main            # keep my branch on top of latest main
# resolve conflicts per replayed commit:
git add &lt;files&gt; && git rebase --continue    # or --skip / --abort
git push --force-with-lease       # ← never plain --force

# Merge strategy on the platform (pick ONE per repo and document it)
merge commit : full history, main is a graph            (traceable, noisy)
squash merge : one commit per PR on main                (clean, most common)
rebase merge : PR commits replayed onto main, no merge  (linear, needs
                                                         disciplined commits)
# Configure the default for pulls so you stop creating accidental merges:
git config --global pull.rebase true      # or pull.ff only</pre>
<p><strong>The one hard rule:</strong> rebase (and amend, and squash) rewrite history, so restrict them to commits that exist only in your local branch or in a branch nobody else works on. If you must rewrite a shared branch, announce it and have everyone <code>git fetch && git reset --hard origin/branch</code> — the alternative is a colleague merging the old history back in and duplicating every commit.</p>
<div class="key-point">Merge preserves history and is safe for shared branches; rebase rewrites it for a linear, reviewable story. Rebase your own unpushed work, merge or squash into shared branches, always push rewrites with <code>--force-with-lease</code>, and never rewrite commits others have pulled.</div>`,
      },
      {
        q: 'What is the difference between git reset, revert, restore and checkout?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>They act on different things, which is why mixing them up is dangerous. <strong>reset</strong> moves the branch pointer: <code>--soft</code> keeps your changes staged, <code>--mixed</code> (default) unstages them but keeps the files, <code>--hard</code> throws away working-tree changes — the only genuinely destructive variant. <strong>revert</strong> does not rewrite anything: it creates a <em>new</em> commit that undoes an old one, which is the correct way to undo something already pushed. <strong>restore</strong> (and the old <code>checkout -- file</code>) replaces file contents from the index or a commit. <strong>switch</strong> (the old <code>checkout branch</code>) changes which branch you are on. Modern Git split <code>checkout</code> into <code>switch</code> and <code>restore</code> precisely because one command doing both was the classic footgun.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Bốn lệnh này tác động lên những thứ khác nhau, nên nhầm lẫn giữa chúng rất nguy hiểm. <strong>reset</strong> dịch chuyển con trỏ branch: <code>--soft</code> giữ lại thay đổi ở trạng thái đã stage, <code>--mixed</code> (mặc định) bỏ stage nhưng vẫn giữ file, còn <code>--hard</code> thì xoá luôn thay đổi trong working tree — đây là biến thể duy nhất thật sự phá hoại. <strong>revert</strong> không viết lại gì cả: nó tạo <em>một commit mới</em> để hoàn tác commit cũ, và đây mới là cách đúng để hoàn tác thứ đã push. <strong>restore</strong> (và cách cũ là <code>checkout -- file</code>) thay nội dung file từ index hoặc từ một commit. <strong>switch</strong> (cách cũ là <code>checkout branch</code>) đổi branch đang làm việc. Git hiện đại tách <code>checkout</code> thành <code>switch</code> và <code>restore</code> chính vì việc một lệnh làm cả hai việc là cái bẫy kinh điển.</p></details>
<pre># reset — moves the branch ref (rewrites local history)
git reset --soft  HEAD~1   # undo the commit, changes stay STAGED
                           # → the "oops, wrong message / forgot a file" fix
git reset --mixed HEAD~1   # undo the commit, changes UNSTAGED (default)
git reset --hard  HEAD~1   # undo the commit AND discard the changes ⚠
git reset --hard origin/main   # make my branch identical to the remote ⚠

# revert — safe undo for PUBLISHED commits (adds a new commit)
git revert a1b2c3          # inverse patch as a new commit
git revert -m 1 &lt;merge&gt;    # revert a merge, keeping mainline parent 1
# ✅ history stays intact, nobody has to reset their clone

# restore / switch — the modern, unambiguous pair
git restore file.ts                 # discard unstaged changes to a file ⚠
git restore --staged file.ts        # unstage, keep the edit
git restore --source=HEAD~2 file.ts # take that file from an older commit
git switch main                     # change branch
git switch -c feature/new           # create + switch</pre>
<pre># Choosing, by situation
"committed to the wrong branch"      → git reset --soft HEAD~1, switch, commit
"bad commit already pushed to main"  → git revert (NEVER reset+force on main)
"messed up a file, not committed"    → git restore file
"staged something by mistake"        → git restore --staged file
"want main's version of one file"    → git restore --source=main file
"local branch is a mess, start over" → git reset --hard origin/branch ⚠
"deleted a commit and panicked"      → git reflog, then reset --hard &lt;sha&gt;

# The safety net: almost nothing is really gone
git reflog                  # every position HEAD has held (~90 days)
git reset --hard HEAD@{2}   # go back to where you were two moves ago
git fsck --lost-found       # orphaned commits/blobs after a bad rewrite
# BUT: git reset --hard and git restore discard UNCOMMITTED work, and that
# is unrecoverable — commit or \`git stash\` first. Reflog only saves commits.</pre>
<div class="key-point">reset moves the branch (soft/mixed keep your work, hard destroys it), revert adds an inverse commit and is the only safe undo for pushed history, restore changes file contents, switch changes branches. Uncommitted work is the only thing Git cannot recover — the reflog covers everything else.</div>`,
      },
      {
        q: 'How do you clean up a messy branch with interactive rebase?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p><code>git rebase -i</code> lets you rewrite your own unpushed commits into a story a reviewer can follow: <strong>reword</strong> a message, <strong>squash</strong>/<strong>fixup</strong> the six "wip" and "fix typo" commits into the one they belong to, <strong>edit</strong> a commit to split or amend it, <strong>drop</strong> a mistake, and reorder so that refactoring comes before the behaviour change. The professional shortcut is to make the fixups self-describing while you work: commit with <code>--fixup=&lt;sha&gt;</code> and then run <code>git rebase -i --autosquash</code>, which arranges everything for you. The goal is not cosmetic — each commit should build and pass tests on its own, because that is what makes <code>git bisect</code>, <code>git revert</code>, and code review actually work.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><code>git rebase -i</code> cho phép bạn viết lại các commit chưa push của chính mình thành một mạch logic rõ ràng cho người review: <strong>reword</strong> để sửa message, <strong>squash</strong>/<strong>fixup</strong> để gộp sáu commit "wip" và "fix typo" vào đúng commit của nó, <strong>edit</strong> để tách hoặc sửa một commit, <strong>drop</strong> để bỏ một commit sai, và sắp lại thứ tự sao cho phần refactor đứng trước phần đổi hành vi. Mẹo làm việc chuyên nghiệp là tạo sẵn các commit fixup nhắm đúng commit đích ngay trong lúc làm: commit với <code>--fixup=&lt;sha&gt;</code> rồi chạy <code>git rebase -i --autosquash</code>, Git sẽ tự xếp đúng chỗ. Mục đích không phải để cho đẹp: mỗi commit nên build được và pass test một cách độc lập, vì đó mới là điều làm cho <code>git bisect</code>, <code>git revert</code> và việc review code thật sự hoạt động.</p></details>
<pre>git rebase -i origin/main       # edit every commit not yet on main

pick   a1b2c3 feat: add coupon field to checkout form
fixup  d4e5f6 fix typo                     ← folds into a1b2c3 silently
squash 7g8h9i validate coupon length       ← folds in AND merges messages
reword j1k2l3 wip                          ← stop to rewrite the message
edit   m4n5o6 refactor pricing service     ← stop so I can split it
drop   p7q8r9 debug console.log            ← remove entirely
# Reordering the lines reorders the commits. Save and Git replays them.

# The efficient workflow while developing
git commit --fixup=a1b2c3            # "this belongs to that commit"
git commit --squash=a1b2c3 -m "..."  # same, but contribute to the message
git rebase -i --autosquash origin/main   # auto-arranged, just save
git config --global rebase.autosquash true

# Splitting one commit into two
git rebase -i ...        → mark it "edit"
git reset HEAD~          # unstage its changes
git add -p               # stage the first logical part
git commit -m "refactor: extract PriceCalculator"
git commit -am "feat: apply coupon discount"
git rebase --continue</pre>
<pre># Guardrails
- only rewrite commits that are NOT yet pulled by others (your feature
  branch is fine; main never is)
- push with git push --force-with-lease → refuses if someone else pushed
- conflicts during rebase are per replayed commit; enable rerere so Git
  remembers your resolution:  git config --global rerere.enabled true
- lost in the middle? git rebase --abort restores the starting state
- ORIG_HEAD and the reflog point at where you were before the rebase

# Commit message conventions that make history searchable
feat(checkout): apply coupon discount at order creation

Coupons were validated client-side only, so a crafted request could
apply an expired code. Validation now happens in OrderService.

Closes #482
# Conventional Commits (feat/fix/chore/refactor/docs/test) also drive
# automated changelogs and semantic-version bumps (semantic-release,
# changesets) — enforce with commitlint in a commit-msg hook.</pre>
<div class="key-point">Interactive rebase turns working commits into reviewable ones: squash/fixup noise, reword messages, split or reorder so each commit builds and passes tests on its own. Use <code>--fixup</code> + <code>--autosquash</code> while developing, enable rerere, and only ever rewrite branches nobody else has pulled.</div>`,
      },
      {
        q: 'How do you resolve merge conflicts effectively?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>A conflict means both sides changed the same region since their common ancestor, so Git refuses to guess. The workflow is: run <code>git status</code> to see the conflicted paths, open each one and resolve by <em>intent</em> rather than by picking a side blindly, then <code>git add</code> the file and continue the merge or rebase. Two settings make this much easier — <code>merge.conflictStyle=zdiff3</code> shows the original ancestor version alongside both changes, which usually makes the correct resolution obvious, and <code>rerere.enabled</code> records your resolutions so a repeated conflict during a long rebase resolves itself. The real fix, though, is prevention: small short-lived branches, frequent rebases onto main, and formatting handled by a tool so nobody generates whitespace conflicts.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Conflict nghĩa là hai phía cùng sửa một vùng code kể từ commit tổ tiên chung, nên Git không dám đoán. Quy trình xử lý: chạy <code>git status</code> để xem những file đang conflict, mở từng file rồi giải quyết theo <em>ý định của code</em> chứ không phải nhắm mắt chọn một bên, sau đó <code>git add</code> file và tiếp tục merge hoặc rebase. Có hai thiết lập giúp việc này dễ hơn rất nhiều — <code>merge.conflictStyle=zdiff3</code> hiển thị thêm bản gốc của tổ tiên chung bên cạnh hai thay đổi, nhờ đó thường thấy ngay cách giải quyết đúng; và <code>rerere.enabled</code> ghi nhớ cách bạn đã giải quyết để lần conflict lặp lại trong một rebase dài sẽ tự xử lý. Nhưng cách chữa thật sự là phòng ngừa: nhánh nhỏ và sống ngắn, thường xuyên rebase lên main, và để công cụ lo việc format để không ai tạo ra conflict chỉ vì khoảng trắng.</p></details>
<pre># Set this once — it changes conflict resolution from guesswork to reading
git config --global merge.conflictStyle zdiff3
git config --global rerere.enabled true

&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD                    (what is on my branch)
const total = subtotal + tax + shippingFee;
||||||| parent of abc123           (the COMMON ANCESTOR — zdiff3 shows this)
const total = subtotal + tax;
=======
const total = applyCoupon(subtotal) + tax;      (the incoming change)
&gt;&gt;&gt;&gt;&gt;&gt;&gt; feature/coupons
# Ancestor tells you WHAT each side changed → the answer is usually to keep
# BOTH intents: applyCoupon(subtotal) + tax + shippingFee</pre>
<pre># Working through it
git status                       # "both modified" list
git diff                         # only the conflicted hunks
git mergetool                    # or resolve in VS Code / IntelliJ 3-way view
git checkout --ours  path        # take my side wholesale (rare, be careful:
git checkout --theirs path       #  during a REBASE ours/theirs are swapped!)
git add path && git merge --continue        # or git rebase --continue
git merge --abort / git rebase --abort      # start over, no harm done

# Useful context while resolving
git log --merge -p path          # the commits from both sides touching it
git diff HEAD...MERGE_HEAD -- path
git checkout -m path             # regenerate the conflict markers

# Strategy options for the rare mechanical cases
git merge -X ours feature        # prefer my side ONLY for conflicting hunks
git merge -X theirs feature      # (not the same as -s ours, which drops all
                                 #  of the other side's changes)
# Lockfiles/generated files: do not hand-merge — take one side and
# regenerate (npm install, mvn, prisma generate) then commit.</pre>
<p><strong>Prevention beats resolution:</strong> merge or rebase onto main daily so conflicts stay small; keep PRs focused so two people rarely rewrite the same file; put formatting in a pre-commit hook (Prettier/Spotless) so style never conflicts; use <code>.gitattributes</code> to mark generated files as binary or with a union merge driver; and after resolving anything non-trivial, <strong>run the tests</strong> — a conflict resolution that compiles is not necessarily correct.</p>
<div class="key-point">Enable <code>zdiff3</code> and <code>rerere</code>, then resolve by combining intents rather than choosing a side — the ancestor block tells you what each side actually changed. Prevent most conflicts with short-lived branches, frequent rebases, and automated formatting, and always run the tests after resolving.</div>`,
      },
      {
        q: 'A commit broke production and you do not know which one — how do you find it?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p><code>git bisect</code> finds it in logarithmic time: you mark a known-good commit and a known-bad one, Git checks out the midpoint, you test and say <code>good</code> or <code>bad</code>, and it converges — 1000 commits become about 10 tests. If the check can be scripted, <code>git bisect run ./check.sh</code> automates the whole search. When bisect is not appropriate — you already suspect a specific change — the targeted tools are the <strong>pickaxe</strong> (<code>git log -S "functionName"</code>) to find the commit that introduced or removed a string, <code>git log -L</code> to follow the history of specific lines, and <code>git blame</code> with <code>-w -C</code> to ignore whitespace and follow moved code. The prerequisite for all of this is small, atomic commits that each build — squashing a week of work into one commit destroys the ability to bisect.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><code>git bisect</code> tìm ra nó với số bước theo hàm logarit: bạn đánh dấu một commit chắc chắn tốt và một commit chắc chắn lỗi, Git checkout commit ở giữa, bạn test rồi trả lời <code>good</code> hay <code>bad</code>, và nó thu hẹp dần — 1000 commit chỉ cần khoảng 10 lần test. Nếu phép kiểm tra viết được thành script thì <code>git bisect run ./check.sh</code> sẽ tự chạy toàn bộ quá trình. Khi bisect không phù hợp — chẳng hạn bạn đã nghi một thay đổi cụ thể — thì dùng các công cụ nhắm đích: <strong>pickaxe</strong> (<code>git log -S "tênHàm"</code>) để tìm commit đã thêm hoặc xoá một đoạn chuỗi, <code>git log -L</code> để lần theo lịch sử của một vài dòng cụ thể, và <code>git blame</code> kèm <code>-w -C</code> để bỏ qua khoảng trắng và lần theo code bị di chuyển. Điều kiện tiên quyết cho tất cả những cái đó là commit phải nhỏ, nguyên vẹn và build được — nếu squash cả tuần làm việc thành một commit thì bạn tự tay xoá luôn khả năng bisect.</p></details>
<pre># Manual bisect
git bisect start
git bisect bad                 # current HEAD is broken
git bisect good v1.4.0         # this release was fine
#   → Git checks out the midpoint: "Bisecting: 312 revisions left, ~9 steps"
#   test it, then:
git bisect good | git bisect bad | git bisect skip   # skip = won't build
#   → "abc1234 is the first bad commit"
git bisect reset               # back to where you started

# Automated bisect — the real power move
cat > check.sh &lt;&lt;'SH'
#!/usr/bin/env bash
npm ci --silent || exit 125       # 125 = "cannot test this commit" → skip
npx jest tests/checkout.test.ts   # exit 0 = good, non-zero = bad
SH
chmod +x check.sh
git bisect start HEAD v1.4.0
git bisect run ./check.sh         # walks away and finds it
# Works for anything scriptable: a failing test, a curl against a local
# server, a benchmark threshold ("performance regressed after which commit?").</pre>
<pre># Targeted archaeology
git log -S "calculateTax" --oneline        # pickaxe: commits ADD/REMOVE that string
git log -G "regex" -p                      # commits whose diff matches a regex
git log -L 40,60:src/pricing.ts            # evolution of those lines
git log --follow -p -- src/Button.tsx       # keep history across renames
git blame -w -C -L 40,60 src/pricing.ts     # ignore whitespace, detect moves
git blame --ignore-rev &lt;format-commit&gt;      # skip a mass-reformat commit
    (git config blame.ignoreRevsFile .git-blame-ignore-revs)
git log --first-parent main                 # main's story without branch noise
git log origin/main..HEAD --oneline         # what my branch adds
git show &lt;sha&gt; --stat                       # what a commit touched
git tag --contains &lt;sha&gt;                    # which releases include the bug
git branch -a --contains &lt;sha&gt;              # where it has spread</pre>
<p><strong>What makes this work in practice:</strong> commits that are individually buildable and tested (so bisect answers are meaningful), squash-merge or rebase-merge so main has one clean commit per change, tags on every release so you always have a known-good starting point, and a <code>.git-blame-ignore-revs</code> file listing formatting-only commits so blame stays useful. And when you find the culprit: <code>git revert</code> it on main first, then fix forward — restore service before you debug.</p>
<div class="key-point"><code>git bisect run</code> with a script turns "somewhere in 300 commits" into a 10-step automated search; pickaxe (<code>-S</code>), <code>log -L</code>, and <code>blame -w -C</code> handle targeted questions. All of it depends on small buildable commits and tagged releases — and the first response to a bad commit on main is revert, not investigate.</div>`,
      },
      {
        q: 'What does git stash do, and when is it the wrong tool?',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p><code>git stash</code> saves your uncommitted work (tracked modifications by default) onto a stack and gives you a clean working tree, so you can switch branches for a quick fix and come back. <code>git stash pop</code> reapplies and removes the entry, <code>apply</code> reapplies and keeps it, and <code>-u</code> includes untracked files — which people forget, then wonder why their new file disappeared from the stash. It is genuinely useful for a two-minute interruption, but it is the wrong tool for anything longer: stashes have no message context, no branch, are easy to forget, and are invisible to your colleagues. For real work-in-progress, make a WIP commit on a branch (you can <code>reset --soft</code> or amend it later) — that is safer, reviewable, and pushable as a backup.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><code>git stash</code> lưu phần việc chưa commit của bạn (mặc định là các file đã theo dõi và bị sửa) vào một stack, trả lại working tree sạch — nhờ đó bạn nhảy sang nhánh khác sửa gấp một thứ rồi quay lại. <code>git stash pop</code> áp lại rồi xoá entry đó, <code>apply</code> thì áp lại nhưng vẫn giữ, còn <code>-u</code> thì gồm cả file chưa được track — chỗ này người ta hay quên, rồi thắc mắc sao file mới của mình biến mất khỏi stash. Nó thật sự tiện cho một lần bị ngắt quãng hai phút, nhưng lại là lựa chọn sai cho bất cứ việc gì dài hơn: stash không có ngữ cảnh, không thuộc nhánh nào, rất dễ bị quên, và đồng nghiệp không thấy được. Với công việc đang làm dở thật sự, hãy tạo một commit WIP trên nhánh (sau này <code>reset --soft</code> hoặc amend lại là được) — vừa an toàn hơn, vừa review được, và push lên làm bản backup được.</p></details>
<pre>git stash push -m "half-done coupon validation"   # name it, always
git stash push -u                  # ⚠ include UNTRACKED files (new files!)
git stash list                     # stash@{0}: On feature: half-done...
git stash show -p stash@{1}        # inspect before applying
git stash pop                      # apply newest + drop it
git stash apply stash@{2}          # apply a specific one, keep it
git stash branch fix/coupon        # create a branch FROM a stash (nice)
git stash drop / git stash clear   # ⚠ clear deletes them all

# Partial and targeted stashing
git stash push -p                  # choose hunks interactively
git stash push -- src/pricing.ts   # only this path
git stash --staged                 # only what is staged (Git 2.35+)</pre>
<pre># When stash is the WRONG tool
❌ parking work for days           → git commit on a branch, push it
❌ moving work between machines    → commit + push (a stash is local only)
❌ "I'll come back to this later"  → a WIP commit says WHAT it was
❌ before a risky operation        → commit; stashes can conflict on pop too

# The WIP-commit alternative (safer and shareable)
git switch -c feature/coupons
git commit -am "wip: coupon validation (do not review)"
git push -u origin feature/coupons     # now it survives a laptop failure
# later: git reset --soft HEAD~1  → restage everything and commit properly
#    or: git commit --amend        → fold new work into the WIP commit
#    or: git rebase -i --autosquash to clean the series before the PR

# Recovering a lost stash (it is a commit object, so it is findable)
git fsck --unreachable | grep commit | cut -d' ' -f3 | xargs git log --merges --no-walk
# or: git stash apply $(git fsck --unreachable | awk '/commit/{print $3}' | head)</pre>
<div class="key-point">Stash is a short-term shelf for a quick context switch: name your stashes, remember <code>-u</code> for untracked files, and inspect with <code>show -p</code> before popping. Anything you might still care about tomorrow belongs in a WIP commit on a pushed branch, not on a local stack nobody can see.</div>`,
      },
      {
        q: 'How do you recover from a Git disaster — deleted branch, bad rebase, wrong force-push?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Almost nothing is really lost, because Git only removes objects during garbage collection (unreachable objects survive around 30–90 days by default). The first tool is always <strong><code>git reflog</code></strong>: it records every position <code>HEAD</code> has held, so a botched rebase, a hard reset, or a deleted branch is one <code>git reset --hard HEAD@{5}</code> or <code>git branch recovered &lt;sha&gt;</code> away. Per-branch history lives in <code>git reflog show &lt;branch&gt;</code>, and truly orphaned commits can be found with <code>git fsck --lost-found</code>. A wrong force-push is recoverable the same way as long as someone still has the old commit locally or in the remote's reflog. The single exception is uncommitted work destroyed by <code>reset --hard</code> or <code>restore</code> — that never existed as an object, so it is gone.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Gần như không có gì mất thật, vì Git chỉ thực sự xoá object khi chạy garbage collection (mặc định các object không còn được tham chiếu vẫn sống khoảng 30–90 ngày). Công cụ đầu tiên luôn là <strong><code>git reflog</code></strong>: nó ghi lại mọi vị trí mà <code>HEAD</code> từng ở, nên một lần rebase hỏng, một lần hard reset, hay một nhánh bị xoá chỉ cách bạn một câu <code>git reset --hard HEAD@{5}</code> hoặc <code>git branch recovered &lt;sha&gt;</code>. Lịch sử riêng của từng nhánh nằm trong <code>git reflog show &lt;branch&gt;</code>, còn những commit đã mồ côi hẳn thì tìm bằng <code>git fsck --lost-found</code>. Một lần force-push sai cũng cứu được y như vậy, miễn là còn ai đó giữ commit cũ ở máy hoặc còn trong reflog của remote. Ngoại lệ duy nhất là phần code chưa commit bị <code>reset --hard</code> hoặc <code>restore</code> xoá đi — nó chưa từng tồn tại dưới dạng object, nên mất là mất.</p></details>
<pre># 1) The reflog — your undo history for refs
git reflog
  a1b2c3 HEAD@{0}: rebase (finish): returning to refs/heads/feature
  9f8e7d HEAD@{1}: rebase (pick): apply coupon
  4d5e6f HEAD@{2}: reset: moving to HEAD~3        ← the mistake
  7a8b9c HEAD@{3}: commit: add coupon validation  ← what I want back
git reset --hard HEAD@{3}          # back to that exact state
git branch rescue 7a8b9c           # or just park it on a new branch

# 2) Deleted a branch?
git reflog show feature/coupons    # per-branch reflog (if it still exists)
git fsck --lost-found              # dangling commits → .git/lost-found
git log --graph --oneline &lt;dangling-sha&gt;    # confirm it is the right one
git branch feature/coupons &lt;dangling-sha&gt;

# 3) Bad rebase / bad merge
git reset --hard ORIG_HEAD         # Git saves the pre-operation position
git rebase --abort                 # if still mid-rebase
git merge --abort</pre>
<pre># 4) Someone force-pushed over main (the scary one)
# Find the old tip: another clone, CI logs, the platform's activity feed,
# or the SERVER reflog if you host Git yourself:
git reflog show origin/main        # your own remote-tracking reflog!
git fetch origin
git branch recovered a1b2c3        # from any clone that still has it
git push --force-with-lease origin recovered:main    # restore, carefully
# Prevention: protected branches (no force-push, no deletion) on
# main/release, require PRs, and always use --force-with-lease so YOUR
# push fails instead of overwriting a colleague's work.

# 5) Committed a secret
git revert  # ← NOT enough: the blob is still in history and on the remote
# Rotate the credential FIRST (assume it is compromised), then rewrite:
git filter-repo --invert-paths --path config/secrets.yml    # or BFG
# then force-push all branches/tags and have everyone re-clone.
# Add gitleaks as a pre-commit hook so it does not happen again.

# 6) Big deletion or "the repo is corrupt"
git fsck --full                    # report broken objects
git gc --prune=now                 # ⚠ this is what ACTUALLY deletes things —
                                   #   never run it while trying to recover</pre>
<div class="key-point">Reach for <code>git reflog</code> (and <code>ORIG_HEAD</code>) first, <code>git fsck --lost-found</code> second — commits survive well beyond their refs, so almost any rewrite is reversible. Only uncommitted work is truly unrecoverable, secrets need rotation plus a history rewrite, and protected branches with <code>--force-with-lease</code> prevent the worst cases.</div>`,
      },
      {
        q: 'What is the difference between fetch, pull and push? How do tracking branches work?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p><code>git fetch</code> downloads new objects and updates your <em>remote-tracking</em> branches (<code>origin/main</code>) without touching your working tree — it is always safe. <code>git pull</code> is <code>fetch</code> plus an integration step, which by default is a <em>merge</em> and is where accidental "Merge branch 'main' of…" commits come from; configuring <code>pull.rebase=true</code> or <code>pull.ff=only</code> makes it predictable. <code>git push</code> uploads your commits and asks the remote to move its branch, which it refuses if that would not be a fast-forward. The mental model to hold is that <code>origin/main</code> is a local cache of what the remote looked like at your last fetch — so "my branch is 3 behind" is information from that snapshot, not live truth.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><code>git fetch</code> tải các object mới về và cập nhật các nhánh <em>remote-tracking</em> (<code>origin/main</code>) mà không chạm vào working tree — lệnh này luôn an toàn. <code>git pull</code> là <code>fetch</code> cộng thêm một bước tích hợp, mà mặc định bước đó là <em>merge</em> — đây chính là nguồn gốc của những commit "Merge branch 'main' of…" ngoài ý muốn; đặt <code>pull.rebase=true</code> hoặc <code>pull.ff=only</code> sẽ khiến nó dễ đoán hơn. <code>git push</code> đẩy commit của bạn lên và yêu cầu remote dời nhánh tương ứng của nó, và remote sẽ từ chối nếu việc đó không phải fast-forward. Mô hình cần nhớ: <code>origin/main</code> chỉ là bản cache ở máy bạn, ghi lại remote trông như thế nào tại lần fetch gần nhất — nên câu "nhánh của bạn đang chậm 3 commit" là thông tin từ ảnh chụp đó, không phải sự thật tức thời.</p></details>
<pre># fetch: safe, informational
git fetch origin                 # updates origin/*, changes nothing local
git fetch --prune                # delete origin/* refs for branches deleted
                                 # on the server (do this; stale refs mislead)
git log --oneline HEAD..origin/main     # what I am missing
git log --oneline origin/main..HEAD     # what I have that is not pushed
git diff origin/main             # compare against the fetched snapshot

# pull = fetch + integrate (choose the integration explicitly)
git config --global pull.rebase true    # rebase my commits on top → linear
git config --global pull.ff only        # or: refuse unless fast-forward
git pull --rebase --autostash           # rebase, temporarily stashing WIP
# Default (merge) creates a merge commit whenever both sides moved — which
# is why shared branches end up with a braid of pointless merges.

# push
git push                                 # to the upstream of this branch
git push -u origin feature/coupons       # first push + set upstream
git push --force-with-lease              # rewrite MY branch safely
git push origin --delete feature/old     # delete a remote branch
git push --tags / git push --follow-tags # tags are NOT pushed by default</pre>
<pre># Tracking branches: local ↔ remote-tracking ↔ remote
feature/coupons  →(upstream)→  origin/feature/coupons  ↔  the server
git branch -vv                  # show upstreams + ahead/behind
git branch --set-upstream-to=origin/main main
git switch -c local-name origin/other-name    # start from a remote branch

# The three states people confuse
"ahead 2"           → I have 2 unpushed commits
"behind 3"          → origin/main (as of last fetch) has 3 I do not
"diverged 2 and 3"  → both moved → pull (rebase) or merge before pushing
# ⚠ Numbers come from the LAST FETCH. Run git fetch before trusting them.

# Rejected push? Never reach for --force by reflex:
git fetch origin && git rebase origin/main   # replay my work on top
# then push. If it is a shared branch, merge instead of rebasing.</pre>
<div class="key-point"><code>fetch</code> is always safe and only updates <code>origin/*</code>; <code>pull</code> adds an integration step you should configure (<code>pull.rebase</code> or <code>ff only</code>) to avoid junk merge commits; <code>push</code> requires a fast-forward, so answer a rejection with fetch + rebase/merge, never a blind force. Remember ahead/behind counts are only as fresh as your last fetch.</div>`,
      },
      {
        q: 'How do you use tags, and how do they relate to releases and versioning?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>A tag is a permanent name for a commit, which is what makes it the right way to mark releases. A <strong>lightweight</strong> tag is just a pointer; an <strong>annotated</strong> tag (<code>-a</code>) is a real object with a tagger, date, message, and optional GPG/SSH signature — always use annotated tags for releases, because they are auditable and are what <code>git describe</code> uses. Tags are not pushed by default (<code>git push --follow-tags</code>), and by convention they are immutable: never move a published tag, because consumers and build systems cache it. In practice the tag drives the release: CI triggers on <code>v*</code>, injects the version into the artifact, generates a changelog from Conventional Commits, and publishes — with tools like semantic-release or Changesets deciding the semver bump automatically from commit types.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Tag là một cái tên cố định gắn cho một commit, và chính vì vậy nó là cách đúng để đánh dấu bản phát hành. Tag <strong>lightweight</strong> chỉ là một con trỏ; tag <strong>annotated</strong> (<code>-a</code>) là một object thật, có người tạo, ngày tạo, message và có thể ký GPG/SSH — với release thì luôn dùng annotated, vì nó audit được và cũng là thứ mà <code>git describe</code> dùng. Tag không được push theo mặc định (phải <code>git push --follow-tags</code>), và theo quy ước thì tag là bất biến: đừng bao giờ dời một tag đã công bố sang commit khác, vì phía người dùng và hệ thống build đã cache nó rồi. Trong thực tế thì tag là thứ khởi động quy trình phát hành: CI kích hoạt khi thấy tag <code>v*</code>, nhúng version vào artifact, sinh changelog từ Conventional Commits, rồi publish — với các công cụ như semantic-release hay Changesets tự quyết định mức tăng semver dựa trên loại commit.</p></details>
<pre># Annotated (use this) vs lightweight
git tag -a v1.4.0 -m "Release 1.4.0: coupon support"
git tag v1.4.0-hotfix          # lightweight: just a pointer, no metadata
git tag -s v1.4.0 -m "..."     # signed — verifiable provenance
git tag -v v1.4.0              # verify the signature
git push origin v1.4.0         # tags are NOT pushed by git push
git push --follow-tags         # push commits + annotated tags together

# Inspecting and using tags
git tag -l "v1.4.*" --sort=-v:refname
git show v1.4.0
git describe --tags            # v1.4.0-12-gabc1234 → "12 commits after
                               # v1.4.0, at abc1234" — great for build labels
git tag --contains &lt;sha&gt;       # which releases include this commit?
git log v1.3.0..v1.4.0 --oneline    # the changelog between two releases
git switch --detach v1.4.0     # inspect a release (detached HEAD)

# Deleting / moving (avoid on published tags)
git tag -d v1.4.0 && git push origin :refs/tags/v1.4.0   # ⚠ breaks consumers</pre>
<pre># Semantic versioning, decided by commit type
MAJOR.MINOR.PATCH   1.4.2
  MAJOR ← breaking change   (feat!: / BREAKING CHANGE: footer)
  MINOR ← new feature       (feat:)
  PATCH ← bug fix           (fix:)
# Pre-release / build metadata: 2.0.0-rc.1, 1.4.2+build.981

# Tag-driven release pipeline (GitHub Actions sketch)
on: { push: { tags: ['v*'] } }
jobs:
  release:
    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 0 }        # ← needed for changelog/describe
      - run: mvn -B versions:set -DnewVersion=\${GITHUB_REF_NAME#v}
      - run: mvn -B deploy
      - uses: softprops/action-gh-release@v2    # notes from commits/PRs
# Or fully automated: semantic-release / release-please / changesets read
# the Conventional Commits since the last tag, compute the next version,
# write CHANGELOG.md, create the tag and the GitHub release.

# Rules that keep releases trustworthy
- one immutable tag per release; hotfix = a NEW patch tag
- the artifact carries the version and the commit sha (build info endpoint)
- protect tags on the platform so they cannot be moved or deleted
- for containers: image tag = git tag, plus an immutable digest reference
- branches for maintenance (release/1.4.x) + cherry-pick fixes forward</pre>
<div class="key-point">Use annotated (ideally signed) tags for releases, push them explicitly, and treat published tags as immutable — hotfixes get a new patch tag. Let Conventional Commits drive semver and let the tag trigger the release pipeline so the version, changelog, and artifact always agree.</div>`,
      },
      {
        q: 'What are Git hooks and how do you use them in a team?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Hooks are scripts Git runs at defined points. The useful client-side ones are <code>pre-commit</code> (format and lint the staged files), <code>commit-msg</code> (enforce a message convention), and <code>pre-push</code> (run the fast tests). Because <code>.git/hooks</code> is not versioned, teams use a manager — <strong>husky</strong> + <strong>lint-staged</strong> in Node, <strong>lefthook</strong> or the <strong>pre-commit</strong> framework for polyglot repos, or the Maven/Gradle git-hooks plugins — so the hooks are installed from the repository automatically. The critical caveat is that client hooks are advisory: anyone can pass <code>--no-verify</code>, and they do not run in CI. So hooks exist for fast feedback, while <strong>CI plus server-side branch protection</strong> is the actual enforcement point; keep hooks under a couple of seconds or people will bypass them.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Hook là các script mà Git chạy tại những thời điểm nhất định. Ở phía client, những hook hữu ích là <code>pre-commit</code> (format và lint các file đã stage), <code>commit-msg</code> (bắt buộc theo quy ước message), và <code>pre-push</code> (chạy các test nhanh). Vì thư mục <code>.git/hooks</code> không nằm trong version control, nên team thường dùng một công cụ quản lý — <strong>husky</strong> + <strong>lint-staged</strong> với Node, <strong>lefthook</strong> hoặc framework <strong>pre-commit</strong> cho repo nhiều ngôn ngữ, hoặc plugin git-hooks của Maven/Gradle — để hook được cài tự động từ repository. Điểm cần lưu ý quan trọng: hook ở client chỉ mang tính nhắc nhở — ai cũng có thể thêm <code>--no-verify</code>, và chúng không chạy trong CI. Vậy nên hook tồn tại để phản hồi nhanh, còn <strong>CI cộng với branch protection ở phía server</strong> mới là chỗ chốt thật; và hãy giữ hook chạy dưới vài giây, nếu không mọi người sẽ tìm cách bỏ qua.</p></details>
<pre># The hooks worth having (client side)
pre-commit   → format + lint STAGED files only (fast!), block secrets
commit-msg   → commitlint: enforce Conventional Commits
pre-push     → unit tests / typecheck; block pushing to main directly
post-merge   → warn if the lockfile changed ("run pnpm install")
prepare-commit-msg → prefill the ticket id from the branch name

# Node: husky + lint-staged (installed via a prepare script)
// package.json
"scripts": { "prepare": "husky" },
"lint-staged": {
  "*.{ts,tsx}": ["prettier --write", "eslint --max-warnings=0 --fix"],
  "*.{java}":   ["mvn -q spotless:apply"]
}
// .husky/pre-commit
npx lint-staged
npx gitleaks protect --staged --redact    # secrets never reach a commit
// .husky/commit-msg
npx commitlint --edit "\$1"

# Polyglot / language-agnostic: lefthook.yml
pre-commit:
  parallel: true
  commands:
    fmt:      { glob: "*.java", run: "mvn -q spotless:apply" }
    lint:     { glob: "*.ts",   run: "npx eslint {staged_files}" }
    secrets:  { run: "gitleaks protect --staged" }</pre>
<pre># Why hooks are not enforcement
git commit --no-verify        # skips pre-commit and commit-msg
git push --no-verify          # skips pre-push
# → the same checks MUST run in CI, and the branch must be protected:
#   require PR + passing checks, no direct pushes, no force-push,
#   require review, require linear history / signed commits if you need it.

# Server-side hooks (only if you host Git yourself)
pre-receive / update  → reject pushes that violate policy (bad message,
  oversized file, protected path). On GitHub/GitLab you use branch
  protection rules, push rules, or a CI required-check instead.

# Keep them tolerable
- staged files only, run in parallel, cache what you can
- never run the full test suite in pre-commit (that is pre-push, or CI)
- make the failure message say exactly how to fix it
- if a hook is regularly bypassed, it is too slow or too strict — fix the
  hook, do not blame the team</pre>
<div class="key-point">Use <code>pre-commit</code> for staged-file formatting/linting/secret scanning, <code>commit-msg</code> for conventions, and <code>pre-push</code> for quick tests — installed for everyone via husky/lefthook. Treat them as fast feedback only: real enforcement is CI plus branch protection, because <code>--no-verify</code> always exists.</div>`,
      },
      {
        q: 'How do you handle secrets, large files and generated files in a repository?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Three different problems with three different tools. <strong>Secrets</strong>: prevent with <code>.gitignore</code> plus a scanner in a pre-commit hook and in CI (gitleaks, trufflehog); if one is committed, rotate the credential first — a revert does not remove it from history — then rewrite with <code>git filter-repo</code> or BFG and force-push, accepting that everyone must re-clone. <strong>Large binaries</strong> bloat every clone forever because history is complete: use <strong>Git LFS</strong> (pointers in Git, blobs in a separate store) or, better, keep artifacts in object storage or a package registry and reference them. <strong>Generated files</strong> (<code>dist/</code>, compiled protos, coverage) generally should not be committed at all; when they must be, mark them in <code>.gitattributes</code> so diffs and merges behave. For very large repos, <code>--filter=blob:none</code> partial clones and sparse-checkout keep working copies fast.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Ba vấn đề khác nhau, ba cách xử lý khác nhau. <strong>Secret</strong>: phòng ngừa bằng <code>.gitignore</code> cộng một công cụ quét đặt trong pre-commit hook và trong CI (gitleaks, trufflehog); nếu lỡ commit lên rồi thì việc đầu tiên phải làm là thay mới (rotate) credential đó — vì revert không xoá nó khỏi lịch sử — rồi mới rewrite bằng <code>git filter-repo</code> hoặc BFG và force-push, đồng thời chấp nhận rằng mọi người phải clone lại. <strong>File binary lớn</strong> làm phình mọi bản clone mãi mãi vì lịch sử là đầy đủ: hãy dùng <strong>Git LFS</strong> (Git chỉ lưu con trỏ, nội dung nằm ở store riêng), hoặc tốt hơn là để artifact trong object storage hay package registry rồi tham chiếu tới. <strong>File sinh tự động</strong> (<code>dist/</code>, proto đã compile, coverage) nói chung không nên commit; nếu buộc phải thì khai báo trong <code>.gitattributes</code> để diff và merge hoạt động đúng. Với repo rất lớn, dùng partial clone <code>--filter=blob:none</code> và sparse-checkout để bản làm việc vẫn nhanh.</p></details>
<pre># Prevention first
# .gitignore
.env
.env.*
!.env.example          # commit a TEMPLATE, never real values
*.pem
*.p12
target/  dist/  build/  node_modules/  coverage/
.idea/  .vscode/       # or commit a shared subset deliberately

# global ignore for machine-specific noise (do not force it on the team)
git config --global core.excludesFile ~/.gitignore_global
# Already tracked but should be ignored? .gitignore does not apply:
git rm --cached .env && git commit -m "chore: stop tracking .env"</pre>
<pre># A secret got committed — the correct order
1. ROTATE the credential immediately (assume it is public forever)
2. remove it from history:
   git filter-repo --path config/secrets.yml --invert-paths
   # or: bfg --replace-text passwords.txt   (BFG is faster on big repos)
3. force-push every branch and tag; delete stale PR refs; ask everyone to
   re-clone (their old clones still contain the blob)
4. add gitleaks to pre-commit + CI, and scan the full history once
# Note: filter-branch is deprecated and slow — use filter-repo.
# Note: on GitHub, the commit may still be reachable via the API/forks —
# rotation is the only real remediation.

# Large files
git lfs install
git lfs track "*.psd" "*.mp4" "*.zip"     # writes to .gitattributes
git add .gitattributes
# Git stores a 130-byte pointer; the blob lives on the LFS server.
# ⚠ LFS adds server support, bandwidth quotas and a migration cost:
git lfs migrate import --include="*.mp4" --everything   # rewrites history
# Prefer NOT committing binaries: build artifacts → registry/S3, test
# fixtures → generate or download in setup, design assets → a DAM/Drive.
git count-objects -vH        # how big is my repo actually?
git rev-list --objects --all | ... | sort -k3 -n   # find the biggest blobs</pre>
<pre># .gitattributes — control diff/merge/EOL behaviour
* text=auto                       # normalize line endings in the repo
*.sh text eol=lf                  # scripts must stay LF (Windows-safe)
*.bat text eol=crlf
*.png binary                      # no diff, no merge attempts
package-lock.json merge=ours      # or a union/custom driver; regenerate
dist/** linguist-generated=true   # collapse in PR diffs on GitHub
*.ipynb filter=nbstripout         # strip notebook output before commit

# Very large repos / monorepos
git clone --filter=blob:none --sparse &lt;url&gt;    # partial clone (fast)
git sparse-checkout set apps/web packages/ui   # only the paths I need
git clone --depth=1                            # CI: shallow (mind
                                               # fetch-depth for changelogs)
git maintenance start                          # background gc/commit-graph</pre>
<div class="key-point">Never let secrets in (ignore + scanner in hook and CI); if one slips, rotate first and only then rewrite with filter-repo/BFG. Keep binaries out of history or behind LFS, do not commit generated output, and use <code>.gitattributes</code>, partial clone, and sparse-checkout to keep large repos workable.</div>`,
      },
      {
        q: 'Submodules, subtree or a monorepo — how do you share code across repositories?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p><strong>Submodules</strong> embed a pointer to a specific commit of another repository: precise and small, but every clone needs <code>--recurse-submodules</code>, updates are a two-step commit dance, and detached-HEAD confusion is a permanent tax — reasonable for vendored dependencies that rarely change. <strong>Subtree</strong> copies the other repository's content into a directory and merges its history, so consumers need no special commands, at the cost of a bigger repo and awkward contribution back upstream. A <strong>monorepo</strong> with workspaces sidesteps both by putting the shared code in the same repository, which gives atomic cross-package changes and one CI pipeline — the approach most product teams should choose. The fourth and often best answer for genuinely shared libraries is neither: publish a <strong>versioned package</strong> to an internal registry, so consumers upgrade deliberately.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><strong>Submodule</strong> nhúng vào một con trỏ tới đúng một commit của repository khác: chính xác và nhẹ, nhưng mọi lần clone đều phải thêm <code>--recurse-submodules</code>, cập nhật thì phải commit hai bước, và chuyện detached HEAD gây nhầm lẫn triền miên — chỉ hợp lý cho các dependency ít thay đổi. <strong>Subtree</strong> copy hẳn nội dung repo kia vào một thư mục và merge cả lịch sử, nên bên dùng không cần lệnh đặc biệt nào, đổi lại repo phình to và việc đóng góp ngược lên upstream khá lằng nhằng. <strong>Monorepo</strong> với workspaces thì bỏ qua cả hai bằng cách đặt code dùng chung ngay trong cùng repository, nhờ đó thay đổi xuyên nhiều package là nguyên tử và chỉ có một pipeline CI — đây là hướng phù hợp cho phần lớn team làm sản phẩm. Phương án thứ tư, và thường là tốt nhất cho một library thật sự dùng chung, lại không phải cả ba: hãy publish thành <strong>package có version</strong> lên registry nội bộ, để bên dùng chủ động nâng cấp.</p></details>
<pre># Submodule — a pinned pointer, not a copy
git submodule add https://github.com/acme/shared-ui libs/shared-ui
git clone --recurse-submodules &lt;repo&gt;        # ← forget this and libs/ is EMPTY
git submodule update --init --recursive      # the fix after a plain clone
# Updating: two commits, always
cd libs/shared-ui && git switch main && git pull
cd ../.. && git add libs/shared-ui && git commit -m "chore: bump shared-ui"
# ⚠ Submodules sit at a detached HEAD → work committed inside them is easy
#   to lose. CI must init submodules. Everyone must learn the workflow.
# ✅ Good for: vendored third-party source, large binary asset repos,
#   deployment manifests referenced by a specific version.

# Subtree — merge the content in; no special clone commands
git subtree add --prefix=libs/shared-ui https://github.com/acme/shared-ui main --squash
git subtree pull --prefix=libs/shared-ui &lt;url&gt; main --squash    # update
git subtree push --prefix=libs/shared-ui &lt;url&gt; feature/x        # contribute back
# ✅ transparent for consumers, works with any Git client
# ❌ history/size grows; contributing upstream is clumsy; easy to diverge</pre>
<pre># Monorepo — usually the right default for one product/organisation
repo/
  apps/web  apps/admin  services/orders  packages/ui  packages/api-client
# ✅ atomic commits across packages (change a shared type and every caller
#    in the same PR), one CI pipeline, one dependency graph, easy refactors
# ✅ tooling exists: pnpm/npm workspaces + Turborepo/Nx, Gradle multi-module,
#    Maven modules, CODEOWNERS for ownership boundaries
# ❌ needs affected-only CI and caching or the pipeline gets slow
# ❌ needs discipline: module-boundary lint rules so everything does not
#    import everything

# Versioned package — for a library with several INDEPENDENT consumers
publish @acme/shared-ui@2.3.0 → internal npm registry / Nexus / Artifactory
# ✅ consumers upgrade when they choose; semver communicates breakage;
#    no repo coupling. ❌ slower feedback loop; you must maintain releases.
# (Changesets in a monorepo gives you BOTH: co-located code, versioned
#  publishes.)</pre>
<pre># Decision guide
same product, one team/org, want atomic refactors   → monorepo
independent consumers, need semver + stability      → versioned package
third-party or asset repo pinned by commit          → submodule
must vendor code but consumers cannot learn Git     → subtree
# And name the real trade-off: monorepo = coordination cost inside CI;
# multi-repo = coordination cost inside humans (version drift, "which
# version of the client library are you on?").</pre>
<div class="key-point">Prefer a monorepo with workspaces for one product (atomic cross-package changes) and a versioned internal package for libraries with independent consumers. Submodules are for pinned external/vendored repos and demand team-wide discipline; subtree trades repo size for transparency.</div>`,
      },
      {
        q: 'What is git worktree and when is it useful?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p><code>git worktree</code> gives one repository several working directories, each on a different branch, sharing a single <code>.git</code> object store. That solves the everyday interruption problem without stashing: you keep your half-finished feature exactly as it is and check out the hotfix branch in a second directory, with its own <code>node_modules</code> and its own running dev server. It is also excellent for long-running comparisons — building two branches side by side, reviewing a colleague's PR while your tests run, or bisecting in a separate directory — and it is cheap because objects are not duplicated. The rules to remember: one branch cannot be checked out in two worktrees, remove them with <code>git worktree remove</code> (not <code>rm -rf</code>, or you leave stale metadata), and per-directory build artefacts still need installing.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><code>git worktree</code> cho phép một repository có nhiều thư mục làm việc, mỗi thư mục ở một branch khác nhau nhưng dùng chung một kho object <code>.git</code>. Nó giải quyết chuyện bị ngắt quãng hằng ngày mà không cần stash: bạn giữ nguyên phần feature đang làm dở, còn nhánh hotfix thì checkout ra một thư mục thứ hai, có <code>node_modules</code> riêng và dev server riêng. Nó cũng rất hợp cho các việc so sánh kéo dài — build hai nhánh song song, review PR của đồng nghiệp trong lúc test đang chạy, hay chạy bisect ở một thư mục riêng — và chi phí rất nhẹ vì object không bị nhân đôi. Vài quy tắc cần nhớ: một branch không thể được checkout ở hai worktree cùng lúc; muốn bỏ thì dùng <code>git worktree remove</code> (đừng <code>rm -rf</code>, vì sẽ để lại metadata rác); và các artifact build theo từng thư mục thì vẫn phải cài lại.</p></details>
<pre># Create a second working directory for an urgent fix
git worktree add ../myapp-hotfix hotfix/payment-bug
cd ../myapp-hotfix          # full working tree, own branch, shared history
# → your original directory is untouched: no stash, no rebuild, no
#   "which branch was I on?", and both dev servers can run at once.

git worktree add -b review/pr-482 ../myapp-review origin/feature/coupons
git worktree list
  /home/me/myapp           a1b2c3 [feature/coupons]
  /home/me/myapp-hotfix    9f8e7d [hotfix/payment-bug]
git worktree remove ../myapp-hotfix       # clean removal
git worktree prune                        # tidy metadata after manual deletes</pre>
<pre># Where it genuinely pays off
- production hotfix while a feature is half-done (the classic case)
- comparing behaviour/performance of two branches side by side
- reviewing a PR locally without disturbing your work in progress
- git bisect in an isolated directory while you keep working
- long builds: let one worktree compile while you code in another
- docs or release-branch maintenance without switching context

# Caveats
- the same branch cannot be checked out twice (Git refuses; use --detach)
- each worktree needs its own node_modules / target / .env → disk cost and
  an install step (a shared pnpm store makes this cheap)
- IDEs sometimes need the extra directory opened as a separate project
- submodules require init per worktree
- worktrees live inside the same repo: deleting the main clone kills them

# Related everyday helpers
git switch -                # jump back to the previous branch
git stash                   # still fine for a 2-minute interruption
git switch --detach v1.4.0  # inspect a tag without creating a branch</pre>
<div class="key-point"><code>git worktree add</code> gives another branch its own directory over the same object store — the clean answer to "urgent hotfix while my feature is half-done", plus side-by-side builds, PR review, and isolated bisects. Remove them with <code>git worktree remove</code>, and remember each directory needs its own dependencies.</div>`,
      },
      {
        q: 'What branching and PR workflow do you use, and how do you keep main releasable?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>I default to <strong>trunk-based development</strong>: short-lived branches off <code>main</code>, merged within a day or two behind feature flags when the work is bigger, with <code>main</code> always deployable. Long-lived branch models like GitFlow made sense when releases were quarterly and shipped to customers; with continuous deployment they mostly produce painful merges and stale code. The mechanics that make it work are protected branches (no direct pushes, no force-push, required review and green CI), one focused PR per change, squash-merge so <code>main</code> reads as one commit per change, and release tags plus short-lived <code>release/x.y</code> branches only if you genuinely support multiple versions. The habit that matters most is <em>small</em>: a 200-line PR gets a real review in ten minutes, a 2000-line PR gets "LGTM".</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Mặc định tôi chọn <strong>trunk-based development</strong>: nhánh sống ngắn tách ra từ <code>main</code>, merge lại trong vòng một hai ngày, việc lớn thì che sau feature flag, và <code>main</code> luôn ở trạng thái deploy được. Các mô hình nhánh sống lâu như GitFlow từng hợp lý khi mỗi quý mới release một lần và phải giao bản cho khách; còn với continuous deployment thì nó chủ yếu sinh ra những lần merge vất vả và code viết xong cứ nằm chờ mãi. Những cơ chế giúp cách làm này chạy được: branch được bảo vệ (không push trực tiếp, không force-push, bắt buộc review và CI xanh), mỗi PR chỉ giải quyết một việc, squash-merge để <code>main</code> đọc ra mỗi thay đổi là một commit, và dùng tag phát hành cộng nhánh <code>release/x.y</code> sống ngắn chỉ khi bạn thật sự phải hỗ trợ nhiều phiên bản. Nhưng thói quen quan trọng nhất vẫn là <em>nhỏ</em>: một PR 200 dòng thì mười phút là được review thật, còn PR 2000 dòng thì chỉ nhận lại một chữ "LGTM".</p></details>
<pre># Trunk-based (my default)
main  ──●──●──●──●──●──●──→  always green, always deployable
         \\    /  \\    /
          ●──●    ●──●        feature branches: hours to ~2 days
# Big feature? Merge it dark behind a flag:
if (flags.newCheckout) renderNewCheckout(); else renderOldCheckout();
# → integration risk disappears; the flag is removed after rollout.

# GitFlow (only when you ship versioned software to customers)
main ── tags only          develop ── integration
  ├─ release/1.4  ── stabilise, then merge to main + develop
  └─ hotfix/1.4.1 ── from main, merge back to both
# Cost: develop→main divergence, long-lived feature branches, merge pain.
# If you deploy several times a day, this model buys you nothing.</pre>
<pre># Branch protection on main (the actual enforcement)
- require a pull request; block direct pushes
- require passing status checks (build, tests, lint, security scan)
- require at least one review; CODEOWNERS for sensitive paths
- require branches to be up to date before merging (or use a merge queue)
- forbid force-push and deletion; optionally require signed commits
- restrict who can merge to release branches

# Naming and PR hygiene
feature/PROJ-482-coupon-validation      fix/PROJ-501-npe-on-checkout
chore/bump-spring-boot-3.3              release/1.4
# PR: one concern; description says WHY and how to verify; screenshots for
# UI; linked ticket; small (aim < 400 changed lines); draft while WIP.
# Author's job: self-review the diff first, keep commits meaningful,
# rebase onto main before asking for review.

# Merge strategy — pick one and configure the repo
squash  → one commit per PR on main (clean, bisect-friendly) ← most teams
merge   → keeps every commit + a merge commit (full context, noisier)
rebase  → linear, no merge commit (needs disciplined commit series)
# Merge queues (GitHub/GitLab) test the post-merge result before landing,
# which is how large teams keep main green without serialising by hand.</pre>
<p><strong>Keeping <code>main</code> releasable</strong> is the real deliverable: CI on every PR and on <code>main</code>, fast tests so feedback is minutes, a red <code>main</code> treated as an incident (revert first, fix forward), feature flags instead of long branches, backward-compatible database migrations so any commit can deploy, and release tags that trigger the pipeline. If you cannot deploy the current <code>main</code> right now, that is the problem to fix before optimizing the branching diagram.</p>
<div class="key-point">Short-lived branches off <code>main</code>, feature flags for big work, protected branches with required reviews and green CI, and squash-merge for a readable history. Keep PRs small, treat a red <code>main</code> as an incident, and reserve GitFlow-style release branches for genuinely versioned products.</div>`,
      },
      {
        q: 'What are cherry-pick and revert used for in a release process?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p><code>cherry-pick</code> copies a specific commit's changes onto another branch as a new commit — the normal way to move a hotfix onto a maintenance branch, or to promote one fix out of a feature branch that is not ready. <code>revert</code> creates an inverse commit, which is how you undo something already on a shared branch. Both are safe because neither rewrites history, and both are worth using deliberately rather than habitually: repeated cherry-picking between long-lived branches is a symptom of a branching model that is fighting you, and it makes future merges conflict because the same change exists twice with different hashes. Two specifics worth knowing: reverting a merge needs <code>-m 1</code>, and reverting a revert is the normal way to bring a change back.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><code>cherry-pick</code> lấy thay đổi của một commit cụ thể và áp lên nhánh khác thành một commit mới — đây là cách thông thường để đưa một bản hotfix sang nhánh bảo trì, hoặc để tách một fix ra khỏi nhánh feature còn chưa xong. <code>revert</code> tạo ra một commit nghịch đảo, và đó là cách hoàn tác thứ đã nằm trên nhánh chung. Cả hai đều an toàn vì không viết lại lịch sử, và cả hai nên được dùng có chủ đích chứ không thành thói quen: cherry-pick liên tục qua lại giữa các nhánh sống lâu là dấu hiệu mô hình nhánh đang gây khó cho bạn, và nó khiến các lần merge sau bị conflict vì cùng một thay đổi tồn tại hai lần với hai hash khác nhau. Hai chi tiết đáng nhớ: revert một merge thì phải thêm <code>-m 1</code>, và revert lại chính commit revert là cách bình thường để mang thay đổi đó trở lại.</p></details>
<pre># Cherry-pick: copy a commit somewhere else
git switch release/1.4
git cherry-pick a1b2c3              # one commit
git cherry-pick a1b2c3^..d4e5f6     # a range
git cherry-pick -x a1b2c3           # append "(cherry picked from ...)" ←
                                    # do this: it records the provenance
git cherry-pick -n a1b2c3           # apply without committing (inspect first)
# Conflicts behave like a mini-rebase:
git add &lt;files&gt; && git cherry-pick --continue    # or --abort / --skip

# Typical release use: fix on main, port to the maintenance branch
main         ──●──●──[fix]──●──→
release/1.4  ──●───────[fix']──→   (cherry-picked, new hash, -x recorded)
# The reverse direction (hotfix on release/1.4 first) then requires
# cherry-picking or merging it FORWARD into main — and forgetting that
# step is how a bug reappears in the next release.</pre>
<pre># Revert: undo without rewriting
git revert a1b2c3                   # inverse commit, safe on shared branches
git revert --no-commit a1b2c3 b2c3d4  # batch several into one revert commit
git revert -m 1 &lt;merge-sha&gt;         # revert a MERGE, keeping parent 1 (main)
git revert &lt;revert-sha&gt;             # "unrevert" — bring the change back

# Incident playbook — restore service first
1. git revert the bad commit (or the merge) on main
2. deploy the revert; verify recovery
3. fix properly on a new branch, with a test that reproduces the bug
4. merge the fix (which is often a revert-of-the-revert plus the fix)
# ⚠ Reverting a merge marks the branch as "already merged": a later
# re-merge will NOT bring the changes back. Re-apply with a revert of the
# revert, or cherry-pick the individual commits.</pre>
<pre># Hygiene
- prefer merging forward (release → main) over cherry-picking the same fix
  twice; if you must pick, always use -x so the duplicate is traceable
- cherry-pick single, focused commits — this is another reason atomic
  commits matter
- never cherry-pick a commit that depends on earlier commits you did not
  take; the result compiles-by-luck at best
- automate it where the model demands it (backport labels/bots that open
  the cherry-pick PR against each supported release branch)
- if you cherry-pick constantly, revisit the branching model: trunk-based
  with flags removes most of the need</pre>
<div class="key-point">Cherry-pick copies a commit to another branch (use <code>-x</code> for traceability, keep commits atomic); revert adds an inverse commit and is the safe undo for shared history. Revert first during an incident, remember <code>-m 1</code> for merges and that re-merging a reverted branch will not restore it — and treat constant cherry-picking as a branching-model smell.</div>`,
      },
      {
        q: 'What Git configuration and habits make a senior developer productive?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>A small amount of configuration removes most day-to-day friction: <code>pull.rebase</code> so pulls stop creating merge commits, <code>rerere.enabled</code> so repeated conflicts resolve themselves, <code>merge.conflictStyle=zdiff3</code> so conflicts show the ancestor, <code>push.autoSetupRemote</code> so the first push just works, <code>fetch.prune</code> so deleted remote branches disappear, and <code>--force-with-lease</code> as the only force you ever type. The habits matter more than the config: commit small and often with messages that explain <em>why</em>, rebase onto main before review, review your own diff first, and never commit generated files or secrets. And know the archaeology commands — <code>log -S</code>, <code>log -L</code>, <code>blame -w -C</code>, <code>bisect run</code> — because reading history well is what makes an unfamiliar codebase tractable.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Chỉ cần một ít cấu hình là bỏ được phần lớn ma sát hằng ngày: <code>pull.rebase</code> để pull không còn tạo merge commit rác, <code>rerere.enabled</code> để những conflict lặp lại tự giải quyết, <code>merge.conflictStyle=zdiff3</code> để conflict hiện cả bản tổ tiên, <code>push.autoSetupRemote</code> để lần push đầu chạy luôn không cần thêm cờ, <code>fetch.prune</code> để các nhánh remote đã xoá biến mất, và <code>--force-with-lease</code> là dạng force duy nhất bạn nên gõ. Nhưng thói quen quan trọng hơn cấu hình: commit nhỏ và thường xuyên với message giải thích <em>vì sao</em>, rebase lên main trước khi nhờ review, tự đọc diff của mình trước, và không bao giờ commit file sinh tự động hay secret. Ngoài ra hãy nắm các lệnh "khảo cổ" — <code>log -S</code>, <code>log -L</code>, <code>blame -w -C</code>, <code>bisect run</code> — vì đọc được lịch sử mới là thứ giúp bạn xoay xở được trong một codebase xa lạ.</p></details>
<pre># ~/.gitconfig — the settings I put on every machine
[pull]   rebase = true            # no accidental merge commits
[rebase] autosquash = true
         autostash = true         # rebase with dirty working tree
[rerere] enabled = true           # remember conflict resolutions
[merge]  conflictStyle = zdiff3   # show the common ancestor
[push]   default = current
         autoSetupRemote = true   # first \`git push\` just works
         followTags = true
[fetch]  prune = true             # drop stale origin/* refs
[diff]   algorithm = histogram
         colorMoved = zebra       # moved code shown distinctly
[core]   excludesFile = ~/.gitignore_global
         editor = code --wait
[init]   defaultBranch = main
[commit] verbose = true           # show the diff while writing the message
[blame]  ignoreRevsFile = .git-blame-ignore-revs   # skip reformat commits
[alias]
  st = status -sb
  lg = log --graph --oneline --decorate --all
  last = log -1 --stat
  unstage = restore --staged
  amend = commit --amend --no-edit
  wip = commit -am "wip"
  fixup = "!f(){ git commit --fixup=\$1; };f"
  pushf = push --force-with-lease</pre>
<pre># Reading an unfamiliar codebase (the underrated skill)
git log --oneline --graph --first-parent      # the shape of main's history
git log --since="3 months" --pretty='%an' | sort | uniq -c | sort -rn  # owners
git log -S "createOrder" --oneline           # when did this appear/vanish
git log -L 1,40:src/pricing.ts               # how these lines evolved
git blame -w -C -M src/pricing.ts            # who + why (ignore moves/format)
git show &lt;sha&gt;                               # the full change + message
git log --oneline v1.3.0..v1.4.0             # what shipped in a release
git diff --stat origin/main...HEAD           # scope of my branch

# Habits that show seniority in a PR
- one concern per PR, per commit; each commit builds
- message: what changed, WHY, and how it was verified
- rebase onto main before review; resolve conflicts yourself
- self-review the diff (you will catch the console.log)
- never \`--force\` a shared branch; never commit secrets or dist/
- leave the history usable for the next person: they will bisect it</pre>
<div class="key-point">Configure once (<code>pull.rebase</code>, <code>rerere</code>, <code>zdiff3</code>, <code>fetch.prune</code>, <code>autoSetupRemote</code>, <code>--force-with-lease</code>) and the daily friction disappears. Then invest in habits — small atomic commits, messages that explain why, self-reviewed rebased PRs — and in history archaeology (<code>log -S</code>, <code>log -L</code>, <code>blame -w -C</code>, <code>bisect run</code>), which is what makes any codebase navigable.</div>`,
      },
    ],
  },
];
