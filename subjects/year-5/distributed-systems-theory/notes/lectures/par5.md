# المحاضرة الخامسة: Operating System Support
### د. محسن عبود — Chapter 7, Coulouris

---

## 📖 ملخص المحاضرة (Theory Summary)

### 1) Introduction
- Resource sharing جانب أساسي بالأنظمة الموزعة؛ الـ clients يستدعون عمليات على موارد غالباً بـ node/process آخر.
- الـ Applications (clients) والـ Services (resource managers) تستخدم **طبقة الـ Middleware** للتفاعل — تُمكّن التواصل البعيد بين objects/processes (مثال: RPC, Java RMI).
- تحت طبقة الـ Middleware توجد طبقة **Operating System (OS)**: توفر للمبرمج تجريدات (مثل files بدل disk blocks)، وتدير الموارد الفيزيائية عبر **system-call interface**.

**نوعان من الـ OS ظهرا مع تطور الأنظمة الموزعة:**

| النوع | التعريف | ملاحظات |
|---|---|---|
| **Distributed Operating System** | المستخدمون **لا يهتمون أبداً** بمكان تشغيل برامجهم أو موقع الموارد؛ يوجد **Single System Image** واحد؛ الـ OS يتحكم بكل الـ nodes ويضع العمليات بشفافية حسب سياسات الجدولة | تم بحث عدة أنظمة كهذه لكن **لا يوجد أي منها بالاستخدام الواسع/العام** (أمثلة: HarmonyOS, BlueOS, MINIX) |
| **Network Operating System** | تملك قدرة شبكية مدمجة تسمح بالوصول للموارد البعيدة | **مستخدمة على نطاق واسع** لأسباب تقنية وغير تقنية (مثال: Unix, Windows) |

**لماذا Network OS أكثر انتشاراً من Distributed OS؟**
1. المستخدمون استثمروا كثيراً بتطبيقاتهم البرمجية؛ لن يتبنوا OS جديد لا يشغّل تطبيقاتهم.
2. المستخدمون يفضلون درجة من **الاستقلالية (Autonomy)** لأجهزتهم حتى ضمن منظمة واحدة.

- **مزيج Middleware + Network OS** يوفر توازناً مقبولاً بين متطلب الاستقلالية والوصول الشفاف للموارد عبر الشبكة:
  - Network OS يسمح للمستخدمين بتشغيل تطبيقاتهم المستقلة المفضلة (word processor مثلاً).
  - Middleware يمكّن المستخدمين من الاستفادة من الخدمات المتاحة بنظامهم الموزع.

### 2) The Operating System Layer
**Figure 1 — System Layers:**
```
Applications, services
─────────────────────────
Middleware
─────────────────────────
OS: kernel, libraries & servers   (Node 1)     OS: kernel, libraries & servers   (Node 2)
Processes, threads, communication...           Processes, threads, communication...
─────────────────────────
Computer & network hardware
```
- **Kernels وserver processes** هما المكونان المسؤولان عن إدارة الموارد وتقديم واجهة للـ clients.

**الوظائف التي يوفرها الـ OS Layer:**

| الوظيفة | الشرح |
|---|---|
| **Encapsulation** | تقديم service interface مفيد للموارد |
| **Protection** | الموارد تحتاج حماية من الوصول غير المشروع |
| **Concurrent Processing** | الـ clients قد يشاركون الموارد ويصلون إليها بشكل متزامن |

- الـ clients تصل للموارد عبر عمل **RMI** لكائن server.
- **Invocation mechanism**: وسيلة الوصول لمورد مُغلَّف (encapsulated).

**Figure 2 — مكونات الـ Core OS:**

| المكوّن | الدور |
|---|---|
| **Process Manager** | إنشاء العمليات (processes) والعمليات المُجراة عليها |
| **Thread Manager** | إنشاء الـ threads، مزامنتها، وجدولتها |
| **Memory Manager** | إدارة الذاكرة الفيزيائية والافتراضية |
| **Communication Manager** | التواصل بين الـ threads |
| **Supervisor** | توزيع (dispatching) المقاطعات (interrupts)، استدعاءات النظام (system calls)، والاستثناءات الأخرى |

### 3) Processes and Threads

**مشكلة الـ Process التقليدي:**
- المفهوم التقليدي لـ process (ينفّذ نشاطاً واحداً فقط) لم يكن كافياً لمتطلبات الأنظمة الموزعة.
- المشكلة: الـ process التقليدي يجعل المشاركة بين الأنشطة المترابطة **غير مريحة ومكلفة**.
- **الحل**: تعزيز مفهوم الـ process ليرتبط بأنشطة متعددة (**Threads**).

**التعريفات:**
| المفهوم | التعريف |
|---|---|
| **Process** | يتكوّن من **execution environment** + واحد أو أكثر من الـ **threads** |
| **Thread** | تجريد نظام التشغيل لنشاط (activity) واحد |
| **Execution Environment** | وحدة إدارة الموارد: مجموعة موارد محلية يديرها الـ kernel، تصل إليها threads الـ process |

**Execution Environment يتكوّن من:**
1. **Address space**
2. موارد مزامنة وتواصل الـ threads (semaphores, sockets)
3. موارد عليا (higher-level) مثل الملفات المفتوحة والنوافذ

> ملاحظة: إنشاء وإدارة Execution Environment **مكلف عادة**، لكن عدة threads يمكن أن تتشاركه.

**أهداف وجود Threads متعددة:**
- **زيادة درجة التنفيذ المتزامن (Concurrent execution)** بين العمليات.
- تمكين تداخل (overlap) الحوسبة مع عمليات الإدخال/الإخراج (I/O).
- تمكين المعالجة المتزامنة على multiprocessors.

**فائدة الـ Threads بالسيرفرات:**
- المعالجة المتزامنة لطلبات الـ clients تقلّل ميل السيرفرات لتصبح **bottleneck**.
- مثال: thread واحد يعالج طلب client بينما thread آخر (يخدم طلباً آخر) ينتظر انتهاء وصول قرص (disk access).

**بنى Threading بديلة للسيرفر:**
1. **Thread-per-request**
2. **Thread-per-connection**
3. **Thread-per-object remote**

**فائدة الـ Threads بالعملاء (Clients) — Figure 3:**
- Client process بـ threadين:
  - **Thread 1**: يُنتج نتائج لتُرسل للسيرفر عبر RMI
  - **Thread 2**: يقوم بعمل RMI الفعلية للسيرفر، ويُحجَب (blocks) بينما Thread 1 يستمر بحساب نتائج إضافية

**Processes مقابل Threads (مقارنة مباشرة):**

| المقارنة | الملاحظة |
|---|---|
| إنشاء thread جديد ضمن process | **أرخص** من إنشاء process جديد |
| التبديل (switching) بين threads بنفس process | **أرخص** من التبديل بين threads تابعة لـ processes مختلفة |
| مشاركة البيانات/الموارد | threads بنفس process تشترك **بسهولة وكفاءة** مقارنة بـ processes منفصلة |
| الحماية | threads بنفس process **غير محمية** من بعضها البعض |

### 4) Operating System Architecture
- مثالياً، الـ kernel يوفر فقط الآليات الأساسية لإدارة الموارد بالـ node، وتُحمَّل modules السيرفر ديناميكياً حسب الحاجة.
- **معماريتا الـ kernel الرئيسيتان:**

| المعمارية | الوصف |
|---|---|
| **Monolithic Kernel** | يحتوي server processes تنفَّذ **ضمن مساحة عنوانه الخاصة (address space)** — بما فيها file servers وبعض networking؛ الكود جزء من تهيئة الـ kernel القياسية |
| **Microkernel** | طبقة بين الـ hardware وطبقة المكونات الأساسية؛ يوفر فقط أبسط التجريدات (**address spaces, threads, local IPC**)؛ باقي خدمات النظام تُقدَّم عبر servers **تُحمَّل ديناميكياً** فقط على الحواسيب التي تحتاجها |

- الفرق الجوهري بين المعماريتين: **ما الوظائف التي تنتمي للـ kernel، وما الذي يُترك لـ server processes قابلة للتحميل الديناميكي فوقه**.
- إذا كان الهدف **الأداء (Performance)** وليس المحمولية (Portability)، فقد تستخدم الـ Middleware مرافق الـ microkernel **مباشرة**.

---

## ✅ 100 سؤال MCQ (مبنية على نص المحاضرة + أنماط الدورات السابقة)

> ترميز المصدر: **[محاضرة]** = من نص السلايدات مباشرة | **[نمط 2022-2023]** / **[نمط 2025]** = مبني على نمط سؤال ظهر بنفس الصياغة أو قريب منها في تلك الدورة.

### 🔹 القسم 1: مقدمة عامة (Q1–Q5)

### السؤال 1 (متوسط)
Client applications invoke operations on resources that are often located:
أ) Only in the same process
ب) On another node or at least another process
ج) Only in the client's own memory
د) Nowhere, resources don't exist remotely
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 2 (متوسط)
Applications and services use the ________ layer for their interactions:
أ) Hardware
ب) Middleware
ج) Application only
د) Physical
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 3 (متوسط)
Examples of remote invocation types found in middleware include:
أ) RPC and Java RMI
ب) Only TCP
ج) Only file systems
د) Only threads
**الإجابة الصحيحة: أ**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 4 (متوسط)
Below the middleware layer sits the:
أ) Application layer
ب) Operating system (OS) layer
ج) Database layer
د) Security layer only
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 5 (متوسط)
An OS provides the programmer with, for example, files rather than:
أ) Applications
ب) Disk blocks
ج) Middleware objects
د) Threads
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### 🔹 القسم 2: Network OS مقابل Distributed OS (Q6–Q17)

### السؤال 6 (متوسط)
In a Distributed Operating System, users:
أ) Must always know where programs run
ب) Are never concerned with where their programs run or resource location
ج) Manually assign nodes
د) Cannot run any programs
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 7 (متوسط)
A Distributed OS presents:
أ) Multiple separate system images
ب) A single system image
ج) No system image at all
د) Only a command-line image
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 8 (متوسط)
The Distributed OS transparently locates new processes based on:
أ) User manual selection
ب) Its scheduling policies
ج) Random chance
د) Alphabetical node order
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 9 (متوسط)
According to distributed operating systems, there is only one system image:
أ) True
ب) False
**الإجابة الصحيحة: أ**
**التعليل:** المصدر: [نمط 2022-2023] Q31

---

### السؤال 10 (متوسط)
According to distributed operating systems, processes can be run in any node:
أ) True
ب) False
**الإجابة الصحيحة: أ**
**التعليل:** المصدر: [نمط 2022-2023] Q31

---

### السؤال 11 (متوسط)
Distributed operating systems currently in wide/general use include:
أ) Windows and Unix
ب) None — no distributed OS is in general/wide use
ج) Only MINIX
د) Only HarmonyOS
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 12 (متوسط)
Examples of investigated (but not widely-used) distributed operating systems include:
أ) HarmonyOS, BlueOS, MINIX
ب) Windows 11 and macOS
ج) Ubuntu and Fedora
د) Android and iOS
**الإجابة الصحيحة: أ**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 13 (متوسط)
A Network Operating System has:
أ) No networking capability
ب) Networking capability built in, allowing access to remote resources
ج) Only local resource access
د) A single system image
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 14 (متوسط)
Network operating systems are:
أ) Rarely used
ب) In wide use for both technical and non-technical reasons
ج) Only theoretical
د) Obsolete
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 15 (متوسط)
One reason against adopting distributed OS is that users:
أ) Prefer complex configurations
ب) Have much invested in their application software and won't adopt an OS that won't run it
ج) Want less autonomy
د) Prefer no resource access at all
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 16 (متوسط)
A second reason against distributed OS adoption is that users prefer:
أ) Full centralization
ب) A degree of autonomy for their machines, even within an organization
ج) No control over their machines
د) Shared root access
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 17 (متوسط)
Examples of network operating systems given in the lecture are:
أ) MINIX and BlueOS
ب) Unix and Windows
ج) HarmonyOS only
د) None of the above
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### 🔹 القسم 3: توازن Middleware + Network OS (Q18–Q23)

### السؤال 18 (متوسط)
The combination of middleware and network operating systems provides balance between:
أ) Speed and cost
ب) Autonomy requirement and network transparent resource access
ج) Security and openness only
د) None of the above
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 19 (متوسط)
Network OS allows users to run:
أ) Only distributed applications
ب) Their favorite word processor and other standalone applications
ج) Nothing locally
د) Only kernel-level code
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 20 (متوسط)
Middleware enables users to:
أ) Lose access to local apps
ب) Take advantage of services available in their distributed system
ج) Avoid all networking
د) Bypass the OS entirely
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 21 (متوسط)
Kernels and server processes are the components that:
أ) Only display the UI
ب) Manage resources and present clients with an interface to them
ج) Only handle billing
د) Have no role in resource management
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 22 (متوسط)
Figure 1 (System layers) shows that each node runs its own:
أ) OS (kernel, libraries & servers) supporting a common middleware layer
ب) Separate middleware with no commonality
ج) Independent application with no OS
د) None of the above
**الإجابة الصحيحة: أ**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 23 (متوسط)
Which statement correctly reflects the layering in Figure 1, from bottom to top:
أ) Middleware → OS → Hardware → Applications
ب) Hardware → OS → Middleware → Applications/services
ج) Applications → Hardware → OS → Middleware
د) OS → Applications → Middleware → Hardware
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### 🔹 القسم 4: وظائف الـ OS Layer (Q24–Q31)

### السؤال 24 (متوسط)
Encapsulation, as facilitated by the OS, means:
أ) Hiding resources entirely, no access allowed
ب) Providing a useful service interface to resources
ج) Deleting unused resources
د) None of the above
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 25 (متوسط)
Protection is needed because:
أ) Resources never need protection
ب) Resources require protection from illegitimate accesses
ج) Only the kernel needs protection
د) Only network cables need protection
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 26 (متوسط)
Concurrent processing, as an OS-facilitated feature, means:
أ) Only one client can ever use a resource
ب) Clients may share resources and access them concurrently
ج) Resources are locked permanently
د) None of the above
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 27 (متوسط)
Providing a service interface to resources is:
أ) Protection
ب) Encapsulation
ج) Concurrent processing
د) Both a & b
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [نمط 2022-2023] Q32

---

### السؤال 28 (متوسط)
Which is NOT one of the three functions the OS layer facilitates:
أ) Encapsulation
ب) Protection
ج) Concurrent processing
د) Compilation
**الإجابة الصحيحة: د**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 29 (متوسط)
Clients access resources by making:
أ) Direct memory writes
ب) RMI to a server object
ج) Only local function calls
د) None of the above
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 30 (متوسط)
An "invocation mechanism" is defined as:
أ) A hardware component
ب) A means of accessing an encapsulated resource
ج) A type of thread
د) A security certificate
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 31 (متوسط)
Providing service interface to resources is:
أ) Encapsulation
ب) Protection
ج) Concurrent processing
د) Both a & b
**الإجابة الصحيحة: أ**
**التعليل:** المصدر: [نمط 2022-2023] Q32

---

### 🔹 القسم 5: مكونات الـ Core OS (Q32–Q41)

### السؤال 32 (متوسط)
The Process Manager handles:
أ) Thread scheduling only
ب) Creation of and operations upon processes
ج) Memory allocation only
د) Interrupt dispatching only
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 33 (متوسط)
The Thread Manager is responsible for:
أ) Process creation
ب) Thread creation, synchronization, and scheduling
ج) Physical memory only
د) Interrupt handling
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 34 (متوسط)
The Memory Manager handles:
أ) Thread scheduling
ب) Management of physical and virtual memory
ج) Process creation only
د) Communication between threads
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 35 (متوسط)
The Communication Manager handles:
أ) Memory allocation
ب) Communication between threads
ج) Interrupt dispatching
د) Process termination only
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 36 (متوسط)
The Supervisor is responsible for:
أ) Thread scheduling only
ب) Dispatching of interrupts, system calls, and other exceptions
ج) Memory management only
د) Communication only
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 37 (متوسط)
Which of the following is NOT one of the five core OS components mentioned:
أ) Process manager
ب) Thread manager
ج) Security manager
د) Supervisor
**الإجابة الصحيحة: ج**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 38 (متوسط)
Dispatching of system calls falls under the responsibility of:
أ) The process manager
ب) The supervisor
ج) The memory manager
د) The thread manager
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 39 (متوسط)
Which core OS component deals specifically with virtual memory:
أ) Process manager
ب) Memory manager
ج) Communication manager
د) Supervisor
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 40 (متوسط)
According to Figure 2, the five core OS functionality components together form:
أ) A single monolithic function
ب) The core OS functionality (Process, Thread, Memory, Communication managers + Supervisor)
ج) Only the kernel's file system
د) Only the network stack
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 41 (متوسط)
Thread creation, synchronization, and scheduling are grouped under:
أ) The process manager
ب) The thread manager
ج) The supervisor
د) The memory manager
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### 🔹 القسم 6: مشكلة الـ Process التقليدي وEEs (Q42–Q51)

### السؤال 42 (متوسط)
The traditional OS notion of a process executes:
أ) Multiple activities simultaneously by default
ب) A single activity
ج) No activities
د) Only I/O operations
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 43 (متوسط)
The problem with the traditional process model in distributed systems is that:
أ) It's too cheap to create
ب) Sharing between related activities is awkward and expensive
ج) It has too many threads
د) It has no execution environment
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 44 (متوسط)
The solution to the traditional process problem was to:
أ) Eliminate processes entirely
ب) Enhance the process notion to associate it with multiple activities (threads)
ج) Use only single-threaded processes always
د) Remove the kernel
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 45 (متوسط)
A process consists of:
أ) Only a thread
ب) An execution environment together with one or more threads
ج) Only an address space
د) Only a supervisor call
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 46 (متوسط)
A thread is defined as:
أ) A type of resource manager
ب) The operating system abstraction of an activity
ج) A kernel module
د) A hardware interrupt
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 47 (متوسط)
An execution environment is defined as:
أ) A single thread only
ب) The unit of resource management — a collection of local kernel-managed resources accessible to its threads
ج) A network protocol
د) A type of middleware
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 48 (متوسط)
Execution environments are typically:
أ) Free to create
ب) Expensive to create and manage, but shareable by several threads
ج) Impossible to share
د) Identical to threads
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 49 (متوسط)
Several threads can share:
أ) Nothing
ب) The same execution environment
ج) Only the kernel
د) Only the supervisor
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 50 (متوسط)
A process is more efficient than threads in most operating systems:
أ) True
ب) False (threads are more efficient/cheaper — related concept, see processes vs threads comparison)
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [نمط 2022-2023] Q33 (متعلق بمقارنة efficiency بين process/thread)

---

### السؤال 51 (متوسط)
If we are concerned with performance, processes are more efficient than threads:
أ) True
ب) False
ج) Depends entirely on hardware
د) Both are always identical
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [نمط 2022-2023] Q33

---

### 🔹 القسم 7: مكونات Execution Environment (Q52–Q57)

### السؤال 52 (متوسط)
Execution environment components include:
أ) Only an address space
ب) Address space, thread sync/communication resources, and higher-level resources
ج) Only open files
د) Only sockets
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 53 (متوسط)
Which is an example of thread synchronization/communication resources within an EE:
أ) Open files
ب) Semaphores, sockets
ج) Windows only
د) The kernel itself
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 54 (متوسط)
Higher-level resources within an execution environment include:
أ) Only the address space
ب) Open files and windows
ج) Only semaphores
د) Only the CPU registers
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 55 (متوسط)
The address space is part of:
أ) The thread only
ب) The execution environment
ج) The supervisor
د) The dispatcher
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 56 (متوسط)
Which is NOT listed as a component of the execution environment:
أ) Address space
ب) Thread sync/communication resources
ج) Higher-level resources
د) Network topology map
**الإجابة الصحيحة: د**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 57 (متوسط)
Sockets, as a thread communication resource, belong to:
أ) The kernel scheduler only
ب) The execution environment
ج) The supervisor exclusively
د) None of the above
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### 🔹 القسم 8: أهداف وجود Threads (Q58–Q65)

### السؤال 58 (متوسط)
One aim of having multiple threads is to:
أ) Reduce concurrency
ب) Maximize the degree of concurrent execution between operations
ج) Eliminate I/O operations
د) Prevent multiprocessing
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 59 (متوسط)
Multiple threads enable:
أ) Only sequential I/O
ب) Overlap of computation with input and output
ج) Elimination of computation
د) None of the above
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 60 (متوسط)
Threads enable concurrent processing specifically on:
أ) Single-core processors only
ب) Multiprocessors
ج) No processors
د) Only GPUs
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 61 (متوسط)
Which is NOT one of the stated aims of having multiple threads:
أ) Maximize concurrent execution
ب) Overlap computation with I/O
ج) Enable concurrent processing on multiprocessors
د) Eliminate the need for an execution environment
**الإجابة الصحيحة: د**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 62 (متوسط)
Multiple threads help reduce idle waiting by allowing:
أ) All threads to block simultaneously
ب) One thread to compute while another waits on I/O
ج) No overlap at all
د) Only sequential execution
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 63 (متوسط)
The benefit of thread concurrency on multiprocessors relates directly to:
أ) Single-threaded execution
ب) Parallel hardware capability
ج) Disabling other cores
د) None of the above
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 64 (متوسط)
Overlap of computation with I/O primarily benefits:
أ) Systems with no I/O at all
ب) Systems where I/O latency would otherwise stall computation
ج) Systems with a single thread only
د) None of the above
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 65 (متوسط)
Threads are described as:
أ) Non-schedulable
ب) Schedulable activities attached to processes
ج) Independent of any process
د) Identical to execution environments
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### 🔹 القسم 9: Threads بالسيرفرات (Q66–Q73)

### السؤال 66 (متوسط)
Concurrent processing of client requests via threads helps reduce:
أ) Server throughput
ب) The tendency for servers to become a bottleneck
ج) Client satisfaction
د) None of the above
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 67 (متوسط)
In Figure 3, while one server thread processes a request, another thread might be:
أ) Idle permanently
ب) Waiting for a disk access to complete for another request
ج) Deleted
د) Running the client application
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 68 (متوسط)
The three alternative server threading architectures mentioned are:
أ) Thread-per-server, Thread-per-client, Thread-per-node
ب) Thread-per-request, Thread-per-connection, Thread-per-object remote
ج) Thread-per-file, Thread-per-socket, Thread-per-packet
د) None of the above
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 69 (متوسط)
"Thread-per-connection" architecture assigns a thread based on:
أ) Each individual request regardless of connection
ب) Each client connection
ج) Each remote object regardless of connection
د) None of the above
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 70 (متوسط)
"Thread-per-request" architecture assigns a thread based on:
أ) The connection
ب) Each individual request
ج) The remote object only
د) The entire server lifetime
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 71 (متوسط)
"Thread-per-object remote" architecture assigns a thread based on:
أ) Each request
ب) Each connection
ج) Each remote object
د) None of the above
**الإجابة الصحيحة: ج**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 72 (متوسط)
Server threading is helpful primarily because it enables:
أ) Sequential-only processing
ب) Concurrent processing of multiple client requests
ج) Elimination of the need for a communication manager
د) None of the above
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 73 (متوسط)
The N-threads server model in Figure 3 illustrates:
أ) A single-threaded bottleneck design
ب) Multiple threads handling input-output and requests concurrently
ج) No threading at all
د) A microkernel-only design
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### 🔹 القسم 10: Threads بالعملاء (Q74–Q79)

### السؤال 74 (متوسط)
In Figure 3, the client process has:
أ) Only one thread
ب) Two threads
ج) No threads
د) Five threads
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 75 (متوسط)
In the client's two-thread model, Thread 1's role is to:
أ) Make requests to the server
ب) Generate results to be passed to the server via RMI
ج) Handle disk I/O for the server
د) Dispatch interrupts
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 76 (متوسط)
In the client's two-thread model, Thread 2's role is to:
أ) Generate results
ب) Perform the remote method invocations and block while Thread 1 continues computing
ج) Manage the kernel
د) Handle server-side disk access
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 77 (متوسط)
While Thread 2 blocks on an RMI call, Thread 1 can:
أ) Also block
ب) Continue computing further results
ج) Terminate the process
د) Switch to being the server
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 78 (متوسط)
Threads being useful for clients (not just servers) is illustrated by:
أ) Figure 1
ب) Figure 2
ج) Figure 3
د) Figure 4
**الإجابة الصحيحة: ج**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 79 (متوسط)
The purpose of splitting client work across two threads is to:
أ) Slow down the client
ب) Allow continued computation while waiting on a blocking remote call
ج) Eliminate the need for RMI
د) None of the above
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### 🔹 القسم 11: Processes مقابل Threads (Q80–Q87)

### السؤال 80 (متوسط)
Creating a new thread within a process compared to creating a new process is:
أ) More expensive
ب) Cheaper
ج) Exactly the same cost
د) Impossible
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 81 (متوسط)
Switching to a different thread within the same process, compared to switching between processes, is:
أ) More expensive
ب) Cheaper
ج) Impossible
د) Exactly the same
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 82 (متوسط)
Threads within a process may share data and resources:
أ) Never
ب) Conveniently and efficiently, compared to separate processes
ج) Only with explicit encryption
د) Only after termination
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 83 (متوسط)
Threads within the same process are:
أ) Fully protected from one another
ب) NOT protected from one another
ج) Completely isolated always
د) Unable to share any resource
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 84 (متوسط)
Processes is more efficient than threads:
أ) True
ب) False
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [نمط 2022-2023] Q33

---

### السؤال 85 (متوسط)
The lack of protection between threads in the same process is a trade-off for:
أ) Increased security
ب) Cheaper creation/switching and convenient resource sharing
ج) Nothing, it's purely a downside
د) Better isolation
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 86 (متوسط)
Compared to separate processes, threads sharing the same execution environment:
أ) Require explicit IPC for everything
ب) Can access shared resources directly and efficiently
ج) Cannot communicate at all
د) Must always use RMI
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 87 (متوسط)
The main summarized trade-off between processes and threads is:
أ) Threads are always worse in every respect
ب) Threads are cheaper/faster to create and switch, but lack inter-thread protection
ج) Processes are always cheaper
د) There is no difference
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### 🔹 القسم 12: Monolithic Kernel (Q88–Q94)

### السؤال 88 (متوسط)
Ideally, the kernel would provide:
أ) All possible services
ب) Only the most basic mechanisms for general resource management
ج) Nothing at all
د) Only networking
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 89 (متوسط)
Server modules in an ideal kernel design would be:
أ) Permanently compiled into the kernel only
ب) Dynamically loaded as required
ج) Never loaded
د) Always run in user mode only
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 90 (متوسط)
The two major kernel architectures discussed are:
أ) Linux and Windows
ب) Monolithic kernels and Microkernels
ج) Client and Server kernels
د) Primary and Secondary kernels
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 91 (متوسط)
A Monolithic kernel can contain server processes that execute:
أ) In a separate isolated machine
ب) Within its own address space
ج) Only on remote nodes
د) Nowhere, it has no servers
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 92 (متوسط)
Examples of services that may run within a monolithic kernel's address space include:
أ) File servers and some networking
ب) Only the GUI
ج) Only word processors
د) None, monolithic kernels have no servers
**الإجابة الصحيحة: أ**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 93 (متوسط)
In a monolithic kernel, the code for included server processes is:
أ) Dynamically loaded from the network
ب) Part of the standard kernel configuration
ج) Never part of the kernel
د) Written by the end user
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 94 (متوسط)
If we are concerned with performance, then:
أ) Microkernel is always the best choice
ب) Monolithic kernel is the best choice
ج) Neither matters for performance
د) Only Windows achieves performance
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [نمط 2022-2023] Q33

---

### 🔹 القسم 13: Microkernel (Q95–Q100)

### السؤال 95 (متوسط)
A Microkernel appears as a layer between:
أ) Applications and middleware
ب) Hardware layer and a layer of major system components
ج) Two applications
د) Two networks
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 96 (متوسط)
The microkernel provides only the most basic abstractions, principally:
أ) File systems and databases
ب) Address spaces, threads, and local interprocess communication
ج) GUI rendering only
د) Networking protocols only
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 97 (متوسط)
In a microkernel design, all other system services are provided by:
أ) The kernel itself always
ب) Servers dynamically loaded only at computers that need them
ج) Hardware firmware
د) The client application
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 98 (متوسط)
Providing service interface to resources is:
أ) Protection only
ب) Encapsulation
ج) Concurrency only
د) None of the above
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [نمط 2022-2023] Q32 (تكرار توكيدي)

---

### السؤال 99 (متوسط)
If performance is NOT the primary goal, but portability is, middleware might prefer:
أ) Direct microkernel facility usage
ب) A more portable/abstracted approach not tied directly to microkernel internals
ج) No OS at all
د) Only monolithic kernels
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة] — استنتاج

---

### السؤال 100 (متوسط)
The primary architectural difference between monolithic kernels and microkernels is:
أ) The programming language used
ب) What functionality belongs in the kernel vs. what is left to dynamically loadable server processes
ج) The number of CPUs supported
د) Network bandwidth requirements
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]
## 📌 ملاحظة مراجعة سريعة
أهم نقاط هذه المحاضرة (الأكثر تكراراً بالأنماط السابقة):
- **Distributed OS vs Network OS**: لماذا لا يوجد Distributed OS بالاستخدام الواسع، وأسباب تفضيل Network OS (استثمار بالتطبيقات + رغبة بالاستقلالية).
- **Encapsulation / Protection / Concurrent Processing** — الوظائف الثلاث لطبقة الـ OS (سؤال MCQ متكرر حرفياً: "Providing service interface to resources is → Encapsulation").
- **Process vs Thread**: التكلفة (إنشاء/تبديل)، مشاركة الموارد، غياب الحماية بين threads — نقطة اختبار كلاسيكية.
- **Monolithic vs Microkernel**: إذا كان الهدف **Performance → Monolithic**؛ إذا كان الهدف **Portability/Modularity → Microkernel**.
- **بنى Threading بالسيرفر الثلاث** (Thread-per-request/connection/object remote).
- **مكونات الـ Core OS الخمسة** (Process/Thread/Memory/Communication Manager + Supervisor).

---

## 🎓 ملخص شامل لكل المحاضرات الأربع الأولى + الخامسة
هذا يُكمل تغطية دورات الـ MCQ اللي رفعتها (فصل أول وفصل ثاني). النقاط المشتركة الأكثر تكراراً عبر كل الدورات:
1. Transparency (Access/Location = Network Transparency)
2. Failure types (Omission/Arbitrary/Timing) + Masking (checksums: Arbitrary→Omission)
3. Synchronous vs Asynchronous + قدرة كشف الفشل
4. RPC call semantics (Maybe/At-least-once/At-most-once) + مكونات RPC (client stub=proxy، server stub=skeleton)
5. Clock synchronization (Cristian/Berkeley/NTP) + Lamport/Vector clocks
6. Distributed OS vs Network OS + Monolithic vs Microkernel

لو حبيت، أقدر أجمع كل ملفات الخمس محاضرات + الـ 500 سؤال بملف واحد شامل للمراجعة النهائية قبل الامتحان.
