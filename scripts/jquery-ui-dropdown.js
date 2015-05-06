/*!
 * jQuery UI Bootstrap Custom Dropdown
 * Copyright 2015 VisCon Systems Sdn. Bhd.
 */ (function ($, _) {
    'use strict';

    $.widget('custom.dropdown', {
        options: {
            dropdown: {
                allowEmpty: true,
                autoClose: true,
                capitalize: true,
                showDialogBox: true,
                showPagination: true,
                showSearchBar: true,
                showSpacer: true,
                maxPerPage: 24,
                maxPerColumn: 12,
                maxPerPagination: 10,
                options: [],
                textKey: 'text',
                valueKey: 'value',
                sortBy: ''
            },
            button: {
                rowClass: 'row',
                defaultClass: 'btn btn-block',
                activeClass: 'btn-info',
                inactiveClass: '',
                defaultIconClass: '',
                activeIconClass: 'icon-check',
                inactiveIconClass: 'icon-check-empty',
                fadeOut: 300
            },
            pagination: {
                wrapperClass: 'pagination',
                defaultClass: '',
                activeClass: 'btn-info',
                inactiveClass: '',
                disabledClass: 'active',
                previousClass: 'icon-double-angle-left',
                nextClass: 'icon-double-angle-right',
                fadeOut: 0
            },
            searchBar: {
                iconClass: 'icon-search'
            }
        },
        _create: function () {
            var element = this.element,
                optionsDropdown = this.options.dropdown;

            if (!element.is('select') || (!element.children('option').length && !_.size(optionsDropdown.options))) {
                return;
            }

            this.element.hide();
            this._validateElement();
            this._validateOptions();
            this._createCssClass();
            this._createDropdown();
            this._createWrapper();

            if (optionsDropdown.showDialogBox) {
                this._createComboBox();
                this._createDialogBox();
            }

            this._on(element, {
                'change': function () {
                    var selected = element.children('option:selected'),
                        value = selected.text() || '';

                    optionsDropdown.showDialogBox && this.comboBoxInput.val(value);
                }
            });
        },
        _getCreateOptions: function () {
            var element = this.element;

            return {
                'id': element.attr('id'),
                'name': element.attr('name'),
                'title': element.attr('data-title'),
                'dropdown': {
                    'allowEmpty': element.attr('data-dropdown-allowEmpty'),
                    'autoClose': element.attr('data-dropdown-autoClose'),
                    'capitalize': element.attr('data-dropdown-capitalize'),
                    'showDialogBox': element.attr('data-dropdown-showDialogBox'),
                    'showPagination': element.attr('data-dropdown-showPagination'),
                    'showSearchBar': element.attr('data-dropdown-showSearchBar'),
                    'showSpacer': element.attr('data-dropdown-showSpacer'),
                    'maxPerPage': element.attr('data-dropdown-maxPerPage'),
                    'maxPerColumn': element.attr('data-dropdown-maxPerColumn'),
                    'maxPerPagination': element.attr('data-dropdown-maxPerPagination'),
                    'options': element.attr('data-dropdown-options'),
                    'textKey': element.attr('data-dropdown-textKey'),
                    'valueKey': element.attr('data-dropdown-valueKey'),
                    'sortBy': element.attr('data-dropdown-sortBy')
                },
                'button': {
                    'rowClass': element.attr('data-button-rowClass'),
                    'defaultClass': element.attr('data-button-defaultClass'),
                    'activeClass': element.attr('data-button-activeClass'),
                    'inactiveClass': element.attr('data-button-inactiveClass'),
                    'defaultIconClass': element.attr('data-button-defaultIconClass'),
                    'activeIconClass': element.attr('data-button-activeIconClass'),
                    'inactiveIconClass': element.attr('data-button-inactiveIconClass'),
                    'fadeOut': element.attr('data-button-fadeOut')
                },
                pagination: {
                    'wrapperClass': element.attr('data-pagination-wrapperClass'),
                    'defaultClass': element.attr('data-pagination-defaultClass'),
                    'activeClass': element.attr('data-pagination-activeClass'),
                    'inactiveClass': element.attr('data-pagination-inactiveClass'),
                    'disabledClass': element.attr('data-pagination-disabledClass'),
                    'previousClass': element.attr('data-pagination-previousClass'),
                    'nextClass': element.attr('data-pagination-nextClass'),
                    'fadeOut': element.attr('data-pagination-fadeOut')
                },
                searchBar: {
                    'iconClass': element.attr('data-searchBar-iconClass')
                }
            };
        },
        _destroy: function () {
            this.element.show();
            this.wrapper.remove();
            this.cssClass.remove();
            _.size(this.options.dropdown.options) && this.element.children('option.' + this.widgetFullName).remove();
        },
        _validateElement: function () {
            var options = this.options,
                id = options.id,
                name = options.name;

            if (!id) {
                id = options.id = 'dropdown' + new Date().getTime();
            }

            if (!name) {
                name = options.name = id;
            }

            this.element.attr({
                'id': id,
                'name': name
            });
        },
        _validateOptions: function () {
            var options = this.options,
                optionsDropdown = options.dropdown,
                optionsButton = options.button,
                optionsPagination = options.pagination;

            optionsDropdown.allowEmpty = this._validateBoolean(optionsDropdown.allowEmpty);
            optionsDropdown.autoClose = this._validateBoolean(optionsDropdown.autoClose);
            optionsDropdown.capitalize = this._validateBoolean(optionsDropdown.capitalize);
            optionsDropdown.showDialogBox = this._validateBoolean(optionsDropdown.showDialogBox);
            optionsDropdown.showPagination = this._validateBoolean(optionsDropdown.showPagination);
            optionsDropdown.showSearchBar = this._validateBoolean(optionsDropdown.showSearchBar);
            optionsDropdown.showSpacer = this._validateBoolean(optionsDropdown.showSpacer);
            optionsDropdown.maxPerPage = this._validateInteger(optionsDropdown.maxPerPage, 1, 24, 24);
            optionsDropdown.maxPerColumn = this._validateInteger(optionsDropdown.maxPerColumn, 1, 12, 12);
            optionsDropdown.maxPerPagination = this._validateInteger(optionsDropdown.maxPerPagination, 1, 10, 10);
            optionsDropdown.options = this._validateDropdownOptions(optionsDropdown.options);
            optionsButton.rowClass = this._validateRowClass(optionsButton.rowClass);
            optionsButton.fadeOut = this._validateInteger(optionsButton.fadeOut, 0, 10000, 300);
            optionsPagination.fadeOut = this._validateInteger(optionsPagination.fadeOut, 0, 10000, 0);
        },
        _createCssClass: function () {
            var styles =
                '<style class="' + this.widgetFullName + '">' +
                " .custom-dropdown .combo-box-input{padding: 4px 6px;color: #808080;border: 1px solid #ccc;}" +
                " .custom-dropdown .row+.row{margin-top: 5px;}" +
                " .custom-dropdown .row-fluid+.row-fluid{margin-top: 5px;}" +
                " .custom-dropdown .pagination{margin-top: 15px;margin-bottom: 0;}" +
                " .custom-dropdown .btn .left-text{width: auto;overflow: hidden;}" +
                " .custom-dropdown .btn .right-icon{min-width: 11px;max-width: 55px;padding: 0 5px;position: relative;top: 1px;float: right;}" +
                " .custom-dropdown.paging .btn-default{background-color: #fff;color: #08c;}" +
                " .custom-dropdown.paging .btn-info{background-color: #49afcd;color: #fff;}" +
                "</style>";

            this.cssClass = $(styles).appendTo('head');

            return this.cssClass;
        },
        _createDropdown: function () {
            var element = this.element,
                widgetFullName = this.widgetFullName,
                optionsDropdown = this.options.dropdown,
                dropdownOptions = optionsDropdown.options,
                textKey = optionsDropdown.textKey,
                valueKey = optionsDropdown.valueKey,
                capitalize = optionsDropdown.capitalize,
                _capitalize = this._capitalize;

            if (optionsDropdown.allowEmpty) {
                var emptyOptions = element.children('option').filter(function () {
                    return _.isEmpty($.trim($(this).text())) && _.isEmpty($.trim($(this).val()));
                }), emptyOption = {};

                if (emptyOptions.length < 1) {
                    element.prepend($('<option>').addClass(widgetFullName));
                    emptyOption[valueKey] = '';
                    emptyOption[textKey] = '';
                    dropdownOptions.unshift(emptyOption);
                }
            }

            _.each(_.sortBy(dropdownOptions, optionsDropdown.sortBy), function (current) {
                var value = current[valueKey],
                    text = current[textKey];

                if (value && text) {
                    $('<option>')
                        .appendTo(element)
                        .attr('value', value)
                        .text(capitalize ? _capitalize(text) : text).addClass(widgetFullName);
                }
            });
        },
        _createWrapper: function () {
            var optionsDropdown = this.options.dropdown,
                dropdownOptions = optionsDropdown.options;

            this.wrapper = $('<div>').insertAfter(this.element).addClass(this.widgetFullName);

            if (!optionsDropdown.showDialogBox) {
                this.wrapper.append(this._createPage(dropdownOptions));
                optionsDropdown.showPagination && this.wrapper.append(this._createPagination(dropdownOptions));
                optionsDropdown.showSearchBar && this.wrapper.append(this._createSearchBar(dropdownOptions));
            }

            return this.wrapper;
        },
        _createComboBox: function () {
            var selected = this.element.children('option:selected'),
                value = selected.text() || '',
                parent = this.wrapper,
                comboBox;

            comboBox = $('<div>')
                .appendTo(parent)
                .addClass('combo-box input-append ' + this.widgetFullName);
            this.comboBoxInput = $('<input>')
                .appendTo(comboBox)
                .addClass('combo-box-input')
                .outerWidth(parent.outerWidth())
                .val(value);
            this.comboBoxButton = $('<div>')
                .appendTo(comboBox)
                .attr('tabIndex', -1)
                .addClass('btn-group')
                .append($('<button>')
                    .attr({
                        'type': 'button',
                        'title': 'Show All'
                    })
                    .addClass('btn dropdown-toggle')
                    .outerHeight(this.comboBoxInput.outerHeight())
                    .append('<span class="caret"></span>'));
            this.comboBoxInput.outerWidth(parent.outerWidth() - this.comboBoxButton.outerWidth() + 1);

            this._on(this.comboBoxInput, {
                'focus': function () {
                    this.comboBoxButton.trigger('click');
                }
            });
            this._on(this.comboBoxButton, {
                'click': function () {
                    this.dialogBox.modal();
                }
            });

            return comboBox;
        },
        _createDialogBox: function () {
            var options = this.options,
                optionsDropdown = options.dropdown,
                dropdownOptions = optionsDropdown.options,
                body, footer;

            this.dialogBox = $('<div>')
                .appendTo(this.wrapper)
                .addClass('modal fade hide ' + this.widgetFullName)
                .append($('<div>')
                    .addClass('modal-body'))
                .append($('<div>')
                    .addClass('modal-footer'));
            !_.isEmpty(options.title) && this.dialogBox.prepend($('<div>').addClass('modal-header')
                .append((this.options.dropdown.autoClose ? '' : $('<button>').attr({
                    'type': 'button',
                    'data-dismiss': 'modal'
                })
                    .addClass('close')
                    .html('<i class="icon-remove icon-large"></i>')))
                .append($('<h3>').text(options.title)));
            body = this.dialogBox.children('.modal-body');
            footer = this.dialogBox.children('.modal-footer');
            body.append(this._createPage(dropdownOptions));
            optionsDropdown.showPagination && body.append(this._createPagination(dropdownOptions));
            optionsDropdown.showPagination && footer.append(this._createSearchBar(dropdownOptions));

            return this.dialogBox;
        },
        _createPage: function (dropdownOptions, currentPage) {
            var currentPage = currentPage || 1,
                optionsDropdown = this.options.dropdown,
                maxPerPage = optionsDropdown.maxPerPage,
                maxPerColumn = optionsDropdown.maxPerColumn,
                from = (currentPage - 1) * maxPerPage,
                to = currentPage * maxPerPage,
                sortedOptions = _.sortBy(dropdownOptions, optionsDropdown.sortBy).slice(from, to),
                optionsButton = this.options.button,
                capitalize = optionsDropdown.capitalize,
                textKey = optionsDropdown.textKey,
                valueKey = optionsDropdown.valueKey,
                _createRow = this._createRow,
                _createColumn = this._createColumn,
                _createButton = this._createButton,
                _capitalize = this._capitalize,
                totalPage = Math.ceil(_.size(dropdownOptions) / optionsDropdown.maxPerPage),
                selected = this.element.children('option:selected'),
                value = selected.val() || '',
                text = selected.text() || '',
                row, pageWrapper;

            pageWrapper = $('<div>')
                .addClass('page' + (optionsDropdown.showDialogBox ? '' : ' ' + this.widgetFullName));

            _.each(sortedOptions, function (current, idx) {
                if (idx === 0 || (idx % maxPerColumn === 0)) {
                    row = _createRow(optionsButton).appendTo(pageWrapper);
                }

                _createColumn(maxPerColumn)
                    .appendTo(row)
                    .append(_createButton(
                        optionsButton,
                        current[valueKey],
                        capitalize ? _capitalize(current[textKey]) : current[textKey]));
            });

            if (optionsDropdown.showSpacer && totalPage > 1) {
                var intervalId = setInterval(function () {
                    var outerHeight = pageWrapper.find('button').first().outerHeight(),
                        sortedSize = _.size(sortedOptions),
                        spacing, start;

                    if (outerHeight) {
                        window.clearInterval(intervalId);

                        if (sortedSize < maxPerPage) {
                            spacing = maxPerPage - sortedSize;
                            row = pageWrapper.find('div.row').last();
                            start = row.children().length;

                            _.each(_.range(1, spacing + 1), function (current, idx) {
                                if ((start + idx) % maxPerColumn === 0) {
                                    row = _createRow(optionsButton).appendTo(pageWrapper);
                                }

                                _createColumn(maxPerColumn)
                                    .appendTo(row)
                                    .outerHeight(outerHeight)
                                    .append('&nbsp;');
                            });
                        }
                    }
                }, 1);
            }

            this._on(pageWrapper, {
                'click button': function (e, skip) {
                    var button = $(e.currentTarget),
                        activeClass = optionsButton.activeClass,
                        inactiveClass = optionsButton.inactiveClass,
                        activeIconClass = optionsButton.activeIconClass,
                        inactiveIconClass = optionsButton.inactiveIconClass;

                    this.element
                        .val(button.find('.left-text').attr('data-value'))
                        .trigger('change');
                    pageWrapper
                        .find('button')
                        .addClass(inactiveClass)
                        .removeClass(activeClass)
                        .find('.right-icon i')
                        .addClass(inactiveIconClass)
                        .removeClass(activeIconClass);
                    button
                        .toggleClass(activeClass + ' ' + inactiveClass)
                        .find('.right-icon i')
                        .toggleClass(activeIconClass + ' ' + inactiveIconClass);
                    !skip && optionsDropdown.showDialogBox && optionsDropdown.autoClose && this.dialogBox.modal('hide');
                }
            });

            if (value) {
                pageWrapper
                    .find('span[data-value=' + value + ']')
                    .filter(function () {
                        return $(this).text().toLowerCase() === text.toLowerCase();
                    })
                    .parent()
                    .trigger('click', true);
            }

            return pageWrapper;
        },
        _createPagination: function (dropdownOptions, currentPagination) {
            var currentPagination = currentPagination || 1,
                optionsDropdown = this.options.dropdown,
                maxPerPagination = optionsDropdown.maxPerPagination,
                totalPage = Math.ceil(_.size(dropdownOptions) / optionsDropdown.maxPerPage),
                totalPagination = Math.ceil(totalPage / maxPerPagination),
                from = (currentPagination - 1) * maxPerPagination + 1,
                to = ((currentPagination === totalPagination || totalPagination === 0) ? totalPage : currentPagination * maxPerPagination) + 1,
                optionsPagination = this.options.pagination,
                defaultClass = optionsPagination.defaultClass,
                activeClass = optionsPagination.activeClass,
                inactiveClass = optionsPagination.inactiveClass,
                disabledClass = optionsPagination.disabledClass,
                pagination, paginationWrapper, previous, next;

            pagination = $('<ul>');
            paginationWrapper = $('<div>')
                .addClass('paging ' + this.widgetFullName + ' ' + optionsPagination.wrapperClass)
                .append(pagination);

            _.each(_.range(from, to), function (current, idx) {
                var link = $('<a>')
                    .attr('href', '#')
                    .addClass(defaultClass + ' ' + inactiveClass)
                    .text(current);

                if (idx === 0) {
                    link.toggleClass(activeClass + ' ' + inactiveClass);
                }

                $('<li>').appendTo(pagination).append(link);
            });

            previous = this._createPager(currentPagination - 1, optionsPagination.previousClass)
                .prependTo(pagination);
            next = this._createPager(currentPagination + 1, optionsPagination.nextClass)
                .appendTo(pagination);

            if (currentPagination > 1) {
                previous.removeClass(disabledClass);
            }

            if (currentPagination < totalPagination) {
                next.removeClass(disabledClass);
            }

            this._on(pagination, {
                'click a': function (e) {
                    var link = $(e.currentTarget),
                        current = pagination.find('a.' + activeClass),
                        paging = link.attr('data-paging'),
                        parent = optionsDropdown.showDialogBox ? this.dialogBox : this.wrapper,
                        newPage, newPagination;

                    current.toggleClass(activeClass + ' ' + inactiveClass);

                    if (paging) {
                        if (!link.parent().hasClass(disabledClass)) {
                            paging = parseInt(paging, 10);
                            newPage = this._createPage(dropdownOptions, (paging - 1) * maxPerPagination + 1);
                            newPagination = this._createPagination(dropdownOptions, paging);
                            this._changePage(parent, newPage);
                            this._changePagination(parent, newPagination);
                        } else {
                            current.toggleClass(activeClass + ' ' + inactiveClass);
                        }
                    } else {
                        link.toggleClass(activeClass + ' ' + inactiveClass);
                        newPage = this._createPage(dropdownOptions, parseInt(link.text(), 10));
                        this._changePage(parent, newPage);
                    }

                    return false;
                }
            });

            return paginationWrapper;
        },
        _createSearchBar: function (dropdownOptions) {
            var options = this.options,
                optionsDropdown = options.dropdown,
                showDialogBox = optionsDropdown.showDialogBox,
                parent = showDialogBox ? this.dialogBox : this.wrapper,
                footer = parent.children('.modal-footer'),
                searchBar, searchBarInput, searchBarButton;

            searchBar = $('<div>')
                .appendTo(this.wrapper)
                .addClass('search-bar input-append ' + this.widgetFullName);
            searchBarInput = $('<input>')
                .appendTo(searchBar)
                .addClass('combo-box-input');
            searchBarButton = $('<div>')
                .appendTo(searchBar)
                .attr('tabIndex', -1)
                .addClass('btn-group')
                .append($('<button>')
                    .attr({
                        'type': 'button',
                        'title': 'Search',
                        'disabled': true
                    })
                    .addClass('btn dropdown-toggle')
                    .outerHeight(searchBarInput.outerHeight())
                    .append($('<span>').addClass(options.searchBar.iconClass)));
            searchBarInput.outerWidth(parent.outerWidth() - searchBarButton.outerWidth() + 1);
            showDialogBox && searchBarInput.outerWidth(searchBarInput.outerWidth() - parseInt(footer.css('padding-left'), 10) - parseInt(footer.css('padding-right'), 10));

            this._on(searchBarInput, {
                'input': function (e) {
                    var input = $(e.currentTarget),
                        value = input.val(),
                        newDropdownOptions, newPage, newPagination,
                        that = this;

                    input.attr('readonly', true);
                    setTimeout(function () {
                        if (value === '') {
                            newDropdownOptions = optionsDropdown.options;
                        } else if (value && value !== ' ') {
                            newDropdownOptions = _.filter(dropdownOptions, function (option) {
                                return option[optionsDropdown.textKey].toLowerCase().indexOf(value.toLowerCase()) > -1;
                            });
                        }

                        newPage = that._createPage(newDropdownOptions);
                        newPagination = that._createPagination(newDropdownOptions);
                        that._changePage(parent, newPage);
                        optionsDropdown.showPagination && that._changePagination(parent, newPagination);
                        input.attr('readonly', false);
                    }, 200);
                }
            });

            return searchBar;
        },
        _validateBoolean: function (value) {
            if (value === false || _.isString(value) && value.toLowerCase() === 'false') {
                return false;
            }

            return true;
        },
        _validateInteger: function (value, min, max, def) {
            value = parseInt(value, 10);

            if (_.isNaN(value) || value < min || value > max) {
                return def;
            }

            return value;
        },
        _validateDropdownOptions: function (dropdownOptions) {
            var optionsDropdown = this.options.dropdown,
                textKey = optionsDropdown.textKey,
                valueKey = optionsDropdown.valueKey,
                newDropdownOptions = [],
                dropdownOption;

            _.each(this.element.children('option'), function (current) {
                if (optionsDropdown.allowEmpty || (current.text && current.value)) {
                    dropdownOption = {};
                    dropdownOption[textKey] = current.text;
                    dropdownOption[valueKey] = current.value;
                    newDropdownOptions.push(dropdownOption);
                }
            });

            if (_.isString(dropdownOptions)) {
                dropdownOptions = JSON.parse(dropdownOptions);
            }

            return _.union(newDropdownOptions, dropdownOptions);
        },
        _validateRowClass: function (rowClass) {
            return (rowClass === 'row' || rowClass === 'row-fluid') ? rowClass : 'row';
        },
        _capitalize: function (text) {
            if (_.isString(text)) {
                return text.toLowerCase().replace(/(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g, function (firstLetter) {
                    return firstLetter.toUpperCase();
                });
            }

            return text;
        },
        _createRow: function (optionsButton) {
            return $('<div>').addClass(optionsButton.rowClass);
        },
        _createColumn: function (maxPerColumn) {
            return $('<div>').addClass('span' + parseInt((12 / maxPerColumn), 10));
        },
        _createButton: function (optionsButton, value, text) {
            var defaultClass = optionsButton.defaultClass,
                inactiveClass = optionsButton.inactiveClass,
                defaultIconClass = optionsButton.defaultIconClass,
                inactiveIconClass = optionsButton.inactiveIconClass;

            return $('<button>')
                .attr('type', 'button')
                .addClass(defaultClass + ' ' + inactiveClass)
                .append($('<span>')
                    .attr('data-value', value)
                    .addClass('left-text')
                    .text(text))
                .append($('<span>')
                    .addClass('right-icon')
                    .append($('<i>')
                        .addClass(defaultIconClass + ' ' + inactiveIconClass)));
        },
        _createPager: function (paging, pagerClass) {
            return $('<li>')
                .addClass(this.options.pagination.disabledClass)
                .append($('<a>')
                    .attr({
                        'href': '#',
                        'data-paging': paging
                    })
                    .append($('<i>')
                        .addClass(pagerClass)));
        },
        _changePage: function (parent, newPage) {
            parent.find('.page').fadeOut(this.options.button.fadeOut, function () {
                $(this).replaceWith(newPage);
            });

        },
        _changePagination: function (parent, newPagination) {
            parent.find('.paging').fadeOut(this.options.pagination.fadeOut, function () {
                $(this).replaceWith(newPagination);
            });
        }
    });
})(jQuery, _);