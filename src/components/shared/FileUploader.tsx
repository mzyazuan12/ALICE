import { useCallback, useState } from "react";
import { FileWithPath, useDropzone, FileRejection } from "react-dropzone";
import { Button } from "@/components/ui";
import { convertFileToUrl } from "@/lib/utils";

type FileUploaderProps = {
  fieldChange: (files: File[]) => void;
  mediaUrl: string;
};

const FileUploader = ({ fieldChange, mediaUrl }: FileUploaderProps) => {
  const [fileUrl, setFileUrl] = useState<string>(mediaUrl);
  const [fileType, setFileType] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[], fileRejections: FileRejection[]) => {
      // Reset error message
      setErrorMessage("");

      // Handle rejected files
      if (fileRejections.length > 0) {
        setErrorMessage("Unsupported file type. Please upload an image or video.");
        return;
      }

      const file = acceptedFiles[0];
      if (!file) return;

      // Detect file type (image or video)
      const detectedType = file.type.startsWith("video")
        ? "video"
        : file.type.startsWith("image")
        ? "image"
        : "";

      if (!detectedType) {
        setErrorMessage("Unsupported file type. Please upload an image or video.");
        return;
      }

      fieldChange(acceptedFiles);
      setFileType(detectedType);
      setFileUrl(convertFileToUrl(file));
    },
    [fieldChange]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpeg", ".jpg"],
      "video/*": [".mp4", ".avi", ".mov"],
    },
    onDropRejected: () => {
      setErrorMessage("Unsupported file type. Please upload an image or video.");
    },
  });

  const resetFile = () => {
    setFileUrl("");
    setFileType("");
    setErrorMessage("");
    fieldChange([]);
  };

  return (
    <div
      {...getRootProps()}
      className="flex flex-center flex-col bg-dark-3 rounded-xl cursor-pointer"
    >
      <input {...getInputProps()} className="cursor-pointer" />

      {fileUrl ? (
        <>
          <div className="flex flex-1 justify-center w-full p-5 lg:p-10">
            {fileType === "image" ? (
              <img src={fileUrl} alt="preview" className="file_uploader-img" />
            ) : fileType === "video" ? (
              <video controls className="file_uploader-video">
                <source src={fileUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : null}
          </div>
          <p className="file_uploader-label">Click or drag to replace</p>
          <Button type="button" className="shad-button_dark_4" onClick={resetFile}>
            Remove File
          </Button>
        </>
      ) : (
        <div className="file_uploader-box">
          <img
            src="/assets/icons/file-upload.svg"
            width={96}
            height={77}
            alt="file upload"
          />
          <h3 className="base-medium text-light-2 mb-2 mt-6">Drag file here</h3>
          <p className="text-light-4 small-regular mb-6">SVG, PNG, JPG, MP4, AVI, MOV</p>
          <Button type="button" className="shad-button_dark_4">
            Select from computer
          </Button>
        </div>
      )}

      {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
    </div>
  );
};

export default FileUploader;
