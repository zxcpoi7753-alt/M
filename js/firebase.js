/* =========================================
   ملف قاعدة البيانات: js/firebase.js
   الوظيفة: الاتصال الصحيح بالمتصفح
   ========================================= */

// 1. استيراد المكتبات عبر روابط الويب (CDN) بدلاً من الأسماء المختصرة
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, onSnapshot, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
// (تم إزالة Analytics مؤقتاً لتسريع التحميل ومنع الأخطاء)

// 2. بيانات مشروعك الحقيقية (من الرسالة التي أرسلتها)
const firebaseConfig = {
  apiKey: "AIzaSyDk5PRsHGgO-i_dIEjOw-j_BjPO9kn--GI",
  authDomain: "thuraya-platform.firebaseapp.com",
  projectId: "thuraya-platform",
  storageBucket: "thuraya-platform.firebasestorage.app",
  messagingSenderId: "1055940030867",
  appId: "1:1055940030867:web:d96f6a69a342e98c6d7866",
  measurementId: "G-2QKJEQR322"
};

// 3. تشغيل التطبيق وقاعدة البيانات
let app, db;
try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log("✅ Firebase initialized successfully");
} catch (error) {
    console.error("❌ Firebase initialization error:", error);
}

// 4. بناء الجسر (تصدير المتغيرات للمتصفح)
// هذا السطر هو الذي يحل مشكلة الشاشة البيضاء في الأدمن
window.db = db;
window.doc = doc;
window.onSnapshot = onSnapshot;
window.setDoc = setDoc;
