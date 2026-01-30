import { useRef, useEffect } from 'react';
import { ScrollBoxRenderable } from '@opentui/core';
import { theme } from '../theme';
import { Fieldset } from './Fieldset';
import type { GitStash } from '../types/git';

interface StashViewProps {
  stashes: GitStash[];
  selectedIndex: number;
  focused: boolean;
}

export function StashView({ stashes, selectedIndex, focused }: StashViewProps) {
  const scrollRef = useRef<ScrollBoxRenderable>(null);

  // Auto-scroll to selected stash only if it goes out of view
  useEffect(() => {
    if (!scrollRef.current) return;

    const scrollBox = scrollRef.current;
    const itemHeight = 1;
    const currentScroll = scrollBox.scrollTop;
    const viewportHeight = scrollBox.viewport.height;
    const selectedPosition = selectedIndex * itemHeight;

    // Check if selected item is above the viewport
    if (selectedPosition < currentScroll) {
      scrollBox.scrollTo({ x: 0, y: selectedPosition });
    }
    // Check if selected item is below the viewport
    else if (selectedPosition >= currentScroll + viewportHeight) {
      scrollBox.scrollTo({ x: 0, y: selectedPosition - viewportHeight + 1 });
    }
  }, [selectedIndex]);

  return (
    <Fieldset
      title="Stash List"
      focused={focused}
      flexGrow={1}
      paddingX={theme.spacing.xs}
      paddingY={theme.spacing.none}
    >
      {stashes.length === 0 ? (
        <text fg={theme.colors.text.muted}>No stashes saved</text>
      ) : (
        <scrollbox ref={scrollRef} width="100%" height="100%" viewportCulling={true}>
          {stashes.map((stash, idx) => {
            const isSelected = idx === selectedIndex;

            return (
              <box key={stash.name} flexDirection="row" height={1}>
                <text fg={isSelected ? theme.colors.primary : theme.colors.border}>
                  {isSelected ? '>' : ' '}
                </text>
                <text fg={theme.colors.git.modified}> {stash.name} </text>
                <text fg={theme.colors.text.muted}>on </text>
                <text fg={theme.colors.status.info}>{stash.branch}</text>
                <text fg={theme.colors.text.muted}> - </text>
                <text fg={isSelected ? theme.colors.text.primary : theme.colors.text.secondary}>
                  {stash.message}
                </text>
              </box>
            );
          })}
        </scrollbox>
      )}
    </Fieldset>
  );
}
