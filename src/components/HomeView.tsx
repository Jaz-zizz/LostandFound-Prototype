import React, { useState } from 'react';
import { LostItem } from '../types';
import { PlusCircle, Search, MapPin, Clock, Sparkles, Filter } from 'lucide-react';

interface HomeViewProps {
  items: LostItem[];
  onSelectReport: () => void;
  onSelectSearch: () => void;
  onSelectItem: (item: LostItem) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  items,
  onSelectReport,
  onSelectSearch,
  onSelectItem
}) => {
  const [selectedLocation, setSelectedLocation] = useState<string>('ทั้งหมด');

  const filteredItems = items.filter((item) => {
    if (selectedLocation === 'ทั้งหมด') return true;
    return item.location.includes(selectedLocation) || selectedLocation.includes(item.location);
  });

  return (
    <div className="flex flex-col gap-2.5 p-2.5 pb-20">
      {/* CMU Status Banner */}
      <div
        id="cmu-status-strip"
        className="flex items-center justify-between bg-zinc-900 text-white px-2.5 py-1.5 rounded-md text-xs"
      >
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span className="font-medium">มหาวิทยาลัยเชียงใหม่</span>
        </div>
        <span className="text-[11px] text-zinc-300">ระบบ Lost & Found</span>
      </div>

      {/* 2 Big Action Buttons Side-by-Side (Grid 2 columns, tight gap) */}
      <div id="quick-action-buttons" className="grid grid-cols-2 gap-2">
        <button
          id="btn-action-report-found"
          type="button"
          onClick={onSelectReport}
          className="flex flex-col items-start justify-between p-2.5 rounded-lg bg-indigo-700 text-white active:bg-indigo-800 transition-colors shadow-xs group text-left h-[76px]"
        >
          <div className="w-full flex items-center justify-between">
            <span className="text-xs text-indigo-200">พบสิ่งของตกหล่น</span>
            <PlusCircle className="w-4 h-4 text-indigo-200 group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <span className="block font-bold text-sm tracking-tight leading-none">
              แจ้งของที่เจอ
            </span>
            <span className="text-[10px] text-indigo-100 opacity-90 mt-0.5 block">
              ถ่ายรูปบันทึกเข้าระบบ
            </span>
          </div>
        </button>

        <button
          id="btn-action-search-lost"
          type="button"
          onClick={onSelectSearch}
          className="flex flex-col items-start justify-between p-2.5 rounded-lg bg-white border border-zinc-300 text-zinc-900 active:bg-zinc-50 transition-colors shadow-xs group text-left h-[76px]"
        >
          <div className="w-full flex items-center justify-between">
            <span className="text-xs text-zinc-500">ตามหาของที่หาย</span>
            <div className="flex items-center gap-0.5 text-indigo-700">
              <Sparkles className="w-3.5 h-3.5" />
              <Search className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="block font-bold text-sm tracking-tight leading-none text-zinc-900">
              ค้นหาของหาย
            </span>
            <span className="text-[10px] text-zinc-500 mt-0.5 block">
              ใช้ AI เทียบรูปและข้อมูล
            </span>
          </div>
        </button>
      </div>

      {/* Quick Location Filter Strip */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 no-scrollbar">
        <span className="text-[11px] font-medium text-zinc-400 shrink-0 flex items-center gap-0.5 pl-0.5">
          <Filter className="w-3 h-3" />
          จุด:
        </span>
        {['ทั้งหมด', 'หอสมุดกลาง มช.', 'โรงอาหารกลาง (ศาลาอ่าน)'].map((loc) => {
          const isSelected = selectedLocation === loc;
          return (
            <button
              key={loc}
              type="button"
              onClick={() => setSelectedLocation(loc)}
              className={`shrink-0 text-xs px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
                isSelected
                  ? 'bg-zinc-900 text-white font-medium shadow-2xs'
                  : 'bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-50'
              }`}
            >
              {loc}
            </button>
          );
        })}
      </div>

      {/* Section Header: Compact */}
      <div className="flex items-center justify-between pt-0.5 px-0.5">
        <div className="flex items-center gap-1.5">
          <h2 className="text-sm font-bold text-zinc-900 tracking-tight">รายการของล่าสุด</h2>
          <span className="text-[11px] font-mono font-medium text-zinc-500 bg-zinc-200/80 px-1.5 py-0.2 rounded">
            {filteredItems.length} รายการ
          </span>
        </div>
        <button
          type="button"
          onClick={onSelectSearch}
          className="text-xs text-indigo-700 font-medium hover:underline flex items-center gap-0.5"
        >
          ดูทั้งหมด
        </button>
      </div>

      {/* Horizontal Cards List: Height <= 80px, gap 4-6px */}
      <div id="latest-items-list" className="flex flex-col gap-1.5">
        {filteredItems.length === 0 ? (
          <div className="bg-white border border-zinc-200 rounded-lg p-4 text-center text-xs text-zinc-500">
            ยังไม่พบรายการของที่แจ้งในจุดบริการนี้
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              id={`item-card-${item.id}`}
              onClick={() => onSelectItem(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onSelectItem(item)}
              className="group bg-white border border-zinc-200/90 rounded-lg p-1.5 flex items-center gap-2 h-[78px] cursor-pointer hover:border-indigo-400 active:scale-[0.99] transition-all shadow-2xs"
            >
              {/* Thumbnail Left (Compact Square) */}
              <div className="relative w-16 h-16 shrink-0 rounded-md overflow-hidden bg-zinc-100 border border-zinc-200/60">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] text-center py-0.2 leading-tight">
                  {item.category}
                </span>
              </div>

              {/* Text Right: Compact Info */}
              <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-0.5">
                <div className="flex items-start justify-between gap-1">
                  <h3 className="text-xs font-semibold text-zinc-900 truncate leading-snug">
                    {item.title}
                  </h3>
                  {item.aiSimilarityScore && (
                    <span className="shrink-0 text-[10px] font-mono font-semibold px-1 py-0.2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded">
                      ตรง {item.aiSimilarityScore}%
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-[11px] text-zinc-600 truncate mt-0.5">
                  <MapPin className="w-3 h-3 text-indigo-600 shrink-0" />
                  <span className="truncate">{item.location}</span>
                </div>

                <div className="flex items-center justify-between text-[10px] text-zinc-400 mt-0.5">
                  <span className="flex items-center gap-0.5">
                    <Clock className="w-2.5 h-2.5" />
                    {item.foundDateTime}
                  </span>
                  <span className="text-indigo-600 font-medium group-hover:underline">
                    ดูรายละเอียด
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* CMU Information Note */}
      <div className="mt-1 bg-indigo-50/70 border border-indigo-150 rounded-lg p-2.5 text-xs text-indigo-950 flex flex-col gap-1">
        <span className="font-semibold text-xs text-indigo-900">
          จุดส่งมอบและรับคืนของหาย มหาวิทยาลัยเชียงใหม่
        </span>
        <div className="text-[11px] text-indigo-800 leading-normal flex flex-col gap-0.5">
          <span>1. เคาน์เตอร์ยืม-คืน ชั้น 1 หอสมุดกลาง มช.</span>
          <span>2. จุดบริการ รปภ. ประจำโรงอาหารกลาง (ศาลาอ่าน)</span>
        </div>
      </div>
    </div>
  );
};
