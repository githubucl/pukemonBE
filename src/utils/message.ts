export const generateMessage = (content: string, username?: string) => {
  return {
    content,
    username: username ?? "性感荷官",
    createdAt: new Date().getTime(),
  };
};
