+function ($) { "use strict";
    var options = {
        segments    : [],
        data        : {},
        dataType    : 'json',
        defaults    : [],
        url         : []
    };

    var methods = {
        init: function(userOptions){
            options = $.extend(options, userOptions);

            var segments = [];

            $(options.segments).each(function(){
                segments.push($('#' + this));
            });

            options.segments = [this].concat(segments);

            $(options.segments).each(function(index, elm){
                if (index + 1 == options.segments.length) {
                    return false;
                }

                elm.on('change', function(e){
                    methods.reset(index);

                    if (_.isUndefined(options.url[index])) {
                        return false;
                    }

                    options.data.key = $(this).val();

                    $.post(options.url[index], options.data).done(function(d){
                        methods.decorate(d, index + 1);
                    });
                })

                if (!_.isUndefined(options.defaults[index])) {
                    elm.find('option').each(function(){
                        if ($(this).val() == options.defaults[index]) {
                            $(this).attr('selected', true);
                        }
                    });
                }
            });
            
            return this;
        },

        reset: function(i){
            var elm = options.segments[i + 1];

            if (!_.isUndefined(elm)) {
                elm.find('option').remove();
            }
        },

        decorate: function(data, i){
            var elm = options.segments[i];

            if (data.total > 0 && !_.isUndefined(elm)) {
                $(data.rows).each(function(){
                    var opt = $('<option>').attr({
                        value: this.id
                    }).html(this.text).appendTo(elm);

                    if (!_.isUndefined(options.defaults[i])) {
                        if (this.id == options.defaults[i]) {
                            opt.attr('selected', true);
                        }
                    }
                });
            }
        }
    };

    $.fn.segmentThese = function(methodOrOptions) {
        if ( methods[methodOrOptions] ) {
            return methods[ methodOrOptions ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof methodOrOptions === 'object' || ! methodOrOptions ) {
            return methods.init.apply(this, arguments);
        } else {
            $.error( 'Method ' +  methodOrOptions + ' does not exist on jQuery.tooltip' );
        }
    }
}(window.jQuery);