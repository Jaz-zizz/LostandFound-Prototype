export type Category = 'กระเป๋า' | 'บัตร/เอกสาร' | 'อิเล็กทรอนิกส์' | 'เสื้อผ้า' | 'อื่นๆ';

export type CmuLocation =
  | 'หอสมุดกลาง มช.'
  | 'โรงอาหารกลาง (ศาลาอ่าน)'
  | 'ตึกเรียนรวม (RB)'
  | 'หอพักนักศึกษา'
  | 'สนามกีฬา มช.'
  | 'คณะวิศวกรรมศาสตร์'
  | 'คณะวิทยาศาสตร์'
  | 'คณะมนุษยศาสตร์'
  | 'ระบุเอง';

export interface LostItem {
  id: string;
  title: string;
  category: Category;
  location: CmuLocation;
  specificLocation: string;
  foundDateTime: string;
  imageUrl: string;
  description: string;
  contact: string;
  contactType: 'phone' | 'line';
  status: 'available' | 'claimed' | 'verifying';
  aiSimilarityScore?: number;
  matchedFeatures?: string[];
  depositPoint: string;
}

export interface ClaimRecord {
  id: string;
  itemId: string;
  itemTitle: string;
  itemImage: string;
  claimantName: string;
  studentId: string;
  faculty: string;
  proofDetails: string;
  contact: string;
  createdAt: string;
  pickupLocation: string;
  claimCode: string;
  status: 'รอดำเนินการ' | 'อนุมัติแล้ว' | 'รับของแล้ว';
}
