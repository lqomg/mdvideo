export const getPositionsState = (offset: number, duration: number, off: number) => {
  return {
    left: off * offset,
    width: off * (duration - 1)
  };
};
