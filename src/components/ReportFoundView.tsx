import React, { useState, useRef } from 'react';
import { Category, CmuLocation, LostItem } from '../types';
import { CMU_LOCATIONS } from '../data/mockData';
import { Camera, Upload, CheckCircle2, ArrowLeft, Image as ImageIcon } from 'lucide-react';

interface ReportFoundViewProps {
  onBack: () => void;
  onSubmitFound: (item: Omit<LostItem, 'id'>) => void;
}

const CATEGORIES_LIST: Category[] = [
  'กระเป๋า',
  'บัตร/เอกสาร',
  'อิเล็กทรอนิกส์',
  'เสื้อผ้า',
  'อื่นๆ'
];

export const ReportFoundView: React.FC<ReportFoundViewProps> = ({ onBack, onSubmitFound }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageUrl, setImageUrl] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<Category>('อิเล็กทรอนิกส์');
  const [location, setLocation] = useState<CmuLocation>('หอสมุดกลาง มช.');
  const [customLocation, setCustomLocation] = useState<string>('');
  const [specificLocation, setSpecificLocation] = useState<string>('');
  const [foundDateTime, setFoundDateTime] = useState<string>(() => {
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
  });
  const [description, setDescription] = useState<string>('');
  const [contactType, setContactType] = useState<'phone' | 'line'>('phone');
  const [contact, setContact] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUsePresetPhoto = (sampleUrl: string, sampleTitle: string) => {
    setImageUrl(sampleUrl);
    if (!title) setTitle(sampleTitle);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);

    const formattedDate = new Date(foundDateTime).toLocaleString('th-TH', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }) + ' น.';

    const finalLocation = location === 'ระบุเอง' && customLocation ? (customLocation as CmuLocation) : location;

    const depositPoint =
      finalLocation === 'หอสมุดกลาง มช.'
        ? 'เคาน์เตอร์บริการ ชั้น 1 หอสมุดกลาง มช.'
        : finalLocation === 'โรงอาหารกลาง (ศาลาอ่าน)'
        ? 'ป้อมเจ้าหน้าที่ รปภ. ประจำโรงอาหารกลาง'
        : 'จุดรับฝากของกลาง มช.';

    const newItem: Omit<LostItem, 'id'> = {
      title: title.trim(),
      category,
      location: finalLocation,
      specificLocation: specificLocation.trim() || 'บริเวณพื้นที่ส่วนกลาง',
      foundDateTime: formattedDate,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80',
      description: description.trim() || 'สิ่งของตกหล่นรอเจ้าของยืนยันรับคืน',
      contact: contact.trim() || 'ติดต่อเคาน์เตอร์บริการ มช.',
      contactType,
      status: 'available',
      aiSimilarityScore: Math.floor(Math.random() * 15) + 85,
      matchedFeatures: [category, finalLocation],
      depositPoint
    };

    setTimeout(() => {
      onSubmitFound(newItem);
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 400);
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center p-4 text-center min-h-[420px] gap-3">
        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="text-base font-bold text-zinc-900">บันทึกข้อมูลของที่พบสำเร็จ</h2>
          <p className="text-xs text-zinc-600 max-w-[280px]">
            ระบบ AI กำลังวิเคราะห์และตรวจสอบจับคู่กับรายการแจ้งของหายในเครือข่าย มช.
          </p>
        </div>
        <div className="w-full bg-zinc-50 border border-zinc-200 rounded-lg p-3 text-left text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-zinc-500">ชื่อรายการ:</span>
            <span className="font-semibold text-zinc-800">{title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">สถานที่:</span>
            <span className="text-zinc-800">{location}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">จุดนำส่ง:</span>
            <span className="text-indigo-700 font-medium">นำส่งเคาน์เตอร์จุดบริการแล้ว</span>
          </div>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="w-full h-11 bg-indigo-700 text-white font-medium text-sm rounded-lg active:bg-indigo-800 transition-colors mt-2"
        >
          กลับสู่หน้าหลัก
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full pb-24">
      {/* Top Bar with Back Button - cleanly anchored to top of scroll view */}
      <div className="flex items-center gap-2 px-3 py-2.5 bg-white border-b border-zinc-200 sticky top-0 z-30 shadow-2xs">
        <button
          type="button"
          onClick={onBack}
          className="w-8 h-8 -ml-1 rounded-md flex items-center justify-center text-zinc-700 hover:bg-zinc-100 active:bg-zinc-200 transition-colors"
          aria-label="ย้อนกลับ"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex flex-col leading-tight">
          <h1 className="text-sm font-bold text-zinc-900">แจ้งของที่เจอ</h1>
          <span className="text-[11px] text-zinc-500">กรอกข้อมูลเพื่อส่งระบบ AI จับคู่</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 p-2.5">
        {/* ช่องอัปโหลดรูปด้านบนสุด ขนาดพอดี แตะเพื่อถ่ายรูป/เลือกรูป */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-zinc-800 flex items-center justify-between">
            <span>รูปถ่ายสิ่งของที่เจอ</span>
            <span className="text-[10px] text-zinc-400 font-normal">แตะเพื่อถ่ายรูปหรือเลือกรูป</span>
          </label>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleImageFileChange}
          />

          <div
            id="image-upload-box"
            onClick={() => fileInputRef.current?.click()}
            className={`w-full h-36 rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative ${
              imageUrl
                ? 'border-indigo-500 bg-zinc-950'
                : 'border-zinc-300 bg-zinc-50 hover:bg-zinc-100'
            }`}
          >
            {imageUrl ? (
              <>
                <img src={imageUrl} alt="พรีวิวรูปของที่เจอ" className="w-full h-full object-contain" />
                <div className="absolute bottom-1.5 right-1.5 bg-black/70 text-white px-2 py-0.5 rounded text-[10px] flex items-center gap-1">
                  <Camera className="w-3 h-3" />
                  เปลี่ยนรูป
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-1 text-zinc-500 p-2 text-center">
                <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center">
                  <Camera className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium text-zinc-700">แตะเพื่อถ่ายรูป หรือเลือกไฟล์</span>
                <span className="text-[10px] text-zinc-400">ขนาดภาพไม่เกิน 10MB</span>
              </div>
            )}
          </div>

          {/* Preset Samples Quick Pick for Testing */}
          <div className="flex items-center gap-1.5 pt-0.5 overflow-x-auto no-scrollbar">
            <span className="text-[10px] text-zinc-400 shrink-0">ตัวอย่าง:</span>
            <button
              type="button"
              onClick={() =>
                handleUsePresetPhoto(
                  'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80',
                  'หูฟังบลูทูธเคสขาว'
                )
              }
              className="text-[10px] px-2 py-0.5 bg-zinc-200/80 rounded text-zinc-700 shrink-0 hover:bg-zinc-300"
            >
              หูฟัง AirPods
            </button>
            <button
              type="button"
              onClick={() =>
                handleUsePresetPhoto(
                  'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
                  'บัตรนักศึกษา มช.'
                )
              }
              className="text-[10px] px-2 py-0.5 bg-zinc-200/80 rounded text-zinc-700 shrink-0 hover:bg-zinc-300"
            >
              บัตร มช.
            </button>
            <button
              type="button"
              onClick={() =>
                handleUsePresetPhoto(
                  'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop&q=80',
                  'กระเป๋าสตางค์หนัง'
                )
              }
              className="text-[10px] px-2 py-0.5 bg-zinc-200/80 rounded text-zinc-700 shrink-0 hover:bg-zinc-300"
            >
              กระเป๋าเงิน
            </button>
          </div>
        </div>

        {/* ชื่อสิ่งของ - Field height <= 44px, tight label */}
        <div className="flex flex-col gap-0.5">
          <label className="text-xs font-semibold text-zinc-800">
            ชื่อสิ่งของ / ยี่ห้อ <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="เช่น หูฟังเคสสีขาว, บัตรนักศึกษา"
            className="w-full h-10 px-2.5 text-xs bg-white border border-zinc-300 rounded-md focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
          />
        </div>

        {/* จุดที่เจอ (Dropdown) - Field height <= 44px */}
        <div className="flex flex-col gap-0.5">
          <label className="text-xs font-semibold text-zinc-800">
            จุดที่เจอ <span className="text-red-500">*</span>
          </label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value as CmuLocation)}
            className="w-full h-10 px-2.5 text-xs bg-white border border-zinc-300 rounded-md focus:outline-none focus:border-indigo-600 text-zinc-800 font-normal"
          >
            {CMU_LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {location === 'ระบุเอง' && (
          <div className="flex flex-col gap-0.5">
            <label className="text-xs font-semibold text-zinc-800">ระบุสถานที่เพิ่มเติม</label>
            <input
              type="text"
              value={customLocation}
              onChange={(e) => setCustomLocation(e.target.value)}
              placeholder="ระบุชื่อคณะ หรือตึกในมช."
              className="w-full h-10 px-2.5 text-xs bg-white border border-zinc-300 rounded-md focus:outline-none focus:border-indigo-600"
            />
          </div>
        )}

        {/* ตำแหน่งย่อยเฉพาะจุด */}
        <div className="flex flex-col gap-0.5">
          <label className="text-xs font-semibold text-zinc-800">ตำแหน่งเฉพาะเจาะจง</label>
          <input
            type="text"
            value={specificLocation}
            onChange={(e) => setSpecificLocation(e.target.value)}
            placeholder="เช่น ชั้น 2 โต๊ะริมหน้าต่าง, ใกล้ร้านเครื่องดื่ม"
            className="w-full h-10 px-2.5 text-xs bg-white border border-zinc-300 rounded-md focus:outline-none focus:border-indigo-600"
          />
        </div>

        {/* วันเวลาที่เจอ - Field height <= 44px */}
        <div className="flex flex-col gap-0.5">
          <label className="text-xs font-semibold text-zinc-800">
            วันเวลาที่เจอ <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            value={foundDateTime}
            onChange={(e) => setFoundDateTime(e.target.value)}
            className="w-full h-10 px-2.5 text-xs bg-white border border-zinc-300 rounded-md focus:outline-none focus:border-indigo-600 text-zinc-800"
          />
        </div>

        {/* หมวดหมู่ของ (Chip selector แนวนอน เลื่อนได้) */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-zinc-800">หมวดหมู่ของ</label>
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 no-scrollbar">
            {CATEGORIES_LIST.map((cat) => {
              const active = category === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`shrink-0 text-xs px-2.5 py-1.5 rounded-full border transition-all whitespace-nowrap ${
                    active
                      ? 'bg-indigo-700 text-white border-indigo-700 font-medium'
                      : 'bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-50'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* รายละเอียดเพิ่มเติม (Textarea เตี้ย) */}
        <div className="flex flex-col gap-0.5">
          <label className="text-xs font-semibold text-zinc-800">รายละเอียดเพิ่มเติม</label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="เช่น สี, จุดสังเกตเฉพาะ, รอยตำหนิ"
            className="w-full p-2 text-xs bg-white border border-zinc-300 rounded-md focus:outline-none focus:border-indigo-600 resize-none"
          />
        </div>

        {/* ช่องทางติดต่อ (เบอร์โทร หรือ LINE ID) - Field height <= 44px */}
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-zinc-800">ช่องทางติดต่อผู้แจ้ง</label>
            <div className="flex items-center gap-1 text-[11px]">
              <button
                type="button"
                onClick={() => setContactType('phone')}
                className={`px-1.5 py-0.2 rounded ${
                  contactType === 'phone'
                    ? 'bg-zinc-800 text-white font-medium'
                    : 'text-zinc-500 hover:bg-zinc-100'
                }`}
              >
                เบอร์โทร
              </button>
              <button
                type="button"
                onClick={() => setContactType('line')}
                className={`px-1.5 py-0.2 rounded ${
                  contactType === 'line'
                    ? 'bg-emerald-700 text-white font-medium'
                    : 'text-zinc-500 hover:bg-zinc-100'
                }`}
              >
                LINE ID
              </button>
            </div>
          </div>
          <input
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder={
              contactType === 'phone'
                ? 'เช่น 081-xxx-xxxx'
                : 'เช่น cmu_student123'
            }
            className="w-full h-10 px-2.5 text-xs bg-white border border-zinc-300 rounded-md focus:outline-none focus:border-indigo-600"
          />
        </div>

        {/* จุดนำส่งสิ่งของจริง */}
        <div className="bg-zinc-50 border border-zinc-200 rounded-md p-2 text-[11px] text-zinc-600">
          <span className="font-semibold text-zinc-800 block">คำแนะนำ:</span>
          เพื่อความปลอดภัย กรุณานำสิ่งของฝากไว้ที่เคาน์เตอร์บริการ หอสมุดกลาง มช. หรือป้อม รปภ. ศาลาอ่าน
        </div>

        {/* ปุ่ม Submit เต็มความกว้าง Sticky ด้านล่างจอ */}
        <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto p-2 bg-white/95 backdrop-blur-md border-t border-zinc-200 z-40">
          <button
            type="submit"
            disabled={isSubmitting || !title.trim()}
            className="w-full h-11 bg-indigo-700 text-white font-semibold text-sm rounded-lg active:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-xs transition-colors flex items-center justify-center gap-1.5"
          >
            {isSubmitting ? (
              <span>กำลังบันทึกและส่ง AI วิเคราะห์...</span>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>ยืนยันแจ้งของที่เจอ</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
