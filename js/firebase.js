/* =========================================
   ملف قاعدة البيانات: js/firebase.js
   الوظيفة: الاتصال بـ Firebase وتوفير البيانات للموقع
   ========================================= */

// استيراد المكتبات من سيرفر جوجل مباشرة
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, onSnapshot, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// إعدادات مشروعك (تأكد أنها صحيحة)
const firebaseConfig = {
    apiKey: "AIzaSyD_xxxxxxxxxxxxxxxxx", // ⚠️ ضع مفتاحك الحقيقي هنا
    authDomain: "thuraya-panel.firebaseapp.com",
    projectId: "thuraya-panel",
    storageBucket: "thuraya-panel.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:xxxxxxxxx"
};

// تشغيل Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ============================================================
// ⚠️ الخطوة السحرية: جعل المتغيرات عامة (Global)
// هذا يحل مشكلة "require is not defined"
// ============================================================
window.db = db;
window.doc = doc;
window.onSnapshot = onSnapshot;
window.setDoc = setDoc;

console.log("✅ Firebase Connected & Exposed to Window");
