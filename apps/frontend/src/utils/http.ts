import axios, { AxiosError, AxiosRequestHeaders } from "axios";
import toast from "react-hot-toast";

export interface ValidationError {
  code: string;
  minimum: number;
  type: string;
  inclusive: boolean;
  exact: boolean;
  message: string;
  path: string[];
}

export interface HttpError
  extends AxiosError<{
    message?: string;
    status_code?: number;
    issues?: ValidationError[];
  }> {
  isHandled: boolean;
}

const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL_API,
});

http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token") || "";
    if (token) {
      (config.headers as AxiosRequestHeaders).Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

http.interceptors.response.use(
  (response) => response,
  (error) => {
    error.isHandled = false;

    if (!navigator.onLine) {
      toast.error("Silahkan periksa koneksi internet anda");
      error.isHandled = true;
    }

    if (error.response?.status === 500) {
      toast.error(
        "Maaf ada kesalahan teknis, silahkan hubungi admin. Kode 500"
      );
      error.isHandled = true;
    }

    if (error.response?.status === 404) {
      toast.error(
        "Maaf ada kesalahan teknis, silahkan hubungi admin. Kode 404"
      );
      error.isHandled = true;
    }

    if (error.response?.status === 403) {
      toast.error(
        "Maaf, anda tidak diperbolehkan melakukan aksi ini. Kode 403"
      );
      error.isHandled = true;
    }

    if (error.response?.status === 400) {
      console.log(error.response);
      toast.error(error.response?.data?.error?.message);
      error.isHandled = true;
    }

    if (error.response?.status === 422) {
      // TODO: TRANSFORM ERROR
    }

    return Promise.reject(error);
  }
);

export default http;
