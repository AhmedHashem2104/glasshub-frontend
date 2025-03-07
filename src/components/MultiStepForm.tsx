"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import api from "../utils/api";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Upload,
  FileText,
  Building,
  Calendar,
  Eye,
} from "lucide-react";

const MultiStepForm = () => {
  const [step, setStep] = useState(1);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [uploadedLogoPath, setUploadedLogoPath] = useState<string | null>(null);
  const [certificateContent, setCertificateContent] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Enter certificate content...",
      }),
    ],
    content: certificateContent,
    onUpdate: ({ editor }) => setCertificateContent(editor.getHTML()),
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const uploadLogo = async () => {
    if (!logoFile) return;

    const formData = new FormData();
    formData.append("file", logoFile);

    try {
      const response = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadedLogoPath(response.data.filePath);
    } catch (error) {
      console.error("Error uploading logo:", error);
    }
  };

  const onSubmit = async (data: { companyName: string; issueDate: string }) => {
    try {
      await uploadLogo();
      const response = await api.post("/", {
        companyName: data.companyName,
        issueDate: data.issueDate,
        logoPath: uploadedLogoPath,
        certificateContent,
      });

      alert("Certificate created successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const steps = [
    { id: 1, name: "Company Info", icon: <Building className="w-4 h-4" /> },
    { id: 2, name: "Logo", icon: <Upload className="w-4 h-4" /> },
    { id: 3, name: "Content", icon: <FileText className="w-4 h-4" /> },
    { id: 4, name: "Preview", icon: <Eye className="w-4 h-4" /> },
  ];

  return (
    <div className="w-full md:w-1/2 mx-auto mt-4 md:mt-10 p-4 md:p-8 border rounded-xl shadow-lg bg-white dark:bg-gray-800 dark:border-gray-700 transition-all">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between w-full mb-4">
          {steps.map((s) => (
            <div key={s.id} className="flex flex-col items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full border-2 transition-all duration-300 ${
                  step >= s.id
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500"
                }`}
              >
                {step > s.id ? (
                  <Check className="w-4 h-4 md:w-5 md:h-5" />
                ) : (
                  s.icon
                )}
              </div>
              <span
                className={`mt-2 text-xs font-medium transition-colors duration-300 ${
                  step >= s.id
                    ? "text-blue-600"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {s.name}
              </span>
            </div>
          ))}
        </div>
        <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-blue-600 transition-all duration-500 ease-in-out"
            style={{ width: `${((step - 1) / 3) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="min-h-[350px]">
        {step === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
              Company Information
            </h2>
            <div>
              <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                Company Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Building className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  {...register("companyName", { required: true })}
                  className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors"
                  placeholder="Enter company name"
                />
              </div>
              {errors.companyName && (
                <p className="text-red-500 text-sm mt-1">
                  Company name is required
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                Issue Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Calendar className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  {...register("issueDate", { required: true })}
                  className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors"
                />
              </div>
              {errors.issueDate && (
                <p className="text-red-500 text-sm mt-1">
                  Issue date is required
                </p>
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
              Upload Company Logo
            </h2>
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 transition-all hover:border-blue-600">
              {!logoPreview ? (
                <>
                  <Upload className="w-12 h-12 text-gray-400 mb-4" />
                  <p className="text-gray-600 dark:text-gray-300 mb-4 text-center">
                    Drag and drop your logo here, or click to browse
                  </p>
                  <input
                    type="file"
                    id="logo-upload"
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                  />
                  <label
                    htmlFor="logo-upload"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition cursor-pointer"
                  >
                    Select File
                  </label>
                </>
              ) : (
                <div className="flex flex-col items-center">
                  <img
                    src={logoPreview || "/placeholder.svg"}
                    alt="Preview"
                    className="w-40 h-40 object-contain rounded-lg shadow-md mb-4"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setLogoPreview(null);
                        setLogoFile(null);
                      }}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition"
                    >
                      Remove
                    </button>
                    <label
                      htmlFor="logo-upload"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition cursor-pointer"
                    >
                      Change
                    </label>
                    <input
                      type="file"
                      id="logo-upload"
                      onChange={handleFileChange}
                      className="hidden"
                      accept="image/*"
                    />
                  </div>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              Recommended: Square image, at least 200x200px, PNG or JPG format
            </p>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
              Certificate Content
            </h2>
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-100 dark:bg-gray-700 p-2 border-b dark:border-gray-600">
                <div className="flex gap-2">
                  <button
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                    className={`p-1.5 rounded ${
                      editor?.isActive("bold")
                        ? "bg-gray-300 dark:bg-gray-600"
                        : "hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    <strong>B</strong>
                  </button>
                  <button
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                    className={`p-1.5 rounded ${
                      editor?.isActive("italic")
                        ? "bg-gray-300 dark:bg-gray-600"
                        : "hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    <em>I</em>
                  </button>
                  <button
                    onClick={() =>
                      editor?.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                    className={`p-1.5 rounded ${
                      editor?.isActive("heading", { level: 2 })
                        ? "bg-gray-300 dark:bg-gray-600"
                        : "hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    H2
                  </button>
                  <button
                    onClick={() =>
                      editor?.chain().focus().toggleBulletList().run()
                    }
                    className={`p-1.5 rounded ${
                      editor?.isActive("bulletList")
                        ? "bg-gray-300 dark:bg-gray-600"
                        : "hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    • List
                  </button>
                </div>
              </div>
              {editor ? (
                <EditorContent
                  editor={editor}
                  className="p-4 min-h-[200px] focus:outline-none bg-white dark:bg-gray-800 dark:text-white"
                />
              ) : (
                <div className="p-4 min-h-[200px] flex items-center justify-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    Loading editor...
                  </p>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Tip: Use the toolbar above to format your certificate content
            </p>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
              Preview Certificate
            </h2>
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg border dark:border-gray-600">
              <div className="flex items-center gap-4 mb-4">
                {logoPreview && (
                  <img
                    src={logoPreview || "/placeholder.svg"}
                    alt="Logo"
                    className="w-16 h-16 object-contain"
                  />
                )}
                <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                    {watch("companyName") || "Company Name"}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Issue Date: {watch("issueDate") || "YYYY-MM-DD"}
                  </p>
                </div>
              </div>
              <div className="border-t dark:border-gray-600 pt-4 mt-4">
                {certificateContent ? (
                  <div
                    className="prose dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: certificateContent }}
                  />
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 italic">
                    No certificate content added yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-between">
        {step > 1 ? (
          <button
            type="button"
            onClick={handleBack}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium rounded-lg transition flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden md:inline">Back</span>
          </button>
        ) : (
          <div></div>
        )}

        {step < 4 ? (
          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition flex items-center gap-2"
          >
            <span className="hidden md:inline">Next</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit(onSubmit)}
            className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span className="hidden md:inline">Submit Certificate</span>
            <span className="md:hidden">Submit</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default MultiStepForm;
