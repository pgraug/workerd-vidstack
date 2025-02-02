import { html } from 'lit-html';
import { computed, type ReadSignal } from 'maverick.js';
import { isFunction, unwrap } from 'maverick.js/std';

import { useDefaultLayoutContext } from '../../../../../../components/layouts/default/context';
import type { MenuPlacement } from '../../../../../../components/ui/menu/menu-items';
import type { TooltipPlacement } from '../../../../../../components/ui/tooltip/tooltip-content';
import { useMediaState } from '../../../../../../core/api/media-context';
import { $signal } from '../../../../../lit/directives/signal';
import { IconSlot } from '../../slots';
import { $i18n } from '../utils';
import { DefaultAccessibilityMenu } from './accessibility-menu';
import { DefaultAudioMenu } from './audio-menu';
import { DefaultCaptionsMenu } from './captions-menu';
import { MenuPortal } from './menu-portal';
import { DefaultPlaybackMenu } from './playback-menu';

export function DefaultSettingsMenu({
  placement,
  portal,
  tooltip,
}: {
  portal?: boolean;
  tooltip: TooltipPlacement | ReadSignal<TooltipPlacement>;
  placement: MenuPlacement | ReadSignal<MenuPlacement | null>;
}) {
  return $signal(() => {
    const { viewType } = useMediaState(),
      {
        translations,
        menuContainer,
        noModal,
        menuGroup,
        smallWhen: smWhen,
      } = useDefaultLayoutContext(),
      $placement = computed(() =>
        noModal() ? unwrap(placement) : !smWhen() ? unwrap(placement) : null,
      ),
      $offset = computed(() =>
        !smWhen() && menuGroup() === 'bottom' && viewType() === 'video' ? 26 : 0,
      );

    const items = html`
      <media-menu-items
        class="vds-settings-menu-items vds-menu-items"
        placement=${$signal($placement)}
        offset=${$signal($offset)}
      >
        ${[
          DefaultPlaybackMenu(),
          DefaultAccessibilityMenu(),
          DefaultAudioMenu(),
          DefaultCaptionsMenu(),
        ]}
      </media-menu-items>
    `;

    return html`
      <media-menu class="vds-settings-menu vds-menu">
        <media-tooltip class="vds-tooltip">
          <media-tooltip-trigger>
            <media-menu-button
              class="vds-menu-button vds-button"
              aria-label=${$i18n(translations, 'Settings')}
            >
              ${IconSlot('menu-settings', 'vds-rotate-icon')}
            </media-menu-button>
          </media-tooltip-trigger>
          <media-tooltip-content
            class="vds-tooltip-content"
            placement=${isFunction(tooltip) ? $signal(tooltip) : tooltip}
          >
            ${$i18n(translations, 'Settings')}
          </media-tooltip-content>
        </media-tooltip>
        ${portal ? MenuPortal(menuContainer, items) : items}
      </media-menu>
    `;
  });
}
