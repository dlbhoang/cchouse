import dayjs from 'dayjs';
import { StateCreator } from 'zustand';
import utilsApi from '@/services/api/utilsApi';

type State = {
  dateFilter: string;
};

type Action = {
  getCountOld: () => void;
};

export type ICountOldSlice = State & Action;

export const CountOldSlice: StateCreator<ICountOldSlice> = (set, get) => ({
  dateFilter: '',
  getCountOld: async () => {
    const result = await utilsApi.getConfig();
    set({
      dateFilter: dayjs()
        .add(-1 * result.data.DateForCountOldProp, 'day')
        .format('YYYY-MM-DD'),
    });
  },
});
