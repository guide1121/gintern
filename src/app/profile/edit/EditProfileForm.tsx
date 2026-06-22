"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/app/actions/profile";
import { User, ArrowLeft, Loader2, Save, Camera, Trash2, RotateCcw, UploadCloud, X, Check, AlertTriangle } from "lucide-react";
import Link from "next/link";
import ReactCrop, { centerCrop, makeAspectCrop, Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

type Props = {
  user: {
    name: string;
    email: string;
    image: string | null;
    workPlace: string | null;
    studyPlace: string | null;
    fieldOfStudy: string | null;
    bio: string | null;
    role: string | null;
  };
};

const FIELDS_OF_STUDY = [
  "IT / เทคโนโลยี",
  "Medical / การแพทย์",
  "Business / บริหารธุรกิจ",
  "Account / บัญชี",
  "Engineering / วิศวกรรมศาสตร์",
  "Design / ศิลปกรรมศาสตร์",
  "Science / วิทยาศาสตร์",
  "Humanities / มนุษยศาสตร์",
  "Other / อื่นๆ"
];

// รายชื่อมหาวิทยาลัยไทยยอดนิยมสำหรับใช้ทำ Autocomplete
const THAI_UNIVERSITIES = [
  "จุฬาลงกรณ์มหาวิทยาลัย",
  "มหาวิทยาลัยธรรมศาสตร์",
  "มหาวิทยาลัยเกษตรศาสตร์",
  "มหาวิทยาลัยมหิดล",
  "มหาวิทยาลัยเชียงใหม่",
  "มหาวิทยาลัยขอนแก่น",
  "มหาวิทยาลัยศรีนครินทรวิโรฒ",
  "มหาวิทยาลัยศิลปากร",
  "มหาวิทยาลัยสงขลานครินทร์",
  "สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง",
  "มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี",
  "มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ",
  "มหาวิทยาลัยรามคำแหง",
  "มหาวิทยาลัยสุโขทัยธรรมาธิราช",
  "มหาวิทยาลัยอัสสัมชัญ",
  "มหาวิทยาลัยกรุงเทพ",
  "มหาวิทยาลัยรังสิต",
  "มหาวิทยาลัยหอการค้าไทย",
  "มหาวิทยาลัยศรีปทุม",
  "มหาวิทยาลัยพายัพ",
  "มหาวิทยาลัยหัวเฉียวเฉลิมพระเกียรติ",
  "มหาวิทยาลัยธุรกิจบัณฑิตย์",
  "มหาวิทยาลัยเกริก",
  "มหาวิทยาลัยเกษมบัณฑิต",
  "มหาวิทยาลัยสยาม",
  "มหาวิทยาลัยบูรพา",
  "มหาวิทยาลัยnเรศวร",
  "มหาวิทยาลัยมหาสารคาม",
  "มหาวิทยาลัยแม่ฟ้าหลวง",
  "มหาวิทยาลัยพะเยา",
  "มหาวิทยาลัยอุบลราชธานี",
  "มหาวิทยาลัยทักษิณ",
  "มหาวิทยาลัยเทคโนโลยีสุรนารี",
  "มหาวิทยาลัยราชภัฏสวนสุนันทา",
  "มหาวิทยาลัยราชภัฏจันทรเกษม",
  "มหาวิทยาลัยราชภัฏพระนคร",
  "มหาวิทยาลัยราชภัฏธนบุรี",
  "มหาวิทยาลัยราชภัฏบ้านสมเด็จเจ้าพระยา",
  "มหาวิทยาลัยเทคโนโลยีราชมงคลธัญบุรี",
  "มหาวิทยาลัยเทคโนโลยีราชมงคลกรุงเทพ",
  "มหาวิทยาลัยเทคโนโลยีราชมงคลพระนคร",
  "มหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา",
  "มหาวิทยาลัยเทคโนโลยีราชมงคลตะวันออก",
  "มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน",
  "มหาวิทยาลัยเทคโนโลยีราชมงคลศรีวิชัย",
  "มหาวิทยาลัยเทคโนโลยีราชมงคลสุวรรณภูมิ",
  "สถาบันการจัดการปัญญาภิวัฒน์"
];

// ฟังก์ชันแปลงข้อมูลพื้นที่ครอบตัดรูปภาพด้วย HTML5 Canvas บนฝั่ง Client
function getCroppedImg(
  image: HTMLImageElement,
  crop: PixelCrop
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  
  canvas.width = crop.width;
  canvas.height = crop.height;
  
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return Promise.reject(new Error("ไม่สามารถสร้าง 2d context สำหรับ Canvas ได้"));
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas ว่างเปล่า"));
          return;
        }
        resolve(blob);
      },
      "image/jpeg",
      0.95
    );
  });
}

export function EditProfileForm({ user }: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cropImageRef = useRef<HTMLImageElement>(null);
  const uniContainerRef = useRef<HTMLDivElement>(null);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ควบคุมฟิลด์ข้อมูลใน State
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio || "");
  const [studyPlace, setStudyPlace] = useState(user.studyPlace || "");
  const [workPlace, setWorkPlace] = useState(user.workPlace || "");
  const [fieldOfStudy, setFieldOfStudy] = useState(user.fieldOfStudy || "");

  // ค้นหามหาวิทยาลัย (Combobox States)
  const [uniSearch, setUniSearch] = useState(user.studyPlace || "");
  const [isUniDropdownOpen, setIsUniDropdownOpen] = useState(false);

  // จัดการเกี่ยวกับการอัปโหลดรูปภาพ
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(user.image);
  const [deleteAvatar, setDeleteAvatar] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // เกี่ยวกับการครอบตัดรูปภาพ (Crop States)
  const [srcToCrop, setSrcToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [originalFileName, setOriginalFileName] = useState("avatar.jpg");

  // ตรวจจับการคลิกด้านนอกของ Dropdown ค้นหามหาวิทยาลัยเพื่อทำการปิด
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (uniContainerRef.current && !uniContainerRef.current.contains(e.target as Node)) {
        setIsUniDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // กรองรายชื่อมหาวิทยาลัยตามคำค้นหา
  const filteredUnis = useMemo(() => {
    const query = uniSearch.trim().toLowerCase();
    if (!query) return THAI_UNIVERSITIES;
    return THAI_UNIVERSITIES.filter((uni) => uni.toLowerCase().includes(query));
  }, [uniSearch]);

  // เช็คว่ามีคำที่ตรงเป๊ะในรายการสถาบันหรือเปล่า
  const exactMatch = useMemo(() => {
    return THAI_UNIVERSITIES.some((uni) => uni.toLowerCase() === uniSearch.trim().toLowerCase());
  }, [uniSearch]);

  // คืนค่าหน่วยความจำ Preview URL เมื่อ Component unmount หรือไฟล์เปลี่ยน
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // ฟังก์ชันตรวจสอบและสืบค้นไฟล์รูปภาพต้นฉบับ เพื่อส่งต่อไปยังตัวครอบตัด
  function processFile(file: File) {
    setError(null);

    if (!file.type.startsWith("image/")) {
      setError("ไฟล์ที่อัปโหลดต้องเป็นรูปภาพเท่านั้น (.jpg, .png, .webp, .gif)");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("ขนาดไฟล์รูปภาพห้ามเกิน 2MB");
      return;
    }

    setOriginalFileName(file.name);
    
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setSrcToCrop(reader.result as string);
    });
    reader.readAsDataURL(file);
  }

  // ตั้งค่าพื้นที่ครอบตัดเริ่มต้นให้อยู่กึ่งกลางสัดส่วน 1:1
  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    const initialCrop = centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: 90,
        },
        1,
        width,
        height
      ),
      width,
      height
    );
    setCrop(initialCrop);
  }

  // ยืนยันการครอบตัดรูปภาพจาก Canvas
  async function handleConfirmCrop() {
    if (cropImageRef.current && completedCrop) {
      try {
        const croppedBlob = await getCroppedImg(cropImageRef.current, completedCrop);
        const croppedFile = new File([croppedBlob], originalFileName, {
          type: "image/jpeg",
        });

        setAvatarFile(croppedFile);
        setDeleteAvatar(false);

        const objectUrl = URL.createObjectURL(croppedFile);
        setPreviewUrl(objectUrl);

        setSrcToCrop(null);
        setCompletedCrop(null);
      } catch (err) {
        console.error(err);
        setError("เกิดข้อผิดพลาดในการประมวลผลครอบตัดรูปภาพ");
        setSrcToCrop(null);
      }
    }
  }

  // จัดการ Drag & Drop Events
  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  }

  // ทริกเกอร์เรียกดูไฟล์ผ่าน Input
  function triggerFileInput() {
    fileInputRef.current?.click();
  }

  // ลบรูปภาพโปรไฟล์ออก
  function handleRemoveImage() {
    setAvatarFile(null);
    setPreviewUrl(null);
    setDeleteAvatar(true);
    setError(null);
  }

  // คืนค่ารูปเดิม
  function handleResetImage() {
    setAvatarFile(null);
    setPreviewUrl(user.image);
    setDeleteAvatar(false);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("bio", bio);
    formData.append("studyPlace", studyPlace);
    formData.append("workPlace", workPlace);
    formData.append("fieldOfStudy", fieldOfStudy);
    formData.append("deleteAvatar", deleteAvatar ? "true" : "false");
    
    if (avatarFile) {
      formData.append("avatarFile", avatarFile);
    }

    try {
      const res = await updateProfile(formData);
      if (res?.error) {
        setError(res.error);
        setLoading(false);
      } else {
        window.location.href = "/profile";
      }
    } catch (err) {
      console.error(err);
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
      setLoading(false);
    }
  }

  const initials = (name || "?").charAt(0).toUpperCase();

  return (
    <main className="flex-1 max-w-2xl mx-auto px-4 py-8 w-full">
      {/* Back Button */}
      <Link
        href="/profile"
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink transition-colors duration-150 mb-6 group cursor-pointer"
        data-font="ui"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        <span>กลับไปยังหน้าโปรไฟล์</span>
      </Link>

      <div className="bg-white rounded-2xl border border-border shadow-md hover:shadow-lg transition-shadow duration-200 p-6 sm:p-8">
        <div className="border-b border-border pb-4 mb-6">
          <h1 className="text-xl font-medium text-ink flex items-center gap-2" data-font="ui">
            <User className="w-5 h-5 text-primary" />
            แก้ไขข้อมูลส่วนตัว
          </h1>
          <p className="text-xs text-muted mt-1">อัปเดตประวัติส่วนตัว รูปโปรไฟล์ สถาบันการเรียน หรือสถานที่ทำงานของคุณ</p>
        </div>

        {error && (
          <div className="mb-5 p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-800 text-sm font-medium flex items-center gap-2" data-font="ui">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Upload Drop Zone */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink block" data-font="ui">
              รูปภาพโปรไฟล์
            </label>
            
            <div className="flex flex-col sm:flex-row items-center gap-5 p-5 border border-border rounded-2xl bg-surface/50">
              {/* Image Circle Preview */}
              <div className="relative group shrink-0">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Avatar Preview"
                    width={96}
                    height={96}
                    className="w-24 h-24 rounded-full object-cover border-2 border-white ring-2 ring-primary-light shadow-sm"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-primary-light text-primary-ink flex items-center justify-center text-3xl font-medium border-2 border-white ring-2 ring-primary-light/50 select-none" data-font="ui">
                    {initials}
                  </div>
                )}
                
                {/* Camera Overlay Button */}
                <button
                  type="button"
                  onClick={triggerFileInput}
                  className="absolute inset-0 w-24 h-24 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer"
                  aria-label="เปลี่ยนรูปภาพ"
                >
                  <Camera className="w-6 h-6" />
                </button>
              </div>

              {/* Drag & Drop Instructions */}
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={triggerFileInput}
                className={`flex-1 w-full border-2 border-dashed rounded-xl p-4 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                  isDragging 
                    ? "border-primary bg-primary-light/20 shadow-md" 
                    : "border-border hover:border-primary-light bg-white hover:bg-surface/30"
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <UploadCloud className={`w-6 h-6 ${isDragging ? "text-primary animate-pulse" : "text-muted"}`} />
                <p className="text-xs text-ink font-medium" data-font="ui">
                  ลากไฟล์รูปมาวางที่นี่ หรือ <span className="text-primary hover:underline">เลือกไฟล์ภาพ</span>
                </p>
                <p className="text-[10px] text-muted leading-none">
                  ไฟล์ JPEG, PNG, WEBP หรือ GIF ขนาดไม่เกิน 2MB
                </p>
              </div>
            </div>

            {/* Quick Actions for Avatar */}
            {(previewUrl !== user.image || user.image !== null) && (
              <div className="flex justify-center sm:justify-start gap-2 pt-1">
                {previewUrl !== null && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    data-font="ui"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>ลบรูปโปรไฟล์</span>
                  </button>
                )}
                {(avatarFile !== null || deleteAvatar) && (
                  <button
                    type="button"
                    onClick={handleResetImage}
                    className="flex items-center gap-1.5 text-xs text-muted hover:text-ink bg-surface hover:bg-border/40 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    data-font="ui"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>คืนค่ารูปเดิม</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Role (Read Only) */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-muted block" data-font="ui">
              บทบาทการใช้งาน
            </label>
            <div className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-muted text-sm font-medium flex items-center gap-2 select-none">
              {user.role === "admin" ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>ผู้ดูแลระบบ (Admin)</span>
                </>
              ) : user.role === "recommender" ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>ผู้แนะนำ (Recommender)</span>
                </>
              ) : user.role === "reader" ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>ผู้อ่าน (Reader)</span>
                </>
              ) : (
                <span>ยังไม่ได้ระบุบทบาท</span>
              )}
            </div>
          </div>

          {/* Display Name */}
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-sm font-medium text-ink block" data-font="ui">
              ชื่อแสดงตัวตน <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="กรอกชื่อของคุณ"
              className="w-full bg-white border border-border rounded-xl px-4 py-2.5 text-ink placeholder:text-muted outline-none focus:ring-2 focus:ring-primary transition-shadow text-sm"
              required
            />
          </div>

          {/* Bio */}
          <div className="space-y-1.5">
            <label htmlFor="bio" className="text-sm font-medium text-ink block" data-font="ui">
              คำแนะนำตัว (Bio)
            </label>
            <textarea
              id="bio"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="แนะนำตัวสั้นๆ ให้รุ่นน้องได้รู้จัก เช่น ความสนใจ หรือสิ่งที่กำลังศึกษาอยู่..."
              className="w-full bg-white border border-border rounded-xl px-4 py-2.5 text-ink placeholder:text-muted outline-none focus:ring-2 focus:ring-primary transition-shadow text-sm resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Study Place (Combobox Dropdown) */}
            <div ref={uniContainerRef} className="space-y-1.5 relative">
              <label htmlFor="studyPlace" className="text-sm font-medium text-ink block" data-font="ui">
                สถานศึกษา
              </label>
              <input
                type="text"
                id="studyPlace"
                value={uniSearch}
                onFocus={() => setIsUniDropdownOpen(true)}
                onChange={(e) => {
                  setUniSearch(e.target.value);
                  setStudyPlace(e.target.value); // ซิงค์ค่าไปพร้อมกันในกรณีผู้ใช้พิมพ์ข้อความเอง
                  setIsUniDropdownOpen(true);
                }}
                placeholder="พิมพ์ค้นหาชื่อมหาวิทยาลัย..."
                className="w-full bg-white border border-border rounded-xl px-4 py-2.5 text-ink placeholder:text-muted outline-none focus:ring-2 focus:ring-primary transition-shadow text-sm"
                autoComplete="off"
              />
              
              {/* Autocomplete Dropdown */}
              {isUniDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-white border border-border rounded-xl shadow-lg z-30 py-1 scrollbar-thin">
                  {filteredUnis.length > 0 ? (
                    filteredUnis.map((uni) => (
                      <button
                        key={uni}
                        type="button"
                        onClick={() => {
                          setStudyPlace(uni);
                          setUniSearch(uni);
                          setIsUniDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-ink hover:bg-surface-hover transition-colors cursor-pointer block"
                      >
                        {uni}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-xs text-muted" data-font="ui">ไม่พบสถาบันที่ตรงกัน</div>
                  )}

                  {/* Fallback Option: เมื่อชื่อไม่ตรงกับในรายการ */}
                  {uniSearch.trim() && !exactMatch && (
                    <button
                      type="button"
                      onClick={() => {
                        setStudyPlace(uniSearch.trim());
                        setIsUniDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 text-xs text-primary hover:bg-primary-light/10 font-medium border-t border-border mt-1 cursor-pointer flex items-center gap-1.5"
                      data-font="ui"
                    >
                      <span>ใช้ค่าสถาบัน:</span>
                      <strong className="text-ink truncate max-w-[200px]">"{uniSearch.trim()}"</strong>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Work Place */}
            <div className="space-y-1.5">
              <label htmlFor="workPlace" className="text-sm font-medium text-ink block" data-font="ui">
                สถานที่ทำงาน / ที่ฝึกงาน
              </label>
              <input
                type="text"
                id="workPlace"
                value={workPlace}
                onChange={(e) => setWorkPlace(e.target.value)}
                placeholder="เช่น LINE MAN Wongnai"
                className="w-full bg-white border border-border rounded-xl px-4 py-2.5 text-ink placeholder:text-muted outline-none focus:ring-2 focus:ring-primary transition-shadow text-sm"
              />
            </div>
          </div>

          {/* Field of Study */}
          <div className="space-y-1.5">
            <label htmlFor="fieldOfStudy" className="text-sm font-medium text-ink block" data-font="ui">
              สายการเรียน / สาขาวิชา
            </label>
            <div className="relative">
              <select
                id="fieldOfStudy"
                value={fieldOfStudy}
                onChange={(e) => setFieldOfStudy(e.target.value)}
                className="w-full bg-white border border-border rounded-xl pl-4 pr-10 py-2.5 text-ink outline-none focus:ring-2 focus:ring-primary transition-shadow text-sm cursor-pointer appearance-none"
                data-font="ui"
              >
                <option value="">-- เลือกสายการเรียน --</option>
                {FIELDS_OF_STUDY.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <svg
                className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Link
              href="/profile"
              className="px-5 py-2.5 rounded-xl border border-border text-sm text-ink hover:bg-surface transition-colors active:scale-[0.97] cursor-pointer bg-white font-medium"
              data-font="ui"
            >
              ยกเลิก
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 bg-primary text-primary-ink px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-hover transition-colors active:scale-[0.97] cursor-pointer disabled:opacity-75 disabled:pointer-events-none"
              data-font="ui"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>กำลังบันทึก...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>บันทึกข้อมูล</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Image Crop Modal Interface */}
      {srcToCrop && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h2 className="text-base font-semibold text-ink" data-font="ui">
                ปรับขนาดภาพโปรไฟล์
              </h2>
              <button
                type="button"
                onClick={() => setSrcToCrop(null)}
                className="text-muted hover:text-ink transition-colors cursor-pointer"
                aria-label="ปิด"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body (Cropping Area) */}
            <div className="p-6 overflow-y-auto flex-1 bg-surface/30 flex items-center justify-center min-h-[280px]">
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={1}
                circularCrop
                className="max-h-[50vh]"
              >
                <img
                  ref={cropImageRef}
                  src={srcToCrop}
                  onLoad={onImageLoad}
                  alt="Crop preview"
                  className="max-h-[50vh] object-contain mx-auto"
                />
              </ReactCrop>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-3 bg-white">
              <button
                type="button"
                onClick={() => setSrcToCrop(null)}
                className="px-4 py-2 border border-border hover:bg-surface rounded-xl text-sm font-medium transition-colors cursor-pointer text-muted hover:text-ink bg-white"
                data-font="ui"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleConfirmCrop}
                className="inline-flex items-center gap-1.5 bg-primary text-primary-ink px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-hover transition-colors active:scale-[0.97] cursor-pointer"
                data-font="ui"
              >
                <Check className="w-4 h-4" />
                <span>ครอบตัดรูปภาพ</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
