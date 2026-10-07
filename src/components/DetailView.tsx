import React, { useState } from 'react';
import { LostItem, ClaimRecord } from '../types';
import { ClaimModal } from './ClaimModal';
import { ArrowLeft, MapPin, Clock, Tag, ShieldCheck, Share2, Sparkles } from 'lucide-react';

interface DetailViewProps {
  item: LostItem;
  onBack: () => void;
  onClaimItem: (claim: ClaimRecord) => void;
}

export const DetailView: React.FC<DetailViewProps> = ({ item, onBack, onClaimItem }) => {
  const [isClaimModalOpen, setIsClaimModalOpen] = useState<boolean>(false);
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `[FindIt CMU] พบสิ่งของตกหล่น: ${item.title} ณ ${item.location} (${item.foundDateTime})`
      );
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2000);
    }
  };

  return (
    <div className="flex flex-col min-h-full pb-24 bg-white">
      {/* รูปเต็มความกว้างจอด้านบน (อัตราส่วน 4:3 หรือ 1:1) พร้อมปุ่มย้อนกลับลอย */}
      <div className="relative w-full aspect-[4/3] bg-zinc-950 overflow-hidden">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-full object-cover"
        />

        {/* Floating Top Controls */}
        <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between z-20">
          <button
            type="button"
            onClick={onBack}
            className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center active:scale-95 transition-transform"
            aria-label="ย้อนกลับ"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center active:scale-95 transition-transform"
            aria-label="คัดลอกลิงก์"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Status Chip */}
        <div className="absolute bottom-2.5 left-2.5 bg-black/75 backdrop-blur-md text-white text-[11px] font-medium px-2 py-0.5 rounded">
          สถานะ: รอส่งมอบคืนเจ้าของ
        </div>

        {item.aiSimilarityScore && (
          <div className="absolute bottom-2.5 right-2.5 bg-indigo-600/90 backdrop-blur-md text-white text-[11px] font-mono font-semibold px-2 py-0.5 rounded flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            AI แม่นยำ {item.aiSimilarityScore}%
          </div>
        )}
      </div>

      {copiedNotification && (
        <div className="bg-zinc-800 text-white text-xs px-3 py-1 text-center font-medium">
          คัดลอกข้อความสำหรับแชร์เรียบร้อย
        </div>
      )}

      {/* ข้อมูลด้านล่าง list แบบ label-value ชิดกัน ไม่มี divider หนาหรือเว้นบรรทัด */}
      <div className="p-3 flex flex-col gap-2">
        {/* Title Header */}
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5 text-[11px] text-indigo-700 font-medium">
            <Tag className="w-3 h-3" />
            <span>หมวดหมู่: {item.category}</span>
          </div>
          <h1 className="text-base font-bold text-zinc-900 leading-snug">{item.title}</h1>
        </div>

        {/* Compact Label-Value List - Strictly tight without thick dividers */}
        <div className="bg-zinc-50 rounded-lg p-2.5 flex flex-col gap-1.5 text-xs">
          <div className="flex items-start justify-between py-0.5 border-b border-zinc-200/50">
            <span className="text-zinc-500 shrink-0 w-24">จุดบริการหลัก</span>
            <span className="font-semibold text-zinc-900 text-right flex-1 flex items-center justify-end gap-1">
              <MapPin className="w-3 h-3 text-indigo-600 shrink-0" />
              {item.location}
            </span>
          </div>

          <div className="flex items-start justify-between py-0.5 border-b border-zinc-200/50">
            <span className="text-zinc-500 shrink-0 w-24">ตำแหน่งที่พบ</span>
            <span className="text-zinc-800 text-right flex-1">{item.specificLocation}</span>
          </div>

          <div className="flex items-start justify-between py-0.5 border-b border-zinc-200/50">
            <span className="text-zinc-500 shrink-0 w-24">วันเวลาที่พบ</span>
            <span className="text-zinc-800 text-right flex-1 flex items-center justify-end gap-1">
              <Clock className="w-3 h-3 text-zinc-400 shrink-0" />
              {item.foundDateTime}
            </span>
          </div>

          <div className="flex items-start justify-between py-0.5 border-b border-zinc-200/50">
            <span className="text-zinc-500 shrink-0 w-24">จุดเก็บรักษา</span>
            <span className="text-indigo-700 font-medium text-right flex-1">{item.depositPoint}</span>
          </div>

          <div className="flex items-start justify-between py-0.5 border-b border-zinc-200/50">
            <span className="text-zinc-500 shrink-0 w-24">ผู้แจ้งเบื้องต้น</span>
            <span className="text-zinc-800 text-right flex-1 font-mono">
              {item.contactType === 'phone' ? 'เบอร์: ' : 'LINE: '}
              {item.contact}
            </span>
          </div>

          <div className="flex flex-col gap-0.5 pt-0.5">
            <span className="text-zinc-500 font-medium">รายละเอียดลักษณะ:</span>
            <p className="text-zinc-800 leading-relaxed bg-white p-2 rounded border border-zinc-200/70 text-xs">
              {item.description}
            </p>
          </div>

          {item.matchedFeatures && item.matchedFeatures.length > 0 && (
            <div className="flex flex-col gap-1 pt-1">
              <span className="text-[11px] text-zinc-500 font-medium flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-600" />
                คุณลักษณะเด่นที่ AI ตรวจพบ:
              </span>
              <div className="flex flex-wrap gap-1">
                {item.matchedFeatures.map((feat, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200/80 px-2 py-0.5 rounded"
                  >
                    {feat}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Safe notice */}
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-md p-2 text-[11px] text-amber-900 flex items-start gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
          <span>
            เพื่อป้องกันการแอบอ้าง ผู้ขอรับต้องแสดงบัตรนักศึกษาหรือหลักฐานยืนยัน เช่น ภาพถ่าย หรือรหัสปลดล็อคเครื่อง ณ เคาน์เตอร์
          </span>
        </div>
      </div>

      {/* ปุ่ม "นี่ของฉัน" Sticky ด้านล่างจอ */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto p-2.5 bg-white/95 backdrop-blur-md border-t border-zinc-200 z-40">
        <button
          id="btn-claim-this-item"
          type="button"
          onClick={() => setIsClaimModalOpen(true)}
          className="w-full h-11 bg-indigo-700 hover:bg-indigo-800 active:bg-indigo-900 text-white font-bold text-sm rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>นี่ของฉัน</span>
        </button>
      </div>

      {/* Claim Modal */}
      <ClaimModal
        item={item}
        isOpen={isClaimModalOpen}
        onClose={() => setIsClaimModalOpen(false)}
        onSubmitClaim={(claim) => {
          onClaimItem(claim);
        }}
      />
    </div>
  );
};
