// Interview data: DESIGN PATTERNS
import type { PvTopic } from '../../types';

export const topics: PvTopic[] = [
  {
    id: 'design-patterns',
    name: 'Design Patterns',
    icon: '🧩',
    questions: [
      {
        q: 'What is a design pattern and why does it matter?',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>A <strong>design pattern</strong> is a named, reusable solution to a common design problem. Patterns also act as a shared vocabulary, so a short name can describe a whole design to other developers. They are tools, not goals: each one adds indirection that can hurt readability, so using them everywhere makes code worse. A pattern is best used only when a real need for change or flexibility actually appears.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><strong>Design pattern</strong> là một giải pháp có tên gọi, tái sử dụng được cho một vấn đề thiết kế phổ biến. Pattern còn đóng vai trò như một vốn từ chung, nên chỉ một cái tên ngắn cũng có thể mô tả cả một thiết kế cho lập trình viên khác hiểu. Chúng là công cụ chứ không phải mục tiêu: mỗi pattern thêm một lớp gián tiếp có thể làm giảm khả năng đọc hiểu, nên dùng bừa ở mọi nơi sẽ khiến code tệ hơn. Một pattern dùng tốt nhất chỉ khi thực sự xuất hiện nhu cầu về thay đổi hay linh hoạt.</p></details>
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
        q: 'What is the Singleton pattern and what are its risks?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p><strong>Singleton</strong> makes sure only one instance of a class exists, with a global access point. It has real pitfalls: thread safety during lazy creation, and being broken through reflection or serialization. The deeper problem is that it is global mutable state, which hides dependencies and makes testing hard. In most cases it is better to keep a single instance managed by a DI container and inject it as a normal dependency.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><strong>Singleton</strong> đảm bảo chỉ có đúng một instance của một class tồn tại, kèm một điểm truy cập toàn cục. Nó có những cạm bẫy thực sự: an toàn luồng (thread safety) khi khởi tạo lười (lazy), và bị phá vỡ qua reflection hoặc serialization. Vấn đề sâu xa hơn là nó là trạng thái toàn cục có thể thay đổi (global mutable state), khiến các phụ thuộc bị ẩn đi và khó test. Trong hầu hết trường hợp, tốt hơn nên để một instance duy nhất do DI container quản lý và inject nó như một dependency bình thường.</p></details>
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
        q: 'What is the Factory Method pattern?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p><strong>Factory Method</strong> moves object creation into a method, often overridden by subclasses, so callers depend on an interface instead of a concrete class. This lets you change what is created without editing client code, which follows the Open/Closed principle. It is useful when the type to create depends on context, or when creation logic should be centralized and named. It creates one product through inheritance, while Abstract Factory creates families of products through composition.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><strong>Factory Method</strong> chuyển việc tạo object vào trong một method, thường được subclass override, nên bên gọi phụ thuộc vào một interface thay vì một class cụ thể. Điều này cho phép thay đổi thứ được tạo ra mà không phải sửa code client, đúng theo nguyên tắc Open/Closed. Nó hữu ích khi kiểu cần tạo phụ thuộc vào ngữ cảnh, hoặc khi muốn tập trung và đặt tên cho logic tạo object. Nó tạo một loại sản phẩm thông qua kế thừa, còn Abstract Factory tạo cả một họ sản phẩm thông qua composition.</p></details>
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
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Cả hai pattern đều che giấu việc tạo object, nhưng ở phạm vi khác nhau. <strong>Factory Method</strong> tạo một sản phẩm và dùng kế thừa: một subclass override method tạo để chọn kiểu cụ thể. <strong>Abstract Factory</strong> tạo cả một họ sản phẩm liên quan và dùng composition: một object factory tạo ra một bộ khớp nhau, chẳng hạn button và checkbox khớp nhau cho một theme. Dùng Abstract Factory khi nhiều loại sản phẩm phải thay đổi cùng nhau, và dùng Factory Method khi chỉ một loại sản phẩm thay đổi.</p></details>
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
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><strong>Builder</strong> hữu ích khi một constructor có quá nhiều tham số, đặc biệt là tham số tùy chọn. Nó thay những lời gọi constructor dài dòng, khó hiểu bằng cách xây dựng theo từng bước có tên rõ ràng và dễ đọc. Nó có thể chạy validation trong <code>build()</code> và hợp với các object bất biến (immutable), vì object được lắp ráp xong rồi mới chốt lại. Nó không đáng dùng cho những object đơn giản chỉ có vài field, khi mà nó chỉ làm thêm code.</p></details>
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
      {
        q: 'What is the Strategy pattern and when do you use it?',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p><strong>Strategy</strong> puts a group of interchangeable algorithms behind one interface, so the behavior can be chosen or swapped at runtime. Its main value is removing large <code>if/else</code> or <code>switch</code> chains: each branch becomes its own class, so adding a behavior means adding a class instead of editing existing code. Each algorithm is also easy to test on its own. In modern languages a strategy can simply be a function or lambda. In Strategy the client picks the behavior, while in State the object changes its own behavior over its lifecycle.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><strong>Strategy</strong> đặt một nhóm thuật toán có thể hoán đổi cho nhau đằng sau một interface, nên hành vi có thể được chọn hoặc thay đổi lúc runtime. Giá trị chính của nó là loại bỏ những chuỗi <code>if/else</code> hoặc <code>switch</code> dài: mỗi nhánh trở thành một class riêng, nên thêm một hành vi nghĩa là thêm một class thay vì sửa code cũ. Mỗi thuật toán cũng dễ test độc lập. Trong các ngôn ngữ hiện đại, một strategy đơn giản có thể chỉ là một hàm hoặc lambda. Trong Strategy thì client chọn hành vi, còn trong State thì object tự thay đổi hành vi của mình theo vòng đời.</p></details>
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
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Strategy và State trông gần như giống hệt nhau về cấu trúc: một object ủy thác cho một interface hành vi có thể hoán đổi. Khác biệt nằm ở ý định. <strong>Strategy</strong> là chọn một trong nhiều thuật toán có thể hoán đổi cho nhau, và client là bên chọn; các strategy không tự thay đổi chúng. <strong>State</strong> là object hành xử khác nhau tùy theo trạng thái vòng đời hiện tại, và chính các state điều khiển những chuyển đổi của mình, chẳng hạn một document đi từ draft sang review rồi sang published.</p></details>
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
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><strong>Observer</strong> thiết lập một cơ chế thông báo một-nhiều: một subject giữ danh sách các observer và thông báo cho chúng khi trạng thái của nó thay đổi, để chúng luôn đồng bộ mà subject không cần biết kiểu cụ thể của chúng. Đây là nền tảng của event listener, data binding trong UI và các framework reactive. Những vấn đề thường gặp là rò rỉ bộ nhớ do observer không bao giờ hủy đăng ký, và việc xử lý nặng ngay trong lúc thông báo. Observer chạy trong cùng tiến trình với tham chiếu trực tiếp, còn Pub/Sub dùng một broker để tách rời hoàn toàn bên gửi và bên nhận.</p></details>
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
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Observer và Pub/Sub cùng chia sẻ ý tưởng thông báo cho những bên quan tâm, nhưng khác nhau về mức độ tách rời và phạm vi. <strong>Observer</strong> chạy bên trong một ứng dụng: subject giữ tham chiếu trực tiếp tới các observer và gọi chúng một cách đồng bộ. <strong>Pub/Sub</strong> đặt một broker ở giữa: publisher gửi vào một topic và subscriber lắng nghe trên đó, và hai bên không hề biết về nhau, thường là qua nhiều tiến trình và bất đồng bộ. Pub/Sub thêm hạ tầng broker, các đảm bảo về phân phối, và eventual consistency.</p></details>
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
        q: 'What is the Adapter pattern?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p><strong>Adapter</strong> wraps an existing class and translates its interface into the one the client expects, so two incompatible parts can work together without changing either side. It is common when integrating third-party or legacy code, and it also gives a clean seam for testing and for swapping vendors later. Adapter changes an interface without changing behavior, while Decorator keeps the interface but adds behavior, and Facade simplifies a whole subsystem. The main risk is an adapter that lets the wrapped class's quirks leak through.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><strong>Adapter</strong> bọc một class có sẵn và chuyển đổi interface của nó thành interface mà client mong đợi, nên hai phần không tương thích có thể làm việc cùng nhau mà không phải sửa bên nào. Nó thường gặp khi tích hợp code bên thứ ba hoặc code cũ (legacy), và cũng tạo một điểm nối gọn gàng để test và để đổi nhà cung cấp về sau. Adapter thay đổi interface mà không đổi hành vi, còn Decorator giữ nguyên interface nhưng thêm hành vi, và Facade đơn giản hóa cả một subsystem. Rủi ro chính là một adapter để lọt những đặc tính lạ của class bị bọc ra ngoài.</p></details>
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
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><strong>Facade</strong> cung cấp một điểm vào đơn giản duy nhất cho một subsystem phức tạp, nên client chỉ gọi vài method gọn gàng thay vì phải điều phối nhiều class. Điều này giảm mức độ ràng buộc, vì client phụ thuộc vào facade còn phần bên trong có thể được tái cấu trúc tự do đằng sau nó. Facade đơn giản hóa việc truy cập nhưng không che giấu phần bên trong, Adapter chuyển một interface sang interface khác, còn Proxy giữ nguyên interface để kiểm soát truy cập. Anti-pattern ở đây là một facade khổng lồ gom mọi thao tác vào một class phình to.</p></details>
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
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><strong>Proxy</strong> đứng thay cho object thật với cùng một interface, nên client không phân biệt được, và nó kiểm soát việc truy cập tới object đó. Các dạng phổ biến là lazy loading cho những object tốn kém, kiểm soát truy cập, gọi từ xa, và caching hay logging. Đây là cách nhiều tính năng AOP cùng các cơ chế transaction và security của framework hoạt động. Proxy giữ nguyên interface và kiểm soát truy cập, Decorator giữ interface nhưng thêm hành vi, còn Adapter thay đổi interface. Một vấn đề thường gặp là một proxy âm thầm làm thay đổi hiệu năng, chẳng hạn một lazy proxy kích hoạt những query ngoài dự tính.</p></details>
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
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><strong>Decorator</strong> bọc một object trong một object khác có cùng interface và thêm hành vi, nên các tính năng có thể được kết hợp lúc runtime thay vì phải tạo một subclass cho mỗi tổ hợp. Các I/O stream của Java là ví dụ kinh điển, chẳng hạn một <code>BufferedInputStream</code> bọc quanh một <code>FileInputStream</code>. Mỗi decorator nhỏ gọn và chỉ làm một việc, đúng theo nguyên tắc Single Responsibility và Open/Closed. Decorator giữ nguyên interface và thêm hành vi, khác với Proxy vốn kiểm soát truy cập, và Adapter vốn thay đổi interface. Những chuỗi bọc nhiều lớp có thể khó debug.</p></details>
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
        q: 'What is the Template Method pattern?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p><strong>Template Method</strong> defines the fixed steps of an algorithm in a base class and lets subclasses fill in specific steps through overridable hooks. The overall sequence stays the same, and only the varying steps change. It suits frameworks, such as a base test runner with setup, run, and teardown, or a pipeline where only one step differs. Because it is based on inheritance, it carries the coupling and fragile-base-class risks of inheritance, so Strategy with composition is often a more flexible modern choice.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><strong>Template Method</strong> định nghĩa các bước cố định của một thuật toán trong một class cơ sở và để các subclass điền vào những bước cụ thể qua các hook có thể override. Trình tự tổng thể vẫn giữ nguyên, chỉ những bước thay đổi mới khác đi. Nó hợp với các framework, chẳng hạn một base test runner với setup, run và teardown, hoặc một pipeline mà chỉ một bước là khác. Vì dựa trên kế thừa, nó mang theo những rủi ro ràng buộc và fragile-base-class của kế thừa, nên Strategy với composition thường là lựa chọn hiện đại linh hoạt hơn.</p></details>
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
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><strong>Chain of Responsibility</strong> chuyển một request dọc theo một chuỗi các handler, và mỗi handler hoặc xử lý nó hoặc chuyển tiếp đi. Điều này tách rời bên gửi khỏi bên cuối cùng xử lý request và cho phép sắp xếp lại chuỗi một cách dễ dàng. Middleware pipeline, servlet filter và HTTP interceptor là những ví dụ hằng ngày, với các bước như auth, logging và validation. Một request có thể đi tới cuối chuỗi mà chưa được xử lý, nên cần một xử lý mặc định hoặc một điểm kết thúc rõ ràng, và chuỗi quá dài sẽ gây hại cho việc debug và hiệu năng.</p></details>
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
      {
        q: 'What is the Repository pattern?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p><strong>Repository</strong> puts a collection-like interface in front of storage, so the domain calls methods like <code>orders.findById()</code> instead of using SQL or an ORM directly. This decouples business logic from storage and makes it easy to use a fake in tests. It is often overused: wrapping a mature ORM that already provides this pattern can be redundant. It is most valuable with real domain logic, multiple data sources, or DDD aggregates. A generic repository with a large leaky query API just re-exposes the ORM and adds little value.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><strong>Repository</strong> đặt một interface giống như một collection ở phía trước lớp lưu trữ, nên phần domain gọi các method như <code>orders.findById()</code> thay vì dùng SQL hay ORM trực tiếp. Điều này tách logic nghiệp vụ khỏi lớp lưu trữ và giúp dễ dàng dùng một bản giả (fake) trong test. Nó thường bị lạm dụng: bọc quanh một ORM đã trưởng thành vốn đã cung cấp sẵn pattern này có thể là thừa. Nó có giá trị nhất khi có logic domain thật sự, nhiều nguồn dữ liệu, hoặc các aggregate theo DDD. Một generic repository với một API query lớn và để lọt (leaky) chỉ phơi bày lại ORM và mang lại ít giá trị.</p></details>
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
      {
        q: 'What is Dependency Injection and how does it relate to design patterns?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p><strong>Dependency Injection</strong> means a class receives its dependencies from outside, usually through the constructor, instead of creating them with <code>new</code>. This makes code loosely coupled and testable, since a mock or a different implementation can be injected without changing the class. It is the concrete way to apply the Dependency Inversion principle and is closely tied to Inversion of Control. Constructor injection is preferred because it makes dependencies explicit and allows immutable, fully-built objects. DI can be done by hand, so a container is a convenience, not a requirement, and over-configured containers can become hard to maintain.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><strong>Dependency Injection</strong> nghĩa là một class nhận các dependency của nó từ bên ngoài, thường qua constructor, thay vì tự tạo chúng bằng <code>new</code>. Điều này khiến code ít ràng buộc và dễ test, vì có thể inject một mock hoặc một implementation khác mà không phải sửa class. Đây là cách cụ thể để áp dụng nguyên tắc Dependency Inversion và gắn chặt với Inversion of Control. Constructor injection được ưu tiên vì nó làm các dependency rõ ràng và cho phép tạo ra những object bất biến, được dựng đầy đủ. DI có thể làm bằng tay, nên container chỉ là tiện lợi chứ không bắt buộc, và những container cấu hình quá mức có thể trở nên khó bảo trì.</p></details>
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
      {
        q: 'What are SOLID principles? Give a brief example of each.',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>SOLID is a set of five design principles that help keep code easy to change. <strong>SRP</strong> says a class should have only one reason to change. <strong>OCP</strong> says add new behavior with new code instead of editing tested code, <strong>LSP</strong> says a subtype must work anywhere its parent is used, <strong>ISP</strong> says prefer small focused interfaces, and <strong>DIP</strong> says depend on abstractions, not concrete classes. These are guidelines to reduce coupling, so apply them where change really happens rather than everywhere.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>SOLID là tập hợp năm nguyên tắc thiết kế giúp code dễ thay đổi. <strong>SRP</strong> nói rằng một class chỉ nên có một lý do để thay đổi. <strong>OCP</strong> nói rằng hãy thêm hành vi mới bằng code mới thay vì sửa code đã được kiểm thử, <strong>LSP</strong> nói rằng một subtype phải hoạt động đúng ở bất cứ nơi nào dùng lớp cha của nó, <strong>ISP</strong> khuyến khích dùng các interface nhỏ và tập trung, còn <strong>DIP</strong> nói rằng hãy phụ thuộc vào abstraction chứ không phải class cụ thể. Đây là những hướng dẫn để giảm coupling, nên hãy áp dụng ở nơi thực sự có thay đổi thay vì áp dụng ở mọi chỗ.</p></details>
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
        q: 'What is the difference between Adapter, Facade, and Proxy patterns?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>Adapter, Facade, and Proxy all wrap another object, but for different reasons. <strong>Adapter</strong> changes an interface so an incompatible class fits what the client expects. <strong>Facade</strong> puts one simple interface over a whole complex subsystem. <strong>Proxy</strong> keeps the same interface and controls access, for example lazy loading, caching, or security.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Adapter, Facade và Proxy đều bọc một đối tượng khác, nhưng vì những lý do khác nhau. <strong>Adapter</strong> thay đổi interface để một class không tương thích khớp với cái mà client mong đợi. <strong>Facade</strong> đặt một interface đơn giản lên trên cả một hệ thống con phức tạp. <strong>Proxy</strong> giữ nguyên interface và kiểm soát việc truy cập, ví dụ như lazy loading, caching hoặc bảo mật.</p></details>
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
      {
        q: 'Why is double-checked locking broken without volatile?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>Double-checked locking checks the instance, locks only if it is null, then checks again to avoid locking on every call. The problem is that <code>instance = new Singleton()</code> is not atomic, so the reference can be published before the constructor finishes and another thread may see a half-built object. Marking the field <code>volatile</code> adds a memory barrier that prevents this reordering and guarantees visibility. In Java it is simpler to use the holder idiom or an enum, which are lazy and thread-safe by default.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Double-checked locking kiểm tra instance, chỉ lock nếu nó null, rồi kiểm tra lại để tránh phải lock ở mỗi lần gọi. Vấn đề là <code>instance = new Singleton()</code> không phải là thao tác atomic, nên reference có thể được công bố trước khi constructor chạy xong, và một thread khác có thể thấy một đối tượng chưa được khởi tạo hoàn chỉnh. Đánh dấu field là <code>volatile</code> sẽ thêm một memory barrier ngăn việc reorder này và đảm bảo tính visibility. Trong Java thì đơn giản hơn là dùng holder idiom hoặc enum, vốn đã lazy và thread-safe sẵn.</p></details>
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
        q: 'Why favor composition over inheritance?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Inheritance is very tight coupling because a subclass depends on the parent's internal details, so a change in the base class can silently break it. This is called the fragile base class problem, shown by the <code>InstrumentedHashSet</code> example where the parent calls its own methods internally. Composition holds an object and delegates to it, depending only on its public interface, so it is safer and can be changed at runtime. Use inheritance only for a real is-a relationship where the base is designed for extension, and otherwise prefer has-a.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Inheritance tạo ra coupling rất chặt vì một subclass phụ thuộc vào chi tiết bên trong của lớp cha, nên một thay đổi ở base class có thể âm thầm làm hỏng nó. Đây gọi là vấn đề fragile base class, được minh họa qua ví dụ <code>InstrumentedHashSet</code> nơi lớp cha tự gọi các method của chính nó ở bên trong. Composition thì giữ một đối tượng và ủy quyền (delegate) cho nó, chỉ phụ thuộc vào public interface, nên an toàn hơn và có thể thay đổi lúc runtime. Chỉ dùng inheritance khi có quan hệ is-a thực sự và base được thiết kế để mở rộng, còn lại thì nên ưu tiên has-a.</p></details>
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
        q: 'What is the Anemic Domain Model anti-pattern?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>An anemic domain model is when domain objects hold only data with getters and setters, and all the logic lives in service classes. It looks object-oriented but is really procedural, because it exposes all state and spreads the rules across services instead of protecting them. The fix is a rich model where an entity such as <code>Order</code> can <code>cancel()</code> itself and guards its own invariants. This is fine for simple CRUD apps and only matters when there is real business complexity.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Anemic domain model là khi các đối tượng domain chỉ chứa dữ liệu với getter và setter, còn toàn bộ logic nằm trong các class service. Nhìn thì có vẻ hướng đối tượng nhưng thực chất là lập trình thủ tục, vì nó phơi bày toàn bộ state và rải rác các quy tắc khắp các service thay vì bảo vệ chúng. Cách khắc phục là dùng model giàu hành vi, nơi một entity như <code>Order</code> có thể tự <code>cancel()</code> chính nó và tự bảo vệ các invariant của nó. Cách này ổn với các ứng dụng CRUD đơn giản và chỉ thực sự quan trọng khi có độ phức tạp nghiệp vụ thật sự.</p></details>
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
        q: 'When should you NOT use a design pattern?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>Design patterns are shared vocabulary, not goals, and each one adds indirection that has a lasting readability and maintenance cost. Do not use a pattern until the problem it solves actually appears, since adding flexibility for change that never comes is wasted effort (YAGNI). Speculative generality makes simple code hard to follow. Write the simplest thing that works, and refactor toward a pattern when a second or third real variation forces it.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Design pattern là vốn từ vựng chung, không phải mục tiêu, và mỗi pattern đều thêm một lớp gián tiếp kèm theo cái giá lâu dài về khả năng đọc hiểu và bảo trì. Đừng dùng một pattern cho tới khi vấn đề mà nó giải quyết thực sự xuất hiện, bởi việc thêm tính linh hoạt cho một thay đổi không bao giờ đến là lãng phí công sức (YAGNI). Sự tổng quát hóa mang tính suy đoán khiến code đơn giản trở nên khó theo dõi. Hãy viết thứ đơn giản nhất mà chạy được, rồi refactor sang pattern khi biến thể thực tế thứ hai hoặc thứ ba buộc bạn phải làm vậy.</p></details>
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
      {
        q: 'What is a God Object, and what does the Law of Demeter say about train wrecks?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>A God Object is a class that knows and does too much, so everything depends on it, it is hard to test, and every change touches it. It is the clearest violation of single responsibility. The Law of Demeter says a method should only talk to its direct neighbors, which targets train wrecks like <code>order.getCustomer().getAddress().getCity()</code> that couple code to the whole object structure. The fix for both is tell, don't ask: give objects behavior instead of reaching into their internals, though plain data objects and fluent builders may chain freely.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>God Object là một class biết và làm quá nhiều thứ, khiến mọi thứ đều phụ thuộc vào nó, khó kiểm thử, và mọi thay đổi đều động tới nó. Đây là vi phạm rõ ràng nhất của nguyên tắc single responsibility. Law of Demeter nói rằng một method chỉ nên nói chuyện với những hàng xóm trực tiếp của nó, nhắm vào các train wreck như <code>order.getCustomer().getAddress().getCity()</code> vốn khiến code phụ thuộc vào toàn bộ cấu trúc đối tượng. Cách khắc phục cho cả hai là tell, don't ask: hãy trao hành vi cho đối tượng thay vì thò tay vào bên trong nó, dù các đối tượng dữ liệu thuần và fluent builder vẫn có thể chain thoải mái.</p></details>
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
    ],
  },
];
