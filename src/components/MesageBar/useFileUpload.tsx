import { config } from "@/config";
import { useAuth } from "@/context/AuthContext";
import axios, { AxiosError } from "axios";
import { useCallback, useState } from "react";
import { FileRejection } from "react-dropzone";

export interface MessageBarProps {
  placeholder: string;
  isPending: boolean;
  onSubmit: (value: string) => void;
  initialText?: string;
}

export interface FileUploadInitial {
  state: "initial";
  hasRejections?: boolean;
}
export interface FileUploadPending {
  state: "pending";
  files: string[];
  hasRejections?: boolean;
}

export interface FileUploadError {
  state: "error";
  files: string[];
  error: string;
  hasRejections?: boolean;
}
export type FileUploadStatus =
  | FileUploadInitial
  | FileUploadPending
  | FileUploadError;

export const useFileUpload = (acceptFiles: boolean) => {
  const { token } = useAuth();
  const [uploadedFiles, setUploadedFiles] = useState<
    { name: string; content: string; size: string }[]
  >([]);
  const [fileUploadStatus, setFileUploadStatus] = useState<FileUploadStatus>({
    state: "initial",
  });

  const handleUploadFiles = useCallback(
    async (acceptedFiles: File[], fileRejection: FileRejection[]) => {
      if (!acceptFiles) {
        setFileUploadStatus({
          state: "error",
          error: "File upload is not allowed",
          files: [],
        });
        return;
      }
      setFileUploadStatus({
        state: "pending",
        files: acceptedFiles.map((file) => file.name),
        hasRejections: fileRejection.length > 0,
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
        >(`${config.baseUrl}/file-loader/upload`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        setFileUploadStatus({
          state: "initial",
          hasRejections: fileRejection.length > 0,
        });
        setUploadedFiles((prev) => [
          ...prev,
          ...data.map((file) => ({ ...file, name: file.file })),
        ]);
      } catch (e) {
        if (e instanceof AxiosError) {
          const data = e.response?.data;
          if (data && data.message) {
            setFileUploadStatus({
              state: "error",
              files: acceptedFiles.map((file) => file.name),
              error:
                e instanceof Error
                  ? data.message
                  : "An unknown error has occurred",
            });
          } else {
            console.error(e);
            if (e.code === "ERR_NETWORK")
              setFileUploadStatus({
                state: "error",
                files: acceptedFiles.map((file) => file.name),
                error: "File upload error. Ensure each file is under 25MB.",
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
    },
    [acceptFiles, token]
  );

  return {
    handleUploadFiles,
    uploadedFiles,
    setUploadedFiles,
    fileUploadStatus,
    setFileUploadStatus,
  };
};
