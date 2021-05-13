import { useState } from "react";

function useStackableCard() {
  const [currentActive, setCurrentActive] = useState<number | null>(1);

  function clickHandler(clickedIndex: number) {
    if (clickedIndex === currentActive) {
      setCurrentActive(null);
    } else {
      setCurrentActive(clickedIndex);
    }
  }

  function register<T>(data: T, index: number) {
    return {
      index: index,
      onClick: clickHandler,
      data: data,
      isExpanded: true,
    };
  }
  return {
    register: register,
  };
}

export default useStackableCard;