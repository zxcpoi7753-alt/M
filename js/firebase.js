/* =========================================
   إعدادات فايربيس: js/firebase.js
   ========================================= */
// استيراد المكتبات من Google CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { 
    getFirestore, 
    doc, 
    getDoc, 
    setDoc,      // هذه كانت ناقصة غالباً
    updateDoc, 
    onSnapshot, 
    increment    // وهذه للعداد
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// إعدادات مشروعك (لا تغيرها إذا كانت تعمل، أو انسخ إعداداتك الخاصة هنا)
const firebaseConfig = {
    // ⚠️ ضع إعدادات مشروعك الحقيقية هنا بدلاً من هذه النقاط
    // apiKey: "...",
    // authDomain: "...",
    // projectId: "...",
    // ...
};

// تهيئة التطبيق
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ربط الأدوات بالنافذة (Window) لتكون متاحة لكل الملفات
window.db = db;
window.doc = doc;
window.getDoc = getDoc;
window.setDoc = setDoc;       // ضروري للإشعارات
window.updateDoc = updateDoc;
window.onSnapshot = onSnapshot;
window.increment = increment; // ضروري للعداد

console.log("🔥 Firebase Loaded & Functions Exported");
