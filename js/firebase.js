/* =========================================
   ملف الاتصال: js/firebase.js
   الوظيفة: تهيئة الاتصال بـ Firebase وتصدير الأدوات
   ========================================= */

// استيراد المكتبات من رابط جوجل المباشر (CDN)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, doc, onSnapshot, setDoc, enableIndexedDbPersistence } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// إعدادات مشروعك (لا تغيرها)
const firebaseConfig = {
    apiKey: "AIzaSyDk5PRsHGgO-i_dIEjOw-j_BjPO9kn--GI",
    authDomain: "thuraya-platform.firebaseapp.com",
    projectId: "thuraya-platform",
    storageBucket: "thuraya-platform.firebasestorage.app",
    messagingSenderId: "1055940030867",
    appId: "1:1055940030867:web:d96f6a69a342e98c6d7866",
    measurementId: "G-2QKJEQR322"
};

// تهيئة التطبيق
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// محاولة تفعيل التخزين المؤقت (Offline Mode) ليعمل الموقع بدون نت جزئياً
try {
    enableIndexedDbPersistence(db).catch((err) => {
        if (err.code == 'failed-precondition') {
            console.log('Multiple tabs open, persistence can only be enabled in one tab at a a time.');
        } else if (err.code == 'unimplemented') {
            console.log('The current browser does not support all of the features required to enable persistence');
        }
    });
} catch (e) {
    console.log("Offline mode setup failed:", e);
}

// تصدير الأدوات لملفاتنا الأخرى (Modules)
export { db, doc, onSnapshot, setDoc };

// وضع الأدوات في النافذة العامة (احتياطي للأكواد القديمة أو الفحص)
window.db = db;
window.doc = doc;
window.onSnapshot = onSnapshot;
window.setDoc = setDoc;
