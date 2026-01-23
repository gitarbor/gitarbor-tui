interface DiffViewProps {
  diff: string
  focused: boolean
}

export function DiffView({ diff, focused }: DiffViewProps) {
  const lines = diff.split('\n').slice(0, 100) // Limit to first 100 lines

  const getLineColor = (line: string): string => {
    if (line.startsWith('+')) return '#00FF00'
    if (line.startsWith('-')) return '#FF0000'
    if (line.startsWith('@@')) return '#00FFFF'
    if (line.startsWith('diff') || line.startsWith('index')) return '#999999'
    return '#CCCCCC'
  }

  return (
    <box
      width="100%"
      flexGrow={1}
      borderStyle="single"
      borderColor={focused ? '#CC8844' : '#555555'}
      padding={0}
    >
      <box paddingLeft={1} paddingTop={0}>
        <text fg="#FFFFFF">Diff View</text>
        <text> </text>
        {!diff || diff.trim() === '' ? (
          <text fg="#999999">No changes to display</text>
        ) : (
          lines.map((line, idx) => (
            <text key={idx} fg={getLineColor(line)}>
              {line}
            </text>
          ))
        )}
      </box>
    </box>
  )
}
