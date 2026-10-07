import React, { useState, useMemo, useRef } from 'react';
import { LostItem } from '../types';
import { CATEGORIES } from '../data/mockData';
import { Search, Upload, Camera, Sparkles, X, MapPin, SlidersHorizontal } from 'lucide-react';

interface SearchViewProps {
  items: LostItem[];
  onSelectItem: (item: LostItem) => void;
  onGoBack: () => void;
}

export const SearchView: React.FC<SearchViewProps> = ({ items, onSelectItem, onGoBack }) => {
  const [searchMode, setSearchMode] = useState<'text' | 'image'>('text');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ทั้งหมด');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      setIsAiAnalyzing(true);
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        setTimeout(() => {
          setIsAiAnalyzing(false);
        }, 600);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSetSampleImage = (url: string, keyword: string) => {
    setIsAiAnalyzing(true);
    setUploadedImage(url);
    setSearchQuery(keyword);
    setTimeout(() => {
      setIsAiAnalyzing(false);
    }, 450);
  };

  const filteredItems = useMemo(() => {
    let list = items.map((item) => {
      let score = item.aiSimilarityScore || 70;

      // Text matching score adjustment
      if (searchMode === 'text' && searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesLoc = item.location.toLowerCase().includes(q);
        const matchesCategory = item.category.toLowerCase().includes(q);

        if (matchesTitle) score = Math.max(score, 94);
        else if (matchesDesc || matchesCategory) score = Math.max(score, 88);
        else if (matchesLoc) score = Math.max(score, 78);
        else score = Math.floor(score * 0.5);
      }

      // Image simulation adjustment
      if (searchMode === 'image' && uploadedImage) {
        if (item.category === 'อิเล็กทรอนิกส์' || item.title.includes('AirPods') || item.title.includes('ไอแพด')) {
          score = 96;
        } else if (item.category === 'บัตร/เอกสาร') {
          score = 84;
        }
      }

      return {
        ...item,
        currentScore: score
      };
    });

    if (selectedCategory !== 'ทั้งหมด') {
      list = list.filter((i) => i.category === selectedCategory);
    }

    if (searchMode === 'text' && searchQuery.trim()) {
      list = list.filter((i) => i.currentScore >= 60);
    }

    // Sort by AI score descending
    return list.sort((a, b) => b.currentScore - a.currentScore);
  }, [items, searchMode, searchQuery, selectedCategory, uploadedImage]);

  return (
    <div className="flex flex-col min-h-full pb-20">
      {/* Top Search Controls Container: ultra compact without dead gaps */}
      <div className="sticky top-0 z-30 bg-white border-b border-zinc-200 shadow-2xs">
        {/* Toggle เล็กด้านบนสลับ "อัปโหลดรูป" / "พิมพ์คำอธิบาย" */}
        <div className="flex items-center justify-between px-2.5 pt-2 pb-1 bg-zinc-50 border-b border-zinc-100">
          <span className="text-[11px] font-semibold text-zinc-600 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            โหมดจับคู่ AI:
          </span>
          <div className="flex items-center p-0.5 bg-zinc-200/80 rounded-md">
            <button
              type="button"
              onClick={() => setSearchMode('image')}
              className={`text-xs px-2.5 py-1 rounded transition-colors flex items-center gap-1 ${
                searchMode === 'image'
                  ? 'bg-white text-indigo-700 font-semibold shadow-2xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <Camera className="w-3 h-3" />
              อัปโหลดรูป
            </button>
            <button
              type="button"
              onClick={() => setSearchMode('text')}
              className={`text-xs px-2.5 py-1 rounded transition-colors flex items-center gap-1 ${
                searchMode === 'text'
                  ? 'bg-white text-indigo-700 font-semibold shadow-2xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <Search className="w-3 h-3" />
              พิมพ์คำอธิบาย
            </button>
          </div>
        </div>

        {/* Input box or Image Upload Area */}
        {searchMode === 'text' ? (
          <div className="p-2 pb-1">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-zinc-400 absolute left-2.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ระบุชื่อของ เช่น หูฟัง, บัตรนักศึกษา, กระเป๋า..."
                className="w-full h-9 pl-8 pr-7 text-xs bg-zinc-100 border border-zinc-200 rounded-md focus:outline-none focus:bg-white focus:border-indigo-600"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 text-zinc-400 hover:text-zinc-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="p-2 pb-1 flex flex-col gap-1.5">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 h-9 px-2 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-md text-xs font-medium flex items-center justify-center gap-1.5 active:bg-indigo-100"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>{uploadedImage ? 'เปลี่ยนรูปภาพค้นหา' : 'เลือกรูปถ่ายของที่ทำหาย'}</span>
              </button>

              {uploadedImage && (
                <button
                  type="button"
                  onClick={() => setUploadedImage(null)}
                  className="h-9 px-2 bg-zinc-100 border border-zinc-200 text-zinc-600 rounded-md text-xs hover:bg-zinc-200"
                >
                  ล้างรูป
                </button>
              )}
            </div>

            {uploadedImage ? (
              <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 rounded-md p-1.5">
                <img
                  src={uploadedImage}
                  alt="ภาพที่ใช้ค้นหา"
                  className="w-10 h-10 object-cover rounded border border-zinc-300 shrink-0"
                />
                <div className="flex flex-col text-[11px] leading-tight">
                  <span className="font-semibold text-zinc-800">กำลังเปรียบเทียบลักษณะทางกายภาพ</span>
                  <span className="text-zinc-500">
                    {isAiAnalyzing ? 'AI กำลังสแกน...' : 'วิเคราะห์รูปภาพและจัดอันดับแล้ว'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                <span className="text-[10px] text-zinc-400 shrink-0">ลองรูปตัวอย่าง:</span>
                <button
                  type="button"
                  onClick={() =>
                    handleSetSampleImage(
                      'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80',
                      'หูฟัง'
                    )
                  }
                  className="text-[10px] px-2 py-0.5 bg-zinc-100 border border-zinc-200 rounded text-zinc-700 shrink-0"
                >
                  AirPods Pro
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleSetSampleImage(
                      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80',
                      'ไอแพด'
                    )
                  }
                  className="text-[10px] px-2 py-0.5 bg-zinc-100 border border-zinc-200 rounded text-zinc-700 shrink-0"
                >
                  iPad Air
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleSetSampleImage(
                      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
                      'บัตร'
                    )
                  }
                  className="text-[10px] px-2 py-0.5 bg-zinc-100 border border-zinc-200 rounded text-zinc-700 shrink-0"
                >
                  บัตร มช.
                </button>
              </div>
            )}
          </div>
        )}

        {/* ช่องค้นหากระชับ ติดกับ chip filter หมวดหมู่เลื่อนแนวนอนทันที ไม่มีช่องว่างคั่น */}
        <div className="flex items-center gap-1 overflow-x-auto px-2 pb-2 pt-0.5 no-scrollbar border-t border-zinc-100">
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 text-[11px] px-2.5 py-1 rounded-full whitespace-nowrap transition-colors ${
                  active
                    ? 'bg-zinc-900 text-white font-medium'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-2 flex flex-col gap-2">
        {/* Results summary header */}
        <div className="flex items-center justify-between px-0.5">
          <div className="flex items-center gap-1 text-xs text-zinc-600">
            <span>ผลการค้นหาจับคู่</span>
            <span className="font-semibold text-zinc-900">({filteredItems.length} รายการ)</span>
          </div>
          <span className="text-[10px] text-zinc-400">เรียงตามความคล้าย AI</span>
        </div>

        {/* ผลลัพธ์ grid 2 คอลัมน์ gap 6-8px การ์ดรูปเต็ม badge % ความคล้ายลอยมุมขวาบน (ไม่เพิ่มความสูงการ์ด) */}
        {filteredItems.length === 0 ? (
          <div className="bg-white border border-zinc-200 rounded-lg p-6 text-center text-xs text-zinc-500">
            ไม่พบสิ่งของที่ตรงกับเงื่อนไขการค้นหา
          </div>
        ) : (
          <div id="search-results-grid" className="grid grid-cols-2 gap-2">
            {filteredItems.map((item) => {
              const score = item.currentScore;
              const isHighMatch = score >= 85;

              return (
                <div
                  key={item.id}
                  id={`search-card-${item.id}`}
                  onClick={() => onSelectItem(item)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && onSelectItem(item)}
                  className="group bg-white border border-zinc-200 rounded-lg overflow-hidden flex flex-col cursor-pointer hover:border-indigo-400 active:scale-[0.98] transition-all shadow-2xs"
                >
                  {/* การ์ดรูปเต็ม พร้อม badge % ความคล้ายลอยมุมขวาบน (ไม่เพิ่มความสูงการ์ด) */}
                  <div className="relative w-full aspect-square bg-zinc-100 overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />

                    {/* Floating % Similarity Badge - Top Right Corner */}
                    <div
                      className={`absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold shadow-xs backdrop-blur-md ${
                        isHighMatch
                          ? 'bg-emerald-600/90 text-white'
                          : 'bg-zinc-900/80 text-zinc-100'
                      }`}
                    >
                      {score}% คล้าย
                    </div>

                    {/* Bottom gradient category label */}
                    <div className="absolute bottom-1 left-1 bg-black/60 backdrop-blur-xs text-white text-[9px] px-1.5 py-0.2 rounded">
                      {item.category}
                    </div>
                  </div>

                  {/* Text Details: Compact */}
                  <div className="p-2 flex flex-col gap-0.5">
                    <h3 className="text-xs font-bold text-zinc-900 line-clamp-1 leading-snug">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-0.5 text-[10px] text-zinc-500 line-clamp-1">
                      <MapPin className="w-2.5 h-2.5 text-indigo-600 shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>
                    <div className="text-[9px] text-zinc-400 truncate">
                      {item.foundDateTime}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
