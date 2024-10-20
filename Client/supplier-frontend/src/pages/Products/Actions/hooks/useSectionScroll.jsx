import { useEffect, useState, useCallback, useRef } from "react";

const useSectionScroll = (sectionRefs) => {
  const [isManualScroll, setIsManualScroll] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const manualScrollTimeoutRef = useRef(null);

  const scrollToSection = (sectionId) => {
    setIsManualScroll(true);
    sectionRefs.current[sectionId].current.scrollIntoView({
      behavior: "smooth",
    });
    setActiveSection(sectionId);

    clearTimeout(manualScrollTimeoutRef.current);
    manualScrollTimeoutRef.current = setTimeout(() => {
      setIsManualScroll(false);
    }, 1000);
  };

  const observerCallback = useCallback(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !isManualScroll) {
          const visibleSectionIndex = sectionRefs.current.findIndex(
            (ref) => ref.current === entry.target
          );
          setActiveSection(visibleSectionIndex);
        }
      });
    },
    [sectionRefs, isManualScroll]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: "0px",
      threshold: 0.6,
    });

    // Store the current refs in a variable to avoid the lint warning
    const currentRefs = sectionRefs.current;

    currentRefs.forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => {
      currentRefs.forEach((ref) => {
        if (ref.current) observer.unobserve(ref.current);
      });
    };
  }, [observerCallback, sectionRefs]);

  return { activeSection, scrollToSection };
};

export default useSectionScroll;
