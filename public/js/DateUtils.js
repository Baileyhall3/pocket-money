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

    static getLast7Days() {
        let today = new Date();
        let last7Days = [];
    
        for (let i = 6; i >= 0; i--) {
            let date = new Date();
            date.setDate(today.getDate() - i);
            
            // Format the date as DD/MM/YYYY
            const formattedDate = ("0" + date.getDate()).slice(-2) + "/" +
                                  ("0" + (date.getMonth() + 1)).slice(-2) + "/" +
                                  date.getFullYear();
            last7Days.push(formattedDate);
        }
    
        return last7Days;
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
