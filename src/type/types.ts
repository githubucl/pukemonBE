export type TUser = {
  username: string;
  id: string;
  onLine: boolean;
  stake: number;
  totalBuyIn: number;
  roundBet: number;
};

export type TRoomOptions = {
  room: string;
  username: string;
};
