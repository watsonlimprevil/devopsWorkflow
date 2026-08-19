import { createContext, useContext } from "react";

const BoardContext = createContext(null);

export function BoardProvider({ children, value }) {
  return <BoardContext.Provider value={value}>{children}</BoardContext.Provider>;
}

export function useBoardContext() {
  return useContext(BoardContext);
}
