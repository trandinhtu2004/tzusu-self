export const motionEase = [0.22, 1, 0.36, 1] as const;

export const revealTransition = {
  duration: 0.58,
  ease: motionEase,
};

export const revealViewport = {
  amount: 0.18,
  once: true,
} as const;

export const revealVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, transition: revealTransition, y: 0 },
};

export const staggerVariants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.08,
      staggerChildren: 0.09,
    },
  },
};

export const drawerVariants = {
  hidden: { opacity: 0, y: -16, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.2, ease: motionEase },
  },
  exit: {
    opacity: 0,
    y: -12,
    scale: 0.98,
    transition: { duration: 0.15, ease: motionEase },
  },
};

export const modalVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.25, ease: motionEase },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 12,
    transition: { duration: 0.2, ease: motionEase },
  },
};
