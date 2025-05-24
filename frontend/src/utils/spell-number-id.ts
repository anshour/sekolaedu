function spellNumberId(num: number): string {
  const bilangan = [
    "",
    "Satu",
    "Dua",
    "Tiga",
    "Empat",
    "Lima",
    "Enam",
    "Tujuh",
    "Delapan",
    "Sembilan",
    "Sepuluh",
    "Sebelas",
  ];

  const scales = [
    { value: 1000000000000000, name: "Kuadriliun" },
    { value: 1000000000000, name: "Triliun" },
    { value: 1000000000, name: "Milyar" },
    { value: 1000000, name: "Juta" },
    { value: 1000, name: "Ribu" },
    { value: 100, name: "Ratus" },
  ];

  // Handle special cases
  if (num < 12) {
    return bilangan[num];
  }
  if (num < 20) {
    return bilangan[num - 10] + " Belas";
  }
  if (num < 100) {
    const depan = Math.floor(num / 10);
    const belakang = num % 10;
    return bilangan[depan] + " Puluh " + bilangan[belakang];
  }

  // Handle special cases for 100 and 1000
  if (num === 100) return "Seratus";
  if (num === 1000) return "Seribu";

  // Handle numbers above 100
  for (const scale of scales) {
    if (num >= scale.value) {
      const prefix =
        num < 2 * scale.value && scale.value >= 100
          ? "Se"
          : spellNumberId(Math.floor(num / scale.value)) + " ";
      const remainder = num % scale.value;
      return (
        prefix + scale.name + (remainder > 0 ? " " + spellNumberId(remainder) : "")
      );
    }
  }

  return "";
}

export default spellNumberId;
