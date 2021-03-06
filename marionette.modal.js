(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['marionette', 'underscore', 'jquery', 'jquery.modal'], factory);
    } else if (typeof exports === 'object') {
        var Marionette = require('marionette');
        var _ = require('underscore');
        var $ = require('jquery');
        require('jquery.modal');

        module.exports = factory(Marionette, _, $);
    } else {
        // Browser globals (root is window)
        factory(root.Marionette, root._);
    }
}(this, function (Marionette, _) {
    'use strict';

    Marionette.Region.Modal = Marionette.Region.extend({
        onShow: function (view) {
            this.bindInputEvents(view);
            var options = this.getDefaultOptions(_.result(view, 'modal'));

            view.$el.modal(options);

            view.$el.on($.modal.CLOSE, _.bind(function () {
                this.onCloseDialog();
            }, this));

            // Freeze darkened body
            if ( options.freeze ) {
                document.querySelector('body').classList.add('modal-freeze');
            }
        },

        onEmpty: function () {
            // Unfreeze body scrolling
            document.querySelector('body').classList.remove('modal-freeze');
        },

        /**
         * Returns the configuration object for the modal
         */
        getDefaultOptions: function (options) {
            options = options || {};

            var defaults = {
                modalClass: 'marionette-modal'
            };

            return _.defaults(options, {
                modalClass: options.className
            }, defaults);
        },

        /**
         * Cleanup after dialog is closed
         */
        onCloseDialog: function () {
            this.currentView.$el.off($.modal.CLOSE);
            this.empty();
        },

        /**
         * Forces the dialog to close and cleanup to happen
         */
        forceClose: function () {
            $.modal.close();
        },

        /**
         * Binds to input events that can force the dialog to behave in a permitted way
         */
        bindInputEvents: function (view) {
            this.listenTo(view, 'dialog:close', _.bind(this.forceClose, this));
        }
    });
}));
