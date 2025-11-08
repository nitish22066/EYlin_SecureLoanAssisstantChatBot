import { Upload, FileCheck, X } from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DocumentUploadProps {
  label: string;
  acceptedFormats?: string[];
  onUpload?: (files: File[]) => void;
}

export default function DocumentUpload({
  label,
  acceptedFormats = ["PDF", "JPG", "PNG"],
  onUpload,
}: DocumentUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
      onUpload?.(newFiles);
      console.log("Files uploaded:", newFiles.map((f) => f.name));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles((prev) => [...prev, ...newFiles]);
      onUpload?.(newFiles);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">{label}</label>
      
      <Card
        className={cn(
          "border-2 border-dashed p-6 text-center cursor-pointer hover-elevate transition-all",
          isDragging && "border-primary bg-primary/5"
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="hidden"
          id={`file-upload-${label}`}
          data-testid={`input-file-${label.toLowerCase().replace(/\s+/g, "-")}`}
          accept=".pdf,.jpg,.jpeg,.png"
        />
        <label
          htmlFor={`file-upload-${label}`}
          className="cursor-pointer flex flex-col items-center gap-2"
        >
          <Upload className="h-8 w-8 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">
              Drop files here or click to upload
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Supported: {acceptedFormats.join(", ")}
            </p>
          </div>
        </label>
      </Card>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <Card
              key={index}
              className="p-3 flex items-center justify-between"
              data-testid={`file-item-${index}`}
            >
              <div className="flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-green-600" />
                <span className="text-sm">{file.name}</span>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => removeFile(index)}
                data-testid={`button-remove-file-${index}`}
              >
                <X className="h-4 w-4" />
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
