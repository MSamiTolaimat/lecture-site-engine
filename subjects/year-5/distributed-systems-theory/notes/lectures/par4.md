# المحاضرة الرابعة: Time in Distributed Systems
### د. محسن عبود — Chapter 14, Coulouris

---

## 📖 ملخص المحاضرة (Theory Summary)

### 1) لماذا الوقت مهم بالأنظمة الموزعة؟
- نحتاج **قياس دقيق** لمعرفة متى حدث event معيّن، ومزامنة الساعة مع مصدر خارجي (مثال: التدقيق بالتجارة الإلكترونية).
- خوارزميات تعتمد على مزامنة الساعات (مثال: الحفاظ على اتساق قواعد البيانات).
- **المشكلة الجوهرية**: محدودية إمكانية عمل timestamp للأحداث بعقد مختلفة بدقة كافية لمعرفة **ترتيب حدوث أي زوج من الأحداث**.

### 2) نموذج النظام الموزع (Model)
| الرمز | المعنى |
|---|---|
| مجموعة N من processes | pᵢ, i = 1,2,...,N |
| sᵢ | حالة pᵢ (state) — مثل المتغيرات |
| Actions of pᵢ | عمليات تُغيّر حالة pᵢ: إرسال أو استقبال رسالة |
| e | Event = حدوث action واحد |
| →ᵢ | ترتيب "occur before" ضمن pᵢ (ترتيب كلي للأحداث ضمن نفس الـ process) |
| history(pᵢ) = hᵢ | سلسلة الأحداث ضمن pᵢ مرتبة بالعلاقة →ᵢ: hᵢ = ⟨eᵢ⁰, eᵢ¹, eᵢ², ...⟩ |

### 3) Clock في الحاسوب
- **Clock**: جهاز يحسب oscillations (اهتزازات) بلورة عند تردد محدد ثابت.
- الـ OS يقرأ **الوقت الفيزيائي (Hardware time) Hᵢ(t)** لإنتاج **وقت برمجي (Software time) Cᵢ(t)**.
- نستخدم Cᵢ(t) لعمل **Timestamp** لأي event عند pᵢ (إسناد تاريخ ووقت للحدث).

**Clock Drift و Clock Skew:**
| المفهوم | التعريف |
|---|---|
| **Clock Drift** | البلورات تهتز بمعدلات مختلفة → الانحراف عن الوقت المثالي، **لا يمكن تجنبه إطلاقاً** |
| **Clock Skew** | الفرق **اللحظي** بين قراءتي ساعتين مختلفتين |

### 4) External vs Internal Synchronization
| النوع | التعريف |
|---|---|
| **Internal Synchronization** | لحد مزامنة D > 0: \|Cᵢ(t) - Cⱼ(t)\| < D لكل i,j ولكل وقت حقيقي t → الساعات تتفق ضمن الحد D. إذا كانت دقيقة ضمن D عن مصدر خارجي، فهي متفقة فيما بينها ضمن **2D** |
| **External Synchronization** | مزامنة الساعات مع مصدر زمن خارجي موثوق (مثل UTC) |

### 5) المزامنة في نظام متزامن (Synchronous System)
- بروتوكول بسيط: المرسل يرسل `M(t)`، المستقبل يضبط الوقت على `t + Ttrans`.
- الحدود معروفة بالنظام المتزامن: `min < Ttrans < max` (ثابتة).
- **القيمة المناسبة**: `Ttrans = (min + max) / 2` → ساعة المستقبل = `t + (min+max)/2`.
- **Clock skew بين المرسل والمستقبل**: `(max - min) / 2`
- **القيمة الدنيا للـ skew = 0**، **القيمة القصوى للـ skew = (max-min)/2**

### 6) طريقة Cristian لمزامنة الساعات
- تستخدم **Time Server** لمزامنة الحواسيب **خارجياً (External)**.
- ظروف التطبيق: نموذج **Client/Server**، و**Round-trip time قصير** مقارنة بالدقة المطلوبة.

**البروتوكول:**
1. Process p يرسل طلب الوقت برسالة `mr`.
2. يستقبل قيمة الوقت `t` برسالة `mt` (t تُدرج بـ mt بآخر لحظة ممكنة قبل الإرسال من Server S).
3. p يسجّل **Round-trip time الكلي `Tround`** (من إرسال mr حتى استقبال mt).
4. **الوقت المُقدَّر = t (في mt) + Tround/2**

### 7) The Berkeley Algorithm
- **مزامنة داخلية (Internal)** — يُختار computer منسّق يعمل كـ **Master**.
1. الـ Master يستطلع (polls) ساعات الـ Slaves دورياً.
2. الـ Slaves ترسل قيم ساعاتها للـ Master.
3. الـ Master يُقدّر ساعات الـ Slaves حسب round-trip time (**مشابه لخوارزمية Cristian**).
4. الـ Master يأخذ **متوسط (average)** قيم ساعات كل الـ Slaves (بما فيها ساعته هو) → **يلغي ميل الساعات الفردية للتسريع أو الإبطاء**.
5. الـ Master يرسل للـ Slaves **مقدار التعديل المطلوب** (قيمة موجبة أو سالبة).
6. كل Slave يُعدّل ساعته.

**ملاحظات مهمة:**
- تُلغي (eliminate) قراءات الساعات المعطوبة (**Faulty clocks**).
- الـ Master يأخذ **fault-tolerant average**: يختار subset من الساعات التي لا تختلف عن بعضها بأكثر من قيمة محددة، ويأخذ المتوسط من هذه القراءات فقط.
- إذا فشل الـ Master، يُنتخب آخر ليأخذ مكانه ويعمل بنفس الطريقة تماماً.

### 8) NTP (Network Time Protocol)
يُعرّف بنية لخدمة الوقت وبروتوكول لتوزيع معلومات الوقت عبر الإنترنت. **أهداف التصميم:**

| الهدف | الشرح |
|---|---|
| **External synchronization** | تمكين clients عبر الإنترنت من المزامنة بدقة مع **UTC** |
| **Reliability** | تحمّل فقدان الاتصال لفترات طويلة (redundant server & redundant path) |
| **Scalability** | تمكين عدد كبير من clients من إعادة المزامنة بتكرار كافٍ لتعويض معدلات الانحراف |
| **Security** | الحماية من التدخل بخدمة الوقت (متعمد أو عرضي) |

**بنية NTP (Architecture):**
- شبكة servers موزعة على الإنترنت، مرتبة بتسلسل هرمي منطقي يُسمى **synchronization subnet**، مستوياته تُسمى **Strata**.
- **Primary servers**: متصلة مباشرة بمصدر وقت (مثل radio clock يستقبل UTC) → **Stratum 1** (الجذر).
- **Secondary servers**: تُزامَن مع primary servers.
  - **Stratum 2**: تُزامَن مباشرة مع primary
  - **Stratum 3**: تُزامَن مع Stratum 2 ...وهكذا
- أدنى مستوى (leaf servers) يعمل على workstations المستخدمين.
- النظام يُعيد تشكيل نفسه (reconfigure) عند تعذّر الوصول لبعض السيرفرات.

**أنماط مزامنة سيرفرات NTP (Synchronization Modes):**

| النمط | الوصف | الدقة |
|---|---|---|
| **Multicast mode** | مُخصّص لشبكات LAN عالية السرعة؛ سيرفر واحد أو أكثر يبث الوقت دورياً (multicast)، والعملاء يضبطون ساعاتهم بافتراض تأخير صغير | **دقة منخفضة**، كافية لأغراض كثيرة |
| **Procedure-call mode** | مشابه لخوارزمية Cristian؛ سيرفر يقبل طلبات ويرد بقراءة ساعته | **دقة أعلى من multicast** |
| **Symmetric mode** | لسيرفرات توفير الوقت بالـ LAN والمستويات العليا (strata أقل)؛ زوج سيرفرات يتبادلان رسائل تحمل معلومات توقيت | **أعلى دقة** |

### 9) Logical Time & Logical Clocks

**Happened-Before Relation (→)**
- لا يمكن مزامنة الساعات الفيزيائية بشكل مثالي عبر النظام الموزع → لا يمكن استخدام الوقت الفيزيائي لمعرفة ترتيب أي زوج أحداث عشوائي.
- **القواعد الثلاثة:**
  - **HB1**: إذا كانت pᵢ: e →ᵢ e′ (بنفس الـ process)، فإن e → e′
  - **HB2**: لأي رسالة m: send(m) → receive(m)
  - **HB3**: إذا كان e → e′ و e′ → e″، فإن e → e″ (**ترتيب سببي — Causal ordering**)
- الأحداث التي لا ترتبط بعلاقة → تُسمى **Concurrent (متزامنة)** وتُكتب: `a || e`.

**Lamport Timestamps (Logical Clocks)**
- Lamport ابتكر آلية لالتقاط ترتيب happened-before **رقمياً** — **Logical Clock**: عداد برمجي متزايد باستمرار Lᵢ، **لا علاقة له بأي ساعة فيزيائية**.
- **LC1**: Lᵢ يُزاد قبل كل event يصدر بـ pᵢ: `Lᵢ := Lᵢ + 1`
- **LC2**:
  - (a) عند إرسال رسالة m، تُرفَق بها القيمة `t = Lᵢ`
  - (b) عند استقبال (m, t)، يحسب Pⱼ: `Lⱼ := max(Lⱼ, t)` ثم يطبّق LC1 قبل عمل timestamp لحدث receive(m)

**⭐ نقطة حرجة:**
- `e → e′ ⟹ L(e) < L(e′)` (**اتجاه واحد فقط!**)
- **لكن**: `L(e) < L(e′)` **لا يعني بالضرورة** `e → e′` — قد يكون `e || e′` (هذا القصور بخوارزمية Lamport، دفع لاحقاً لتطوير Vector Clocks).

**Totally Ordered Logical Clocks**
- لترتيب كامل الأحداث نُعرّف: timestamp الحدث e عند pᵢ = (Tᵢ, i)، وللحدث e′ عند pⱼ = (Tⱼ, j)
- التعريف: `(Tᵢ, i) < (Tⱼ, j)` إذا `Tᵢ < Tⱼ`، أو `Tᵢ = Tⱼ و i < j`

**Vector Clocks (Mattern and Fidge)**
- طُوِّرت للتغلب على قصور Lamport (L(e) < L(e′) لا تعني e → e′).
- كل process pᵢ يحتفظ بـ **vector clock Vᵢ**:
  - **VC1**: بدايةً، `Vᵢ[j] = 0` لكل i, j = 1,...,N
  - **VC2**: قبل عمل timestamp لحدث مباشرة، `Vᵢ[i] := Vᵢ[i] + 1`
  - **VC3**: pᵢ يُرفق القيمة `t = Vᵢ` بكل رسالة يرسلها
  - **VC4**: عند استقبال timestamp t برسالة، `Vᵢ[j] := max(Vᵢ[j], t[j])` لكل j = 1,...,N

**مقارنة الـ Vector Timestamps:**
| العلاقة | الشرط |
|---|---|
| `V = V′` | `V[j] = V′[j]` لكل j |
| `V ≤ V′` | `V[j] ≤ V′[j]` لكل j |
| `V < V′` | `V ≤ V′` و `V ≠ V′` |
| وإلا | `V <> V′` (غير قابلين للمقارنة) |

- **`V(e) < V(e′) ⟺ e → e′`** (علاقة ثنائية الاتجاه — هذا التحسين الأساسي عن Lamport!)
- **`V(e) <> V(e′) ⟺ e || e′`** (متزامنان)

---

## ✅ 100 سؤال MCQ (مبنية على نص المحاضرة + أنماط الدورات السابقة)

> ترميز المصدر: **[محاضرة]** = من نص السلايدات مباشرة | **[نمط 2022-2023]** / **[نمط 2025]** / **[نمط 2021]** = مبني على نمط سؤال ظهر بنفس الصياغة أو قريب منها في تلك الدورة.

### 🔹 القسم 1: مقدمة (Q1–Q5)

### السؤال 1 (متوسط)
The core problem of time in distributed systems is:
أ) Lack of processing power
ب) Limited ability to timestamp events at different nodes accurately enough to determine event order
ج) Lack of storage
د) Network bandwidth only
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 2 (متوسط)
We need accurate time measurement for reasons including:
أ) Auditing (e.g., e-commerce) and algorithms depending on clock sync
ب) Only cosmetic display purposes
ج) Only for compiling code
د) None of the above
**الإجابة الصحيحة: أ**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 3 (متوسط)
Maintaining consistency of databases is an example of an algorithm that depends on:
أ) Random values
ب) Clock synchronization
ج) User input only
د) Static configuration
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 4 (متوسط)
The problem in distributed time is fundamentally about knowing:
أ) The CPU speed of each node
ب) The order in which any pair of events occurred
ج) The IP address of each node
د) The bandwidth of each channel
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 5 (متوسط)
External source of time synchronization is exemplified by:
أ) A local variable
ب) An auditing time source in e-commerce / UTC
ج) A random number generator
د) None of the above
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### 🔹 القسم 2: نموذج النظام الموزع (Q6–Q11)

### السؤال 6 (متوسط)
In the model, sᵢ represents:
أ) An event
ب) The state of process pᵢ (e.g., variables)
ج) A message queue
د) A clock reading
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 7 (متوسط)
Actions of pᵢ that transform its state include:
أ) Only reading local memory
ب) Sending or receiving a message
ج) Only idle waiting
د) None of the above
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 8 (متوسط)
An event (e) is defined as:
أ) A collection of processes
ب) The occurrence of a single action
ج) A clock value
د) A network packet
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 9 (متوسط)
history(pᵢ) = hᵢ represents:
أ) A single event
ب) The series of events within pᵢ ordered by →ᵢ
ج) The clock drift rate
د) The IP address history
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 10 (متوسط)
The relation →ᵢ represents:
أ) A relation between different processes only
ب) "Occur before" — a total order of events within pᵢ
ج) A security relation
د) A bandwidth relation
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 11 (متوسط)
hᵢ is written as a sequence:
أ) A random unordered set
ب) ⟨eᵢ⁰, eᵢ¹, eᵢ², ...⟩
ج) A single value
د) A matrix
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### 🔹 القسم 3: Clock في الحاسوب (Q12–Q18)

### السؤال 12 (متوسط)
A Clock is defined as a device that counts:
أ) Network packets
ب) Oscillations occurring in a crystal at a definite frequency
ج) CPU cycles only
د) Memory addresses
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 13 (متوسط)
The OS reads the node's Hardware time Hᵢ(t) to produce:
أ) A network address
ب) A Software time Cᵢ(t)
ج) A checksum
د) A vector clock
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 14 (متوسط)
We use the software time Cᵢ(t) to:
أ) Encrypt messages
ب) Timestamp any event at pᵢ
ج) Route packets
د) Compress data
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 15 (متوسط)
Clock drift refers to:
أ) The instantaneous difference between two clock readings
ب) Crystals oscillating at different rates, causing deviation over time
ج) A type of security threat
د) A network protocol
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 16 (متوسط)
Clock drift:
أ) Can be completely eliminated
ب) Cannot be avoided
ج) Only occurs in synchronous systems
د) Only occurs in asynchronous systems
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 17 (متوسط)
Clock skew is defined as:
أ) The instantaneous difference between the readings of any two clocks
ب) The rate of crystal oscillation
ج) A type of failure
د) The total round-trip time
**الإجابة الصحيحة: أ**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 18 (متوسط)
Differences between two clock readings is called clock drift:
أ) True
ب) False
**الإجابة الصحيحة: أ**
**التعليل:** المصدر: [نمط 2022-2023] Q26 (ملاحظة: يُصاغ أحياناً كـ True/False بامتحان الأستاذ رغم أن التعريف الدقيق أقرب لـ Clock Skew)

---

### 🔹 القسم 4: External vs Internal Synchronization (Q19–Q24)

### السؤال 19 (متوسط)
Internal synchronization means clocks agree:
أ) With an external UTC source only
ب) Within a bound D of each other, |Cᵢ(t) - Cⱼ(t)| < D
ج) Perfectly with zero difference
د) Only during startup
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 20 (متوسط)
If clocks are accurate to within D of an external source, they agree with each other within:
أ) D
ب) 2D
ج) D/2
د) 4D
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 21 (متوسط)
External synchronization involves synchronizing with:
أ) Only other slave clocks
ب) An external, authoritative source of time
ج) Nothing external
د) Only the fastest local clock
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 22 (متوسط)
Used for physical synchronization in intranets:
أ) Cristian's method
ب) NTP
ج) Lamport algorithms
د) Both a & b
**الإجابة الصحيحة: د**
**التعليل:** المصدر: [نمط 2022-2023] Q25

---

### السؤال 23 (متوسط)
Cristian method is used as a logical solution:
أ) True
ب) False (it's a physical clock synchronization method)
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [نمط 2022-2023] Q27

---

### السؤال 24 (متوسط)
Cristian method suffers from:
أ) Perfect scalability
ب) Single point of failure
ج) No round-trip time consideration
د) Only working in asynchronous systems
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [نمط 2022-2023] Q27

---

### 🔹 القسم 5: المزامنة بالنظام المتزامن (Q25–Q31)

### السؤال 25 (متوسط)
In a synchronous system, bounds on Ttrans satisfy:
أ) Ttrans > max
ب) min < Ttrans < max (constant)
ج) Ttrans = 0 always
د) No bounds exist
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 26 (متوسط)
The suggested value to set Ttrans in a synchronous system is:
أ) max only
ب) min only
ج) (min + max) / 2
د) max × min
**الإجابة الصحيحة: ج**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 27 (متوسط)
If we set Ttrans = (min+max)/2, the receiver's clock is set to:
أ) t only
ب) t + (min+max)/2
ج) t - (min+max)/2
د) min + max
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 28 (متوسط)
The clock skew between sender and receiver in this synchronous protocol is:
أ) min - max
ب) (max - min) / 2
ج) max × min
د) 0 always
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 29 (متوسط)
The minimum possible value for clock skew in this synchronous protocol is:
أ) 0
ب) (max-min)/2
ج) max
د) min
**الإجابة الصحيحة: أ**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 30 (متوسط)
The maximum possible value for clock skew in this synchronous protocol is:
أ) 0
ب) (max - min) / 2
ج) max + min
د) Infinite
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 31 (متوسط)
In this protocol, the sender's action is to:
أ) Wait for a reply
ب) Send M(t)
ج) Broadcast to all networks
د) Do nothing
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### 🔹 القسم 6: طريقة Cristian (Q32–Q40)

### السؤال 32 (متوسط)
Cristian's method uses a ________ to synchronize computers externally:
أ) Vector clock
ب) Time server
ج) Lamport counter
د) Dispatcher
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 33 (متوسط)
Cristian's method applies best when:
أ) Round-trip time is long compared to required accuracy
ب) Round-trip time is short compared to required accuracy (C/S model)
ج) There is no client-server relationship
د) The system is fully asynchronous
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 34 (متوسط)
In Cristian's protocol, process p sends a request in message:
أ) mt
ب) mr
ج) Vi
د) Li
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 35 (متوسط)
The time value t is inserted into message mt:
أ) At the earliest possible point
ب) At the last possible point before transmission from S
ج) Randomly
د) After transmission
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 36 (متوسط)
Process p records the ________ taken to send the request and receive the reply:
أ) Clock skew
ب) Total round-trip time (Tround)
ج) Vector timestamp
د) Logical clock value
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 37 (متوسط)
The estimated time in Cristian's method is calculated as:
أ) t only
ب) t (in mt) + Tround/2
ج) t - Tround
د) Tround/2 only
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 38 (متوسط)
Cristian's method is best suited for:
أ) Peer-to-peer only
ب) Client-Server model
ج) Asynchronous systems only
د) No specific model
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 39 (متوسط)
A key assumption for Cristian's method to be accurate is:
أ) Very long round-trip times
ب) Round-trip time short relative to the required accuracy
ج) No server involved
د) Multiple masters
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 40 (متوسط)
Which best describes the relationship between Cristian's method and NTP's Procedure-call mode:
أ) They are unrelated
ب) Procedure-call mode is similar to Cristian's algorithm
ج) They are identical to Multicast mode
د) NTP never uses request-reply
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### 🔹 القسم 7: خوارزمية Berkeley (Q41–Q51)

### السؤال 41 (متوسط)
The Berkeley algorithm is used for:
أ) External synchronization only
ب) Internal synchronization
ج) Security only
د) Failure masking only
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة] + [نمط 2022-2023] Q25

---

### السؤال 42 (متوسط)
In Berkeley, a coordinator computer is chosen to act as:
أ) A slave
ب) The master
ج) A time server for the whole Internet
د) A stratum-1 server
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 43 (متوسط)
The first step in the Berkeley algorithm is:
أ) Slaves adjust their clocks
ب) The master periodically polls the slaves' clocks
ج) The master fails
د) Slaves elect a new master
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 44 (متوسط)
After polling, the slaves:
أ) Ignore the master
ب) Send back their clock values to the master
ج) Shut down
د) Broadcast to all other slaves directly
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 45 (متوسط)
The master estimates the slaves' clocks using round-trip time, similar to:
أ) Lamport's algorithm
ب) Cristian's algorithm
ج) Vector clocks
د) NTP symmetric mode
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 46 (متوسط)
The master averages the slaves' clock values, including:
أ) Only the fastest slave
ب) Its own clock's reading
ج) Only the slowest slave
د) None, it excludes itself
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 47 (متوسط)
Averaging clock values in Berkeley serves to:
أ) Increase drift
ب) Cancel out individual clocks' tendencies to run fast or slow
ج) Eliminate the need for a master
د) Increase security
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 48 (متوسط)
The master sends back to slaves:
أ) A new absolute time only
ب) The amount that slaves' clocks should adjust by (positive or negative)
ج) Nothing
د) A new master election request
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 49 (متوسط)
The Berkeley algorithm eliminates readings from:
أ) All slaves equally
ب) Faulty clocks
ج) The master's own clock
د) None of the above
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 50 (متوسط)
The "fault-tolerant average" in Berkeley is computed from:
أ) All clocks regardless of deviation
ب) A subset of clocks that don't differ from one another by more than a specified amount
ج) Only the master's clock
د) Only the newest clock reading
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 51 (متوسط)
If the master in Berkeley fails:
أ) The whole system stops permanently
ب) Another master can be elected to take over and function exactly as its predecessor
ج) All slaves must restart
د) External sync is used instead
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### 🔹 القسم 8: NTP - أهداف التصميم (Q52–Q58)

### السؤال 52 (متوسط)
NTP defines an architecture for:
أ) Only file transfer
ب) A time service and a protocol to distribute time information over the Internet
ج) Only security
د) Only routing
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 53 (متوسط)
NTP's external synchronization design aim enables clients to be synchronized accurately to:
أ) The master's local clock only
ب) UTC (an international standard for timekeeping)
ج) Any random reference
د) Lamport's logical clock
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 54 (متوسط)
NTP's Reliability aim means the system can survive:
أ) Only short outages
ب) Lengthy losses of connectivity (via redundant servers/paths)
ج) No outages at all
د) Only single server failure
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 55 (متوسط)
NTP's Scalability aim enables:
أ) Only a few clients to sync
ب) Large numbers of clients/servers to resynchronize frequently enough to offset drift
ج) No resynchronization needed
د) Only manual synchronization
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 56 (متوسط)
NTP's Security aim protects against:
أ) Only malicious interference
ب) Interference with the time service, whether malicious or accidental
ج) Only accidental errors
د) Nothing, NTP has no security aim
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 57 (متوسط)
NTP doesn't support scalability:
أ) True
ب) False (Scalability is one of NTP's explicit design aims)
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [نمط 2022-2023] Q27

---

### السؤال 58 (متوسط)
Which of the following is NOT one of NTP's four design aims:
أ) External synchronization
ب) Reliability
ج) Scalability, Security
د) Minimizing hardware cost
**الإجابة الصحيحة: د**
**التعليل:** المصدر: [محاضرة]

---

### 🔹 القسم 9: بنية NTP (Strata) (Q59–Q65)

### السؤال 59 (متوسط)
NTP servers are connected in a logical hierarchy called:
أ) A vector clock tree
ب) A synchronization subnet
ج) A dispatcher chain
د) A stub hierarchy
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 60 (متوسط)
The levels of the NTP hierarchy are called:
أ) Layers
ب) Strata
ج) Tiers only
د) Nodes
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 61 (متوسط)
Primary servers, connected directly to a time source (e.g., radio clock/UTC), occupy:
أ) Stratum 0
ب) Stratum 1 (the root)
ج) Stratum 3
د) The leaf level only
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 62 (متوسط)
Stratum 2 servers are:
أ) Primary servers
ب) Secondary servers synchronized directly with primary servers
ج) Leaf servers only
د) Unrelated to primary servers
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 63 (متوسط)
The lowest-level (leaf) NTP servers execute in:
أ) Only data centers
ب) Users' workstations
ج) Only primary time sources
د) Satellites
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 64 (متوسط)
In vector clocks in low stratum number are less accurate:
أ) True
ب) False (lower stratum number = closer to root = MORE accurate)
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [نمط 2022-2023] Q29

---

### السؤال 65 (متوسط)
When servers become unreachable, the NTP synchronization subnet:
أ) Stops functioning entirely
ب) Reconfigures itself
ج) Deletes all clocks
د) Switches to Lamport clocks
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### 🔹 القسم 10: أنماط مزامنة NTP (Q66–Q71)

### السؤال 66 (متوسط)
Multicast mode is intended for use on:
أ) A wide area network with high latency
ب) A high speed LAN
ج) Only the Internet backbone
د) Only satellite links
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 67 (متوسط)
Multicast mode is intended for high speed LAN:
أ) True
ب) False
**الإجابة الصحيحة: أ**
**التعليل:** المصدر: [نمط 2022-2023] Q29

---

### السؤال 68 (متوسط)
Multicast mode's accuracy is:
أ) The highest of all NTP modes
ب) Low, but sufficient for many purposes
ج) Perfect
د) Irrelevant
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 69 (متوسط)
Procedure-call mode is similar to:
أ) Berkeley algorithm
ب) Cristian's algorithm
ج) Vector clocks
د) Lamport timestamps
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة] + [نمط 2022-2023] Q29

---

### السؤال 70 (متوسط)
Symmetric mode is intended for:
أ) Only leaf workstations
ب) Servers supplying time in LANs and higher levels (lower strata) of the subnet
ج) Only external clients
د) Only stratum 3 and below
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 71 (متوسط)
Which NTP mode has the highest accuracy:
أ) Multicast mode
ب) Procedure-call mode
ج) Symmetric mode
د) All modes are equally accurate
**الإجابة الصحيحة: ج**
**التعليل:** المصدر: [محاضرة]

---

### 🔹 القسم 11: Happened-Before Relation (Q72–Q81)

### السؤال 72 (متوسط)
From the point of view of a single process, events are ordered uniquely by:
أ) A global clock
ب) Times shown on the local clock
ج) A vector clock only
د) Random assignment
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 73 (متوسط)
We cannot use physical time to determine the order of any arbitrary pair of events because:
أ) Physical clocks don't exist
ب) We cannot synchronize clocks perfectly across a distributed system
ج) Events don't have timestamps
د) None of the above
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 74 (متوسط)
HB1 states that if e →ᵢ e′ within the same process pᵢ, then:
أ) e || e′
ب) e → e′
ج) e′ → e
د) No relation exists
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 75 (متوسط)
HB2 states that for any message m:
أ) receive(m) → send(m)
ب) send(m) → receive(m)
ج) send(m) = receive(m)
د) No relation between send and receive
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 76 (متوسط)
HB3 (transitivity) states that if e → e′ and e′ → e″, then:
أ) e || e″
ب) e → e″
ج) e″ → e
د) No conclusion can be drawn
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 77 (متوسط)
The happened-before relation → is also known as:
أ) Random ordering
ب) Causal ordering
ج) Physical ordering
د) Arbitrary ordering
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 78 (متوسط)
Events not ordered by the happened-before relation are called:
أ) Sequential
ب) Concurrent (written a || e)
ج) Faulty
د) Idempotent
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 79 (متوسط)
Two events at different processes with no chain of messages intervening between them are:
أ) Always causally related
ب) Concurrent
ج) Always identical
د) Always erroneous
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 80 (متوسط)
From the classic three-process happened-before diagram, if a→b, c→d, b→c, and d→f, we can conclude:
أ) a and f are unrelated
ب) a → f (by transitivity)
ج) f → a
د) a || f
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 81 (متوسط)
The happened-before relation provides a total order for events:
أ) Across the whole distributed system always
ب) Only partially — some events remain incomparable (concurrent)
ج) Never, it's useless
د) Only for a single event
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### 🔹 القسم 12: Lamport Timestamps (Q82–Q90)

### السؤال 82 (متوسط)
Lamport's logical clock is:
أ) A physical hardware device
ب) A monotonically increasing software counter Lᵢ
ج) Related directly to physical clock readings
د) A vector of N values
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 83 (متوسط)
LC1 states that Lᵢ is incremented:
أ) After each event
ب) Before each event is issued at process pᵢ
ج) Only once per session
د) Never
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 84 (متوسط)
LC2(a) states that when pᵢ sends message m, it piggybacks on m the value:
أ) t = 0
ب) t = Lᵢ
ج) t = a random number
د) t = the physical clock reading
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 85 (متوسط)
LC2(b) states that on receiving (m, t), process pⱼ computes:
أ) Lⱼ := t only
ب) Lⱼ := max(Lⱼ, t), then applies LC1
ج) Lⱼ := Lⱼ - t
د) Lⱼ := 0
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 86 (متوسط)
If e → e′, then according to Lamport's algorithm:
أ) L(e) > L(e′)
ب) L(e) < L(e′)
ج) L(e) = L(e′)
د) No relation
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 87 (متوسط)
If L(e) < L(e′), we can conclude:
أ) e → e′ definitely, OR e || e′ (cannot be certain)
ب) e → e′ always with certainty
ج) e′ → e always
د) e and e′ are identical
**الإجابة الصحيحة: أ**
**التعليل:** المصدر: [محاضرة] — القصور الأساسي بخوارزمية Lamport

---

### السؤال 88 (متوسط)
L is incremented after issuing event:
أ) True
ب) False (incremented before the event, per LC1)
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [نمط 2022-2023] Q35

---

### السؤال 89 (متوسط)
Which is correct in Lamport algorithm:
أ) e→e′ then L(e) > L(e′)
ب) L(e) < L(e′) then e→e′ (always)
ج) Li is incremented before issuing an event
د) None of the above
**الإجابة الصحيحة: ج**
**التعليل:** المصدر: [نمط 2022-2023] Q35

---

### السؤال 90 (متوسط)
The main limitation of Lamport clocks that motivated Vector Clocks was:
أ) They are too slow to compute
ب) L(e) < L(e′) does not guarantee e → e′
ج) They require physical clocks
د) They cannot handle message passing
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### 🔹 القسم 13: Vector Clocks (Q91–Q100)

### السؤال 91 (متوسط)
Vector clocks were developed by:
أ) Cristian and Lamport
ب) Mattern and Fidge
ج) Coulouris and Dollimore
د) Berkeley researchers
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 92 (متوسط)
VC1 states that initially:
أ) Vᵢ[j] = 1 for all i,j
ب) Vᵢ[j] = 0 for all i,j = 1,2,...,N
ج) Vᵢ[j] is undefined
د) Vᵢ[j] = infinity
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 93 (متوسط)
VC2 states that just before pᵢ timestamps an event, it sets:
أ) Vᵢ[j] := Vᵢ[j] + 1 for all j
ب) Vᵢ[i] := Vᵢ[i] + 1 (only its own index)
ج) Vᵢ[i] := 0
د) Vᵢ := max of all values
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 94 (متوسط)
VC3 states that pᵢ includes in every message it sends:
أ) Only its own index i
ب) The value t = Vᵢ (the whole vector)
ج) Nothing extra
د) Only a Lamport scalar
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 95 (متوسط)
VC4 states that when pᵢ receives a timestamp t in a message, it sets:
أ) Vᵢ[j] := t[j] for all j directly
ب) Vᵢ[j] := max(Vᵢ[j], t[j]) for j=1,2,...,N
ج) Vᵢ[j] := 0
د) Vᵢ[j] := Vᵢ[j] - t[j]
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 96 (متوسط)
V ≤ V′ is defined as:
أ) V[j] > V′[j] for all j
ب) V[j] ≤ V′[j] for all j = 1,2,...,N
ج) V[j] = V′[j] for at least one j
د) None of the above
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 97 (متوسط)
V(e) < V(e′) is equivalent to:
أ) e || e′
ب) e → e′
ج) e′ → e
د) No relation exists
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة] — الفرق الجوهري عن Lamport (علاقة ثنائية الاتجاه)

---

### السؤال 98 (متوسط)
V(e) <> V(e′) (incomparable) is equivalent to:
أ) e → e′
ب) e′ → e
ج) e || e′ (concurrent)
د) e = e′
**الإجابة الصحيحة: ج**
**التعليل:** المصدر: [محاضرة]

---

### السؤال 99 (متوسط)
In vector clocks we say e→e′ when:
أ) V(e)=V(e′)
ب) V(e)<>V(e′)
ج) V(e)≤V(e′)
د) V(e)<V(e′) is False
**الإجابة الصحيحة: ج**
**التعليل:** المصدر: [نمط 2022-2023] Q30

---

### السؤال 100 (متوسط)
Vector clocks overcome Lamport clocks' limitation by ensuring that:
أ) They are faster to compute
ب) V(e) < V(e′) is a necessary AND sufficient condition for e → e′
ج) They need no message piggybacking
د) They eliminate clock drift entirely
**الإجابة الصحيحة: ب**
**التعليل:** المصدر: [محاضرة]
## 📌 ملاحظة مراجعة سريعة
أهم نقاط هذه المحاضرة (الأكثر تكراراً بالامتحانات المقالية والـ MCQ معاً):
- **حساب clock skew** بالنظام المتزامن: `Ttrans = (min+max)/2` و skew range `[0, (max-min)/2]` — سؤال حسابي شبه ثابت.
- **خوارزمية Berkeley**: مسألة حسابية بأرقام فعلية (مثال: 4 حواسيب بأوقات مختلفة) — احرص على إتقان: تقدير القراءات، fault-tolerant average، التعديل الموجب/السالب.
- **الفرق بين Cristian (External) و Berkeley (Internal)**.
- **أنماط NTP الثلاثة** (Multicast/Procedure-call/Symmetric) ومستوى الدقة لكل منها.
- **Happened-before relation** (HB1, HB2, HB3) + رسم توضيحي لثلاث processes (سؤال متكرر: أوجد الأحداث المتزامنة/السببية).
- **Lamport vs Vector Clocks**: احفظ الفرق الجوهري (Lamport اتجاه واحد فقط، Vector Clock علاقة ثنائية الاتجاه) — هذا أكثر نقطة يُختبر فيها الفهم العميق.
- **حساب Vector Timestamps** من رسم رسائل بين processes (نمط سؤال ثابت بكل الدورات المقالية تقريباً).
