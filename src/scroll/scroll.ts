import {
  createScrollbarDOM,
  setupScrollDOM,
  updateScrollbarDOM,
} from "./scrollbarDOM";
import { State, state, stylesheet } from "./util";

const updateScrollPosition = (targetScroll: State<number>) => {
  const viewportHeight = window.innerHeight;
  const documentHeight = Math.max(
    document.body.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.clientHeight,
    document.documentElement.scrollHeight,
    document.documentElement.offsetHeight
  );

  const position = (() => {
    const MIN_VALUE = 0;
    const MAX_VALUE = documentHeight - viewportHeight;

    const isScrollingUp = targetScroll.value < targetScroll.prevValue;

    if (targetScroll.value < MIN_VALUE && isScrollingUp) {
      targetScroll.set(MIN_VALUE);
      return MIN_VALUE;
    }

    // console.log(MAX_VALUE);

    if (targetScroll.value > MAX_VALUE && !isScrollingUp) {
      targetScroll.set(MAX_VALUE);
      return MAX_VALUE;
    }

    return targetScroll.value;
  })();

  // stylesheet(document.body, {
  //   y: -position,
  // });

  return { scrollPosition: position, documentHeight, viewportHeight };
};

export const createScroll = () => {
  const targetScroll = state(0);

  const scrollBarElms = createScrollbarDOM();
  setupScrollDOM();

  // init scroll
  targetScroll.onChange(() => {
    const { documentHeight, viewportHeight, scrollPosition } =
      updateScrollPosition(targetScroll);
    updateScrollbarDOM({
      elms: scrollBarElms,
      documentHeight,
      viewportHeight,
      scrollPosition,
    });
  });

  const handleScroll = (e: WheelEvent) => {
    // handle scroll
    targetScroll.set(targetScroll.value + e.deltaY);
  };
  window.addEventListener("wheel", handleScroll);
  const cleanupScroll = () => {
    window.removeEventListener("wheel", handleScroll);
  };
  const refreshScroll = () => {};
  const scrollToPosition = targetScroll.set;

  return { refreshScroll, cleanupScroll, scrollToPosition };
};
