import React, { useState } from 'react';
import { LostItem, ClaimRecord } from '../types';
import { X, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';

interface ClaimModalProps {
  item: LostItem;
  isOpen: boolean;
  onClose: () => void;
  onSubmitClaim: (claim: ClaimRecord) => void;
}

export const ClaimModal: React.FC<ClaimModalProps> = ({
  item,
  isOpen,
  onClose,
  onSubmitClaim
}) => {
  const [claimantName, setClaimantName] = useState<string>('วริศรา แก้วมณี');
  const [studentId, setStudentId] = useState<string>('650610888');
  const [faculty, setFaculty] = useState<string>('คณะวิศวกรรมศาสตร์');
  const [contact, setContact] = useState<string>('089-765-4321');
  const [proofDetails, setProofDetails] = useState<string>('');
  const [submittedClaim, setSubmittedClaim] = useState<ClaimRecord | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const claimCode = `CMU-FD-${Math.floor(1000 + Math.random() * 9000)}`;

    const newClaim: ClaimRecord = {
      id: `claim-${Date.now()}`,
      itemId: item.id,
      itemTitle: item.title,
      itemImage: item.imageUrl,
      claimantName,
      studentId,
      faculty,
      proofDetails,
      contact,
      createdAt: new Date().toLocaleString('th-TH', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) + ' น.',
      pickupLocation: item.depositPoint,
      claimCode,
      status: 'อนุมัติแล้ว'
    };

    setSubmittedClaim(newClaim);
    onSubmitClaim(newClaim);
  };

  return (
    <div
      id="claim-verification-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center p-0"
    >
      <div
        id="claim-verification-sheet"
        className="w-full max-w-[430px] bg-white rounded-t-2xl p-3 pb-6 flex flex-col gap-2.5 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-200"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-150 pb-2">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-indigo-700" />
            <h2 className="text-xs font-bold text-zinc-900">ยืนยันสิทธิ์ความเป็นเจ้าของ</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-zinc-500 hover:bg-zinc-100"
            aria-label="ปิด"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submittedClaim ? (
          /* Success Screen with Verification Pass */
          <div className="flex flex-col items-center gap-2 text-center py-2">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-zinc-900">ออกรหัสรับของสำเร็จ</h3>
            <p className="text-xs text-zinc-600">
              นำรหัสอ้างอิงนี้แสดงพร้อมบัตรนักศึกษา มช. ณ จุดรับของ
            </p>

            <div className="w-full bg-indigo-50/80 border border-indigo-200 rounded-lg p-3 text-left flex flex-col gap-1.5 my-1">
              <div className="flex items-center justify-between border-b border-indigo-200/60 pb-1">
                <span className="text-[11px] text-zinc-500">รหัสยืนยันรับของ:</span>
                <span className="font-mono text-sm font-bold text-indigo-700">
                  {submittedClaim.claimCode}
                </span>
              </div>
              <div className="flex flex-col gap-0.5 text-xs">
                <span className="text-[11px] text-zinc-500">จุดรับของจริง:</span>
                <span className="font-semibold text-zinc-900 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  {submittedClaim.pickupLocation}
                </span>
              </div>
              <div className="flex justify-between text-xs pt-1 border-t border-indigo-200/60 text-zinc-600">
                <span>ผู้ขอรับ: {submittedClaim.claimantName}</span>
                <span>รหัส: {submittedClaim.studentId}</span>
              </div>
            </div>

            <p className="text-[11px] text-zinc-500">
              เจ้าหน้าที่ประจำจุดบริการจะตรวจสอบหลักฐานทางกายภาพก่อนส่งมอบของ
            </p>

            <button
              type="button"
              onClick={onClose}
              className="w-full h-10 bg-indigo-700 text-white rounded-md text-xs font-semibold mt-1"
            >
              เสร็จสิ้นและปิดหน้าต่าง
            </button>
          </div>
        ) : (
          /* Form for Ownership Verification */
          <form onSubmit={handleSubmit} className="flex flex-col gap-2 text-xs">
            <div className="bg-zinc-50 border border-zinc-200 rounded-md p-2 flex items-center gap-2">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-11 h-11 object-cover rounded border border-zinc-300"
              />
              <div className="flex flex-col leading-tight min-w-0">
                <span className="font-bold text-zinc-900 truncate">{item.title}</span>
                <span className="text-[10px] text-zinc-500 truncate">{item.location}</span>
                <span className="text-[10px] text-indigo-600 font-medium">จุดเก็บรักษา: {item.depositPoint}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-0.5">
                <label className="text-[11px] font-semibold text-zinc-700">ชื่อ-นามสกุล</label>
                <input
                  type="text"
                  required
                  value={claimantName}
                  onChange={(e) => setClaimantName(e.target.value)}
                  className="w-full h-8 px-2 bg-white border border-zinc-300 rounded text-xs"
                />
              </div>
              <div className="flex flex-col gap-0.5">
                <label className="text-[11px] font-semibold text-zinc-700">รหัสนักศึกษา / บุคลากร</label>
                <input
                  type="text"
                  required
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full h-8 px-2 bg-white border border-zinc-300 rounded text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-0.5">
                <label className="text-[11px] font-semibold text-zinc-700">คณะ / สังกัด</label>
                <input
                  type="text"
                  value={faculty}
                  onChange={(e) => setFaculty(e.target.value)}
                  className="w-full h-8 px-2 bg-white border border-zinc-300 rounded text-xs"
                />
              </div>
              <div className="flex flex-col gap-0.5">
                <label className="text-[11px] font-semibold text-zinc-700">เบอร์โทรศัพท์ติดต่อ</label>
                <input
                  type="text"
                  required
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full h-8 px-2 bg-white border border-zinc-300 rounded text-xs"
                />
              </div>
            </div>

            <div className="flex flex-col gap-0.5">
              <label className="text-[11px] font-semibold text-zinc-700">
                หลักฐานยืนยัน / รายละเอียดเฉพาะเพื่อพิสูจน์ความเป็นเจ้าของ
              </label>
              <textarea
                rows={2}
                required
                value={proofDetails}
                onChange={(e) => setProofDetails(e.target.value)}
                placeholder="เช่น รหัสผ่านปลดล็อคหน้าจอ, สติกเกอร์หรือรอยขีดข่วนลับ, สิ่งที่อยู่ภายในกระเป๋า"
                className="w-full p-2 bg-white border border-zinc-300 rounded text-xs resize-none"
              />
            </div>

            <div className="text-[10px] text-zinc-500 leading-normal">
              การแจ้งข้อมูลเท็จเพื่อแอบอ้างรับทรัพย์สินผู้อื่นมีความผิดตามวินัยนักศึกษามหาวิทยาลัยเชียงใหม่
            </div>

            <button
              type="submit"
              disabled={!proofDetails.trim()}
              className="w-full h-10 bg-indigo-700 text-white rounded-md text-xs font-semibold active:bg-indigo-800 disabled:opacity-50 mt-1"
            >
              ส่งคำขอยืนยันความเป็นเจ้าของ
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
