export interface Command {
  id: string;
  label: string;
  description: string;
  shortcut?: string;
  execute: () => void;
}
