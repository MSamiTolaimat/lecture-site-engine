# المحاضرة 5 — Activity & Intents (المكوّن النشِط والنيّات)
> **المادة:** أساسيات تطوير تطبيقات أندرويد (النظري الكامل) (نظري) | **الموضوع:** Activity Component — Configuring the Manifest, Activity Lifecycle, Intents & Intent Filters, Intent Resolution

---

## 📌 خريطة التكامل (أين تقع هذه المادة في مسار أندرويد؟)

| المرحلة | الأدوات | المخرجات |
| --- | --- | --- |
| أساسيات Kotlin | `val/var`، `Functions`، `Null Safety` | كتابة منطق برمجي سليم |
| Kotlin OOP | `class`، `inheritance`، `override` | فهم أن `Activity` نفسها class موروثة |
| App Fundamentals | `AndroidManifest.xml`، مكوّنات التطبيق الأربعة | معرفة أن `Activity` أحد المكوّنات الأربعة |
| **Activity & Intents** ← أنت هنا | `Activity Lifecycle`، `Intent`، `Intent Filter`، `Intent Resolution` | التنقّل بين الشاشات داخل التطبيق وبين التطبيقات |
| Compose UI | `@Composable`، `Modifier` | بناء واجهة داخل كل `Activity` |
| Compose State & Navigation | `NavController`، `State Hoisting` | تنقّل حديث بديل عن تعدد الـ Activities |

> **نوع هذه المحاضرة:** نظرية بامتياز (Theoretical) — تشرح دورة حياة مكوّن `Activity` وآلية التواصل بين مكوّنات التطبيق عبر `Intent`، مع أمثلة كود `Kotlin` و `XML` قصيرة توضيحية وليست تطبيقاً عملياً كاملاً.

---

## الجزء الأول: الشرح التفصيلي (سطر بسطر / فقرة بفقرة)

### 1. مفهوم الـ Activity (The Concept of Activities)

#### النص الأصلي يقول (English):
> "The activity serves as the entry point for an app's interaction with the user. You implement an activity as a subclass of the Activity class... An activity provides the window in which the app draws its UI. Generally, one activity implements one screen in an app."

#### الشرح المبسّط:
`Activity` هي نقطة الدخول اللي من خلالها يتفاعل المستخدم مع تطبيقك. كل `Activity` هي `class` بترث من `Activity class`، وهي المسؤولة عن رسم "نافذة" (window) توضع فيها واجهة المستخدم. بشكل عام، كل شاشة واحدة بالتطبيق = `Activity` واحدة.

**لماذا؟** لأنو أندرويد يحتاج نظام واضح يعرف من خلاله "شو الشاشة الحالية المسؤولة عن التفاعل مع المستخدم الآن"، فبيربط كل شاشة بمكوّن مستقل له دورة حياة يديرها النظام نفسه.

#### 💡 التشبيه:
> تخيّل التطبيق متل مبنى فيه غرف متعددة (شاشات).
> **وجه الشبه:** كل غرفة بالمبنى = `Activity` واحدة، والباب اللي بتفتحه لتدخل الغرفة = نقطة الدخول (entry point) لهاي الشاشة.

---

### 2. تعدّد الـ Activities والانتقال بينها

#### النص الأصلي يقول (English):
> "Most apps contain multiple screens, which means they comprise multiple activities. Typically, one activity in an app is specified as the main activity... Each activity can then start another activity in order to perform different actions."

#### الشرح المبسّط:
غالبية التطبيقات فيها أكتر من شاشة، معناها أكتر من `Activity`. وحدة منهم بتنعرّف كـ **main activity**، وهي أول شاشة تظهر لما المستخدم يفتح التطبيق. من هاي الـ main activity، فيك تبلّش `Activity` تانية لتنفيذ مهمة مختلفة.

**مثال من المحاضرة:** تطبيق بريد إلكتروني — الـ main activity بتعرض صندوق الوارد (inbox)، ومن فيها ممكن تفتح Activity تانية لكتابة إيميل جديد، أو Activity تالتة لفتح إيميل معيّن وقراءته.

**لماذا؟** لأنو فصل كل مهمة بـ `Activity` مستقلة بيخلّي التطبيق منظّم، وكل شاشة تقدر تدار وتتحكم فيها بشكل مستقل (تُفتح، تُوقف، تُدمّر) دون التأثير على باقي الشاشات.

> **ملاحظة:** لاستخدام الـ Activities، لازم تسجّل معلوماتها بملف الـ manifest، وتدير دورة حياتها بشكل صحيح — وهذا بالضبط موضوع باقي المحاضرة.

---

### 3. تهيئة ملف الـ Manifest — تعريف الـ Activities (Declare Activities)

#### النص الأصلي يقول (English):
> "To declare your activity, open your manifest file and add an `<activity>` element as a child of the `<application>` element... The only required attribute for this element is `android:name`, which specifies the class name of the activity."

#### الشرح المبسّط:
أي `Activity` بدك تستخدمها لازم تصرّح عنها (declare) جوا ملف `AndroidManifest.xml`، وإلا النظام ما رح يعرف فيها ولا رح يقدر يشغّلها. التصريح بيصير بإضافة عنصر `<activity>` جوا `<application>`.

```xml
<manifest ... >
    <application ... >
        <activity android:name=".ExampleActivity" /> <!-- تصريح عن Activity باسم ExampleActivity -->
        ...
    </application ... >
    ...
</manifest >
```

#### شرح كل سطر:
1. `<manifest ...>` → الجذر (root element) لملف الـ manifest — يحتوي كل معلومات التطبيق.
2. `<application ...>` → العنصر المسؤول عن وصف التطبيق ككل ويحوي كل مكوّناته.
3. `<activity android:name=".ExampleActivity" />` → تصريح صريح عن وجود `Activity` باسم `ExampleActivity`؛ الخاصية `android:name` هي الوحيدة الإلزامية.

**المكتبات المطلوبة (Imports):**
> لا يوجد — هذا XML تصريحي وليس كود Kotlin.

**الناتج المتوقع (لقطة الشاشة):**
> بدون هذا التصريح، محاولة تشغيل `ExampleActivity` بتؤدي لـ `ActivityNotFoundException` عند التشغيل.

> **لماذا؟** النظام لازم يعرف مسبقاً (بدون ما يفحص الكود بالكامل وقت التشغيل) شو المكوّنات الموجودة بالتطبيق حتى يدير الأذونات، الموارد، ودورة الحياة بشكل آمن ومنظّم — لهيك الـ manifest هو "الفهرس" الرسمي للتطبيق.

#### 🤔 تفعيل الفهم (اسأل نفسك):
> **سؤال:** إذا نسيت تصرّح عن `Activity` بالـ manifest، شو بيصير لما تحاول تشغّلها بالكود؟
> **لماذا هذا مهم؟** لأنو غلطة شائعة جداً عند المبتدئين، وفهمها بيوفر عليك وقت debugging كتير.

---

### 4. تصريح الـ Intent Filters (Declare Intent Filters)

#### النص الأصلي يقول (English):
> "Intent filters provide the ability to launch an activity based not only on an explicit request, but also an implicit one... You can take advantage of this feature by declaring an `<intent-filter>` element in the `<activity>` element."

#### الشرح المبسّط:
`Intent filter` هو إعلان جوا الـ manifest يقول لأندرويد: "أنا هاد الـ Activity قادر أستقبل هالنوع من الطلبات". بالتالي فيك تشغّل الـ Activity إما بـ **طلب صريح** (بتحدد بالضبط مين الـ Activity المطلوبة)، أو **طلب ضمني** (بتوصف الحاجة بس بدون تحديد اسم Activity معيّن، ويقرر النظام مين يلبّيها).

**مثال من النص:**
- طلب صريح: "شغّل Activity إرسال الإيميل داخل تطبيق Gmail تحديداً".
- طلب ضمني: "شغّل أي شاشة إرسال إيميل بأي تطبيق قادر يعمل هالمهمة".

```xml
<activity android:name=".ExampleActivity" android:icon="@drawable/app_icon">
    <intent-filter>
        <action android:name="android.intent.action.SEND" />
        <category android:name="android.intent.category.DEFAULT" />
        <data android:mimeType="text/plain" />
    </intent-filter>
</activity>
```

#### شرح كل سطر:
1. `<intent-filter>` → يفتح تعريف "بصمة" النيّات (intents) اللي هاي الـ Activity قادرة تستقبلها.
2. `<action android:name="android.intent.action.SEND" />` → يوضّح إنو هاي الـ Activity قادرة تنفّذ عملية "إرسال بيانات".
3. `<category android:name="android.intent.category.DEFAULT" />` → إلزامي حتى تقدر الـ Activity تستقبل نيّات ضمنية عادية (سنشرحها بالتفصيل بقسم Intent Resolution).
4. `<data android:mimeType="text/plain" />` → يحدّد نوع البيانات المقبولة (هون: نص عادي).

مثال استدعاء هاي الـ Activity من مكان تاني بالكود:
```kotlin
val sendIntent = Intent().apply {
    action = Intent.ACTION_SEND         // تحديد نوع العملية: إرسال
    type = "text/plain"                 // تحديد نوع البيانات
    putExtra(Intent.EXTRA_TEXT, textMessage) // إضافة البيانات الفعلية (النص المُرسل)
}
startActivity(sendIntent)               // إطلاق الـ Intent وتفويض النظام لإيجاد Activity مناسبة
```

> **مهم للامتحان ⚠️:**
> الـ `Activities` اللي ما بدك تشاركها مع تطبيقات تانية، **لا تعطيها `intent-filter`** — بهيك ما حدا غيرك يقدر يشغّلها إلا بطلب صريح (explicit intent) من داخل تطبيقك أنت.

#### 💡 التشبيه:
> تخيّل الـ `intent-filter` متل لافتة معلّقة على باب محل: "هون منصلّح موبايلات وحاسوب فقط".
> **وجه الشبه:** اللافتة (intent-filter) = الإعلان عن نوع الخدمة (action/category/data) اللي المحل (الـ Activity) قادر يقدّمها.

---

### 5. تصريح الأذونات (Declare Permissions)

#### النص الأصلي يقول (English):
> "You can use the manifest's `<activity>` tag to control which apps can start a particular activity. An activity (or application) cannot launch a target activity unless both activities have the same permissions in their manifest."

#### الشرح المبسّط:
فيك تحمي الـ `Activity` تبعتك من إنو أي تطبيق يشغّلها بشكل عشوائي، عن طريق ربطها بإذن (`permission`) معيّن. أي تطبيق تاني بدو يشغّل هالـ `Activity` لازم يطلب نفس الإذن صراحة بملف الـ manifest تبعو.

```xml
<!-- SocialApp manifest: -->
<manifest>
    <activity android:name="...."
        android:permission="com.google.socialapp.permission.SHARE_POST" />
</manifest>

<!-- تطبيقك (يريد استدعاء SocialApp): -->
<manifest>
    <uses-permission android:name="com.google.socialapp.permission.SHARE_POST"/>
</manifest>
```

**لماذا؟** حماية أمنية — منع تطبيقات خبيثة أو غير مصرّح لها من استدعاء أجزاء حساسة بتطبيقك بدون إذن صريح.

#### 💡 التشبيه:
> متل نادي خاص فيه "كرت عضوية" — ما بتفوت إلا إذا معك نفس الكرت اللي طالبه النادي.
> **وجه الشبه:** الكرت = الـ `permission`، والنادي = الـ `Activity` المحمية.

---

### 6. دورة حياة الـ Activity — لماذا هي موجودة؟ (Managing the Activity Lifecycle)

#### النص الأصلي يقول (English):
> "As a user navigates through, out of, and back to your app, the Activity instances in your app transition through different states in their lifecycle... good implementation of the lifecycle callbacks can help your app avoid crashing, consuming valuable resources, losing user's progress, or crashing on screen rotation."

#### الشرح المبسّط:
المستخدم مش دايماً قاعد جوا تطبيقك — ممكن يطلع منّه (تطبيق تاني، اتصال هاتفي، تدوير الشاشة...) ويرجع يفتحه بعدين. النظام بيحتاج طريقة يعلمك فيها "هلق المستخدم طالع" أو "هلق رجع"، حتى تتصرف بشكل مناسب (وقف فيديو، احفظ بيانات، حرّر موارد...). هون بالضبط بتيجي أهمية الـ **lifecycle callbacks**.

**لماذا؟** بدون إدارة صحيحة لدورة الحياة:
- التطبيق ممكن يكرش لما يجي اتصال هاتفي أثناء الاستخدام.
- التطبيق بيستهلك موارد النظام (بطارية، شبكة) وهو مش ظاهر للمستخدم أصلاً.
- بيضيع تقدّم المستخدم (مثلاً كتب فورم وطلع رجع لقاه فاضي).
- بيكرش أو يضيع البيانات عند تدوير الشاشة.

#### 💡 التشبيه:
> متل موظف استقبال بفندق — لازم يعرف بالضبط أيمتى الضيف دخل، أيمتى راح يستريح مؤقتاً، وأيمتى غادر نهائياً، حتى يتصرف صح بكل حالة (يجهّز الغرفة، يوقف الخدمة، يفضي الغرفة لضيف جديد).
> **وجه الشبه:** الضيف = المستخدم، وحالات دخوله/خروجه = مراحل دورة حياة الـ `Activity`.

---

### 7. الـ Callbacks الأساسية الستة (Activity-lifecycle Concepts)

#### النص الأصلي يقول (English):
> "To navigate between stages of the activity lifecycle, the Activity class provides a core set of six callbacks: onCreate(), onStart(), onResume(), onPause(), onStop(), and onDestroy()."

#### الشرح المبسّط:
عندنا 6 دوال (callbacks) أساسية بيستدعيها النظام تلقائياً حسب حالة الـ `Activity`:
`onCreate()`, `onStart()`, `onResume()`, `onPause()`, `onStop()`, `onDestroy()` — وفي دالة سابعة إضافية `onRestart()` بتصير بحالة معيّنة رح نشرحها.

**لماذا هالعدد بالذات؟** كل دالة بتمثّل "لحظة انتقال" مهمة بحياة الشاشة (تُنشأ، تصير مرئية، تصير تفاعلية، تفقد التركيز، تختفي، تُدمّر)، وكل لحظة إلها احتياجات مختلفة من حيث الموارد.

```algorithm
1 | إنشاء الـ Activity | النظام | استدعاء onCreate()
2 | ظهور الـ Activity | النظام | استدعاء onStart()
3 | بدء التفاعل | النظام | استدعاء onResume()
4 | فقدان التركيز جزئياً | النظام | استدعاء onPause()
5 | اختفاء كامل | النظام | استدعاء onStop()
6 | تدمير أو إعادة تشغيل | النظام | استدعاء onDestroy() أو onRestart() ثم onStart()
```

---

### 8. `onCreate()`

#### النص الأصلي يقول (English):
> "You must implement this callback, which fires when the system first creates the activity... perform basic application startup logic that happens only once for the entire life of the activity. This method receives the parameter savedInstanceState..."

#### الشرح المبسّط:
`onCreate()` هي أول دالة تنفّذ لما يتم إنشاء الـ `Activity`، وهي **إلزامية** التنفيذ. فيها بتحط منطق البدء الأساسي اللي بيصير مرة وحدة بس طول عمر الـ `Activity` (مثل ربط الـ `ViewModel`، تعريف متغيرات على مستوى الـ class).

```kotlin
override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState) // استدعاء تنفيذ الأب أولاً (إلزامي)
}
```

#### شرح كل سطر:
1. `override fun onCreate(savedInstanceState: Bundle?)` → دالة override تستقبل `Bundle?` قد يكون `null` إذا كانت هذه أول مرة تُنشأ فيها الـ Activity.
2. `super.onCreate(savedInstanceState)` → استدعاء إلزامي لتنفيذ الأب حتى تعمل الآلية الداخلية للنظام بشكل صحيح.

> **نقطة مهمة ⚠️:**
> الـ `Activity` ما بتضل واقفة عند `Created` — فور انتهاء `onCreate()`، النظام بيستدعي `onStart()` ثم `onResume()` بشكل متتالي وسريع.

---

### 9. `onStart()`

#### النص الأصلي يقول (English):
> "As onCreate() exits, the activity enters the Started state, and the activity becomes visible to the user... This method is where the code that maintains the UI is initialized."

#### الشرح المبسّط:
لما تخلص `onCreate()`، الـ `Activity` تصير بحالة **Started** وتصير **مرئية** للمستخدم (لكن لسا مش تفاعلية بشكل كامل). هون منقدر نهيّئ الكود المسؤول عن الحفاظ على الواجهة.

```kotlin
override fun onStart() {
    super.onStart()
}
```

> **ملاحظة:** هاي الدالة كمان بتنفّذ بسرعة، وما بتضل الـ Activity واقفة عند Started — بتنتقل فوراً لـ Resumed ويستدعى `onResume()`.

---

### 10. `onResume()`

#### النص الأصلي يقول (English):
> "The system invokes onResume() callback just before the activity starts interacting with the user... The app stays in this state until something happens to take focus away from the app... implement onResume() to initialize components that you release during onPause()."

#### الشرح المبسّط:
`onResume()` هي اللحظة اللي فيها الـ `Activity` بتصير بالمقدمة (foreground) والمستخدم فعلياً عم يتفاعل معها. التطبيق بيضل بهالحالة لحتى يصير شي يسحب التركيز (اتصال هاتفي، الانتقال لـ Activity تانية، إطفاء الشاشة).

```kotlin
override fun onResume() {
    super.onResume()
}
```

**لماذا مهمة onResume() بالذات لإعادة التهيئة؟** لأنو أي Activity ممكن تدخل `Paused` ثم ترجع `Resumed` أكتر من مرة (مو بس أول مرة)، فلازم كل مورد حرّرته بـ `onPause()` تعيد تفعيله هون في كل مرة.

---

### 11. `onPause()`

#### النص الأصلي يقول (English):
> "The system calls onPause() method as the first indication that the user is leaving your activity... Use the onPause() method to pause or adjust operations... don't use onPause() to save application or user data, make network calls, or execute database transactions."

#### الشرح المبسّط:
`onPause()` هو أول إشارة إنو المستخدم "عم يطلع" من الـ Activity — بس هذا لا يعني بالضرورة إنها رح تُدمّر. ممكن تضل الـ Activity ظاهرة جزئياً (مثلاً بوضع النوافذ المتعددة multi-window، أو ظهور Dialog فوقها).

```kotlin
override fun onPause() {
    super.onPause()
}
```

**أسباب دخول onPause():**
- حدث مقاطعة (الأكثر شيوعاً).
- وضع multi-window — بيركز النظام على تطبيق واحد بس.
- فتح Dialog فوق الـ Activity.

> **مهم للامتحان ⚠️:**
> ممنوع تستخدم `onPause()` لحفظ بيانات، استدعاء شبكة، أو معاملات قاعدة بيانات — لأنو ما في وقت كافي مضمون لإتمام هالعمليات هون. هاي العمليات "الثقيلة" مكانها `onStop()`.

**الفهم الخاطئ الشائع ❌:** "onPause() تعني إنو الـ Activity رح تنتهي أو تُدمّر."
**الفهم الصحيح ✅:** onPause() فقط تعني فقدان التركيز — ممكن ترجع لـ onResume() أو تكمل لـ onStop().

---

### 12. `onStop()`

#### النص الأصلي يقول (English):
> "When your activity is no longer visible to the user, it enters the Stopped state... In the onStop() method: Release or adjust resources that are not needed... Perform relatively CPU-intensive shutdown operations."

#### الشرح المبسّط:
لما تصير الـ `Activity` **غير مرئية بالكامل** (Activity تانية غطّت كامل الشاشة، أو التطبيق راح ينتهي)، بتدخل حالة **Stopped**.

```kotlin
override fun onStop() {
    super.onStop()
}
```

**هون منسوّي:**
- تحرير أو تعديل موارد مو محتاجينها وقت عدم الظهور (مثلاً إيقاف animations، تقليل دقة تحديثات GPS).
- عمليات إغلاق تستهلك معالج أكتر (مثلاً حفظ معلومات بقاعدة بيانات) — **هون** مكانها الصحيح، مش بـ `onPause()`.

> **ملاحظة:** الـ `Activity` بحالة Stopped بتضل موجودة بالذاكرة (الـ object نفسه محفوظ بكل حالته)، بس مش مرتبطة بـ window manager. لما ترجع، بتسترجع هاي المعلومات تلقائياً.

من هاي الحالة، إما:
- ترجع تتفاعل → `onRestart()`.
- تنتهي نهائياً → `onDestroy()`.

---

### 13. `onRestart()`

#### النص الأصلي يقول (English):
> "The system invokes onRestart() callback when an activity in the Stopped state is about to restart... onRestart() restores the state of the activity from the time that it was stopped. This callback is always followed by onStart()."

#### الشرح المبسّط:
لما مستخدم يرجع لـ Activity كانت بحالة Stopped، النظام بيستدعي `onRestart()` أولاً لاسترجاع الحالة السابقة، **ودايماً** بيتبعها استدعاء `onStart()` مباشرة.

```kotlin
override fun onRestart() {
    super.onRestart()
}
```

---

### 14. `onDestroy()`

#### النص الأصلي يقول (English):
> "onDestroy() is called before the activity is destroyed... The system invokes this callback for one of two reasons: the activity is finishing... or the system is temporarily destroying the activity due to a configuration change, such as device rotation."

#### الشرح المبسّط:
`onDestroy()` تُستدعى **قبل** تدمير الـ `Activity` نهائياً، لسببين:
1. المستخدم أنهى الـ Activity فعلياً (أو استُدعيت `finish()`).
2. النظام دمّرها **مؤقتاً** بسبب تغيير بالـ configuration (متل تدوير الشاشة).

```kotlin
override fun onDestroy() {
    super.onDestroy()
}
```

> **مهم للامتحان ⚠️:**
> إذا `onDestroy()` استُدعيت بسبب تغيير configuration (زي دوران الشاشة)، النظام **فوراً** بينشئ نسخة (instance) جديدة من الـ Activity ويستدعي `onCreate()` عليها بالـ configuration الجديد. هذا يفسّر ليش بيانات UI ممكن تضيع عند الدوران إذا ما حفظتها.

**لماذا؟** `onDestroy()` هي الفرصة الأخيرة لتحرير أي موارد ما تحررت بمراحل سابقة (متل `onStop()`).

---

### 15. التفاعل مع تطبيقات أخرى (Interact with Other Apps) والـ Intent

#### النص الأصلي يقول (English):
> "To take the user from one activity to another, your app must use an Intent to define your app's 'intent' to do something... An Intent is a messaging object you can use to request an action from another app component."

#### الشرح المبسّط:
لنقل المستخدم من `Activity` لـ `Activity` تانية (سواء جوا نفس التطبيق أو بتطبيق تاني)، لازم تستخدم `Intent`. الـ `Intent` هو **object رسالة** (messaging object) بتطلب فيه من مكوّن تاني إنو ينفّذ إجراء معيّن، وبتمرّره لدالة زي `startActivity()`.

**لماذا؟** لأنو `Intent` بيفصل "الطلب" عن "منفّذ الطلب" — تطبيقك بس بيقول "بدي أرسل نص"، وأندرويد هو اللي بيقرر مين بيلبّي الطلب (تطبيق معيّن أو أي تطبيق مؤهّل).

#### 💡 التشبيه:
> متل ما ترسل طلب توصيل عالتطبيق: أنت بس بتحدد "بدي بيتزا"، والتطبيق (Android system) هو اللي بيوجّه الطلب لأقرب مطعم مناسب (Activity المناسبة).
> **وجه الشبه:** الطلب = `Intent`، والمطعم المستلم = الـ `Activity` أو المكوّن المستهدف.

---

### 16. أنواع الـ Intent: صريح وضمني (Intent Types)

#### النص الأصلي يقول (English):
> "Explicit intents specify which component of which application will satisfy the intent, by specifying a full ComponentName. Implicit intents do not name a specific component, but instead declare a general action to perform, which allows a component from another app to handle it."

#### الشرح المبسّط:
فيه نوعين من الـ `Intent`:

| النوع | التعريف | مثال |
| --- | --- | --- |
| **Explicit Intent** | يحدّد بالضبط اسم المكوّن (`ComponentName`) المطلوب تشغيله | `Intent(this, SecondActivity::class.java)` |
| **Implicit Intent** | لا يحدّد اسم مكوّن، بل يصف "action" عام يقدر أي تطبيق مؤهّل يلبّيه | `Intent(Intent.ACTION_SEND)` |

عندما تستخدم implicit intent، النظام بيقارن محتوى الـ `Intent` بالـ `intent filters` المصرّح عنها بملفات manifest التطبيقات الموجودة على الجهاز:
- إذا انطبق الـ Intent مع intent filter واحد → النظام بيشغّل هالمكوّن مباشرة.
- إذا انطبق مع أكتر من مكوّن → النظام بيعرض للمستخدم قائمة اختيار (Chooser Dialog).
- إذا الـ Activity ما إلها `intent-filter` أصلاً → ما فيها تنشغّل إلا بـ explicit intent.

#### ⚖️ المقايضة: Explicit مقابل Implicit Intent

| | Explicit Intent | Implicit Intent |
| --- | --- | --- |
| المزايا | تحكم كامل ودقيق، أداء أسرع، مضمون التنفيذ | مرونة عالية، يسمح بالتكامل بين تطبيقات مختلفة |
| العيوب | محدود بمعرفة اسم المكوّن مسبقاً، لا يعمل مع تطبيقات خارجية غير معروفة الاسم | قد لا يجد أي تطبيق مؤهّل، أو يحتاج اختيار المستخدم |
| متى تختاره | عند التنقّل داخل نفس التطبيق | عند طلب خدمة عامة (مشاركة، فتح رابط، اتصال هاتفي...) |

---

### 17. بناء الـ Intent — الخصائص الست (Building an Intent)

#### النص الأصلي يقول (English):
> "The primary information contained in an Intent is the following: Component name, Action, Data, Category, Extras, Flags... The properties (component name, action, data, and category) represent the defining characteristics of an intent."

#### الشرح المبسّط:
الـ `Intent` بيحمل 6 معلومات أساسية، أربعة منها (`Component name`, `Action`, `Data`, `Category`) هي اللي **تحدد كيفية تحليل الـ Intent** (Intent Resolution)، بينما (`Extras`, `Flags`) بيحملوا معلومات إضافية لا تؤثر على عملية التحليل.

| الخاصية | الوظيفة | تؤثر على Resolution؟ |
| --- | --- | --- |
| `Component Name` | تحديد المكوّن المستهدف بدقة | نعم |
| `Action` | العملية العامة المطلوب تنفيذها | نعم |
| `Data` | الـ URI ونوع البيانات (MIME type) | نعم |
| `Category` | معلومة إضافية عن نوع المكوّن المطلوب | نعم |
| `Extras` | بيانات إضافية (key-value) | لا |
| `Flags` | تعليمات تحكم بكيفية إدارة الـ Activity من النظام | لا |

---

### 17.1 Component Name

#### النص الأصلي يقول (English):
> "If a component name is specified → the intent is explicit... The component name is internally represented as a ComponentName object, which consists of the application package name and the fully qualified class name of the target component."

#### الشرح المبسّط:
تحديد اسم المكوّن يخلّي الـ Intent **explicit**. لو ما حددته، يصير **implicit**.

```kotlin
val intent = Intent(this, SecondActivity::class.java)
```

#### شرح كل سطر:
1. `Intent(this, SecondActivity::class.java)` → `this` تمثّل الـ `Context` الحالي (Activity الحالية)، و `SecondActivity::class.java` تمثّل الـ `Class` المستهدفة عبر بناء الجملة `::class.java` بلغة Kotlin.

> **ملاحظة:** التوقيع بلغة Java المكافئ: `Intent(Context packageContext, Class<?> cls)`.

---

### 17.2 Action

#### النص الأصلي يقول (English):
> "An action is a string that specifies the general operation to be performed by an Intent... Some common built-in actions: ACTION_MAIN, ACTION_VIEW, ACTION_SEND, ACTION_DIAL, ACTION_EDIT..."

#### الشرح المبسّط:
الـ `Action` عبارة عن `String` بيحدد نوع العملية العامة اللي بدنا نعملها، وهو المحدد الرئيسي لبنية باقي أجزاء الـ Intent.

| الـ Action | الاستخدام |
| --- | --- |
| `ACTION_MAIN` | نقطة الدخول للتطبيق، لا يستقبل بيانات |
| `ACTION_VIEW` | عرض معلومة موجودة (صورة، موقع...) |
| `ACTION_SEND` | مشاركة بيانات مع تطبيق آخر |
| `ACTION_DIAL` | فتح شاشة الاتصال برقم محدد (بدون اتصال تلقائي) |
| `ACTION_EDIT` | السماح للمستخدم بتعديل بيانات موجودة |

```kotlin
val intent = Intent(Intent.ACTION_DIAL)
// أو
val intent = Intent().apply {
    action = Intent.ACTION_DIAL
}
```

> **ملاحظة:** بلغة Kotlin، الصيغة `action = Intent.ACTION_DIAL` هي "غلاف" (wrapper) بينادي داخلياً دالة `setAction()` من الـ Android API.

---

### 17.3 Data

#### النص الأصلي يقول (English):
> "The data field of an Intent specifies the URI... It may also be associated with a MIME type... it is often important to specify both URI and MIME type. The MIME type helps the Android system find the best component to receive your intent."

#### الشرح المبسّط:
الـ `Data` بتحدد الـ `URI` (عنوان المصدر) وأحياناً نوع البيانات (`MIME type`). أهمية تحديد النوعين معاً: تساعد أندرويد يميّز مثلاً بين تطبيق قادر يعرض صور وتطبيق قادر يشغّل صوت، حتى لو الـ URI شكلها متشابه.

| الطريقة | الوظيفة |
| --- | --- |
| `setData()` | تحديد الـ URI فقط |
| `setType()` | تحديد الـ MIME type فقط |
| `setDataAndType()` | تحديد الاثنين معاً بشكل صريح |

```kotlin
// تحديد URI فقط
val newInt = Intent(Intent.ACTION_VIEW, Uri.parse("tel:+15145551234"))

// تحديد MIME type فقط
val newInt = Intent().apply {
    type = "image/*"
}

// تحديد الاثنين معاً
val newInt = Intent().apply {
    setDataAndType(
        Uri.parse("content://media/external/images/media/100"),
        "image/jpeg"
    )
}
```

> **نقطة مهمة ⚠️:**
> الـ MIME type أحياناً ممكن يُستنتج تلقائياً من الـ URI، مثلاً لو كان الـ URI من نوع `content:` — لأنو الـ `ContentProvider` المسؤول فيه بيقدر يوفّر الـ MIME type المرتبط بالمصدر.

---

### 17.4 Category

#### النص الأصلي يقول (English):
> "A category is a string containing additional information about the kind of component that should handle the intent... CATEGORY_DEFAULT: This category is automatically added to intents passed to startActivity() if no other category is specified."

#### الشرح المبسّط:
الـ `Category` معلومة إضافية اختيارية غالباً — بس فيه فئات مهمة لازم تعرفها:

| الفئة | الوظيفة |
| --- | --- |
| `CATEGORY_BROWSABLE` | يسمح فتح الـ Activity من متصفح ويب (رابط) |
| `CATEGORY_LAUNCHER` | يحدد نقطة الدخول الرئيسية بقائمة التطبيقات |
| `CATEGORY_DEFAULT` | تُضاف تلقائياً لأي intent مُمرّر لـ `startActivity()` إذا ما فيه فئة محددة؛ الـ Activity **لازم** تعلنها بالـ intent filter تبعها لتستقبل implicit intents |

```kotlin
val intent = Intent(Intent.ACTION_VIEW).apply {
    data = Uri.parse("https://example.com")
    addCategory(Intent.CATEGORY_BROWSABLE)
}
```

---

### 17.5 Extras

#### النص الأصلي يقول (English):
> "Extras are key-value pairs that carry additional information required to accomplish the requested action... You can add extra data with various putExtra() methods... or create a Bundle object with all the extra data."

#### الشرح المبسّط:
الـ `Extras` هي بيانات إضافية بصيغة **مفتاح-قيمة** (key-value) بتحمل تفاصيل العملية. بتنضاف بـ `putExtra()`، أو تجمع كلها بـ `Bundle` وتُمرّر دفعة وحدة بـ `putExtras()`.

```kotlin
val emailIntent = Intent(Intent.ACTION_SENDTO).apply {
    data = Uri.parse("mailto:someone@example.com") // عنوان المستلم
    putExtra(Intent.EXTRA_SUBJECT, "Hello")          // عنوان الإيميل
    putExtra(Intent.EXTRA_TEXT, "This is the body of the email") // نص الإيميل
}
startActivity(Intent.createChooser(emailIntent, "Choose an email client"))
```

#### شرح كل سطر:
1. `Intent(Intent.ACTION_SENDTO).apply { ... }` → إنشاء Intent بعملية "أرسل إلى" مع تهيئة خصائصه ضمن كتلة `apply`.
2. `data = Uri.parse("mailto:someone@example.com")` → تحديد عنوان المستلم عبر URI بصيغة `mailto:`.
3. `putExtra(Intent.EXTRA_SUBJECT, "Hello")` → إضافة عنوان الرسالة كـ extra بمفتاح جاهز مخصص للعناوين.
4. `putExtra(Intent.EXTRA_TEXT, "This is the body of the email")` → إضافة نص الرسالة كـ extra.
5. `startActivity(Intent.createChooser(emailIntent, "Choose an email client"))` → إطلاق نافذة اختيار تطبيق البريد المناسب من بين التطبيقات المؤهّلة.

**المكتبات المطلوبة (Imports):**
> `import android.content.Intent`
> `import android.net.Uri`

**الناتج المتوقع (لقطة الشاشة):**
> نافذة اختيار (Chooser) تعرض تطبيقات البريد المثبّتة على الجهاز، وعند الاختيار تُفتح شاشة إرسال إيميل معبّأة مسبقاً بالعنوان والموضوع والنص.

---

### 17.6 Flags

#### النص الأصلي يقول (English):
> "Flags function as metadata for the intent and are used to control how the Android system launches and manages an activity... FLAG_ACTIVITY_NO_HISTORY: If set, the activity is not kept in the back stack."

#### الشرح المبسّط:
الـ `Flags` هي بيانات وصفية (metadata) بتتحكم بكيفية إدارة النظام للـ `Activity` المطلوبة — مثلاً هل تنحفظ بسجل الشاشات السابقة (back stack) أو لا.

| الـ Flag | الوظيفة |
| --- | --- |
| `FLAG_ACTIVITY_NO_HISTORY` | الـ Activity ما تنحفظ بالـ back stack — بمجرد ما يطلع منها المستخدم تنتهي فوراً |
| `FLAG_DEBUG_LOG_RESOLUTION` | لأغراض تصحيح الأخطاء — يطبع تفاصيل عملية الـ resolution |

```kotlin
val newInt = Intent(Intent.ACTION_SEND).apply {
    flags = Intent.FLAG_ACTIVITY_NO_HISTORY
    // أو بشكل مكافئ:
    // addFlags(Intent.FLAG_ACTIVITY_NO_HISTORY)
}
```

---

### 18. استقبال الـ Implicit Intent (Receiving an Implicit Intent)

#### النص الأصلي يقول (English):
> "To advertise which implicit intents your app can receive, declare one or more intent filters... explicitly set a value for android:exported. An app component should declare separate filters for each unique job it can do."

#### الشرح المبسّط:
لتعلن الـ `Activity` تبعتك عن قدرتها استقبال implicit intents، لازم تضيف `<intent-filter>` واحد أو أكتر بالـ manifest، وتحدد صراحة قيمة `android:exported` (هل هالمكوّن مسموح تطبيقات تانية توصله ولا لا). كل filter بيمثّل "مهمة فريدة" واحدة — إذا الـ Activity بتعمل أكتر من مهمة، حطّلها أكتر من intent filter مستقل.

#### 📊 المخطط: مثال Manifest تطبيق مشاركة اجتماعية

#### ما هذا المخطط؟
> يوضّح كيف تُعرّف Activity رئيسية (نقطة دخول التطبيق) وActivity ثانية مخصصة لاستقبال طلبات المشاركة من تطبيقات أخرى.

#### وصف العُقد:
| # | العُقدة | النوع `kind` | الشرح |
| --- | --- | --- | --- |
| 1 | MainActivity | activity | نقطة الدخول — ACTION_MAIN + CATEGORY_LAUNCHER |
| 2 | ShareActivity (filter 1) | intent-filter | يستقبل ACTION_SEND لنص عادي (text/plain) |
| 3 | ShareActivity (filter 2) | intent-filter | يستقبل ACTION_SEND / SEND_MULTIPLE للصور والفيديو |

#### وصف الروابط:
| من | إلى | التسمية | نوع السهم | الشرح |
| --- | --- | --- | --- | --- |
| نظام التشغيل | MainActivity | ACTION_MAIN | صريح/ضمني | فتح التطبيق من قائمة التطبيقات |
| تطبيق خارجي | ShareActivity | ACTION_SEND (text) | ضمني | مشاركة نص من تطبيق آخر |
| تطبيق خارجي | ShareActivity | ACTION_SEND/SEND_MULTIPLE (media) | ضمني | مشاركة صور أو فيديو من تطبيق آخر |

```diagram
type: flowchart
title: استقبال Implicit Intent - تطبيق مشاركة اجتماعية
direction: TD
nodes:
  - id: main
    label: MainActivity (ACTION_MAIN + CATEGORY_LAUNCHER)
    kind: event
    level: 0
  - id: share_text
    label: ShareActivity - filter نص (text/plain)
    kind: process
    level: 1
  - id: share_media
    label: ShareActivity - filter وسائط (image/video)
    kind: process
    level: 1
edges:
  - from: main
    to: share_text
  - from: main
    to: share_media
```

```xml
<activity android:name="MainActivity" android:exported="true">
    <!-- This activity is the main entry, should appear in app launcher -->
    <intent-filter>
        <action android:name="android.intent.action.MAIN" />
        <category android:name="android.intent.category.LAUNCHER" />
    </intent-filter>
</activity>

<activity android:name="ShareActivity" android:exported="true">
    <!-- This activity handles "SEND" actions with text data -->
    <intent-filter>
        <action android:name="android.intent.action.SEND"/>
        <category android:name="android.intent.category.DEFAULT"/>
        <data android:mimeType="text/plain"/>
    </intent-filter>
    <!-- This activity also handles "SEND" and "SEND_MULTIPLE" with media data -->
    <intent-filter>
        <action android:name="android.intent.action.SEND"/>
        <action android:name="android.intent.action.SEND_MULTIPLE"/>
        <category android:name="android.intent.category.DEFAULT"/>
        <data android:mimeType="application/vnd.google.panorama360+jpg"/>
        <data android:mimeType="image/*"/>
        <data android:mimeType="video/*"/>
    </intent-filter>
</activity>
```

**لماذا لازم `ACTION_MAIN` + `CATEGORY_LAUNCHER` يكونوا سوا؟** لأنو النص الأصلي يقول صراحة: "These two must be paired together in order for the activity to appear in the app launcher" — يعني كل وحدة لحالها ما كافية.

---

### 19. تحليل الـ Intent — Intent Resolution

#### النص الأصلي يقول (English):
> "When the system receives an implicit intent to start an activity, it searches for the best activity for the intent by comparing it to intent filters based on three aspects: Action, Data (both URI and data type), Category."

#### الشرح المبسّط:
لما النظام يستقبل implicit intent، بيقارنه مع كل الـ intent filters الموجودة عالجهاز عبر **3 اختبارات**: اختبار الـ Action، اختبار الـ Data، واختبار الـ Category. **لازم الـ Intent ينجح بالثلاثة اختبارات مع نفس الـ filter** حتى يُعتبر مطابق.

```algorithm
1 | مقارنة Action | النظام | فحص إذا الـ action موجود ضمن قائمة actions بالـ filter
2 | مقارنة Data | النظام | فحص تطابق الـ URI ونوع MIME مع ما هو معرّف بالـ filter
3 | مقارنة Category | النظام | فحص إذا كل category بالـ Intent موجودة ضمن الـ filter
4 | القرار | النظام | إذا نجح بالثلاثة → المكوّن مؤهّل؛ إذا تعدد المؤهلين → عرض Chooser
```

---

### 19.1 اختبار الـ Action (Action Test)

#### النص الأصلي يقول (English):
> "To pass this filter, the action specified in the Intent must match one of the actions listed in the filter. If the filter does not list any actions, there is nothing for an intent to match, so all intents fail the test. If an Intent does not specify an action, it passes the test as long as the filter contains at least one action."

#### الشرح المبسّط:

```xml
<intent-filter>
    <action android:name="android.intent.action.EDIT" />
    <action android:name="android.intent.action.VIEW" />
    ...
</intent-filter>
```

| الحالة | النتيجة |
| --- | --- |
| الـ Intent فيه action موجود بقائمة الـ filter | ✅ ينجح الاختبار |
| الـ filter ما فيه ولا action إطلاقاً | ❌ يفشل دائماً (ما في شي يتطابق معه) |
| الـ Intent ما فيه action محدد، بس الـ filter فيه action واحد ع الأقل | ✅ ينجح الاختبار |

> **مهم للامتحان ⚠️:**
> غياب الـ action من الـ Intent **لا يعني فشل تلقائي** — العكس هو الصحيح: الـ Intent بدون action دايماً بينجح باختبار Action طالما الـ filter فيه action واحد ع الأقل. اللي بيفشل دايماً هو الـ filter الفاضي من الـ actions.

---

### 19.2 اختبار الـ Category (Category Test)

#### النص الأصلي يقول (English):
> "For an intent to pass the category test, every category in the Intent must match a category in the filter. The reverse is not necessary... Therefore, an intent with no categories always passes this test."

#### الشرح المبسّط:

```xml
<intent-filter>
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    ...
</intent-filter>
```

القاعدة: **كل** category موجودة بالـ Intent لازم تكون موجودة أيضاً بالـ filter (لكن مو العكس — الـ filter ممكن يحوي categories أكتر من الـ Intent ويضل ينجح الاختبار).

**لماذا Intent بدون categories دايماً بينجح؟** لأنو ببساطة ما في شي لازم يتطابق — القاعدة بتفحص "كل category بالـ Intent"، وإذا القائمة فاضية أصلاً، الشرط محقق تلقائياً (بالمنطق: كل عنصر من مجموعة فاضية يحقق أي شرط).

#### 🔍 تتبع التنفيذ: مقارنة Category

**المدخل:** `Intent` بدون أي category vs `Intent` بـ `CATEGORY_BROWSABLE` فقط، ضد `filter` فيه `DEFAULT` و `BROWSABLE`.

| الخطوة | العملية | الحالة |
| --- | --- | --- |
| 1 | فحص Intent الأول (بدون category) | لا يوجد category ليُقارن → نجاح تلقائي |
| 2 | فحص Intent الثاني (BROWSABLE فقط) | BROWSABLE موجودة بالـ filter → نجاح |

**النتيجة:** كلا الـ Intent-ين ينجحان باختبار الـ Category مع هذا الـ filter.

---

### 19.3 اختبار الـ Data (Data Test)

#### النص الأصلي يقول (English):
> "Each `<data>` element can specify a URI structure and a data type (MIME media type)... Each of these attributes is optional in a `<data>` element, but there are linear dependencies: If a scheme is not specified, the host is ignored... If both the scheme and host are not specified, the path is ignored."

#### الشرح المبسّط:

```xml
<intent-filter>
    <data android:mimeType="video/mpeg" android:scheme="http" ... />
    <data android:mimeType="audio/mpeg" android:scheme="http" ... />
    ...
</intent-filter>
```

بنية الـ `<data>`:
```
android:scheme
android:host
android:port
android:path / pathPattern / pathPrefix
android:mimeType
```

بنية الـ URI الكاملة: `<scheme>://<host>:<port>/<path>`

**مثال:** `content://com.example.project:200/folder/subfolder/etc`
| الجزء | القيمة |
| --- | --- |
| scheme | content |
| host | com.example.project |
| port | 200 |
| path | folder/subfolder/etc |

#### ⚙️ الخطوات / الخوارزمية: اعتماديات أجزاء الـ URI

#### ما هدف هذه العملية؟
> فهم ترتيب اعتماد أجزاء الـ URI على بعضها البعض عند مطابقة الـ intent filter — حتى تعرف أي جزء "يُتجاهل" تلقائياً إذا غاب الجزء الأسبق منه.

```algorithm
1 | فحص scheme | النظام | إذا غير محدد → يتم تجاهل host تلقائياً
2 | فحص host | النظام | إذا غير محدد → يتم تجاهل port تلقائياً
3 | فحص scheme و host معاً | النظام | إذا كلاهما غير محددين → يتم تجاهل path تلقائياً
4 | مقارنة نهائية | النظام | تتم المقارنة فقط على الأجزاء المذكورة صراحة بالـ filter
```

#### نقاط التنفيذ:
- الترتيب إلزامي: `scheme → host → port → path` — كل جزء يعتمد وجوده المنطقي على الجزء الذي قبله.
- المقارنة تتم فقط على الأجزاء المُدرجة بالـ filter — أي جزء غير مذكور لا يُقارَن أصلاً.

> **الدرس المستفاد:**
> فهم هالاعتماديات مهم عملياً لما تكتب `intent-filter` مخصص لفتح روابط (deep links) — أي خطأ بترتيب تحديد `scheme/host/path` ممكن يخلّي الـ filter ما يشتغل متل ما تتوقع.

---

## الجزء الثاني: ملخص منظم شامل

### أهم التعاريف والمفاهيم

| المصطلح | التعريف | مثال/ملاحظة |
| --- | --- | --- |
| `Activity` | مكوّن يمثّل شاشة واحدة ونقطة دخول للتفاعل مع المستخدم | صندوق الوارد بتطبيق بريد |
| `Intent` | object رسالة لطلب تنفيذ إجراء من مكوّن آخر | `Intent(this, X::class.java)` |
| `Intent Filter` | إعلان بالـ manifest عن نوع النيّات (intents) القادرة الـ Activity تستقبلها | `<intent-filter>` |
| `Explicit Intent` | تحديد المكوّن الهدف بالاسم | تنقّل داخلي بنفس التطبيق |
| `Implicit Intent` | لا يحدد اسم المكوّن، يصف action عام | مشاركة نص لأي تطبيق مؤهّل |
| `Component Name` | ComponentName يحوي اسم الحزمة + اسم الـ class الكامل | `com.example.ExampleActivity` |
| `MIME Type` | نوع البيانات (مثل `text/plain`, `image/*`) | يساعد بتحديد أفضل مكوّن مستقبل |
| `Back Stack` | سجل الشاشات السابقة اللي فيها المستخدم | يتأثر بـ `FLAG_ACTIVITY_NO_HISTORY` |

### المكوّنات الرئيسية (مرجع سريع)

| الأداة | الوظيفة | ملاحظة |
| --- | --- | --- |
| `<activity>` | تصريح Activity بالـ manifest | `android:name` إلزامية |
| `<intent-filter>` | إعلان النيّات المقبولة | يحوي action/category/data |
| `<uses-permission>` | طلب إذن لاستدعاء Activity محمية | يجب مطابقة اسم الإذن بالضبط |
| `startActivity()` | إطلاق Intent لبدء Activity | يقبل explicit أو implicit intent |
| `Intent.createChooser()` | عرض نافذة اختيار تطبيق | مفيد عند تعدد المؤهلين |

### جداول مقارنات سريعة

| المقارنة | الأول | الثاني | الفرق |
| --- | --- | --- | --- |
| Explicit vs Implicit Intent | يحدد اسم المكوّن | لا يحدد اسم المكوّن، فقط action | التحكم مقابل المرونة |
| onPause() vs onStop() | لا يزال مرئياً جزئياً، ممنوع عمليات ثقيلة | غير مرئي كلياً، مسموح عمليات ثقيلة | درجة الظهور ونوع العمليات المسموحة |
| onDestroy() (إنهاء) vs onDestroy() (تدوير الشاشة) | تدمير نهائي | تدمير مؤقت يتبعه onCreate() جديد فوراً | استمرارية الـ Activity من عدمها |
| setData() vs setType() vs setDataAndType() | يحدد URI فقط | يحدد MIME type فقط | يحددان معاً بشكل صريح |

### قاموس المصطلحات

| الفئة | المصطلحات |
| --- | --- |
| دورة الحياة | `onCreate`, `onStart`, `onResume`, `onPause`, `onStop`, `onRestart`, `onDestroy` |
| Intent | `Component Name`, `Action`, `Data`, `Category`, `Extras`, `Flags` |
| Manifest | `<activity>`, `<intent-filter>`, `<action>`, `<category>`, `<data>`, `<uses-permission>` |
| Actions شائعة | `ACTION_MAIN`, `ACTION_VIEW`, `ACTION_SEND`, `ACTION_DIAL`, `ACTION_EDIT`, `ACTION_SENDTO` |
| Categories شائعة | `CATEGORY_DEFAULT`, `CATEGORY_LAUNCHER`, `CATEGORY_BROWSABLE` |

### أبرز النقاط الذهبية
1. الـ `Activity` بدون `intent-filter` ما فيها تنشغّل إلا بـ explicit intent.
2. `ACTION_MAIN` + `CATEGORY_LAUNCHER` لازم يكونوا مع بعض حتى تظهر الـ Activity بقائمة التطبيقات.
3. Intent بدون action ينجح باختبار Action إذا الـ filter فيه action واحد ع الأقل؛ لكن filter بدون actions يفشل دائماً.
4. Intent بدون categories ينجح دائماً باختبار Category بغض النظر عن الـ filter.
5. لا تحفظ بيانات أو تجري اتصالات شبكة بـ `onPause()` — هذا مكان `onStop()`.
6. عند دوران الشاشة، النظام يستدعي `onDestroy()` ثم فوراً `onCreate()` من جديد.
7. الأذونات (`permission`) يجب أن تتطابق تماماً بين الـ Activity المستدعية والـ Activity الهدف.

### الأخطاء الشائعة عند الطلاب ⚠️

| الخطأ | التصحيح |
| --- | --- |
| اعتقاد أن `onPause()` تعني نهاية الـ Activity | `onPause()` تعني فقط فقدان جزئي للتركيز، ليس تدميراً |
| حفظ بيانات المستخدم داخل `onPause()` | يجب حفظ البيانات الثقيلة أو استدعاءات قاعدة البيانات داخل `onStop()` |
| نسيان `CATEGORY_DEFAULT` بالـ intent filter | بدونها، الـ Activity لن تستقبل implicit intents عادية عبر `startActivity()` |
| الخلط بين `setData()` و `setDataAndType()` | `setData()` تمسح الـ MIME type المحدد سابقاً والعكس صحيح؛ استخدم `setDataAndType()` لتحديد الاثنين معاً بأمان |
| اعتبار أن `onDestroy()` تعني دائماً تدميراً نهائياً | قد تكون تدميراً مؤقتاً بسبب تغيير configuration مثل الدوران |

---

### خطوات وإجراءات المحاضرة

#### ⚙️ الخطوات / الخوارزمية: تصريح Activity جديدة بالـ Manifest
> الهدف: تمكين النظام من التعرف على Activity واستخدامها بأمان.
```algorithm
1 | فتح ملف AndroidManifest.xml | المطوّر | تحديد موقع عنصر <application>
2 | إضافة <activity> | المطوّر | تعريف android:name للـ Activity الجديدة
3 | (اختياري) إضافة intent-filter | المطوّر | تحديد action/category/data المدعومة
4 | (اختياري) إضافة permission | المطوّر | حماية الوصول من تطبيقات غير مصرح لها
```
#### نقاط التنفيذ:
- إذا لم تُضف intent-filter، لا يمكن استدعاء الـ Activity إلا بـ explicit intent فقط.

#### ⚙️ الخطوات / الخوارزمية: دورة حياة Activity كاملة من الإطلاق للإغلاق
> الهدف: فهم تسلسل استدعاء الـ callbacks من إنشاء الـ Activity حتى تدميرها.
```algorithm
1 | إطلاق Activity | النظام | استدعاء onCreate() ثم onStart() ثم onResume()
2 | مقاطعة جزئية (اتصال هاتفي مثلاً) | النظام | استدعاء onPause()
3 | عودة المستخدم | النظام | استدعاء onResume() مجدداً
4 | اختفاء كامل (Activity أخرى تغطي الشاشة) | النظام | استدعاء onStop()
5 | عودة المستخدم من جديد | النظام | استدعاء onRestart() ثم onStart() ثم onResume()
6 | إنهاء المستخدم للـ Activity | النظام | استدعاء onPause() ثم onStop() ثم onDestroy()
```
#### نقاط التنفيذ:
- onRestart() دائماً متبوعة بـ onStart()، وليس بـ onResume() مباشرة.
- لا تعتمد أبداً على ترتيب زمني دقيق لـ onStop()/onDestroy() عند تغييرات النظام المفاجئة (kill process).

#### ⚙️ الخطوات / الخوارزمية: عملية Intent Resolution الكاملة
> الهدف: تحديد كيف يختار النظام أفضل Activity لتلبية implicit intent.
```algorithm
1 | استقبال implicit intent | النظام | لا يوجد component name محدد
2 | تطبيق اختبار Action | النظام | البحث عن تطابق ضمن جميع intent filters
3 | تطبيق اختبار Category | النظام | التأكد أن كل category بالـ Intent موجودة بالـ filter
4 | تطبيق اختبار Data | النظام | مطابقة URI/MIME type حسب الاعتماديات الخطية
5 | اتخاذ القرار | النظام | تشغيل المكوّن الوحيد المطابق، أو عرض Chooser عند تعدد المطابقات
```
#### نقاط التنفيذ:
- فشل أي اختبار واحد من الثلاثة يعني استبعاد الـ filter بالكامل.
- Intent بدون action لا يفشل تلقائياً؛ لكن filter بدون أي action يفشل دائماً.

---

### أنماط الأكواد والبنى المتكررة

| النمط | البنية الأساسية | متى تستخدمه |
| --- | --- | --- |
| بناء Intent عبر apply | `Intent().apply { action = ...; data = ...; putExtra(...) }` | عند الحاجة لتهيئة عدة خصائص دفعة واحدة |
| Intent صريح بمُنشئ مباشر | `Intent(this, TargetActivity::class.java)` | تنقّل داخل نفس التطبيق |
| Intent ضمني بـ action فقط | `Intent(Intent.ACTION_VIEW, uri)` | طلب خدمة عامة من أي تطبيق مؤهّل |
| استخدام Chooser | `Intent.createChooser(intent, "title")` | إجبار عرض قائمة اختيار حتى لو فيه تطبيق افتراضي |

### أنماط التعامل والسلوك

| السيناريو | التعامل الصحيح | لماذا؟ |
| --- | --- | --- |
| تطبيق فيديو والمستخدم بدّل لتطبيق آخر | إيقاف الفيديو وقطع الاتصال بالشبكة ضمن onPause()/onStop() حسب الحالة | توفير موارد النظام والبطارية |
| حفظ بيانات نموذج (form) طويل | استخدام onStop() أو ViewModel وليس onPause() | onPause() لا يضمن وقتاً كافياً للعمليات الثقيلة |
| مشاركة نص لأي تطبيق بريد | استخدام implicit intent بـ ACTION_SEND | يمنح المستخدم حرية اختيار التطبيق المناسب |
| استدعاء Activity حساسة (مثل الدفع) | استخدام permission مطابق بين المستدعي والمستهدف | حماية أمنية من استدعاءات غير مصرح بها |

### الأفكار الرئيسية الشاملة
الفكرة المحورية بهذه المحاضرة هي أن أندرويد نظام **موزّع المكوّنات**: كل `Activity` مستقلة بذاتها، ولا تستطيع "استدعاء" أخرى مباشرة بالطريقة العادية بلغات البرمجة (استدعاء دالة)، بل يجب أن تمر عبر النظام باستخدام `Intent` — سواء كانت الوجهة معروفة (`explicit`) أو غير معروفة (`implicit`). هذا التصميم هو ما يسمح بتكامل التطبيقات المختلفة على نفس الجهاز (مشاركة، فتح روابط، اختيار تطبيق بريد...) دون أن يعرف كل تطبيق تفاصيل التطبيقات الأخرى.

---

## الجزء الثالث: أسئلة اختيار من متعدد (MCQ)

> **16 سؤالاً** — مستوى: medium / hard. التوزيع: مقارنات 25% | سيناريو كود 35% | تطبيق 40%.

### السؤال 1 (medium)
Which callback is invoked immediately after `onCreate()` completes, making the activity visible but not yet interactive?
أ) `onResume()`  ب) `onStart()`  ج) `onRestart()`  د) `onPause()`
**الإجابة الصحيحة: ب**
**التعليل:** بعد `onCreate()` مباشرة، الـ Activity تدخل حالة Started ويُستدعى `onStart()` — تصبح مرئية لكن ليست تفاعلية بعد. `onResume()` (أ) هي الخطوة اللي بعدها مباشرة وليست الأولى. `onRestart()` (ج) تُستدعى فقط عند العودة من حالة Stopped، وليست بعد أول `onCreate()`. `onPause()` (د) تحدث عند فقدان التركيز لاحقاً، لا في بداية دورة الحياة.

---

### السؤال 2 (medium)
Which of the following statements about `onPause()` is TRUE according to the lecture?
أ) It is safe to perform database transactions inside `onPause()`.
ب) `onPause()` always means the activity is being destroyed.
ج) `onPause()` execution does not necessarily offer enough time to perform save operations.
د) `onPause()` is called before `onCreate()`.
**الإجابة الصحيحة: ج**
**التعليل:** النص الأصلي يقول صراحة إنو تنفيذ `onPause()` ما بيضمن وقت كافي لعمليات الحفظ. الخيار (أ) خاطئ لأن النص ينهى صراحة عن معاملات قاعدة البيانات بـ `onPause()`. الخيار (ب) خاطئ لأن `onPause()` قد تكون مؤقتة والـ Activity ترجع لـ `onResume()`. الخيار (د) خاطئ لأن `onPause()` تأتي دائماً بعد `onResume()` وليس قبل `onCreate()`.

---

### السؤال 3 (hard)
An activity in the Stopped state is about to return to interact with the user. What is the correct callback sequence?
أ) `onResume()` → `onStart()`
ب) `onRestart()` → `onStart()` → `onResume()`
ج) `onCreate()` → `onStart()` → `onResume()`
د) `onStart()` → `onRestart()` → `onResume()`
**الإجابة الصحيحة: ب**
**التعليل:** النص يوضح أن `onRestart()` تُستدعى دائماً وتتبعها `onStart()`، ثم بشكل طبيعي `onResume()`. الخيار (أ) ناقص خطوة `onRestart()`. الخيار (ج) خاطئ لأن `onCreate()` تُستدعى فقط عند إنشاء Activity جديدة كلياً وليس عند العودة من Stopped. الخيار (د) يعكس الترتيب الصحيح بين `onStart()` و`onRestart()`.

---

### السؤال 4 (medium)
Which manifest element is required (and only required attribute) to declare an activity?
أ) `<activity android:permission="..." />`
ب) `<activity android:name="..." />`
ج) `<activity android:exported="..." />`
د) `<activity android:theme="..." />`
**الإجابة الصحيحة: ب**
**التعليل:** النص يذكر صراحة أن `android:name` هي الخاصية الوحيدة الإلزامية لعنصر `<activity>`. باقي الخيارات (permission، exported، theme) خصائص اختيارية إضافية تضاف حسب الحاجة.

---

### السؤال 5 (hard)
A developer wants an activity to NOT be accessible by any other app on the device. What is the correct approach?
أ) Add multiple `<intent-filter>` elements with restrictive categories.
ب) Do not declare any `<intent-filter>` for that activity, and start it only via explicit intents.
ج) Set `android:mimeType` to a private value.
د) Use `ACTION_MAIN` without `CATEGORY_LAUNCHER`.
**الإجابة الصحيحة: ب**
**التعليل:** النص يذكر صراحة: الـ Activities غير المرغوب مشاركتها يجب ألا تحتوي على أي intent filter، وتُشغَّل فقط عبر explicit intent من داخل التطبيق نفسه. الخيار (أ) عكس المطلوب لأن أي intent filter يفتح إمكانية الاستقبال. (ج) و(د) لا يمنعان الوصول الخارجي فعلياً.

---

### السؤال 6 (medium)
What distinguishes an explicit intent from an implicit intent?
أ) Explicit intents cannot carry extras.
ب) Explicit intents specify a full `ComponentName`; implicit intents declare a general action instead.
ج) Implicit intents can only be used within the same app.
د) Explicit intents require a `Chooser` dialog.
**الإجابة الصحيحة: ب**
**التعليل:** هذا هو التعريف المباشر من النص. الخيار (أ) خاطئ لأن الـ extras مستقلة عن نوع الـ Intent. (ج) عكس الصحيح — implicit intents هي اللي بتسمح بالتواصل بين تطبيقات مختلفة. (د) خاطئ لأن الـ Chooser يظهر فقط عند تعدد المطابقات لـ implicit intent، وليس دائماً مع explicit intent.

---

### السؤال 7 (hard)
Given the following code:
```kotlin
val intent = Intent().apply {
    action = Intent.ACTION_SEND
    type = "text/plain"
    putExtra(Intent.EXTRA_TEXT, "Hello")
}
startActivity(intent)
```
What kind of intent is this, and why?
أ) Explicit — because a component name is set via `apply`.
ب) Implicit — because no component name (`ComponentName`) is specified; only action and data type are set.
ج) Explicit — because `ACTION_SEND` always targets a fixed system activity.
د) Implicit — because `putExtra()` was used.
**الإجابة الصحيحة: ب**
**التعليل:** الكود لا يحدد أي `ComponentName` (لا يوجد `Intent(this, X::class.java)`)، بل يحدد فقط action و type، وهذا بالضبط تعريف implicit intent. (أ) و(ج) خاطئان لعدم وجود تحديد لمكوّن. (د) خاطئ لأن `putExtra()` لا علاقة له بتحديد نوع الـ Intent (صريح/ضمني) أساساً.

---

### السؤال 8 (medium)
Which two elements must be paired together in an intent filter for an activity to appear in the system's app launcher?
أ) `ACTION_VIEW` + `CATEGORY_DEFAULT`
ب) `ACTION_SEND` + `CATEGORY_BROWSABLE`
ج) `ACTION_MAIN` + `CATEGORY_LAUNCHER`
د) `ACTION_EDIT` + `CATEGORY_DEFAULT`
**الإجابة الصحيحة: ج**
**التعليل:** النص يوضح صراحة أن هذين العنصرين يجب أن يكونا معاً حتى تظهر الـ Activity في قائمة تطبيقات الجهاز. باقي التوليفات مخصصة لأغراض أخرى (مشاركة، فتح روابط، تعديل بيانات) وليست لظهور التطبيق بقائمة اللانشر.

---

### السؤال 9 (hard)
An intent filter declares no `<action>` elements at all. What happens during the action test?
أ) All intents automatically pass, since no action is required.
ب) All intents fail, because there is nothing for the intent to match.
ج) Only intents without an action pass.
د) The system throws a compile-time error.
**الإجابة الصحيحة: ب**
**التعليل:** النص يقول صراحة: إذا الـ filter ما فيه أي action مُدرج، ما في شي يتطابق معه، فكل الـ intents تفشل هالاختبار — حتى الـ Intent اللي بدون action أصلاً. (أ) و(ج) عكس القاعدة الصحيحة تماماً. (د) لا علاقة له؛ هذا فحص وقت التشغيل وليس compile-time.

---

### السؤال 10 (medium)
For the category test, what must be true for an intent to pass?
أ) Every category in the filter must exist in the intent.
ب) Every category in the intent must exist in the filter.
ج) The intent must have exactly one category.
د) The filter must not have more categories than the intent.
**الإجابة الصحيحة: ب**
**التعليل:** القاعدة بالنص الأصلي هي أن كل category موجودة بالـ Intent يجب أن تطابق category موجودة بالـ filter — وليس العكس. (أ) يعكس الاتجاه الصحيح. (ج) و(د) غير مذكورين وغير صحيحين؛ الفلتر يمكن أن يحتوي فئات أكثر من الـ Intent دون مشكلة.

---

### السؤال 11 (hard)
An intent has no categories at all. What is the outcome of the category test against any filter?
أ) It always fails, since there's nothing to compare.
ب) It always passes, regardless of what categories the filter declares.
ج) It passes only if the filter also has no categories.
د) It depends on the action test result.
**الإجابة الصحيحة: ب**
**التعليل:** النص يوضح: intent بدون categories ينجح دائماً باختبار Category بغض النظر عما يعلنه الـ filter — لأن الشرط "كل category بالـ intent موجودة بالفلتر" محقق تلقائياً عندما تكون قائمة الـ intent فارغة. باقي الخيارات تتعارض مع هذه القاعدة الصريحة.

---

### السؤال 12 (medium)
In the URI `content://com.example.project:200/folder/subfolder/etc`, what is the `host`?
أ) `content`
ب) `com.example.project`
ج) `200`
د) `folder/subfolder/etc`
**الإجابة الصحيحة: ب**
**التعليل:** حسب بنية `<scheme>://<host>:<port>/<path>` الموضحة بالنص، `content` هو الـ scheme، `com.example.project` هو الـ host، `200` هو الـ port، و`folder/subfolder/etc` هو الـ path.

---

### السؤال 13 (hard)
If a `<data>` element does not specify a `scheme`, what happens to the `host` attribute?
أ) It becomes mandatory instead.
ب) It is ignored.
ج) It defaults to `"content"`.
د) The filter becomes invalid.
**الإجابة الصحيحة: ب**
**التعليل:** النص يوضح اعتمادية خطية صريحة: إذا لم يُحدد الـ scheme، يُتجاهل الـ host تلقائياً (وبالتسلسل، إذا لم يُحدد الـ host، يُتجاهل الـ port، وإذا لم يُحدد كلاهما، يُتجاهل الـ path). لا يوجد قيمة افتراضية مذكورة (ج)، ولا يصبح إلزامياً (أ)، ولا يبطل الفلتر (د).

---

### السؤال 14 (medium)
Which method sets BOTH the URI and the MIME type of an Intent explicitly in a single call?
أ) `setData()`
ب) `setType()`
ج) `setDataAndType()`
د) `putExtra()`
**الإجابة الصحيحة: ج**
**التعليل:** `setDataAndType()` مصمم خصيصاً لتحديد الاثنين معاً بشكل صريح وآمن. `setData()` (أ) تحدد الـ URI فقط، `setType()` (ب) تحدد الـ MIME type فقط، وقد تُلغي إحداهما الأخرى إن استُخدمتا منفصلتين. `putExtra()` (د) غير متعلقة بالـ URI أو الـ MIME type أساساً، بل بإضافة بيانات إضافية.

---

### السؤال 15 (hard)
Consider a device rotation while an activity is in the foreground. What is the correct sequence of events?
أ) `onPause()` → `onStop()` only; the activity resumes without recreation.
ب) `onDestroy()` is called, then the system immediately creates a new activity instance and calls `onCreate()` on it.
ج) The activity is permanently destroyed and the app closes.
د) Only `onRestart()` is called, skipping `onCreate()`.
**الإجابة الصحيحة: ب**
**التعليل:** النص يوضح صراحة أن `onDestroy()` قد تُستدعى بسبب تغيير configuration (مثل الدوران)، وفوراً بعدها ينشئ النظام instance جديدة ويستدعي `onCreate()` عليها بالتهيئة الجديدة. (أ) غير صحيح لأنه يتجاهل حدوث تدمير فعلي مؤقت. (ج) مبالغة غير صحيحة — هذا تدمير مؤقت وليس إغلاق التطبيق. (د) خاطئ لأن `onRestart()` خاصة بالعودة من Stopped، وليس بتغييرات configuration.

---

### السؤال 16 (hard)
Which flag ensures an activity is NOT kept in the back stack once the user leaves it?
أ) `FLAG_DEBUG_LOG_RESOLUTION`
ب) `FLAG_ACTIVITY_NO_HISTORY`
ج) `CATEGORY_DEFAULT`
د) `EXTRA_TEXT`
**الإجابة الصحيحة: ب**
**التعليل:** `FLAG_ACTIVITY_NO_HISTORY` هو المذكور صراحة بالنص لهذا الغرض بالضبط. `FLAG_DEBUG_LOG_RESOLUTION` (أ) لأغراض تصحيح الأخطاء فقط ولا علاقة له بالـ back stack. (ج) و(د) ليسا من نوع الـ Flags أصلاً، بل category و extra key على التوالي.

---

## الجزء الرابع: أسئلة تصحيح الكود

> Cover error types: compilation, logic, return_check, dead code, misconception.

### Debug Question 1

**The following code contains a bug:**
```kotlin
override fun onCreate(savedInstanceState: Bundle?) {
    setupUI()
    super.onCreate(savedInstanceState)
}
```
**Find the bug:** `super.onCreate()` should generally be called before other setup logic that may depend on the base class initialization; calling it after `setupUI()` risks running UI setup before the activity is properly initialized by the system.

**Fixed code:**
```kotlin
override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setupUI()
}
```
**شرح الحل:**
1. `super.onCreate(savedInstanceState)` يجب أن يُستدعى أولاً حتى تكتمل التهيئة الأساسية للنظام قبل تنفيذ أي منطق خاص بك.
2. استدعاؤه بعد `setupUI()` (كما بالكود الخاطئ) هو خطأ من نوع `misconception` — سوء فهم لترتيب التنفيذ الصحيح ضمن lifecycle callbacks.

---

### Debug Question 2

**The following code contains a bug:**
```kotlin
val sendIntent = Intent().apply {
    action = Intent.ACTION_SEND
    putExtra(Intent.EXTRA_TEXT, textMessage)
}
startActivity(sendIntent)
```
**Find the bug:** The `type` (MIME type) is never set. Without a MIME type, the Android system may fail to resolve the correct target activity for a `SEND` action expecting text data.

**Fixed code:**
```kotlin
val sendIntent = Intent().apply {
    action = Intent.ACTION_SEND
    type = "text/plain"
    putExtra(Intent.EXTRA_TEXT, textMessage)
}
startActivity(sendIntent)
```
**شرح الحل:**
1. الـ MIME type ضروري حتى يقدر النظام يحدد المكوّنات المؤهّلة لاستقبال بيانات نصية تحديداً.
2. هذا خطأ من نوع `logic` — الكود يعمل تركيبياً (compiles) لكنه غير مكتمل منطقياً لتحقيق الهدف المطلوب.

---

### Debug Question 3

**The following code contains a bug:**
```kotlin
override fun onPause() {
    super.onPause()
    saveDataToDatabase() // heavy database write operation
}
```
**Find the bug:** Performing a heavy database transaction inside `onPause()` violates the lecture's explicit rule — `onPause()` execution does not guarantee enough time for save operations.

**Fixed code:**
```kotlin
override fun onStop() {
    super.onStop()
    saveDataToDatabase() // heavy database write operation
}
```
**شرح الحل:**
1. العمليات الثقيلة زي الكتابة بقاعدة البيانات لازم تنتقل لـ `onStop()` بدل `onPause()`.
2. هذا خطأ من نوع `misconception` — فهم خاطئ شائع لمكان تنفيذ عمليات الحفظ الثقيلة ضمن دورة الحياة.

---

### Debug Question 4

**The following code contains a bug:**
```xml
<activity android:name="MainActivity" android:exported="true">
    <intent-filter>
        <action android:name="android.intent.action.MAIN" />
    </intent-filter>
</activity>
```
**Find the bug:** The `<category android:name="android.intent.category.LAUNCHER" />` element is missing. `ACTION_MAIN` alone is not sufficient for the activity to appear in the app launcher.

**Fixed code:**
```xml
<activity android:name="MainActivity" android:exported="true">
    <intent-filter>
        <action android:name="android.intent.action.MAIN" />
        <category android:name="android.intent.category.LAUNCHER" />
    </intent-filter>
</activity>
```
**شرح الحل:**
1. النص الأصلي يوضح إنو `ACTION_MAIN` و `CATEGORY_LAUNCHER` لازم يكونوا سوا حتى تظهر الـ Activity بقائمة اللانشر.
2. هذا خطأ من نوع `dead_code` جزئياً — الـ intent-filter موجود لكنه غير فعّال بالكامل لتحقيق الهدف المرجو (ظهور بالقائمة).

---

### Debug Question 5

**The following code contains a bug:**
```kotlin
val intent = Intent(Intent.ACTION_VIEW).apply {
    setData(Uri.parse("content://media/external/images/media/100"))
    setType("image/jpeg")
}
startActivity(intent)
```
**Find the bug:** Calling `setData()` and then `setType()` separately is a logic error — each call clears the value set by the other internally in the Android framework, potentially causing the intent to lose either its URI or its MIME type.

**Fixed code:**
```kotlin
val intent = Intent(Intent.ACTION_VIEW).apply {
    setDataAndType(
        Uri.parse("content://media/external/images/media/100"),
        "image/jpeg"
    )
}
startActivity(intent)
```
**شرح الحل:**
1. لازم تستخدم `setDataAndType()` عندما بدك تحدد الاثنين (URI و MIME type) معاً بأمان دون فقدان أي منهما.
2. هذا خطأ من نوع `logic` — الكود يبدو صحيحاً ظاهرياً لكنه ينتج سلوكاً غير متوقع بسبب آلية عمل الدوال الداخلية.

---

### Debug Question 6

**The following code contains a bug:**
```kotlin
override fun onDestroy() {
    releaseAllResources()
}
```
**Find the bug:** `super.onDestroy()` is never called, which breaks the required lifecycle chain and can cause the system to not properly clean up the activity's internal state.

**Fixed code:**
```kotlin
override fun onDestroy() {
    super.onDestroy()
    releaseAllResources()
}
```
**شرح الحل:**
1. أي override لدوال دورة الحياة لازم يستدعي نسخة الأب (`super`) — وهذا مذكور بكل أمثلة الكود بالمحاضرة.
2. هذا خطأ من نوع `return_check` بمعنى موسّع — إغفال استدعاء إلزامي (missing required call) يُعتبر خطأ بنيوي بنفس فئة إغفال التحقق من نتيجة عملية إلزامية.

---

## الجزء الرابع: تمارين إضافية (من إعداد الدليل للتدريب)

> **هذه تمارين إضافية من إعداد الدليل للتدريب** — ليست في المحاضرة الأصلية.

### Exercise 1: Complete the Manifest — fill_gaps

**Scenario / Task:**
You are building a photo-viewing app. You want `PhotoActivity` to be launchable both from within your app and by any other app that wants to display a JPEG image.

**Requirements:**
1. Fill in the missing intent filter to make `PhotoActivity` accept implicit intents for viewing JPEG images.
```xml
<activity android:name=".PhotoActivity" android:exported="true">
    <intent-filter>
        <action android:name="_______" />
        <category android:name="_______" />
        <data android:mimeType="_______" />
    </intent-filter>
</activity>
```

**نموذج الحل:**
```xml
<activity android:name=".PhotoActivity" android:exported="true">
    <intent-filter>
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <data android:mimeType="image/jpeg" />
    </intent-filter>
</activity>
```
الشرح: `ACTION_VIEW` مناسب لأنو الهدف عرض معلومة موجودة (صورة). `CATEGORY_DEFAULT` إلزامية حتى تستقبل implicit intents عادية. `image/jpeg` يحدد نوع البيانات المطلوب بدقة.

---

### Exercise 2: Build an explicit Intent — code_fix

**Scenario / Task:**
Write Kotlin code to explicitly start `SettingsActivity` from `MainActivity`, passing a boolean extra `"dark_mode"` set to `true`.

**Requirements:**
1. Use `Intent` constructor with component name.
2. Add the extra using `putExtra()`.
3. Call `startActivity()`.

**نموذج الحل:**
```kotlin
val intent = Intent(this, SettingsActivity::class.java).apply {
    putExtra("dark_mode", true)
}
startActivity(intent)
```
الشرح: استخدمنا الـ constructor `Intent(this, SettingsActivity::class.java)` لأنو الهدف معروف بالضبط (explicit intent)، وأضفنا الـ extra بمفتاح مخصص "dark_mode" بقيمة boolean، ثم أطلقنا الـ Activity.

---

### Exercise 3: Predict lifecycle output — scenario

**Scenario / Task:**
A user opens `Activity A`, then navigates to `Activity B` which covers the entire screen. List the lifecycle callbacks invoked on `Activity A`, in order.

**Requirements:**
1. List only the callbacks affecting Activity A (not B).

**نموذج الحل:**
`onPause()` ثم `onStop()`.
الشرح: لما تفتح Activity B وتغطي كامل الشاشة، الـ Activity A بتفقد التركيز أولاً (`onPause()`)، وبما إنها صارت غير مرئية بالكامل، بتنتقل مباشرة لـ (`onStop()`). ما في استدعاء لـ `onDestroy()` لأنو المستخدم ممكن يرجع لها عبر الزر Back.

---

### Exercise 4: Fix the permission mismatch — code_fix

**Scenario / Task:**
`AppB` defines an activity requiring the permission `com.example.appb.permission.ACCESS_DATA`. `AppA` wants to launch it but forgot to declare the permission. Fix `AppA`'s manifest snippet.

**Requirements:**
1. Add the correct `<uses-permission>` element.
```xml
<!-- AppA manifest — missing something -->
<manifest>
    <application>
        ...
    </application>
</manifest>
```

**نموذج الحل:**
```xml
<manifest>
    <uses-permission android:name="com.example.appb.permission.ACCESS_DATA"/>
    <application>
        ...
    </application>
</manifest>
```
الشرح: لازم اسم الإذن بـ `<uses-permission>` بتطبيق AppA يطابق تماماً الاسم المحدد بـ `android:permission` بتطبيق AppB، وإلا يفشل الاستدعاء.

---

### Exercise 5: Choose the right MIME-related method — scenario

**Scenario / Task:**
You need to create an intent that shares both an image URI and specifies it's a `image/png`, in a single safe call.

**Requirements:**
1. Name the correct method to use and explain why not to use two separate calls.

**نموذج الحل:**
الدالة الصحيحة هي `setDataAndType(uri, "image/png")`.
الشرح: استخدام `setData()` و `setType()` بشكل منفصل خطر لأن كل استدعاء قد يمسح القيمة التي حددها الاستدعاء الآخر داخلياً؛ لذلك `setDataAndType()` مصممة خصيصاً لضمان تعيين الاثنين معاً بأمان بنفس اللحظة.

---

### Exercise 6: Data test walk-through — scenario

**Scenario / Task:**
An intent filter declares `<data android:scheme="https" android:host="example.com" />` with no `path`. An incoming intent has the URI `https://example.com/articles/5`. Does it pass the data test? Explain using the linear dependency rule.

**Requirements:**
1. State pass/fail and justify.

**نموذج الحل:**
نعم، ينجح اختبار الـ Data.
الشرح: بما أنو الـ filter ما حدد `path`، فإنو غير مأخوذ بعين الاعتبار أصلاً بالمقارنة (حسب قاعدة الاعتمادية الخطية: المقارنة تتم فقط على الأجزاء المذكورة صراحة). النظام بس بيقارن `scheme` (https = https ✅) و `host` (example.com = example.com ✅)، وكلاهما متطابقان، فينجح الاختبار بغض النظر عن باقي مسار الرابط.

---

## الجزء الرابع: تمارين تتبع التنفيذ

### Trace Exercise 1: Lifecycle callbacks during a phone call

**Input:**
```
User is actively using MyActivity (Resumed state).
Event 1: Incoming phone call interrupts the app.
Event 2: User declines the call and returns to MyActivity.
```

**Trace step by step (complete the table):**
| الخطوة | العملية | الحالة |
| --- | --- | --- |
| 1 | حالة البداية | ؟ |
| 2 | استقبال المكالمة (Event 1) | ؟ |
| 3 | رفض المكالمة والعودة (Event 2) | ؟ |

**نموذج الحل:**
| الخطوة | العملية | الحالة |
| --- | --- | --- |
| 1 | حالة البداية | Resumed — `onResume()` نُفّذت مسبقاً |
| 2 | استقبال المكالمة (Event 1) | Paused — يُستدعى `onPause()` لأن التركيز انتقل جزئياً للمكالمة |
| 3 | رفض المكالمة والعودة (Event 2) | Resumed مجدداً — يُستدعى `onResume()` لأن الـ Activity لم تختفِ بالكامل، فلا حاجة لـ onRestart/onStart |

**Result:** Only `onPause()` then `onResume()` are called; the activity never leaves the visible range since the phone call did not cover the entire screen for the full duration described.

---

### Trace Exercise 2: Intent Resolution for a SEND action

**Input:**
```kotlin
val intent = Intent().apply {
    action = Intent.ACTION_SEND
    type = "text/plain"
}
```
Filters available on device:
```
Filter 1: action=SEND, category=DEFAULT, data mimeType=text/plain
Filter 2: action=VIEW, category=DEFAULT, data mimeType=text/plain
Filter 3: action=SEND, category=DEFAULT, data mimeType=image/*
```

**Trace step by step (complete the table):**
| الخطوة | العملية | الحالة |
| --- | --- | --- |
| 1 | اختبار Action مقابل Filter 1 | ؟ |
| 2 | اختبار Action مقابل Filter 2 | ؟ |
| 3 | اختبار Data مقابل Filter 1 و Filter 3 | ؟ |

**نموذج الحل:**
| الخطوة | العملية | الحالة |
| --- | --- | --- |
| 1 | اختبار Action مقابل Filter 1 | ينجح — SEND = SEND |
| 2 | اختبار Action مقابل Filter 2 | يفشل — SEND ≠ VIEW، فيُستبعد Filter 2 كلياً |
| 3 | اختبار Data مقابل Filter 1 و Filter 3 | Filter 1 ينجح (text/plain = text/plain)؛ Filter 3 يفشل (text/plain ≠ image/*) |

**Result:** Only Filter 1 matches all three tests (action, category via CATEGORY_DEFAULT default handling, and data). The system starts the component associated with Filter 1 directly, since it is the sole match.

---

### Trace Exercise 3: Category test with multiple categories

**Input:**
```kotlin
val intent = Intent(Intent.ACTION_SEND).apply {
    type = "text/plain"
    addCategory("custom.category.A")
    addCategory(Intent.CATEGORY_DEFAULT)
}
```
Filter:
```
action=SEND, category=DEFAULT only, data mimeType=text/plain
```

**Trace step by step (complete the table):**
| الخطوة | العملية | الحالة |
| --- | --- | --- |
| 1 | فحص category "custom.category.A" ضمن الـ filter | ؟ |
| 2 | فحص category CATEGORY_DEFAULT ضمن الـ filter | ؟ |
| 3 | القرار النهائي لاختبار Category | ؟ |

**نموذج الحل:**
| الخطوة | العملية | الحالة |
| --- | --- | --- |
| 1 | فحص category "custom.category.A" ضمن الـ filter | غير موجودة بالـ filter → فشل جزئي |
| 2 | فحص category CATEGORY_DEFAULT ضمن الـ filter | موجودة → نجاح جزئي |
| 3 | القرار النهائي لاختبار Category | فشل كامل — لأن القاعدة تتطلب أن **كل** category بالـ Intent تكون موجودة بالـ filter، وواحدة منها (custom.category.A) غير موجودة |

**Result:** The intent fails the category test against this filter, even though `CATEGORY_DEFAULT` matched, because every category in the intent must match — not just one.

---

## الجزء الرابع: أسئلة تصميم

### Design Question 1: Activity Lifecycle Diagram

**Task:**
Draw (as a diagram description) the six core lifecycle callbacks plus `onRestart()`, showing the correct transitions between `Created`, `Started`, `Resumed`, `Paused`, `Stopped`, and `Destroyed` states, including the path back from `Stopped` to `Started`.

**نموذج الإجابة:**

#### وصف العُقد:
| # | العُقدة | النوع `kind` | الشرح |
| --- | --- | --- | --- |
| 1 | onCreate | process | إنشاء الـ Activity لأول مرة |
| 2 | onStart | process | تصبح مرئية |
| 3 | onResume | process | تصبح تفاعلية بالمقدمة |
| 4 | onPause | process | فقدان جزئي للتركيز |
| 5 | onStop | process | تصبح غير مرئية كلياً |
| 6 | onRestart | process | تحضير للعودة من Stopped |
| 7 | onDestroy | process | تدمير نهائي أو مؤقت |

```diagram
type: flowchart
title: Activity Lifecycle
direction: TD
nodes:
  - id: create
    label: onCreate()
    kind: process
    level: 0
  - id: start
    label: onStart()
    kind: process
    level: 1
  - id: resume
    label: onResume()
    kind: process
    level: 2
  - id: pause
    label: onPause()
    kind: process
    level: 3
  - id: stop
    label: onStop()
    kind: process
    level: 4
  - id: restart
    label: onRestart()
    kind: process
    level: 3
  - id: destroy
    label: onDestroy()
    kind: event
    level: 5
edges:
  - from: create
    to: start
  - from: start
    to: resume
  - from: resume
    to: pause
  - from: pause
    to: resume
  - from: pause
    to: stop
  - from: stop
    to: restart
  - from: restart
    to: start
  - from: stop
    to: destroy
```

**معايير التقييم:**
- تحديد كل حالة (Created/Started/Resumed/Paused/Stopped/Destroyed) بشكل صحيح.
- توضيح المسار الدائري بين Paused و Resumed (عودة التركيز بدون المرور بباقي الحالات).
- توضيح إنو onRestart دايماً متبوعة بـ onStart وليس onResume مباشرة.

---

### Design Question 2: Intent Filter for a URL-handling app — uml_design

**Task:**
Design (describe in table/schema form) the intent filter elements needed for an activity that opens links starting with `https://mystore.com/product/` and displays product details, ensuring it's browsable from any web browser.

**نموذج الإجابة:**

| العنصر | القيمة | السبب |
| --- | --- | --- |
| `<action>` | `android.intent.action.VIEW` | لأن الهدف عرض معلومة موجودة (تفاصيل منتج) |
| `<category>` (1) | `android.intent.category.DEFAULT` | ضرورية لاستقبال implicit intents العادية |
| `<category>` (2) | `android.intent.category.BROWSABLE` | ضرورية حتى يقدر متصفح الويب يفتح هالرابط |
| `<data android:scheme>` | `https` | مطابقة بروتوكول الرابط |
| `<data android:host>` | `mystore.com` | مطابقة النطاق المستهدف فقط |
| `<data android:pathPrefix>` | `/product/` | حصر التطابق على روابط المنتجات فقط |

```xml
<activity android:name=".ProductDetailActivity" android:exported="true">
    <intent-filter>
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data
            android:scheme="https"
            android:host="mystore.com"
            android:pathPrefix="/product/" />
    </intent-filter>
</activity>
```

**معايير التقييم:**
- وجود `CATEGORY_BROWSABLE` بالإضافة لـ `CATEGORY_DEFAULT` (نقطة أساسية غالباً ينساها الطلاب).
- الترتيب الصحيح للاعتماديات: scheme محدد → host محدد → path محدد (بما يتوافق مع قاعدة الاعتمادية الخطية).
- استخدام `pathPrefix` بدل `path` الثابت لدعم مسارات متعددة (`/product/123`, `/product/456`...).

---

## الجزء الخامس: الكود النهائي الكامل (مرجع شامل)

```kotlin
// ===== Full Activity Lifecycle Reference =====
class ExampleActivity : Activity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // One-time startup logic: associate ViewModel, init class-scope variables
    }

    override fun onStart() {
        super.onStart()
        // Initialize UI-maintaining code; activity becomes visible
    }

    override fun onResume() {
        super.onResume()
        // Re-initialize components released in onPause(); activity is now interactive
    }

    override fun onPause() {
        super.onPause()
        // Pause/adjust lightweight operations; release sensors (e.g., GPS)
        // DO NOT save data, make network calls, or run DB transactions here
    }

    override fun onStop() {
        super.onStop()
        // Release resources not needed while invisible
        // Perform CPU-intensive shutdown operations here (e.g., save to database)
    }

    override fun onRestart() {
        super.onRestart()
        // Restore state saved when activity was stopped; always followed by onStart()
    }

    override fun onDestroy() {
        super.onDestroy()
        // Release all remaining resources not released in onStop()
    }
}

// ===== Explicit Intent =====
val explicitIntent = Intent(this, SecondActivity::class.java)
startActivity(explicitIntent)

// ===== Implicit Intent (SEND) =====
val sendIntent = Intent().apply {
    action = Intent.ACTION_SEND
    type = "text/plain"
    putExtra(Intent.EXTRA_TEXT, "Hello there!")
}
startActivity(sendIntent)

// ===== Implicit Intent with URI (DIAL) =====
val dialIntent = Intent(Intent.ACTION_DIAL, Uri.parse("tel:+15145551234"))
startActivity(dialIntent)

// ===== Intent with Data and Type =====
val viewImageIntent = Intent().apply {
    setDataAndType(
        Uri.parse("content://media/external/images/media/100"),
        "image/jpeg"
    )
}
startActivity(viewImageIntent)

// ===== Intent with Category =====
val browsableIntent = Intent(Intent.ACTION_VIEW).apply {
    data = Uri.parse("https://example.com")
    addCategory(Intent.CATEGORY_BROWSABLE)
}
startActivity(browsableIntent)

// ===== Intent with Flags =====
val noHistoryIntent = Intent(Intent.ACTION_SEND).apply {
    flags = Intent.FLAG_ACTIVITY_NO_HISTORY
}
startActivity(noHistoryIntent)

// ===== Chooser for Email =====
val emailIntent = Intent(Intent.ACTION_SENDTO).apply {
    data = Uri.parse("mailto:someone@example.com")
    putExtra(Intent.EXTRA_SUBJECT, "Hello")
    putExtra(Intent.EXTRA_TEXT, "This is the body of the email")
}
startActivity(Intent.createChooser(emailIntent, "Choose an email client"))
```

```xml
<!-- ===== Full Manifest Reference ===== -->
<manifest ... >
    <application ... >

        <!-- Main entry point -->
        <activity android:name="MainActivity" android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <!-- Receives SEND with text or media -->
        <activity android:name="ShareActivity" android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.SEND"/>
                <category android:name="android.intent.category.DEFAULT"/>
                <data android:mimeType="text/plain"/>
            </intent-filter>
            <intent-filter>
                <action android:name="android.intent.action.SEND"/>
                <action android:name="android.intent.action.SEND_MULTIPLE"/>
                <category android:name="android.intent.category.DEFAULT"/>
                <data android:mimeType="image/*"/>
                <data android:mimeType="video/*"/>
            </intent-filter>
        </activity>

        <!-- Protected activity requiring permission -->
        <activity android:name="SecureActivity"
            android:permission="com.example.app.permission.SECURE_ACCESS" />

    </application>

    <!-- Permission required to call another app's protected activity -->
    <uses-permission android:name="com.google.socialapp.permission.SHARE_POST"/>
</manifest>
```

---

## الجزء الخامس: أسئلة نظرية متوقعة بالامتحان

### Question 1: Explain the purpose of the `Activity` class and why an app typically has multiple activities.
**نموذج الإجابة:**
`Activity` هي المكوّن اللي يمثّل نقطة دخول التفاعل بين المستخدم والتطبيق، وتوفّر النافذة اللي ترسم فيها الواجهة. غالبية التطبيقات فيها أكتر من شاشة، وكل شاشة = `Activity` مستقلة، مع تحديد `Activity` رئيسية واحدة (main activity) تكون أول شاشة تظهر عند فتح التطبيق. مثال: تطبيق بريد فيه Activity لصندوق الوارد، وActivity تانية لكتابة إيميل، وActivity تالتة لعرض إيميل مفتوح. نستخدمها عندما نحتاج فصل كل مهمة/شاشة عن الأخرى بشكل مستقل تدار دورة حياته بشكل منفصل.

---

### Question 2: What is the difference between an explicit and an implicit intent? Give one example of each.
**نموذج الإجابة:**
الـ **Explicit Intent** يحدد اسم المكوّن الهدف (`ComponentName`) بدقة — مثل `Intent(this, SecondActivity::class.java)` للتنقل داخل نفس التطبيق. الـ **Implicit Intent** لا يحدد اسم مكوّن، بل يصف action عام يقدر أي مكوّن مؤهّل بأي تطبيق يلبّيه — مثل `Intent(Intent.ACTION_SEND)` لمشاركة نص مع أي تطبيق بريد أو مشاركة اجتماعية مثبّت على الجهاز. نستخدم Explicit عندما نعرف بالضبط الوجهة، وImplicit عندما نريد المرونة والتكامل بين التطبيقات.

---

### Question 3: List the six core lifecycle callbacks in order and briefly state the purpose of each.
**نموذج الإجابة:**
1. `onCreate()` — تهيئة بدء التشغيل لمرة واحدة (ربط ViewModel، متغيرات).
2. `onStart()` — الـ Activity تصبح مرئية، تهيئة كود الواجهة.
3. `onResume()` — الـ Activity تصبح تفاعلية بالمقدمة.
4. `onPause()` — فقدان جزئي للتركيز، تحرير موارد خفيفة (لا حفظ بيانات ثقيل).
5. `onStop()` — اختفاء كامل، تحرير موارد + عمليات حفظ ثقيلة (قاعدة بيانات).
6. `onDestroy()` — تحرير كل الموارد المتبقية قبل التدمير النهائي أو المؤقت.
نستخدم هذا التسلسل عندما نحتاج التصرف المناسب حسب كل تغيير بحالة ظهور الـ Activity للمستخدم.

---

### Question 4: Why should heavy operations like database writes be placed in `onStop()` rather than `onPause()`?
**نموذج الإجابة:**
لأن `onPause()` لا يضمن وقتاً كافياً لإتمام العمليات — النص الأصلي يذكر صراحة أن تنفيذها لا يوفر بالضرورة وقتاً كافياً لعمليات الحفظ. أما `onStop()` فتُستدعى فقط عندما تصبح الـ Activity غير مرئية بالكامل، وتسمح بتنفيذ عمليات إغلاق أكثر استهلاكاً للمعالج بأمان أكبر. نستخدم `onStop()` تحديداً للعمليات الثقيلة زي حفظ البيانات بقاعدة البيانات.

---

### Question 5: Explain what happens to an activity during a device configuration change such as screen rotation.
**نموذج الإجابة:**
عند تغيير configuration مثل تدوير الشاشة، النظام يستدعي `onDestroy()` على الـ Activity الحالية، لكن هذا تدمير **مؤقت** — فوراً بعده ينشئ النظام instance جديدة من نفس الـ Activity ويستدعي `onCreate()` عليها بالتهيئة الجديدة (اتجاه الشاشة الجديد مثلاً). لهذا السبب يجب حفظ حالة الواجهة قبل هذا التدمير المؤقت وإلا سيضيع تقدّم المستخدم. نستخدم فهم هذا السلوك عند تصميم تطبيقات تدعم تدوير الشاشة بأمان.

---

### Question 6: What are the three aspects the Android system uses to resolve an implicit intent?
**نموذج الإجابة:**
الاختبارات الثلاثة هي: **Action** (تطابق نوع العملية)، **Data** (تطابق الـ URI ونوع MIME)، و **Category** (تطابق كل category موجودة بالـ Intent مع الـ filter). يجب أن ينجح الـ Intent بالثلاثة اختبارات مع نفس الـ filter حتى يُعتبر ذلك المكوّن مؤهلاً. نستخدم هذه الآلية عند فهم كيف يختار النظام أفضل Activity لتلبية implicit intent.

---

### Question 7: Describe the role of `CATEGORY_DEFAULT` and explain why it matters for implicit intents.
**نموذج الإجابة:**
`CATEGORY_DEFAULT` تُضاف تلقائياً لأي intent يُمرَّر لـ `startActivity()` إذا لم تُحدد فئة أخرى صراحة. لهذا، أي `Activity` تريد استقبال implicit intents عادية **يجب** أن تُعلن هذه الفئة صراحة ضمن الـ `intent-filter` تبعها، وإلا لن تستقبل أي implicit intent رغم توفر action وdata مطابقين. نستخدمها كشرط أساسي لأي Activity تريد التفاعل مع نظام implicit intents العام.

---

### Question 8: Why are `Extras` and `Flags` considered different in role from `Component Name`, `Action`, `Data`, and `Category`?
**نموذج الإجابة:**
الخصائص الأربعة الأولى (Component Name, Action, Data, Category) هي **الخصائص المحدِّدة** للـ Intent — النظام يعتمد عليها مباشرة لتحديد وحل (resolve) أي مكوّن يجب أن يستقبل الـ Intent. بالمقابل، الـ `Extras` و`Flags` تحمل معلومات إضافية (بيانات مساعدة، وتعليمات إدارة) لكنها **لا تؤثر إطلاقاً** على عملية تحديد المكوّن المستهدف. نستخدم هذا الفهم لتفادي الاعتقاد الخاطئ أن إضافة extra أو flag معين قد يغيّر أي مكوّن سيُشغَّل.

---

## الجزء السادس: قائمة فحص ذاتي قبل الامتحان ✅

- [ ] أقدر أشرح الفرق بين onPause() و onStop() ولماذا ما بنحفظ بيانات بـ onPause()
- [ ] أعرف الترتيب الكامل لدورة حياة Activity من الإطلاق للتدمير
- [ ] أعرف شو بيصير بالـ lifecycle عند تدوير الشاشة بالضبط
- [ ] أقدر أميّز explicit intent عن implicit intent من الكود مباشرة
- [ ] أعرف الخصائص الست للـ Intent وأيها تؤثر على الـ resolution
- [ ] أعرف الفرق بين setData() و setType() و setDataAndType()
- [ ] أحفظ شروط ظهور Activity بقائمة اللانشر (ACTION_MAIN + CATEGORY_LAUNCHER)
- [ ] أعرف الاختبارات الثلاثة لـ Intent Resolution وقاعدة كل واحد منهم
- [ ] أفهم قاعدة الاعتمادية الخطية لأجزاء الـ URI (scheme → host → port → path)
- [ ] أعرف الفرق بين تصريح الأذونات بالمستدعي والمستهدف
- [ ] أقدر أكتب intent-filter كامل لـ Activity تستقبل implicit intent محدد

---

## الجزء السادس: ورقة المراجعة السريعة (Cheat Sheet)

### 🔑 خريطة العلاقات بين المحاضرات
| المحاضرة | ترتبط مع | كيف؟ |
| --- | --- | --- |
| App Fundamentals | Activity & Intents | Activity واحدة من مكوّنات التطبيق الأربعة المعرّفة بالـ manifest |
| Compose UI | Activity & Intents | كل Activity تستضيف شجرة Composables داخل onCreate() عادةً |
| Compose Navigation | Activity & Intents | NavController بديل حديث لتعدد الـ Activities داخل تطبيق واحد |

### 🔑 أهم النقاط الذهبية
| الموضوع | النقاط |
| --- | --- |
| Lifecycle | onPause خفيف وسريع، onStop ثقيل، onDestroy قد يكون مؤقتاً |
| Intent | 4 خصائص تؤثر على resolution (Component/Action/Data/Category)، 2 لا تؤثر (Extras/Flags) |
| Manifest | android:name إلزامية دائماً، CATEGORY_DEFAULT إلزامية لاستقبال implicit intents |

### 🔑 مرجع سريع
| الرمز/المصطلح | المعنى | يُستخدم في |
| --- | --- | --- |
| `onCreate()` | إنشاء لمرة واحدة | بداية دورة الحياة |
| `onPause()` | فقدان تركيز جزئي | لا حفظ بيانات هنا |
| `onStop()` | اختفاء كامل | حفظ بيانات ثقيل هنا |
| `ACTION_SEND` | مشاركة بيانات | implicit intent شائع |
| `CATEGORY_LAUNCHER` | ظهور بقائمة التطبيقات | مع ACTION_MAIN فقط |
| `setDataAndType()` | تحديد URI + MIME معاً | آمن دون فقدان قيمة |

### 🔑 قواعد ذهبية لا تُنسى
| # | القاعدة |
| --- | --- |
| 1 | ما تحفظ بيانات أو تعمل استدعاء شبكة بـ onPause() — دايماً onStop() |
| 2 | ACTION_MAIN + CATEGORY_LAUNCHER لازم يكونوا سوا لظهور التطبيق باللانشر |
| 3 | Activity بدون intent-filter = ما فيها تنشغّل إلا بـ explicit intent |
| 4 | Intent بدون action ينجح action test؛ لكن filter بدون action يفشل دائماً |
| 5 | Intent بدون category ينجح category test دائماً بغض النظر عن الفلتر |
| 6 | تدوير الشاشة = onDestroy() مؤقت متبوع فوراً بـ onCreate() جديد |

<!-- VALIDATION: تم تغطية كامل محتوى محاضرة "Activity Component" (الصفحات 1–44) بما يشمل: مفهوم Activity، تهيئة Manifest (declare activities/intent-filters/permissions)، دورة حياة Activity الكاملة بسبع دوال (onCreate/onStart/onResume/onPause/onStop/onRestart/onDestroy)، التفاعل مع تطبيقات أخرى، أنواع Intent (explicit/implicit)، بناء Intent بخصائصه الست (Component Name/Action/Data/Category/Extras/Flags)، استقبال implicit intent، وIntent Resolution بثلاثة اختبارات (Action/Category/Data) مع قاعدة الاعتمادية الخطية لأجزاء URI. تم الالتزام ببنية SCHEMA.md v1.0 والفصل اللغوي المطلوب بالبرومبت الجديد (نص الأسئلة/التمارين إنجليزي، الشرح والتعليل ونماذج الحلول عربي). -->
