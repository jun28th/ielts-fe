// Convert YYYY-MM-DD to DD-MM-YYYY
export function formatDateDDMMYYYY(dateStr: string): string {
    const [year, month, day] = dateStr.split("-");
    return `${day}-${month}-${year}`;
}