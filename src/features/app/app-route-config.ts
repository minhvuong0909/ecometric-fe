/** Maps URL segments under `/app` to Figma screen ids */
export const APP_ROUTE_CONFIG = [
  { path: "dashboard", screenId: "dashboard" },
  { path: "data-input", screenId: "data-input" },
  { path: "data-input/step-1", screenId: "input-1" },
  { path: "data-input/step-2", screenId: "input-2" },
  { path: "data-input/step-3", screenId: "input-3" },
  { path: "documents/upload", screenId: "upload-doc" },
  { path: "documents/ai-review", screenId: "ai-review" },
  { path: "emissions/detail", screenId: "emission-detail" },
  { path: "eco-score", screenId: "eco-score" },
  { path: "recommendations", screenId: "recommendations" },
  { path: "reports", screenId: "reports" },
  { path: "company", screenId: "company" },
  { path: "settings", screenId: "settings" },
] as const;

export type AppRouteScreenId = (typeof APP_ROUTE_CONFIG)[number]["screenId"];
