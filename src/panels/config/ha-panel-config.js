import '@polymer/app-route/app-route.js';
import '@polymer/iron-media-query/iron-media-query.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

import '../../layouts/hass-error-screen.js';

import isComponentLoaded from '../../common/config/is_component_loaded.js';
import NavigateMixin from '../../mixins/navigate-mixin.js';

import(/* webpackChunkName: "panel-config-automation" */ './automation/ha-config-automation.js');
import(/* webpackChunkName: "panel-config-cloud" */ './cloud/ha-config-cloud.js');
import(/* webpackChunkName: "panel-config-config" */ './config-entries/ha-config-entries.js');
import(/* webpackChunkName: "panel-config-core" */ './core/ha-config-core.js');
import(/* webpackChunkName: "panel-config-customize" */ './customize/ha-config-customize.js');
import(/* webpackChunkName: "panel-config-dashboard" */ './dashboard/ha-config-dashboard.js');
import(/* webpackChunkName: "panel-config-script" */ './script/ha-config-script.js');
import(/* webpackChunkName: "panel-config-users" */ './users/ha-config-users.js');
import(/* webpackChunkName: "panel-config-zwave" */ './zwave/ha-config-zwave.js');
import(/* webpackChunkName: "panel-config-overview" */ './overview/ha-config-overview.js');

/*
 * @appliesMixin NavigateMixin
 */
class HaPanelConfig extends NavigateMixin(PolymerElement) {
  static get template() {
    return html`
    <app-route
      route='[[route]]'
      pattern='/:page'
      data="{{_routeData}}"
    ></app-route>

    <iron-media-query query="(min-width: 1040px)" query-matches="{{wide}}">
    </iron-media-query>
    <iron-media-query query="(min-width: 1296px)" query-matches="{{wideSidebar}}">
    </iron-media-query>

    <template is="dom-if" if='[[_equals(_routeData.page, "core")]]' restamp>
      <ha-config-core
        page-name='core'
        hass='[[hass]]'
        is-wide='[[isWide]]'
      ></ha-config-core>
    </template>

    <template is="dom-if" if='[[_equals(_routeData.page, "cloud")]]' restamp>
      <ha-config-cloud
        page-name='cloud'
        route='[[route]]'
        hass='[[hass]]'
        is-wide='[[isWide]]'
        account='[[account]]'
      ></ha-config-cloud>
    </template>

    <template is="dom-if" if='[[_equals(_routeData.page, "dashboard")]]'>
      <ha-config-dashboard
        page-name='dashboard'
        hass='[[hass]]'
        is-wide='[[isWide]]'
        account='[[account]]'
        narrow='[[narrow]]'
        show-menu='[[showMenu]]'
      ></ha-config-dashboard>
    </template>

    <template is="dom-if" if='[[_equals(_routeData.page, "automation")]]' restamp>
      <ha-config-automation
        page-name='automation'
        route='[[route]]'
        hass='[[hass]]'
        is-wide='[[isWide]]'
      ></ha-config-automation>
    </template>

    <template is="dom-if" if='[[_equals(_routeData.page, "script")]]' restamp>
      <ha-config-script
        page-name='script'
        route='[[route]]'
        hass='[[hass]]'
        is-wide='[[isWide]]'
      ></ha-config-script>
    </template>

    <template is="dom-if" if='[[_equals(_routeData.page, "zwave")]]' restamp>
      <ha-config-zwave
        page-name='zwave'
        hass='[[hass]]'
        is-wide='[[isWide]]'
      ></ha-config-zwave>
    </template>

    <template is="dom-if" if='[[_equals(_routeData.page, "customize")]]' restamp>
      <ha-config-customize
        page-name='customize'
        hass='[[hass]]'
        is-wide='[[isWide]]'
      ></ha-config-customize>
    </template>

    <template is="dom-if" if='[[_equals(_routeData.page, "integrations")]]' restamp>
      <ha-config-entries
        page-name='integrations'
        hass='[[hass]]'
        is-wide='[[isWide]]'
      ></ha-config-entries>
    </template>

    <template is="dom-if" if='[[_equals(_routeData.page, "users")]]' restamp>
      <ha-config-users
        page-name='users'
        route='[[route]]'
        hass='[[hass]]'
      ></ha-config-users>
    </template>

    <template is="dom-if" if='[[_equals(_routeData.page, "overview")]]' restamp>
      <ha-config-overview
        page-name='overview'
        route='[[route]]'
        hass='[[hass]]'
      ></ha-config-overview>
    </template>
    `;
  }

  static get properties() {
    return {
      hass: Object,
      narrow: Boolean,
      showMenu: Boolean,
      account: {
        type: Object,
        value: null,
      },

      route: {
        type: Object,
        observer: '_routeChanged',
      },

      _routeData: Object,

      wide: Boolean,
      wideSidebar: Boolean,

      isWide: {
        type: Boolean,
        computed: 'computeIsWide(showMenu, wideSidebar, wide)'
      },
    };
  }

  ready() {
    super.ready();
    if (isComponentLoaded(this.hass, 'cloud')) {
      this.hass.callApi('get', 'cloud/account')
        .then((account) => { this.account = account; }, () => {});
    }
    this.addEventListener('ha-account-refreshed', (ev) => {
      this.account = ev.detail.account;
    });
  }

  computeIsWide(showMenu, wideSidebar, wide) {
    return showMenu ? wideSidebar : wide;
  }

  _routeChanged(route) {
    if (route.path === '' && route.prefix === '/config') {
      this.navigate('/config/dashboard', true);
    }
  }

  _equals(a, b) {
    return a === b;
  }
}

customElements.define('ha-panel-config', HaPanelConfig);
