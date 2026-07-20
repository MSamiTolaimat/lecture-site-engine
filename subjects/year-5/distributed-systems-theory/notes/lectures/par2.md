# المحاضرة الثانية: System Model
### د. محسن عبود — Chapter 2, Coulouris

---

## 📖 ملخص المحاضرة (Theory Summary)

### 1) Introduction
- **Architectural Model**: يهتم بترتيب أجزاء النظام والعلاقات بينها → أشهر أمثلته: **Client-Server** و **Peer-to-Peer**.
- تنوعات Client-Server تتشكل عبر: تقسيم/تكرار البيانات بين servers متعاونة، caching عبر proxy servers، استخدام mobile code/agents.
- **Fundamental Models**: وصف رسمي أكثر للخصائص المشتركة بين كل النماذج البنيوية. أهم خاصيتين: **لا يوجد وقت عالمي (no global time)** و **كل التواصل يتم برسائل**.
- خصائص تواصل الرسائل: **Delay, Failure, Security attacks** → تُعالَج عبر 3 نماذج:

| النموذج | يهتم بـ |
|---|---|
| **Interaction Model** | الأداء وصعوبة تحديد حدود زمنية |
| **Failure Model** | تحديد دقيق للأعطال التي تصيب processes وقنوات الاتصال |
| **Security Model** | التهديدات المحتملة على processes وقنوات الاتصال |

### 2) Architectural Models

**مفهوم Architecture:** بنية النظام من حيث مكونات محددة بشكل منفصل وعلاقاتها. الهدف: **Reliable, Manageable, Adaptable, Cost-effective**.
تُصنَّف الـ processes إلى: **Server, Client, Peer**.

#### Client-Server Model
- الأكثر شيوعاً. Client يتفاعل مع server منفصل للوصول لموارد مُدارة.
- **Server قد يكون Client لخادم آخر** (مثال: محرك بحث يستجيب لطلبات المتصفح، ويعمل كـ client لـ web crawlers تجاه خوادم أخرى).
- **Three-tier Web Applications** (Figure 3).

#### Peer-to-Peer Model
- كل الـ processes تلعب **أدواراً متشابهة**، تتفاعل تعاونياً كـ peers **دون تمييز** بين client/server.
- مثال: **BitTorrent**.
- **Super Peers architecture** (Figure 5).

#### Variants of Client-Server Model
المشكلة: وضع الخدمة على عنوان واحد **لا يتوسّع** بشكل جيد (bandwidth/capacity محدودة). الحلول:

| المتغيّر | الفكرة | مثال |
|---|---|---|
| **Services by multiple servers** | تقسيم أو تكرار الكائنات بين عدة hosts | Cluster (search engines) |
| **Proxy servers & caches** | تخزين نسخ محدّثة مؤقتاً، بجانب client أو في proxy مشترك | Web proxy |
| **Mobile code** | كود يُرسل من computer لآخر ويُنفَّذ بالوجهة — تهديد أمني محتمل | Web applets |
| **Mobile agents** | برنامج (كود+بيانات) يتنقل بين الحواسيب لتنفيذ مهمة نيابة عن عملية أخرى — تهديد أمني بالاتجاهين | جمع معلومات، تثبيت/صيانة برمجيات |

### 3) Fundamental Models

#### Interaction Model
- عدة server processes قد تتعاون (DNS)، أو peer processes (voice conferencing).
- عاملان مؤثران: **أداء الاتصال محدود**، و**استحالة وجود وقت عالمي واحد**.

**أداء قنوات الاتصال:**
| الخاصية | التعريف |
|---|---|
| **Latency** | التأخير بين بدء إرسال رسالة وبداية استلامها |
| **Bandwidth** | إجمالي كمية المعلومات القابلة للنقل بوحدة زمن (تُقسَّم بين القنوات على نفس الشبكة) |
| **Jitter** | التفاوت بزمن توصيل سلسلة رسائل — مهم جداً بالوسائط المتعددة (Multimedia) |

**ساعات الحاسوب (Computer Clock):**
- كل computer له ساعة داخلية خاصة، تُستخدم لعمل timestamp للأحداث.
- حتى لو قُرئت الساعتان بنفس اللحظة، قد تعطيان وقتاً مختلفاً بسبب **Clock Drift** (الانحراف عن الوقت المثالي، بمعدلات مختلفة).
- حتى لو ضُبطت كل الساعات بنفس الوقت بدايةً، ستتباعد لاحقاً ما لم تُصحَّح.

**نموذجا الوقت (Two Variants of Interaction Model):**

| | Synchronous Distributed System | Asynchronous Distributed System |
|---|---|---|
| افتراض الوقت | افتراض قوي للوقت | لا يوجد أي افتراض للوقت |
| تنفيذ كل خطوة | حدود دنيا/عليا معروفة | بدون حدود (أي زمن) |
| توصيل الرسائل | ضمن وقت محدد معروف (Tmax) | بدون حدود (بعد أي وقت) |
| انحراف الساعة | حدّ معروف للانحراف | انحراف عشوائي (Arbitrary) |
| اكتشاف الفشل | **ممكن** (لأن كل الأوقات معروفة/محدودة) | **غير ممكن** — لا يمكن التمييز بين process بطيء وprocess معطّل (crashed) |

#### Failure Model
كلا الـ processes وقنوات الاتصال قد **تفشل** — أي تنحرف عن السلوك الصحيح/المرغوب. الأنواع:

| النوع | التعريف | مثال |
|---|---|---|
| **Omission Failure** | فشل بتنفيذ إجراء مطلوب. الأخطر: **Crash** (توقف كامل، لا يكمل أي خطوة). أيضاً: **Communication omission** (فقدان رسالة/dropping messages) | فقدان buffer، خطأ نقل بالشبكة يكتشفه checksum |
| **Arbitrary Failure** | أسوأ حالة فشل ممكنة — أي نوع خطأ | قيمة بيانات خاطئة، رسائل تُسلَّم أكثر من مرة، محتوى تالف |
| **Timing Failure** | تنطبق فقط على الأنظمة المتزامنة (Synchronous) — تجاوز الحدود الزمنية المحددة | تأخر تنفيذ، تأخر توصيل رسالة، انحراف ساعة يتجاوز الحد |

**Masking Failure (إخفاء الفشل):**
- يمكن بناء خدمات موثوقة من مكونات معرّضة للفشل (مثال: servers مكررة تستمر بالعمل رغم تعطّل واحد منها).
- الإخفاء إما بإخفاء الفشل كلياً، أو **تحويله لنوع أكثر قبولاً**.
- ⭐ مثال أساسي متكرر: **Checksums تحوّل Arbitrary failure إلى Omission failure**.

#### Security Model
- الأمان يتحقق عبر تأمين الـ processes وقنوات الاتصال، وحماية الكائنات (objects) من الوصول غير المصرح.

**حماية الكائنات:**
| المفهوم | التعريف |
|---|---|
| **Access Rights** | تحدد من يُسمح له بتنفيذ عمليات (قراءة/كتابة) على كائن |
| **Principal** | السلطة المرتبطة بكل استدعاء ونتيجة — قد يكون مستخدم أو process. الاستدعاء يأتي من user، والنتيجة من server |

- مسؤوليات الـ Server: التحقق من هوية الـ principal، التحقق من كفاية صلاحياته، رفض من لا يملكها (Figure 10).

**The Enemy (نموذج التهديد):**
- نفترض عدواً قادراً على إرسال أي رسالة لأي process، وقراءة/نسخ أي رسالة بين زوج processes (Figure 11).
- التهديدات:
  - **تهديدات للـ processes**: عدم معرفة المصدر الحقيقي للرسالة (مثال: spoofing mail server)
  - **تهديدات لقنوات الاتصال**: تهديد لخصوصية وسلامة الرسائل، تُدفَع بـ secure channels

**Defeating Security Threats:**
- **Cryptography and shared secrets**: التشفير Encryption = تشويش محتوى الرسالة لإخفائه
- **Authentication**: تُبنى على الأسرار المشتركة والتشفير للتحقق من صحة الرسائل

---

## ✅ 100 سؤال MCQ (مبنية على نص المحاضرة + أنماط الدورات السابقة)

> ترميز المصدر: **[محاضرة]** = من نص السلايدات مباشرة | **[نمط 2022-2023]** / **[نمط 2025]** / **[نمط 2021]** = مبني على نمط سؤال ظهر بنفس الصياغة أو قريب منها في تلك الدورة.

### 🔹 القسم 1: مقدمة عامة (Q1–Q5)

### السؤال 1 (متوسط)
An architectural model of a distributed system is concerned with:
أ) Security threats only
ب) Placement of parts and relationships between them
ج) Clock synchronization only
د) Data encryption
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 2 (متوسط)
Variations of the client-server model can be formed by all EXCEPT:
أ) Partition/replication at cooperative servers
ب) Caching by proxy servers and clients
ج) Mobile code and mobile agents
د) Global clock synchronization
**الإجابة الصحيحة: د**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 3 (متوسط)
Fundamental Models deal with:
أ) A specific implementation only
ب) A more formal description of properties common to all architectural models
ج) Only security issues
د) Only client-server systems
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 4 (متوسط)
Which is a common property of all distributed systems per the Fundamental Models:
أ) A single global clock exists
ب) No global time exists; all communication is via messages
ج) All processes share memory
د) Failures never occur
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 5 (متوسط)
Message communication in distributed systems has which three properties:
أ) Speed, cost, size
ب) Delay, Failure, Security attacks
ج) Encryption, routing, caching
د) Latency, throughput, jitter only
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### 🔹 القسم 2: النماذج الثلاثة (Interaction/Failure/Security) (Q6–Q10)

### السؤال 6 (متوسط)
A model to deal with time limits in distributed systems is:
أ) Interaction model
ب) Fault model
ج) Security model
د) Object model
**الإجابة الصحيحة: أ**
**التعليل:** المصدر: [محاضرة] + [نمط 2022-2023] Q6

---

### السؤال 7 (متوسط)
The model that gives a precise specification of faults exhibited by processes and channels is:
أ) Interaction model
ب) Failure model
ج) Security model
د) Architectural model
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 8 (متوسط)
The model that discusses possible threats to processes and channels is:
أ) Interaction model
ب) Failure model
ج) Security model
د) None of the above
**الإجابة الصحيحة: ج**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 9 (متوسط)
Architecture of a system is defined as its structure in terms of:
أ) Physical hardware only
ب) Separately specified components and their interrelationships
ج) Programming languages used
د) Security policies only
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 10 (متوسط)
Major concerns of a good distributed system architecture include all EXCEPT:
أ) Reliable
ب) Manageable
ج) Adaptable, Cost-effective
د) Fully centralized
**الإجابة الصحيحة: د**
**التعليل:** المصدر: [محاضرة]

---

### 🔹 القسم 3: Client-Server Model (Q11–Q20)

### السؤال 11 (متوسط)
Client-Server is described as:
أ) A rare architecture
ب) The most often used architecture for distributed systems
ج) Only used in P2P systems
د) Obsolete
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 12 (متوسط)
A search engine that responds to browser queries AND runs web crawlers acting as clients of other servers illustrates:
أ) Peer-to-Peer only
ب) A server that is also a client
ج) Pure client role only
د) A security threat
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 13 (متوسط)
In the Client-Server model, client processes interact with:
أ) Other clients only
ب) Individual server processes on separate host computers
ج) Peer processes only
د) The operating system directly
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 14 (متوسط)
Three-tier Web Applications is an example architecture shown in:
أ) Figure 1
ب) Figure 2
ج) Figure 3
د) Figure 5
**الإجابة الصحيحة: ج**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 15 (متوسط)
Major implications of dividing responsibilities between components include:
أ) Performance, Reliability, Security
ب) Only cost
ج) Only speed
د) Only aesthetics
**الإجابة الصحيحة: أ**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 16 (متوسط)
Client-Server model, according to the initial process classification, is built around:
أ) Object and thread concepts only
ب) Process and object concepts
ج) Only network packets
د) Only file systems
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 17 (متوسط)
Servers may in turn be:
أ) Only peers
ب) Clients of other servers
ج) Never clients
د) Only user interfaces
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 18 (متوسط)
Which of the following classifications of processes is mentioned in the lecture:
أ) Server, Client, Peer processes
ب) Master, Slave, Worker only
ج) Primary, Secondary only
د) Root, Leaf only
**الإجابة الصحيحة: أ**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 19 (متوسط)
The division of responsibilities and placement of components on network computers is:
أ) Irrelevant to system design
ب) The most evident aspect of distributed system design
ج) Only relevant to security
د) Fixed and unchangeable
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 20 (متوسط)
According to distributed operating systems, autonomy for users is:
أ) Never preserved
ب) Preserved
ج) Only preserved for servers
د) Irrelevant
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [نمط 2022-2023] Q31

---

### 🔹 القسم 4: Peer-to-Peer Model (Q21–Q28)

### السؤال 21 (متوسط)
In the Peer-to-Peer model, all processes:
أ) Have distinct client/server roles
ب) Play similar roles, interacting cooperatively as peers
ج) Never communicate
د) Must run on the same computer
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 22 (متوسط)
A classic example of a Peer-to-Peer application is:
أ) A search engine
ب) BitTorrent
ج) DNS
د) Web proxy
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة] + [نمط 2021 فصل ثاني] Q2.d

---

### السؤال 23 (متوسط)
Peer-to-Peer architecture involves distributed activities/computations:
أ) With strict client-server distinction
ب) Without any distinction between clients and servers
ج) Only among servers
د) Only among clients
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 24 (متوسط)
The "Super Peers" architecture is illustrated in:
أ) Figure 3
ب) Figure 4
ج) Figure 5
د) Figure 8
**الإجابة الصحيحة: ج**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 25 (متوسط)
If we are concerned with performance, which model choice is generally emphasized:
أ) Depends on system design goals (Client-Server vs P2P trade-offs)
ب) Peer-to-Peer is always best
ج) Client-Server is always best
د) Neither matters
**الإجابة الصحيحة: أ**
**التعليل:** المصدر: [نمط 2022-2023] Q33 (مرتبط بمقارنة النماذج)

---

### السؤال 26 (متوسط)
Peer processes in P2P cooperate to achieve:
أ) Individual isolated goals
ب) A common goal/distributed activity
ج) No goal
د) Only file storage
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 27 (متوسط)
Which best distinguishes P2P from Client-Server:
أ) P2P has one central authority
ب) P2P has no distinction between client and server roles
ج) Client-Server has no server
د) They are identical
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 28 (متوسط)
Sharable objects among peers (Figure 4) are accessed via:
أ) A single central server only
ب) Direct interaction among peer applications
ج) A proxy only
د) None of the above
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### 🔹 القسم 5: متغيرات Client-Server (Q29–Q43)

### السؤال 29 (متوسط)
The core problem with placing a service at a single server address is:
أ) Too much security
ب) It doesn't scale beyond host capacity and network bandwidth
ج) Too much redundancy
د) None of the above
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة] + [نمط 2021 فصل ثاني] Q2

---

### السؤال 30 (متوسط)
"Services provided by multiple servers" may involve:
أ) Partitioning objects among servers, or replicating them
ب) Only partitioning, never replication
ج) Only replication, never partitioning
د) Neither
**الإجابة الصحيحة: أ**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 31 (متوسط)
A Cluster used for search engines is an example of:
أ) Mobile code
ب) Services provided by multiple servers
ج) Proxy caching
د) Mobile agents
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 32 (متوسط)
A cache is defined as:
أ) A permanent data store
ب) A store of recently used data objects
ج) A type of firewall
د) A security protocol
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 33 (متوسط)
When a client needs an object, the caching service first:
أ) Fetches from the origin server directly
ب) Checks the cache and supplies from there if up-to-date
ج) Ignores the cache
د) Deletes the cache
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 34 (متوسط)
Caches may be located:
أ) Only at the client
ب) Only at a proxy server
ج) Co-located with each client OR at a shared proxy server
د) Never at the client
**الإجابة الصحيحة: ج**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 35 (متوسط)
Mobile code is defined as:
أ) Code that never moves
ب) Code sent from one computer to another to run at the destination
ج) A type of encryption
د) A hardware component
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 36 (متوسط)
Mobile code (such as applets) poses a potential security threat to:
أ) The sender only
ب) Local resources at the destination computer
ج) The network router only
د) No one
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 37 (متوسط)
Web applets are illustrated in the lecture as an example of:
أ) Mobile agents
ب) Mobile code
ج) Peer-to-Peer
د) Proxy caching
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 38 (متوسط)
A mobile agent is defined as:
أ) Static code only
ب) A running program (code + data) that travels between computers to perform a task
ج) A type of cache
د) A security protocol only
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 39 (متوسط)
Tasks performed by mobile agents may include:
أ) Only encryption
ب) Collecting information; installing/maintaining software
ج) Only rendering graphics
د) None of the above
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 40 (متوسط)
Mobile agents pose a security threat:
أ) Only to the visited computer
ب) To both the visited computer's resources AND the agent itself
ج) To neither
د) Only to the origin computer
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 41 (متوسط)
A mobile agent may fail to complete its task if:
أ) It has too much memory
ب) It is refused access to needed information
ج) It runs too fast
د) None of the above
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 42 (متوسط)
The difference between mobile agent and mobile code is:
أ) They are identical
ب) A mobile agent carries both code AND data and acts on behalf of a process; mobile code is just code sent to run remotely
ج) Mobile code carries data only
د) Neither carries code
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة] — [نمط 2022-2023] Q7 (Possible security threat: Mobile agent/Mobile code/Both)

---

### السؤال 43 (متوسط)
Possible security threats to local resources include:
أ) Mobile agent only
ب) Mobile code only
ج) Both mobile agent and mobile code
د) Neither
**الإجابة الصحيحة: ج**
**التعليل:** المصدر: [نمط 2022-2023] Q7

---

### 🔹 القسم 6: Interaction Model - مقدمة (Q44–Q48)

### السؤال 44 (متوسط)
Multiple server processes cooperating to provide a service is exemplified by:
أ) Voice conferencing
ب) Domain Name Service (DNS)
ج) A single client request
د) None of the above
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 45 (متوسط)
Peer processes cooperating to achieve a common goal is exemplified by:
أ) DNS
ب) Voice conferencing
ج) Web caching
د) Mobile code
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 46 (متوسط)
Two significant factors affecting interacting processes in a distributed system are:
أ) Cost and hardware type
ب) Communication performance limits and impossibility of a single global time
ج) Programming language and OS
د) Encryption and compression
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 47 (متوسط)
Communication performance is often described as:
أ) Unlimited
ب) A limiting characteristic
ج) Irrelevant to interaction
د) Only relevant to security
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 48 (متوسط)
It is impossible in a distributed system to maintain:
أ) Multiple local clocks
ب) A single global notion of time
ج) Any communication
د) Any process
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### 🔹 القسم 7: أداء قنوات الاتصال (Q49–Q58)

### السؤال 49 (متوسط)
Latency is defined as:
أ) Total data transmitted per time unit
ب) The delay between start of transmission and beginning of receipt
ج) Variation in delivery time
د) Clock drift rate
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 50 (متوسط)
Bandwidth is defined as:
أ) The total amount of information transmittable over a network in a given time
ب) The delay of a single message
ج) The variation in delivery time
د) The number of processes
**الإجابة الصحيحة: أ**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 51 (متوسط)
Communication channels using the same network must:
أ) Never interfere
ب) Share the available bandwidth
ج) Use separate physical wires always
د) Ignore bandwidth limits
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 52 (متوسط)
Jitter is defined as:
أ) The delay of the first message only
ب) The variation in time taken to deliver a series of messages
ج) The total bandwidth used
د) The clock drift rate
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 53 (متوسط)
Jitter is particularly relevant to:
أ) Text files
ب) Multimedia data (e.g., audio)
ج) Static images only
د) Database backups
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 54 (متوسط)
If consecutive audio samples are played with differing time intervals due to jitter, the result is:
أ) Improved quality
ب) Badly distorted sound
ج) No effect
د) Faster playback
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 55 (متوسط)
Which communication performance characteristic concerns delay of a SINGLE message:
أ) Latency
ب) Bandwidth
ج) Jitter
د) Throughput
**الإجابة الصحيحة: أ**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 56 (متوسط)
Which communication performance characteristic concerns delay VARIATION across MULTIPLE messages:
أ) Latency
ب) Bandwidth
ج) Jitter
د) None of the above
**الإجابة الصحيحة: ج**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 57 (متوسط)
Which is NOT one of the three communication channel performance characteristics mentioned:
أ) Latency
ب) Bandwidth
ج) Jitter
د) Encryption strength
**الإجابة الصحيحة: د**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 58 (متوسط)
High jitter would be most problematic for:
أ) A text email
ب) A live voice/video call
ج) A one-time file download
د) A static webpage
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة] — تطبيق

---

### 🔹 القسم 8: ساعات الحاسوب (Q59–Q66)

### السؤال 59 (متوسط)
Each computer in a distributed system has:
أ) A shared global clock
ب) Its own internal clock
ج) No clock at all
د) A clock synced perfectly with all others
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 60 (متوسط)
Even if two processes read their clocks at exactly the same moment, they may:
أ) Always get identical values
ب) Supply different time values
ج) Both crash
د) Stop functioning
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 61 (متوسط)
Clock drift refers to:
أ) The exact synchronization of all clocks
ب) The relative amount a computer clock differs from a perfect reference clock
ج) A type of security threat
د) A network protocol
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 62 (متوسط)
Differences between two clock readings is called clock drift:
أ) True
ب) False
**الإجابة الصحيحة: أ**
**التعليل:** المصدر: [نمط 2022-2023] Q26

---

### السؤال 63 (متوسط)
Even if all computer clocks are initially set to the same time, they will:
أ) Stay perfectly synced forever
ب) Eventually vary significantly unless corrected
ج) Stop working
د) Merge into one clock
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 64 (متوسط)
Clock drift rates across different computers are:
أ) Always identical
ب) Different from one another
ج) Irrelevant
د) Always zero
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 65 (متوسط)
Timestamps associated with events by two processes on different computers rely on:
أ) A single shared clock
ب) Each process's own local clock
ج) No clock at all
د) The server's clock only
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 66 (متوسط)
Correcting clock drift over time requires:
أ) Nothing, it self-corrects
ب) Applying corrections/synchronization
ج) Replacing the hardware only
د) Ignoring the issue
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### 🔹 القسم 9: Synchronous vs Asynchronous Systems (Q67–Q76)

### السؤال 67 (متوسط)
In a Synchronous Distributed System, the time to execute each step of a process has:
أ) No bounds
ب) Known lower and upper bounds
ج) Only an upper bound
د) Only a lower bound
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 68 (متوسط)
In a Synchronous system, each message transmitted over a channel is received within:
أ) An unknown time
ب) A known bounded time
ج) Zero time always
د) Infinite time
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 69 (متوسط)
In a Synchronous system, the drift rate of each process's local clock:
أ) Has no bound
ب) Has a known bound
ج) Is always zero
د) Is irrelevant
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 70 (متوسط)
In an Asynchronous Distributed System, there is:
أ) A strong assumption of time
ب) No assumption about time at all
ج) A partial assumption only
د) A perfect global clock
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 71 (متوسط)
In Asynchronous systems, a message may be received:
أ) Only within Tmax
ب) After an arbitrary long time
ج) Instantly always
د) Never
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 72 (متوسط)
In Asynchronous systems, the drift rate of a clock is:
أ) Bounded
ب) Zero
ج) Arbitrary
د) Predictable
**الإجابة الصحيحة: ج**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 73 (متوسط)
It is possible to detect process failure in Synchronous distributed systems because:
أ) There is no timing information
ب) Known bounds (Tmax) on execution/message delivery make timing sufficient to detect failure
ج) Failures never occur
د) All processes are identical
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة] + [نمط 2021 فصل ثاني] Q3.a

---

### السؤال 74 (متوسط)
It is NOT possible to reliably detect process failure in Asynchronous distributed systems because:
أ) There are known bounds
ب) We cannot distinguish a crashed process from a slowly running one (no bounds on delays/speeds)
ج) There is too much bandwidth
د) Clocks are perfectly synced
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة] + [نمط 2021 فصل ثاني] Q3.b

---

### السؤال 75 (متوسط)
Which system type has a "strong assumption of time":
أ) Synchronous
ب) Asynchronous
ج) Both equally
د) Neither
**الإجابة الصحيحة: أ**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 76 (متوسط)
If Ttrans is set to the mid-value of bounds for a synchronous system, then Ttrans equals:
أ) max only
ب) min only
ج) (min + max) / 2
د) max - min
**الإجابة الصحيحة: ج**
**التعليل:** المصدر: [محاضرة] — مرتبط بحساب clock skew

---

### 🔹 القسم 10: Failure Model - الأنواع الثلاثة (Q77–Q88)

### السؤال 77 (متوسط)
Omission failures refer to cases when a process or channel:
أ) Performs extra unwanted actions
ب) Fails to perform actions it is supposed to do
ج) Performs actions too fast
د) Never fails
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 78 (متوسط)
The chief omission failure of a process is to:
أ) Slow down
ب) Crash (halt and execute no further steps)
ج) Restart automatically
د) Duplicate itself
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 79 (متوسط)
A communication channel produces an omission failure when it:
أ) Delivers a message twice
ب) Fails to transport a message from sender's outgoing buffer to receiver's incoming buffer ("dropping messages")
ج) Corrupts message content
د) Delivers a message too early
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 80 (متوسط)
Dropping messages is generally caused by:
أ) Too much bandwidth
ب) Lack of buffer space at receiver/gateway, or a network transmission error
ج) Perfect synchronization
د) Excess security
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 81 (متوسط)
Arbitrary failure describes:
أ) The mildest possible failure
ب) The worst possible failure semantics, where any type of error may occur
ج) Only timing issues
د) Only crashes
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 82 (متوسط)
A process setting a wrong value in its data items or returning a wrong response is an example of:
أ) Omission failure
ب) Arbitrary failure
ج) Timing failure
د) Masking failure
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 83 (متوسط)
Messages delivered more than once, or with corrupted content, are examples of:
أ) Omission failure
ب) Arbitrary failure (in communication channels)
ج) Timing failure
د) Masking failure
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة] + [نمط 2022-2023] Q9

---

### السؤال 84 (متوسط)
When a process fails to perform an action, this is classified as:
أ) Arbitrary failure
ب) Omission failure
ج) Timing failure
د) None of the above
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [نمط 2022-2023] Q8

---

### السؤال 85 (متوسط)
Timing failures are only applicable in:
أ) Asynchronous systems
ب) Synchronized (synchronous) distributed systems, where time limits are set
ج) All systems equally
د) No systems
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 86 (متوسط)
Timing failures relate to exceeding limits on:
أ) Process execution time, message delivery time, and clock drift rate
ب) Only execution time
ج) Only message delivery
د) Only clock drift
**الإجابة الصحيحة: أ**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 87 (متوسط)
Which failure type is NOT applicable to purely asynchronous systems (since there are no time bounds to violate):
أ) Omission
ب) Arbitrary
ج) Timing
د) All are applicable
**الإجابة الصحيحة: ج**
**التعليل:** المصدر: [محاضرة] — استنتاج

---

### السؤال 88 (متوسط)
Which is not true regarding principal (relates to Security, but grouped with failure/process concepts in exams):
أ) Authority for each result
ب) Authority for each invocation
ج) May be user or process
د) Represents message passing
**الإجابة الصحيحة: د**
**التعليل:** المصدر: [نمط 2022-2023] Q11

---

### 🔹 القسم 11: Masking Failure (Q89–Q93)

### السؤال 89 (متوسط)
Masking a failure means:
أ) Always crashing the system
ب) Hiding the failure altogether, or converting it into a more acceptable type
ج) Ignoring all failures permanently
د) Doubling the failure rate
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 90 (متوسط)
Multiple servers holding replicas of data that continue providing service when one crashes is an example of:
أ) Timing failure
ب) Masking failure
ج) Arbitrary failure
د) None of the above
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 91 (متوسط)
Checksums are used to mask corrupted messages by converting:
أ) An omission failure into an arbitrary failure
ب) An arbitrary failure into an omission failure
ج) A timing failure into an arbitrary failure
د) Nothing, checksums don't mask failures
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة] — نقطة أساسية متكررة جداً

---

### السؤال 92 (متوسط)
A technique used to convert a failure into an acceptable one is:
أ) Detecting only
ب) Masking
ج) Ignoring
د) Duplicating
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [نمط 2022-2023] Q10

---

### السؤال 93 (متوسط)
It is possible to construct reliable services from components that:
أ) Never fail
ب) Exhibit failure (via masking techniques)
ج) Have no clock
د) Are always synchronous
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### 🔹 القسم 12: Security Model - حماية الكائنات (Q94–Q100)

### السؤال 94 (متوسط)
Access rights specify:
أ) Network bandwidth limits
ب) Who is allowed to perform operations (read/write) on an object
ج) Clock synchronization rules
د) Message formats
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 95 (متوسط)
A "Principal" is defined as:
أ) Only a human user
ب) The authority associated with each invocation and each result — may be a user or a process
ج) Only a server process
د) A type of communication channel
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 96 (متوسط)
Which is NOT true regarding a principal:
أ) Authority for each result
ب) Authority for each invocation
ج) May be a user or process
د) Represents message passing
**الإجابة الصحيحة: د**
**التعليل:** المصدر: [نمط 2022-2023] Q11

---

### السؤال 97 (متوسط)
The invocation in a client-server interaction comes from a ________, and the result from a ________:
أ) Server, user
ب) User, server
ج) Enemy, user
د) Server, enemy
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 98 (متوسط)
The server is responsible for all of the following EXCEPT:
أ) Verifying the identity of the principal
ب) Checking sufficient access rights
ج) Rejecting unauthorized requests
د) Encrypting the client's local storage
**الإجابة الصحيحة: د**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 99 (متوسط)
The "enemy" model assumes an adversary capable of:
أ) Only reading messages, never sending
ب) Sending any message to any process, and reading/copying any message between a pair of processes
ج) Nothing — enemies cannot interact with the system
د) Only attacking servers, not clients
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة] — نفس رسم Figure 11 اللي تكرر بالدورات

---

### السؤال 100 (متوسط)
Threats to communication channels (e.g., email) primarily concern:
أ) Processing speed
ب) Privacy and integrity of messages — defeated using secure channels
ج) Clock drift
د) Bandwidth allocation
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]
## 📌 ملاحظة مراجعة سريعة
أكثر نقاط هذه المحاضرة تكراراً بالامتحانات الفعلية:
- **Synchronous vs Asynchronous** وقدرة كل منهما على كشف فشل الـ process (سؤال مقالي وMCQ متكرر بـ3 دورات على الأقل)
- **أنواع الفشل الثلاثة** (Omission/Arbitrary/Timing) + التفرقة بينها بالأمثلة
- **Masking failure**: تحويل Arbitrary → Omission عبر Checksums (نقطة حرجة تتكرر)
- **Client-Server مقابل Peer-to-Peer** ومتغيرات Client-Server (خصوصاً Cluster وMobile code/agents)
- **Principal + Access rights + The Enemy** بالـ Security Model (رسم الشكل 11 يتكرر حرفياً بالأسئلة المقالية)
