export interface FieldsetProps {
  title: string;
  children: React.ReactNode;
  borderColor?: string;
  titleColor?: string;
  focused?: boolean;
  editMode?: boolean;
  flexGrow?: number;
  height?: number | string;
  width?: number | string;
  paddingX?: number;
  paddingY?: number;
}

export function Fieldset({
  title,
  children,
  borderColor = '#888888',
  titleColor: _titleColor,
  focused = false,
  editMode = false,
  flexGrow,
  height,
  width,
  paddingX = 1,
  paddingY = 0,
}: FieldsetProps) {
  // Determine colors based on state
  const actualBorderColor = focused ? '#CC8844' : editMode ? '#00FF00' : borderColor;

  return (
    <box
      title={title}
      style={{
        flexGrow,
        height: height as number | 'auto' | `${number}%` | undefined,
        width: width as number | 'auto' | `${number}%` | undefined,
        flexDirection: 'column',
        border: true,
        borderColor: actualBorderColor,
        paddingLeft: paddingX,
        paddingRight: paddingX,
        paddingTop: paddingY,
        paddingBottom: paddingY,
      }}
    >
      {children}
    </box>
  );
}
