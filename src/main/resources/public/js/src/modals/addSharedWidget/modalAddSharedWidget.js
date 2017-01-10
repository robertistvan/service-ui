/*
 * Copyright 2016 EPAM Systems
 *
 *
 * This file is part of EPAM Report Portal.
 * https://github.com/epam/ReportPortal
 *
 * Report Portal is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Report Portal is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Report Portal.  If not, see <http://www.gnu.org/licenses/>.
 */

define(function (require, exports, module) {
    'use strict';

    var Epoxy = require('backbone-epoxy');
    var ModalView = require('modals/_modalView');
    var Util = require('util');
    var $ = require('jquery');
    var Service = require('coreService');
    var App = require('app');

    var config = App.getInstance();


    var ModalAddSharedWidget = ModalView.extend({
        template: 'tpl-modal-add-shared-widget',
        className: 'modal-add-shared-widget',

        events: {

        },
        bindings: {

        },

        initialize: function(options) {
            this.render();
            Service.getSharedWidgets()
                .done(function(data) {

                })
                .fail(function () {
                    Util.ajaxFailMessenger(null, 'connectToServer');
                });
        },
        render: function() {
            this.$el.html(Util.templates(this.template, {}))
        },

        onDestroy: function() {

        }

    });

    return ModalAddSharedWidget;
});