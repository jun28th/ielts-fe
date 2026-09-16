// Convert YYYY-MM-DD to DD-MM-YYYY
export function formatDateDDMMYYYY(dateStr: string): string {
    const [year, month, day] = dateStr.split("-");
    return `${day}-${month}-${year}`;
}

// Convert ISO Instant string to "DD-MM-YYYY HH:mm:ss"
export function formatInstant(instantStr: string): string {
    const date = new Date(instantStr);

    if (isNaN(date.getTime())) {
        throw new Error(`Invalid Instant string: ${instantStr}`);
    }

    const pad = (n: number) => n.toString().padStart(2, "0");

    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1);
    const year = date.getFullYear();

    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}