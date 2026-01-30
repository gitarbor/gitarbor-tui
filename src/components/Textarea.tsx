import { useRef, useEffect } from 'react';
import type { TextareaRenderable } from '@opentui/core';
import { theme } from '../theme';
import { Fieldset } from './Fieldset';

interface TextareaProps {
  label: string;
  value: string;
  onInput?: (value: string) => void;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  focused?: boolean;
  width?: number | 'auto' | `${number}%` | '100%';
  height?: number | 'auto' | `${number}%` | '100%';
  textColor?: string;
  backgroundColor?: string;
  focusedTextColor?: string;
  focusedBackgroundColor?: string;
  placeholderColor?: string;
  // Fieldset props
  borderColor?: string;
  titleColor?: string;
  editMode?: boolean;
  flexGrow?: number;
  fieldsetHeight?: number | string;
  fieldsetWidth?: number | string;
  fieldsetPaddingX?: number;
  fieldsetPaddingY?: number;
}

export function Textarea(props: TextareaProps) {
  const {
    value,
    onInput,
    onChange,
    onSubmit,
    placeholder,
    focused,
    width,
    height,
    textColor = theme.colors.text.primary,
    backgroundColor = theme.colors.background.secondary,
    focusedTextColor = theme.colors.text.primary,
    focusedBackgroundColor = theme.colors.background.highlight,
    placeholderColor = theme.colors.text.muted,
    // Fieldset props
    label,
    borderColor,
    titleColor,
    editMode,
    flexGrow,
    fieldsetHeight,
    fieldsetWidth,
    fieldsetPaddingX,
    fieldsetPaddingY,
  } = props;

  const textareaRef = useRef<TextareaRenderable>(null);

  // Sync external value to textarea when it changes
  useEffect(() => {
    if (!textareaRef.current) return;
    const currentText = textareaRef.current.editBuffer.getText();
    if (currentText !== value) {
      textareaRef.current.editBuffer.setText(value);
    }
  }, [value]);

  // Set up a polling mechanism to detect changes and call onInput/onChange
  useEffect(() => {
    if (!textareaRef.current || (!onInput && !onChange)) return;

    let lastValue = value;
    const intervalId = setInterval(() => {
      if (!textareaRef.current) return;
      const currentValue = textareaRef.current.editBuffer.getText();
      if (currentValue !== lastValue) {
        lastValue = currentValue;
        if (onInput) {
          onInput(currentValue);
        } else if (onChange) {
          onChange(currentValue);
        }
      }
    }, 100); // Poll every 100ms

    return () => clearInterval(intervalId);
  }, [onInput, onChange, value]);

  const handleSubmit = () => {
    if (onSubmit && textareaRef.current) {
      const currentValue = textareaRef.current.editBuffer.getText();
      onSubmit(currentValue);
    }
  };

  return (
    <Fieldset
      title={label}
      focused={focused}
      borderColor={borderColor}
      titleColor={titleColor}
      editMode={editMode}
      flexGrow={flexGrow}
      height={fieldsetHeight ?? height}
      width={fieldsetWidth ?? width}
      paddingX={fieldsetPaddingX}
      paddingY={fieldsetPaddingY}
    >
      <textarea
        ref={textareaRef}
        initialValue={value}
        onSubmit={handleSubmit}
        placeholder={placeholder}
        focused={focused}
        width="100%"
        height="100%"
        textColor={textColor}
        backgroundColor={backgroundColor}
        focusedTextColor={focusedTextColor}
        focusedBackgroundColor={focusedBackgroundColor}
        placeholderColor={placeholderColor}
        padding={0}
      />
    </Fieldset>
  );
}
