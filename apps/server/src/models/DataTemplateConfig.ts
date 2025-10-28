export interface DataTemplateConfig {
  // The canonical data identifier to render on the card
  dataName: string;
  // Whether this item appears on the front side (true) or back side (false)
  isOnFront: boolean;
  // Top-left position in pixels
  topLeft: { x: number; y: number };
  // Size in pixels
  size: { width: number; height: number };
  // Font family or token
  fontType: string;
  // CSS color (hex, rgb, or token)
  color: string;
}
