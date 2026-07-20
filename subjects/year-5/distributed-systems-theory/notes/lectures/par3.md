# المحاضرة الثالثة: Distributed Objects and Remote Invocation (الجزء الأول)
### د. محسن عبود — Chapters 4+5+6+8, Coulouris
*(تغطي: Introduction, Middleware, External Data Representation, Request-reply protocols, RPC — بداية RMI ستُغطى بملف منفصل بعد استكمال محتواها)*

---

## 📖 ملخص المحاضرة (Theory Summary)

### 1) Introduction
- **Distributed applications**: تطبيقات مكوّنة من برامج متعاونة تعمل بعدة processes مختلفة، تحتاج لاستدعاء عمليات في processes أخرى (على حواسيب مختلفة).
- **Remote Objects**: كائنات تستقبل استدعاءات remote method invocations وتُنفّذ **remote interface**.
- محاور المحاضرة الأساسية:

| المفهوم | التعريف المختصر |
|---|---|
| **External Data Representation** | تحويل الكائنات/بنى البيانات لصيغة قابلة للإرسال عبر الشبكة (بما أن الحواسيب المختلفة قد تمثل البيانات البسيطة بشكل مختلف) |
| **Request-reply protocols** | نمط فوق تبادل الرسائل، يدعم التبادل ثنائي الاتجاه كما بالـ client-server |
| **RPC** | Client يستدعي procedure على computer بعيد وكأنها محلية |
| **RMI** | كائن محلي يستدعي methods لكائن على computer بعيد وكأنها محلية |
| **Event-based Programming** | كائنات تستقبل إشعارات غير متزامنة (asynchronous) لأحداث تحصل على أجهزة/processes بعيدة |

### 2) Middleware
- برنامج يوفر نموذج برمجي فوق الأساسيات (processes + message passing).
- طبقة الـ Middleware تستخدم بروتوكولات مبنية على الرسائل لتوفير تجريدات أعلى (remote invocation, events).
- **أهم دور**: توفير **Location transparency** والاستقلالية عن تفاصيل بروتوكولات الاتصال، OS، الـ Hardware، ولغة البرمجة.

**طبقات Middleware (Figure 1):**
```
Applications, services
─────────────────────────
RMI and RPC
─────────────────────────
request-reply protocol
marshalling and external data representation
─────────────────────────
UDP and TCP
```

**أشكال الشفافية التي يوفرها Middleware:**

| نوع الشفافية | الشرح |
|---|---|
| **Location transparency** | الـ client يستدعي procedure/method دون معرفة موقعه (في RPC وRMI) |
| **Transport protocol transparency** | مثال: request/reply protocol المستخدم لتطبيق RPC ممكن يستخدم UDP أو TCP |
| **Computer hardware transparency** | إخفاء اختلافات معمارية الـ hardware (مثل byte ordering) |
| **Operating system transparency** | استقلالية عن OS الأساسي |
| **Programming language transparency** | يسمح باستخدام أكثر من لغة برمجة (مثال: CORBA تستخدم IDL لتعريف الواجهات) |

### 3) External Data Representation (EDR)
- المعلومات بالبرنامج تُمثَّل كـ data structures، بينما الرسائل تتكون من sequences of bytes → لازم تحويل قبل الإرسال وإعادة بناء عند الوصول.
- **EDR** = معيار متفق عليه لتمثيل بنى البيانات والقيم الأولية.
- طريقتان للتمثيل: (1) استخدام تمثيل خارجي متفق عليه (تحويلان ضروريان)، (2) استخدام صيغة المرسل مع إشارة للصيغة المستخدمة، ويحوّل عند المستقبل.

| العملية | التعريف |
|---|---|
| **Marshalling** | أخذ مجموعة عناصر بيانات وتجميعها بصيغة مناسبة للإرسال برسالة |
| **Unmarshalling** | تفكيك مجموعة البيانات عند الوصول لإنتاج مجموعة مكافئة من عناصر البيانات بالوجهة |

**3 مقاربات لـ EDR والـ Marshalling:**

| المقاربة | ملاحظة |
|---|---|
| **CORBA's common data representation** | تتضمن فقط **القيم** المرسلة، **بدون** معلومات عن الأنواع (types) |
| **Java's object serialization** | تتضمن معلومات النوع، خاصة بلغة Java فقط |
| **XML** | صيغة نصية لتمثيل بيانات مهيكلة، تتضمن معلومات النوع أيضاً |

> ⭐ Marshalling/Unmarshalling يُنفَّذان **تلقائياً بواسطة طبقة الـ Middleware** (وليس المبرمج مباشرة).

### 4) Request-reply Protocols
- مصمم لدعم أدوار وتبادل الرسائل النموذجية بتفاعلات client-server.
- **متزامن (Synchronous)** بالحالة الطبيعية: الـ client يُحجَب (blocks) حتى وصول الرد.
- **موثوق (Reliable)**: الرد من السيرفر بمثابة acknowledgement للـ client.
- يوجد بديل **Asynchronous request-reply** لما يستطيع الـ client استرجاع الردود لاحقاً.
- غالباً يُبنى فوق **UDP datagrams**:
  - request/response pairs → لا حاجة لـ acknowledgements بطبقة النقل
  - تجنّب overhead تأسيس الاتصال (connection establishment)
  - لا حاجة لـ flow control (كميات بيانات صغيرة)

**3 عمليات أساسية (Primitives):** `doOperation`, `getRequest`, `sendReply`

**بنية رسالة Request/Reply تتضمن:** Message identifier، نوع الرسالة (Request/Reply)، معرّف الإجراء (RequestId)، عنوان remote reference، اسم/رقم الإجراء (procedure/method)، الوسائط (arguments).

**Message Identifier:**
- ضروري لضمان التسليم الموثوق. يتكون من جزئين:
  1. **requestId**: من سلسلة أعداد متزايدة، فريد للمرسل
  2. **معرّف عملية المرسل**: (port + Internet address) → فريد ضمن كامل النظام الموزع

### 5) Failure Model لبروتوكول Request-reply
عند تطبيق الـ primitives الثلاثة فوق UDP، تحصل نفس أعطال UDP:
- **Omission failure**: رسائل غير مضمونة الوصول **بترتيب المرسل**
- فشل الـ processes
- **Timeouts**: `doOperation` يستخدم timeout أثناء انتظار رد السيرفر
- تجاهل الطلبات المكررة (**Discarding duplicate request**)
- فقدان رسالة الرد (**Lost reply message**)
- **History**: سجل للردود

**عند حدوث Timeout:**
- الخيار الأبسط: العودة فوراً من `doOperation` بإشارة فشل للـ client.
- أو: إعادة إرسال الطلب بشكل متكرر حتى يصل رد أو يتأكد أن التأخير بسبب عدم استجابة السيرفر (وليس فقد الرسائل).
- عند إعادة الإرسال، قد يستلم السيرفر الطلب أكثر من مرة → قد ينفّذ العملية أكثر من مرة لنفس الطلب.
- البروتوكول مصمم للتعرف على الرسائل المتتالية (من نفس الـ client) بنفس requestId وتصفية التكرارات (**Duplicate filtering**).

**تعامل السيرفر مع الطلب المكرر:**
- إذا لم يُرسل الرد بعد: لا إجراء خاص، سيرسله عند انتهاء التنفيذ.
- إذا أُرسل الرد مسبقاً: يجب **إعادة تنفيذ العملية** للحصول على النتيجة، **إلا إذا خزّن نتيجة التنفيذ الأصلي**.
- السيرفر ذو العمليات **Idempotent** (يمكن تكرارها بنفس التأثير كأنها نُفذت مرة واحدة فقط) **لا يحتاج إجراءات خاصة** لتجنب التنفيذ المتكرر.
- للسيرفرات التي تحتاج إعادة إرسال الردود دون إعادة تنفيذ → تُستخدم **History**:
  - كل عنصر بالـ history: requestId + رسالة + معرّف الـ client
  - المشكلة: التكلفة بالذاكرة → يكفي الاحتفاظ بآخر رد لكل client، وتُحذف الرسائل بعد فترة محددة.

**أنماط بروتوكولات التبادل (Styles of Exchange Protocols):**

| البروتوكول | الوصف |
|---|---|
| **R (Request)** | رسالة طلب واحدة فقط، يُستخدم عندما **لا توجد قيمة تُعاد** من الاستدعاء البعيد |
| **RR (Request-Reply)** | الأكثر استخداماً لمعظم تبادلات client-server، مبني على request-reply |
| **RRA (Request-Reply-Acknowledge)** | تبادل 3 رسائل: **request → reply → acknowledge reply** |

### 6) Remote Procedure Call (RPC)
- مشابه لـ RMI: client يستدعي procedure على computer بعيد وكأنها محلية.
- نظام الـ RPC يخفي جوانب التوزيع (encoding/decoding الوسائط والنتائج).
- **RPC يُنفَّذ عادةً فوق request-reply protocol**.
- **RPC لا يتعامل مع objects ولا object references** (هذا فرق جوهري عن RMI).

**Interfaces:**
- كل module له **interface صريح** يحدد الـ procedures والمتغيرات القابلة للوصول ويُخفي تفاصيل التنفيذ.
- في التوزيع: لا وصول مباشر للمتغيرات البعيدة → يُستخدم message passing عبر request-reply protocols.
- **Service interface**: مصطلح يشير لمواصفة الـ procedures التي يقدمها السيرفر.
- **Interface Definition Languages (IDLs)**: تسمح بأن procedures بلغات مختلفة تستدعي بعضها؛ توفر تدوين لكل معامل (input/output + النوع). مثال: **Sun XDR**.

**RPC Call Semantics** (بناءً على 3 خيارات تصميم لـ `doOperation`):

| الخيار | يتحكم بـ |
|---|---|
| **Retry request message** | إعادة إرسال الطلب حتى يصل رد أو يُفترض فشل السيرفر |
| **Duplicate filtering** | متى تُستخدم إعادة الإرسال وهل تُصفّى الطلبات المكررة بالسيرفر |
| **Retransmission of results** | الاحتفاظ بـ history للردود لإعادة إرسال النتائج المفقودة دون إعادة التنفيذ |

**أنواع الدلالات (Invocation Semantics):**

| الدلالة | Retry request | Duplicate filtering | إعادة التنفيذ/الرد | التأثير على المستدعي |
|---|---|---|---|---|
| **Maybe** | No | Not applicable | Not applicable | ينفَّذ مرة أو **لا يُنفَّذ إطلاقاً**؛ يعاني من: (1) فقدان الرسالة (2) انهيار السيرفر — بدون أي fault-tolerance |
| **At-least-once** | Yes | No | Re-execute procedure | ينفَّذ **مرة على الأقل، أو exception**؛ يعاني من: (1) انهيار السيرفر (2) Arbitrary failures لعمليات **non-idempotent** |
| **At-most-once** | Yes | Yes | Retransmit reply (دون إعادة تنفيذ) | يستلم النتيجة **أو exception**؛ **يمنع** Omission failures (بإعادة المحاولة) و Arbitrary failures |

### 7) Implementation of RPC
مكونات البرمجيات المطلوبة (Figure 7):

| المكوّن | الدور |
|---|---|
| **Service interface** | الـ procedures المتاحة للاستدعاء البعيد |
| **Communication module** | ينفّذ خيارات دلالة الاستدعاء (retransmission, duplicates, retransmission of results) |
| **Client stub procedure** | كـ procedure محلية للـ client: marshalling → إرسال → unmarshalling (**مشابه لـ proxy method في RMI**) |
| **Dispatcher** | يختار أحد server stub procedures حسب معرّف الإجراء بالرسالة |
| **Server stub procedure** | unmarshalling → استدعاء → marshalling (**مشابه لـ skeleton في RMI**) |

- كل من client stub، server stub، والـ dispatcher يمكن توليدهم تلقائياً بواسطة **interface compiler** من IDL الخاص بالخدمة.
- **RPC يهتم فقط بـ procedure calls** — لا يتعامل مع objects أو object references.
- مثال: **Sun RPC**.

---

## ✅ 100 سؤال MCQ (مبنية على نص المحاضرة + أنماط الدورات السابقة)

> ترميز المصدر: **[محاضرة]** = من نص السلايدات مباشرة | **[نمط 2022-2023]** / **[نمط 2025]** / **[نمط 2021]** = مبني على نمط سؤال ظهر بنفس الصياغة أو قريب منها في تلك الدورة.

### 🔹 القسم 1: مقدمة (Q1–Q7)

### السؤال 1 (متوسط)
Objects that can receive remote method invocations are called:
أ) Local objects
ب) Remote objects
ج) Proxy objects
د) Skeleton objects
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 2 (متوسط)
Remote objects implement a:
أ) Local class
ب) Remote interface
ج) Communication module
د) Dispatcher
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 3 (متوسط)
In RPC, the client calls a procedure implemented and executing on a remote computer:
أ) Using shared memory
ب) As if it was a local procedure
ج) Only via email
د) Never directly
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 4 (متوسط)
In RMI, a local object invokes methods of a remote object:
أ) Using a different syntax entirely
ب) As if it was a local method call
ج) Only through XML
د) Only via UDP
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 5 (متوسط)
In Event-based Distributed Programming, objects receive:
أ) Synchronous blocking calls only
ب) Asynchronous notifications of events on remote computers
ج) Only local notifications
د) None of the above
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 6 (متوسط)
Distributed applications are composed of:
أ) A single monolithic program
ب) Cooperating programs running in several different processes
ج) Only client programs
د) Only server programs
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 7 (متوسط)
This lecture examines communication between processes through:
أ) External Data Representation and Request-reply protocols
ب) Only hardware design
ج) Only security
د) Only clock synchronization
**الإجابة الصحيحة: أ**
**التعليل:** المصدر: [محاضرة]

---

### 🔹 القسم 2: Middleware والشفافية (Q8–Q15)

### السؤال 8 (متوسط)
Middleware is defined as:
أ) The operating system kernel
ب) Software providing a programming model above processes and message passing
ج) A hardware component
د) A type of network cable
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 9 (متوسط)
Middleware resides:
أ) Below transport layer
ب) Above transport layer (uses UDP/TCP underneath)
ج) Inside the OS kernel only
د) None of the above
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [نمط 2022-2023] Q12

---

### السؤال 10 (متوسط)
An important aspect of middleware is providing:
أ) Only encryption
ب) Location transparency and independence from communication/OS/HW/language details
ج) Only compression
د) Only logging
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 11 (متوسط)
In RPC and RMI, the client calls a procedure/method without knowledge of its location — this is:
أ) Location transparency
ب) Transport protocol transparency
ج) Hardware transparency
د) OS transparency
**الإجابة الصحيحة: أ**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 12 (متوسط)
The fact that request-reply protocol implementing RPC can use either UDP or TCP illustrates:
أ) Location transparency
ب) Transport protocol transparency
ج) OS transparency
د) Programming language transparency
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 13 (متوسط)
Hiding differences due to hardware architecture (e.g., byte ordering) is:
أ) OS transparency
ب) Computer hardware transparency
ج) Location transparency
د) Language transparency
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 14 (متوسط)
CORBA using an Interface Definition Language (IDL) to allow multiple programming languages illustrates:
أ) Hardware transparency
ب) OS transparency
ج) Programming language transparency
د) Location transparency
**الإجابة الصحيحة: ج**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 15 (متوسط)
According to the middleware layers diagram, RMI and RPC sit directly above:
أ) Applications
ب) Request-reply protocol / marshalling and external data representation
ج) UDP and TCP directly with nothing between
د) The OS kernel
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة] — Figure 1

---

### 🔹 القسم 3: External Data Representation & Marshalling (Q16–Q27)

### السؤال 16 (متوسط)
The requirements for middleware include:
أ) Communication protocol only
ب) External data representation only
ج) Specific transport protocol only
د) Both communication protocol and external data representation
**الإجابة الصحيحة: د**
**التعليل:** المصدر: [نمط 2022-2023] Q13

---

### السؤال 17 (متوسط)
External Data Representation is:
أ) A programming language
ب) An agreed standard for representing data structures and primitive values
ج) A type of failure
د) A security protocol
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 18 (متوسط)
Marshalling is the process of:
أ) Disassembling data on arrival
ب) Assembling a collection of data items into a form suitable for transmission
ج) Encrypting data only
د) Compressing data only
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 19 (متوسط)
Unmarshalling is the process of:
أ) Assembling data for transmission
ب) Disassembling data on arrival to produce an equivalent collection of data items
ج) Encrypting arriving data
د) Compressing arriving data
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 20 (متوسط)
Marshalling process in middleware:
أ) Can be done by the sender only
ب) Can be done by the receiver only
ج) Assembling data for transmission
د) Disassembling received data
**الإجابة الصحيحة: ج**
**التعليل:** المصدر: [نمط 2022-2023] Q15

---

### السؤال 21 (متوسط)
Marshalling and unmarshalling are done by the programmer directly:
أ) True
ب) False (done automatically by middleware)
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [نمط 2022-2023] Q16

---

### السؤال 22 (متوسط)
Which approach to external data representation is concerned only with values, NOT data types:
أ) CORBA's common data representation
ب) Java serialization
ج) XML
د) All of the above
**الإجابة الصحيحة: أ**
**التعليل:** المصدر: [نمط 2022-2023] Q17

---

### السؤال 23 (متوسط)
Which approaches DO include type information:
أ) CORBA only
ب) Java's object serialization and XML
ج) Neither
د) All exclude type info
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 24 (متوسط)
Java's object serialization is:
أ) Usable by any programming language
ب) For use only by Java
ج) A network protocol
د) A hardware standard
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 25 (متوسط)
XML defines:
أ) A binary-only format
ب) A textual format for representing structured data
ج) A hardware protocol
د) A clock synchronization method
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 26 (متوسط)
The three approaches to external data representation mentioned are:
أ) TCP, UDP, HTTP
ب) CORBA's common data representation, Java's object serialization, XML
ج) RPC, RMI, Events
د) Latency, Bandwidth, Jitter
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 27 (متوسط)
Using sender's format with an indication of the format used, then converting at the recipient, is one method of:
أ) Marshalling only
ب) External data representation
ج) Unmarshalling only
د) None of the above
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### 🔹 القسم 4: Request-reply Protocol - أساسيات (Q28–Q37)

### السؤال 28 (متوسط)
Request-reply protocol supports the roles and message exchanges in:
أ) Peer-to-peer only
ب) Typical client-server interactions
ج) Security models only
د) Failure models only
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة] + [نمط 2022-2023] Q27

---

### السؤال 29 (متوسط)
In the normal case, request-reply communication is:
أ) Asynchronous only
ب) Synchronous — client blocks until reply arrives
ج) Never reliable
د) Only used for events
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 30 (متوسط)
Request-reply communication is considered reliable because:
أ) It uses TCP always
ب) The server's reply acts as an acknowledgement to the client
ج) It never fails
د) It uses encryption
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 31 (متوسط)
Asynchronous request-reply communication is useful when:
أ) The client can never wait
ب) Clients can afford to retrieve replies later
ج) There is no server
د) TCP is unavailable
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 32 (متوسط)
Request-reply protocols are often built over:
أ) TCP only
ب) UDP datagrams
ج) HTTP only
د) FTP only
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة] + [نمط 2022-2023] Q2

---

### السؤال 33 (متوسط)
Building request-reply over UDP avoids:
أ) All possible failures
ب) Connection establishment overhead
ج) The need for a server
د) The need for marshalling
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 34 (متوسط)
No flow control is needed in request-reply over UDP because:
أ) Data is always encrypted
ب) Small amounts of data are transferred
ج) TCP handles it
د) There's no data transferred
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 35 (متوسط)
The trio of communication primitives for request-reply protocol are:
أ) send, receive, ack
ب) doOperation, getRequest, sendReply
ج) marshal, unmarshal, transmit
د) request, reply, retry
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 36 (متوسط)
If UDP datagrams are used, delivery guarantees must be provided by:
أ) The hardware
ب) The request-reply protocol itself (using the reply as acknowledgement)
ج) The OS only
د) The client application only
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 37 (متوسط)
No acknowledgements at the transport layer are necessary in UDP-based request-reply because:
أ) TCP already handles it
ب) The protocol consists of request/response pairs
ج) There are no failures
د) Messages are always small
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### 🔹 القسم 5: بنية الرسالة و Message Identifier (Q38–Q42)

### السؤال 38 (متوسط)
A message identifier is required to provide:
أ) Faster transmission
ب) Reliable delivery via a unique identifier for each message
ج) Encryption
د) Compression
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 39 (متوسط)
A message identifier consists of two parts:
أ) Sender name and receiver name
ب) requestId (increasing sequence, unique to sender) and sender process identifier (port + IP address)
ج) Only timestamp
د) Only checksum
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 40 (متوسط)
The requestId is:
أ) Random and non-sequential
ب) Taken from an increasing sequence of integers, unique to the sending process
ج) Fixed for all messages
د) Assigned by the receiver
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 41 (متوسط)
The sender process identifier (e.g., port + IP address) must be unique:
أ) Only within one process
ب) Within the entire distributed system
ج) Only per message
د) It doesn't need to be unique
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 42 (متوسط)
Message identifiers are essential mainly for:
أ) Faster encryption
ب) Matching requests to replies and enabling reliable delivery
ج) Reducing bandwidth
د) Clock synchronization
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### 🔹 القسم 6: Failure Model لـ Request-reply (Q43–Q52)

### السؤال 43 (متوسط)
If the three primitives are implemented over UDP, they inherit UDP's:
أ) Perfect reliability
ب) Communication failures (omission, etc.)
ج) Encryption
د) Flow control
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 44 (متوسط)
In this context, omission failure means messages:
أ) Are always delivered in order
ب) Are not guaranteed to be delivered in sender order
ج) Are never lost
د) Are always duplicated
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 45 (متوسط)
doOperation uses a timeout while:
أ) Sending the request
ب) Waiting to get the server's reply message
ج) Marshalling data
د) Compiling the IDL
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 46 (متوسط)
The simplest option when a timeout occurs is to:
أ) Crash the client
ب) Return immediately from doOperation with a failure indication
ج) Wait forever
د) Delete the request
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 47 (متوسط)
Another timeout option is for doOperation to:
أ) Give up immediately always
ب) Send the request repeatedly until a reply arrives or failure is reasonably assumed
ج) Never retry
د) Switch to TCP automatically
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 48 (متوسط)
Retransmitting requests can lead to the server:
أ) Never responding
ب) Receiving the request more than once and possibly executing it more than once
ج) Crashing permanently
د) Ignoring all future requests
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 49 (متوسط)
The protocol filters duplicates by recognizing:
أ) Message size
ب) Successive messages from the same client with the same request identifier
ج) Only the IP address
د) Only the timestamp
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 50 (متوسط)
If the server has NOT yet sent the reply when a duplicate arrives, it:
أ) Must restart
ب) Takes no special action — transmits reply when execution finishes
ج) Must re-execute immediately
د) Must discard the original request
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 51 (متوسط)
If the server HAS already sent the reply when a duplicate arrives, it must either:
أ) Ignore it always
ب) Re-execute to obtain the result again, unless the original result was stored
ج) Crash
د) Send an error only
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 52 (متوسط)
A lost reply message and discarding duplicate requests are both part of:
أ) The security model
ب) The failure model of the request-reply protocol
ج) The interaction model only
د) None of the above
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### 🔹 القسم 7: Idempotent Operations & History (Q53–Q60)

### السؤال 53 (متوسط)
An idempotent operation is one that:
أ) Can only be performed once ever
ب) Can be performed repeatedly with the same effect as if performed exactly once
ج) Always fails on repetition
د) Requires a history always
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 54 (متوسط)
A server whose operations are all idempotent:
أ) Must always use a history
ب) Need not take special measures to avoid executing operations more than once
ج) Cannot use request-reply protocol
د) Must reject all duplicates
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 55 (متوسط)
We call an operation that repeatedly performs different results an idempotent operation:
أ) True
ب) False (idempotent = same result/effect each time)
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [نمط 2022-2023] Q34

---

### السؤال 56 (متوسط)
For servers requiring retransmission of replies WITHOUT re-execution, a ________ is used:
أ) Checksum
ب) History
ج) Timeout
د) Dispatcher
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 57 (متوسط)
An entry in a history contains:
أ) Only a timestamp
ب) A request identifier, a message, and a client identifier
ج) Only the IP address
د) Only the result value
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 58 (متوسط)
A problem associated with using a history is:
أ) Too fast processing
ب) Its memory cost
ج) Loss of security
د) Loss of transparency
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 59 (متوسط)
To limit memory cost, the history typically:
أ) Stores every message ever sent forever
ب) Contains only the last reply message per client, and discards messages after a limited time
ج) Stores nothing
د) Duplicates every message
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 60 (متوسط)
Keeping result in a history enables retransmission of replies without:
أ) Marshalling
ب) Re-execution of operations
ج) Using UDP
د) Encryption
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة] + [نمط 2021 فصل ثاني] Q3.c

---

### 🔹 القسم 8: R / RR / RRA Protocols (Q61–Q66)

### السؤال 61 (متوسط)
The three styles of exchange protocols for request-reply are:
أ) TCP, UDP, HTTP
ب) R, RR, RRA
ج) Maybe, At-least, At-most
د) Sync, Async, Hybrid
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 62 (متوسط)
The R (Request) protocol is used when:
أ) A reply is always expected
ب) There is no value to be returned from the remote method
ج) The client needs acknowledgement
د) Security is critical
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 63 (متوسط)
The RR (Request-Reply) protocol is:
أ) Rarely used
ب) Useful for most client-server exchanges
ج) Only for RPC, never RMI
د) Identical to R protocol
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 64 (متوسط)
The RRA protocol is based on the exchange of:
أ) Two messages
ب) Three messages: request, reply, acknowledge-reply
ج) One message only
د) Four messages
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 65 (متوسط)
RRA protocol's extra acknowledge message primarily helps:
أ) Encrypt the data
ب) Confirm receipt of the reply, useful when acknowledgements matter
ج) Increase bandwidth
د) Replace marshalling
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة] + [نمط 2021 فصل أول] Q1.a

---

### السؤال 66 (متوسط)
Which protocol style would be least suitable for a remote call expecting a return value:
أ) R protocol
ب) RR protocol
ج) RRA protocol
د) All are equally suitable
**الإجابة الصحيحة: أ**
**التعليل:** المصدر: [محاضرة]

---

### 🔹 القسم 9: RPC — Interfaces & IDL (Q67–Q73)

### السؤال 67 (متوسط)
An RPC is similar to:
أ) A local variable access
ب) A Remote Method Invocation (RMI)
ج) A network cable
د) A firewall rule
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 68 (متوسط)
RPC is generally implemented over:
أ) TCP handshakes only
ب) A request-reply protocol
ج) Email protocols
د) None of the above
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 69 (متوسط)
Unlike RMI, RPC:
أ) Deals extensively with objects
ب) Does not deal with objects and object references
ج) Only works with Java
د) Requires no interface
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 70 (متوسط)
An interface specifies:
أ) Implementation details only
ب) The procedures and variables that can be accessed, hiding implementation details
ج) Only hardware specs
د) Only security keys
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 71 (متوسط)
The term used for the specification of procedures offered by a server is:
أ) Client stub
ب) Service interface
ج) Dispatcher
د) Communication module
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 72 (متوسط)
Interface Definition Languages (IDLs) allow:
أ) Procedures implemented in different languages to invoke one another
ب) Only C++ procedures to communicate
ج) Direct memory access across networks
د) Bypassing marshalling entirely
**الإجابة الصحيحة: أ**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 73 (متوسط)
An example of an IDL for RPC mentioned in the lecture is:
أ) XML
ب) Sun XDR
ج) JSON
د) CORBA IDL only
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### 🔹 القسم 10: RPC Call Semantics (Q74–Q83)

### السؤال 74 (متوسط)
The three design choices affecting RPC call semantics are:
أ) Marshalling, Unmarshalling, Compiling
ب) Retry request message, Duplicate filtering, Retransmission of results
ج) TCP, UDP, HTTP
د) Location, Access, Failure transparency
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 75 (متوسط)
"Maybe" semantics means the invocation is executed:
أ) Guaranteed exactly once
ب) Once, or not at all — no fault-tolerance measures applied
ج) Always at least twice
د) Never
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 76 (متوسط)
"Maybe" semantics suffers from:
أ) Nothing, it's fully reliable
ب) Message loss and server crash
ج) Only duplicate filtering issues
د) Only marshalling errors
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 77 (متوسط)
"At-least-once" semantics guarantees the invoker:
أ) Exactly one execution always
ب) Execution at least once, or an exception
ج) No result ever
د) Zero executions
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 78 (متوسط)
"At-least-once" semantics can suffer from:
أ) Server crash and arbitrary failures for non-idempotent methods
ب) Nothing at all
ج) Only message loss
د) Only duplicate filtering
**الإجابة الصحيحة: أ**
**التعليل:** المصدر: [محاضرة] + [نمط 2021 فصل ثاني] Q3.b (Arbitrary failures for non-idempotent method)

---

### السؤال 79 (متوسط)
"At-most-once" semantics means the invoker:
أ) Never receives anything
ب) Receives the result, or an exception
ج) Always executes twice
د) Always gets a timeout
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 80 (متوسط)
"At-most-once" semantics prevents:
أ) Nothing
ب) Omission failures (by retrying) and arbitrary failures
ج) Only timing failures
د) Only security threats
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 81 (متوسط)
Which call semantic uses NO retry of request message and NO duplicate filtering:
أ) At-least-once
ب) At-most-once
ج) Maybe
د) RRA
**الإجابة الصحيحة: ج**
**التعليل:** المصدر: [محاضرة] — Figure 6 table

---

### السؤال 82 (متوسط)
Which call semantic retries the request AND filters duplicates AND retransmits reply without re-execution:
أ) Maybe
ب) At-least-once
ج) At-most-once
د) None of the above
**الإجابة الصحيحة: ج**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 83 (متوسط)
Which semantic prevents omission failure:
أ) Maybe
ب) At-least-once
ج) At-most-once
د) None of the above
**الإجابة الصحيحة: ج**
**التعليل:** المصدر: [نمط 2022-2023] Q19

---

### 🔹 القسم 11: تنفيذ RPC (Q84–Q93)

### السؤال 84 (متوسط)
Server Stub in RPC is responsible for:
أ) Marshaling only
ب) Unmarshaling only
ج) Calling the procedure only
د) All of the above (unmarshalling, calling, marshalling result)
**الإجابة الصحيحة: د**
**التعليل:** المصدر: [نمط 2022-2023] Q20

---

### السؤال 85 (متوسط)
Client stub is similar in role to which RMI component:
أ) Skeleton
ب) Proxy
ج) Dispatcher
د) Remote reference module
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة] + [نمط 2022-2023] Q21

---

### السؤال 86 (متوسط)
Server stub is similar in role to which RMI component:
أ) Proxy
ب) Skeleton
ج) Communication module only
د) None of the above
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 87 (متوسط)
The Communication module in RPC implementation is responsible for:
أ) Implementing invocation semantics choices (retransmission, duplicates, retransmission of results)
ب) Only marshalling
ج) Only unmarshalling
د) Only calling the procedure
**الإجابة الصحيحة: أ**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 88 (متوسط)
The Dispatcher's role is to:
أ) Marshal arguments
ب) Select one of the server stub procedures based on the procedure identifier
ج) Unmarshal results only
د) Retry requests
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 89 (متوسط)
The client stub procedure behaves like a local procedure but instead:
أ) Executes the call directly
ب) Marshals the identifier/arguments into a request message and sends it
ج) Deletes the call
د) Ignores the arguments
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 90 (متوسط)
When the reply message arrives at the client, the client stub:
أ) Discards it
ب) Unmarshals the results
ج) Re-marshals it
د) Sends it back to the server
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 91 (متوسط)
Which is true for stub in RPC:
أ) Client stub is similar to skeleton in RMI
ب) There is a stub for each procedure
ج) Server stub is similar to Proxy in RMI
د) None of the above
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [نمط 2022-2023] Q21

---

### السؤال 92 (متوسط)
Client stub, server stub, and dispatcher can be generated automatically by:
أ) The application programmer manually
ب) An interface compiler from the IDL of the service
ج) The operating system kernel
د) None of the above
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 93 (متوسط)
A client accessing a service includes one stub procedure for:
أ) The entire service only once
ب) Each procedure in the service interface
ج) Only the first procedure called
د) No stub procedures at all
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### 🔹 القسم 12: أسئلة مقارنة/مختلطة (Q94–Q100)

### السؤال 94 (متوسط)
An example implementation of RPC mentioned in the lecture is:
أ) Java RMI
ب) Sun RPC
ج) CORBA
د) BitTorrent
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 95 (متوسط)
RPC and RMI both are generally implemented using invocation semantics of:
أ) Only Maybe
ب) At-least-once and At-most-once (generally chosen)
ج) Only RRA
د) None of the above
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 96 (متوسط)
Which best distinguishes RPC from RMI:
أ) They are identical concepts
ب) RPC deals with procedures only; RMI deals with objects/methods and object references
ج) RPC always uses TCP, RMI always uses UDP
د) RMI never uses marshalling
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 97 (متوسط)
Marshalling and external data representation, together with request-reply protocol, form the layer directly below:
أ) UDP/TCP
ب) RMI and RPC
ج) Applications
د) None of the above
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة] — Figure 1

---

### السؤال 98 (متوسط)
Which delivery guarantee choice specifically addresses whether to keep a history of results:
أ) Retry request message
ب) Duplicate filtering
ج) Retransmission of results
د) None of the above
**الإجابة الصحيحة: ج**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 99 (متوسط)
From the same client, using the request identifier to recognize duplicate requests and filter them out is:
أ) A security technique
ب) A request-reply protocol technique for duplicate filtering
ج) A clock synchronization technique
د) None of the above
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [نمط 2021 فصل أول] Q1.b

---

### السؤال 100 (متوسط)
Overall, the correct order of concepts from lowest to highest abstraction in the middleware stack is:
أ) RMI/RPC → UDP/TCP → marshalling → applications
ب) UDP/TCP → marshalling & EDR → request-reply protocol → RMI/RPC → applications
ج) Applications → RMI/RPC → UDP/TCP
د) marshalling → UDP/TCP → RMI/RPC → applications
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة] — Figure 1
## 📌 ملاحظة مراجعة سريعة
أهم نقاط هذه المحاضرة للامتحان (بناءً على تكرارها بالدورات):
- **RPC Call Semantics (Maybe / At-least-once / At-most-once)** — جدول Figure 6 يتكرر بكل صيغة تقريباً (سؤال مقالي أو MCQ).
- **مكونات تنفيذ RPC** (Client stub = Proxy، Server stub = Skeleton، Dispatcher، Communication module) — يتكرر بالمقارنة مع RMI.
- **Idempotent operations** وعلاقتها بإعادة التنفيذ.
- **Marshalling/Unmarshalling** ومن يقوم بها (Middleware وليس المبرمج).
- **الفرق بين CORBA (قيم فقط) وJava serialization/XML (قيم + أنواع)**.
- **R / RR / RRA protocols** ومتى يُستخدم كل منها.
- **أشكال شفافية Middleware الخمسة** (Location, Transport, Hardware, OS, Language).

⚠️ **ملاحظة:** نص هذه المحاضرة انقطع عند بداية قسم RMI ("The object model")؛ إذا رفعت لي بقية سلايدات RMI سأكمل الملف بنفس الأسلوب (شرح + 100 سؤال إضافية خاصة بـ RMI).
