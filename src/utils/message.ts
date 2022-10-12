export const generateMessage = (text: string, username?: string) => {
  return {
    text,
    username: username ?? "性感荷官",
    createdAt: new Date().getTime(),
  };
};
