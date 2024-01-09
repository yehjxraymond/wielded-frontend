import { useAuth } from "@/context/AuthContext";
import axios, { AxiosError } from "axios";
import { useCallback, useState } from "react";

export interface MessageBarProps {
  placeholder: string;
  isPending: boolean;
  onSubmit: (value: string) => void;
  initialText?: string;
}

export interface FileUploadInitial {
  state: "initial";
}
export interface FileUploadPending {
  state: "pending";
  files: string[];
}

export interface FileUploadError {
  state: "error";
  files: string[];
  error: string;
}
export type FileUploadStatus =
  | FileUploadInitial
  | FileUploadPending
  | FileUploadError;

export const useFileUpload = () => {
  const { token } = useAuth();
  const [uploadedFiles, setUploadedFiles] = useState<
    { name: string; content: string; size: string }[]
  >([]);
  const [fileUploadStatus, setFileUploadStatus] = useState<FileUploadStatus>({
    state: "initial",
  });

  const handleUploadFiles = useCallback(async (acceptedFiles: File[]) => {
    setFileUploadStatus({
      state: "pending",
      files: acceptedFiles.map((file) => file.name),
    });
    const formData = new FormData();
    acceptedFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const { data } = await axios.post<
        {
          file: string;
          content: string;
          size: string;
        }[]
      >("http://localhost:3001/file-loader/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setFileUploadStatus({
        state: "initial",
      });
      setUploadedFiles((prev) => [
        ...prev,
        ...data.map((file) => ({ ...file, name: file.file })),
      ]);
    } catch (e) {
      if (e instanceof AxiosError) {
        const data = e.response?.data;
        if (data.message) {
          setFileUploadStatus({
            state: "error",
            files: acceptedFiles.map((file) => file.name),
            error:
              e instanceof Error
                ? data.message
                : "An unknown error has occurred",
          });
        }
      } else {
        setFileUploadStatus({
          state: "error",
          files: acceptedFiles.map((file) => file.name),
          error:
            e instanceof Error ? e.message : "An unknown error has occurred",
        });
      }
    }
  }, []);

  return {
    handleUploadFiles,
    uploadedFiles,
    setUploadedFiles,
    fileUploadStatus,
    setFileUploadStatus,
  };
};
