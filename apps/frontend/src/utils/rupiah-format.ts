/**
 * Converts a number or string to Indonesian Rupiah format
 * @param amount - The amount to convert
 * @returns Formatted rupiah string
 */
export function numberToRupiah(
  amount: string | number | null | undefined
): string {
  try {
    if (amount === null || amount === undefined || amount === "") {
      return "Rp 0";
    }

    const numericAmount = Number(amount);

    if (isNaN(numericAmount)) {
      return "Rp 0";
    }

    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(numericAmount);
  } catch (error) {
    console.error("Error formatting to Rupiah:", error);
    return "Rp 0";
  }
}

/**
 * Converts a Rupiah formatted string back to a number
 * @param rupiah - The Rupiah formatted string
 * @returns The numeric value
 */
export function rupiahToNumber(rupiah: string | null | undefined): number {
  try {
    if (!rupiah) {
      return 0;
    }

    // Remove currency symbol, dots, commas and any non-numeric characters
    const cleanedString = rupiah.replace(/[^0-9-]/g, "");
    const parsedNumber = parseInt(cleanedString, 10);

    return isNaN(parsedNumber) ? 0 : parsedNumber;
  } catch (error) {
    console.error("Error converting Rupiah to number:", error);
    return 0;
  }
}
