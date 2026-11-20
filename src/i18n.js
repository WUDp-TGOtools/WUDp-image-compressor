// Translations. Each key maps to [English, Русский, فارسی, 简体中文].
// Placeholders such as {n} or {name} are filled by t().

export const LANGS = [
  { code: "en", name: "English", dir: "ltr" },
  { code: "ru", name: "Русский", dir: "ltr" },
  { code: "fa", name: "فارسی", dir: "rtl" },
  { code: "zh", name: "中文", dir: "ltr" },
];

const INDEX = { en: 0, ru: 1, fa: 2, zh: 3 };

const DICT = {
  // ---------- app ----------
  "app.name": ["WUDp Image Compressor", "WUDp Image Compressor", "WUDp Image Compressor", "WUDp 图片压缩器"],

  // ---------- toolbar ----------
  "btn.add": ["Add images", "Добавить фото", "افزودن تصویر", "添加图片"],
  "btn.compress": ["Compress", "Сжать", "فشرده‌سازی", "压缩"],
  "btn.zip": ["Download ZIP", "Скачать ZIP", "دانلود ZIP", "下载 ZIP"],
  "btn.clear": ["Clear", "Очистить", "پاک‌کردن", "清空"],
  "btn.about": ["About", "О проекте", "درباره", "关于"],
  "btn.tour": ["Tour", "Обзор", "تور", "导览"],
  "btn.compressTarget": ["Compress to target", "Сжать до цели", "فشرده‌سازی تا حجم هدف", "压缩到目标大小"],
  "btn.compressImages": ["Compress images", "Сжать изображения", "فشرده‌سازی تصاویر", "压缩图片"],
  "btn.downloadSelected": ["Download selected", "Скачать выбранное", "دانلود انتخاب‌شده", "下载所选"],
  "btn.downloadAllZip": ["Download all as ZIP", "Скачать всё архивом", "دانلود همه به صورت ZIP", "全部下载为 ZIP"],
  "btn.close": ["Close", "Закрыть", "بستن", "关闭"],
  "toolbar.local": ["100% local · works offline", "100% локально · работает офлайн", "۱۰۰٪ محلی · بدون اینترنت", "100% 本地 · 支持离线"],
  "toolbar.terminal": ["Terminal", "Терминал", "ترمینال", "终端"],
  "toolbar.theme": ["Dark mode", "Тёмная тема", "حالت تاریک", "深色模式"],
  "toolbar.language": ["Language", "Язык", "زبان", "语言"],

  // ---------- files ----------
  "files.title": ["Files", "Файлы", "فایل‌ها", "文件"],
  "drop.title": ["Drop images here", "Перетащите изображения сюда", "تصاویر را اینجا رها کنید", "将图片拖放到此处"],
  "drop.hint": ["or click to choose · JPG, PNG, WebP, AVIF · 50 MB max", "или нажмите, чтобы выбрать · JPG, PNG, WebP, AVIF · до 50 МБ", "یا کلیک کنید · JPG، PNG، WebP، AVIF · حداکثر ۵۰ مگابایت", "或点击选择 · JPG、PNG、WebP、AVIF · 最大 50 MB"],
  "files.empty": ["No images yet", "Пока нет изображений", "هنوز تصویری نیست", "暂无图片"],
  "files.emptyHint": ["Add one or more images to start.", "Добавьте одно или несколько изображений.", "برای شروع یک یا چند تصویر اضافه کنید.", "添加一张或多张图片开始。"],
  "row.remove": ["Remove", "Удалить", "حذف", "移除"],
  "row.pending": ["PENDING", "ОЖИДАНИЕ", "در انتظار", "待处理"],
  "row.working": ["WORKING", "ОБРАБОТКА", "در حال کار", "处理中"],
  "row.failed": ["FAILED", "ОШИБКА", "ناموفق", "失败"],
  "row.outdated": ["OUTDATED", "УСТАРЕЛО", "منسوخ", "已过期"],

  // ---------- preview ----------
  "preview.title": ["Preview", "Предпросмотр", "پیش‌نمایش", "预览"],
  "preview.none": ["Nothing selected", "Ничего не выбрано", "چیزی انتخاب نشده", "未选择"],
  "preview.noneTitle": ["No image selected", "Изображение не выбрано", "تصویری انتخاب نشده", "未选择图片"],
  "preview.noneHint": ["Pick a file from the list to inspect it.", "Выберите файл из списка.", "یک فایل از فهرست انتخاب کنید.", "从列表中选择文件。"],
  "preview.original": ["ORIGINAL", "ОРИГИНАЛ", "اصلی", "原图"],
  "preview.optimized": ["OPTIMIZED", "СЖАТО", "بهینه‌شده", "已压缩"],
  "preview.compare": ["Compare", "Сравнение", "مقایسه", "对比"],
  "preview.processing": ["Processing…", "Обработка…", "در حال پردازش…", "处理中…"],
  "preview.outdated": ["Outdated", "Устарело", "منسوخ", "已过期"],
  "preview.outdatedNote": ["Settings changed. Compress again to update.", "Настройки изменились. Сожмите снова.", "تنظیمات تغییر کرد. دوباره فشرده کنید.", "设置已更改，请重新压缩。"],
  "preview.compressNote": ["Compress to see the optimized version.", "Сожмите, чтобы увидеть результат.", "برای دیدن نسخه‌ی بهینه، فشرده کنید.", "压缩后可查看结果。"],
  "preview.compressing": ["Compressing…", "Сжатие…", "در حال فشرده‌سازی…", "压缩中…"],
  "viewer.zoomOut": ["Zoom out (−)", "Уменьшить (−)", "کوچک‌نمایی (−)", "缩小 (−)"],
  "viewer.zoomIn": ["Zoom in (+)", "Увеличить (+)", "بزرگ‌نمایی (+)", "放大 (+)"],
  "viewer.fit": ["Fit", "По размеру", "جا به صفحه", "适应窗口"],
  "viewer.actual": ["1:1", "1:1", "۱:۱", "1:1"],
  "viewer.hint": ["Wheel or + − to zoom · drag to pan · drag the handle to compare", "Колесо или + − для масштаба · тяните для перемещения · тяните ползунок для сравнения", "چرخ ماوس یا + − برای زوم · کشیدن برای جابه‌جایی · کشیدن دستگیره برای مقایسه", "滚轮或 +− 缩放 · 拖动平移 · 拖动手柄对比"],
  "props.button": ["Properties", "Свойства", "مشخصات", "属性"],
  "props.title": ["Image properties", "Свойства изображения", "مشخصات تصویر", "图片属性"],
  "props.original": ["Original", "Оригинал", "اصلی", "原图"],
  "props.optimized": ["Optimized", "Сжатое", "بهینه‌شده", "压缩后"],
  "props.format": ["Format", "Формат", "قالب", "格式"],
  "props.dims": ["Dimensions", "Размер", "ابعاد", "尺寸"],
  "props.mp": ["Megapixels", "Мегапиксели", "مگاپیکسل", "百万像素"],
  "props.aspect": ["Aspect ratio", "Соотношение сторон", "نسبت ابعاد", "宽高比"],
  "props.size": ["File size", "Размер файла", "حجم فایل", "文件大小"],
  "props.alpha": ["Transparency", "Прозрачность", "شفافیت", "透明度"],
  "props.modified": ["Last modified", "Изменён", "آخرین تغییر", "修改时间"],
  "props.camera": ["Camera", "Камера", "دوربین", "相机"],
  "props.taken": ["Taken", "Снято", "زمان عکس‌برداری", "拍摄时间"],
  "props.exposure": ["Exposure", "Экспозиция", "نوردهی", "曝光"],
  "props.orientation": ["Orientation", "Ориентация", "جهت", "方向"],
  "props.gps": ["Location (GPS)", "Местоположение (GPS)", "مکان (GPS)", "位置 (GPS)"],
  "props.yes": ["Yes", "Да", "بله", "是"],
  "props.no": ["No", "Нет", "خیر", "否"],
  "props.flattened": ["No (flattened)", "Нет (сведено)", "خیر (تخت شد)", "否（已拼合）"],
  "props.removed": ["removed", "удалено", "حذف شد", "已移除"],
  "props.kept": ["kept", "сохранено", "حفظ شد", "已保留"],
  "props.applied": ["applied", "применено", "اعمال شد", "已应用"],
  "props.reading": ["Reading properties…", "Чтение свойств…", "در حال خواندن مشخصات…", "正在读取属性…"],
  "props.selectHint": ["Select an image to see its properties.", "Выберите изображение, чтобы увидеть свойства.", "برای دیدن مشخصات، یک تصویر انتخاب کنید.", "选择图片以查看属性。"],
  "props.gpsFound": ["Location data found.", "Найдены данные о местоположении.", "داده‌ی مکان پیدا شد.", "发现位置信息。"],
  "props.gpsStrip": ["The output has no metadata, so the location is not copied.", "В результате нет метаданных, поэтому местоположение не копируется.", "خروجی متادیتا ندارد و مکان کپی نمی‌شود.", "输出不含元数据，位置信息不会被复制。"],
  "props.gpsKeep": ["Metadata is kept, so the location is copied into the JPEG output.", "Метаданные сохранены, поэтому местоположение копируется в JPEG.", "متادیتا حفظ شده و مکان در خروجی JPEG کپی می‌شود.", "已保留元数据，位置信息会复制到 JPEG 输出中。"],
  "props.footnote": ["Read on this device. Only the first 512 KB of a JPEG is inspected.", "Читается на этом устройстве. Анализируются первые 512 КБ JPEG.", "روی همین دستگاه خوانده می‌شود. فقط ۵۱۲ کیلوبایت ابتدای JPEG بررسی می‌شود.", "在本设备上读取，仅检查 JPEG 的前 512 KB。"],
  "props.decodeError": ["This file could not be decoded.", "Файл не удалось декодировать.", "این فایل قابل خواندن نیست.", "无法解码此文件。"],
  "props.notForFormat": ["not read for this format", "не читается для этого формата", "برای این قالب خوانده نمی‌شود", "此格式不读取"],

  // ---------- settings ----------
  "settings.title": ["Settings", "Настройки", "تنظیمات", "设置"],
  "settings.mode": ["Mode", "Режим", "حالت", "模式"],
  "settings.simple": ["Simple", "Простой", "ساده", "简单"],
  "settings.advanced": ["Advanced", "Расширенный", "پیشرفته", "高级"],
  "settings.target": ["Target size", "Целевой размер", "حجم هدف", "目标大小"],
  "settings.useTarget": ["Use target", "Использовать цель", "استفاده از حجم هدف", "使用目标大小"],
  "settings.unit": ["Target unit", "Единица", "واحد", "单位"],
  "settings.presets": ["Presets", "Пресеты", "پیش‌تنظیم‌ها", "预设"],
  "settings.format": ["Output format", "Формат результата", "قالب خروجی", "输出格式"],
  "settings.quality": ["Quality", "Качество", "کیفیت", "质量"],
  "settings.jpegBg": ["JPEG background", "Фон JPEG", "پس‌زمینه‌ی JPEG", "JPEG 背景色"],
  "settings.metadata": ["Remove metadata", "Удалять метаданные", "حذف متادیتا", "移除元数据"],
  "settings.metaKeepNote": ["Keeps EXIF (camera, date, location) in JPEG output only.", "Сохраняет EXIF (камера, дата, место) только в JPEG.", "EXIF (دوربین، تاریخ، مکان) را فقط در خروجی JPEG نگه می‌دارد.", "仅在 JPEG 输出中保留 EXIF（相机、日期、位置）。"],
  "settings.keep": ["Dimensions are always preserved.", "Размеры всегда сохраняются.", "ابعاد همیشه حفظ می‌شود.", "尺寸始终保持不变。"],
  "settings.local": ["Same dimensions. Processed on this device, nothing uploaded.", "Размеры сохраняются. Обработка на устройстве, без загрузки.", "ابعاد حفظ می‌شود. پردازش روی دستگاه، بدون بارگذاری.", "尺寸保持不变。在本设备处理，不会上传。"],
  "hint.targetBest": ["Best effort: finds the highest quality under this size.", "Наилучший результат: подбирает максимальное качество в пределах размера.", "تلاش بهینه: بالاترین کیفیت زیر این حجم را پیدا می‌کند.", "尽力而为：在此大小内找到最高质量。"],
  "hint.targetOff": ["Off: the quality slider sets the file size.", "Выключено: размер задаёт ползунок качества.", "خاموش: کشوی کیفیت حجم را تعیین می‌کند.", "关闭：质量滑块决定文件大小。"],
  "hint.targetPng": ["PNG is lossless, so a target size does not apply.", "PNG без потерь, поэтому целевой размер не применяется.", "PNG بدون افت است، پس حجم هدف اعمال نمی‌شود.", "PNG 为无损格式，不适用目标大小。"],
  "hint.qualityAuto": ["Chosen automatically while a target size is set.", "Подбирается автоматически при заданной цели.", "با تنظیم حجم هدف، خودکار انتخاب می‌شود.", "设置目标大小时自动选择。"],
  "hint.qualityManual": ["Lower quality means a smaller file.", "Ниже качество — меньше файл.", "کیفیت پایین‌تر یعنی فایل کوچک‌تر.", "质量越低，文件越小。"],
  "hint.qualityPng": ["PNG is lossless. Quality does not apply.", "PNG без потерь. Качество не применяется.", "PNG بدون افت است. کیفیت اعمال نمی‌شود.", "PNG 为无损格式，不适用质量设置。"],
  "fmt.webp": ["Best balance of size and quality for the web.", "Лучший баланс размера и качества для веба.", "بهترین تعادل حجم و کیفیت برای وب.", "网页的最佳大小与质量平衡。"],
  "fmt.jpeg": ["Good for photographs. No transparency.", "Подходит для фото. Без прозрачности.", "مناسب عکس. بدون شفافیت.", "适合照片，不支持透明。"],
  "fmt.avif": ["Smallest files. Encoding takes a little longer.", "Самые маленькие файлы. Кодирование немного дольше.", "کوچک‌ترین فایل‌ها. رمزگذاری کمی بیشتر طول می‌کشد.", "文件最小，编码稍慢。"],
  "fmt.avifNo": ["AVIF is not supported by this browser.", "AVIF не поддерживается этим браузером.", "این مرورگر از AVIF پشتیبانی نمی‌کند.", "此浏览器不支持 AVIF。"],
  "fmt.png": ["Lossless. Keeps every pixel and transparency.", "Без потерь. Сохраняет каждый пиксель и прозрачность.", "بدون افت. هر پیکسل و شفافیت را نگه می‌دارد.", "无损，保留每个像素与透明度。"],

  // ---------- results ----------
  "results.title": ["Results", "Результаты", "نتایج", "结果"],
  "results.none": ["Compress images to see your savings.", "Сожмите изображения, чтобы увидеть экономию.", "برای دیدن میزان صرفه‌جویی، تصاویر را فشرده کنید.", "压缩图片后可查看节省空间。"],
  "results.saved": ["{size} saved across {n} file(s).", "Экономия {size} по {n} файлам.", "{size} صرفه‌جویی در {n} فایل.", "{n} 个文件共节省 {size}。"],
  "results.added": ["{size} added across {n} file(s).", "Добавлено {size} по {n} файлам.", "{size} افزوده شد در {n} فایل.", "{n} 个文件共增加 {size}。"],
  "results.original": ["Original", "Оригинал", "اصلی", "原图"],
  "results.optimized": ["Optimized", "Сжатое", "بهینه‌شده", "压缩后"],
  "facts.encoding": ["Encoding", "Кодирование", "رمزگذاری", "编码"],
  "results.saved_label": ["Total saved", "Всего экономии", "کل صرفه‌جویی", "总节省"],

  // ---------- status & toasts ----------
  "status.ready": ["Ready. Add images to begin.", "Готово. Добавьте изображения.", "آماده. برای شروع تصاویر را اضافه کنید.", "就绪。添加图片开始。"],
  "status.summary": ["{n} file(s) · {size} · ready", "Файлов: {n} · {size} · готово", "{n} فایل · {size} · آماده", "{n} 个文件 · {size} · 就绪"],
  "status.compressing": ["Compressing {done} of {total}…", "Сжатие {done} из {total}…", "در حال فشرده‌سازی {done} از {total}…", "正在压缩 {done}/{total}…"],
  "status.finished": ["Finished: {ok} of {total} optimized{failed}{unreach}.", "Готово: {ok} из {total}{failed}{unreach}.", "پایان: {ok} از {total} بهینه شد{failed}{unreach}.", "完成：{total} 个中 {ok} 个已优化{failed}{unreach}。"],
  "status.failed": [", {n} failed", ", ошибок: {n}", "، {n} ناموفق", "，{n} 个失败"],
  "status.aboveTarget": [", {n} above target", ", {n} выше цели", "، {n} بالاتر از حجم هدف", "，{n} 个超出目标"],
  "status.building": ["Building ZIP…", "Создаётся ZIP…", "در حال ساخت ZIP…", "正在生成 ZIP…"],
  "toast.notImage": ["{name}: not an image file.", "{name}: это не изображение.", "{name}: فایل تصویری نیست.", "{name}：不是图片文件。"],
  "toast.tooBig": ["{name}: larger than 50 MB.", "{name}: больше 50 МБ.", "{name}: بزرگ‌تر از ۵۰ مگابایت است.", "{name}：超过 50 MB。"],
  "toast.added": ["Added {n} image(s).", "Добавлено: {n}.", "{n} تصویر اضافه شد.", "已添加 {n} 张图片。"],
  "toast.busy": ["Wait for compression to finish first.", "Сначала дождитесь окончания сжатия.", "ابتدا پایان فشرده‌سازی را صبر کنید.", "请等待压缩完成。"],
  "toast.removeBusy": ["This image is being compressed right now.", "Это изображение сейчас сжимается.", "این تصویر در حال فشرده‌سازی است.", "此图片正在压缩中。"],
  "toast.alreadyBusy": ["Already compressing. Please wait.", "Уже идёт сжатие. Подождите.", "فشرده‌سازی در جریان است. صبر کنید.", "正在压缩，请稍候。"],
  "toast.noFiles": ["No files to compress. Add images first.", "Нет файлов для сжатия. Сначала добавьте изображения.", "فایلی برای فشرده‌سازی نیست. ابتدا تصویر اضافه کنید.", "没有可压缩的文件，请先添加图片。"],
  "toast.optimized": ["Everything is already optimized with these settings.", "Всё уже сжато с этими настройками.", "همه‌ی فایل‌ها با این تنظیمات بهینه شده‌اند.", "使用当前设置，所有文件已优化。"],
  "toast.enterTarget": ["Enter a target size greater than 0.", "Введите целевой размер больше 0.", "حجم هدف را بزرگ‌تر از صفر وارد کنید.", "请输入大于 0 的目标大小。"],
  "toast.unsupported": ["{format} is not supported by this browser.", "{format} не поддерживается этим браузером.", "این مرورگر از {format} پشتیبانی نمی‌کند.", "此浏览器不支持 {format}。"],
  "toast.zipDone": ["ZIP ready with {n} file(s).", "ZIP готов: файлов {n}.", "ZIP آماده است با {n} فایل.", "ZIP 已就绪，共 {n} 个文件。"],
  "toast.zipFail": ["Could not create ZIP: {msg}", "Не удалось создать ZIP: {msg}", "ساخت ZIP ناموفق بود: {msg}", "无法生成 ZIP：{msg}"],
  "toast.noResults": ["No results to zip. Compress first.", "Нет результатов для архива. Сначала сожмите.", "نتیجه‌ای برای ZIP نیست. ابتدا فشرده کنید.", "没有可打包的结果，请先压缩。"],
  "toast.noResultSel": ["No result for the selected file. Compress first.", "Нет результата для выбранного файла. Сначала сожмите.", "برای فایل انتخاب‌شده نتیجه‌ای نیست. ابتدا فشرده کنید.", "所选文件没有结果，请先压缩。"],
  "toast.saved": ["Saved {name}", "Сохранено: {name}", "ذخیره شد: {name}", "已保存 {name}"],
  "toast.cleared": ["Cleared {n} file(s).", "Очищено файлов: {n}.", "{n} فایل پاک شد.", "已清空 {n} 个文件。"],
  "toast.removed": ["Removed {name}", "Удалено: {name}", "حذف شد: {name}", "已移除 {name}"],

  // ---------- tour ----------
  "tour.next": ["Next", "Далее", "بعدی", "下一步"],
  "tour.back": ["Back", "Назад", "قبلی", "上一步"],
  "tour.skip": ["Skip", "Пропустить", "رد کردن", "跳过"],
  "tour.done": ["Finish", "Готово", "پایان", "完成"],
  "tour.step": ["Step {i} of {n}", "Шаг {i} из {n}", "مرحله {i} از {n}", "第 {i}/{n} 步"],
  "tour.1": ["Start here. Add images with this button, drag them onto the window, or paste them.", "Начните здесь: добавьте изображения кнопкой, перетащите их в окно или вставьте.", "از اینجا شروع کنید. تصاویر را با این دکمه اضافه کنید، روی پنجره بکشید یا paste کنید.", "从这里开始：用此按钮添加图片，或拖入窗口，或直接粘贴。"],
  "tour.2": ["Your queue. Each file shows its status. Click a row to preview it, × removes it.", "Очередь. Каждый файл показывает статус. Нажмите строку для предпросмотра, × удаляет.", "صف فایل‌ها. هر فایل وضعیتش را نشان می‌دهد. برای پیش‌نمایش روی ردیف کلیک کنید؛ × حذفش می‌کند.", "文件队列。每个文件显示状态；点击行可预览，× 可移除。"],
  "tour.3": ["The preview. Wheel to zoom, drag to pan, and drag the round handle to compare before and after.", "Предпросмотр. Колесо — масштаб, тяните — перемещение, ползунок — сравнение до и после.", "پیش‌نمایش. چرخ ماوس برای زوم، کشیدن برای جابه‌جایی و کشیدن دستگیره برای مقایسه‌ی قبل و بعد.", "预览区。滚轮缩放，拖动平移，拖动圆形手柄对比前后。"],
  "tour.4": ["Zoom controls. Use − and + or the keys 0 (fit) and 1 (100%) to inspect fine detail.", "Масштаб: − и +, клавиши 0 (по размеру) и 1 (100%) помогают увидеть детали.", "کنترل زوم: − و +، یا کلیدهای ۰ (جا به صفحه) و ۱ (۱۰۰٪) برای دیدن جزئیات.", "缩放控制：− 和 +，或按 0（适应）、1（100%）查看细节。"],
  "tour.5": ["Properties show dimensions, transparency, file info and, for JPEG, camera and location data.", "Свойства: размеры, прозрачность, файл и для JPEG — камера и местоположение.", "مشخصات: ابعاد، شفافیت، اطلاعات فایل و برای JPEG، دوربین و مکان.", "属性：尺寸、透明度、文件信息，以及 JPEG 的相机与位置信息。"],
  "tour.6": ["Simple mode asks only for a target size. Advanced mode adds quality and the target switch.", "Простой режим — только целевой размер. Расширенный — качество и переключатель цели.", "حالت ساده فقط حجم هدف می‌خواهد. حالت پیشرفته کیفیت و کلید حجم هدف را هم دارد.", "简单模式只需目标大小；高级模式增加质量与目标开关。"],
  "tour.7": ["Output format. WebP is smallest for the web; JPEG suits photos; PNG (advanced) is lossless.", "Формат: WebP — меньше для веба; JPEG — для фото; PNG (расширенный) — без потерь.", "قالب خروجی: WebP برای وب کوچک‌ترین است؛ JPEG برای عکس؛ PNG (پیشرفته) بدون افت است.", "输出格式：WebP 对网页最小，JPEG 适合照片，PNG（高级）为无损。"],
  "tour.8": ["Remove metadata is on by default. Turn it off to keep camera and date info in JPEG output.", "По умолчанию метаданные удаляются. Выключите, чтобы сохранить данные камеры и дату в JPEG.", "حذف متادیتا به‌طور پیش‌فرض روشن است. برای نگه‌داشتن اطلاعات دوربین و تاریخ در JPEG خاموشش کنید.", "默认移除元数据。关闭后可在 JPEG 输出中保留相机与日期信息。"],
  "tour.9": ["Press Compress. Everything runs on this device, and nothing is uploaded.", "Нажмите «Сжать». Всё работает на этом устройстве, ничего не загружается.", "فشرده‌سازی را بزنید. همه‌چیز روی همین دستگاه انجام می‌شود و چیزی بارگذاری نمی‌شود.", "点击压缩。全部在本设备完成，不会上传。"],
  "tour.10": ["Results show total savings. Download one file, or all of them as a ZIP.", "Здесь общая экономия. Скачайте один файл или все архивом ZIP.", "نتایج، کل صرفه‌جویی را نشان می‌دهند. یک فایل یا همه را به صورت ZIP دانلود کنید.", "结果显示总节省空间。可下载单个文件，或全部打包为 ZIP。"],
  "tour.11": ["The terminal runs the same operations with commands. Type help to see them.", "Терминал выполняет те же действия командами. Введите help, чтобы увидеть список.", "ترمینال همین کارها را با دستور انجام می‌دهد. برای دیدن دستورها help بنویسید.", "终端用命令执行相同操作，输入 help 查看列表。"],
  "tour.12": ["Choose your language here. Dark mode is the moon button, and About explains how the app works.", "Здесь выберите язык. Тёмная тема — кнопка с луной, а «О проекте» описывает устройство.", "زبان را از اینجا انتخاب کنید. حالت تاریک دکمه‌ی ماه است و «درباره» توضیح می‌دهد برنامه چطور کار می‌کند.", "在此选择语言。深色模式是月亮按钮，“关于”说明应用的工作方式。"],

  // ---------- tooltips ----------
  "help.add": ["Add images from your device (or paste / drop them).", "Добавить изображения с устройства (или вставить / перетащить).", "افزودن تصاویر از دستگاه (یا paste / کشیدن و رها کردن).", "从设备添加图片（也可粘贴或拖入）。"],
  "help.compress": ["Compress all files that are new or changed with the current settings.", "Сжать все новые или изменённые файлы с текущими настройками.", "فشرده‌سازی فایل‌های جدید یا تغییرکرده با تنظیمات فعلی.", "用当前设置压缩所有新增或已更改的文件。"],
  "help.zip": ["Download every result in one ZIP archive.", "Скачать все результаты одним ZIP-архивом.", "دانلود همه‌ی نتایج در یک فایل ZIP.", "将所有结果打包为一个 ZIP 下载。"],
  "help.clear": ["Remove all files from the queue.", "Удалить все файлы из очереди.", "حذف همه‌ی فایل‌ها از صف.", "清空队列中的所有文件。"],
  "help.terminal": ["Open the command terminal (Ctrl + `).", "Открыть терминал команд (Ctrl + `).", "باز کردن ترمینال دستورها (Ctrl + `).", "打开命令终端（Ctrl + `）。"],
  "help.theme": ["Switch between light and dark mode.", "Переключить светлую и тёмную тему.", "تغییر بین حالت روشن و تاریک.", "切换浅色与深色模式。"],
  "help.about": ["About the project, its architecture and sources.", "О проекте, его архитектуре и источниках.", "درباره‌ی پروژه، معماری و منابع آن.", "关于项目、架构与参考资料。"],
  "help.tour": ["Start a short guided tour of the interface.", "Запустить короткий обзор интерфейса.", "شروع یک تور کوتاه از رابط کاربری.", "开始界面的简短导览。"],
  "help.lang": ["Interface language.", "Язык интерфейса.", "زبان رابط کاربری.", "界面语言。"],
  "help.drop": ["Click or drop image files here.", "Нажмите или перетащите сюда файлы изображений.", "کلیک کنید یا فایل‌های تصویری را اینجا رها کنید.", "点击或将图片拖放到此处。"],
  "help.remove": ["Remove this file from the queue.", "Удалить этот файл из очереди.", "حذف این فایل از صف.", "从队列中移除此文件。"],
  "help.zoomIn": ["Zoom in (also: + key or mouse wheel up).", "Увеличить (клавиша + или колесо вверх).", "بزرگ‌نمایی (کلید + یا چرخ ماوس به بالا).", "放大（也可按 + 或向上滚动滚轮）。"],
  "help.zoomOut": ["Zoom out (also: − key or mouse wheel down).", "Уменьшить (клавиша − или колесо вниз).", "کوچک‌نمایی (کلید − یا چرخ ماوس به پایین).", "缩小（也可按 − 或向下滚动滚轮）。"],
  "help.fit": ["Fit the whole image into the preview (key 0).", "Вписать всё изображение в предпросмотр (клавиша 0).", "کل تصویر را در پیش‌نمایش جا می‌دهد (کلید ۰).", "使整张图片适应预览区（按 0）。"],
  "help.actual": ["Show real pixels, 100% (key 1).", "Показать реальные пиксели, 100% (клавиша 1).", "نمایش پیکسل‌های واقعی، ۱۰۰٪ (کلید ۱).", "显示实际像素，100%（按 1）。"],
  "help.props": ["Show or hide image properties.", "Показать или скрыть свойства изображения.", "نمایش یا پنهان کردن مشخصات تصویر.", "显示或隐藏图片属性。"],
  "help.handle": ["Drag to compare the original and the optimized image. Arrow keys also work.", "Тяните, чтобы сравнить оригинал и сжатое. Работают и стрелки.", "برای مقایسه‌ی اصلی و بهینه بکشید. کلیدهای جهت‌نما هم کار می‌کنند.", "拖动以对比原图与压缩图，方向键也可用。"],
  "help.stage": ["Preview. Wheel or pinch to zoom, drag to pan, double-click to toggle fit / 100%.", "Предпросмотр. Колесо или pinch — масштаб, тяните — перемещение, двойной щелчок — по размеру / 100%.", "پیش‌نمایش. چرخ یا pinch برای زوم، کشیدن برای جابه‌جایی، دوبار کلیک برای جا به صفحه / ۱۰۰٪.", "预览。滚轮或双指缩放，拖动平移，双击切换适应/100%。"],
  "help.modeSimple": ["Only a target size is needed.", "Нужен только целевой размер.", "فقط حجم هدف لازم است.", "只需设置目标大小。"],
  "help.modeAdvanced": ["Quality, target switch, PNG and JPEG background.", "Качество, переключатель цели, PNG и фон JPEG.", "کیفیت، کلید حجم هدف، PNG و پس‌زمینه‌ی JPEG.", "质量、目标开关、PNG 与 JPEG 背景。"],
  "help.target": ["Maximum file size per image. Enter a number and choose KB or MB.", "Максимальный размер файла на изображение. Введите число и выберите KB или MB.", "حداکثر حجم هر فایل. عدد و واحد KB یا MB را وارد کنید.", "每张图片的最大文件大小，输入数字并选择 KB 或 MB。"],
  "help.targetToggle": ["Turn the target size on or off (advanced mode).", "Включить или выключить целевой размер (расширенный режим).", "روشن یا خاموش کردن حجم هدف (حالت پیشرفته).", "开启或关闭目标大小（高级模式）。"],
  "help.presets": ["Quick target sizes.", "Быстрые целевые размеры.", "حجم‌های هدف سریع.", "快速目标大小。"],
  "help.fmtWebp": ["WebP: smallest files for the web.", "WebP: самые маленькие файлы для веба.", "WebP: کوچک‌ترین فایل برای وب.", "WebP：网页用途的最小文件。"],
  "help.fmtJpeg": ["JPEG: universal, good for photos, no transparency.", "JPEG: универсальный, для фото, без прозрачности.", "JPEG: همه‌جا‌پذیر، مناسب عکس، بدون شفافیت.", "JPEG：通用，适合照片，不支持透明。"],
  "help.fmtAvif": ["AVIF: most efficient, newest browsers only.", "AVIF: самый эффективный, только в новых браузерах.", "AVIF: بهینه‌ترین، فقط در مرورگرهای جدید.", "AVIF：压缩效率最高，仅新版浏览器支持。"],
  "help.fmtPng": ["PNG: lossless, keeps every pixel (advanced).", "PNG: без потерь, сохраняет каждый пиксель (расширенный).", "PNG: بدون افت، هر پیکسل را نگه می‌دارد (پیشرفته).", "PNG：无损，保留每个像素（高级）。"],
  "help.quality": ["Higher quality means a larger file. Used when target size is off.", "Выше качество — больше файл. Работает, когда цель выключена.", "کیفیت بالاتر یعنی فایل بزرگ‌تر. وقتی حجم هدف خاموش است استفاده می‌شود.", "质量越高文件越大。仅在目标大小关闭时生效。"],
  "help.jpegBg": ["Color used behind transparent areas when saving JPEG.", "Цвет под прозрачными областями при сохранении JPEG.", "رنگ پشت نواحی شفاف هنگام ذخیره‌ی JPEG.", "保存 JPEG 时透明区域使用的背景色。"],
  "help.metadata": ["On: remove camera, date and location data. Off: keep EXIF in JPEG output.", "Вкл.: удалить данные камеры, даты и местоположения. Выкл.: сохранить EXIF в JPEG.", "روشن: داده‌های دوربین، تاریخ و مکان حذف می‌شود. خاموش: EXIF در خروجی JPEG نگه داشته می‌شود.", "开启：移除相机、日期与位置信息。关闭：在 JPEG 中保留 EXIF。"],
  "help.downloadSelected": ["Download the selected file's result.", "Скачать результат выбранного файла.", "دانلود نتیجه‌ی فایل انتخاب‌شده.", "下载所选文件的结果。"],
  "help.savings": ["Total size reduction across all compressed files.", "Общее уменьшение размера по всем сжатым файлам.", "کل کاهش حجم در همه‌ی فایل‌های فشرده‌شده.", "所有已压缩文件的总体积缩减。"],

  // ---------- about ----------
  "about.title": ["About WUDp Image Compressor", "О WUDp Image Compressor", "درباره‌ی WUDp Image Compressor", "关于 WUDp 图片压缩器"],
  "about.whyTitle": ["Why this tool exists", "Зачем нужен этот инструмент", "چرا این ابزار ساخته شد", "为什么做这个工具"],
  "about.why": ["I built this for my office work. I often had to upload a photo that had to stay under a specific file size, and the tools I found either sent my files to a server or made me guess quality values until the size was right. I wanted something quick that runs on my own device, keeps the image private, and reaches a target size in one step.", "Я сделал это для работы в офисе. Часто нужно было загрузить фото строго определённого размера, а найденные инструменты либо отправляли файлы на сервер, либо заставляли угадывать качество. Мне нужен был быстрый инструмент, который работает на моём устройстве, сохраняет приватность и сразу попадает в нужный размер.", "من این ابزار را برای کار اداری ساختم. گاهی باید عکسی را آپلود می‌کردم که حجمش باید زیر یک مقدار مشخص می‌ماند، و ابزارهایی که پیدا می‌کردم یا فایل را به سرور می‌فرستادند یا مجبورم می‌کردند کیفیت را حدس بزنم. می‌خواستم چیزی سریع داشته باشم که روی دستگاه خودم اجرا شود، عکس را خصوصی نگه دارد و در یک مرحله به حجم هدف برسد.", "我为办公工作做了这个工具。常常需要上传一张有明确大小限制的照片，而我找到的工具要么把文件发到服务器，要么让我反复猜测质量参数。我想要一个快速的工具：在自己的设备上运行，保护图片隐私，并一步达到目标大小。"],
  "about.archTitle": ["Architecture and how it works", "Архитектура и принцип работы", "معماری و نحوه‌ی کار", "架构与工作原理"],
  "about.tabOverview": ["Overview", "Обзор", "مرور کلی", "概览"],
  "about.tabArch": ["Architecture", "Архитектура", "معماری", "架构"],
  "about.live": ["Open the app online", "Открыть приложение онлайн", "باز کردن برنامه‌ی آنلاین", "在线打开应用"],
  "about.repo": ["Repository", "Репозиторий", "مخزن", "代码仓库"],
  "arch.diagram": ["diagram", "схема", "نمودار", "示意图"],
  "arch.1.title": ["Big picture", "Общая картина", "نمای کلی", "整体概览"],
  "arch.1.text": ["WUDp Image Compressor is a static web app. Its HTML, CSS and JavaScript files are served as they are from GitHub Pages. There is no backend, no build step and no framework. All image work runs in the user's browser, so the server only delivers files once.", "WUDp Image Compressor — статическое веб-приложение. Файлы HTML, CSS и JavaScript отдаются как есть с GitHub Pages. Нет бэкенда, нет этапа сборки и нет фреймворка. Вся работа с изображениями выполняется в браузере пользователя, поэтому сервер только один раз отдаёт файлы.", "WUDp Image Compressor یک برنامه‌ی وب ایستا است. فایل‌های HTML، CSS و جاوااسکریپت همان‌طور که هستند از GitHub Pages ارائه می‌شوند. بک‌اند، مرحله‌ی build و فریم‌ورک ندارد. تمام پردازش تصویر در مرورگر کاربر انجام می‌شود و سرور فقط یک بار فایل‌ها را می‌دهد.", "WUDp 图片压缩器是一个静态网页应用。HTML、CSS 和 JavaScript 文件原样由 GitHub Pages 提供。没有后端，没有构建步骤，也没有框架。所有图片处理都在用户浏览器中完成，服务器只需提供一次文件。"],
  "arch.2.title": ["Modules", "Модули", "ماژول‌ها", "模块划分"],
  "arch.2.text": ["The code is split into small ES modules. index.html loads them through one entry point, src/app.js. Each module has one job; modules talk through function calls and messages, not shared globals.", "Код разбит на небольшие ES-модули. index.html подключает их через одну точку входа, src/app.js. У каждого модуля одна задача; они общаются вызовами функций и сообщениями, а не общими глобальными переменными.", "کد به ماژول‌های کوچک ES تقسیم شده که index.html از طریق یک نقطه‌ی ورود، یعنی src/app.js، آن‌ها را بار می‌کند. هر ماژول یک کار مشخص دارد و با فراخوانی تابع و پیام ارتباط برقرار می‌کند، نه با متغیرهای سراسری مشترک.", "代码被拆分为小型 ES 模块，index.html 通过唯一入口 src/app.js 加载它们。每个模块职责单一，模块之间通过函数调用和消息通信，而不是共享全局变量。"],
  "arch.mod1": ["app.js: application state; rendering of the queue, preview, settings and results; event wiring; the API used by the terminal.", "app.js: состояние приложения; отрисовка очереди, предпросмотра, настроек и результатов; обработка событий; API для терминала.", "app.js: وضعیت برنامه؛ نمایش صف، پیش‌نمایش، تنظیمات و نتایج؛ مدیریت رویدادها؛ API مورد استفاده‌ی ترمینال.", "app.js：应用状态；渲染队列、预览、设置与结果；事件绑定；供终端调用的 API。"],
  "arch.mod2": ["worker.js: runs in a Web Worker. Decodes the file, draws it on an OffscreenCanvas, encodes it, and copies metadata when asked.", "worker.js: работает в Web Worker. Декодирует файл, рисует его на OffscreenCanvas, кодирует и при необходимости копирует метаданные.", "worker.js: در Web Worker اجرا می‌شود. فایل را رمزگشایی می‌کند، روی OffscreenCanvas می‌کشد، رمزگذاری می‌کند و در صورت نیاز متادیتا را کپی می‌کند.", "worker.js：在 Web Worker 中运行。解码文件，绘制到 OffscreenCanvas，编码，并在需要时复制元数据。"],
  "arch.mod3": ["search.js: a pure function that finds the highest JPEG, WebP or AVIF quality under a target size. It uses no browser APIs, so it is easy to test.", "search.js: чистая функция, которая находит наибольшее качество JPEG, WebP или AVIF в пределах целевого размера. Не использует API браузера, поэтому её легко тестировать.", "search.js: تابع خالص که بالاترین کیفیت JPEG، WebP یا AVIF زیر حجم هدف را پیدا می‌کند. به API مرورگر وابسته نیست و تست آن ساده است.", "search.js：纯函数，在目标大小内找到 JPEG、WebP 或 AVIF 的最高质量。不依赖浏览器 API，便于测试。"],
  "arch.mod4": ["viewer.js: before and after comparison. Zoom, pan, the split handle and pinch gestures all act on one transformed layer.", "viewer.js: сравнение до и после. Масштаб, перемещение, ползунок и жест pinch работают на одном преобразуемом слое.", "viewer.js: مقایسه‌ی قبل و بعد. زوم، جابه‌جایی، دستگیره و ژست pinch روی یک لایه‌ی تبدیل‌شونده عمل می‌کنند.", "viewer.js：前后对比。缩放、平移、分割手柄和双指缩放都作用于同一个变换图层。"],
  "arch.mod5": ["props.js: reads image properties and includes a small EXIF parser. Copies and cleans EXIF segments for JPEG output.", "props.js: читает свойства изображения и содержит небольшой парсер EXIF. Копирует и очищает сегменты EXIF для JPEG.", "props.js: مشخصات تصویر را می‌خواند و یک تجزیه‌گر کوچک EXIF دارد. بخش‌های EXIF را برای خروجی JPEG کپی و پاک‌سازی می‌کند.", "props.js：读取图片属性，并包含一个小型 EXIF 解析器；为 JPEG 输出复制并清理 EXIF 段。"],
  "arch.mod6": ["zip.js: builds ZIP archives in the browser (STORE method, UTF-8 file names, CRC-32).", "zip.js: создаёт ZIP-архивы в браузере (метод STORE, имена в UTF-8, CRC-32).", "zip.js: آرشیو ZIP را در مرورگر می‌سازد (روش STORE، نام‌های UTF-8، CRC-32).", "zip.js：在浏览器中生成 ZIP 压缩包（STORE 方式、UTF-8 文件名、CRC-32）。"],
  "arch.mod7": ["terminal.js: the command-line front end. Parses commands and calls the same API the buttons use.", "terminal.js: командная строка. Разбирает команды и вызывает тот же API, что и кнопки.", "terminal.js: رابط خط فرمان. دستورها را تجزیه می‌کند و همان API دکمه‌ها را صدا می‌زند.", "terminal.js：命令行前端。解析命令并调用按钮使用的同一套 API。"],
  "arch.mod8": ["i18n.js, tour.js, help.js: translations (EN, RU, FA, ZH), the guided tour and hover help.", "i18n.js, tour.js, help.js: переводы (EN, RU, FA, ZH), пошаговый тур и подсказки при наведении.", "i18n.js، tour.js، help.js: ترجمه‌ها (EN، RU، FA، ZH)، تور راهنما و توضیح هنگام نشانگر ماوس.", "i18n.js、tour.js、help.js：翻译（EN、RU、FA、ZH）、引导导览与悬停提示。"],
  "arch.mod9": ["sw.js: service worker that caches the app shell for offline use.", "sw.js: service worker, который кэширует оболочку приложения для работы офлайн.", "sw.js: Service Worker که پوسته‌ی برنامه را برای کار آفلاین ذخیره می‌کند.", "sw.js：Service Worker，缓存应用外壳以支持离线使用。"],
  "arch.3.title": ["Processing pipeline", "Конвейер обработки", "مسیر پردازش", "处理流程"],
  "arch.3.text": ["When you press Compress, each file goes through these steps. (1) The file is read as a Blob and decoded with createImageBitmap, which also applies the EXIF orientation. (2) The pixels are drawn on an OffscreenCanvas; for JPEG, a background color fills transparent areas because JPEG has no alpha. (3) The canvas is encoded to the chosen format, either once at a fixed quality or several times by the target search. (4) If metadata is kept and the output is JPEG, the original EXIF segment is copied with its orientation reset. (5) The result Blob returns to the main thread, where it is stored, gets an object URL for the preview, and updates the results.", "При нажатии «Сжать» каждый файл проходит шаги. (1) Файл читается как Blob и декодируется через createImageBitmap, который также учитывает ориентацию EXIF. (2) Пиксели рисуются на OffscreenCanvas; для JPEG прозрачные области заливаются цветом фона, так как у JPEG нет альфа-канала. (3) Холст кодируется в выбранный формат: либо один раз с фиксированным качеством, либо несколько раз поиском по целевому размеру. (4) Если метаданные сохраняются и результат — JPEG, исходный сегмент EXIF копируется со сброшенной ориентацией. (5) Готовый Blob возвращается в основной поток: он сохраняется, получает object URL для предпросмотра и обновляет результаты.", "وقتی «فشرده‌سازی» را می‌زنید، هر فایل این مراحل را طی می‌کند. (۱) فایل به‌صورت Blob خوانده و با createImageBitmap رمزگشایی می‌شود که جهت EXIF را هم اعمال می‌کند. (۲) پیکسل‌ها روی OffscreenCanvas کشیده می‌شوند؛ برای JPEG، نواحی شفاف با رنگ پس‌زمینه پر می‌شوند چون JPEG کانال آلفا ندارد. (۳) بوم به قالب انتخابی رمزگذاری می‌شود، یک‌بار با کیفیت ثابت یا چند بار با جستجوی حجم هدف. (۴) اگر متادیتا نگه داشته شود و خروجی JPEG باشد، بخش EXIF اصلی با جهت ریست‌شده کپی می‌شود. (۵) Blob نتیجه به رشته‌ی اصلی برمی‌گردد، ذخیره می‌شود، object URL برای پیش‌نمایش می‌گیرد و نتایج را به‌روز می‌کند.", "点击“压缩”后，每个文件依次经过以下步骤。(1) 文件以 Blob 读取，并通过 createImageBitmap 解码（同时应用 EXIF 方向）。(2) 像素绘制到 OffscreenCanvas 上；输出 JPEG 时用背景色填充透明区域，因为 JPEG 没有透明通道。(3) 画布按所选格式编码，可以是一次固定质量编码，也可以由目标大小搜索多次编码。(4) 若保留元数据且输出为 JPEG，则复制原始 EXIF 段并重置方向。(5) 结果 Blob 返回主线程，被保存、生成用于预览的 object URL，并更新结果。"],
  "arch.4.title": ["Target-size search", "Поиск по целевому размеру", "جستجوی حجم هدف", "目标大小搜索"],
  "arch.4.text": ["A browser cannot answer “the best quality under N bytes” directly, so the app searches. It first encodes at maximum quality; if that fits, it is done. Otherwise it tests the minimum quality (5%). If even that is too large, the smallest result is reported. Otherwise a binary search narrows the quality range over nine steps and keeps the highest quality that still fits. Each image takes at most about 11 encodes.", "Браузер не умеет отвечать на вопрос «лучшее качество до N байт», поэтому приложение ищет. Сначала кодирование идёт при максимальном качестве; если результат помещается — готово. Иначе проверяется минимальное качество (5%). Если и оно слишком большое, выводится наименьший результат. Иначе двоичный поиск за девять шагов сужает диапазон качества, сохраняя наибольшее, которое ещё помещается. На одно изображение приходится не более примерно 11 кодирований.", "مرورگر نمی‌تواند مستقیم «بهترین کیفیت زیر N بایت» را بدهد، پس برنامه جستجو می‌کند. ابتدا با بیشترین کیفیت رمزگذاری می‌کند و اگر جا شد تمام است. وگرنه کمترین کیفیت (۵٪) را امتحان می‌کند. اگر آن هم بزرگ بود، کوچک‌ترین خروجی گزارش می‌شود. در غیر این صورت جستجوی دودویی در نُه مرحله بازه‌ی کیفیت را باریک می‌کند و بزرگ‌ترین کیفیتی را که هنوز جا می‌شود نگه می‌دارد. برای هر تصویر حداکثر حدود ۱۱ رمزگذاری انجام می‌شود.", "浏览器无法直接回答“在 N 字节以内的最佳质量”，因此应用会搜索。先以最高质量编码，符合即完成；否则测试最低质量（5%）；若最低质量仍过大，则报告最小结果。否则进行二分查找，在九步内缩小质量区间，保留仍然符合目标的最大质量。每张图片最多约 11 次编码。"],
  "arch.5.title": ["Metadata", "Метаданные", "متادیتا", "元数据"],
  "arch.5.text": ["Canvas output contains no metadata, so removing it is the default. Keeping metadata is a deliberate byte-level step: the app extracts the APP1 Exif segment from the original file, sets the Orientation tag to 1 (the pixels are already rotated), and inserts the segment right after the JPEG start marker. Other formats cannot carry this segment, so the option applies only to JPEG output.", "Вывод canvas не содержит метаданных, поэтому по умолчанию они удаляются. Сохранение — осознанный побайтовый шаг: приложение извлекает сегмент APP1 Exif из исходного файла, ставит тегу Orientation значение 1 (пиксели уже повёрнуты) и вставляет сегмент сразу после маркера начала JPEG. Другие форматы не могут хранить этот сегмент, поэтому опция действует только для JPEG.", "خروجی canvas متادیتا ندارد، پس حذف متادیتا رفتار پیش‌فرض است. نگه‌داشتن متادیتا یک مرحله‌ی آگاهانه در سطح بایت است: برنامه بخش APP1 از نوع Exif را از فایل اصلی می‌گیرد، برچسب Orientation را ۱ می‌گذارد (چون پیکسل‌ها از قبل چرخیده‌اند) و بخش را درست بعد از نشانگر شروع JPEG درج می‌کند. قالب‌های دیگر این بخش را نمی‌توانند نگه دارند، پس این گزینه فقط برای JPEG است.", "画布输出不含元数据，因此默认移除。保留元数据是一个有意的字节级操作：应用从原文件中提取 APP1 Exif 段，把 Orientation 标签设为 1（像素已旋转），并把该段插入到 JPEG 起始标记之后。其他格式无法承载此段，因此该选项仅适用于 JPEG 输出。"],
  "arch.6.title": ["Threads and memory", "Потоки и память", "نخ‌ها و حافظه", "线程与内存"],
  "arch.6.text": ["The interface never waits for heavy work. Decoding, drawing and encoding run in a Worker, and the main thread handles only small tasks. Each preview and result uses an object URL, released when a file is removed, replaced or cleared, so memory does not keep growing during a session. Files are processed one at a time to keep peak memory low.", "Интерфейс не ждёт тяжёлой работы: декодирование, рисование и кодирование выполняются в Worker, а основной поток берёт на себя только мелкие задачи. Каждый предпросмотр и результат использует object URL, который освобождается при удалении, замене или очистке, поэтому память не растёт в ходе сессии. Файлы обрабатываются по одному, чтобы ограничить пиковое потребление памяти.", "رابط کاربری هرگز منتظر کار سنگین نمی‌ماند. رمزگشایی، ترسیم و رمزگذاری در Worker اجرا می‌شوند و رشته‌ی اصلی فقط کارهای کوچک را انجام می‌دهد. هر پیش‌نمایش و نتیجه از object URL استفاده می‌کند که با حذف، جایگزینی یا پاک‌کردن فایل آزاد می‌شود تا حافظه در طول نشست بالا نرود. فایل‌ها یکی‌یکی پردازش می‌شوند تا اوج مصرف حافظه پایین بماند.", "界面从不等待重负载任务。解码、绘制和编码都在 Worker 中运行，主线程只处理轻量工作。每个预览和结果都使用 object URL，在文件被删除、替换或清空时释放，因此会话期间内存不会持续增长。文件逐个处理，以控制内存峰值。"],
  "arch.7.title": ["Preview and viewer", "Предпросмотр и просмотрщик", "پیش‌نمایش و نمایشگر", "预览与查看器"],
  "arch.7.text": ["The original and the optimized image are two layers inside one element, moved and scaled with a CSS transform. The optimized layer is clipped at the split position. Zoom and pan change only that transform, so the two images always line up, and the split line is placed from the same numbers. Above 2.5x, pixelated rendering is used so single pixels can be inspected.", "Исходное и сжатое изображения — два слоя внутри одного элемента, который перемещается и масштабируется через CSS transform. Сжатый слой обрезается по позиции разделителя. Масштаб и перемещение меняют только этот transform, поэтому два изображения всегда совпадают, а линия разделителя считается из тех же чисел. Выше 2.5× включается пиксельный рендеринг, чтобы можно было разглядеть отдельные пиксели.", "تصویر اصلی و تصویر بهینه دو لایه داخل یک عنصر هستند که با CSS transform جابه‌جا و مقیاس می‌شوند. لایه‌ی بهینه در موقعیت جداکننده برش می‌خورد. زوم و جابه‌جایی فقط همان transform را تغییر می‌دهند، پس دو تصویر همیشه هم‌راستا می‌مانند و خط جداکننده از همان اعداد محاسبه می‌شود. بالاتر از ۲.۵ برابر، رندر پیکسلی فعال می‌شود تا بتوان پیکسل‌ها را دید.", "原图与压缩图是同一元素内的两个图层，通过 CSS transform 移动和缩放。压缩图层在分割位置被裁剪。缩放和平移只改变这一个 transform，因此两张图始终对齐，分割线也由相同数值计算。放大超过 2.5 倍后启用像素化渲染，便于查看单个像素。"],
  "arch.8.title": ["Offline, storage and privacy", "Офлайн, хранение и приватность", "آفلاین، ذخیره‌سازی و حریم خصوصی", "离线、存储与隐私"],
  "arch.8.text": ["On the first visit, the service worker stores the app files in a cache and serves them from there afterwards. The only data kept on the device is the theme and language, in localStorage. Image data lives in memory for the session only; it is never written to storage and never sent over the network.", "При первом открытии service worker сохраняет файлы приложения в кэш и дальше отдаёт их оттуда. На устройстве хранятся только тема и язык, в localStorage. Данные изображений живут в памяти только на время сессии: они не записываются в хранилище и не отправляются по сети.", "Service Worker در اولین بازدید فایل‌های برنامه را در کش ذخیره می‌کند و بعد از همان کش ارائه می‌دهد. تنها داده‌ای که روی دستگاه می‌ماند تم و زبان است که در localStorage نگه‌داری می‌شود. داده‌ی تصاویر فقط در حافظه‌ی همین نشست زنده است، هرگز در حافظه‌ی ماندگار نوشته نمی‌شود و از شبکه هم ارسال نمی‌شود.", "Service Worker 在首次访问时把应用文件存入缓存，之后从缓存提供。设备上唯一保存的数据是主题和语言，存放在 localStorage 中。图片数据只存在于本次会话的内存中，从不写入存储，也不通过网络发送。"],
  "arch.9.title": ["Languages and interface", "Языки и интерфейс", "زبان‌ها و رابط", "语言与界面"],
  "arch.9.text": ["Every visible string comes from one dictionary in i18n.js, keyed by name, with English, Russian, Persian and Chinese entries. Persian switches the document to right-to-left, and the layout uses logical properties and flexbox so it mirrors correctly. Terminal output stays in English, as it is a developer tool.", "Каждая видимая строка берётся из одного словаря в i18n.js по имени ключа, с вариантами на английском, русском, персидском и китайском. Для персидского документ переключается на написание справа налево; разметка использует логические свойства и flexbox, поэтому корректно отражается. Вывод терминала остаётся на английском, так как это инструмент разработчика.", "هر متن قابل‌دیدن از یک واژه‌نامه در i18n.js و با کلیدی مشخص می‌آید، با ترجمه‌های انگلیسی، روسی، فارسی و چینی. برای فارسی سند راست‌به‌چپ می‌شود و چیدمان از خصوصیات منطقی و flexbox استفاده می‌کند تا درست آینه شود. خروجی ترمینال چون ابزار توسعه‌دهنده است به انگلیسی می‌ماند.", "每个可见文字都来自 i18n.js 中的同一个词典，按键名组织，包含英文、俄文、波斯文和中文。选择波斯文时文档切换为从右到左排版，布局使用逻辑属性和 flexbox 以正确镜像。终端输出作为开发者工具保持英文。"],
  "about.refTitle": ["Source and references", "Исходный код и источники", "منبع و مراجع", "源码与参考资料"],
  "about.project": ["Project", "Проект", "پروژه", "项目"],
  "about.projectText": ["WUDp Image Compressor is one tool in the WUDp :) Web Utility Desk, a local-first set of everyday browser utilities.", "WUDp Image Compressor — один из инструментов WUDp :) Web Utility Desk: набора локальных утилит для браузера.", "WUDp Image Compressor یکی از ابزارهای WUDp :) Web Utility Desk است؛ مجموعه‌ای از ابزارهای روزمره‌ی مرورگر که محلی کار می‌کنند.", "WUDp 图片压缩器是 WUDp :) Web Utility Desk 的一个工具，这是一组本地优先的日常浏览器工具。"],
  "about.author": ["Author", "Автор", "نویسنده", "作者"],
  "about.authorText": ["TGO (The Giant Octopus)", "TGO (The Giant Octopus)", "TGO (The Giant Octopus)", "TGO（The Giant Octopus）"],
  "about.source": ["Source code", "Исходный код", "کد منبع", "源代码"],
  "about.sourceText": ["Coming soon.", "Скоро.", "به‌زودی.", "即将公开。"],
  "about.builtWith": ["Built with", "Создано с помощью", "ساخته شده با", "技术栈"],
  "about.builtWithText": ["Plain HTML, CSS and JavaScript. No frameworks, no build step, no remote requests.", "Простой HTML, CSS и JavaScript. Без фреймворков, без сборки и без внешних запросов.", "HTML، CSS و جاوااسکریپت ساده. بدون فریم‌ورک، بدون مرحله‌ی build و بدون درخواست بیرونی.", "原生 HTML、CSS 与 JavaScript。无框架、无构建步骤、无外部请求。"],
  "about.version": ["Version", "Версия", "نسخه", "版本"],
  "about.license": ["License", "Лицензия", "مجوز", "许可证"],
  "about.licenseText": ["Not yet specified.", "Пока не указана.", "هنوز مشخص نشده است.", "尚未指定。"],
};

let current = "en";

export function detectLang() {
  let saved = null;
  try { saved = localStorage.getItem("wudp-lang"); } catch { /* storage blocked */ }
  if (saved && INDEX[saved] !== undefined) return saved;
  const nav = (navigator.language || "en").slice(0, 2).toLowerCase();
  return INDEX[nav] !== undefined ? nav : "en";
}

export function currentLang() {
  return current;
}

export function t(key, vars = {}) {
  const row = DICT[key];
  let s = row ? (row[INDEX[current]] ?? row[0]) : key;
  for (const [k, v] of Object.entries(vars)) s = s.split(`{${k}}`).join(String(v));
  return s;
}

export function setLang(code) {
  if (INDEX[code] === undefined) return;
  current = code;
  const meta = LANGS.find((l) => l.code === code);
  document.documentElement.lang = code;
  document.documentElement.dir = meta.dir;
  try { localStorage.setItem("wudp-lang", code); } catch { /* ignore */ }
  applyI18n();
}

// Fills static text from data attributes:
//   data-i18n="key"        -> textContent
//   data-i18n-aria="key"   -> aria-label
//   data-i18n-ph="key"     -> placeholder
export function applyI18n(root = document) {
  root.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
  root.querySelectorAll("[data-i18n-aria]").forEach((el) => el.setAttribute("aria-label", t(el.dataset.i18nAria)));
  root.querySelectorAll("[data-i18n-ph]").forEach((el) => el.setAttribute("placeholder", t(el.dataset.i18nPh)));
  document.title = t("app.name");
}
