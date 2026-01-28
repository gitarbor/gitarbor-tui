import type { ReactNode } from 'react';
import { theme } from '../theme';

interface ModalProps {
  children: ReactNode;
  width?: number;
  height?: number;
  title?: string;
  borderStyle?: 'single' | 'double';
  borderColor?: string;
  centered?: boolean;
  left?: number;
  top?: number;
  showOverlay?: boolean;
}

export function Modal({
  children,
  width = 80,
  height = 20,
  title,
  borderStyle = 'double',
  borderColor = theme.colors.primary,
  centered = true,
  left,
  top,
  showOverlay = true,
}: ModalProps) {
  if (centered) {
    return (
      <box
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          justifyContent: 'flex-start',
          alignItems: 'center',
          zIndex: 1000,
          paddingTop: 3,
        }}
        flexDirection="column"
      >
        {/* Modal content */}
        <box
          borderStyle={borderStyle}
          borderColor={borderColor}
          padding={theme.spacing.xs}
          width={width}
          height={height}
          flexDirection="column"
          backgroundColor={showOverlay ? theme.colors.background.modal : undefined}
        >
          {title && (
            <>
              <text fg={theme.colors.primary}>{title}</text>
              <text> </text>
            </>
          )}
          {children}
        </box>
      </box>
    );
  }

  return (
    <box
      style={{
        position: 'absolute',
        left: left ?? 10,
        top: top ?? 3,
        zIndex: 1000,
      }}
      width={width}
      height={height}
      backgroundColor={showOverlay ? theme.colors.background.modal : undefined}
      borderStyle={borderStyle}
      borderColor={borderColor}
      padding={theme.spacing.xs}
      flexDirection="column"
    >
      {title && (
        <>
          <text fg={theme.colors.primary}>{title}</text>
          <text> </text>
        </>
      )}
      {children}
    </box>
  );
}
