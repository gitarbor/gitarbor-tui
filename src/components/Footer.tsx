interface FooterProps {
  message: string
}

export function Footer({ message }: FooterProps) {
  return (
    <box
      width="100%"
      height={5}
      borderStyle="single"
      borderColor="#555555"
      padding={0}
    >
      <box paddingLeft={1} paddingTop={0}>
        <text fg="#999999">Commands: [1-4] Switch View | [Enter] Select/Action | [s] Stage | [u] Unstage | [c] Commit | [q] Quit</text>
        {message && (
          <text fg="#CC8844">{message}</text>
        )}
      </box>
    </box>
  )
}
