import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import type { Summary } from '@/types';

type SummaryInput = Omit<Summary, 'updatedAt'>;

/**
 * users/{userId}/summary/latest を更新する。
 * チェック操作のたびに呼び出し、ダッシュボードが参照できる集計データを保持する。
 */
export const updateSummary = async (
  userId: string,
  data: SummaryInput
): Promise<void> => {
  const ref = doc(db, 'users', userId, 'summary', 'latest');
  await setDoc(ref, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};
