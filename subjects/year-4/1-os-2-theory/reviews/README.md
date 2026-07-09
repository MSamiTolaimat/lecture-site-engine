# مراجعة شاملة — نظم التشغيل 2

1. عدّل `review.md` (المصدر الوحيد).
2. تأكد أن `manifest.json` يشير إلى الملف:

```json
"files": [{
  "path": "review.md",
  "icon": "📚",
  "matIcon": "menu_book",
  "id": "review-full"
}]
```

3. أعد بناء المادة: `node build/cli.mjs --subject year-4/1-os-2-theory`

الـ build يحوّل `review.md` تلقائياً إلى `review.json` عبر `parseReviewGuide`.
