import React, { useState } from 'react';
import { LostItem, ClaimRecord } from './types';
import { INITIAL_LOST_ITEMS } from './data/mockData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './components/HomeView';
import { ReportFoundView } from './components/ReportFoundView';
import { SearchView } from './components/SearchView';
import { DetailView } from './components/DetailView';
import { ProfileView } from './components/ProfileView';

type ActiveView = 'home' | 'report' | 'search' | 'detail' | 'profile';

export default function App() {
  const [items, setItems] = useState<LostItem[]>(INITIAL_LOST_ITEMS);
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [selectedItem, setSelectedItem] = useState<LostItem | null>(null);
  const [myReportedItems, setMyReportedItems] = useState<LostItem[]>([]);
  const [claims, setClaims] = useState<ClaimRecord[]>([
    {
      id: 'claim-init-01',
      itemId: 'cmu-item-001',
      itemTitle: 'หูฟัง AirPods Pro เคสสีขาว',
      itemImage: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80',
      claimantName: 'วริศรา แก้วมณี',
      studentId: '650610888',
      faculty: 'คณะวิศวกรรมศาสตร์',
      proofDetails: 'สติกเกอร์ช้าง มช. ด้านหลังกล่อง และชื่อบลูทูธในเครื่องตั้งชื่อว่า Warisara-AirPods',
      contact: '089-765-4321',
      createdAt: '17 ก.ย. 2026, 15:10 น.',
      pickupLocation: 'เคาน์เตอร์บริการ ชั้น 1 หอสมุดกลาง มช.',
      claimCode: 'CMU-FD-3829',
      status: 'อนุมัติแล้ว'
    }
  ]);

  const handleSelectItem = (item: LostItem) => {
    setSelectedItem(item);
    setActiveView('detail');
  };

  const handleCreateFound = (newItemData: Omit<LostItem, 'id'>) => {
    const newItem: LostItem = {
      ...newItemData,
      id: `cmu-user-${Date.now()}`
    };
    setItems((prev) => [newItem, ...prev]);
    setMyReportedItems((prev) => [newItem, ...prev]);
  };

  const handleClaimItem = (claim: ClaimRecord) => {
    setClaims((prev) => [claim, ...prev]);
  };

  const getNavTab = (): 'home' | 'report' | 'profile' | 'search' => {
    if (activeView === 'report') return 'report';
    if (activeView === 'profile') return 'profile';
    if (activeView === 'search') return 'search';
    return 'home';
  };

  return (
    <div className="min-h-screen bg-zinc-200/90 flex items-center justify-center p-0 sm:py-4">
      {/* Mobile Container strictly constrained to 375-430px (iPhone viewport feel) */}
      <div
        id="mobile-viewport-frame"
        className="w-full max-w-[430px] min-h-screen sm:min-h-[844px] sm:max-h-[920px] bg-zinc-100 flex flex-col sm:rounded-3xl sm:shadow-2xl overflow-hidden border-0 sm:border sm:border-zinc-300/80 relative"
      >
        {/* Sticky App Header */}
        <Header
          currentTab={activeView}
          onOpenProfile={() => setActiveView('profile')}
          onGoHome={() => setActiveView('home')}
        />

        {/* Dynamic View Body */}
        <main className="flex-1 overflow-y-auto no-scrollbar relative">
          {activeView === 'home' && (
            <HomeView
              items={items}
              onSelectReport={() => setActiveView('report')}
              onSelectSearch={() => setActiveView('search')}
              onSelectItem={handleSelectItem}
            />
          )}

          {activeView === 'report' && (
            <ReportFoundView
              onBack={() => setActiveView('home')}
              onSubmitFound={handleCreateFound}
            />
          )}

          {activeView === 'search' && (
            <SearchView
              items={items}
              onSelectItem={handleSelectItem}
              onGoBack={() => setActiveView('home')}
            />
          )}

          {activeView === 'detail' && selectedItem && (
            <DetailView
              item={selectedItem}
              onBack={() => setActiveView('home')}
              onClaimItem={handleClaimItem}
            />
          )}

          {activeView === 'profile' && (
            <ProfileView
              claims={claims}
              myReportedItems={myReportedItems}
              onSelectItem={handleSelectItem}
            />
          )}
        </main>

        {/* Bottom Fixed Navigation (Hidden only on detail view to give full focus to the sticky claim button) */}
        {activeView !== 'detail' && activeView !== 'report' && (
          <BottomNav
            currentTab={getNavTab()}
            onSelectTab={(tab) => {
              setActiveView(tab);
            }}
          />
        )}
      </div>
    </div>
  );
}
