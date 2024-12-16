class DateUtils {
    static toLongDate(date) {
        const parsedDate = new Date(date);
        if (isNaN(parsedDate)) return 'Invalid Date';
        return parsedDate.toDateString(); // Example: "Mon Dec 30 2024"
    }

    static toShortDate(date) {
        const parsedDate = new Date(date);
        if (isNaN(parsedDate)) return 'Invalid Date';

        const day = String(parsedDate.getDate()).padStart(2, '0');
        const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
        const year = parsedDate.getFullYear();

        return `${day}/${month}/${year}`; // Example: "30/12/2024"
    }

    static toDateTime(date) {
        const parsedDate = new Date(date);
        if (isNaN(parsedDate)) return 'Invalid Date';

        const shortDate = DateUtils.toShortDate(parsedDate);
        const hours = String(parsedDate.getHours()).padStart(2, '0');
        const minutes = String(parsedDate.getMinutes()).padStart(2, '0');

        return `${shortDate} ${hours}:${minutes}`; // Example: "30/12/2024 15:45"
    }

    static toInputFormatDate(date) {
        const parsedDate = new Date(date);
        if (isNaN(parsedDate)) return 'Invalid Date';

        const day = String(parsedDate.getDate()).padStart(2, '0');
        const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
        const year = parsedDate.getFullYear();

        return `${year}-${month}-${day}`; // Example: "2024/12/30"
    }
}

// Export for server-side usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DateUtils;
}

// Expose for client-side usage
if (typeof window !== 'undefined') {
    window.DateUtils = DateUtils;
}
