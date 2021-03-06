/*
 * This file is part of Report Portal.
 *
 * Report Portal is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Report Portal is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Report Portal.  If not, see <http://www.gnu.org/licenses/>.
 */
define(function (require) {
    'use strict';

    var SingletonLaunchFilterCollection = require('filters/SingletonLaunchFilterCollection');
    var SingletonUserStorage = require('storage/SingletonUserStorage');
    var FilterLabelView = require('launches/FilterLabelView');
    var FilterPanelView = require('launches/FilterPanelView');
    var Util = require('util');
    var $ = require('jquery');
    var _ = require('underscore');
    var Epoxy = require('backbone-epoxy');
    var FilterModel = require('filters/FilterModel');
    var App = require('app');

    var config = App.getInstance();

    var LaunchHeaderView = Epoxy.View.extend({
        events: {
            'click [data-js-add-filter]': 'onClickAddFilter',
            'click [data-js-all-link]': 'onClickAllLink',
            'click [data-js-filter-entity-switcher]': 'onClickFilterEntitySwitcher'
        },

        bindings: {
            '[data-js-filter-entity-switcher]': 'classes: {"hide": active}',
            '[data-js-all-link]': 'attr: {href: url}, classes: {active: active}'
        },

        template: 'tpl-launch-header',
        initialize: function () {
            this.ready = $.Deferred();
            this.userStorage = new SingletonUserStorage();
            this.launchFilterCollection = new SingletonLaunchFilterCollection();
            this.model = new FilterModel({ id: 'all', active: true, name: 'All Launches', owner: config.userModel.get('name') });
            this.listenTo(this.launchFilterCollection, 'add', this.onAddFilter);
            this.listenTo(this.launchFilterCollection, 'change:activeFilter', this.onChangeActiveFilter);
            this.listenTo(this.launchFilterCollection, 'change:id', this.onChangeIdFilter);
            this.listenTo(this.launchFilterCollection, 'add_entity change:newSelectionParameters', this.showFilterCriteriaPanel);
            this.listenTo(this.userStorage, 'change:launchFilterCriteriaHide', this.onChangeFilterCriteriaShow);
            this.render();
        },
        render: function () {
            this.launchFilterCollection.ready.done(function () {
                this.listenTo(this.launchFilterCollection, 'reset', this.renderFilterList);
                this.$el.html(Util.templates(this.template));
                this.applyBindings();
                this.renderFilterList();
                this.onChangeFilterCriteriaShow(null, this.userStorage.get('launchFilterCriteriaHide'));
                this.ready.resolve();
            }.bind(this));
        },
        onChangeFilterCriteriaShow: function (model, hide) {
            if (hide) {
                $('.launches-header-block', this.$el).addClass('hide-criteria');
            } else {
                $('.launches-header-block', this.$el).removeClass('hide-criteria');
            }
        },
        showFilterCriteriaPanel: function () {
            this.userStorage.set({ launchFilterCriteriaHide: false });
        },
        onChangeActiveFilter: function (filterModel) {
            if (filterModel) {
                this.activateFilter(filterModel);
                this.renderActiveFilter(filterModel);
                this.onChangeFilterCriteriaShow(null, filterModel.get('temp') ? false : this.userStorage.get('launchFilterCriteriaHide'));
            } else {
                this.model.set({ active: true });
                this.renderActiveFilter(this.model);
                if (this.filterPanel) {
                    this.filterPanel.destroy();
                }
            }
        },
        renderActiveFilter: function (model) {
            var $container = $('[data-js-active-filter]', this.$el);
            var mobileFilterActive = new FilterLabelView({ model: model });
            $container.html('');
            $container.append(mobileFilterActive.$el);
        },
        setState: function (level) {
            $('.launches-header-block', this.$el).attr('data-js-state', level);
        },
        activateFilter: function (filterModel) {
            this.model.set({ active: false });
            if (this.filterPanel) {
                this.filterPanel.destroy();
            }
            this.filterPanel = new FilterPanelView({ model: filterModel });
            $('[data-js-filter-panel]', this.$el).html(this.filterPanel.$el);
        },
        onAddFilter: function (model) {
            var filter = new FilterLabelView({ model: model });
            var mobileFilter = new FilterLabelView({ model: model });
            this.listenTo(filter, 'showCriteria', this.showFilterCriteriaPanel);
            $('[data-js-filter-list]', this.$el).append(filter.$el);
            $('[data-js-filter-list-mobile]', this.$el).append(mobileFilter.$el);
        },
        renderFilterList: function () {
            var mobileFilter = new FilterLabelView({ model: this.model });
            $('[data-js-filter-list]', this.$el).html('');
            $('[data-js-filter-list-mobile]', this.$el).html('');
            $('[data-js-filter-list-mobile]', this.$el).append(mobileFilter.$el);
            _.each(this.launchFilterCollection.models, function (model) {
                this.onAddFilter(model);
            }, this);
        },
        onClickFilterEntitySwitcher: function () {
            var curValue = this.userStorage.get('launchFilterCriteriaHide') || false;
            this.userStorage.set({ launchFilterCriteriaHide: !curValue });
        },
        onClickAddFilter: function () {
            var newFilter = this.launchFilterCollection.generateTempModel();
            config.trackingDispatcher.trackEventNumber(12);
            config.router.navigate(newFilter.get('url'), { trigger: true });
        },
        onClickAllLink: function () {
            config.trackingDispatcher.trackEventNumber(22);
        },
        onChangeIdFilter: function (filterModel) {
            config.router.navigate(filterModel.get('url'), { trigger: false });
        },
        discardTemporaryFiltersChanges: function () {
            var toRemove = this.launchFilterCollection.where({ temp: true });
            this.launchFilterCollection.remove(toRemove);
            _.each(this.launchFilterCollection.models, function (item) {
                item.set('newEntities', '');
            });
        },
        onDestroy: function () {
            this.filterPanel && this.filterPanel.destroy();
            this.model.destroy();
            this.discardTemporaryFiltersChanges();
            this.$el.empty();
        }
    });

    return LaunchHeaderView;
});
