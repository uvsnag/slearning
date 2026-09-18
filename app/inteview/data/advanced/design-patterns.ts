// Interview data: DESIGN PATTERNS
import type { PvTopic } from '../../types';

export const topics: PvTopic[] = [
  {
    id: 'design-patterns',
    name: 'Design Patterns',
    icon: '🧩',
    questions: [
      // ──── 1. FOUNDATIONS & DESIGN PRINCIPLES ────
      {
        q: 'What is a design pattern and why does it matter?',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>A <strong>design pattern</strong> is a named, reusable solution to a common design problem. Patterns also act as a shared vocabulary, so a short name can describe a whole design to other developers. They are tools, not goals: each one adds indirection that can hurt readability, so using them everywhere makes code worse. A pattern is best used only when a real need for change or flexibility actually appears.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><strong>Design pattern</strong> là giải pháp mẫu đã được đặt tên cho những vấn đề thiết kế lặp đi lặp lại, để ta không phải nghĩ lại từ đầu mỗi lần gặp. Giá trị lớn nhất của pattern là tạo ra một ngôn ngữ chung: chỉ cần nói "chỗ này dùng Decorator" là đồng nghiệp hiểu ngay cả thiết kế mà không cần giải thích dài. Tuy vậy pattern là công cụ, không phải đích đến. Mỗi pattern đều thêm một lớp trung gian khiến code khó đọc hơn, nên cứ thấy đâu cũng nhét pattern vào thì code chỉ tệ đi. Chỉ nên dùng khi nhu cầu thay đổi hay mở rộng đã thực sự xuất hiện, chứ không phải vì dự đoán sau này có thể cần.</p></details>
<p>A <strong>design pattern</strong> is a reusable solution to a recurring design problem.</p>
<ul>
<li>It gives a shared vocabulary.</li>
<li>It improves maintainability when used appropriately.</li>
<li>It is not a rule to force everywhere.</li>
</ul>
<pre>// Example: same interface, different implementations
interface NotificationSender {
    void send(String message);
}

class EmailSender implements NotificationSender {
    public void send(String message) {
        System.out.println("Email: " + message);
    }
}

class SmsSender implements NotificationSender {
    public void send(String message) {
        System.out.println("SMS: " + message);
    }
}

// Usage: the same call works with any implementation
NotificationSender sender = new EmailSender();
sender.send("Order shipped");   // Email: Order shipped
sender = new SmsSender();
sender.send("Order shipped");   // SMS: Order shipped</pre>
<div class="key-point">Patterns are tools, not goals. Overusing them can make simple code harder to understand.</div>`,
      },
      {
        q: 'What are SOLID principles? Give a brief example of each.',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>SOLID is a set of five design principles that help keep code easy to change. <strong>SRP</strong> says a class should have only one reason to change. <strong>OCP</strong> says add new behavior with new code instead of editing tested code, <strong>LSP</strong> says a subtype must work anywhere its parent is used, <strong>ISP</strong> says prefer small focused interfaces, and <strong>DIP</strong> says depend on abstractions, not concrete classes. These are guidelines to reduce coupling, so apply them where change really happens rather than everywhere.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>SOLID là năm nguyên tắc thiết kế hướng đối tượng, mục đích chung là giúp code dễ sửa mà ít gây hỏng chỗ khác. <strong>S – Single Responsibility</strong>: mỗi class chỉ nên có một lý do để thay đổi; class vừa xử lý đăng nhập, vừa gửi email, vừa xuất PDF là vi phạm. <strong>O – Open/Closed</strong>: muốn thêm hành vi mới thì viết class mới, đừng đi sửa đoạn code đã chạy ổn và đã test. <strong>L – Liskov Substitution</strong>: chỗ nào đang dùng lớp cha mà thay bằng lớp con thì vẫn phải chạy đúng, không có bất ngờ. <strong>I – Interface Segregation</strong>: chia interface nhỏ và đúng mục đích, đừng ép class implement những method nó không cần. <strong>D – Dependency Inversion</strong>: phụ thuộc vào abstraction (interface) thay vì class cụ thể. Đây là kim chỉ nam để giảm coupling chứ không phải luật cứng, nên áp dụng ở chỗ thực sự hay thay đổi thay vì rải đều mọi nơi. Trong phỏng vấn, hai chữ hay bị hỏi sâu nhất là S và D.</p></details>
<p>SOLID is five object-oriented design principles that make code more maintainable:</p>
<pre>S - Single Responsibility: One class = one reason to change
  ❌ UserService handles login, email sending, and PDF generation
  ✅ UserService handles login; EmailService handles email; PdfService handles PDF

O - Open/Closed: Open for extension, closed for modification
  ❌ if (type == "pdf") ... else if (type == "csv") ... // modify to add new type
  ✅ interface Exporter { void export(); } // extend by adding new class

L - Liskov Substitution: Subtype must work wherever parent type is expected
  ❌ class Square extends Rectangle { setWidth() { also sets height } }
     // violates: Rectangle user expects width/height to be independent
  ✅ Use separate Shape interface for Square and Rectangle

I - Interface Segregation: Don't force classes to implement methods they don't use
  ❌ interface Worker { void code(); void manageMeetings(); void cook(); }
  ✅ interface Coder { void code(); }
     interface Manager { void manageMeetings(); }

D - Dependency Inversion: Depend on abstractions, not concretions
  ❌ class OrderService { private MySqlRepo repo = new MySqlRepo(); }
  ✅ class OrderService { private Repository repo; // interface injected }</pre>
<div class="key-point">SOLID principles are heavily asked in interviews. Know one concrete example for each. The most commonly tested are Single Responsibility (S) and Dependency Inversion (D).</div>`,
      },
      {
        q: 'Why favor composition over inheritance?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Inheritance is very tight coupling because a subclass depends on the parent's internal details, so a change in the base class can silently break it. This is called the fragile base class problem, shown by the <code>InstrumentedHashSet</code> example where the parent calls its own methods internally. Composition holds an object and delegates to it, depending only on its public interface, so it is safer and can be changed at runtime. Use inheritance only for a real is-a relationship where the base is designed for extension, and otherwise prefer has-a.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Kế thừa tạo ra sự ràng buộc rất chặt: lớp con phụ thuộc vào cả cách lớp cha hoạt động bên trong, nên chỉ cần lớp cha đổi một chi tiết là lớp con có thể hỏng mà không ai báo. Đây gọi là vấn đề "fragile base class". Ví dụ kinh điển là <code>InstrumentedHashSet</code>: bạn override cả <code>add()</code> và <code>addAll()</code> để đếm số phần tử được thêm, nhưng vì <code>HashSet.addAll()</code> bên trong lại gọi <code>add()</code>, nên kết quả bị đếm gấp đôi. Composition thì khác: bạn giữ một object bên trong và chuyển tiếp (delegate) lời gọi cho nó, chỉ phụ thuộc vào public interface chứ không dính gì tới cách nó cài đặt. Nhờ đó an toàn hơn, và còn có thể thay object bên trong lúc runtime. Nguyên tắc: chỉ kế thừa khi quan hệ đúng là "is-a" và lớp cha được thiết kế sẵn để mở rộng; các trường hợp còn lại dùng "has-a".</p></details>
<p>Inheritance couples your class to the <strong>implementation details</strong> of the parent — the "fragile base class" problem. The canonical demonstration is <code>InstrumentedHashSet</code> from <em>Effective Java</em>:</p>
<pre>// BROKEN: inheritance leaks the parent's self-calls
class InstrumentedHashSet&lt;E&gt; extends HashSet&lt;E&gt; {
    private int addCount = 0;

    @Override public boolean add(E e) {
        addCount++;
        return super.add(e);
    }
    @Override public boolean addAll(Collection&lt;? extends E&gt; c) {
        addCount += c.size();
        return super.addAll(c);   // ← HashSet.addAll calls add()
    }                             //   internally... OUR add()!
}

InstrumentedHashSet&lt;String&gt; s = new InstrumentedHashSet&lt;&gt;();
s.addAll(List.of("a", "b", "c"));
s.getAddCount();  // 6, not 3! Counted once in addAll, once per add()

// Worse: this depends on an UNDOCUMENTED detail of HashSet.
// If a JDK update changes addAll to not call add(), the count
// silently becomes 3. Your correctness depends on code you
// don't own and can't see.</pre>
<pre>// FIX: composition + delegation (wrapper / decorator style)
class InstrumentedSet&lt;E&gt; implements Set&lt;E&gt; {
    private final Set&lt;E&gt; inner;      // HAS-A, not IS-A
    private int addCount = 0;

    InstrumentedSet(Set&lt;E&gt; inner) { this.inner = inner; }

    public boolean add(E e) { addCount++; return inner.add(e); }
    public boolean addAll(Collection&lt;? extends E&gt; c) {
        addCount += c.size();
        return inner.addAll(c);  // inner's self-calls stay inside
    }                            // inner — can't re-enter our code
    // ...delegate the rest
}
// Bonus: works with ANY Set (HashSet, TreeSet, ...), not just one parent</pre>
<p><strong>The deeper reasons:</strong></p>
<ul>
<li>Inheritance is decided at compile time and you get exactly one parent; composition can be swapped at runtime and combined freely.</li>
<li>Subclassing breaks encapsulation: overriding requires knowing the parent's internal call graph.</li>
<li>Inheritance means the subclass must honor the parent's full contract (LSP) — often you only wanted to reuse some code.</li>
</ul>
<p><strong>When inheritance IS right:</strong> a genuine is-a relationship where the base class is <em>designed and documented for extension</em> (or abstract with template methods). Otherwise, per Effective Java: "design and document for inheritance or else prohibit it."</p>
<div class="key-point">Inheritance couples you to the parent's hidden self-call patterns — a JDK update can break your subclass. Composition forwards calls across a hard boundary, so you depend only on the public contract.</div>`,
      },
      {
        q: 'What is Dependency Injection and how does it relate to design patterns?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p><strong>Dependency Injection</strong> means a class receives its dependencies from outside, usually through the constructor, instead of creating them with <code>new</code>. This makes code loosely coupled and testable, since a mock or a different implementation can be injected without changing the class. It is the concrete way to apply the Dependency Inversion principle and is closely tied to Inversion of Control. Constructor injection is preferred because it makes dependencies explicit and allows immutable, fully-built objects. DI can be done by hand, so a container is a convenience, not a requirement, and over-configured containers can become hard to maintain.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><strong>Dependency Injection</strong> hiểu đơn giản là: class không tự <code>new</code> những thứ nó cần, mà được đưa (inject) từ bên ngoài vào, thường qua constructor. Lợi ích thấy ngay là code ít ràng buộc và dễ test: muốn test thì đưa mock vào, muốn đổi implementation thì đổi ở chỗ lắp ráp, còn bản thân class không phải sửa gì. Về nguyên lý, DI là cách hiện thực hóa nguyên tắc Dependency Inversion (chữ D trong SOLID) và đi liền với khái niệm Inversion of Control. Nên ưu tiên constructor injection vì nó cho thấy rõ class cần gì, và object vừa tạo ra là đã đầy đủ, có thể để bất biến. Cần nhớ DI hoàn toàn có thể làm bằng tay; container như Spring chỉ là tiện ích chứ không bắt buộc, và một container cấu hình quá rườm rà cũng có thể trở thành gánh nặng bảo trì.</p></details>
<p><strong>Dependency Injection (DI)</strong> provides dependencies from outside rather than creating them inside, enabling loose coupling and testability.</p>
<pre>// ❌ Without DI: tight coupling
class OrderService {
    private EmailService emailService = new EmailService(); // hardcoded dependency
    private PaymentGateway gateway = new StripeGateway();   // can't swap easily
}

// ✅ With DI: dependencies injected
class OrderService {
    private final EmailService emailService;
    private final PaymentGateway gateway;

    // Constructor injection (preferred)
    OrderService(EmailService emailService, PaymentGateway gateway) {
        this.emailService = emailService;
        this.gateway = gateway;
    }
}

// Production: new OrderService(new SmtpEmailService(), new StripeGateway())
// Testing:    new OrderService(new MockEmailService(), new MockGateway())</pre>
<p><strong>DI types:</strong></p>
<ul>
<li><strong>Constructor injection</strong> (recommended): all dependencies in constructor, object is always valid</li>
<li><strong>Setter injection</strong>: optional dependencies, can change at runtime</li>
<li><strong>Field injection</strong>: Spring @Autowired on fields — convenient but harder to test</li>
</ul>
<div class="key-point">DI applies the Dependency Inversion Principle (the "D" in SOLID): depend on abstractions, not concrete classes. Spring, Angular, and .NET all have built-in DI containers.</div>`,
      },

      // ──── 2. CREATIONAL PATTERNS ────
      {
        q: 'What is the Singleton pattern and what are its risks?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p><strong>Singleton</strong> makes sure only one instance of a class exists, with a global access point. It has real pitfalls: thread safety during lazy creation, and being broken through reflection or serialization. The deeper problem is that it is global mutable state, which hides dependencies and makes testing hard. In most cases it is better to keep a single instance managed by a DI container and inject it as a normal dependency.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><strong>Singleton</strong> đảm bảo một class chỉ có đúng một instance trong toàn ứng dụng và cung cấp một điểm truy cập toàn cục tới nó. Rủi ro ở mức kỹ thuật: khởi tạo lazy trong môi trường đa luồng rất dễ viết sai, và singleton viết tay có thể bị phá bằng reflection hay serialization. Nhưng rủi ro lớn hơn nằm ở thiết kế: singleton thực chất là biến toàn cục có thể thay đổi, nó che giấu dependency của class dùng nó và khiến test rất khó vì trạng thái bị chia sẻ giữa các test. Vì vậy trong phần lớn trường hợp, cách hay hơn là để DI container quản lý một instance duy nhất (scope singleton) rồi inject vào như một dependency bình thường. Nếu buộc phải tự viết trong Java thì dùng enum là cách an toàn nhất.</p></details>
<p><strong>Singleton</strong> ensures only one instance of a class exists.</p>
<ul>
<li>Useful for shared configuration or one-off coordinators.</li>
<li>Risks: hidden global state, hard testing, tight coupling.</li>
</ul>
<pre>// Enum-based Singleton in Java
public enum AppConfig {
    INSTANCE;

    private final String env = "prod";

    public String getEnv() {
        return env;
    }
}

// Usage:
String env = AppConfig.INSTANCE.getEnv();</pre>
<div class="key-point">In Java, enum-based singleton is the safest common implementation.</div>`,
      },
      {
        q: 'Why is double-checked locking broken without volatile?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>Double-checked locking checks the instance, locks only if it is null, then checks again to avoid locking on every call. The problem is that <code>instance = new Singleton()</code> is not atomic, so the reference can be published before the constructor finishes and another thread may see a half-built object. Marking the field <code>volatile</code> adds a memory barrier that prevents this reordering and guarantees visibility. In Java it is simpler to use the holder idiom or an enum, which are lazy and thread-safe by default.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Double-checked locking làm việc như sau: kiểm tra <code>instance</code> có null không, chỉ khi null mới vào khối <code>synchronized</code>, rồi kiểm tra lại lần nữa trước khi tạo, mục đích là tránh tốn chi phí lock ở mọi lần gọi. Chỗ hỏng nằm ở câu <code>instance = new Singleton()</code>: nó không phải một thao tác nguyên tử mà gồm ba bước (cấp bộ nhớ, chạy constructor, gán tham chiếu), và JIT/CPU được phép đảo thứ tự hai bước sau. Kết quả là thread A có thể gán tham chiếu trước khi constructor chạy xong; thread B thấy khác null ở lần kiểm tra đầu (không có lock nên không có happens-before) và dùng luôn một object mà field còn toàn giá trị mặc định. Đánh dấu field là <code>volatile</code> sẽ cấm việc đảo thứ tự này và bảo đảm visibility giữa các thread. Trong Java hiện đại thì nên bỏ hẳn cách viết này: dùng holder idiom (class lồng tĩnh) hoặc enum, vừa lazy vừa thread-safe nhờ chính cơ chế class loading của JVM.</p></details>
<p>The classic Java singleton trap. Double-checked locking tries to avoid synchronizing on every <code>getInstance()</code> call — but without <code>volatile</code> it can return a <strong>half-constructed object</strong>.</p>
<pre>// BROKEN without volatile:
class Singleton {
    private static Singleton instance;   // ← missing volatile!

    static Singleton getInstance() {
        if (instance == null) {                  // 1st check (no lock)
            synchronized (Singleton.class) {
                if (instance == null) {          // 2nd check (locked)
                    instance = new Singleton();  // ← the problem
                }
            }
        }
        return instance;
    }
}

// "instance = new Singleton()" is NOT atomic. It's roughly:
//   1. allocate memory
//   2. run constructor (initialize fields)
//   3. assign reference to 'instance'
// The JIT/CPU may REORDER 2 and 3. So Thread A can publish
// the reference (step 3) BEFORE the constructor ran (step 2).
// Thread B sees instance != null at the 1st check (no lock,
// no happens-before!) and happily uses an object whose fields
// are still default values (null/0). Rare, non-reproducible, brutal.</pre>
<pre>// Fix 1: volatile — forbids the reorder, creates happens-before
private static volatile Singleton instance;

// Fix 2 (better): initialization-on-demand holder — lazy, fast, no locks
class Singleton {
    private static class Holder {
        static final Singleton INSTANCE = new Singleton();
    }
    static Singleton getInstance() { return Holder.INSTANCE; }
    // JVM class-loading guarantees safe, lazy, once-only init
}

// Fix 3 (Effective Java): enum singleton
enum Singleton {
    INSTANCE;
    void doWork() { ... }
    // serialization-safe and reflection-safe for free
}</pre>
<p><strong>Why interviewers love it:</strong> it tests whether you understand the Java Memory Model — that <code>null</code>-checks without synchronization give no visibility guarantees, and that object publication is a memory-ordering problem, not a logic problem.</p>
<div class="key-point">Without <code>volatile</code>, instruction reordering can publish the reference before the constructor finishes — another thread sees a non-null, half-built object. Prefer the holder idiom or an enum over hand-rolled double-checked locking.</div>`,
      },
      {
        q: 'What is the Factory Method pattern?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p><strong>Factory Method</strong> moves object creation into a method, often overridden by subclasses, so callers depend on an interface instead of a concrete class. This lets you change what is created without editing client code, which follows the Open/Closed principle. It is useful when the type to create depends on context, or when creation logic should be centralized and named. It creates one product through inheritance, while Abstract Factory creates families of products through composition.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><strong>Factory Method</strong> gom việc tạo object vào một method riêng thay vì rải <code>new</code> khắp nơi; method này thường được lớp con override để quyết định tạo ra kiểu cụ thể nào. Nhờ vậy bên gọi chỉ biết tới interface, không dính tới class cụ thể: muốn đổi loại object được tạo thì không phải sửa code client, đúng tinh thần Open/Closed. Pattern này hợp khi kiểu cần tạo phụ thuộc vào ngữ cảnh (cấu hình, tham số đầu vào), hoặc khi logic khởi tạo phức tạp và cần gom về một chỗ có tên rõ ràng. Điểm phân biệt cần nhớ: Factory Method tạo <em>một</em> loại sản phẩm và dựa trên kế thừa, còn Abstract Factory tạo cả <em>một họ</em> sản phẩm và dựa trên composition.</p></details>
<p><strong>Factory Method</strong> delegates object creation to a method instead of calling constructors directly everywhere.</p>
<pre>interface PaymentGateway {
    void pay(int amount);
}

class StripeGateway implements PaymentGateway {
    public void pay(int amount) {
        System.out.println("Paid by Stripe: " + amount);
    }
}

class PaypalGateway implements PaymentGateway {
    public void pay(int amount) {
        System.out.println("Paid by PayPal: " + amount);
    }
}

class PaymentGatewayFactory {
    public PaymentGateway create(String type) {
        if ("stripe".equalsIgnoreCase(type)) return new StripeGateway();
        if ("paypal".equalsIgnoreCase(type)) return new PaypalGateway();
        throw new IllegalArgumentException("Unknown type");
    }
}

// Usage: the caller depends on the interface, not the concrete class
PaymentGatewayFactory factory = new PaymentGatewayFactory();
PaymentGateway gateway = factory.create("stripe");
gateway.pay(100);   // Paid by Stripe: 100</pre>
<div class="key-point">Use it when creation logic varies and you want calling code to depend on abstractions.</div>`,
      },
      {
        q: 'What is the difference between Factory Method and Abstract Factory?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Both patterns hide object creation, but at different scopes. <strong>Factory Method</strong> creates one product and uses inheritance: a subclass overrides the creator method to pick the concrete type. <strong>Abstract Factory</strong> creates a family of related products and uses composition: a factory object produces a matched set, such as matching buttons and checkboxes for one theme. Use Abstract Factory when several product types must vary together, and Factory Method when only a single product type varies.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Cả hai đều che đi việc <code>new</code> object cụ thể, khác nhau ở quy mô. <strong>Factory Method</strong> tạo <em>một</em> loại sản phẩm và dùng kế thừa: lớp con override method tạo để chọn kiểu cụ thể. <strong>Abstract Factory</strong> tạo <em>cả một họ</em> sản phẩm đi cùng nhau và dùng composition: một object factory sinh ra trọn bộ khớp nhau, ví dụ <code>DarkThemeFactory</code> sinh ra button, checkbox, dialog đều theo tông tối. Chọn Abstract Factory khi nhiều loại object phải đồng bộ với nhau; chọn Factory Method khi chỉ có một loại object cần thay đổi. Cách nhớ nhanh: Abstract Factory thường chính là một tập hợp nhiều Factory Method.</p></details>
<ul>
<li><strong>Factory Method</strong>: creates one product type.</li>
<li><strong>Abstract Factory</strong>: creates a family of related products.</li>
</ul>
<pre>interface Button {
    void render();
}

interface Dialog {
    void open();
}

class LightButton implements Button {
    public void render() { System.out.println("Light Button"); }
}

class LightDialog implements Dialog {
    public void open() { System.out.println("Light Dialog"); }
}

interface UiFactory {
    Button createButton();
    Dialog createDialog();
}

class LightUiFactory implements UiFactory {
    public Button createButton() { return new LightButton(); }
    public Dialog createDialog() { return new LightDialog(); }
}

// Usage: one factory builds a matching family of products
UiFactory factory = new LightUiFactory();
Button button = factory.createButton();
Dialog dialog = factory.createDialog();
button.render();   // Light Button
dialog.open();     // Light Dialog</pre>
<div class="key-point">Abstract Factory is useful when several objects must match, such as a theme-specific button, dialog, and input.</div>`,
      },
      {
        q: 'What is the Builder pattern and why is it useful?',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p><strong>Builder</strong> is useful when a constructor has too many parameters, especially optional ones. It replaces long, unclear constructor calls with named, readable, step-by-step construction. It can run validation in <code>build()</code> and works well with immutable objects, since the object is assembled and then made final. It is not worth it for simple objects with only a few fields, where it just adds extra code.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><strong>Builder</strong> hữu ích khi constructor có quá nhiều tham số, nhất là các tham số tùy chọn. Thay cho lời gọi kiểu <code>new User("Alice", null, null, true, 0)</code> mà không ai hiểu tham số nào là gì, Builder cho phép dựng object theo từng bước có tên rõ ràng như <code>.name("Alice").role("ADMIN").build()</code>. Có thể kiểm tra tính hợp lệ trong <code>build()</code>, và pattern này rất hợp với object bất biến vì mọi giá trị được thu thập trước rồi mới chốt thành object <code>final</code>. Không nên dùng cho object đơn giản chỉ có hai ba field, lúc đó Builder chỉ làm code dài thêm.</p></details>
<p><strong>Builder</strong> constructs complex objects step by step.</p>
<ul>
<li>Improves readability.</li>
<li>Avoids long constructors with many optional arguments.</li>
<li>Works well for immutable objects.</li>
</ul>
<pre>class User {
    private final String name;
    private final String email;
    private final String role;

    private User(Builder builder) {
        this.name = builder.name;
        this.email = builder.email;
        this.role = builder.role;
    }

    public static class Builder {
        private String name;
        private String email;
        private String role = "USER";

        public Builder name(String name) { this.name = name; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder role(String role) { this.role = role; return this; }
        public User build() { return new User(this); }
    }
}

User user = new User.Builder()
    .name("Alice")
    .email("alice@mail.com")
    .role("ADMIN")
    .build();</pre>
<div class="key-point">Builder is ideal when parameter count grows and constructor calls become hard to read safely.</div>`,
      },

      // ──── 3. STRUCTURAL PATTERNS ────
      {
        q: 'What is the Adapter pattern?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p><strong>Adapter</strong> wraps an existing class and translates its interface into the one the client expects, so two incompatible parts can work together without changing either side. It is common when integrating third-party or legacy code, and it also gives a clean seam for testing and for swapping vendors later. Adapter changes an interface without changing behavior, while Decorator keeps the interface but adds behavior, and Facade simplifies a whole subsystem. The main risk is an adapter that lets the wrapped class's quirks leak through.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><strong>Adapter</strong> bọc một class có sẵn và "phiên dịch" interface của nó sang interface mà client đang mong đợi, để hai bên vốn không khớp nhau có thể làm việc chung mà không phải sửa bên nào. Tình huống hay gặp nhất là tích hợp thư viện bên thứ ba hoặc code legacy. Adapter còn tạo ra một đường ranh gọn để mock khi test và để đổi nhà cung cấp về sau, ví dụ chuyển từ Stripe sang PayPal chỉ cần viết adapter mới. Phân biệt với hai pattern hàng xóm: Adapter <em>đổi interface</em> nhưng giữ hành vi, Decorator <em>giữ interface</em> nhưng thêm hành vi, Facade <em>đơn giản hóa</em> cả một subsystem. Rủi ro cần tránh là adapter viết hời hợt, để những đặc tính riêng của class bên trong (kiểu exception, quy ước đơn vị) lọt ra ngoài.</p></details>
<p><strong>Adapter</strong> converts one interface into another interface expected by the client.</p>
<pre>class LegacyPaymentApi {
    void makePayment(int cents) {
        System.out.println("Legacy paid: " + cents);
    }
}

interface PaymentProcessor {
    void pay(int amount);
}

class PaymentAdapter implements PaymentProcessor {
    private final LegacyPaymentApi legacy = new LegacyPaymentApi();

    public void pay(int amount) {
        legacy.makePayment(amount * 100);
    }
}

// Usage: client talks to PaymentProcessor; the adapter calls the legacy API
PaymentProcessor processor = new PaymentAdapter();
processor.pay(50);   // Legacy paid: 5000</pre>
<div class="key-point">Use Adapter when integrating old or third-party APIs without changing the rest of your code.</div>`,
      },
      {
        q: 'What is the Facade pattern?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p><strong>Facade</strong> gives one simple entry point to a complex subsystem, so the client calls a few clean methods instead of coordinating many classes. This reduces coupling, since clients depend on the facade and the internals can be refactored freely behind it. Facade simplifies access but does not hide the internals, Adapter converts one interface to another, and Proxy keeps the same interface to control access. The anti-pattern is a huge facade that collects every operation into one bloated class.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><strong>Facade</strong> cung cấp một cửa vào đơn giản cho một subsystem phức tạp: thay vì client phải tự gọi và phối hợp năm bảy class theo đúng thứ tự, nó chỉ cần gọi một vài method gọn gàng như <code>checkout(item, amount)</code>. Cách này giảm coupling vì client chỉ phụ thuộc vào facade, còn phần bên trong có thể refactor thoải mái mà không ảnh hưởng ra ngoài. Lưu ý Facade chỉ <em>đơn giản hóa cách dùng</em>, không ngăn ai truy cập trực tiếp vào các class bên trong; trong khi Adapter đổi interface này sang interface khác, và Proxy giữ nguyên interface để kiểm soát truy cập. Anti-pattern cần tránh là "facade khổng lồ" gom mọi thao tác của hệ thống vào một class phình to, về bản chất đó là một God Object.</p></details>
<p><strong>Facade</strong> provides a simplified interface over a complex subsystem.</p>
<pre>class InventoryService {
    void reserve(String item) { System.out.println("Reserved " + item); }
}

class PaymentService {
    void charge(int amount) { System.out.println("Charged " + amount); }
}

class EmailService {
    void sendReceipt() { System.out.println("Receipt sent"); }
}

class CheckoutFacade {
    private final InventoryService inventory = new InventoryService();
    private final PaymentService payment = new PaymentService();
    private final EmailService email = new EmailService();

    void checkout(String item, int amount) {
        inventory.reserve(item);
        payment.charge(amount);
        email.sendReceipt();
    }
}

// Usage: one simple call hides the whole subsystem
CheckoutFacade checkout = new CheckoutFacade();
checkout.checkout("Book", 100);   // Reserved Book / Charged 100 / Receipt sent</pre>
<div class="key-point">Facade reduces client complexity and centralizes orchestration.</div>`,
      },
      {
        q: 'What is the Proxy pattern?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p><strong>Proxy</strong> stands in for the real object with the same interface, so the client cannot tell the difference, and it controls access to that object. Common forms are lazy loading of expensive objects, access control, remote calls, and caching or logging. This is how many AOP and framework transaction and security features work. Proxy keeps the same interface and controls access, Decorator keeps the interface but adds behavior, and Adapter changes the interface. A common issue is a proxy that quietly changes performance, such as a lazy proxy triggering unexpected queries.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><strong>Proxy</strong> là một object đứng thay cho object thật, có cùng interface nên client không phân biệt được, nhờ đó nó có thể kiểm soát mọi lời gọi đi qua. Các dạng phổ biến: lazy loading (chỉ tạo object đắt tiền khi thật sự cần), kiểm tra quyền truy cập, gọi từ xa (remote proxy), cache hoặc ghi log. Đây cũng chính là cơ chế đằng sau Spring AOP: <code>@Transactional</code>, <code>@Cacheable</code>, kiểm tra security đều hoạt động nhờ Spring bọc bean của bạn trong một proxy. Phân biệt: Proxy giữ interface và <em>kiểm soát truy cập</em>, Decorator giữ interface nhưng <em>thêm hành vi</em>, Adapter <em>đổi interface</em>. Điểm cần cẩn thận là proxy có thể âm thầm làm đổi hiệu năng; lazy proxy của ORM là ví dụ điển hình gây ra lỗi N+1 query mà nhìn code không thấy.</p></details>
<p><strong>Proxy</strong> keeps the same interface as the real object but controls access to it.</p>
<ul>
<li>Lazy loading</li>
<li>Security checks</li>
<li>Remote calls</li>
<li>Logging or transaction interception</li>
</ul>
<pre>interface Image {
    void display();
}

class RealImage implements Image {
    private final String fileName;

    RealImage(String fileName) {
        this.fileName = fileName;
        System.out.println("Loading " + fileName);
    }

    public void display() {
        System.out.println("Displaying " + fileName);
    }
}

class ImageProxy implements Image {
    private RealImage realImage;
    private final String fileName;

    ImageProxy(String fileName) {
        this.fileName = fileName;
    }

    public void display() {
        if (realImage == null) realImage = new RealImage(fileName);
        realImage.display();
    }
}

// Usage: the real image loads only on the first display (lazy loading)
Image image = new ImageProxy("photo.jpg");   // nothing loaded yet
image.display();   // Loading photo.jpg -> Displaying photo.jpg
image.display();   // Displaying photo.jpg (already loaded)</pre>
<div class="key-point">Spring AOP and many ORM lazy-loading features are classic proxy examples.</div>`,
      },
      {
        q: 'What is the Decorator pattern?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p><strong>Decorator</strong> wraps an object in another object with the same interface and adds behavior, so features can be combined at runtime instead of creating a subclass for every combination. Java's I/O streams are the classic example, such as a <code>BufferedInputStream</code> wrapping a <code>FileInputStream</code>. Each decorator is small and single-purpose, which fits the Single Responsibility and Open/Closed principles. Decorator keeps the interface and adds behavior, unlike Proxy, which controls access, and Adapter, which changes the interface. Deep wrapping chains can be hard to debug.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><strong>Decorator</strong> bọc một object bằng một object khác có cùng interface, rồi thêm hành vi vào trước hoặc sau khi chuyển tiếp lời gọi. Nhờ đó ta có thể kết hợp tính năng lúc runtime bằng cách bọc nhiều lớp, thay vì phải tạo một subclass cho mỗi tổ hợp (có 5 tính năng thì kế thừa cần tới 32 class, còn Decorator chỉ cần 5). Ví dụ kinh điển là Java I/O: <code>new BufferedInputStream(new FileInputStream(file))</code>. Mỗi decorator nhỏ và chỉ làm một việc, đúng tinh thần Single Responsibility và Open/Closed. Phân biệt: Decorator giữ interface và thêm hành vi, Proxy giữ interface nhưng kiểm soát truy cập, Adapter đổi interface. Nhược điểm là khi bọc quá nhiều lớp thì stack trace dài và khó debug.</p></details>
<p><strong>Decorator</strong> adds behavior to an object without changing its class.</p>
<pre>interface Coffee {
    String description();
    int cost();
}

class BasicCoffee implements Coffee {
    public String description() { return "Coffee"; }
    public int cost() { return 50; }
}

class MilkDecorator implements Coffee {
    private final Coffee coffee;

    MilkDecorator(Coffee coffee) {
        this.coffee = coffee;
    }

    public String description() { return coffee.description() + ", Milk"; }
    public int cost() { return coffee.cost() + 10; }
}

// Usage: wrap an object to add behavior at runtime
Coffee coffee = new MilkDecorator(new BasicCoffee());
coffee.description();   // "Coffee, Milk"
coffee.cost();          // 60</pre>
<div class="key-point">Decorator is useful when behavior must be combined flexibly at runtime.</div>`,
      },
      {
        q: 'What is the difference between Adapter, Facade, and Proxy patterns?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>Adapter, Facade, and Proxy all wrap another object, but for different reasons. <strong>Adapter</strong> changes an interface so an incompatible class fits what the client expects. <strong>Facade</strong> puts one simple interface over a whole complex subsystem. <strong>Proxy</strong> keeps the same interface and controls access, for example lazy loading, caching, or security.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Ba pattern này đều là "bọc một object khác", nên câu hỏi bẫy nằm ở chỗ <em>bọc để làm gì</em>. <strong>Adapter</strong> bọc để đổi interface: class có sẵn không khớp với cái client cần, adapter đứng giữa để phiên dịch. <strong>Facade</strong> bọc để đơn giản hóa: gom nhiều class của một subsystem phức tạp lại sau một vài method dễ dùng. <strong>Proxy</strong> bọc nhưng giữ nguyên interface, mục đích là kiểm soát truy cập tới object thật, như lazy loading, cache, kiểm tra quyền. Tóm gọn: Adapter = lệch interface, Facade = quá phức tạp, Proxy = cần kiểm soát.</p></details>
<p>All three wrap another object, but for <strong>different reasons</strong>:</p>
<table><tr><th>Pattern</th><th>Purpose</th><th>Interface</th><th>Example</th></tr>
<tr><td><strong>Adapter</strong></td><td>Convert incompatible interface</td><td>Changes interface</td><td>Legacy API → new interface</td></tr>
<tr><td><strong>Facade</strong></td><td>Simplify complex subsystem</td><td>New simplified interface</td><td>checkout() wraps 5 services</td></tr>
<tr><td><strong>Proxy</strong></td><td>Control access to real object</td><td>Same interface as real</td><td>Lazy load, security check, caching</td></tr></table>
<pre>// Adapter: makes incompatible interface compatible
class OldPaymentAdapter implements NewPaymentInterface {
    private OldPaymentSystem old;
    void pay(Money m) { old.makePayment(m.toCents()); } // adapts interface
}

// Facade: simplifies multiple subsystems
class OrderFacade {
    void placeOrder() {
        inventoryService.reserve();  // hides complexity
        paymentService.charge();     // of multiple services
        emailService.notify();       // behind one method
    }
}

// Proxy: same interface, adds behavior
class CachingUserProxy implements UserService {
    private UserService real;
    User getUser(int id) {
        if (cache.has(id)) return cache.get(id);  // adds caching
        return real.getUser(id);                    // same interface
    }
}</pre>
<div class="key-point">Trick question tip: If asked "which pattern wraps another object?" — all three do! The difference is WHY: Adapter = interface mismatch, Facade = simplification, Proxy = access control.</div>`,
      },

      // ──── 4. BEHAVIORAL PATTERNS ────
      {
        q: 'What is the Strategy pattern and when do you use it?',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p><strong>Strategy</strong> puts a group of interchangeable algorithms behind one interface, so the behavior can be chosen or swapped at runtime. Its main value is removing large <code>if/else</code> or <code>switch</code> chains: each branch becomes its own class, so adding a behavior means adding a class instead of editing existing code. Each algorithm is also easy to test on its own. In modern languages a strategy can simply be a function or lambda. In Strategy the client picks the behavior, while in State the object changes its own behavior over its lifecycle.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><strong>Strategy</strong> gom một nhóm thuật toán có thể thay thế cho nhau vào sau một interface chung, để chọn hoặc đổi thuật toán lúc runtime. Giá trị thực tế lớn nhất là dọn sạch những chuỗi <code>if/else</code> hay <code>switch</code> dài ngoằng kiểu "nếu là khách VIP thì giảm 10%, nếu là ngày lễ thì giảm 20%...": mỗi nhánh thành một class riêng, thêm quy tắc mới là thêm class chứ không đụng vào code cũ, và từng thuật toán test độc lập được. Trong Java 8+ hay TypeScript, một strategy nhiều khi chỉ cần là một lambda truyền vào, không cần đủ bộ class. Phân biệt với State: ở Strategy thì <em>client</em> chọn hành vi, còn ở State thì <em>object tự</em> đổi hành vi theo vòng đời của nó.</p></details>
<p><strong>Strategy</strong> encapsulates interchangeable algorithms behind a common interface.</p>
<pre>interface DiscountStrategy {
    double apply(double price);
}

class MemberDiscount implements DiscountStrategy {
    public double apply(double price) { return price * 0.9; }
}

class HolidayDiscount implements DiscountStrategy {
    public double apply(double price) { return price * 0.8; }
}

class CheckoutService {
    private final DiscountStrategy strategy;

    CheckoutService(DiscountStrategy strategy) {
        this.strategy = strategy;
    }

    double total(double price) {
        return strategy.apply(price);
    }
}

// Usage: choose the algorithm at runtime and swap it freely
CheckoutService checkout = new CheckoutService(new MemberDiscount());
checkout.total(100);   // 90.0
checkout = new CheckoutService(new HolidayDiscount());
checkout.total(100);   // 80.0</pre>
<div class="key-point">Strategy is great for removing large if/else blocks around changing business rules.</div>`,
      },
      {
        q: 'What is the difference between Strategy and State?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Strategy and State look almost the same in structure: an object delegates to a swappable behavior interface. The difference is intent. <strong>Strategy</strong> is about choosing one of several interchangeable algorithms, and the client picks it; the strategies do not change themselves. <strong>State</strong> is about an object behaving differently based on its current lifecycle state, and the states drive their own transitions, such as a document moving from draft to review to published.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Về cấu trúc thì hai pattern gần như giống hệt: một object giữ tham chiếu tới một interface hành vi và ủy quyền cho nó. Khác biệt nằm ở <em>ý định</em> và <em>ai là người đổi hành vi</em>. <strong>Strategy</strong>: có nhiều thuật toán tương đương, client chọn một cái phù hợp rồi truyền vào; các strategy không biết gì về nhau và không tự chuyển đổi. <strong>State</strong>: object hành xử khác nhau tùy trạng thái hiện tại trong vòng đời, và chính các state quyết định bước chuyển tiếp, ví dụ Order đi từ Created sang Paid rồi Shipped, mỗi state biết state kế tiếp là gì. Mẹo nhận biết: nếu hành vi đổi theo <em>chuyển trạng thái</em> của chính object thì đó là State; nếu đổi theo <em>lựa chọn từ bên ngoài</em> thì đó là Strategy.</p></details>
<ul>
<li><strong>Strategy</strong>: choose one behavior among alternatives.</li>
<li><strong>State</strong>: behavior changes based on current lifecycle state.</li>
</ul>
<pre>// Strategy: chosen from outside
CheckoutService checkout = new CheckoutService(new MemberDiscount());

// State: behavior changes inside the object
interface OrderState {
    void next(Order order);
}

class CreatedState implements OrderState {
    public void next(Order order) {
        order.setState(new PaidState());
    }
}

class PaidState implements OrderState {
    public void next(Order order) {
        System.out.println("Ship order");
    }
}

class Order {
    private OrderState state = new CreatedState();
    void setState(OrderState state) { this.state = state; }
    void next() { state.next(this); }
}

// Usage: the object changes its OWN behavior as it transitions
Order order = new Order();   // starts in CreatedState
order.next();                // CreatedState -> becomes PaidState
order.next();                // PaidState -> prints "Ship order"</pre>
<div class="key-point">If behavior depends on object lifecycle transitions, it is usually State, not Strategy.</div>`,
      },
      {
        q: 'What is the Observer pattern?',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p><strong>Observer</strong> sets up a one-to-many notification: a subject keeps a list of observers and notifies them when its state changes, so they stay in sync without the subject knowing their concrete types. It is the basis of event listeners, UI data binding, and reactive frameworks. Common problems are memory leaks from observers that never unsubscribe, and heavy work done during notification. Observer runs in-process with direct references, while Pub/Sub uses a broker to fully decouple senders and receivers.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><strong>Observer</strong> thiết lập quan hệ một-nhiều: một subject giữ danh sách observer và tự thông báo cho tất cả khi trạng thái của nó thay đổi, mà không cần biết observer cụ thể là kiểu gì. Đây là nền móng của event listener trong UI, data binding, và các framework reactive như RxJava. Hai lỗi hay gặp trong thực tế: rò rỉ bộ nhớ vì observer quên hủy đăng ký (subject còn giữ tham chiếu nên GC không thu hồi được), và xử lý nặng ngay trong hàm nhận thông báo làm chậm cả subject. Phân biệt với Pub/Sub: Observer chạy trong cùng tiến trình và subject gọi thẳng observer, còn Pub/Sub có broker ở giữa nên hai bên hoàn toàn không biết nhau.</p></details>
<p><strong>Observer</strong> defines a one-to-many dependency so observers are notified when subject state changes.</p>
<pre>interface Observer {
    void update(String event);
}

class EmailObserver implements Observer {
    public void update(String event) {
        System.out.println("Email received: " + event);
    }
}

class OrderSubject {
    private final java.util.List&lt;Observer&gt; observers = new java.util.ArrayList&lt;&gt;();

    void addObserver(Observer observer) {
        observers.add(observer);
    }

    void notifyObservers(String event) {
        for (Observer observer : observers) {
            observer.update(event);
        }
    }
}

// Usage: the subject notifies every registered observer
OrderSubject subject = new OrderSubject();
subject.addObserver(new EmailObserver());
subject.notifyObservers("Order shipped");   // Email received: Order shipped</pre>
<div class="key-point">Observer is common in UI events and in-process event systems.</div>`,
      },
      {
        q: 'What is the difference between Observer and Pub/Sub?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Observer and Pub/Sub share the same idea of notifying interested parties, but differ in coupling and scope. <strong>Observer</strong> runs inside one application: the subject holds direct references to its observers and calls them synchronously. <strong>Pub/Sub</strong> puts a broker in the middle: publishers send to a topic and subscribers listen on it, and the two never know about each other, often across processes and asynchronously. Pub/Sub adds broker infrastructure, delivery guarantees, and eventual consistency.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Hai pattern cùng ý tưởng "có gì mới thì báo cho bên quan tâm", nhưng khác hẳn về mức độ tách rời và phạm vi. <strong>Observer</strong> nằm trong một ứng dụng: subject giữ tham chiếu trực tiếp tới observer và gọi chúng đồng bộ, ngay trong cùng thread. <strong>Pub/Sub</strong> có broker (Kafka, RabbitMQ...) đứng giữa: publisher chỉ đẩy message vào topic, subscriber chỉ lắng nghe topic, hai bên không hề biết nhau, thường chạy ở tiến trình khác nhau và bất đồng bộ. Đổi lại Pub/Sub kéo theo hạ tầng broker phải vận hành, các vấn đề về đảm bảo giao message (at-least-once, thứ tự) và eventual consistency. Nói ngắn: Observer là pattern trong code, Pub/Sub là kiến trúc messaging.</p></details>
<ul>
<li><strong>Observer</strong>: in-process object pattern.</li>
<li><strong>Pub/Sub</strong>: distributed messaging architecture using a broker.</li>
</ul>
<pre>// Observer: direct in-memory subscription
OrderSubject subject = new OrderSubject();
subject.addObserver(new EmailObserver());
subject.notifyObservers("Order shipped");

// Pub/Sub: publisher talks to broker, not direct subscribers
class EventBus {
    void publish(String topic, String event) {
        System.out.println("Published to " + topic + ": " + event);
    }
}

new EventBus().publish("orders", "OrderShipped");</pre>
<div class="key-point">They are similar in idea but very different in runtime, scalability, and failure behavior.</div>`,
      },
      {
        q: 'What is the Template Method pattern?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p><strong>Template Method</strong> defines the fixed steps of an algorithm in a base class and lets subclasses fill in specific steps through overridable hooks. The overall sequence stays the same, and only the varying steps change. It suits frameworks, such as a base test runner with setup, run, and teardown, or a pipeline where only one step differs. Because it is based on inheritance, it carries the coupling and fragile-base-class risks of inheritance, so Strategy with composition is often a more flexible modern choice.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><strong>Template Method</strong> cố định khung xương của một thuật toán trong lớp cha (thứ tự các bước là bất biến) và chừa lại một số bước dưới dạng method abstract hay hook để lớp con tự điền. Ví dụ lớp cha định nghĩa <code>process() = read() → transform() → save()</code>, lớp con <code>CsvProcessor</code> chỉ cần viết <code>read()</code> và <code>transform()</code> theo kiểu CSV. Pattern này rất hay gặp trong framework: test runner với setup/run/teardown, hay <code>JdbcTemplate</code> của Spring. Vì dựa trên kế thừa nên nó mang theo mọi nhược điểm của kế thừa (coupling chặt, fragile base class), do đó ngày nay người ta thường thay bằng Strategy kết hợp composition, hoặc đơn giản là truyền lambda vào.</p></details>
<p><strong>Template Method</strong> defines the skeleton of an algorithm in a base class while subclasses customize steps.</p>
<pre>abstract class FileProcessor {
    public final void process() {
        read();
        transform();
        save();
    }

    abstract void read();
    abstract void transform();

    void save() {
        System.out.println("Saved file");
    }
}

class CsvProcessor extends FileProcessor {
    void read() { System.out.println("Read CSV"); }
    void transform() { System.out.println("Transform CSV"); }
}

// Usage: the base class fixes the steps and their order
FileProcessor processor = new CsvProcessor();
processor.process();   // Read CSV -> Transform CSV -> Saved file</pre>
<div class="key-point">Use Template Method when the algorithm flow stays stable but some steps vary.</div>`,
      },
      {
        q: 'What is the Chain of Responsibility pattern?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p><strong>Chain of Responsibility</strong> passes a request along a line of handlers, and each one either handles it or passes it on. This decouples the sender from whoever finally handles the request and lets the chain be reordered easily. Middleware pipelines, servlet filters, and HTTP interceptors are everyday examples, with steps like auth, logging, and validation. A request can reach the end unhandled, so a default or clear ending is needed, and long chains hurt debugging and performance.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><strong>Chain of Responsibility</strong> nối các handler thành một chuỗi rồi cho request đi lần lượt qua từng mắt xích; mỗi handler tự quyết định xử lý, chuyển tiếp, hay dừng lại. Bên gửi không cần biết cuối cùng ai xử lý, và ta có thể thêm bớt hay đổi thứ tự handler mà không đụng tới code khác. Bạn dùng nó hằng ngày mà có thể không nhận ra: middleware của Express, servlet filter, interceptor của Spring MVC, với các bước xác thực, ghi log, validate nối tiếp nhau. Hai điểm cần lưu ý: request có thể đi hết chuỗi mà không ai xử lý nên phải có handler mặc định hoặc điểm kết thúc rõ ràng, và chuỗi quá dài sẽ vừa khó debug vừa tốn hiệu năng.</p></details>
<p><strong>Chain of Responsibility</strong> passes a request through a chain of handlers until one handles it or the chain ends.</p>
<pre>abstract class Handler {
    private Handler next;

    public Handler linkWith(Handler next) {
        this.next = next;
        return next;
    }

    public void handle(String request) {
        process(request);
        if (next != null) next.handle(request);
    }

    protected abstract void process(String request);
}

class AuthHandler extends Handler {
    protected void process(String request) {
        System.out.println("Auth check: " + request);
    }
}

class AuditHandler extends Handler {
    protected void process(String request) {
        System.out.println("Audit log: " + request);
    }
}

// Usage: link the handlers, then send a request down the chain
Handler chain = new AuthHandler();
chain.linkWith(new AuditHandler());
chain.handle("GET /orders");   // Auth check: GET /orders -> Audit log: GET /orders</pre>
<div class="key-point">HTTP middleware and servlet filters are common real-world examples.</div>`,
      },

      // ──── 5. ENTERPRISE / ARCHITECTURAL PATTERNS ────
      {
        q: 'What is the Repository pattern?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p><strong>Repository</strong> puts a collection-like interface in front of storage, so the domain calls methods like <code>orders.findById()</code> instead of using SQL or an ORM directly. This decouples business logic from storage and makes it easy to use a fake in tests. It is often overused: wrapping a mature ORM that already provides this pattern can be redundant. It is most valuable with real domain logic, multiple data sources, or DDD aggregates. A generic repository with a large leaky query API just re-exposes the ORM and adds little value.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><strong>Repository</strong> đặt một interface trông như một collection trong bộ nhớ lên trước tầng lưu trữ: tầng domain chỉ gọi <code>orders.findById(id)</code> hay <code>orders.save(order)</code>, không cần biết bên dưới là SQL, JPA hay MongoDB. Nhờ đó logic nghiệp vụ tách khỏi chi tiết lưu trữ, và khi test chỉ cần cắm một repository giả chạy trong bộ nhớ. Điểm cần thẳng thắn: pattern này hay bị dùng thừa. Spring Data JPA về bản chất đã là Repository rồi, bọc thêm một lớp nữa nhiều khi chỉ là sao chép method. Nó đáng giá nhất khi có logic domain thật sự, khi phải gom dữ liệu từ nhiều nguồn, hoặc khi làm theo DDD với aggregate. Còn một generic repository với đủ kiểu method query lộ hết cấu trúc bên dưới thì thực ra chỉ là ORM đội cái tên khác.</p></details>
<p><strong>Repository</strong> abstracts data access behind a collection-like interface, decoupling business logic from persistence details.</p>
<pre>// Without Repository: business logic knows about JPA
entityManager.createQuery("SELECT u FROM User u WHERE u.email = :email")
    .setParameter("email", email)
    .getSingleResult();

// With Repository: clean abstraction
interface UserRepository {
    Optional&lt;User&gt; findByEmail(String email);
    List&lt;User&gt; findByRole(String role);
    void save(User user);
    void delete(User user);
}

class JpaUserRepository implements UserRepository {
    private final EntityManager em;

    public Optional&lt;User&gt; findByEmail(String email) {
        return em.createQuery("SELECT u FROM User u WHERE u.email = :email", User.class)
            .setParameter("email", email)
            .getResultStream().findFirst();
    }
    // ...
}

// Business logic only depends on interface:
class UserService {
    private final UserRepository repo; // can swap JPA → MongoDB → in-memory

    User register(String email) {
        if (repo.findByEmail(email).isPresent()) throw new DuplicateEmailException();
        User user = new User(email);
        repo.save(user);
        return user;
    }
}</pre>
<div class="key-point">Repository makes business logic testable (inject a fake repo in tests) and allows swapping persistence technology without changing domain code. Spring Data JPA auto-generates repository implementations.</div>`,
      },

      // ──── 6. ANTI-PATTERNS & WHEN NOT TO USE A PATTERN ────
      {
        q: 'What is the Anemic Domain Model anti-pattern?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>An anemic domain model is when domain objects hold only data with getters and setters, and all the logic lives in service classes. It looks object-oriented but is really procedural, because it exposes all state and spreads the rules across services instead of protecting them. The fix is a rich model where an entity such as <code>Order</code> can <code>cancel()</code> itself and guards its own invariants. This is fine for simple CRUD apps and only matters when there is real business complexity.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Anemic Domain Model (thuật ngữ của Martin Fowler) là khi các object domain chỉ là túi chứa dữ liệu với getter/setter, còn toàn bộ quy tắc nghiệp vụ nằm hết trong các class Service. Nhìn thì tưởng hướng đối tượng nhưng thật ra là lập trình thủ tục khoác áo OOP: state bị phơi bày hoàn toàn, ai cũng có thể gọi <code>order.setStatus("CANCELLED")</code> lên một đơn đã giao, và quy tắc kiểm tra rải rác ở nhiều service nên rất dễ bị bỏ sót. Hướng khắc phục là "rich domain model": entity như <code>Order</code> tự có method <code>cancel()</code>, tự kiểm tra điều kiện và tự bảo vệ invariant của mình, không có setter công khai cho status. Tuy vậy cần nói rõ trong phỏng vấn: với ứng dụng CRUD đơn giản thì anemic model hoàn toàn chấp nhận được, chỉ khi nghiệp vụ thực sự phức tạp thì rich model mới đáng công.</p></details>
<p>An <strong>Anemic Domain Model</strong> (named by Martin Fowler) is when your "domain objects" are just getter/setter bags with zero behavior, and ALL business logic lives in service classes. It looks object-oriented but is procedural code wearing an OO costume.</p>
<pre>// ANEMIC: the entity knows nothing, the service knows everything
class Order {                       // just a data bag
    private String status;
    private List&lt;OrderLine&gt; lines;
    // getters and setters... that's it
}

class OrderService {
    void cancel(Order order) {
        // business rules scattered in the service layer:
        if (order.getStatus().equals("SHIPPED"))
            throw new IllegalStateException("too late");
        order.setStatus("CANCELLED");     // anyone can also just
    }                                     // call setStatus("X")!
}
// Problem: NOTHING stops other code from doing
// order.setStatus("CANCELLED") on a shipped order.
// The invariant lives in one service method, hopefully.</pre>
<pre>// RICH domain model: the entity protects its own invariants
class Order {
    private OrderStatus status;
    private final List&lt;OrderLine&gt; lines = new ArrayList&lt;&gt;();

    public void cancel() {
        if (status == OrderStatus.SHIPPED)
            throw new OrderAlreadyShippedException(id);
        this.status = OrderStatus.CANCELLED;
        registerEvent(new OrderCancelled(id));
    }
    public Money total() {
        return lines.stream().map(OrderLine::subtotal)
                    .reduce(Money.ZERO, Money::add);
    }
    // NO setStatus()! Invalid states are unrepresentable.
}
// The service shrinks to orchestration:
//   load → order.cancel() → save → publish events</pre>
<p><strong>Why it matters:</strong> with anemic models, invariants are enforced "by convention" across many services — each new code path is a chance to corrupt state. A rich model makes the compiler enforce them: there is simply no public mutator that allows an illegal transition.</p>
<p><strong>Why it's debated (say this in the interview):</strong></p>
<ul>
<li>For <strong>simple CRUD</strong> apps, anemic + services is honest and fine — don't force ceremony onto forms-over-data.</li>
<li>Logic spanning many aggregates genuinely belongs in domain services.</li>
<li>Some ORMs and serializers push you toward no-arg constructors and setters; rich models take deliberate effort.</li>
</ul>
<div class="key-point">Anemic models scatter invariants across services where any caller can bypass them; rich models make illegal states unrepresentable — but judge by complexity: rich domain for complex business rules, plain CRUD for plain CRUD.</div>`,
      },
      {
        q: 'What is a God Object, and what does the Law of Demeter say about train wrecks?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>A God Object is a class that knows and does too much, so everything depends on it, it is hard to test, and every change touches it. It is the clearest violation of single responsibility. The Law of Demeter says a method should only talk to its direct neighbors, which targets train wrecks like <code>order.getCustomer().getAddress().getCity()</code> that couple code to the whole object structure. The fix for both is tell, don't ask: give objects behavior instead of reaching into their internals, though plain data objects and fluent builders may chain freely.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><strong>God Object</strong> là một class biết quá nhiều và làm quá nhiều, kiểu <code>AppManager</code> hay một <code>OrderService</code> bốn nghìn dòng vừa tính giá, vừa trừ kho, vừa gửi mail. Mọi thứ đều phụ thuộc vào nó, mọi thay đổi đều đi qua nó, test gần như bất khả thi; đây là dạng vi phạm Single Responsibility rõ nhất. <strong>Law of Demeter</strong> ("chỉ nói chuyện với bạn thân") yêu cầu một method chỉ gọi method trên field của mình, tham số của mình, hoặc object nó tự tạo, không gọi tiếp lên object được trả về từ object khác. Dấu hiệu vi phạm là các "train wreck" như <code>order.getCustomer().getAddress().getCity()</code>: code đang ràng buộc vào toàn bộ cấu trúc chuỗi object, đổi một mắt xích là vỡ hết. Cách chữa chung cho cả hai là nguyên tắc "tell, don't ask": đưa hành vi về nơi có dữ liệu, ví dụ <code>order.getShippingCity()</code>. Lưu ý Demeter chỉ áp dụng cho object có hành vi; chain trên DTO, fluent builder hay Stream API thì hoàn toàn bình thường.</p></details>
<p>Two related coupling smells that interviewers probe together.</p>
<p><strong>God Object</strong>: one class that knows too much and does too much — <code>AppManager</code>, <code>Utils</code>, a 4000-line <code>OrderService</code> touching pricing, inventory, email, and PDF generation. Every change routes through it, so it has maximal merge conflicts, untestable constructor dependencies, and no single reason to change (violates SRP by definition).</p>
<p><strong>Law of Demeter</strong> ("only talk to your immediate friends"): a method should call methods on its own fields, its parameters, and objects it creates — not on objects <em>returned by</em> those objects. Violations look like train wrecks:</p>
<pre>// Train wreck — coupled to the STRUCTURE of three objects:
if (customer.getWallet().getPrimaryCard().getExpiry()
            .isBefore(LocalDate.now())) {
    // ...
}
// This code breaks if: Wallet is renamed, a customer can have
// no wallet (NPE!), cards move to a payment service, expiry
// becomes a range... You've hard-coded a path through the
// object graph: customer → wallet → card → expiry.

// Tell, don't ask — push the question to where the data lives:
if (customer.hasExpiredPaymentMethod()) { ... }

class Customer {
    boolean hasExpiredPaymentMethod() {
        return wallet != null && wallet.hasExpiredCard();
    }
}
class Wallet {
    boolean hasExpiredCard() {
        return primaryCard != null && primaryCard.isExpired();
    }
}
// Each class asks only its DIRECT neighbor one question.
// Restructure the graph → only one class changes.</pre>
<p><strong>Why the two smells feed each other:</strong> a God Object is usually built <em>from</em> train wrecks — since it reaches through everyone's internals, all logic gravitates into it. Applying tell-don't-ask redistributes behavior to the objects that own the data, which is exactly how you dismantle a God Object: identify field clusters used by disjoint method groups, extract them, and <em>move the behavior with the data</em>.</p>
<p><strong>Nuance to volunteer:</strong> Demeter applies to <em>objects with behavior</em>, not plain data. Chaining through a DTO, a fluent builder, or a Stream pipeline (<code>list.stream().filter().map()</code>) is fine — those return new values, they don't expose a neighbor's internal structure.</p>
<div class="key-point">Train wrecks couple you to the shape of the whole object graph; tell-don't-ask moves behavior next to its data — the same move that breaks up God Objects. But don't cargo-cult it: fluent APIs and DTO chains are not Demeter violations.</div>`,
      },
      {
        q: 'When should you NOT use a design pattern?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>Design patterns are shared vocabulary, not goals, and each one adds indirection that has a lasting readability and maintenance cost. Do not use a pattern until the problem it solves actually appears, since adding flexibility for change that never comes is wasted effort (YAGNI). Speculative generality makes simple code hard to follow. Write the simplest thing that works, and refactor toward a pattern when a second or third real variation forces it.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Design pattern là ngôn ngữ chung để trao đổi thiết kế, không phải mục tiêu phải đạt. Mỗi pattern đều thêm một tầng gián tiếp, và cái giá về khả năng đọc hiểu phải trả mãi về sau. Đừng đưa pattern vào khi vấn đề nó giải quyết chưa xuất hiện: một câu <code>switch</code> với hai nhánh ổn định dễ đọc hơn hẳn bộ Strategy + Factory rải ra bốn file. Xây sẵn tính linh hoạt cho những thay đổi có thể chẳng bao giờ tới là lãng phí (YAGNI), và kiểu "tổng quát hóa theo suy đoán" này biến code đơn giản thành mê cung. Cũng đừng quên nhiều pattern đã được ngôn ngữ giải quyết sẵn: Strategy chỉ là một lambda, Singleton chỉ là scope của DI container. Nguyên tắc thực dụng: viết cách đơn giản nhất chạy được, rồi chỉ refactor sang pattern khi biến thể thực tế thứ hai hoặc thứ ba xuất hiện và buộc bạn phải làm.</p></details>
<p>A favorite senior filter-question. The wrong answer is a blank stare; the right answer is that <strong>patterns are vocabulary, not goals</strong> — each one buys flexibility by adding indirection, and indirection has a permanent readability cost.</p>
<pre>// Resume-driven design: a Strategy/Factory layer-cake...
interface DiscountStrategy { BigDecimal apply(BigDecimal price); }
class RegularDiscountStrategy implements DiscountStrategy { ... }
class PremiumDiscountStrategy implements DiscountStrategy { ... }
class DiscountStrategyFactory {
    static DiscountStrategy create(CustomerType type) { ... }
}
class DiscountContext {
    private DiscountStrategy strategy;  // 4 files, 2 indirections
    ...
}

// ...for logic that was, and will remain, this:
BigDecimal discount(CustomerType type, BigDecimal price) {
    switch (type) {
        case PREMIUM: return price.multiply(new BigDecimal("0.10"));
        case REGULAR: return price.multiply(new BigDecimal("0.05"));
        default:      return BigDecimal.ZERO;
    }
}
// Two stable cases. The switch is readable in 5 seconds.
// The pattern version makes readers chase 4 files to learn
// the same thing — and both versions change the same amount
// of code when a rule changes.</pre>
<p><strong>Don't reach for a pattern when:</strong></p>
<ul>
<li><strong>The axis of change is speculative</strong> — YAGNI. Flexibility for changes that never come is pure cost. Refactor <em>to</em> a pattern when the third variant actually arrives ("Rule of Three").</li>
<li><strong>The pattern is bigger than the problem</strong> — an if/else beats a Strategy for 2 stable branches; a constructor with named parameters beats a Builder for 3 fields.</li>
<li><strong>The language already solved it</strong> — Strategy is just a lambda/function parameter in Java 8+/TypeScript; Observer is built into every event system; Singleton is a DI-container scope.</li>
<li><strong>You're pattern-matching the name, not the forces</strong> — patterns are solutions to specific tensions; applying one without the tension is cargo culting.</li>
</ul>
<p><strong>How to frame it:</strong> patterns emerged as <em>descriptions</em> of good solutions, not prescriptions. Their biggest everyday value is communication — saying "this is a decorator" compresses a design conversation. Interviewers often follow up with: "show me a pattern you removed." Have a story.</p>
<div class="key-point">Every pattern trades readability for flexibility along one axis of change — if that axis never changes, you paid the cost for nothing. Write the simple thing; refactor to the pattern when the second or third real variant shows up.</div>`,
      },
    ],
  },
];
