import dayjs from "dayjs";
import "dayjs/locale/id";

const dateUtils = {
  /**
   * Menconvert waktu ke format yang ditentukan
   * @param datetime
   */
  convert: (datetime: string | null, format: string) => {
    if (!datetime) return null;
    return dayjs(datetime).locale("id").format(format);
  },
  /**
   * Menconvert tanggal dan waktu ke dalam format yang lebih bisa dibaca
   * @return contoh : '21 April 2021 03:19' atau 'Selasa, 21 April 2021 03:19'
   */
  readableDateTime: (datetime?: string | null, withDayName = false) => {
    if (!datetime) return null;
    if (withDayName) {
      return dayjs(datetime).locale("id").format("dddd, DD MMMM YYYY HH:mm");
    }

    return dayjs(datetime).locale("id").format("DD MMMM YYYY HH:mm");
  },
  generateTimeIntervals: (
    start: string,
    end: string,
    intervalMinutes: number,
  ) => {
    const times: string[] = [];
    let currentTime = dayjs(`2021-01-01T${start}`); // The date part is arbitrary
    const endTime = dayjs(`2021-01-01T${end}`);

    while (currentTime.isBefore(endTime)) {
      times.push(currentTime.format("HH:mm"));
      currentTime = currentTime.add(intervalMinutes, "minute");
    }

    return times;
  },

  /**
   * Menampilkan list tanggal awal bulan dari range tanggal
   *
   * @params tanggal awal dan akhir (cth. 2022-01-01)
   * @return array tanggal [2022-01-01, 2022-02-01]
   */
  getListStartDates: (startDate: string, endDate: string) => {
    if (!startDate || !endDate) {
      return [];
    }
    let dayjsStartDate = dayjs(startDate);
    const dayjsEndDate = dayjs(endDate);

    const dates: string[] = [];

    while (
      dayjsStartDate.isBefore(dayjsEndDate) ||
      dayjsStartDate.isSame(dayjsEndDate)
    ) {
      dates.push(dayjsStartDate.startOf("month").format("YYYY-MM-DD"));
      dayjsStartDate = dayjsStartDate.add(1, "month");
    }

    return dates;
  },
  addMinutesToTime: (time: string, minutes: number) => {
    const parsedTime = dayjs(`2021-01-01T${time}`);
    const newTime = parsedTime.add(minutes, "minute");

    return newTime.format("HH:mm");
  },
  /**
   * Menconvert tanggal dan waktu ke dalam format yang lebih bisa dibaca
   * @return contoh : '21 April 2021' atau "Senin, 1 Januari 2022"
   */
  readableDate: (date?: string | null, withDayName = false) => {
    if (!date) return null;
    if (withDayName) {
      return dayjs(date).locale("id").format("dddd, DD MMMM YYYY");
    }
    return dayjs(date).locale("id").format("DD MMMM YYYY");
  },
  isDateSurpassed: (date: string) => {
    const inputDate = dayjs(date);
    const now = dayjs();

    return now.isAfter(inputDate);
  },
  /**
   * Menconvert tanggal dan waktu ke dalam format yang lebih bisa dibaca dan pendek
   * @return contoh : '21 Aug 2021'
   */
  readableShortDate: (date?: string | null) => {
    if (!date) return null;
    return dayjs(date).locale("id").format("DD MMM YYYY");
  },
  /**
   * Menconvert tanggal dan waktu ke dalam format yang lebih bisa dibaca dan pendek
   * @return contoh : '21 Aug 2021 10:43'
   */
  readableShortDateTime: (datetime?: string | null) => {
    if (!datetime) return null;
    return dayjs(datetime).locale("id").format("DD MMM YYYY HH:mm");
  },
  readableMonthYear: (date?: string | null) => {
    if (!date) return null;
    return dayjs(date).locale("id").format("MMMM YYYY");
  },
  readableMonth: (date?: string | null) => {
    if (!date) return null;
    return dayjs(date).locale("id").format("MMMM");
  },
  /**
   * Menconvert tanggal ke dalam format YYYY-MM-DD
   * @return contoh : '2022-12-07'
   */
  isoDate: (date?: string | null) => {
    if (!date) return null;
    return dayjs(date).format("YYYY-MM-DD");
  },
  /**
   * Menconvert tanggal ke dalam format string ISO 8601
   * @return contoh : '2022-07-15T07:50:34.141Z'
   */
  isoDateTime: (date?: string | null) => {
    if (!date) return null;
    return dayjs(date).toISOString();
  },
  /**
   * Menconvert tanggal ke dalam format DD-MM-YYYY
   * @return contoh : '07-12-2022'
   */
  hyphenDate: (date?: string | null) => {
    if (!date) return null;
    return dayjs(date).format("DD-MM-YYYY");
  },
  /**
   * Menconvert tanggal ke dalam format DD/MM/YYYY
   * @return contoh : '07/12/2022'
   */
  slashDate: (date?: string | null) => {
    if (!date) return null;
    return dayjs(date).format("DD/MM/YYYY");
  },
  /**
   * Menampilkan nama hari dalam bahasa indonesia
   * @param date tanggal. contoh : 2022-01-01
   * @return contoh : Senin
   */
  dayNameFromDate: (date?: string | null) => {
    if (!date) return null;
    return dayjs(date).locale("id").format("dddd");
  },
  stringify: (date: Date) => {
    return new Date(date).toISOString();
  },
  /**
   * Menampilkan nama hari dalam bahasa indonesia
   * @param dayNumber Nomor hari (contoh : 1)
   * @return contoh : Senin
   */
  dayNameFromNumber: (dayNumber: number) => {
    switch (dayNumber) {
      case 1:
        return "Senin";
      case 2:
        return "Selasa";
      case 3:
        return "Rabu";
      case 4:
        return "Kamis";
      case 5:
        return "Jum'at";
      case 6:
        return "Sabtu";
      case 7:
        return "Ahad";
      default:
        console.error(dayNumber);
        return "Error";
    }
  },
  /**
   * Menampilkan waktu saat ini dalam format ISO 8601
   * @return contoh : '2022-07-15T07:50:34.141Z'
   */
  now: () => dayjs().toISOString(),
  /**
   * Menampilkan tahun saat ini dalam string
   * @return contoh : '2022'
   */
  currentYear: () => dayjs().format("YYYY"),
  /**
   * Menampilkan bulan saat ini dalam string
   * @return contoh : '09'
   */
  currentMonth: () => dayjs().format("MM"),
  /**
   * Menampilkan tanggal hari ini dengan format YYYY-MM-DD
   * @return contoh : 2022-12-01
   */
  currentDate: () => dayjs().format("YYYY-MM-DD"),
  /**
   * Menampilkan tanggal awal bulan saat ini dalam string
   * @return contoh : '2022-01-01'
   */
  currentStartMonth: () => dayjs().startOf("month").format("YYYY-MM-DD"),
  /**
   * Menampilkan waktu hari ini dengan format HH:mm
   * @return contoh : 14:35
   */
  currentTime: () => dayjs().format("HH:mm"),
  /**
   * Menampilkan hari ini dengan format angka
   * @return contoh : 2
   */
  currentDay: () => dayjs().day(),

  /**
   * Menampilkan waktu yang tersisa dari tanggal yang diberikan
   * @return array [hari, jam, menit, detik] tersisa
   *
   */
  getRemainingTime: (datetime: string) => {
    const now = dayjs();

    // Target date and time
    const target = dayjs(datetime);

    // Difference in seconds
    const diff = target.diff(now, "second");

    // Calculate days, hours, minutes, and seconds
    const days = Math.floor(diff / (60 * 60 * 24));
    const hours = Math.floor((diff - days * 60 * 60 * 24) / (60 * 60));
    const minutes = Math.floor(
      (diff - days * 60 * 60 * 24 - hours * 60 * 60) / 60,
    );
    const seconds = diff - days * 60 * 60 * 24 - hours * 60 * 60 - minutes * 60;

    // Format the output to always have at least two digits
    const formattedDays = String(days).padStart(2, "0");
    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");

    return [formattedDays, formattedHours, formattedMinutes, formattedSeconds];
  },
};

export default dateUtils;
