export function isHeicFile(file: File): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function (e) {
      if (
        !e.target ||
        !e.target.result ||
        !(e.target.result instanceof ArrayBuffer)
      ) {
        return resolve(false);
      }
      const dataView = new DataView(e.target.result);

      // Cek apakah offset 4-7 berisi string 'ftyp'
      const ftyp = String.fromCharCode(
        dataView.getUint8(4),
        dataView.getUint8(5),
        dataView.getUint8(6),
        dataView.getUint8(7)
      );

      if (ftyp !== "ftyp") {
        return resolve(false); // Bukan file ftyp
      }

      // Cek brand (offset 8-11)
      const brand = String.fromCharCode(
        dataView.getUint8(8),
        dataView.getUint8(9),
        dataView.getUint8(10),
        dataView.getUint8(11)
      );

      // HEIC brand biasanya 'heic', 'heix', 'hevc', 'mif1', atau 'msf1'
      const heicBrands = ["heic", "heix", "hevc", "mif1", "msf1"];
      resolve(heicBrands.includes(brand));
    };

    reader.onerror = reject;
    reader.readAsArrayBuffer(file.slice(0, 20)); // cukup 20 byte pertama
  });
}
