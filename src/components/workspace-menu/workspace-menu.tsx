import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { CircleHelp, MoreHorizontal, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import shared from '../../shared.module.css';
import { HelpDialog } from '../help-dialog/help-dialog';
import { ResetDemoDialog } from '../reset-demo-dialog/reset-demo-dialog';
import styles from './workspace-menu.module.css';
import type { WorkspaceMenuProps } from './workspace-menu.types';

// Opens workspace help and the confirmation flow for resetting demo conversations.
export function WorkspaceMenu({ onReset }: WorkspaceMenuProps) {
  const [resetOpen, setResetOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger className={shared.iconButton} aria-label="Workspace menu">
          <MoreHorizontal size={20} />
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content className={styles.dropdownMenu} align="end" sideOffset={8}>
            <DropdownMenu.Item onSelect={() => setHelpOpen(true)}>
              <CircleHelp size={16} /> Controls & shortcuts
            </DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item className={styles.dangerItem} onSelect={() => setResetOpen(true)}>
              <RotateCcw size={16} /> Reset demo…
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      <ResetDemoDialog open={resetOpen} onOpenChange={setResetOpen} onReset={onReset} />
      <HelpDialog open={helpOpen} onOpenChange={setHelpOpen} />
    </>
  );
}
