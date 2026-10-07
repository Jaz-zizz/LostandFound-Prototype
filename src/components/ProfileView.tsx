import React, { useState } from 'react';
import { ClaimRecord, LostItem } from '../types';
import { User, Phone, MapPin, Clock, ShieldCheck, CheckCircle2, Building2 } from 'lucide-react';

interface ProfileViewProps {
  claims: ClaimRecord[];
  myReportedItems: LostItem[];
  onSelectItem: (item: LostItem) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  claims,
  myReportedItems,
  onSelectItem
}) => {
  const [activeTab, setActiveTab] = useState<'claims' | 'reports'>('claims');

  return (
    <div className="flex flex-col gap-2.5 p-2.5 pb-20">
      {/* Student/User Identity Card - Compact */}
      <div className="bg-white border border-zinc-200 rounded-lg p-3 flex items-center gap-2.5 shadow-2xs">
        <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-base shrink-0 border border-indigo-200">
          วร
        </div>
        <div className="flex flex-col min-w-0 flex-1 leading-tight">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-zinc-900 truncate">วริศรา แก้วมณี</h2>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.2 rounded font-medium">
              ยืนยันตัวตนแล้ว
            </span>
          </div>
          <span className="text-xs text-zinc-600 font-mono mt-0.5">รหัสนักศึกษา: 650610888</span>
          <span className="text-[11px] text-zinc-500">คณะวิศวกรรมศาสตร์ มหาวิทยาลัยเชียงใหม่</span>
        </div>
      </div>

      {/* History Tabs Switcher */}
      <div className="grid grid-cols-2 gap-1 p-0.5 bg-zinc-200/80 rounded-lg">
        <button
          type="button"
          onClick={() => setActiveTab('claims')}
          className={`py-1.5 text-xs font-semibold rounded-md transition-colors ${
            activeTab === 'claims'
              ? 'bg-white text-indigo-700 shadow-2xs'
              : 'text-zinc-600 hover:text-zinc-900'
          }`}
        >
          คำขอยืนยันรับของ ({claims.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('reports')}
          className={`py-1.5 text-xs font-semibold rounded-md transition-colors ${
            activeTab === 'reports'
              ? 'bg-white text-indigo-700 shadow-2xs'
              : 'text-zinc-600 hover:text-zinc-900'
          }`}
        >
          ของที่ฉันแจ้งพบ ({myReportedItems.length})
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'claims' ? (
        <div className="flex flex-col gap-2">
          {claims.length === 0 ? (
            <div className="bg-white border border-zinc-200 rounded-lg p-6 text-center text-xs text-zinc-500">
              ยังไม่มีคำขอยืนยันรับสิ่งของ
            </div>
          ) : (
            claims.map((claim) => (
              <div
                key={claim.id}
                className="bg-white border border-zinc-200 rounded-lg p-2.5 flex flex-col gap-1.5 shadow-2xs"
              >
                <div className="flex items-start justify-between border-b border-zinc-100 pb-1.5">
                  <div className="flex items-center gap-2">
                    <img
                      src={claim.itemImage}
                      alt={claim.itemTitle}
                      className="w-10 h-10 object-cover rounded border border-zinc-200 shrink-0"
                    />
                    <div className="flex flex-col leading-tight">
                      <span className="text-xs font-bold text-zinc-900">{claim.itemTitle}</span>
                      <span className="text-[10px] text-zinc-500">{claim.createdAt}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 px-1.5 py-0.5 rounded">
                    {claim.claimCode}
                  </span>
                </div>

                <div className="flex flex-col gap-0.5 text-[11px] text-zinc-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-indigo-600 shrink-0" />
                    <span>จุดรับของ: <strong className="text-zinc-800">{claim.pickupLocation}</strong></span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>สถานะ: รหัสพร้อมแสดง ณ จุดรับของ</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {myReportedItems.length === 0 ? (
            <div className="bg-white border border-zinc-200 rounded-lg p-6 text-center text-xs text-zinc-500">
              ยังไม่มีรายการสิ่งของที่คุณแจ้งพบ
            </div>
          ) : (
            myReportedItems.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectItem(item)}
                role="button"
                tabIndex={0}
                className="bg-white border border-zinc-200 rounded-lg p-2 flex items-center gap-2 cursor-pointer hover:border-indigo-300"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-12 h-12 object-cover rounded border border-zinc-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-zinc-900 block truncate">{item.title}</span>
                  <span className="text-[10px] text-zinc-500 block truncate">{item.location}</span>
                  <span className="text-[9px] text-emerald-700 font-medium">บันทึกในระบบเรียบร้อยแล้ว</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Help Desk Information */}
      <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-2.5 flex flex-col gap-1.5 text-xs">
        <div className="flex items-center gap-1 font-bold text-zinc-800">
          <Building2 className="w-3.5 h-3.5 text-indigo-600" />
          <span>ศูนย์ประสานงาน Lost & Found มหาวิทยาลัยเชียงใหม่</span>
        </div>
        <div className="flex flex-col gap-1 text-[11px] text-zinc-600 leading-normal">
          <div className="flex justify-between items-center py-0.5 border-b border-zinc-200/50">
            <span>หอสมุดกลาง (เคาน์เตอร์บริการ ชั้น 1):</span>
            <span className="font-mono text-zinc-800">053-944531</span>
          </div>
          <div className="flex justify-between items-center py-0.5 border-b border-zinc-200/50">
            <span>โรงอาหารกลาง ศาลาอ่าน (กองพัฒนานักศึกษา):</span>
            <span className="font-mono text-zinc-800">053-943032</span>
          </div>
          <div className="flex justify-between items-center py-0.5">
            <span>LINE Official ประสานงาน:</span>
            <span className="font-mono text-indigo-700 font-semibold">@cmu_lostandfound</span>
          </div>
        </div>
      </div>
    </div>
  );
};
