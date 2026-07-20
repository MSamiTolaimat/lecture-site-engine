# المحاضرة الأولى: Characterization of Distributed Systems
### د. محسن عبود — Chapter 1, Coulouris

---

## 📖 ملخص المحاضرة (Theory Summary)

### 1) تعريف النظام الموزع (Definition)
- **Distributed System** = مجموعة hardware/software components موزعة على computers متصلة بشبكة، **تتواصل وتنسق أعمالها فقط عن طريق message passing**.
- الفرق الجوهري:
  - **Computer Network**: وجود computers مستقلة **ظاهر بوضوح** (يمكن مخاطبتها Explicitly).
  - **Distributed System**: وجود computers متعددة **شفاف (Transparent)** — يظهر النظام كوحدة واحدة للمستخدم.

### 2) المشاكل الأساسية (Problems to be Addressed)
| المشكلة | الشرح |
|---|---|
| **Concurrency** | أكثر من computer يعمل بنفس الوقت → مشكلة الوصول المتزامن لنفس المورد + تأخير الشبكة غير الثابت يصعّب المزامنة |
| **No Global Clock** | لا يوجد مفهوم موحّد للوقت الصحيح؛ التنسيق بين البرامج يعتمد على تبادل الرسائل فقط |
| **Independent Failures** | كل مكوّن ممكن يفشل **بشكل مستقل** عن الباقي؛ عزل مكوّن (network fault) لا يعني توقفه؛ مشكلة عدم معرفة إذا وصلت الرسالة أم لا |

### 3) أمثلة على الأنظمة الموزعة
| النظام | التعريف |
|---|---|
| **Internet** | أكبر نظام موزع، شبكة شبكات مترابطة |
| **Intranet** | "mini-internet" بنفس تقنيات الإنترنت لكن بإدارة منظمة واحدة |
| **Cluster** | مجموعة حواسيب مستقلة تعمل معاً كمورد حوسبة واحد متكامل، تُستخدم لخدمات قابلة للتوسع (مثل search engines) |
| **Mobile Computing** | أجهزة صغيرة محمولة تستفيد من معلومات الشبكة (لابتوب، موبايل) |
| **Cloud Computing** | خدمات تطبيقات/تخزين/حوسبة عبر الإنترنت تُقدَّم "كخدمة" (as a service) بدلاً من الشراء، تقلل الاعتماد على أجهزة المستخدم |

### 4) Resource Sharing
- **Resource**: hardware (طابعة مشتركة)، software (distributed objects)، data (ملفات).
- الموارد **محصورة (Encapsulated)** داخل computer، ولا يمكن الوصول إليها إلا عبر communication، وتُدار ببرنامج يوفر communication interface.
- **Service**: جزء من النظام يدير مجموعة موارد مترابطة ويقدّم وظائفها عبر عمليات محددة.
- **Server**: برنامج يقبل رسائل طلب (requests) من clients ويرد عليها (replies).
- **Remote Invocation**: التفاعل الكامل بين client و server.

### 5) تحديات تصميم النظام الموزع (Design Challenges)

| التحدي | الفكرة الأساسية | أمثلة/تقنيات |
|---|---|---|
| **Heterogeneity** | تنوع الشبكات/الأنظمة/اللغات ويجب أن تتعاون | Internet protocols, Middleware (CORBA, Java RMI), Mobile code |
| **Openness** | إمكانية إضافة/استبدال المكونات؛ يُقاس بمدى نشر توثيق الواجهات | نشر documentation للمكونات |
| **Security** | الموارد تُستخدم فقط بالطريقة المقصودة | Confidentiality, Integrity, Availability |
| **Scalability** | النظام يعمل بكفاءة مع زيادة المستخدمين/الموارد | Caching, Replication |
| **Failure Handling** | فشل جزئي لا يعني فشل النظام كامل | Detecting (Checksums), Masking (Retransmission), Tolerating (Exception handling), Recovery (Rollback), Redundancy |
| **Concurrency** | كل object يمثل مورد مشترك يجب أن يعمل بشكل صحيح مع الوصول المتزامن | Semaphores |
| **Transparency** | إخفاء انفصال المكونات عن المستخدم/المبرمج | 8 أنواع (تفصيل بالأسفل) |

### 6) أنواع الشفافية (Forms of Transparency) — أهم جزء بالمحاضرة

| النوع | التعريف |
|---|---|
| **Access** | الوصول للموارد المحلية والبعيدة **بنفس العمليات** (identical operations) |
| **Location** | الوصول للمورد **دون معرفة موقعه الفيزيائي/الشبكي** |
| **Concurrency** | تشغيل عدة processes بشكل متزامن على موارد مشتركة **دون تداخل** |
| **Replication** | استخدام عدة نسخ من المورد لزيادة الموثوقية/الأداء دون علم المستخدم |
| **Failure** | إخفاء الأعطال، إتمام المهام رغم فشل مكوّن hardware/software |
| **Mobility** | حركة الموارد والعملاء ضمن النظام دون التأثير على العمل |
| **Performance** | إعادة تهيئة النظام لتحسين الأداء حسب تغيّر الحمل |
| **Scaling** | توسّع النظام بالحجم دون تغيير بنية النظام أو خوارزميات التطبيق |

> ⭐ **الأهم:** Access + Location معاً = **Network Transparency** (أكثر نوعين شفافية أهمية، تكرر بكل الدورات).

---

## ✅ 100 سؤال MCQ (مبنية على نص المحاضرة + أنماط الدورات السابقة)



> ترميز المصدر: **[محاضرة]** = من نص السلايدات مباشرة | **[نمط 2022-2023]** / **[نمط 2025]** / **[نمط 2021]** = مبني على نمط سؤال ظهر بنفس الصياغة أو قريب منها في تلك الدورة.

### 🔹 القسم 1: تعريف النظام الموزع (Q1–Q6)

### السؤال 1 (متوسط)
A distributed system is one in which components communicate and coordinate their actions only by:
أ) Shared memory
ب) Message passing
ج) Global clock
د) Direct function calls
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة] — Defining Distributed Systems

---

### السؤال 2 (متوسط)
In a Computer Network (as opposed to a Distributed System), the existence of independent computers is:
أ) Transparent
ب) Explicitly visible
ج) Hidden
د) Irrelevant
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 3 (متوسط)
In a Distributed System, the existence of multiple independent computers is:
أ) Transparent
ب) Explicitly addressed
ج) Not applicable
د) Managed manually
**الإجابة الصحيحة: أ**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 4 (متوسط)
The main motivation for constructing distributed systems is:
أ) Reducing hardware cost
ب) Resource sharing
ج) Increasing complexity
د) Centralizing control
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 5 (متوسط)
Which of the following is NOT an example of a "network of computers" mentioned in the lecture:
أ) Mobile networks
ب) In-car networks
ج) Single standalone PC
د) Campus networks
**الإجابة الصحيحة: ج**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 6 (متوسط)
Reimplementing a distributed system in various means relates most to:
أ) Heterogeneity
ب) Security
ج) Scalability
د) Concurrency
**الإجابة الصحيحة: أ**
**التعليل:** المصدر: [نمط 2022-2023] Q1

---

### 🔹 القسم 2: المشاكل الأساسية (Q7–Q16)

### السؤال 7 (متوسط)
Which is NOT one of the three significant consequences of the DS definition:
أ) Concurrency
ب) No global clock
ج) Independent failures
د) Centralized control
**الإجابة الصحيحة: د**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 8 (متوسط)
Network delays being non-constant makes ________ difficult:
أ) Encryption
ب) Synchronization
ج) Compilation
د) Caching
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 9 (متوسط)
"There is no global notion of the correct time" relates to:
أ) Concurrency
ب) No global clock
ج) Independent failures
د) Heterogeneity
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 10 (متوسط)
A model to deal with time limits in distributed systems is:
أ) Time model
ب) Fault model
ج) Security model
د) Interaction model
**الإجابة الصحيحة: أ**
**التعليل:** المصدر: [نمط 2022-2023] Q6

---

### السؤال 11 (متوسط)
Network faults resulting in components being isolated but not stopping is an example of:
أ) Concurrency
ب) No global clock
ج) Independent failures
د) Heterogeneity
**الإجابة الصحيحة: ج**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 12 (متوسط)
If you are waiting for an acknowledge message and never receive it, this illustrates the challenge of:
أ) Independent failures
ب) Concurrency
ج) Scalability
د) Openness
**الإجابة الصحيحة: أ**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 13 (متوسط)
Each component of a distributed system can fail independently while:
أ) The whole system stops
ب) Others keep running
ج) All components stop
د) Data is lost
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 14 (متوسط)
What happens if two computers want to access the same resource simultaneously — this is an example of:
أ) Concurrency problem
ب) Clock problem
ج) Failure problem
د) Heterogeneity problem
**الإجابة الصحيحة: أ**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 15 (متوسط)
Close coordination between programs often depends on a shared idea of:
أ) IP address
ب) Time at which events occur
ج) Programming language
د) Operating system
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 16 (متوسط)
All computer systems can fail, but distributed systems fail in:
أ) The same way as centralized systems
ب) New ways
ج) No ways
د) Predictable ways only
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### 🔹 القسم 3: أمثلة على الأنظمة الموزعة (Q17–Q26)

### السؤال 17 (متوسط)
The Internet is described as:
أ) A small local network
ب) A very large distributed system of interconnected networks
ج) A single computer
د) A type of middleware
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 18 (متوسط)
An Intranet is best described as:
أ) The same as the Internet
ب) A "mini-internet" controlled by one organization
ج) A cluster of servers
د) A type of cloud service
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 19 (متوسط)
A Cluster is a type of:
أ) Single-computer system
ب) Parallel/distributed processing system of interconnected standalone computers
ج) Security protocol
د) Middleware
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 20 (متوسط)
Clusters are commonly used to provide highly scalable services such as:
أ) Email only
ب) Search engines
ج) Local printing
د) File compression
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 21 (متوسط)
Which technology enables everything to be viewed "as a service," often paid per usage:
أ) Cluster
ب) Intranet
ج) Cloud computing
د) Mobile code
**الإجابة الصحيحة: ج**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 22 (متوسط)
Cloud computing reduces requirements on:
أ) Network bandwidth only
ب) Users' devices
ج) Server security
د) Data encryption
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 23 (متوسط)
Placing a service on a single-address server that doesn't scale beyond host capacity/bandwidth is solved by:
أ) Encryption
ب) Cluster / BitTorrent
ج) Middleware only
د) None of the above
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [نمط 2021 فصل ثاني] Q2

---

### السؤال 24 (متوسط)
Mobile computing is made possible by:
أ) Fixed desktop computers only
ب) Portability of devices + ability to connect in different places
ج) Cloud storage only
د) Middleware only
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 25 (متوسط)
A search engine is an example that best illustrates:
أ) Security challenge
ب) A service provided via a Cluster
ج) Failure handling
د) Openness
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة] + [نمط 2021]

---

### السؤال 26 (متوسط)
Which of these pairs correctly matches system → key benefit:
أ) Cluster → Security
ب) Cloud computing → dispensing with local storage
ج) Intranet → global scale
د) Mobile networks → no transparency
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### 🔹 القسم 4: Resource Sharing (Q27–Q34)

### السؤال 27 (متوسط)
Resources in a distributed system are:
أ) Directly accessible without communication
ب) Encapsulated within computers, accessed only via communication
ج) Always public
د) Never managed by programs
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 28 (متوسط)
The term used for a distinct part of a system that manages related resources and presents functionality via defined operations:
أ) Server
ب) Service
ج) Client
د) Protocol
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 29 (متوسط)
A "Server" is defined as:
أ) A hardware device only
ب) A running program accepting requests and sending replies
ج) A client program
د) A type of resource
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 30 (متوسط)
A complete interaction between a client and a server is called:
أ) A transaction
ب) A remote invocation
ج) A handshake
د) A session
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 31 (متوسط)
Which is NOT considered a type of "resource" per the lecture:
أ) Hardware (shared printer)
ب) Data (files)
ج) Distributed objects
د) The network cable itself
**الإجابة الصحيحة: د**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 32 (متوسط)
Resources are managed by a program that offers a:
أ) Graphical interface
ب) Communication interface
ج) File system
د) Database schema
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 33 (متوسط)
"Clients" in the client-server interaction are:
أ) Programs offering services
ب) Programs running on other computers requesting a service
ج) Hardware resources
د) None of the above
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 34 (متوسط)
The terms "resources" and "components" are used to describe:
أ) Security policies
ب) How a distributed system is built up
ج) Clock synchronization
د) Middleware layers
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### 🔹 القسم 5: Heterogeneity (Q35–Q41)

### السؤال 42 (متوسط)
Heterogeneity concerns components differing in:
أ) Networks, hardware, OS, programming languages, developers
ب) Only networks
ج) Only OS
د) Only programming languages
**الإجابة الصحيحة: أ**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 35 (متوسط)
Examples that mask differences to provide heterogeneity include all EXCEPT:
أ) Internet protocols
ب) Middleware (CORBA, Java RMI)
ج) Mobile code
د) Firewalls
**الإجابة الصحيحة: د**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 36 (متوسط)
"Mobile code" is defined as:
أ) Code that never leaves its host
ب) Code sent from one computer to run at the destination
ج) Encrypted code only
د) A type of middleware protocol
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 37 (متوسط)
Middleware examples given for solving heterogeneity are:
أ) TCP/UDP only
ب) CORBA and Java RMI
ج) HTML/CSS
د) SQL only
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 38 (متوسط)
Heterogeneous components must be able to:
أ) Run identical code
ب) Interoperate
ج) Use the same hardware
د) Share the same clock
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 39 (متوسط)
Internet protocols are given as an example of solving:
أ) Security
ب) Heterogeneity
ج) Scalability
د) Concurrency
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 40 (متوسط)
Which challenge is directly addressed by the existence of both Internet protocols and Middleware:
أ) Openness only
ب) Heterogeneity
ج) Failure handling
د) Scaling transparency
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 41 (متوسط)
Different developers producing components is a factor contributing to:
أ) Scalability
ب) Heterogeneity
ج) Openness
د) Security
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### 🔹 القسم 6: Openness (Q43–Q48)

### السؤال 43 (متوسط)
Openness of a computer system is the characteristic that determines whether the system can be:
أ) Only replaced entirely
ب) Extended and re-implemented in various ways
ج) Made faster only
د) Hidden from developers
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة] + [نمط 2022-2023] Q1

---

### السؤال 44 (متوسط)
Openness is determined primarily by:
أ) Number of users
ب) Degree to which new resource-sharing services can be added
ج) Amount of hardware
د) Number of failures
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 45 (متوسط)
The first step in achieving openness is:
أ) Encrypting all data
ب) Publishing documentation of components/interfaces
ج) Adding redundancy
د) Reducing components
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 46 (متوسط)
Openness allows components to be:
أ) Fixed permanently
ب) Added or replaced
ج) Hidden from users only
د) Removed without replacement
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 47 (متوسط)
Publishing interface documentation primarily benefits:
أ) End users only
ب) Software developers
ج) Network admins only
د) Hardware vendors only
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 48 (متوسط)
Which challenge is most related to "re-implementing a distributed system in various means":
أ) Security
ب) Openness/Heterogeneity
ج) Failure handling
د) Transparency
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [نمط 2022-2023] Q1

---

### 🔹 القسم 7: Security (Q49–Q55)

### السؤال 49 (متوسط)
Security of a computer system means resources are:
أ) Freely accessible to all
ب) Accessible to authorized users and used as intended
ج) Hidden permanently
د) Never shared
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 50 (متوسط)
Protection against disclosure to unauthorized individuals is called:
أ) Integrity
ب) Availability
ج) Confidentiality
د) Authentication
**الإجابة الصحيحة: ج**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 51 (متوسط)
Protection against alteration or corruption of data is:
أ) Confidentiality
ب) Integrity
ج) Availability
د) Openness
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 52 (متوسط)
Protection against interference with access to resources is:
أ) Confidentiality
ب) Integrity
ج) Availability
د) Heterogeneity
**الإجابة الصحيحة: ج**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 53 (متوسط)
Security for information resources has how many main components:
أ) Two
ب) Three
ج) Four
د) Five
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 54 (متوسط)
Which of the following is NOT one of the three security components:
أ) Confidentiality
ب) Integrity
ج) Availability
د) Scalability
**الإجابة الصحيحة: د**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 55 (متوسط)
"The system should only be used in the way intended" defines:
أ) Openness
ب) Security
ج) Transparency
د) Concurrency
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### 🔹 القسم 8: Scalability (Q56–Q61)

### السؤال 56 (متوسط)
Scalability means the system should work efficiently with:
أ) A fixed number of users only
ب) An increasing number of users
ج) Decreasing resources
د) A single computer only
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 57 (متوسط)
System performance should ________ with inclusion of additional resources:
أ) Decrease
ب) Increase
ج) Stay constant
د) Become unstable
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 58 (متوسط)
Examples of providing scalability mentioned in the lecture are:
أ) Encryption and firewalls
ب) Caching and replication
ج) Rollback and checksums
د) Middleware and RPC
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 59 (متوسط)
Scalable distributed systems should operate effectively at:
أ) One fixed scale only
ب) Many different scales, from small Intranet to Internet
ج) Only large scale
د) Only small scale
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 60 (متوسط)
Caching resources is a solution for:
أ) Heterogeneity
ب) Transparency
ج) Scalability
د) Security
**الإجابة الصحيحة: ج**
**التعليل:** المصدر: [نمط 2022-2023] Q2

---

### السؤال 61 (متوسط)
Which challenge concerns the ability of the system to expand without changing its structure or algorithms:
أ) Performance transparency
ب) Scaling transparency (related to Scalability challenge)
ج) Security
د) Concurrency
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### 🔹 القسم 9: Failure Handling (Q62–Q71)

### السؤال 62 (متوسط)
Failure of one component in a distributed system (partial failure) should:
أ) Cause the whole system to fail
ب) Not result in failure of the whole system
ج) Be ignored entirely
د) Stop all other components
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 63 (متوسط)
Failures in distributed systems are described as:
أ) Total
ب) Partial
ج) Non-existent
د) Predictable only
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 64 (متوسط)
Detecting failures is achieved through:
أ) Rollback
ب) Checksums
ج) Redundant components
د) Exception handling
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 65 (متوسط)
Masking failures is achieved through:
أ) Checksums
ب) Retransmission of corrupt messages
ج) Redundant components only
د) Openness
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 66 (متوسط)
Tolerating failures is achieved through:
أ) Checksums
ب) Rollback
ج) Exception handling
د) Caching
**الإجابة الصحيحة: ج**
**التعليل:** المصدر: [محاضرة] + [نمط 2022-2023] Q3

---

### السؤال 67 (متوسط)
Recovery from failure is achieved through:
أ) Checksums
ب) Rollback mechanisms
ج) Exception handling
د) Redundancy only
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة] + [نمط 2022-2023] Q4

---

### السؤال 68 (متوسط)
Redundancy as a failure-handling technique relies on:
أ) Checksums
ب) Redundant components
ج) Rollback only
د) Exception handling only
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 69 (متوسط)
Exception handling is used as a technique for:
أ) Redundancy
ب) Fault tolerance
ج) Detecting failures
د) Recovery from failure
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [نمط 2022-2023] Q3

---

### السؤال 70 (متوسط)
Which technique is used to mask a failure specifically:
أ) Checksum
ب) Rollback / Redundant resources / Retransmission
ج) Detecting only
د) None of the above
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [نمط 2022-2023] Q4

---

### السؤال 71 (متوسط)
Converting a failure into an "acceptable" one is best related to:
أ) Detecting failures
ب) Masking failures (Omission failure conversion)
ج) Tolerating only
د) None of the above
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [نمط 2022-2023] Q10

---

### 🔹 القسم 10: Concurrency (كتحدٍّ تصميمي) (Q72–Q76)

### السؤال 72 (متوسط)
For an object to be safe in a concurrent environment, its operations must be:
أ) Isolated permanently
ب) Synchronized so data remains consistent
ج) Removed
د) Duplicated only
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 73 (متوسط)
Concurrency (as a design challenge) can be achieved using standard techniques such as: <br>*المصدر: [محاضرة]*
أ) Encryption
ب) Semaphores
ج) Checksums
د) Rollback
**الإجابة الصحيحة: ب**
**التعليل:** من نص المحاضرة.

---

### السؤال 74 (متوسط)
With concurrency, services and applications can be:
أ) Isolated from all clients
ب) Shared by clients in a distributed system
ج) Used by one client only
د) Removed entirely
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 75 (متوسط)
Any object representing a shared resource must ensure it operates correctly in a:
أ) Sequential environment only
ب) Concurrent environment
ج) Isolated environment
د) Offline environment
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 76 (متوسط)
Semaphores, used to achieve concurrency control, are commonly found in:
أ) Web browsers
ب) Most operating systems
ج) Only distributed databases
د) Only middleware
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### 🔹 القسم 11: مفهوم Transparency العام (Q77–Q81)

### السؤال 77 (متوسط)
Transparency is defined as:
أ) Showing all components to the user
ب) Hiding the separation of components from users/programmers
ج) Encrypting all data
د) A type of failure
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 78 (متوسط)
With transparency, the system is perceived as:
أ) A collection of independent components
ب) A whole, single system
ج) Multiple unrelated systems
د) None of the above
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 79 (متوسط)
Transparency should hide distribution from:
أ) Only end users
ب) Only programmers
ج) Both users and application programmers
د) Neither
**الإجابة الصحيحة: ج**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 80 (متوسط)
The two most important transparencies, referred to together as "Network Transparency," are:
أ) Concurrency and Replication
ب) Access and Location
ج) Failure and Mobility
د) Performance and Scaling
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة] + [نمط 2022-2023] Q5

---

### السؤال 81 (متوسط)
Network transparency in the context of email addresses (user@domain) demonstrates:
أ) Failure transparency only
ب) Access and Location transparency
ج) Concurrency transparency
د) Replication transparency
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [نمط 2021 فصل ثاني] Q1.d

---

### 🔹 القسم 12: أنواع الشفافية الثمانية بالتفصيل (Q82–Q97)

### السؤال 82 (متوسط)
Enables local and remote resources to be accessed using identical operations:
أ) Location
ب) Access
ج) Failure
د) Mobility
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة] + [نمط 2025] Q2

---

### السؤال 83 (متوسط)
Enables resources to be accessed without knowledge of physical/network location:
أ) Location
ب) Access
ج) Concurrency
د) Scaling
**الإجابة الصحيحة: أ**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 84 (متوسط)
Enables several processes to operate concurrently on shared resources without interference:
أ) Access
ب) Concurrency
ج) Failure
د) Performance
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 85 (متوسط)
Enables multiple instances of a resource to increase reliability/performance without user knowledge:
أ) Failure
ب) Replication
ج) Mobility
د) Scaling
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 86 (متوسط)
Enables concealment of faults so tasks complete despite hardware/software failure:
أ) Failure transparency
ب) Access transparency
ج) Location transparency
د) Performance transparency
**الإجابة الصحيحة: أ**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 87 (متوسط)
Allows movement of resources/clients within the system without affecting operation:
أ) Scaling
ب) Performance
ج) Mobility
د) Replication
**الإجابة الصحيحة: ج**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 88 (متوسط)
Allows the system to be reconfigured to improve performance as loads vary:
أ) Performance transparency
ب) Scaling transparency
ج) Mobility transparency
د) Access transparency
**الإجابة الصحيحة: أ**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 89 (متوسط)
Allows the system/applications to expand in scale without changing structure or algorithms:
أ) Performance
ب) Scaling
ج) Mobility
د) Concurrency
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 90 (متوسط)
Which transparency type is illustrated by a user not needing to know which server (App Server1 or App Server2) handled their request?
أ) Location/Access transparency
ب) Security
ج) Openness
د) Heterogeneity
**الإجابة الصحيحة: أ**
**التعليل:** المصدر: [نمط 2021 فصل ثاني] — رسم Request/Return result

---

### السؤال 91 (متوسط)
Which transparency ensures the client doesn't notice if a backup replica took over after a crash:
أ) Access
ب) Failure/Replication transparency
ج) Concurrency
د) Openness
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 92 (متوسط)
Load balancing across servers to keep response time stable relates to:
أ) Access transparency
ب) Performance transparency
ج) Mobility transparency
د) Concurrency transparency
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 93 (متوسط)
Adding more nodes to a Cluster without changing the application code relates to:
أ) Failure transparency
ب) Scaling transparency
ج) Access transparency
د) Location transparency
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 94 (متوسط)
A laptop moving between Wi-Fi networks while keeping its active session is an example of:
أ) Replication transparency
ب) Mobility transparency
ج) Performance transparency
د) Concurrency transparency
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 95 (متوسط)
Two clients editing a shared document simultaneously without conflicts relates to:
أ) Location transparency
ب) Concurrency transparency
ج) Failure transparency
د) Scaling transparency
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 96 (متوسط)
Accessing a printer whether it's local or across the building using the same command is:
أ) Access transparency
ب) Location transparency only
ج) Failure transparency
د) Mobility transparency
**الإجابة الصحيحة: أ**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 97 (متوسط)
How many forms of transparency are listed in the lecture in total:
أ) Six
ب) Seven
ج) Eight
د) Ten
**الإجابة الصحيحة: ج**
**التعليل:** المصدر: [محاضرة]

---

### 🔹 القسم 13: أسئلة مقارنة/مختلطة (Q98–Q100)

### السؤال 98 (متوسط)
Which pair correctly matches challenge → primary technique:
أ) Security → Rollback
ب) Failure handling → Checksums/Retransmission/Redundancy
ج) Openness → Semaphores
د) Concurrency → Documentation
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة] — دمج

---

### السؤال 99 (متوسط)
"Independent failures" and "Failure transparency" differ in that:
أ) They are identical concepts
ب) The first is a problem/consequence of the DS definition, the second is a design goal to hide that problem
ج) Neither relates to failures
د) The second causes the first
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة] — تحليل

---

### السؤال 100 (متوسط)
Which best summarizes the overall goal of a well-designed distributed system per this lecture: ---
أ) Maximize visible complexity to users
ب) Hide distribution/heterogeneity/failures while enabling resource sharing, security, scalability, and openness
ج) Eliminate all resource sharing
د) Use only a single computer
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة] — خلاصة
## 📌 ملاحظة مراجعة سريعة
أكثر الأسئلة المتوقعة تكراراً من هذه المحاضرة بالامتحان الفعلي (بناءً على الأنماط):
- تعريف **Access vs Location transparency** (يتكرر كل دورة تقريباً)
- **Failure handling techniques** (checksum/rollback/exception/redundancy) — نمط ثابت بـ4 دورات
- **Heterogeneity → أمثلة الحلول** (Internet protocols, Middleware, Mobile code)
- **Security's 3 components** (Confidentiality/Integrity/Availability)
- **Caching → Scalability solution**
