import { useMemo } from 'react';
import { SyntaxStyle, parseColor } from '@opentui/core';
import { theme } from '../theme';

interface DiffViewProps {
  diff: string;
  focused: boolean;
  filePath?: string;
}

export function DiffView({ diff, focused, filePath }: DiffViewProps) {
  // Create syntax style for diff component (same as MainView)
  const syntaxStyle = useMemo(
    () =>
      SyntaxStyle.fromStyles({
        keyword: { fg: parseColor('#FF7B72'), bold: true },
        'keyword.import': { fg: parseColor('#FF7B72'), bold: true },
        string: { fg: parseColor('#A5D6FF') },
        comment: { fg: parseColor('#8B949E'), italic: true },
        number: { fg: parseColor('#79C0FF') },
        boolean: { fg: parseColor('#79C0FF') },
        constant: { fg: parseColor('#79C0FF') },
        function: { fg: parseColor('#D2A8FF') },
        'function.call': { fg: parseColor('#D2A8FF') },
        constructor: { fg: parseColor('#FFA657') },
        type: { fg: parseColor('#FFA657') },
        operator: { fg: parseColor('#FF7B72') },
        variable: { fg: parseColor('#E6EDF3') },
        property: { fg: parseColor('#79C0FF') },
        bracket: { fg: parseColor('#F0F6FC') },
        punctuation: { fg: parseColor('#F0F6FC') },
        default: { fg: parseColor('#E6EDF3') },
      }),
    [],
  );

  // Determine filetype from file path extension
  const getFiletype = (path?: string): string => {
    if (!path) return 'text';
    const ext = path.split('.').pop()?.toLowerCase();
    const filetypeMap: Record<string, string> = {
      ts: 'typescript',
      tsx: 'typescript',
      js: 'javascript',
      jsx: 'javascript',
      py: 'python',
      rb: 'ruby',
      go: 'go',
      rs: 'rust',
      java: 'java',
      c: 'c',
      cpp: 'cpp',
      h: 'c',
      hpp: 'cpp',
      css: 'css',
      scss: 'scss',
      html: 'html',
      json: 'json',
      yaml: 'yaml',
      yml: 'yaml',
      md: 'markdown',
      sh: 'bash',
      bash: 'bash',
    };
    return filetypeMap[ext || ''] || 'text';
  };

  return (
    <box
      width="100%"
      flexGrow={1}
      borderStyle={theme.borders.style}
      borderColor={focused ? theme.colors.borderFocused : theme.colors.border}
      padding={theme.spacing.none}
    >
      {!diff || diff.trim() === '' ? (
        <box paddingLeft={theme.spacing.xs}>
          <text fg={theme.colors.text.muted}>No changes to display</text>
        </box>
      ) : (
        <scrollbox width="100%" height="100%">
          <diff
            diff={diff}
            view="unified"
            filetype={getFiletype(filePath)}
            syntaxStyle={syntaxStyle}
            showLineNumbers={true}
            wrapMode="word"
            addedBg="#1a4d1a"
            removedBg="#4d1a1a"
            contextBg="transparent"
            addedSignColor={theme.colors.git.added}
            removedSignColor={theme.colors.git.deleted}
            lineNumberFg={theme.colors.text.muted}
            lineNumberBg="transparent"
            addedLineNumberBg="#0d3a0d"
            removedLineNumberBg="#3a0d0d"
            selectionBg={theme.colors.primary}
            selectionFg={theme.colors.text.primary}
            style={{
              flexGrow: 1,
              width: '100%',
              height: '100%',
            }}
          />
        </scrollbox>
      )}
    </box>
  );
}
