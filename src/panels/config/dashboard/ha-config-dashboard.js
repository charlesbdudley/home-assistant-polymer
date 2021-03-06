import '@polymer/app-layout/app-header-layout/app-header-layout.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-item/paper-item-body.js';
import '@polymer/paper-item/paper-item.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

import '../../../components/ha-menu-button.js';

import '../ha-config-section.js';
import './ha-config-navigation.js';

import isComponentLoaded from '../../../common/config/is_component_loaded.js';
import LocalizeMixin from '../../../mixins/localize-mixin.js';
import NavigateMixin from '../../../mixins/navigate-mixin.js';

/*
 * @appliesMixin LocalizeMixin
 */
class HaConfigDashboard extends NavigateMixin(LocalizeMixin(PolymerElement)) {
  static get template() {
    return html`
    <style include="iron-flex ha-style">
      .content {
        padding-bottom: 32px;
      }
      paper-card {
        display: block;
      }
      a {
        text-decoration: none;
        color: var(--primary-text-color);
      }
    </style>

    <app-header-layout has-scrolling-region="">
      <app-header slot="header" fixed="">
        <app-toolbar>
          <ha-menu-button narrow="[[narrow]]" show-menu="[[showMenu]]"></ha-menu-button>
          <div main-title="">[[localize('panel.configuration')]]</div>
        </app-toolbar>
      </app-header>

      <div class="content">
        <ha-config-section is-wide="[[isWide]]">
          <span slot="header">[[localize('ui.panel.config.header')]]</span>
          <span slot="introduction">[[localize('ui.panel.config.introduction')]]</span>

          <template is="dom-if" if="[[computeIsLoaded(hass, 'cloud')]]">
            <paper-card>
              <a href='/config/cloud' tabindex="-1">
                <paper-item on-click="_navigate">
                  <paper-item-body two-line="">
                    Home Assistant Cloud
                    <template is="dom-if" if="[[account]]">
                      <div secondary="">Logged in as [[account.email]]</div>
                    </template>
                    <template is="dom-if" if="[[!account]]">
                      <div secondary="">Not logged in</div>
                    </template>
                  </paper-item-body>
                  <iron-icon icon="hass:chevron-right"></iron-icon>
                </paper-item>
              </paper-card>
            </a>
          </template>

          <paper-card>
            <a href='/config/overview' tabindex="-1">
              <paper-item>
                <paper-item-body two-line>
                  Overview
                  <div secondary>Find out how your config, devices and entities relate</div>
                </paper-item-body>
                <iron-icon icon="hass:chevron-right"></iron-icon>
              </paper-item>
            </a>

            <a href='/config/integrations' tabindex="-1">
              <paper-item>
                <paper-item-body two-line>
                  Integrations
                  <div secondary>Manage connected devices and services</div>
                </paper-item-body>
                <iron-icon icon="hass:chevron-right"></iron-icon>
              </paper-item>
            </a>

            <a href='/config/users' tabindex="-1">
              <paper-item>
                <paper-item-body two-line>
                  [[localize('ui.panel.config.users.caption')]]
                  <div secondary>
                    [[localize('ui.panel.config.users.description')]]
                  </div>
                </paper-item-body>
                <iron-icon icon="hass:chevron-right"></iron-icon>
              </paper-item>
            </a>
          </paper-card>

          <ha-config-navigation hass="[[hass]]"></ha-config-navigation>
        </ha-config-section>
      </div>
    </app-header-layout>
`;
  }

  static get properties() {
    return {
      hass: Object,
      isWide: Boolean,
      account: Object,
      narrow: Boolean,
      showMenu: Boolean,
    };
  }

  computeIsLoaded(hass, component) {
    return isComponentLoaded(hass, component);
  }
}

customElements.define('ha-config-dashboard', HaConfigDashboard);
