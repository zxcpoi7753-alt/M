/* =========================================
   المكون: أسماء الله الحسنى (كاملة 99 اسم)
   المسار: js/components/seerah/AsmaHusna.js
   ========================================= */
(function() {
    const { useState, useEffect, useMemo } = React;
    const CustomModal = window.CustomModal;

    // --- قاعدة بيانات الأسماء (99 اسماً كاملة) ---
    const ALL_NAMES = [
        { id: 1, name: "الله", meaning: "الإله المعبود بحق، الجامع لصفات الألوهية.", verse: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ", dua: "يا الله، يا حي يا قيوم، برحمتك أستغيث." },
        { id: 2, name: "الرحمن", meaning: "واسع الرحمة التي وسعت كل شيء.", verse: "الرَّحْمَٰنُ عَلَى الْعَرْشِ اسْتَوَىٰ", dua: "يا رحمن، ارحم ضعفي وتولّ أمري." },
        { id: 3, name: "الرحيم", meaning: "الواصل رحمته للمؤمنين خاصة.", verse: "وَكَانَ بِالْمُؤْمِنِينَ رَحِيمًا", dua: "يا رحيم، اغفر لي وتب عليّ." },
        { id: 4, name: "الملك", meaning: "المالك لكل شيء، المتصرف في ملكه كيف يشاء.", verse: "فَتَعَالَى اللَّهُ الْمَلِكُ الْحَقُّ", dua: "يا ملك، ملكني زمام نفسي ولا تكلني إليها طرفة عين." },
        { id: 5, name: "القدوس", meaning: "المنزه عن كل نقص وعيب.", verse: "الْمَلِكُ الْقُدُّوسُ السَّلَامُ", dua: "يا قدوس، طهر قلبي من النفاق وعملي من الرياء." },
        { id: 6, name: "السلام", meaning: "الذي سلم من كل عيب، وسلم خلقه من الظلم.", verse: "السَّلَامُ الْمُؤْمِنُ الْمُهَيْمِنُ", dua: "يا سلام، سلمنا من آفات الدنيا وعذاب الآخرة." },
        { id: 7, name: "المؤمن", meaning: "المصدق لرسله، والذي أمن خلقه من الظلم.", verse: "الْمُؤْمِنُ الْمُهَيْمِنُ الْعَزِيزُ", dua: "يا مؤمن، آمن روعاتي واستر عوراتي." },
        { id: 8, name: "المهيمن", meaning: "الرقيب الحافظ لكل شيء.", verse: "الْمُهَيْمِنُ الْعَزِيزُ الْجَبَّارُ", dua: "يا مهيمن، كن لي حافظاً ونصيراً." },
        { id: 9, name: "العزيز", meaning: "القوي الذي لا يغلب.", verse: "وَهُوَ الْعَزِيزُ الْحَكِيمُ", dua: "يا عزيز، أعزني بطاعتك ولا تذلني بمعصيتك." },
        { id: 10, name: "الجبار", meaning: "الذي يجبر الكسير، ويقهر الجبابرة.", verse: "الْجَبَّارُ الْمُتَكَبِّرُ", dua: "يا جبار، اجبر كسر قلبي." },
        { id: 11, name: "المتكبر", meaning: "المتعالي عن صفات الخلق.", verse: "الْعَزِيزُ الْجَبَّارُ الْمُتَكَبِّرُ", dua: "يا متكبر، ارزقني التواضع واكفني شر الكبر." },
        { id: 12, name: "الخالق", meaning: "المبدع للكائنات من العدم.", verse: "هُوَ اللَّهُ الْخَالِقُ الْبَارِئُ", dua: "يا خالق، حسن خلقي كما حسنت خلقي." },
        { id: 13, name: "البارئ", meaning: "الموجد للأشياء بريئة من التفاوت.", verse: "الْخَالِقُ الْبَارِئُ الْمُصَوِّرُ", dua: "يا بارئ، أبرئني من الشرك والشقاق." },
        { id: 14, name: "المصور", meaning: "الذي صور خلقه في أحسن صورة.", verse: "هُوَ اللَّهُ الْخَالِقُ الْبَارِئُ الْمُصَوِّرُ", dua: "يا مصور، جمل بواطننا كما جملت ظواهرنا." },
        { id: 15, name: "الغفار", meaning: "كثير المغفرة، الساتر للذنوب.", verse: "وَإِنِّي لَغَفَّارٌ لِّمَن تَابَ", dua: "يا غفار، اغفر لي ذنوبي كلها." },
        { id: 16, name: "القهار", meaning: "الذي خضعت له الرقاب وذلت له الجبابرة.", verse: "وَهُوَ الْوَاحِدُ الْقَهَّارُ", dua: "يا قهار، اقهر عدوي وانتصر للمظلومين." },
        { id: 17, name: "الوهاب", meaning: "كثير العطايا بلا عوض.", verse: "إِنَّكَ أَنتَ الْوَهَّابُ", dua: "يا وهاب، هب لي من لدنك رحمة." },
        { id: 18, name: "الرزاق", meaning: "خالق الأرزاق والمتكفل بها.", verse: "إِنَّ اللَّهَ هُوَ الرَّزَّاقُ", dua: "يا رزاق، ارزقني رزقاً حلالاً طيباً." },
        { id: 19, name: "الفتاح", meaning: "الذي يفتح أبواب الرحمة والرزق.", verse: "وَهُوَ الْفَتَّاحُ الْعَلِيمُ", dua: "يا فتاح، افتح لي أبواب الخير." },
        { id: 20, name: "العليم", meaning: "الذي أحاط علمه بكل شيء.", verse: "وَهُوَ بِكُلِّ شَيْءٍ عَلِيمٌ", dua: "يا عليم، علمني ما ينفعني." },
        { id: 21, name: "القابض", meaning: "الذي يقبض الرزق والأرواح.", verse: "وَاللَّهُ يَقْبِضُ وَيَبْسُطُ", dua: "يا قابض، اقبض يدي عن الحرام." },
        { id: 22, name: "الباسط", meaning: "الذي يبسط الرزق لمن يشاء.", verse: "بَلْ يَدَاهُ مَبْسُوطَتَانِ", dua: "يا باسط، ابسط لي في رزقي وعلمي." },
        { id: 23, name: "الخافض", meaning: "الذي يخفض الكفار والمذلين.", verse: "خَافِضَةٌ رَّافِعَةٌ", dua: "يا خافض، اخفض لي جناح الذل من الرحمة لوالدي." },
        { id: 24, name: "الرافع", meaning: "الذي يرفع المؤمنين والأولياء.", verse: "نَرْفَعُ دَرَجَاتٍ مَّن نَّشَاءُ", dua: "يا رافع، ارفع قدري في الدنيا والآخرة." },
        { id: 25, name: "المعز", meaning: "الذي يهب العزة لمن يشاء.", verse: "تُعِزُّ مَن تَشَاءُ", dua: "يا معز، أعزني بالإسلام." },
        { id: 26, name: "المذل", meaning: "الذي يذل من يشاء.", verse: "وَتُذِلُّ مَن تَشَاءُ", dua: "يا مذل، لا تذلني لأحد سواك." },
        { id: 27, name: "السميع", meaning: "الذي لا يخفى عليه مسموع.", verse: "إِنَّهُ هُوَ السَّمِيعُ الْبَصِيرُ", dua: "يا سميع، استجب دعائي." },
        { id: 28, name: "البصير", meaning: "الذي لا يعزب عنه شيء.", verse: "وَاللَّهُ بَصِيرٌ بِالْعِبَادِ", dua: "يا بصير، بصرني بعيوبي." },
        { id: 29, name: "الحكم", meaning: "الذي يحكم بين خلقه بالعدل.", verse: "أَفَغَيْرَ اللَّهِ أَبْتَغِي حَكَمًا", dua: "يا حكم، اجعلني راضياً بحكمك." },
        { id: 30, name: "العدل", meaning: "المنزه عن الظلم والجور.", verse: "إِنَّ اللَّهَ يَأْمُرُ بِالْعَدْلِ", dua: "يا عدل، ارزقني العدل في الرضا والغضب." },
        { id: 31, name: "اللطيف", meaning: "البر بعباده، العالم بخفايا الأمور.", verse: "اللَّهُ لَطِيفٌ بِعِبَادِهِ", dua: "يا لطيف، الطف بي في قضائك." },
        { id: 32, name: "الخبير", meaning: "العالم ببواطن الأمور.", verse: "وَهُوَ الْحَكِيمُ الْخَبِيرُ", dua: "يا خبير، اختر لي ولا تخيرني." },
        { id: 33, name: "الحليم", meaning: "الذي لا يعاجل بالعقوبة.", verse: "وَاللَّهُ غَفُورٌ حَلِيمٌ", dua: "يا حليم، اعف عن زلاتي." },
        { id: 34, name: "العظيم", meaning: "الذي له العظمة المطلقة.", verse: "وَهُوَ الْعَلِيُّ الْعَظِيمُ", dua: "يا عظيم، عظم رغبتي فيك." },
        { id: 35, name: "الغفور", meaning: "الذي يكثر منه الستر والعفو.", verse: "وَاللَّهُ غَفُورٌ رَّحِيمٌ", dua: "يا غفور، اغفر لي ولوالدي." },
        { id: 36, name: "الشكور", meaning: "الذي يجازي بالكثير على العمل القليل.", verse: "إِنَّ رَبَّنَا لَغَفُورٌ شَكُورٌ", dua: "يا شكور، أوزعني أن أشكر نعمتك." },
        { id: 37, name: "العلي", meaning: "الذي علا بذاته وصفاته.", verse: "وَهُوَ الْعَلِيُّ الْعَظِيمُ", dua: "يا علي، أعلِ كلمتي بالحق." },
        { id: 38, name: "الكبير", meaning: "الذي هو أكبر من كل شيء.", verse: "الْعَلِيُّ الْكَبِيرُ", dua: "يا كبير، تكبرت عن الظلم فاجرني من الظالمين." },
        { id: 39, name: "الحفيظ", meaning: "الذي يحفظ من يشاء من خلقه.", verse: "إِنَّ رَبِّي عَلَىٰ كُلِّ شَيْءٍ حَفِيظٌ", dua: "يا حفيظ، احفظني من بين يدي ومن خلفي." },
        { id: 40, name: "المقيت", meaning: "خالق الأقوات وموصلها.", verse: "وَكَانَ اللَّهُ عَلَىٰ كُلِّ شَيْءٍ مُّقِيتًا", dua: "يا مقيت، اجعل قوتي عوناً لي على طاعتك." },
        { id: 41, name: "الحسيب", meaning: "الكافي عباده، المحاسب لهم.", verse: "وَكَفَىٰ بِاللَّهِ حَسِيبًا", dua: "يا حسيب، اكفني ما أهمني." },
        { id: 42, name: "الجليل", meaning: "المتصف بصفات الجلال والعظمة.", verse: "وَيَبْقَىٰ وَجْهُ رَبِّكَ ذُو الْجَلَالِ وَالْإِكْرَامِ", dua: "يا جليل، املأ قلبي هيبة منك." },
        { id: 43, name: "الكريم", meaning: "الكثير الخير، العظيم النفع.", verse: "مَا غَرَّكَ بِرَبِّكَ الْكَرِيمِ", dua: "يا كريم، أكرمني بجنتك." },
        { id: 44, name: "الرقيب", meaning: "الحافظ الذي لا يغيب عنه شيء.", verse: "إِنَّ اللَّهَ كَانَ عَلَيْكُمْ رَقِيبًا", dua: "يا رقيب، ارزقني خشيتك في الغيب والشهادة." },
        { id: 45, name: "المجيب", meaning: "الذي يقابل الدعاء والسؤال بالعطاء.", verse: "إِنَّ رَبِّي قَرِيبٌ مُّجِيبٌ", dua: "يا مجيب، استجب دعواتي." },
        { id: 46, name: "الواسع", meaning: "الذي وسع رزقه ورحمته كل شيء.", verse: "وَاللَّهُ وَاسِعٌ عَلِيمٌ", dua: "يا واسع، وسع لي في داري ورزقي." },
        { id: 47, name: "الحكيم", meaning: "الذي يضع الأشياء في مواضعها.", verse: "وَهُوَ الْعَزِيزُ الْحَكِيمُ", dua: "يا حكيم، ارزقني الحكمة." },
        { id: 48, name: "الودود", meaning: "المحب لعباده المؤمنين.", verse: "وَهُوَ الْغَفُورُ الْوَدُودُ", dua: "يا ودود، اجعل لي وداً في قلوب خلقك." },
        { id: 49, name: "المجيد", meaning: "عظيم الشأن والسلطان.", verse: "إِنَّهُ حَمِيدٌ مَّجِيدٌ", dua: "يا مجيد، مجدنا بطاعتك." },
        { id: 50, name: "الباعث", meaning: "الذي يبعث الخلق بعد الموت.", verse: "وَأَنَّ اللَّهَ يَبْعَثُ مَن فِي الْقُبُورِ", dua: "يا باعث، ابعثني مقاماً محموداً." },
        { id: 51, name: "الشهيد", meaning: "المطلع على جميع الأشياء.", verse: "وَاللَّهُ عَلَىٰ كُلِّ شَيْءٍ شَهِيدٌ", dua: "يا شهيد، اشهد لي بالإيمان." },
        { id: 52, name: "الحق", meaning: "الموجود حقيقة، الثابت.", verse: "فَتَعَالَى اللَّهُ الْمَلِكُ الْحَقُّ", dua: "يا حق، أرنا الحق حقاً وارزقنا اتباعه." },
        { id: 53, name: "الوكيل", meaning: "الكفيل بأرزاق العباد ومصالحهم.", verse: "وَكَفَىٰ بِاللَّهِ وَكِيلًا", dua: "يا وكيل، توكلت عليك في كل أمري." },
        { id: 54, name: "القوي", meaning: "التام القوة، الذي لا يعجزه شيء.", verse: "إِنَّ اللَّهَ هُوَ الرَّزَّاقُ ذُو الْقُوَّةِ الْمَتِينُ", dua: "يا قوي، قوني على طاعتك." },
        { id: 55, name: "المتين", meaning: "الشديد القوة الذي لا يلحقه مشقة.", verse: "ذُو الْقُوَّةِ الْمَتِينُ", dua: "يا متين، ثبت أقدامنا." },
        { id: 56, name: "الولي", meaning: "المحب الناصر لعباده المؤمنين.", verse: "اللَّهُ وَلِيُّ الَّذِينَ آمَنُوا", dua: "يا ولي، تولني فيمن توليت." },
        { id: 57, name: "الحميد", meaning: "المستحق للحمد والثناء.", verse: "وَهُوَ الْوَلِيُّ الْحَمِيدُ", dua: "يا حميد، لك الحمد كله." },
        { id: 58, name: "المحصي", meaning: "الذي أحصى كل شيء بعلمه.", verse: "وَأَحْصَىٰ كُلِّ شَيْءٍ عَدَدًا", dua: "يا محصي، احص أعمالنا الصالحة وتقبلها." },
        { id: 59, name: "المبدئ", meaning: "الذي بدأ الخلق من العدم.", verse: "إِنَّهُ هُوَ يُبْدِئُ وَيُعِيدُ", dua: "يا مبدئ، ابدأ يومنا بالخير." },
        { id: 60, name: "المعيد", meaning: "الذي يعيد الخلق بعد الموت.", verse: "كَمَا بَدَأْنَا أَوَّلَ خَلْقٍ نُّعِيدُهُ", dua: "يا معيد، أعد علينا عوائدك الجميلة." },
        { id: 61, name: "المحيي", meaning: "الذي يحيي العظام وهي رميم.", verse: "إِنَّ ذَٰلِكَ لَمُحْيِي الْمَوْتَىٰ", dua: "يا محيي، أحيي قلبي بنور الإيمان." },
        { id: 62, name: "المميت", meaning: "الذي يميت الأحياء.", verse: "يُحْيِي وَيُمِيتُ", dua: "يا مميت، أمت نفسي الأمارة بالسوء." },
        { id: 63, name: "الحي", meaning: "الدائم الحياة بلا زوال.", verse: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ", dua: "يا حي، أحيي قلوبنا بذكرك." },
        { id: 64, name: "القيوم", meaning: "القائم بنفسه، المقيم لغيره.", verse: "وَعَنَتِ الْوُجُوهُ لِلْحَيِّ الْقَيُّومِ", dua: "يا قيوم، أصلح لي شأني كله." },
        { id: 65, name: "الواجد", meaning: "الذي يجد كل ما يطلب.", verse: "إِنَّا وَجَدْنَاهُ صَابِرًا", dua: "يا واجد، أوجد لنا مخرجاً من كل ضيق." },
        { id: 66, name: "الماجد", meaning: "الكثير الإحسان والمجد.", verse: "ذُو الْعَرْشِ الْمَجِيدُ", dua: "يا ماجد، هب لنا من مجدك." },
        { id: 67, name: "الواحد", meaning: "المتفرد في ذاته وصفاته.", verse: "قُلْ هُوَ اللَّهُ أَحَدٌ", dua: "يا واحد، وحد صفوفنا." },
        { id: 68, name: "الصمد", meaning: "الذي يقصده الخلائق في حوائجهم.", verse: "اللَّهُ الصَّمَدُ", dua: "يا صمد، اقض حوائجنا." },
        { id: 69, name: "القادر", meaning: "الذي له القدرة التامة.", verse: "فَقَدَرْنَا فَنِعْمَ الْقَادِرُونَ", dua: "يا قادر، اقدر لنا الخير حيث كان." },
        { id: 70, name: "المقتدر", meaning: "تام القدرة لا يمتنع عليه شيء.", verse: "فِي مَقْعَدِ صِدْقٍ عِندَ مَلِيكٍ مُّقْتَدِرٍ", dua: "يا مقتدر، قدر لنا الخير." },
        { id: 71, name: "المقدم", meaning: "الذي يقدم ما يشاء.", verse: "أَنتَ الْمُقَدِّمُ وَأَنتَ الْمُؤَخِّرُ", dua: "يا مقدم، قدمنا لعمل الخير." },
        { id: 72, name: "المؤخر", meaning: "الذي يؤخر ما يشاء.", verse: "أَنتَ الْمُقَدِّمُ وَأَنتَ الْمُؤَخِّرُ", dua: "يا مؤخر، أخر عنا الشر." },
        { id: 73, name: "الأول", meaning: "الذي ليس قبله شيء.", verse: "هُوَ الْأَوَّلُ وَالْآخِرُ", dua: "يا أول، اجعلنا من السابقين للخيرات." },
        { id: 74, name: "الآخر", meaning: "الذي ليس بعده شيء.", verse: "هُوَ الْأَوَّلُ وَالْآخِرُ", dua: "يا آخر، حسن خواتيمنا." },
        { id: 75, name: "الظاهر", meaning: "العالي فوق كل شيء.", verse: "وَالظَّاهِرُ وَالْبَاطِنُ", dua: "يا ظاهر، اظهر الحق." },
        { id: 76, name: "الباطن", meaning: "العالم ببواطن الأمور.", verse: "وَالظَّاهِرُ وَالْبَاطِنُ", dua: "يا باطن، طهر سرائرنا." },
        { id: 77, name: "الوالي", meaning: "المالك للأشياء والمتصرف فيها.", verse: "وَمَا لَهُم مِّن دُونِهِ مِن وَالٍ", dua: "يا والي، تول أمرنا." },
        { id: 78, name: "المتعالي", meaning: "المنزه عن صفات المخلوقين.", verse: "عَالِمُ الْغَيْبِ وَالشَّهَادَةِ الْكَبِيرُ الْمُتَعَالِ", dua: "يا متعالي، ارفعنا ولا تضعنا." },
        { id: 79, name: "البر", meaning: "الكثير الخير والإحسان.", verse: "إِنَّهُ هُوَ الْبَرُّ الرَّحِيمُ", dua: "يا بر، ارزقنا بر الوالدين." },
        { id: 80, name: "التواب", meaning: "الذي يقبل التوبة عن عباده.", verse: "إِنَّ اللَّهَ هُوَ التَّوَّابُ الرَّحِيمُ", dua: "يا تواب، تب علينا توبة نصوحاً." },
        { id: 81, name: "المنتقم", meaning: "المعاقب للعصاة.", verse: "إِنَّا مِنَ الْمُجْرِمِينَ مُنتَقِمُونَ", dua: "يا منتقم، انتقم للمظلومين." },
        { id: 82, name: "العفو", meaning: "الذي يمحو السيئات.", verse: "إِنَّ اللَّهَ كَانَ عَفُوًّا غَفُورًا", dua: "يا عفو، اعف عنا." },
        { id: 83, name: "الرؤوف", meaning: "شديد الرحمة والعطف.", verse: "وَاللَّهُ رَءُوفٌ بِالْعِبَادِ", dua: "يا رؤوف، ارأف بحالنا." },
        { id: 84, name: "مالك الملك", meaning: "الذي يملك الملك كله.", verse: "قُلِ اللَّهُمَّ مَالِكَ الْمُلْكِ", dua: "يا مالك الملك، آتنا في الدنيا حسنة." },
        { id: 85, name: "ذو الجلال والإكرام", meaning: "المستحق للتعظيم والإكرام.", verse: "تَبَارَكَ اسْمُ رَبِّكَ ذِي الْجَلَالِ وَالْإِكْرَامِ", dua: "يا ذا الجلال والإكرام، أكرم نزلنا." },
        { id: 86, name: "المقسط", meaning: "العادل في حكمه.", verse: "إِنَّ اللَّهَ يُحِبُّ الْمُقْسِطِينَ", dua: "يا مقسط، ارزقنا القسط في القول والعمل." },
        { id: 87, name: "الجامع", meaning: "الذي يجمع الخلائق ليوم لا ريب فيه.", verse: "رَبَّنَا إِنَّكَ جَامِعُ النَّاسِ", dua: "يا جامع، اجمعنا في الفردوس الأعلى." },
        { id: 88, name: "الغني", meaning: "المستغني عن خلقه.", verse: "وَاللَّهُ الْغَنِيُّ وَأَنتُمُ الْفُقَرَاءُ", dua: "يا غني، أغننا بفضلك عمن سواك." },
        { id: 89, name: "المغني", meaning: "المعطي للكفاية والغنى.", verse: "وَأَنَّهُ هُوَ أَغْنَىٰ وَأَقْنَىٰ", dua: "يا مغني، أغننا بحلالك عن حرامك." },
        { id: 90, name: "المانع", meaning: "الذي يمنع العطاء والبلاء.", verse: "مَّنَّاعٍ لِّلْخَيْرِ مُعْتَدٍ أَثِيمٍ", dua: "يا مانع، امنع عنا الشر." },
        { id: 91, name: "الضار", meaning: "المقدر للضرر ابتلاءً أو عقوبة.", verse: "وَإِن يَمْسَسْكَ اللَّهُ بِضُرٍّ فَلَا كَاشِفَ لَهُ إِلَّا هُوَ", dua: "يا ضار، اكشف عنا الضر." },
        { id: 92, name: "النافع", meaning: "المقدر للنفع والخير.", verse: "قُل لَّا أَمْلِكُ لِنَفْسِي نَفْعًا", dua: "يا نافع، انفعنا بما علمتنا." },
        { id: 93, name: "النور", meaning: "الهادي، ومنه النور المحسوس والمعنوي.", verse: "اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ", dua: "يا نور، نور قلوبنا وقبورنا." },
        { id: 94, name: "الهادي", meaning: "المرشد لعباده.", verse: "وَإِنَّ اللَّهَ لَهَادِ الَّذِينَ آمَنُوا", dua: "يا هادي، اهدنا الصراط المستقيم." },
        { id: 95, name: "البديع", meaning: "خالق الأشياء على غير مثال سابق.", verse: "بَدِيعُ السَّمَاوَاتِ وَالْأَرْضِ", dua: "يا بديع، أبدع لنا من الخير ما يسرنا." },
        { id: 96, name: "الباقي", meaning: "الدائم بلا انتهاء.", verse: "وَيَبْقَىٰ وَجْهُ رَبِّكَ", dua: "يا باقي، ارزقنا الباقيات الصالحات." },
        { id: 97, name: "الوارث", meaning: "الذي يرث الأرض ومن عليها.", verse: "وَإِنَّا لَنَحْنُ نُحْيِي وَنُمِيتُ وَنَحْنُ الْوَارِثُونَ", dua: "يا وارث، ورثنا جنة النعيم." },
        { id: 98, name: "الرشيد", meaning: "المرشد لأسباب الصلاح.", verse: "أَلَيْسَ مِنكُمْ رَجُلٌ رَّشِيدٌ", dua: "يا رشيد، ألهمنا الرشد." },
        { id: 99, name: "الصبور", meaning: "الذي لا يعاجل العصاة بالعقوبة.", verse: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ", dua: "يا صبور، أفرغ علينا صبراً." }
    ];

    const AsmaHusna = () => {
        const [search, setSearch] = useState("");
        const [selected, setSelected] = useState(null);
        const [dailyName, setDailyName] = useState(null);
        const [counter, setCounter] = useState(0);

        // اختيار اسم اليوم عشوائياً
        useEffect(() => {
            const randomIndex = Math.floor(Math.random() * ALL_NAMES.length);
            setDailyName(ALL_NAMES[randomIndex]);
        }, []);

        // تصفية البحث
        const filteredNames = useMemo(() => {
            return ALL_NAMES.filter(n => n.name.includes(search));
        }, [search]);

        // وظائف العداد
        const incrementCounter = () => {
            setCounter(prev => prev + 1);
            if (navigator.vibrate) navigator.vibrate(50);
        };
        const resetCounter = () => setCounter(0);

        const openModal = (name) => {
            setSelected(name);
            setCounter(0);
        };

        return (
            <div className="min-h-screen pb-20 animate-in">
                
                {/* 1. رأس الصفحة (اسم اليوم) */}
                {dailyName && (
                    <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-6 rounded-3xl shadow-lg mb-6 relative overflow-hidden mx-2 mt-2">
                        <div className="relative z-10 text-center">
                            <span className="text-xs font-bold bg-blue-500/50 px-3 py-1 rounded-full border border-blue-400/30">✨ اسم اليوم</span>
                            <h2 className="font-amiri text-5xl font-black mt-3 mb-1 drop-shadow-md">{dailyName.name}</h2>
                            <p className="text-blue-100 text-sm font-medium opacity-90">{dailyName.meaning}</p>
                            <button 
                                onClick={() => openModal(dailyName)}
                                className="mt-4 text-xs font-bold bg-white text-blue-700 px-6 py-2 rounded-xl shadow-sm hover:bg-blue-50 transition"
                            >
                                التفاصيل والدعاء
                            </button>
                        </div>
                    </div>
                )}

                {/* 2. شريط البحث */}
                <div className="px-4 mb-4 sticky top-0 z-20">
                    <div className="bg-white/90 backdrop-blur shadow-sm border border-gray-200 rounded-2xl flex items-center p-3">
                        <span className="text-gray-400 ml-2">🔍</span>
                        <input 
                            type="text" 
                            placeholder="ابحث عن اسم..." 
                            className="bg-transparent border-none outline-none w-full text-gray-700 font-bold placeholder-gray-400 !p-0 !m-0"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* 3. شبكة الأسماء */}
                <div className="px-2">
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                        {filteredNames.map(n => (
                            <button 
                                key={n.id} 
                                onClick={() => openModal(n)} 
                                className="aspect-square bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center hover:border-blue-300 hover:shadow-md transition active:scale-95 group"
                            >
                                <span className="font-amiri font-black text-xl text-gray-700 group-hover:text-blue-700 transition">{n.name}</span>
                                <span className="text-[10px] text-gray-300 font-bold mt-1 group-hover:text-blue-300">#{n.id}</span>
                            </button>
                        ))}
                    </div>
                    
                    {filteredNames.length === 0 && (
                        <div className="text-center py-10 text-gray-400 font-bold">
                            لا يوجد اسم بهذا البحث 🤷‍♂️
                        </div>
                    )}
                </div>

                {/* 4. نافذة التفاصيل */}
                {CustomModal && selected && (
                    <CustomModal isOpen={!!selected} onClose={() => setSelected(null)} title={`اسم الله ( ${selected.name} )`}>
                        <div className="flex flex-col h-full space-y-4">
                            
                            <div className="text-center py-2">
                                <h2 className="font-amiri text-6xl text-blue-800 drop-shadow-sm">{selected.name}</h2>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 text-center">
                                <h3 className="text-xs font-black text-blue-400 mb-1 uppercase">المعنى</h3>
                                <p className="font-bold text-gray-700 leading-relaxed">{selected.meaning}</p>
                            </div>

                            <div className="space-y-2">
                                <div className="p-3 rounded-xl border border-dashed border-gray-300 bg-gray-50">
                                    <span className="block text-[10px] font-bold text-gray-400 mb-1">📖 الدليل القرآني</span>
                                    <p className="font-amiri text-gray-600 text-center text-lg">"{selected.verse}"</p>
                                </div>
                                <div className="p-3 rounded-xl border border-dashed border-amber-200 bg-amber-50">
                                    <span className="block text-[10px] font-bold text-amber-400 mb-1">🤲 دعاء المسألة</span>
                                    <p className="font-bold text-amber-800 text-center text-sm">"{selected.dua}"</p>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-4 mt-2">
                                <h3 className="text-center text-xs font-bold text-gray-400 mb-3">كرر الاسم بنية الذكر</h3>
                                <div className="flex items-center justify-center gap-4">
                                    <button 
                                        onClick={resetCounter} 
                                        className="w-10 h-10 rounded-full bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-500 transition"
                                        title="تصفير"
                                    >
                                        ↺
                                    </button>
                                    
                                    <button 
                                        onClick={incrementCounter}
                                        className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200 active:scale-95 transition flex flex-col items-center justify-center border-4 border-blue-100"
                                    >
                                        <span className="text-3xl font-black font-mono">{counter}</span>
                                        <span className="text-[10px] opacity-80">اضغط</span>
                                    </button>
                                </div>
                            </div>

                        </div>
                    </CustomModal>
                )}
            </div>
        );
    };

    window.AsmaHusna = AsmaHusna;
})();
