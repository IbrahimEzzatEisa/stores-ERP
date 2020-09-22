﻿/* http://keith-wood.name/calendars.html
   Arabic localisation for UmmAlQura calendar for jQuery.
   Written by Amro Osama March 2013. */
(function ($) {
    $.calendars.calendars.ummalqura.prototype.regional['ar'] = {
		name: 'UmmAlQura', // The calendar name
		epochs: ['BAM', 'AM'],
		monthNames: ['المحرّم', 'صفر', 'ربيع الأول', 'ربيع الثاني', 'جمادى الاول', 'جمادى الآخر', 'رجب', 'شعبان', 'رمضان', 'شوّال', 'ذو القعدة', 'ذو الحجة'],
		monthNamesShort: ['المحرّم', 'صفر', 'ربيع الأول', 'ربيع الثاني', 'جمادى الاول', 'جمادى الآخر', 'رجب', 'شعبان', 'رمضان', 'شوّال', 'ذو القعدة', 'ذو الحجة'],
		dayNames: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
		dayNamesMin: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
		dayNamesShort: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
		dateFormat: 'yyyy/mm/dd', // See format options on BaseCalendar.formatDate
		firstDay: 6, // The first day of the week, Sat = 0, Sun = 1, ...
		isRTL: true // True if right-to-left language, false if left-to-right
    };

    $.calendars.calendars.gregorian.prototype.regional['ar'] = {
        name: 'gregorian', // The calendar name
        epochs: ['BAM', 'AM'],
        monthNames: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
        monthNamesShort: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
        dayNames: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
        dayNamesMin: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
        dayNamesShort: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
        dateFormat: 'yyyy/mm/dd', // See format options on BaseCalendar.formatDate
        firstDay: 6, // The first day of the week, Sat = 0, Sun = 1, ...
        isRTL: true // True if right-to-left language, false if left-to-right
    };

})(jQuery);