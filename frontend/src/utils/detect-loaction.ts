import toast from "react-hot-toast";

export const detectLocation = async (): Promise<GeolocationPosition | null> => {
  const toastId = toast.loading("Mendeteksi lokasi...");

  try {
    if (!navigator.geolocation) {
      throw new Error("Geolocation tidak didukung oleh browser ini");
    }

    const position: GeolocationPosition = await new Promise(
      (resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => resolve(position),
          (error) => reject(new Error(getGeolocationErrorMessage(error))),
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0,
          }
        );
      }
    );

    return position;
  } catch (error) {
    return null;
  } finally {
    toast.dismiss(toastId);
  }
};

const getGeolocationErrorMessage = (
  error: GeolocationPositionError
): string => {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return "Izin akses lokasi ditolak";
    case error.POSITION_UNAVAILABLE:
      return "Informasi lokasi tidak tersedia";
    case error.TIMEOUT:
      return "Waktu permintaan lokasi habis";
    default:
      return "Terjadi kesalahan saat mendeteksi lokasi";
  }
};
