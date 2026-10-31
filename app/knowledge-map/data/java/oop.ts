import type { KmNode } from '../../types';

export const oop: KmNode = {
  title: 'Object-Oriented Programming',
  level: 'beginner',
  summary:
    'How Java models the world with classes and objects, and the rules that keep that code tidy.',
  simple:
    'OOP is about bundling data with the actions that use it. A "Car" knows its speed and also knows how to brake.',
  points: [
    'Four pillars: encapsulation, inheritance, polymorphism, abstraction.',
    'Almost all Java code lives inside classes.',
    'Modern Java adds records, enums and sealed classes for clearer models.',
  ],
  children: [
    {
      title: 'Class, Object & Constructor',
      level: 'beginner',
      summary:
        'A class is a blueprint, an object is one thing built from it, and a constructor sets it up.',
      simple:
        'A class is a cookie cutter, objects are the cookies. Same shape, but each cookie can have its own sprinkles.',
      points: [
        'Fields hold the state, methods hold the behavior.',
        '<code>new</code> creates an object on the heap and returns a reference to it.',
        'Each object has its own copy of the instance fields.',
        'A constructor sets up a new object: same name as the class, no return type.',
        '<code>this</code> means "the current object"; <code>this(...)</code> calls another constructor.',
        'No constructor written? Java adds an empty no-arg one.',
      ],
      detail: `<pre><code>class Dog {
  private final String name;
  Dog(String name) { this.name = name; }
  Dog() { this("Rex"); }
  void bark() { System.out.println(name + ": Woof"); }
}

new Dog("Max").bark();</code></pre>`,
    },
    {
      title: 'Encapsulation & Access Modifiers',
      level: 'beginner',
      summary:
        'Hide internal data and expose only what others need, using private, protected, public.',
      simple:
        'Like a coffee machine: you press buttons (public methods), you do not reach inside and stir the boiler (private fields).',
      points: [
        '<code>private</code>: only inside the class.',
        'No modifier (package-private): same package only.',
        '<code>protected</code>: same package plus subclasses.',
        '<code>public</code>: everyone.',
        'Make fields private and expose behavior, not raw setters for everything.',
      ],
      tip: 'Start with the most private option and open up only when needed.',
    },
    {
      title: 'Inheritance & super',
      level: 'beginner',
      summary:
        'A class can extend another to reuse and specialize its code; super reaches the parent.',
      simple:
        'A Cat is an Animal. It gets everything an Animal has for free and can add or change a few things.',
      points: [
        'Use <code>extends</code>; Java allows only one parent class.',
        '<code>super(...)</code> calls the parent constructor; <code>super.method()</code> calls the parent version.',
        'Every class extends <code>Object</code> if you say nothing.',
        'Use inheritance only for a true "is-a" relationship.',
      ],
      detail: `<pre><code>class Animal {
  String sound() { return "..."; }
}
class Cat extends Animal {
  @Override
  String sound() { return "Meow (" + super.sound() + ")"; }
}</code></pre>`,
    },
    {
      title: 'Polymorphism',
      level: 'intermediate',
      summary: 'One call, many behaviors: the actual object decides which method runs.',
      simple:
        'You say "speak" to any animal. The dog barks, the cat meows. You did not need to know which one it was.',
      points: [
        'Overloading: same name, different parameters, picked at compile time.',
        'Overriding: subclass replaces a parent method, picked at runtime.',
        'Always add <code>@Override</code> so the compiler catches typos.',
        'Static, private and final methods cannot be overridden.',
        'An override may return a subtype and cannot be less visible.',
      ],
      detail: `<pre><code>Animal a = new Cat();
a.sound();   // "Meow" - runtime type wins

void print(int x)    { }
void print(String s) { } // overload</code></pre>`,
      tip: 'Interview: overloading = compile-time (static) binding, overriding = runtime (dynamic) binding.',
    },
    {
      title: 'Abstract Class vs Interface',
      level: 'intermediate',
      summary:
        'Both define what a type can do without full code; they differ in state and inheritance rules.',
      simple:
        'An interface is a job description ("can fly"). An abstract class is a half-built house you finish yourself.',
      points: [
        'A class can implement many interfaces but extend only one class.',
        'Abstract classes can have fields, constructors and state.',
        'Interfaces have only constants, but can have <code>default</code>, <code>static</code> and <code>private</code> methods.',
        'Default methods (Java 8) let you add methods to an interface without breaking old code.',
        'Prefer interfaces for types; use an abstract class to share real code and state.',
      ],
      detail: `<pre><code>interface Shape {
  double area();
  default String describe() { return "Area: " + area(); }
}
abstract class Base implements Shape {
  protected final String id;
  Base(String id) { this.id = id; }
}</code></pre>`,
    },
    {
      title: 'static & final',
      level: 'intermediate',
      summary:
        'static means it belongs to the class, not each object; final means it cannot change.',
      simple:
        'static is the shared whiteboard in the office, not your personal notebook. final is writing in pen instead of pencil.',
      points: [
        'Static field: one copy shared by all objects. Static method: no <code>this</code>.',
        '<code>final</code> variable: assign once. <code>final</code> method: no override. <code>final</code> class: no subclass.',
        'A final reference can still point to a mutable object: <code>final List</code> can be changed.',
        'Constants: <code>static final int MAX = 10;</code>.',
      ],
      tip: 'Too many static methods and mutable static fields make code hard to test. Keep static for pure helpers and constants.',
    },
    {
      title: 'Object Methods',
      level: 'intermediate',
      summary:
        'Every class gets equals, hashCode and toString from Object; you often override them.',
      simple:
        'equals answers "are these the same thing?", hashCode gives a quick label for sorting into boxes, toString is the name tag.',
      points: [
        'Default <code>equals</code> compares references (same object), not content.',
        'Contract: if <code>a.equals(b)</code> then <code>a.hashCode() == b.hashCode()</code>.',
        'Override both or neither, or HashMap and HashSet will misbehave.',
        'Equal hash codes do not mean equal objects (collisions are fine).',
        'Override <code>toString</code> for readable logs.',
      ],
      detail: `<pre><code>@Override
public boolean equals(Object o) {
  return o instanceof User u &amp;&amp; id.equals(u.id);
}
@Override
public int hashCode() { return id.hashCode(); }</code></pre>`,
      tip: 'Do not build equals/hashCode on mutable fields: change one after putting it in a HashSet and you cannot find it again.',
    },
    {
      title: 'Nested & Anonymous Classes',
      level: 'intermediate',
      summary: 'Classes defined inside other classes, for helpers that belong together.',
      simple: 'Like a room inside a house. It only makes sense as part of that house.',
      points: [
        'Static nested class: no link to an outer object. Use this by default.',
        'Inner class (non-static): holds a hidden reference to the outer object.',
        'Local class: declared inside a method.',
        'Anonymous class: one-off class with no name; mostly replaced by lambdas.',
      ],
      tip: 'Inner classes keep the outer object alive, which can cause memory leaks. Prefer static nested.',
    },
    {
      title: 'Enums, Records & Sealed',
      level: 'intermediate',
      summary: 'Special kinds of classes for fixed choices, plain data, and closed type families.',
      simple:
        'These are ready-made shapes for common jobs, so you write less boilerplate and the compiler checks more for you.',
      points: [
        'enum: a fixed set of named values.',
        'record (Java 16+): an immutable data carrier.',
        'sealed (Java 17+): you choose exactly who may extend a type.',
      ],
      children: [
        {
          title: 'Enums',
          level: 'beginner',
          summary: 'A type with a fixed set of named values, like days of the week.',
          simple:
            'An enum is a menu with fixed choices. You cannot order something that is not on it.',
          points: [
            'Type-safe: much better than int or String constants.',
            'Can have fields, constructors and methods.',
            'Works great in switch; the compiler can check you covered all values.',
            'Use <code>EnumMap</code> and <code>EnumSet</code> for fast enum-keyed collections.',
          ],
          detail: `<pre><code>enum Status {
  NEW("N"), PAID("P"), SHIPPED("S");
  final String code;
  Status(String code) { this.code = code; }
}</code></pre>`,
        },
        {
          title: 'Records',
          level: 'intermediate',
          summary:
            'A short way (Java 16+) to make an immutable data class with equals, hashCode and toString built in.',
          simple:
            'A record is a labeled box you seal after packing. You get the labels, comparing and printing for free.',
          points: [
            'Fields are private and final; accessors are named after them: <code>p.x()</code>.',
            'You get a constructor, <code>equals</code>, <code>hashCode</code>, <code>toString</code>.',
            'Use a compact constructor to validate input.',
            'Cannot extend other classes, but can implement interfaces.',
            'Great for DTOs, value objects and map keys.',
          ],
          detail: `<pre><code>record Money(BigDecimal amount, String currency) {
  Money {
    if (amount.signum() &lt; 0) throw new IllegalArgumentException("negative");
  }
}</code></pre>`,
        },
        {
          title: 'Sealed Classes',
          level: 'advanced',
          summary: 'Lets a class or interface list exactly which types may extend it (Java 17+).',
          simple: 'A private club with a guest list. Only the names on the list can join.',
          points: [
            'Declare with <code>sealed ... permits A, B</code>.',
            'Subclasses must be <code>final</code>, <code>sealed</code> or <code>non-sealed</code>.',
            'With records and pattern matching, switch can check you handled every case.',
          ],
          detail: `<pre><code>sealed interface Shape permits Circle, Square {}
record Circle(double r) implements Shape {}
record Square(double s) implements Shape {}

double area(Shape s) {
  return switch (s) {
    case Circle c -&gt; Math.PI * c.r() * c.r();
    case Square q -&gt; q.s() * q.s();
  };
}</code></pre>`,
        },
      ],
    },
    {
      title: 'Composition over Inheritance',
      level: 'advanced',
      summary:
        'Build objects by holding other objects ("has-a") instead of extending classes ("is-a").',
      simple:
        'Instead of making a car a kind of engine, you give the car an engine. Swap the engine any time.',
      points: [
        'Inheritance ties you tightly to the parent; parent changes can break children.',
        'Composition lets you swap parts at runtime and test them alone.',
        'Combine with interfaces: depend on <code>PaymentGateway</code>, not a concrete class.',
        'Inheritance is still fine for real, stable "is-a" hierarchies.',
      ],
    },
    {
      title: 'SOLID',
      level: 'advanced',
      summary: 'Five design rules that keep object-oriented code easy to change.',
      points: [
        'S - Single responsibility: one class, one reason to change.',
        'O - Open/closed: add new behavior without editing old code.',
        'L - Liskov substitution: a subclass must work anywhere its parent does.',
        'I - Interface segregation: many small interfaces beat one giant one.',
        'D - Dependency inversion: depend on interfaces, not concrete classes.',
      ],
      tip: 'In interviews, give one real example per letter. Rules are guides, not laws; do not over-engineer small code.',
    },
  ],
};
