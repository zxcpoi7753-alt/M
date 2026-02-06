/* =========================================
   ملف الاتصال بقاعدة البيانات: js/firebase.js
   (تم التصحيح وإضافة الأدوات الناقصة)
   ========================================= */

// 1. استيراد المكتبات من Google CDN (لضمان العمل في المتصفح)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-analytics.js";
import { 
    getFirestore, 
    doc, 
    getDoc, 
    setDoc,      // هام جداً: غيابه كان يسبب الشاشة البيضاء في الإشعارات
    updateDoc, 
    onSnapshot, 
    increment    // هام جداً: ضروري لعمل العداد الجماعي
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// 2. إعدادات مشروعك (Thuraya Platform)
const firebaseConfig = {
  apiKey: "AIzaSyDk5PRsHGgO-i_dIEjOw-j_BjPO9kn--GI",
  authDomain: "thuraya-platform.firebaseapp.com",
  projectId: "thuraya-platform",
  storageBucket: "thuraya-platform.firebasestorage.app",
  messagingSenderId: "1055940030867",
  appId: "1:1055940030867:web:d96f6a69a342e98c6d7866",
  measurementId: "G-2QKJEQR322"
};

// 3. تهيئة التطبيق
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// 4. تصدير الأدوات للنافذة (ليستخدمها الموقع والأدمن)
window.db = db;
window.doc = doc;
window.getDoc = getDoc;
window.setDoc = setDoc;       // تم الإصلاح
window.updateDoc = updateDoc;
window.onSnapshot = onSnapshot;
window.increment = increment; // تم الإصلاح

console.log("🔥 تم الاتصال بقاعدة البيانات وتجهيز أدوات الإرسال بنجاح");
