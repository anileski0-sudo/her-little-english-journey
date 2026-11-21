import { Component, CSSProperties, ReactNode } from 'react';
import { EXTRAS, LANDMARKS } from './landmarks';

/** If an illustration ever fails to render, show a cute postcard emoji instead of breaking the page. */
class StickerBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

interface Props {
  id: string;
  size?: number | string;
  rotate?: number;
  label?: boolean;
  className?: string;
  style?: CSSProperties;
  title?: string;
}

export default function Sticker({ id, size = 110, rotate = 0, label = false, className = '', style, title }: Props) {
  const def = LANDMARKS[id] ?? EXTRAS[id];
  const dim = typeof size === 'number' ? `${size}px` : size;
  const fallback = (
    <span className="sticker-fallback" style={{ width: dim, height: dim }}>
      ✈️
    </span>
  );
  return (
    <span
      className={`sticker ${className}`}
      style={{ ['--r' as string]: `${rotate}deg`, width: dim, ...style }}
      aria-hidden={title ? undefined : true}
      title={title}
    >
      <StickerBoundary fallback={fallback}>
        {def ? (
          <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ display: 'block', overflow: 'visible' }} role="img" aria-label={def.name}>
            <def.draw />
          </svg>
        ) : (
          fallback
        )}
      </StickerBoundary>
      {label && def?.place && <span className="sticker-label">{def.place}</span>}
    </span>
  );
}
