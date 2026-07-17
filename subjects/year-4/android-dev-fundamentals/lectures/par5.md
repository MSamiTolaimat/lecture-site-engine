# المحاضرة 5 — Activity & Intents (مكوّن النشاط والنوايا)
> **المادة:** أساسيات تطوير تطبيقات أندرويد (النظري الكامل) (نظري) | **الموضوع:** `Activity` — دورة الحياة، `AndroidManifest.xml`، `Intent`، `Intent Filter`، `Intent Resolution`

---

## 📌 خريطة التكامل (أين تقع هذه المادة في مسار أندرويد؟)

| المرحلة | الأدوات | المخرجات |
| --- | --- | --- |
| أساسيات كوتلن (`val/var`, `functions`, `OOP`) | `Kotlin` | فهم بنية الكود |
| بنية تطبيق أندرويد (`App Fundamentals`) | `AndroidManifest.xml`, `Activity`, `Service` | معرفة مكونات التطبيق الأربعة |
| **مكوّن النشاط `Activity` والتنقل بين الشاشات (`Intent`)** ← أنت هنا | `Activity class`, `Intent`, `Intent Filter`, `AndroidManifest.xml` | فهم دورة حياة الشاشة والتنقل بين الشاشات داخل التطبيق وبين التطبيقات |
| واجهات المستخدم التصريحية (`Compose UI`) | `@Composable`, `Modifier`, `State` | بناء واجهات تفاعلية |

> **نوع هذه المحاضرة:** نظرية بالكامل (Theoretical) — تشرح مفهوم `Activity`، دورة حياته الكاملة عبر 6 دوال `callback`، آلية `Intent` بأنواعها، وكيفية عمل `Intent Resolution`. تحتوي على أمثلة كود `Kotlin` وأمثلة `XML` من ملف `AndroidManifest.xml`.

---

## الجزء الأول: الشرح التفصيلي (سطر بسطر / فقرة بفقرة)

### 1. تعريف الـ Activity كنقطة دخول التطبيق

#### النص الأصلي يقول (English):
> The activity serves as the entry point for an app's interaction with the user. You implement an activity as a subclass of the Activity class. The Android system initiates code in an Activity instance by invoking specific callback methods that correspond to specific stages of its lifecycle.

#### الترجمة الحرفية:
> النشاط (Activity) يُمثّل نقطة الدخول لتفاعل التطبيق مع المستخدم. تقوم بتطبيق النشاط كصنف فرعي (subclass) من صنف Activity. يقوم نظام أندرويد بتشغيل الكود داخل نسخة (instance) النشاط عن طريق استدعاء دوال استدعاء رجعي (callback methods) محددة تقابل مراحل معينة من دورة حياته.

#### الشرح المبسّط:
الـ `Activity` هو الباب الذي يدخل منه المستخدم للتفاعل مع تطبيقك — أي شاشة يراها المستخدم ويضغط عليها هي في الأساس نشاط واحد. السبب في وجوده هو أن أندرويد يحتاج طريقة موحّدة لإدارة كل شاشة على حدة: متى تُنشأ، متى تظهر، متى تختفي، ومتى تُدمَّر لتحرير الذاكرة. لفهم هذا، تخيّل أن تطبيق الجوّال هو مبنى متعدد الطوابق، وكل طابق (Activity) له بوّاب خاص (دوال الـ callback) يُبلغ الإدارة (نظام أندرويد) بلحظة دخول الزوار وخروجهم من ذلك الطابق. فمثلاً حين تفتح تطبيق البريد الإلكتروني، الشاشة الأولى التي تراها (صندوق الوارد) هي نسخة من صنف يرث من `Activity`، والنظام هو من يتحكم في استدعاء دوالها في اللحظة المناسبة وليس أنت من يستدعيها يدويًا.

**لماذا؟** لأن نظام التشغيل (وليس المطوّر) هو من يقرر متى يُشغَّل التطبيق في المقدمة أو الخلفية بسبب محدودية موارد الجوّال، لذلك يحتاج آلية موحّدة (دورة حياة) للتحكم بكل الشاشات بنفس الطريقة.

---

### 2. الـ Activity توفّر نافذة الرسم وتمثّل شاشة واحدة

#### النص الأصلي يقول (English):
> An activity provides the window in which the app draws its UI. Generally, one activity implements one screen in an app. Most apps contain multiple screens, which means they comprise multiple activities. Typically, one activity in an app is specified as the main activity, which is the first screen to appear when the user launches the app.

#### الترجمة الحرفية:
> يوفّر النشاط النافذة التي يرسم فيها التطبيق واجهة المستخدم الخاصة به. بشكل عام، يمثّل نشاط واحد شاشة واحدة في التطبيق. تحتوي معظم التطبيقات على عدة شاشات، مما يعني أنها تتكون من عدة أنشطة. عادةً، يُحدَّد نشاط واحد في التطبيق كنشاط رئيسي (main activity)، وهو أول شاشة تظهر عندما يُطلق المستخدم التطبيق.

#### الشرح المبسّط:
كل `Activity` بمثابة "لوحة رسم" فارغة يستخدمها النظام لعرض واجهة المستخدم عليها — الأزرار، النصوص، الصور. فكرة أن نشاط واحد = شاشة واحدة تجعل تصميم التطبيق منظّمًا: كل مهمة أو صفحة منفصلة تُبنى في نشاط مستقل بدلاً من خلط كل شيء في ملف واحد ضخم. ولأن معظم التطبيقات تحتاج أكثر من شاشة (شاشة تسجيل الدخول، شاشة الرئيسية، شاشة الإعدادات...)، يحتوي التطبيق على عدة أنشطة، ويُحدَّد أحدها كـ`main activity` ليكون أول ما يراه المستخدم. تشبيه ذلك تمامًا كصفحات كتاب: كل صفحة (Activity) مستقلة برسمها الخاص، لكن الصفحة الأولى (main activity) هي التي تفتحها تلقائيًا عند فتح الكتاب.

**لماذا؟** لتقسيم التطبيق إلى وحدات منطقية مستقلة يسهل بناؤها واختبارها وإعادة استخدامها كل على حدة.

---

### 3. كل نشاط يمكنه إطلاق نشاط آخر لتنفيذ إجراءات مختلفة

#### النص الأصلي يقول (English):
> Each activity can then start another activity in order to perform different actions. Example, the main activity in a simple e-mail app may provide the screen that shows an e-mail inbox. From there, the main activity might launch other activities that provide screens for tasks like writing e-mails and opening individual e-mails.

#### الترجمة الحرفية:
> يمكن لكل نشاط بعد ذلك أن يبدأ نشاطًا آخر لتنفيذ إجراءات مختلفة. مثال، قد يوفّر النشاط الرئيسي في تطبيق بريد إلكتروني بسيط الشاشة التي تعرض صندوق الوارد. من هناك، قد يُطلق النشاط الرئيسي أنشطة أخرى توفّر شاشات لمهام مثل كتابة رسائل البريد وفتح رسائل فردية.

#### الشرح المبسّط:
هذه هي الفكرة المحورية للتنقل داخل تطبيقات أندرويد: النشاط الحالي لا يبقى معزولًا، بل يستطيع أن "يطلق" نشاطًا جديدًا عندما يحتاج المستخدم أداء مهمة أخرى. في مثال البريد الإلكتروني، صندوق الوارد (النشاط الرئيسي) هو نقطة البداية، لكن عند الضغط على "رسالة جديدة" يفتح نشاط منفصل مخصص للكتابة، وعند فتح رسالة معيّنة يفتح نشاط ثالث لعرضها. هذا يرتبط مباشرة بالنقطة السابقة (نشاط = شاشة) لأنه يوضّح *كيف* تتنقل هذه الشاشات فيما بينها فعليًا. تشبيه ذلك كسلسلة غرف في متحف: أنت تدخل الغرفة الرئيسية (Inbox)، ثم تفتح بابًا يوصلك لغرفة أخرى (Compose)، وكل غرفة مستقلة لكنها متصلة ببعضها بأبواب (الأنشطة تُشغّل بعضها بعضًا).

**لماذا؟** لأن تقسيم المهام على أنشطة منفصلة، مع القدرة على الانتقال بينها، يسمح بإعادة استخدام الشاشات (مثلاً نشاط "فتح رسالة" يمكن استدعاؤه من أكثر من مكان) بدل تكرار الكود.

---

### 4. وجوب تسجيل الأنشطة في الـ Manifest وإدارة دورة حياتها

#### النص الأصلي يقول (English):
> To use activities in your app, you must register information about them in the app's manifest, and you must manage activity lifecycles appropriately.

#### الترجمة الحرفية:
> لاستخدام الأنشطة في تطبيقك، يجب عليك تسجيل معلومات عنها في ملف بيان التطبيق (manifest)، ويجب عليك إدارة دورات حياة الأنشطة بشكل مناسب.

#### الشرح المبسّط:
هذه الجملة هي جسر ينقلنا لبقية المحاضرة: أي نشاط تنشئه في الكود يجب أن "يُعرَّف رسميًا" لنظام أندرويد داخل ملف `AndroidManifest.xml`، وإلا فلن يستطيع النظام معرفة وجوده أو تشغيله. بالإضافة إلى ذلك، يجب أن تتعامل بشكل صحيح مع تنقّل النشاط بين حالاته المختلفة (إنشاء، ظهور، توقف...) حتى لا يفقد التطبيق بيانات المستخدم أو يتعطل. هذا يمهّد مباشرة للقسمين التاليين في المحاضرة: تهيئة الـ Manifest، ثم إدارة دورة الحياة. تخيّل الأمر مثل تسجيل موظف جديد في شركة (Manifest = سجل الموظفين الرسمي) قبل أن يُسمح له بالعمل فعليًا، بينما "إدارة دورة الحياة" أشبه بمتابعة جدول دوامه (حضور، استراحة، انصراف).

**لماذا؟** لأن أندرويد نظام تشغيل يدير موارد محدودة (ذاكرة، بطارية) لعدة تطبيقات في آن واحد، فهو يحتاج معرفة مسبقة بكل الأنشطة الموجودة (عبر Manifest) والتحكم الكامل في توقيت تشغيلها وإيقافها (عبر دورة الحياة).

---

### 5. تصريح الأنشطة في الـ Manifest (Declare Activities)

#### النص الأصلي يقول (English):
> For your app to be able to use activities, you must declare the activities, and certain of their attributes, in the manifest. To declare your activity, open your manifest file and add an `<activity>` element as a child of the `<application>` element. The only required attribute for this element is `android:name`, which specifies the class name of the activity. You can also add attributes that define activity characteristics such as label, icon, or UI theme.

#### الترجمة الحرفية:
> لكي يتمكن تطبيقك من استخدام الأنشطة، يجب عليك تصريح الأنشطة، وبعض خصائصها، في ملف الـ manifest. لتصريح نشاطك، افتح ملف الـ manifest الخاص بك وأضف عنصر `<activity>` كعنصر فرعي من عنصر `<application>`. الخاصية الوحيدة المطلوبة لهذا العنصر هي `android:name`، والتي تحدد اسم صنف (class) النشاط. يمكنك أيضًا إضافة خصائص تحدد سمات النشاط مثل التسمية (label) أو الأيقونة (icon) أو سمة (theme) الواجهة.

#### الشرح المبسّط:
لا يكفي أن تكتب صنف Kotlin يرث من `Activity` — يجب أيضًا أن "تُعلن" عن وجوده داخل `AndroidManifest.xml` بوضع عنصر `<activity>` بداخل `<application>`، وإلا فسيرفض النظام تشغيله عند استدعائه ("Activity not found"). الخاصية الإلزامية الوحيدة هي `android:name` وهي ببساطة اسم الصنف نفسه؛ أما بقية الخصائص (أيقونة، عنوان، سمة شكل) فاختيارية لتخصيص المظهر. هذا يربط مباشرة بالنقطة السابقة (وجوب التسجيل في الـ Manifest) ويوضّح *كيف* يتم هذا التسجيل عمليًا. تخيّل الأمر كتسجيل اسمك في قائمة حضور الفصل: الاسم إلزامي (`android:name`)، لكن كتابة رقم مقعدك أو ملاحظة إضافية اختيارية.

```xml
<manifest ... >
  <application ... >
    <!-- android:name is required: it links this manifest entry to the Kotlin class -->
    <activity android:name=".ExampleActivity" />
    ...
  </application>
</manifest>
```

**لماذا؟** لأن نظام أندرويد يبني قائمة بكل مكونات التطبيق (Activities, Services...) من ملف الـ Manifest عند تثبيت التطبيق، فأي نشاط غير مصرّح به يُعامل وكأنه غير موجود.

---

### 6. مفهوم Intent Filters والفرق بين الطلب الصريح والضمني

#### النص الأصلي يقول (English):
> Intent filters provide the ability to launch an activity based not only on an explicit request, but also an implicit one. An explicit request might tell the system to "Start the Send Email activity in the Gmail app". An implicit request tells the system to "Start a Send Email screen in any activity that can do the job."

#### الترجمة الحرفية:
> توفّر مرشحات النية (Intent filters) القدرة على تشغيل نشاط بناءً ليس فقط على طلب صريح، بل أيضًا على طلب ضمني. قد يخبر الطلب الصريح النظام بـ "ابدأ نشاط إرسال البريد الإلكتروني في تطبيق Gmail". يخبر الطلب الضمني النظام بـ "ابدأ شاشة إرسال بريد إلكتروني في أي نشاط يمكنه القيام بهذه المهمة."

#### الشرح المبسّط:
حتى الآن تعلمنا كيف نُعرِّف نشاطًا واحدًا لتطبيقنا، لكن ماذا لو أردنا أن يفتح تطبيقنا نشاطًا في تطبيق *آخر* لا نعرف اسمه بالضبط (مثلاً "أي تطبيق بريد مثبت لدى المستخدم")؟ هنا يأتي دور `Intent Filter`: بدل تحديد التطبيق والنشاط بالاسم (طلب صريح، دقيق جدًا)، تصف *نوع المهمة* المطلوبة فقط (طلب ضمني)، ويقوم النظام بالبحث عن أي تطبيق مثبّت يعلن أنه "قادر" على تنفيذ هذا النوع من المهام. هذا يمهّد مباشرة للقسم اللاحق (أنواع الـ Intent) ويكمل فكرة "التفاعل مع تطبيقات أخرى" التي بدأناها. تشبيه ذلك كطلب سيارة أجرة: الطلب الصريح أشبه بالاتصال بسائق معيّن تعرفه بالاسم، بينما الطلب الضمني أشبه بفتح تطبيق حجز عام يقول "أحتاج توصيلة الآن" — فيستجيب أي سائق متاح مناسب.

**لماذا؟** لأن هذا يمنح المستخدم حرية الاختيار (مثلاً يمكنه اختيار أي تطبيق بريد يفضّله)، ويمنح المطوّر مرونة في عدم ربط تطبيقه بتطبيق واحد محدد.

---

### 7. بنية عنصر intent-filter ومثال SEND

#### النص الأصلي يقول (English):
> You can take advantage of this feature by declaring an `<intent-filter>` element in the `<activity>` element. `<intent-filter>` element includes an `<action>` element and, optionally, a `<category>` element and/or a `<data>` element. These elements combine to specify the type of intent to which your activity can respond. Example, the following code snippet shows how to configure an activity that sends text data, and receives requests from other activities to do so. The `<action>` element specifies that this activity sends data. Declaring the `<category>` element as DEFAULT enables the activity to receive launch requests. The `<data>` element specifies the type of data that this activity can send.

#### الترجمة الحرفية:
> يمكنك الاستفادة من هذه الميزة عن طريق تصريح عنصر `<intent-filter>` داخل عنصر `<activity>`. يتضمن عنصر `<intent-filter>` عنصر `<action>`، واختياريًا عنصر `<category>` و/أو عنصر `<data>`. تجتمع هذه العناصر لتحديد نوع النية (intent) التي يمكن لنشاطك الاستجابة لها. مثال، يوضّح مقطع الكود التالي كيفية إعداد نشاط يرسل بيانات نصية، ويستقبل طلبات من أنشطة أخرى للقيام بذلك. يحدد عنصر `<action>` أن هذا النشاط يرسل بيانات. تصريح عنصر `<category>` بقيمة DEFAULT يمكّن النشاط من استقبال طلبات التشغيل. يحدد عنصر `<data>` نوع البيانات التي يمكن لهذا النشاط إرسالها.

#### الشرح المبسّط:
عمليًا، تضع `<intent-filter>` كعنصر فرعي داخل `<activity>` نفسه، وبداخله ثلاثة عناصر مكمّلة لبعضها: `<action>` (ماذا يريد النشاط أن يفعل؟)، `<category>` (تصنيف إضافي، وغالبًا DEFAULT ليكون قابلًا للاستدعاء الضمني)، و`<data>` (نوع البيانات المقبولة مثل `text/plain`). الثلاثة معًا يشكّلون "بطاقة تعريف" يقرأها النظام ليقرر: هل هذا النشاط مناسب لتنفيذ الطلب الضمني الوارد أم لا؟ هذا امتداد مباشر للنقطة السابقة (شرح فكرة الطلب الضمني) وينتقل من "الفكرة" إلى "طريقة كتابتها فعليًا في XML".

```xml
<activity android:name=".ExampleActivity" android:icon="@drawable/app_icon">
  <intent-filter>
    <!-- action: this activity can perform a SEND operation -->
    <action android:name="android.intent.action.SEND" />
    <!-- category: DEFAULT makes it eligible for implicit intent launches -->
    <category android:name="android.intent.category.DEFAULT" />
    <!-- data: it only accepts plain text data -->
    <data android:mimeType="text/plain" />
  </intent-filter>
</activity>
```

**لماذا؟** لأن النظام يحتاج معايير دقيقة (فعل + تصنيف + نوع بيانات) ليقارن بينها وبين طلب الـ Intent الوارد، بدل تخمين عشوائي لأي نشاط قد يناسب المهمة.

---

### 8. استدعاء النشاط من الكود، والأنشطة بدون Intent Filters

#### النص الأصلي يقول (English):
> The following code snippet shows how to call the previous activity. Activities that you don't want to make available to other applications should have no intent filters, and you can start them yourself using explicit intents.

#### الترجمة الحرفية:
> يوضّح مقطع الكود التالي كيفية استدعاء النشاط السابق. الأنشطة التي لا تريد إتاحتها لتطبيقات أخرى يجب ألا تحتوي على مرشحات نية (intent filters)، ويمكنك تشغيلها بنفسك باستخدام نوايا صريحة (explicit intents).

#### الشرح المبسّط:
بعد أن عرّفنا `intent-filter` في الـ Manifest، هذا هو الكود الفعلي في `Kotlin` الذي "يبني" الطلب (`Intent`) ويرسله للنظام عبر `startActivity()`. لاحظ التوازي: `action = SEND` و`type = "text/plain"` يطابقان تمامًا ما وضعناه في الـ `intent-filter` (action و data mimeType) في الخطوة السابقة — وهذا هو أساس عملية المطابقة التي سنتعمّق فيها لاحقًا في "Intent Resolution". أما الجملة الثانية فتنبّهنا لحالة عكسية: إن كان النشاط خاصًا بتطبيقك فقط ولا تريد لأي تطبيق آخر استدعاءه، فببساطة لا تضع له `intent-filter` إطلاقًا، وتبقى قادرًا على تشغيله داخليًا فقط عبر `Intent` صريح يذكر اسم الصنف مباشرة. تشبيه ذلك كباب المنزل: إن أردت أن يستطيع أي شخص (تطبيق آخر) طرقه، تضع لافتة عليه (intent-filter)؛ أما إن أردته غرفة خاصة بك فقط، فلا تضع لافتة أصلًا وتستخدم مفتاحك الخاص (explicit intent) للدخول.

```kotlin
val sendIntent = Intent().apply {
    action = Intent.ACTION_SEND      // must match the <action> in the filter
    type = "text/plain"              // must match the <data android:mimeType>
    putExtra(Intent.EXTRA_TEXT, textMessage)
}
startActivity(sendIntent)
```

**لماذا؟** لحماية الأنشطة الداخلية الحسّاسة (مثل شاشة تسجيل الدخول الداخلية) من أن يستدعيها تطبيق خارجي دون إذن، بينما تظل الأنشطة العامة (مثل "مشاركة نص") متاحة للجميع.

---

### 9. تصريح الأذونات (Declare Permissions)

#### النص الأصلي يقول (English):
> You can use the manifest's `<activity>` tag to control which apps can start a particular activity. An activity (or application) cannot launch a target activity unless both activities have the same permissions in their manifest. If you declare a `<uses-permission>` element for an activity, the target activity must require the same permission using the android:permission attribute.

#### الترجمة الحرفية:
> يمكنك استخدام وسم `<activity>` في الـ manifest للتحكم في التطبيقات التي يمكنها تشغيل نشاط معيّن. لا يمكن لنشاط (أو تطبيق) تشغيل نشاط هدف ما لم يكن لكلا النشاطين نفس الأذونات في ملفات الـ manifest الخاصة بهما. إذا صرّحت بعنصر `<uses-permission>` لنشاط، فيجب أن يطلب النشاط الهدف نفس الإذن باستخدام خاصية android:permission.

#### الشرح المبسّط:
هذه طبقة حماية إضافية فوق `intent-filter`: حتى لو كان النشاط يقبل نوايا ضمنية (له filter)، يمكنك تقييد *من* يُسمح له باستدعائه عبر نظام الأذونات (permissions). فكرة العمل بسيطة: التطبيق الهدف (مثل SocialApp) يعلن في الـ Manifest الخاص به أن أي طرف يريد استدعاء نشاطه يجب أن يمتلك إذنًا محددًا (`android:permission`)، والتطبيق المستدعي يجب أن يطلب هذا الإذن صراحة (`<uses-permission>`) وإلا فشلت العملية. هذا يكمل سلسلة "التحكم بالوصول" التي بدأناها بـ intent-filter (من يمكنه رؤية النشاط) وينتقل الآن إلى (من يُسمح له فعليًا باستدعائه). تخيّل هذا كمبنى حكومي: أي شخص يمكنه رؤية بوابة الدخول (intent-filter)، لكن الدخول الفعلي يتطلب تصريح أمني (permission) يُطابق ما تطلبه الجهة.

```xml
<!-- In SocialApp's manifest: it requires a specific permission to be launched -->
<activity android:name="...."
    android:permission="com.google.socialapp.permission.SHARE_POST" />

<!-- In your app's manifest: you must request the matching permission -->
<uses-permission android:name="com.google.socialapp.permission.SHARE_POST"/>
```

**لماذا؟** لمنع أي تطبيق عشوائي مثبّت على الجهاز من استدعاء أنشطة حسّاسة (كنشر منشور، أو الوصول لبيانات خاصة) دون موافقة صريحة معلنة في الأذونات.

---

### 10. نظرة عامة: الأنشطة تنتقل بين حالات دورة الحياة

#### النص الأصلي يقول (English):
> As a user navigates through, out of, and back to your app, the Activity instances in your app transition through different states in their lifecycle. The Activity class provides a number of callbacks that let the activity know when a state changes or that the system is creating, stopping, or resuming an activity or destroying the process the activity resides in. Within the lifecycle callback methods, you can declare how your activity behaves when the user leaves and re-enters the activity. Example, if you're building a streaming video player, you might pause the video and terminate the network connection when the user switches to another app. When the user returns, you can reconnect to the network and let the user resume the video from the same spot.

#### الترجمة الحرفية:
> عندما يتنقل المستخدم داخل تطبيقك، وخارجه، ويعود إليه مجددًا، تنتقل نسخ Activity في تطبيقك عبر حالات مختلفة في دورة حياتها. يوفّر صنف Activity عددًا من دوال الاستدعاء الرجعي (callbacks) التي تُعلم النشاط بتغيّر الحالة أو أن النظام يقوم بإنشاء، إيقاف، أو استئناف نشاط، أو تدمير العملية (process) التي يقيم فيها النشاط. ضمن دوال استدعاء دورة الحياة، يمكنك تحديد كيفية تصرّف نشاطك عندما يغادر المستخدم النشاط ويعود إليه مجددًا. مثال، إذا كنت تبني مشغّل فيديو للبث، فقد توقف الفيديو مؤقتًا وتنهي الاتصال بالشبكة عندما ينتقل المستخدم إلى تطبيق آخر. عندما يعود المستخدم، يمكنك إعادة الاتصال بالشبكة والسماح للمستخدم باستئناف الفيديو من نفس النقطة.

#### الشرح المبسّط:
هذا القسم ينقلنا من "الـ Manifest" (كيف نُعرِّف النشاط) إلى "دورة الحياة" (كيف يتصرف النشاط بعد أن يعمل فعليًا). الفكرة الأساسية: النشاط ليس ثابتًا، بل يتنقل باستمرار بين حالات (يُنشأ، يظهر، يُستأنف، يتوقف مؤقتًا، يختفي، يُدمَّر) كلما تنقل المستخدم داخل التطبيق أو خارجه. ولأن أندرويد يستدعي دوالًا محددة (callbacks) عند كل تغيّر حالة، فإن مهمتك كمطوّر هي كتابة الكود المناسب داخل كل دالة لتفعل الشيء الصحيح في الوقت الصحيح. مثال الفيديو يوضّح هذا بشكل عملي: إن لم تتوقف عن بث الفيديو حين يغادر المستخدم التطبيق، فسيستهلك بيانات الإنترنت والبطارية دون فائدة، وحين يعود يجب أن يكمل من نفس النقطة وليس من البداية. تشبيه ذلك تمامًا كموقف السيارة المؤقت: حين تخرج من السيارة (تغادر النشاط) توقف المحرك (توقف الفيديو) لتوفير الوقود، وحين تعود تشغّله من جديد لتكمل رحلتك من نفس المكان.

**لماذا؟** لأن نظام أندرويد يستطيع في أي لحظة مقاطعة تطبيقك (مكالمة هاتفية، إشعار، فتح تطبيق آخر)، فبدون آلية دورة حياة واضحة سيهدر التطبيق موارد الجهاز أو يفقد بيانات المستخدم دون سبب.

---

### 11. أهمية التعامل الصحيح مع كل Callback

#### النص الأصلي يقول (English):
> Each callback lets you perform specific work that's appropriate to a given change of state. Doing the right work at the right time and handling transitions properly make your app more robust and performant. Example, good implementation of the lifecycle callbacks can help your app avoid the following: Crashing if the user receives a phone call or switches to another app while using your app. Consuming valuable system resources when the user is not actively using it. Losing the user's progress if they leave your app and return to it at a later time. Crashing or losing the user's progress when the screen rotates between landscape and portrait orientation.

#### الترجمة الحرفية:
> تسمح لك كل دالة استدعاء رجعي بتنفيذ عمل محدد مناسب لتغيّر حالة معيّن. القيام بالعمل الصحيح في الوقت الصحيح والتعامل مع الانتقالات بشكل مناسب يجعل تطبيقك أكثر متانة وأداءً. مثال، يمكن أن يساعد التطبيق الجيد لدوال دورة الحياة تطبيقك على تجنّب ما يلي: التعطل إذا تلقى المستخدم مكالمة هاتفية أو انتقل إلى تطبيق آخر أثناء استخدام تطبيقك. استهلاك موارد نظام قيّمة عندما لا يستخدمه المستخدم فعليًا. فقدان تقدّم المستخدم إذا غادر تطبيقك وعاد إليه لاحقًا. التعطل أو فقدان تقدّم المستخدم عند تدوير الشاشة بين الوضع الأفقي والعمودي.

#### الشرح المبسّط:
هذه الفقرة تُبرز *لماذا* يهتم المطورون كثيرًا بدورة الحياة عمليًا: الأخطاء الأكثر شيوعًا في تطبيقات أندرويد المبتدئة (تعطل عند تدوير الشاشة، فقدان بيانات النموذج، استهلاك بطارية بلا داعٍ) سببها الأساسي هو تجاهل التعامل الصحيح مع دوال دورة الحياة. فمثلًا، عند تدوير الشاشة، أندرويد يدمر النشاط الحالي وينشئ نسخة جديدة منه — إن لم تحفظ حالة الشاشة بشكل صحيح داخل الدالة المناسبة، يفقد المستخدم كل ما كتبه. هذا يربط الفكرة النظرية للنقطة السابقة (الانتقال بين الحالات) بنتيجتها العملية (جودة التطبيق). تخيّل الأمر كموظف استقبال في فندق: إن لم يسجّل بيانات النزيل بشكل صحيح عند كل تغيير في الحجز (وصول، مغادرة مؤقتة، عودة)، سيضيع حجز النزيل أو يُعطى غرفة خاطئة.

**لماذا؟** لأن جودة تجربة المستخدم (عدم فقدان البيانات، عدم استنزاف البطارية، عدم التعطل) مرتبطة مباشرة بمدى احترافية تعامل المطوّر مع كل مرحلة من مراحل دورة حياة النشاط.

---

### 12. الدوال الست الأساسية لدورة حياة النشاط

#### النص الأصلي يقول (English):
> To navigate between stages of the activity lifecycle, the Activity class provides a core set of six callbacks: onCreate(), onStart(), onResume(), onPause(), onStop(), and onDestroy(). The system invokes each of these callbacks as the activity enters a new state. The system's likelihood of killing a given process, along with the activities in it, depends on the state of the activity at the time.

#### الترجمة الحرفية:
> للتنقل بين مراحل دورة حياة النشاط، يوفّر صنف Activity مجموعة أساسية من ست دوال استدعاء رجعي: onCreate()، onStart()، onResume()، onPause()، onStop()، وonDestroy(). يستدعي النظام كل دالة من هذه الدوال عندما يدخل النشاط حالة جديدة. يعتمد احتمال قيام النظام بإنهاء (kill) عملية معيّنة، مع الأنشطة الموجودة بداخلها، على حالة النشاط في تلك اللحظة.

#### الشرح المبسّط:
هذه هي "الخريطة" التي سنشرح كل محطة فيها بالتفصيل في الأقسام القادمة: ست دوال فقط تغطي كل رحلة النشاط من الميلاد إلى الموت. الترتيب المعتاد للمسار السعيد هو: `onCreate → onStart → onResume` (النشاط يظهر ويصبح تفاعليًا)، ثم عند المغادرة: `onPause → onStop → onDestroy` (أو `onRestart` إن عاد المستخدم). النقطة الأهم هنا هي الجملة الأخيرة: كل حالة تعني احتمالية مختلفة بأن يُنهي النظام تطبيقك بالكامل لتحرير الذاكرة — فكلما كان النشاط "أعمق" في حالة الخمول (Stopped) زاد احتمال إنهائه، وكلما كان نشطًا (Resumed) قلّ هذا الاحتمال. تشبيه ذلك بمراحل نوم الإنسان: كلما دخلت في نوم أعمق (Stopped)، زادت صعوبة إيقاظك فجأة (Restart)، وربما يقرر شخص ما إيقاظك بالكامل من جديد (Destroy وإعادة onCreate).

**لماذا؟** لأن الأجهزة المحمولة محدودة الذاكرة، فنظام أندرويد يحتاج معيارًا واضحًا (حالة النشاط) ليقرر أي العمليات يمكن التضحية بها أولًا عند الحاجة لتحرير موارد.

---

### 13. onCreate()

#### النص الأصلي يقول (English):
> You must implement this callback, which fires when the system first creates the activity. On activity creation, the activity enters the Created state. In the onCreate() method, perform basic application startup logic that happens only once for the entire life of the activity. Example, your implementation of onCreate() might associate the activity with a ViewModel, and instantiate some class-scope variables. This method receives the parameter savedInstanceState, which is a Bundle object containing the activity's previously saved state. If the activity has never existed before, the value of the Bundle object is null. Your activity does not remain in the Created state. After the onCreate() method finishes execution, the activity enters the Started state and the system calls the onStart() and onResume() methods in quick succession.

#### الترجمة الحرفية:
> يجب عليك تطبيق دالة الاستدعاء هذه، والتي تُطلَق عندما ينشئ النظام النشاط لأول مرة. عند إنشاء النشاط، يدخل النشاط حالة "تم الإنشاء" (Created). في دالة onCreate()، نفّذ منطق بدء التشغيل الأساسي للتطبيق الذي يحدث مرة واحدة فقط طوال حياة النشاط بأكملها. مثال، قد يربط تطبيقك لدالة onCreate() النشاط بـ ViewModel، وينشئ بعض المتغيرات على مستوى الصنف. تستقبل هذه الدالة المعامل savedInstanceState، وهو كائن Bundle يحتوي على الحالة المحفوظة سابقًا للنشاط. إذا لم يكن النشاط موجودًا من قبل، فإن قيمة كائن Bundle تكون null. لا يبقى نشاطك في حالة "تم الإنشاء". بعد انتهاء تنفيذ دالة onCreate()، يدخل النشاط حالة "تم البدء" (Started) ويستدعي النظام دالتي onStart() وonResume() بسرعة متتالية.

#### الشرح المبسّط:
`onCreate()` هي أول دالة تُستدعى في حياة النشاط، تمامًا كولادة إنسان — تحدث مرة واحدة فقط. فيها تضع كل ما يحتاج التطبيق تجهيزه *مرة واحدة* فقط طوال عمر النشاط، مثل ربط واجهة المستخدم بـ`ViewModel` أو تهيئة متغيرات ثابتة. المعامل `savedInstanceState` مهم جدًا: إن كان النشاط قد أُعيد إنشاؤه (مثلًا بعد تدوير الشاشة) فسيحمل هذا الكائن البيانات المحفوظة سابقًا، أما إن كانت هذه أول مرة يُنشأ فيها النشاط فستكون قيمته `null`. لاحظ العلاقة بالنقطة السابقة: `onCreate` هي أول محطة في السلسلة، ولا يبقى النشاط فيها بل ينتقل مباشرة وبسرعة إلى `onStart` ثم `onResume`. تشبيه ذلك ببناء منزل جديد: تضع الأساسات والهيكل مرة واحدة فقط (onCreate)، وبعدها تنتقل مباشرة لفتح الأبواب للسكان (onStart/onResume).

```kotlin
// Called once when the system first creates the activity
override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState) // always call the superclass implementation first
    // one-time setup: bind ViewModel, initialize class-scope variables, inflate UI
}
```

**لماذا؟** لتوفير مكان واحد وموثوق لتهيئة موارد النشاط مرة واحدة فقط، بدل تكرار هذا الإعداد في كل مرة يظهر فيها النشاط.

---

### 14. onStart()

#### النص الأصلي يقول (English):
> As onCreate() exits, the activity enters the Started state, and the activity becomes visible to the user. When the activity enters the Started state, the system invokes onStart(). This call makes the activity visible to the user as the app prepares for the activity to enter the foreground and become interactive. This method is where the code that maintains the UI is initialized. The onStart() method completes quickly and, as with the Created state, the activity does not remain in the Started state. Once this callback finishes, the activity enters the Resumed state and the system invokes the onResume() method.

#### الترجمة الحرفية:
> بمجرد خروج onCreate()، يدخل النشاط حالة "تم البدء" (Started)، ويصبح النشاط مرئيًا للمستخدم. عندما يدخل النشاط حالة "تم البدء"، يستدعي النظام onStart(). هذا الاستدعاء يجعل النشاط مرئيًا للمستخدم بينما يستعد التطبيق لدخول النشاط إلى المقدمة وأن يصبح تفاعليًا. هذه الدالة هي المكان الذي تُهيَّأ فيه الكود المسؤول عن الحفاظ على واجهة المستخدم. تنتهي دالة onStart() بسرعة، وكما هو الحال مع حالة "تم الإنشاء"، لا يبقى النشاط في حالة "تم البدء". بمجرد انتهاء هذا الاستدعاء، يدخل النشاط حالة "تم الاستئناف" (Resumed) ويستدعي النظام دالة onResume().

#### الشرح المبسّط:
`onStart()` هي المحطة الثانية، وفيها يصبح النشاط *مرئيًا* على الشاشة لأول مرة لكنه ليس تفاعليًا بعد (المستخدم لا يستطيع الضغط عليه). هذا فارق دقيق ومهم عن `onResume`: الرؤية شيء والتفاعل شيء آخر. فيها تُهيَّأ الأكواد المتعلقة بعرض الواجهة (مثل بدء مراقبة بيانات معينة لتحديث الشاشة). كما ذكرنا في onCreate، هذه المرحلة أيضًا سريعة العبور — لا يتوقف النظام هنا بل يكمل مباشرة إلى `onResume()`. تشبيه ذلك بشخص يفتح ستارة المسرح: الجمهور (المستخدم) أصبح يرى الممثل (النشاط) على المسرح، لكن العرض (التفاعل الكامل) لم يبدأ فعليًا بعد.

```kotlin
// The activity is now visible, but not yet interactive
override fun onStart() {
    super.onStart()
    // initialize code that maintains the UI (e.g. start observing LiveData)
}
```

**لماذا؟** للفصل بين لحظة "الظهور على الشاشة" ولحظة "أصبح جاهزًا للتفاعل"، مما يمنح المطوّر مرونة أكبر في التحكم بتوقيت كل نوع من الإعدادات.

---

### 15. onResume() — دخول التفاعل والعودة من الإيقاف المؤقت

#### النص الأصلي يقول (English):
> The system invokes onResume() callback just before the activity starts interacting with the user. When the activity enters the Resumed state, it comes to the foreground, and the system invokes the onResume() callback. This is the state in which the app interacts with the user. The app stays in this state until something happens to take focus away from the app, such as the device receiving a phone call, the user navigating to another activity, or the device screen turning off. When an interruptive event occurs, the activity enters the Paused state and the system invokes the onPause() callback. If the activity returns to the Resumed state from the Paused state, the system once again calls the onResume() method. For this reason, implement onResume() to initialize components that you release during onPause() and to perform any other initializations that must occur each time the activity enters the Resumed state.

#### الترجمة الحرفية:
> يستدعي النظام دالة onResume() مباشرة قبل أن يبدأ النشاط بالتفاعل مع المستخدم. عندما يدخل النشاط حالة "تم الاستئناف" (Resumed)، يأتي إلى المقدمة، ويستدعي النظام دالة onResume(). هذه هي الحالة التي يتفاعل فيها التطبيق مع المستخدم. يبقى التطبيق في هذه الحالة إلى أن يحدث شيء يأخذ التركيز بعيدًا عن التطبيق، مثل استقبال الجهاز لمكالمة هاتفية، أو تنقّل المستخدم إلى نشاط آخر، أو إغلاق شاشة الجهاز. عندما يحدث حدث مقاطعة، يدخل النشاط حالة "تم الإيقاف المؤقت" (Paused) ويستدعي النظام دالة onPause(). إذا عاد النشاط إلى حالة "تم الاستئناف" من حالة "تم الإيقاف المؤقت"، يستدعي النظام دالة onResume() مرة أخرى. لهذا السبب، طبّق onResume() لتهيئة المكونات التي تُحرّرها أثناء onPause() ولتنفيذ أي تهيئة أخرى يجب أن تحدث في كل مرة يدخل فيها النشاط حالة "تم الاستئناف".

#### الشرح المبسّط:
`onResume()` هي أهم لحظة في حياة النشاط من منظور المستخدم: هنا يصبح النشاط فعليًا في المقدمة وقابلًا للتفاعل الكامل (الضغط، الكتابة، التمرير). يبقى النشاط في هذه الحالة طالما لم يحدث ما يقاطعه — مكالمة، تطبيق آخر، إغلاق الشاشة. النقطة الدقيقة هنا هي أن `onResume()` قد تُستدعى *أكثر من مرة* خلال حياة نفس النشاط: مرة أولى بعد `onStart`، ومرات لاحقة كلما عاد النشاط من حالة `Paused`. لهذا يُنصح بوضع فيها فقط التهيئة "القابلة للتكرار" (مثل إعادة تشغيل الكاميرا) وليس التهيئة التي تحدث مرة واحدة فقط (تلك تبقى في onCreate). تشبيه ذلك كلاعب يعود لملعب كرة القدم بعد استراحة مؤقتة: في كل مرة يعود فيها للملعب (onResume) يجب أن "يُسخّن" عضلاته من جديد (إعادة تفعيل الموارد)، وليس فقط في أول مباراة له بالموسم.

```kotlin
// Called every time the activity becomes interactive (may fire multiple times)
override fun onResume() {
    super.onResume()
    // re-initialize resources released in onPause (e.g. camera, sensors)
}
```

**لماذا؟** لأن أندرويد قد يُقاطع تطبيقك ويعود إليه عدة مرات في جلسة استخدام واحدة، فيحتاج المطوّر مكانًا مضمونًا يُعاد فيه تفعيل الموارد المؤقتة في كل مرة يعود فيها النشاط للمقدمة، وليس فقط عند أول إنشاء.

---

### 16. onPause()

#### النص الأصلي يقول (English):
> The system calls onPause() method as the first indication that the user is leaving your activity, though it does not always mean the activity is being destroyed. It indicates that the activity is no longer in the foreground, but it is still visible if the user is in multi-window mode. There are several reasons why an activity might enter this state: An event that interrupts app execution, pauses the current activity. This is the most common case. In multi-window mode, only one app has focus at any time, and the system pauses all the other apps. The opening of a dialog pauses the underlying activity because it takes focus. As long as the activity is partially visible but not in focus, it remains paused.

#### الترجمة الحرفية:
> يستدعي النظام دالة onPause() كأول إشارة على أن المستخدم يغادر نشاطك، رغم أن هذا لا يعني دائمًا أن النشاط يُدمَّر. إنه يشير إلى أن النشاط لم يعد في المقدمة، لكنه لا يزال مرئيًا إذا كان المستخدم في وضع النوافذ المتعددة. هناك عدة أسباب قد تجعل النشاط يدخل هذه الحالة: حدث يقاطع تنفيذ التطبيق، فيوقف النشاط الحالي مؤقتًا. هذه هي الحالة الأكثر شيوعًا. في وضع النوافذ المتعددة، تطبيق واحد فقط يمتلك التركيز في أي وقت، والنظام يُوقف مؤقتًا جميع التطبيقات الأخرى. فتح مربع حوار (dialog) يوقف النشاط الأساسي مؤقتًا لأنه يأخذ التركيز. طالما النشاط مرئي جزئيًا لكن غير مركّز عليه، يبقى في حالة الإيقاف المؤقت.

#### الشرح المبسّط:
`onPause()` هي أول "إنذار" بأن المستخدم بدأ يبتعد عن نشاطك، لكنها *لا تعني* بالضرورة أن النشاط سيختفي تمامًا — فقد يبقى مرئيًا جزئيًا (كما في وضع النوافذ المتعددة، أو عند فتح مربع حوار فوقه). هذا فارق مهم عن الحالات السابقة لأنه يوضّح أن دورة الحياة ليست خطًا مستقيمًا بسيطًا بل تحتمل حالات وسيطة. الأسباب الثلاثة المذكورة (مقاطعة عامة، تعدد النوافذ، فتح مربع حوار) كلها تشترك في نفس الفكرة: النشاط فقد "التركيز" (focus) وليس بالضرورة "الظهور" (visibility). تشبيه ذلك بشخص يتحدث معك ثم يلتفت للحظة للرد على رسالة نصية — لم يغادر الغرفة (لا يزال مرئيًا)، لكن انتباهه (focus) لم يعد معك بالكامل.

```kotlin
// First signal the user is leaving — activity may still be partially visible
override fun onPause() {
    super.onPause()
}
```

**لماذا؟** لتمييز حالة "فقدان التركيز المؤقت" عن حالة "الاختفاء الكامل"، مما يسمح بمعالجة أخف وأسرع (مثل إيقاف رسوم متحركة) دون التسرّع بإجراءات ثقيلة كالحفظ في قاعدة البيانات.

---

### 17. onPause() — الاستخدام الصحيح وقيوده

#### النص الأصلي يقول (English):
> Use the onPause() method to: Pause or adjust operations that can't continue, while the Activity is in the Paused state, and that you expect to resume shortly. Release system resources, handles to sensors (like GPS), or any resources that affect battery life while your activity is Paused and user does not need them. onPause() execution does not necessarily offer enough time to perform save operations. For this reason, don't use onPause() to save application or user data, make network calls, or execute database transactions. Instead, perform heavy-load shutdown operations during onStop(). Completion of the onPause() method does not mean that the activity leaves the Paused state. Rather, the activity remains in this state until either the activity resumes or it becomes completely invisible to the user. If the activity resumes, the system invokes the onResume() callback. If the activity becomes completely invisible, the system calls onStop().

#### الترجمة الحرفية:
> استخدم دالة onPause() من أجل: إيقاف مؤقت أو تعديل العمليات التي لا يمكن أن تستمر أثناء وجود النشاط في حالة الإيقاف المؤقت، والتي تتوقع استئنافها قريبًا. تحرير موارد النظام، أو مقابض (handles) لأجهزة الاستشعار (مثل GPS)، أو أي موارد تؤثر على عمر البطارية أثناء إيقاف نشاطك مؤقتًا ولا يحتاجها المستخدم. لا يوفّر تنفيذ onPause() بالضرورة وقتًا كافيًا لتنفيذ عمليات الحفظ. لهذا السبب، لا تستخدم onPause() لحفظ بيانات التطبيق أو المستخدم، أو إجراء اتصالات شبكة، أو تنفيذ معاملات قاعدة بيانات. بدلًا من ذلك، نفّذ عمليات الإغلاق ذات الحمل الثقيل أثناء onStop(). لا يعني اكتمال دالة onPause() أن النشاط يغادر حالة الإيقاف المؤقت. بل يبقى النشاط في هذه الحالة إلى أن يُستأنف النشاط أو يصبح غير مرئي تمامًا للمستخدم. إذا استُؤنف النشاط، يستدعي النظام دالة onResume(). إذا أصبح النشاط غير مرئي تمامًا، يستدعي النظام دالة onStop().

#### الشرح المبسّط:
هذا القسم يحدد بدقة *ما يجب فعله* وما *يُمنع فعله* داخل `onPause()`، وهذا من أكثر النقاط التي يخطئ فيها المبتدئون. القاعدة الذهبية: `onPause()` قد تُنفَّذ بسرعة كبيرة جدًا (النظام قد لا يمنحها وقتًا كافيًا)، لذلك يُمنع وضع أي عملية "ثقيلة" فيها مثل حفظ بيانات في قاعدة بيانات أو استدعاء شبكة — فقد لا تكتمل هذه العملية قبل أن يقتل النظام التطبيق. بدلًا من ذلك، هذه المهام الثقيلة تُنقل إلى `onStop()` التي نشرحها لاحقًا. أما ما يناسب `onPause()` فهو العمليات الخفيفة والسريعة: إيقاف مؤقت لعملية جارية (كفيديو)، أو تحرير مورد يستهلك بطارية (كـGPS). كذلك، انتهاء تنفيذ الدالة لا يعني مغادرة الحالة — النشاط يبقى "معلّقًا" في Paused حتى يتضح مصيره (يعود؟ أم يختفي بالكامل؟). تشبيه ذلك بشخص يضع مكالمة هاتفية على الانتظار (Hold) بسرعة عند دخول ضيف مفاجئ (onPause خفيف وسريع)، بدل أن يبدأ بكتابة تقرير كامل عن المكالمة في تلك اللحظة (وهو ما يجب تأجيله لوقت لاحق أكثر استقرارًا = onStop).

**لماذا؟** لأن النظام لا يضمن وقتًا كافيًا لتنفيذ `onPause()` قبل الانتقال للحالة التالية، فوضع عمليات ثقيلة فيها يعرّض بيانات المستخدم لخطر الفقدان أو يسبب تجميدًا ملحوظًا في الواجهة.

---

### 18. onStop()

#### النص الأصلي يقول (English):
> When your activity is no longer visible to the user, it enters the Stopped state, and the system invokes the onStop() callback. This can occur: When a newly launched activity covers the entire screen. When the activity finishes running and is about to be terminated. In the onStop() method: Release or adjust resources that are not needed while the app is not visible to the user. Example, your app might pause animations or switch from fine-grained to coarse-grained location updates. Perform relatively CPU-intensive shutdown operations. Example, to save information to a database.

#### الترجمة الحرفية:
> عندما لا يعود نشاطك مرئيًا للمستخدم، يدخل حالة "تم الإيقاف" (Stopped)، ويستدعي النظام دالة onStop(). يمكن أن يحدث هذا: عندما يغطي نشاط تم إطلاقه حديثًا الشاشة بأكملها. عندما ينتهي النشاط من التشغيل ويكون على وشك الإنهاء. في دالة onStop(): حرّر أو عدّل الموارد غير المطلوبة أثناء عدم ظهور التطبيق للمستخدم. مثال، قد يُوقف تطبيقك الرسوم المتحركة أو يبدّل من تحديثات الموقع الدقيقة إلى تحديثات خشنة. نفّذ عمليات إغلاق ذات كثافة معالجة (CPU) نسبيًا. مثال، لحفظ المعلومات في قاعدة بيانات.

#### الشرح المبسّط:
`onStop()` تُستدعى فقط عندما يختفي النشاط *تمامًا* عن الأنظار — وهذا يختلف عن `onPause()` التي قد تحدث مع بقاء جزء من النشاط مرئيًا. هنا بالضبط هو المكان المناسب لتنفيذ العمليات "الثقيلة" التي حذّرنا من وضعها في `onPause()`، مثل حفظ البيانات في قاعدة البيانات — لأن النظام يمنح هذه المرحلة وقتًا أطول نسبيًا. الفرق العملي بين onPause وonStop يشبه الفرق بين "غلق العين للحظة" (Pause) و"مغادرة الغرفة كليًا" (Stop): في الحالة الأولى تُبقي الأشياء الخفيفة جاهزة للاستئناف الفوري، وفي الثانية تُنجز الأعمال الأثقل لأنك تعلم أنك لن تعود فورًا.

```kotlin
// Activity is now completely hidden — safe place for heavier shutdown work
override fun onStop() {
    super.onStop()
    // e.g. save data to a database, pause animations
}
```

**لماذا؟** لأن النشاط في حالة Stopped لن يتفاعل مع المستخدم لفترة غير معروفة، فهذا وقت مناسب وآمن نسبيًا لإنجاز مهام أثقل تحتاج وقت معالجة أطول من onPause.

---

### 19. onStop() — بقاء الكائن في الذاكرة والمصير التالي

#### النص الأصلي يقول (English):
> When your activity enters the Stopped state, the Activity object is kept resident in memory: it maintains all state and member information, but is not attached to the window manager. When the activity resumes, it recalls this information. From the Stopped state, the activity either comes back to interact with the user, or the activity is finished running and goes away. If the activity comes back, the system invokes onRestart(). If the Activity is finished running, the system calls onDestroy().

#### الترجمة الحرفية:
> عندما يدخل نشاطك حالة "تم الإيقاف"، يبقى كائن Activity مقيمًا في الذاكرة: فهو يحتفظ بكل معلومات الحالة والأعضاء، لكنه غير مرتبط بمدير النوافذ (window manager). عندما يُستأنف النشاط، يستعيد هذه المعلومات. من حالة "تم الإيقاف"، إما يعود النشاط للتفاعل مع المستخدم، أو ينتهي تشغيله ويختفي. إذا عاد النشاط، يستدعي النظام onRestart(). إذا انتهى تشغيل النشاط، يستدعي النظام onDestroy().

#### الشرح المبسّط:
هذه النقطة توضّح تفصيلًا تقنيًا دقيقًا: حتى وإن اختفى النشاط تمامًا عن الشاشة (Stopped)، فإن كائن `Activity` في الذاكرة لا يُحذف فورًا — يبقى محتفظًا بكل متغيراته وحالته، فقط "مفصولًا" عن نظام عرض النوافذ. هذا يعني أن العودة من هذه الحالة سريعة نسبيًا لأن البيانات لا تزال موجودة. من هنا يتفرّع مصير النشاط إلى مسارين: إما يعود المستخدم فيُستدعى `onRestart()` تمهيدًا للعودة، أو ينتهي أمره تمامًا فيُستدعى `onDestroy()`. تشبيه ذلك كموظف في إجازة مؤقتة غير مدفوعة: بياناته وملفه لا يزالان محفوظين في الشركة (الذاكرة)، لكنه غير موجود فعليًا في مكتبه (window manager)؛ إما يعود للعمل (Restart) أو يُنهى عقده نهائيًا (Destroy).

**لماذا؟** لأن الاحتفاظ بالحالة في الذاكرة (بدل حذفها فورًا) يسمح بعودة سريعة وسلسة للمستخدم دون الحاجة لإعادة بناء كل شيء من الصفر في كل مرة.

---

### 20. onRestart()

#### النص الأصلي يقول (English):
> The system invokes onRestart() callback when an activity in the Stopped state is about to restart. onRestart() restores the state of the activity from the time that it was stopped. This callback is always followed by onStart().

#### الترجمة الحرفية:
> يستدعي النظام دالة onRestart() عندما يكون نشاط في حالة "تم الإيقاف" على وشك إعادة التشغيل. تستعيد onRestart() حالة النشاط من الوقت الذي تم فيه إيقافه. يتبع هذه الدالة دائمًا onStart().

#### الشرح المبسّط:
`onRestart()` هي الدالة الوحيدة الخاصة بمسار "العودة" فقط — لا تُستدعى أبدًا في المسار الطبيعي الأول (onCreate → onStart)، بل فقط عندما يعود المستخدم لنشاط كان متوقفًا بالفعل. مهمتها استعادة أي حالة كانت محفوظة وقت التوقف، وبعدها يتبعها دائمًا استدعاء `onStart()` لإكمال بقية السلسلة نحو `onResume()`. هذا يربط مباشرة بالنقطة السابقة: هي "الجسر" الذي يعبره النشاط من Stopped عائدًا للحياة النشطة. تشبيه ذلك بموظف عائد من إجازته المؤقتة (Stopped): أول ما يفعله هو مراجعة ملاحظاته القديمة (onRestart) قبل أن يعود لمكتبه فعليًا ويبدأ العمل (onStart).

```kotlin
// Called only when returning from the Stopped state — always followed by onStart()
override fun onRestart() {
    super.onRestart()
}
```

**لماذا؟** لتمييز "أول ظهور للنشاط" عن "عودته بعد توقف"، مما يسمح للمطوّر بتنفيذ منطق خاص بإعادة التفعيل فقط دون التأثير على مسار الإنشاء الأول.

---

### 21. onDestroy()

#### النص الأصلي يقول (English):
> onDestroy() is called before the activity is destroyed. The system invokes this callback for one of two reasons: The activity is finishing, due to the user completely dismissing the activity or due to finish() being called on the activity. The system is temporarily destroying the activity due to a configuration change, such as device rotation. If onDestroy() is called as the result of a configuration change, the system immediately creates a new activity instance and then calls onCreate() on that new instance in the new configuration. The onDestroy() callback releases all resources not released by earlier callbacks, such as onStop().

#### الترجمة الحرفية:
> تُستدعى onDestroy() قبل تدمير النشاط. يستدعي النظام دالة الاستدعاء هذه لأحد سببين: النشاط ينتهي، بسبب إغلاق المستخدم للنشاط بالكامل أو بسبب استدعاء finish() على النشاط. النظام يُدمّر النشاط مؤقتًا بسبب تغيّر في الإعدادات (configuration change)، مثل تدوير الجهاز. إذا استُدعيت onDestroy() نتيجة تغيّر في الإعدادات، ينشئ النظام فورًا نسخة نشاط جديدة ثم يستدعي onCreate() على تلك النسخة الجديدة في الإعداد الجديد. تُحرّر دالة الاستدعاء onDestroy() جميع الموارد التي لم تُحرَّر بواسطة دوال الاستدعاء السابقة، مثل onStop().

#### الشرح المبسّط:
`onDestroy()` هي المحطة الأخيرة والنهائية في حياة النشاط، وفيها تُحرَّر أي موارد متبقية لم تُحرَّر في `onStop()`. المهم هنا هو التمييز بين سببين مختلفين تمامًا لاستدعائها: إما أن النشاط ينتهي فعليًا ونهائيًا (المستخدم أغلقه، أو استُدعيت `finish()`)، أو أن النظام "يعيد تدوير" النشاط بسبب تغيّر في الإعدادات مثل تدوير الشاشة — وفي هذه الحالة الثانية فإن `onDestroy()` ليست نهاية الحكاية، بل يعقبها فورًا `onCreate()` جديدة! هذا يفسّر تمامًا سبب حديثنا سابقًا عن `savedInstanceState` في onCreate — فهي الآلية التي تحفظ بيانات النشاط القديم قبل تدميره لتُستعاد في النشاط الجديد. تشبيه ذلك بهدم مبنى قديم وبناء آخر جديد على نفس الأرض مباشرة بعد زلزال (تغيّر الإعدادات)، بينما الهدم النهائي بدون إعادة بناء (finish المستخدم) أشبه بإخلاء الأرض بالكامل لعدم الحاجة إليها.

```kotlin
// Final callback — release any resources not already released in onStop()
override fun onDestroy() {
    super.onDestroy()
}
```

**لماذا؟** للتمييز بين "نهاية حقيقية" للنشاط و"إعادة إنشاء مؤقتة" بسبب تغيّر الإعدادات، وهو تمييز أساسي لفهم لماذا يفقد المبتدئون أحيانًا بيانات نماذجهم عند تدوير الشاشة إن لم يتعاملوا مع savedInstanceState بشكل صحيح.

---

### 22. مخطط ملخّص لدورة حياة النشاط (Lifecycle Callbacks Summary)

#### النص الأصلي يقول (English):
> Lifecycle Callbacks Summary — a diagram showing: Activity launched → onCreate() → onStart() → onResume() → Activity running → (another activity comes to foreground) → onPause() → (activity no longer visible) → onStop() → (finishing or destroyed by system) → onDestroy() → Activity shut down. Also: user returns to the activity → onResume() (from Paused); user navigates to the activity → onRestart() → onStart() (from Stopped); apps with higher priority need memory → App process killed (from Paused or Stopped).

#### الترجمة الحرفية:
> ملخص دوال دورة الحياة — مخطط يوضّح: إطلاق النشاط ← onCreate() ← onStart() ← onResume() ← النشاط قيد التشغيل ← (يأتي نشاط آخر إلى المقدمة) ← onPause() ← (النشاط لم يعد مرئيًا) ← onStop() ← (ينتهي أو يُدمَّر بواسطة النظام) ← onDestroy() ← إغلاق النشاط. أيضًا: يعود المستخدم إلى النشاط ← onResume() (من حالة الإيقاف المؤقت)؛ يتنقل المستخدم إلى النشاط ← onRestart() ← onStart() (من حالة الإيقاف)؛ تطبيقات ذات أولوية أعلى تحتاج ذاكرة ← إنهاء عملية التطبيق (من حالة الإيقاف المؤقت أو الإيقاف).

#### الشرح المبسّط:
هذا المخطط (الموجود في الصفحة 22 من المحاضرة) يجمع كل الدوال الست التي شرحناها في صورة واحدة متكاملة، ويوضّح بصريًا ثلاث حقائق أساسية: أولًا، المسار الطبيعي الصاعد (`onCreate → onStart → onResume`) يحدث مرة واحدة عند الإطلاق. ثانيًا، هناك مسار دائري بين `Paused` و`Resumed` (إن عاد المستخدم بسرعة) ومسار آخر بين `Stopped` و`Started` عبر `onRestart` (إن عاد بعد فترة أطول). ثالثًا وهو الأهم: من حالتي `Paused` و`Stopped`، قد "يُقتل" التطبيق بالكامل من الذاكرة دون سابق إنذار إن احتاجت تطبيقات أخرى ذات أولوية أعلى للذاكرة — وهذا يوضّح عمليًا لماذا لا يمكن الاعتماد على `onDestroy()` وحدها لحفظ البيانات، لأن النظام قد "يقتل" العملية مباشرة من Paused/Stopped دون المرور بـ onDestroy أصلًا في حالات الطوارئ. تشبيه ذلك بخريطة مترو: هناك محطات رئيسية تمر بها كل رحلة (الخط الأساسي)، لكن هناك أيضًا مخارج طوارئ (قتل العملية) يمكن أن تُنهي رحلتك في أي محطة وسيطة دون سابق إنذار.

#### 📊 المخطط: دورة حياة النشاط الكاملة

#### ما هذا المخطط؟
> يوضّح جميع الحالات الست لدورة حياة الـ `Activity` والانتقالات الممكنة بينها، بما فيها احتمال إنهاء العملية بالكامل من قِبل النظام.

#### وصف العُقد:
| # | العُقدة | النوع `kind` | الشرح |
| --- | --- | --- | --- |
| 1 | Activity launched | event | بداية دورة حياة النشاط |
| 2 | onCreate() | process | التهيئة الأولى لمرة واحدة |
| 3 | onStart() | process | النشاط يصبح مرئيًا |
| 4 | onResume() | process | النشاط يصبح تفاعليًا |
| 5 | Activity running | state | حالة التشغيل الكاملة (Resumed) |
| 6 | onPause() | process | فقدان التركيز، لا يزال مرئيًا جزئيًا |
| 7 | onStop() | process | اختفاء كامل عن الشاشة |
| 8 | onRestart() | process | العودة من حالة Stopped |
| 9 | onDestroy() | process | التحرير النهائي للموارد |
| 10 | Activity shut down | event | نهاية دورة الحياة الطبيعية |
| 11 | App process killed | event | إنهاء قسري من النظام لتحرير الذاكرة |

#### وصف الروابط:
| من | إلى | التسمية | نوع السهم | الشرح |
| --- | --- | --- | --- | --- |
| Activity launched | onCreate() | — | تسلسل | بداية السلسلة |
| onCreate() | onStart() | — | تسلسل | تلقائي وسريع |
| onStart() | onResume() | — | تسلسل | تلقائي وسريع |
| onResume() | Activity running | — | تسلسل | دخول الحالة التفاعلية |
| Activity running | onPause() | نشاط آخر يظهر في المقدمة | شرطي | فقدان التركيز |
| onPause() | onResume() | يعود المستخدم للنشاط | شرطي عكسي | استئناف سريع |
| onPause() | onStop() | النشاط لم يعد مرئيًا | تسلسل | اختفاء كامل |
| onStop() | onRestart() | يتنقل المستخدم للنشاط مجددًا | شرطي عكسي | عودة بعد توقف |
| onRestart() | onStart() | — | تسلسل | إعادة تشغيل تلقائية |
| onStop() | onDestroy() | النشاط ينتهي أو يُدمَّر | تسلسل | تحرير نهائي |
| onDestroy() | Activity shut down | — | تسلسل | نهاية دورة الحياة |
| onPause() | App process killed | تطبيقات أعلى أولوية تحتاج ذاكرة | طوارئ | إنهاء قسري |
| onStop() | App process killed | تطبيقات أعلى أولوية تحتاج ذاكرة | طوارئ | إنهاء قسري |

```diagram
type: activity
title: Activity Lifecycle
direction: TD
nodes:
  - id: launched
    label: Activity launched
    kind: event
    level: 0
  - id: create
    label: onCreate()
    kind: process
    level: 1
  - id: start
    label: onStart()
    kind: process
    level: 2
  - id: resume
    label: onResume()
    kind: process
    level: 3
  - id: running
    label: Activity running
    kind: state
    level: 4
  - id: pause
    label: onPause()
    kind: process
    level: 5
  - id: stop
    label: onStop()
    kind: process
    level: 6
  - id: restart
    label: onRestart()
    kind: process
    level: 6
  - id: destroy
    label: onDestroy()
    kind: process
    level: 7
  - id: shutdown
    label: Activity shut down
    kind: event
    level: 8
  - id: killed
    label: App process killed
    kind: event
    level: 6
edges:
  - from: launched
    to: create
  - from: create
    to: start
  - from: start
    to: resume
  - from: resume
    to: running
  - from: running
    to: pause
    label: another activity in foreground
  - from: pause
    to: resume
    label: user returns
  - from: pause
    to: stop
    label: no longer visible
  - from: stop
    to: restart
    label: user navigates back
  - from: restart
    to: start
  - from: stop
    to: destroy
    label: finishing or destroyed
  - from: destroy
    to: shutdown
  - from: pause
    to: killed
    label: higher priority app needs memory
  - from: stop
    to: killed
    label: higher priority app needs memory
```

---
