"use client";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  AudioLines,
  Disc3,
  Download,
  Mic,
  Paperclip,
  Send,
  Upload,
  X,
} from "lucide-react";
import { FunctionComponent, useEffect, useState } from "react";
import { useAudioRecorder } from "react-audio-voice-recorder";
import { useDropzone } from "react-dropzone";
import { Textarea } from "../ui/textarea";
import { useFileUpload } from "./useFileUpload";
import { useVoiceUpload } from "./useVoiceUpload";
import { Persona, ShortcutType } from "@/context/PersonaContext";

export interface MessageBarProps {
  placeholder: string;
  isPending: boolean;
  isNewConversation?: boolean;
  onSubmit: (value: {
    text: string;
    files?: {
      name: string;
      content: string;
    }[];
  }) => void;
  initialText?: string;
  acceptFiles?: boolean;
  acceptVoice?: boolean;
  persona?: Persona;
}

export const MessageBar: FunctionComponent<MessageBarProps> = ({
  placeholder,
  isPending,
  isNewConversation,
  onSubmit,
  initialText = "",
  acceptFiles = false,
  acceptVoice = false,
  persona,
}) => {
  const [rowNum, setRowNum] = useState(1);
  const [text, setText] = useState(initialText);
  const {
    uploadedFiles,
    setUploadedFiles,
    fileUploadStatus,
    setFileUploadStatus,
    handleUploadFiles,
  } = useFileUpload(acceptFiles, []);
  const { startRecording, stopRecording, isRecording, recordingBlob } =
    useAudioRecorder({
      noiseSuppression: true,
      echoCancellation: true,
    });
  const { uploadAudio, uploadAudioMutation } = useVoiceUpload({
    personaId: persona?.id,
    onVoiceTranscribed: (text) => {
      setText(text);
    },
  });
  const isAudioPending = uploadAudioMutation.isPending;

  useEffect(() => {
    if (typeof window !== "undefined") {
      // polyfill for safari (https://github.com/ai/audio-recorder-polyfill)
      import("audio-recorder-polyfill").then((AudioRecorder) => {
        window.MediaRecorder = AudioRecorder.default;
      });
    }
  }, []);

  useEffect(() => {
    if (!recordingBlob) return;
    uploadAudio(recordingBlob);
  }, [recordingBlob, uploadAudio]);

  const handleSubmit = () => {
    if (isPending) return;
    onSubmit({ text, files: uploadedFiles });
    setText("");
    setRowNum(1);
    setUploadedFiles([]);
    setFileUploadStatus({ state: "initial" });
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };
  useEffect(() => {
    const lineCount = (text.match(/\n/g) || []).length + 1;
    const lineByCharacters = text.length / 65;
    setRowNum(Math.min(15, Math.max(lineCount, lineByCharacters, 1)));
  }, [initialText, text]);

  const handleMultipleFileUpload = async (files: File[]) => {
    const isAudioUpload =
      files.length === 1 &&
      (files[0].type.includes("audio") || files[0].type.includes("video"));
    if (isAudioUpload) {
      uploadAudio(files[0]);
    } else {
      handleUploadFiles(files, []);
    }
  };

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop: handleMultipleFileUpload,
    noClick: true,
    noKeyboard: true,
    accept: acceptFiles
      ? {
          "application/pdf": [".pdf"],
          "text/csv": [".csv"],
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            [".docx"],
          "application/msword": [".doc"],
          "text/plain": [".txt", ".md", ".mdx", ".js", ".ts", ".tsx"],
          "audio/ogg": [".ogg"],
          "audio/webm": [".webm"],
        }
      : {},
  });

  const handleDownloadAudio = () => {
    if (!recordingBlob) return;
    const url = URL.createObjectURL(recordingBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "audio.webm";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="">
      <div className="flex justify-center">
        <div className="w-full max-w-3xl mb-4 px-3 text-sm flex justify-end max-h-32 overflow-x-scroll">
          {persona && persona.shortcuts && (
            <div className="overflow-x-scroll space-y-2">
              {persona.shortcuts
                .filter(
                  (s) => isNewConversation === (s.type === ShortcutType.INITIAL)
                )
                .map((shortcut, i) => (
                  <div
                    key={i}
                    className="bg-secondary py-1 px-2 rounded-md max-w-md cursor-pointer"
                    onClick={() => setText(shortcut.content)}
                  >
                    {shortcut.content}
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-center">
        <div className="w-full max-w-3xl mb-8">
          <div
            {...getRootProps()}
            className="relative  border border-input px-3 py-2 rounded-md bg-background mx-4"
          >
            <input {...getInputProps()} className="hidden" />
            {isDragActive && (
              <div className="absolute w-full h-full left-0 right-0 top-0 bottom-0 rounded flex items-center justify-center bg-muted">
                <Upload className="w-5 h-5 mr-2" />
              </div>
            )}
            <div className="flex items-center space-x-1">
              {acceptFiles && (
                <div onClick={() => open()} className="cursor-pointer">
                  <Paperclip className="h-5 w-5" />
                </div>
              )}
              {acceptVoice && (
                <div
                  className={cn(
                    "flex space-x-1 p-1",
                    recordingBlob && "border-2 rounded-2xl border-muted"
                  )}
                >
                  {isRecording ? (
                    <div onClick={stopRecording} className="cursor-pointer">
                      <AudioLines className="h-5 w-5" />
                    </div>
                  ) : isAudioPending ? (
                    <div>
                      <Disc3 className="h-5 w-5 animate-spin" />
                    </div>
                  ) : (
                    <>
                      <div onClick={startRecording} className="cursor-pointer">
                        <Mic className="h-5 w-5" />
                      </div>
                    </>
                  )}
                  {recordingBlob && (
                    <div>
                      <Download
                        className="h-5 w-5 cursor-pointer"
                        onClick={handleDownloadAudio}
                      />
                    </div>
                  )}
                </div>
              )}
              <Textarea
                className="focus-visible:ring-0 focus-visible:ring-offset-0 border-0 resize-none min-h-0"
                placeholder={placeholder}
                onChange={handleTextChange}
                onKeyDown={handleKeyDown}
                rows={rowNum}
                value={text}
              />
              <div
                className={
                  isPending ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                }
                onClick={handleSubmit}
              >
                <Send className="h-6 w-6" />
              </div>
            </div>

            {(uploadedFiles.length > 0 ||
              fileUploadStatus.hasRejections ||
              fileUploadStatus.state === "error" ||
              (fileUploadStatus.state === "pending" &&
                fileUploadStatus.files.length > 0)) && (
              <>
                <hr className="mb-2" />
                <div className="space-x-2 space-y-1">
                  {uploadedFiles.map((uploadedFile, i) => {
                    return (
                      <Badge variant="outline" key={i}>
                        {uploadedFile.name}
                        <X
                          className="w-4 ml-2"
                          onClick={() => {
                            setUploadedFiles((files) => {
                              const newFiles = [...files];
                              newFiles.splice(i, 1);
                              return newFiles;
                            });
                          }}
                        />
                      </Badge>
                    );
                  })}
                  {fileUploadStatus.state === "pending" &&
                    fileUploadStatus.files.map((file, i) => {
                      return (
                        <Badge variant="outline" key={i}>
                          Uploading {file}...
                        </Badge>
                      );
                    })}
                  {fileUploadStatus.state === "error" && (
                    <div>
                      <small className="text-destructive">
                        {fileUploadStatus.error}
                      </small>
                    </div>
                  )}
                  {fileUploadStatus.hasRejections && (
                    <div>
                      <small className="text-destructive">
                        Upload only .txt, .csv, .pdf & .docx
                      </small>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
