export const FLOWER_WIDTH_MM = 27.675169;
export const FLOWER_HEAD_REACH = 0.822;

export const DANDELION_WIDTH_PCT = { xs: 14.5, sm: 10, md: 7.5 };
export const DANDELION_MAX_PCT = 20;
export const DANDELION_BOTTOM_PCT = -3;
export const DANDELION_VAR = '--dandelion-width';
export const DANDELION_WIDTH = `var(${DANDELION_VAR}, ${DANDELION_WIDTH_PCT.xs}%)`;
export const LABEL_BOTTOM_VAR = '--dandelion-label-bottom';
export const LABEL_ROOM_VAR = '--dandelion-label-room';

export const NUDGE_SWINGS_DEG = [3, -2.5, 1.75, -1, 0];

export const FIT_VAR = '--drawstring-fit';

export const fitted = (size: string) => `calc(${size} * var(${FIT_VAR}, 1))`;
