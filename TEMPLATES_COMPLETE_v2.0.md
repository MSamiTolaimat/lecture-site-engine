# مرجع القوالب الكامل — Lecture Site Engine v2.0

**للاستخدام مع:** `meta-prompt.v2.0.md` + `subject-brief.template.v2.yaml` + `SCHEMA.md v2.0`

جميع القوالب أدناه هي **النسخ الرسمية** — التزم بها حرفياً في المخرجات.

## ترتيب الأجزاء في كل محاضرة
1. **ملخص منظم** (ابدأ من هنا — نظرة عامة)
2. **شرح تفصيلي** (اقرأ التفاصيل)
3. **MCQ** (اختبر نفسك)
4. **Q&A Cards** (مراجعة سريعة)
5. **Cheat Sheet** (مرجع للامتحان)

---

## قوالب الأجزاء (Part Templates)

### ◈ ملخص منظم (part-summary) — PART 1: اقرأ هذا قبل المحاضرة!

```markdown
## {summary.heading}

### 📍 عن هذه المحاضرة
> [جملة واحدة: عن ماذا هذه المحاضرة؟]

### 🎯 ستتعلم
- [Concept 1 — one sentence explanation]
- [Concept 2 — one sentence explanation]
- [Concept 3 — one sentence explanation]
- [Concept 4 — one sentence explanation]

### 📚 المتطلبات السابقة
- [Topic X — why you need to know it]
- [Topic Y — how it connects]

### 💡 الأفكار الرئيسية
1. **[Concept A]:** [Brief explanation — 2-3 sentences why it matters]
2. **[Concept B]:** [Brief explanation — what makes it important]
3. **[Concept C]:** [Brief explanation — how it's used]

### 🔗 كيف تتصل هذه المحاضرة بالمحاضرات الأخرى؟
- **السابقة:** [Topic X] علّمك [basic concept] ← الآن نبني عليها
- **القادمة:** هذه ستُستخدم في [Topic Z] لـ [purpose]

### ⚠️ الأخطاء الشائعة الواجب تجنبها
- ❌ [Common misconception 1]
- ❌ [Common misconception 2]
```

---

### ◈ الشرح التفصيلي (part-detail) — PART 2

```markdown
## {detail.heading}

### {N}. {section_title}

<!-- @render: {type: "prose-first", visualization: "none", coverage: "XX%"} -->
<!-- @connectivity: {prerequisite: "section_N-1"} -->

#### 📍 أين نحن الآن؟
[One sentence context]

#### ⬅️ الربط مع السابق
[Connection to previous topic — يحل محل "النص الأصلي يقول"]

#### 💡 الفكرة الأساسية
**[One sentence core idea — BOLD]**

---

#### 📖 الشرح
[2-4 short paragraphs, chunked for readability]

#### 🎯 الملخص السريع
- Point 1
- Point 2
- Point 3

#### 📚 التطبيق
[Where is this used next?]

#### ⚠️ أخطاء شائعة
- ❌ Misconception
- ✅ Correct concept

#### 📄 النص الأصلي من المحاضرة
<details>
<summary>عرض النص الأصلي (coverage: XX%)</summary>

**النص الأصلي يقول:**
> [EXACT QUOTE from lecture]

**ملاحظة على التغطية:**
- ✓ تم شرح: [what was covered]
- ⚠️ غير مشروح بالكامل: [what wasn't]
- ℹ️ إضافة من الدليل: [what was added]

</details>
```

---

### ◈ أسئلة اختيار من متعدد (part-mcq) — PART 3

```markdown
## {mcq.heading}

> **{count} سؤالاً** — مستوى: {difficulty_list}

### السؤال {N} ({difficulty})

[نص السؤال]

أ) [Option A]
ب) [Option B]
ج) [Option C]
د) [Option D]

**الإجابة الصحيحة: {letter}**

**التعليل:**
- ✅ **الخيار {letter}:** [لماذا صحيح]
- ❌ **الخيار {letter}:** [لماذا خاطئ]
- ❌ **الخيار {letter}:** [لماذا خاطئ]
- ❌ **الخيار {letter}:** [لماذا خاطئ]
```

---

### ◈ بطاقات سؤال وجواب (part-qa-cards) — PART 4

```markdown
## {qa_cards.heading}

### البطاقة {N}
**Q{N}:** [سؤال مراجعة]
**A:** [إجابة مختصرة — جملة أو جملتان]

### البطاقة {N+1}
**Q{N+1}:** [سؤال]
**A:** [إجابة]

[كرّر للبطاقات الكاملة]
```

---

### ◈ ورقة المراجعة السريعة (part-cheat-sheet) — PART 5

```markdown
## {cheat_sheet.heading}

### 🔑 التعاريف السريعة
| المصطلح | التعريف القصير |
| --- | --- |

### 🔑 جداول المقارنة
| المعيار | الخيار أ | الخيار ب | الخيار ج |
| --- | --- | --- | --- |

### 🔑 المكونات والأدوات
| الأداة | الوظيفة | متى تستخدم |
| --- | --- | --- |

### 🔑 قواعس ذهبية لا تُنسى
| # | القاعدة |
| --- | --- |
| 1 | ... |
| 2 | ... |
| 3 | ... |

### 🔑 قاموس المصطلحات
| المصطلح | المعنى |
| --- | --- |

### 🔑 الخطوات السريعة
#### [Procedure 1]
```algorithm
1 | Step | Tool | Result
2 | Step | Tool | Result
```

#### [Procedure 2]
```algorithm
1 | Step | Tool | Result
```
```

---

## قوالب الكتل (Block Templates)

### ◈ الكود (block-code)

```markdown
#### 💻 الكود: {title}

#### ما هذا الكود؟
> [What does it do? Why?]

```{language}
// English comment per line
{code}
```

#### شرح كل سطر:
1. `{line}` → [role] — [why]
2. `{line}` → [role] — [why]

**المكتبات المطلوبة (Imports):**
> `import ...`

**الناتج المتوقع (لقطة الشاشة):**
> [Expected output description]
```

---

### ◈ الخطوات / الخوارزمية (block-algorithm)

```markdown
#### ⚙️ الخطوات / الخوارزمية: {title}

#### ما هدف هذه العملية؟
> [ماذا تحقق؟ متى تُستخدم؟]

```algorithm
1 | {step} | {tool} | {what happens}
2 | {step} | {tool} | {what happens}
3 | {step} | {tool} | {what happens}
```

#### نقاط التنفيذ:
- [تحذيرات الترتيب]
- [حالات الحافة أو الاستثناءات]
```

---

### ◈ المخطط (block-diagram)

```markdown
#### 📊 المخطط: {title}

#### ما هذا المخطط؟
> [ماذا يوضّح؟ لماذا وُجد؟]

#### وصف العُقد:
| # | العُقدة | النوع | الشرح |
| --- | --- | --- | --- |

#### وصف الروابط:
| من | إلى | التسمية | نوع السهم | الشرح |
| --- | --- | --- | --- | --- |

```diagram
type: {diagram_type}
title: {title}
direction: TD
nodes:
  - id: start
    label: Start
    kind: event
    level: 0
edges:
  - from: start
    to: next
    label: condition
```
```

---

### ◈ المخطط: دورة (block-visualization-cycle)

```markdown
#### 📊 المخطط: {title}

#### ما هذا المخطط؟
> {description of the cycle — 1–3 sentences}

#### وصف المراحل:
| # | المرحلة | الدخل | الخرج | الملاحظات |
| --- | --- | --- | --- | --- |

#### وصف الروابط:
| من | إلى | الشرط / الحافة | الملاحظات |
| --- | --- | --- | --- |

```diagram
type: cycle
stages:
  - id: stage1
    label: {stage name}
    description: {what happens}
  - id: stage2
    label: {stage name}
    description: {what happens}
  - id: stage3
    label: {stage name}
    description: {what happens}
relationships:
  - from: stage1
    to: stage2
    label: {condition/trigger}
  - from: stage2
    to: stage3
    label: {condition/trigger}
  - from: stage3
    to: stage1
    label: {loops back condition}
```
```

---

### ◈ المخطط: تسلسل (block-visualization-sequence)

```markdown
#### 📊 المخطط: {title}

#### ما هذا المخطط؟
> {description of the sequence — 1–3 sentences}

#### المشاركون:
| # | الاسم | النوع | الدور |
| --- | --- | --- | --- |

#### تسلسل الخطوات:
| الخطوة | المرسل | المستقبل | الرسالة / الحدث | الملاحظات |
| --- | --- | --- | --- | --- |

```diagram
type: sequence
participants:
  - id: actor1
    label: {Actor A}
  - id: actor2
    label: {Actor B}
  - id: actor3
    label: {Actor C}
interactions:
  - step: 1
    from: actor1
    to: actor2
    message: {message or action}
    note: {optional note}
  - step: 2
    from: actor2
    to: actor3
    message: {message or action}
    note: {optional note}
  - step: 3
    from: actor3
    to: actor1
    message: {response or result}
    note: {optional note}
```
```

---

### ◈ المخطط: هرمية (block-visualization-tree)

```markdown
#### 📊 المخطط: {title}

#### ما هذا المخطط؟
> {description of the hierarchy — 1–3 sentences}

#### العُقد (Nodes):
| ID | الاسم | المستوى | النوع | الشرح |
| --- | --- | --- | --- | --- |

#### الروابط الهرمية:
| الأب | الابن | نوع العلاقة | الملاحظات |
| --- | --- | --- | --- |

```diagram
type: tree
root:
  id: root
  label: {Root node name}
  description: {what is it?}
branches:
  - parent_id: root
    children:
      - id: child1
        label: {Child 1 name}
        description: {what is it?}
      - id: child2
        label: {Child 2 name}
        description: {what is it?}
  - parent_id: child1
    children:
      - id: grandchild1
        label: {Grandchild name}
        description: {details}
```
```

---

### ◈ الخطوات السريعة (block-visualization-inline-algorithm)

```markdown
#### ⚙️ الخطوات السريعة: {title}

```algorithm
1 | {Step 1 title} | {Tool/Method} | {What happens}
2 | {Step 2 title} | {Tool/Method} | {What happens}
3 | {Step 3 title} | {Tool/Method} | {What happens}
```

**نقطة مهمة:**
> {Optional constraint or edge case}
```

---

### ◈ مقارنة سريعة (block-visualization-comparison-matrix)

```markdown
#### ⚖️ مقارنة سريعة: {title}

| المعيار | الخيار أ: {name} | الخيار ب: {name} | الخيار ج: {name} |
| --- | --- | --- | --- |
| **السرعة** | {value} | {value} | {value} |
| **البساطة** | {value} | {value} | {value} |
| **التكلفة** | {value} | {value} | {value} |
| **متى تستخدم؟** | {condition} | {condition} | {condition} |

**الخلاصة:**
> {Which one to choose and why?}
```

---

### ◈ التشبيه (block-analogy)

```markdown
#### 💡 التشبيه:
> [جملة واحدة من الحياة اليومية]
> **وجه الشبه:** [X في المثال = Y في المفهوم]
```

---

### ◈ المقايضة (block-trade-off)

```markdown
#### ⚖️ المقايضة: {topic}

| | {الخيار A} | {الخيار B} |
| --- | --- | --- |
| **المزايا** | ... | ... |
| **العيوب** | ... | ... |
| **متى تختاره** | ... | ... |
```

---

### ◈ قبل / بعد (block-before-after)

```markdown
#### 🔄 قبل / بعد: {operation}

**قبل:**
```{lang}
{code or state before}
```

**بعد:**
```{lang}
{code or state after}
```

**ماذا تغيّر؟** [جملة واحدة]
```

---

### ◈ تتبع التنفيذ (block-trace)

```markdown
#### 🔍 تتبع التنفيذ: {title}

**المدخل:** {initial input or state}

| الخطوة | العملية | الحالة |
| --- | --- | --- |
| 1 | ... | ... |
| 2 | ... | ... |
| 3 | ... | ... |

**النتيجة:** {final output}
```

---

### ◈ المعادلات (block-equations)

```markdown
#### 📐 المعادلة: [اسم الصيغة]

$$
W = \sum_i t_i
$$

**الشرح:**
> W = العمل الكلي — مجموع أزمنة كل المهام
> t_i = زمن المهمة i

```math
S = \max_i t_i
```

**الشرح:**
> S = الزمن التسلسلي (Span) — أطول مسار في مخطط الحساب
```

---

### ◈ Callouts (block-callouts)

```markdown
#### مهم للامتحان ⚠️:
> [نقطة حرجة]

#### نقطة مهمة ⚠️:
> [مفهوم أساسي]

#### ملاحظة:
> [تفصيل أو استثناء]

#### الدرس المستفاد:
> [خلاصة عملية]

#### الفهم الخاطئ الشائع ❌:
[misconception]

#### الفهم الصحيح ✅:
[correct understanding]

#### 🤔 تفعيل الفهم (اسأل نفسك):
> **سؤال:** [question]
> **لماذا هذا مهم؟** [why]
```

---

### ◈ وصف الشاشة (block-screen)

```markdown
#### 🖼️ وصف الشاشة: {title}

> **الصفحة/الشريحة:** {page_num}
> **ملاحظة:** لا يمكن عرض لقطة الشاشة في الموقع — الوصف التالي يغطي كل عنصر.

| العنصر | الموقع | الوظيفة |
| --- | --- | --- |

**خطوات العمل:**
1. ...
2. ...
```

---

## ملاحظات الاستخدام

- **لا تخترع بدائل**: استخدم الشكل الموجود أعلاه حرفياً
- **ترك سطور فارغة**: دائماً اترك سطر فارغ قبل أي قائمة نقطية/مرقّمة
- **Metadata comments**: كل قسم `###` يجب أن يبدأ بـ `<!-- @render: {...} -->`
- **Collapsible original text**: النص الأصلي يأتي في `<details>` block في نهاية القسم
- **Coverage tracking**: كل قسم يجب أن يحتوي `@coverage` metadata

---

**استخدام هذا الملف مع:**
- `meta-prompt.v2.0.md`
- `subject-brief.template.v2.yaml`
- `SCHEMA.md v2.0`
