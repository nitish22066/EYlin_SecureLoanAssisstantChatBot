import DocumentUpload from "../DocumentUpload";
import { LanguageProvider } from "@/contexts/LanguageContext";

export default function DocumentUploadExample() {
  return (
    <LanguageProvider>
      <div className="max-w-md mx-auto p-6">
        <DocumentUpload label="Upload PAN Card" />
      </div>
    </LanguageProvider>
  );
}
