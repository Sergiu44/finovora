/**
 * Formats a numeric value (price, rate, etc.) to a specified number of decimal places
 * @param value - The value to format (can be string or number)
 * @param digits - The number of decimal places to display (default: 2)
 * @returns Formatted string with the specified number of decimal places
 */
export function formatCurrency(value: string | number | null | undefined, digits: number = 2): string {
    if (value === null || value === undefined || value === "") {
        return "0.00";
    }

    const numValue = typeof value === "string" ? parseFloat(value) : value;

    if (isNaN(numValue)) {
        return "0.00";
    }

    return numValue.toFixed(digits);
}

