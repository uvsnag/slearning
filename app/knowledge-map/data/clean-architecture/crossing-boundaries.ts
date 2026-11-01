import type { KmNode } from '../../types';

export const crossingBoundaries: KmNode = {
  title: 'Data Across Boundaries',
  level: 'intermediate',
  summary:
    'How data travels between layers: simple objects shaped for each side, converted at the edge.',
  simple:
    'When you send a parcel abroad, you fill in a customs form. The form is a simple standard shape, not your whole suitcase.',
  points: [
    'Data crossing a boundary should be in the form most convenient for the inner side.',
    'Don’t pass entities, DB rows or HTTP objects across layers.',
    'Every conversion has a cost; only add the ones that buy you something.',
  ],
  children: [
    {
      title: 'DTOs',
      level: 'beginner',
      summary: 'Data Transfer Objects: plain carriers of data with no behaviour.',
      simple: 'A DTO is an envelope. It carries the letter but doesn’t read or act on it.',
      points: [
        'Just fields, no business logic. Java records are perfect for them.',
        'Used for HTTP request/response bodies and messages.',
        'Let your API shape change without changing your entities, and vice versa.',
        'Live in the adapter layer, next to the controller that uses them.',
      ],
      detail: `<pre><code>public record CreateOrderRequest(
        String customerId,
        List&lt;LineItemDto&gt; items) {}

public record OrderResponse(String id, String status, BigDecimal total) {}</code></pre>`,
    },
    {
      title: 'Request & Response Models',
      level: 'intermediate',
      summary: 'Input and output types owned by a use case, free of any web or DB types.',
      simple:
        'A restaurant order slip: the kitchen defines its format. Waiters copy what you say onto it; the kitchen never hears your voice.',
      points: [
        'Input: a command like <code>PlaceOrderCommand</code>, validated in its constructor.',
        'Output: a result like <code>OrderPlaced</code>, not the entity itself.',
        'Owned by the use case layer, so they follow the Dependency Rule.',
        'The controller maps its DTO to the command; the presenter maps the result out.',
      ],
      detail: `<pre><code>public record PlaceOrderCommand(CustomerId customerId, List&lt;Item&gt; items) {
    public PlaceOrderCommand {
        if (items.isEmpty()) throw new IllegalArgumentException("empty order");
        items = List.copyOf(items);
    }
}</code></pre>`,
    },
    {
      title: 'Domain vs Persistence Model',
      level: 'intermediate',
      summary:
        'Your business entity and your JPA entity can be two different classes with a mapper between them.',
      simple:
        'A person and their passport photo: related, but the photo is shaped for the border office, not for living.',
      points: [
        'JPA needs no-arg constructors, setters, and annotations. The domain wants none of that.',
        'Separate models keep the domain clean and the table design free.',
        'Cost: a mapper and a second class per aggregate.',
        'Pragmatic option: one class with JPA annotations, accepting the leak knowingly.',
      ],
      tip: 'There’s no single right answer. Name the trade-off you chose and stick to it consistently.',
    },
    {
      title: 'Mapping Strategies',
      level: 'advanced',
      summary: 'From no mapping to full mapping per layer: pick per use case, not per project.',
      points: [
        'No mapping: one model everywhere. Fast, but layers become coupled.',
        'Two-way: each layer has its own model; adapters map in and out.',
        'Full: separate input/output models per use case. Very clean, very verbose.',
        'MapStruct generates mappers at compile time; hand-written mappers are fine for small cases.',
      ],
    },
    {
      title: 'Presenters & Humble Objects',
      level: 'advanced',
      summary:
        'Split hard-to-test UI code into a dumb "humble" view and a testable presenter that formats data.',
      points: [
        'The use case hands a response model to an output port (the presenter).',
        'The presenter turns it into a view model: strings, formatted dates, flags.',
        'The view just displays the view model; it’s "humble" and barely needs tests.',
        'In REST apps, the controller often plays both roles; that’s usually fine.',
      ],
    },
    {
      title: 'Validation & Errors',
      level: 'advanced',
      summary: 'Validate shape at the edge, enforce business rules in the core.',
      points: [
        'Adapters check format: required fields, JSON types, <code>@Valid</code> annotations.',
        'Commands and entities check business invariants ("quantity &gt; 0").',
        'The core throws business exceptions; adapters turn them into HTTP 400/404/409.',
        'Never let <code>SQLException</code> or HTTP status codes reach the use case.',
      ],
    },
  ],
};
