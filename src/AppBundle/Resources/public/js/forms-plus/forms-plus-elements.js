/* global formsPlus, moment */

// DateTimePicker
if( jQuery().datetimepicker ){
    moment.locale('en');
    formsPlus.setMinDate                            = function($el, date, asBase){
        if( !date ){
            return;
        }
        var picker                                  = $el.data("DateTimePicker");
        date                                        = formsPlus.toDate(date, $el.data('data-date-format'));
        if( picker ){
            var min;
            if( asBase && $el.data('dateMinDate') ){
                var
                    parseFormats                    = picker.extraFormats() || [],
                    format                          = picker.format()
                ;
                min                                 = formsPlus.toDate(
                    $el.data('dateMinDate'),
                    jQuery.inArray( format, parseFormats ) < 0 ? parseFormats.push( format ) : parseFormats,
                    picker.useStrict(),
                    date
                );
            }else{
                min                                 = picker.minDate();
            }
            if( min && date.unix() > min.unix() ){
                min                                 = date;
            }
            picker.minDate( min );
        }else{
            $el.fpSetValue( date );
        }
    };
    jQuery.fn.fpDateTimePicker                      = function(opts){
        if( !formsPlus.pluginCheck(this, "Forms Plus: date time picker - Nothing selected.") ){
            return this;
        }
        jQuery(this).each(function(i, $el){
            $el                                     = jQuery($el);
            var
                elIsRtl                             = $el.css('direction') === 'rtl' || !!(opts && opts.rtl),
                options                             = jQuery.extend({
                    format                  : formsPlus.dateFormat,
                    locale                  : moment.locale(),
                    extraFormats            : [formsPlus.dateFormat],
                    keepOpen                : true,
                    widgetPositioning       : {horizontal : elIsRtl ? 'right' : 'auto'},
                    //debug                   : true,
                    icons                   : {
                        time: 'fa fa-clock-o',
                        date: 'fa fa-calendar',
                        up: 'fa fa-chevron-up',
                        down: 'fa fa-chevron-down',
                        previous: 'fa fa-chevron-' + (elIsRtl ? 'right' : 'left'),
                        next: 'fa fa-chevron-' + (elIsRtl ? 'left' : 'right'),
                        today: 'fa fa-calendar-check-o',
                        clear: 'fa fa-calendar-times-o',
                        close: 'fa fa-times'
                    },
                    parseInputDate          : function(inputDate){
                        //Fix for setting date from options/data attributes, added tommorow, +/- days/weeks/months - http://momentjs.com/docs/#/manipulating/add/
                        if (moment.isMoment(inputDate) || inputDate instanceof Date) {
                            inputDate                   = moment(inputDate);
                        } else {
                            var picker                  = $el.data("DateTimePicker"),
                                parseFormats, format, useStrict
                            ;
                            if( picker ){
                                parseFormats            = picker.extraFormats() || [];
                                format                  = picker.format();
                                useStrict               = picker.useStrict();
                            }else{
                                parseFormats            = options.extraFormats || [];
                                format                  = $el.data('dateFormat') || options.format || formsPlus.dateFormat;
                                useStrict               = options.useStrict || false;
                            }
                            if( jQuery.inArray( format, parseFormats ) < 0 ) {
                                parseFormats.push( format );
                            }

                            inputDate                   = formsPlus.toDate(inputDate, parseFormats, useStrict);
                        }
                        return inputDate;
                    }
                }, opts || {})
            ;
            $el.datetimepicker(options);
            if( jQuery('[data-js-min-field="' + $el.attr('name') + '"]').length ){
                $el.on('dp.change', function(e){
                    jQuery('[data-js-min-field="' + $el.attr('name') + '"]').each(function(j, $field){
                        formsPlus.setMinDate( jQuery($field), e.date, true );
                    });
                });
            }
        });
        return this;
    };
    // Add init function
    formsPlus.initFn.push(function($container){
        $container.find('[data-js-datetimepick]:not([type="hidden"])').fpDateTimePicker();
        $container.find('[data-js-inline-datetimepick]').fpDateTimePicker({
            'inline'        : true
        });
    });
}

// ColorPicker
if( jQuery().spectrum ){
    jQuery.fn.fpColorPicker                         = function(opts){
        if( !formsPlus.pluginCheck(this, "Forms Plus: color picker - Nothing selected.") ){
            return this;
        }
        jQuery(this).each(function(i, $el){
            $el                                     = jQuery($el);
            var options                             = jQuery.extend({
                appendTo                            : $el.closest(formsPlus.selectors.form).length ? $el.closest(formsPlus.selectors.form) : 'body',
                preferredFormat                     : 'hex'
            }, opts || {});
            $el.spectrum(options);
        });
        return this;
    };
    // Add init function
    formsPlus.initFn.push(function($container){
        $container.find('[data-js-colorpick]:not([type="hidden"])').fpColorPicker();
        $container.find('[data-js-inline-colorpick]').fpColorPicker({
            'flat'                                  : true
        });
    });
}

// captcha
if( jQuery().realperson ){
    formsPlus.appendCaptchaHash                     = function($form){
        if( !jQuery().realperson ){
            return;
        }
        /*
            sometimes captcha is adding hash field after submit...
            this code add captcha hash, so it always be set before ajax
        */
        var $captcha                                = $form.find('[data-js-captcha]:not([type="hidden"])');
        $captcha.each(function(i, $c){
            $c                                      = jQuery($c);
            var name                                = $c.realperson('option', 'hashName').replace(/\{n\}/, $c.attr('name'));
            $form.find('input[name="' + name + '"]').remove();
            $form.append('<input type="hidden" class="' + formsPlus.css.removeAfterSendCss + '" name="' + name +
                '" value="' + $c.realperson('getHash') + '">');
        });
    };
    jQuery.realperson.fpFormats                     = {
        format1                                     : [['   *   ', '  ***  ', '  ***  ', ' **  * ', ' ***** ', '**    *', '**    *'], ['****** ', '**    *', '**    *', '****** ', '**    *', '**    *', '****** '], [' ***** ', '**    *', '**     ', '**     ', '**     ', '**    *', ' ***** '], ['****** ', '**    *', '**    *', '**    *', '**    *', '**    *', '****** '], ['*******', '**     ', '**     ', '****   ', '**     ', '**     ', '*******'], ['*******', '**     ', '**     ', '****   ', '**     ', '**     ', '**     '], [' ***** ', '**    *', '**     ', '**     ', '**  ***', '**    *', ' ***** '], ['**    *', '**    *', '**    *', '*******', '**    *', '**    *', '**    *'], ['*******', '  **   ', '  **   ', '  **   ', '  **   ', '  **   ', '*******'], ['     **', '     **', '     **', '     **', '     **', '*    **', ' ***** '], ['**    *', '**  ** ', '****   ', '**     ', '****   ', '**  ** ', '**    *'], ['**     ', '**     ', '**     ', '**     ', '**     ', '**     ', '*******'], ['*     *', '**   **', '*** * *', '** *  *', '**    *', '**    *', '**    *'], ['*     *', '**    *', '***   *', '** *  *', '**  * *', '**   **', '**    *'], [' ***** ', '**    *', '**    *', '**    *', '**    *', '**    *', ' ***** '], ['****** ', '**    *', '**    *', '****** ', '**     ', '**     ', '**     '], [' ***** ', '**    *', '**    *', '**    *', '**  * *', '**   * ', ' **** *'], ['****** ', '**    *', '**    *', '****** ', '**  *  ', '**   * ', '**    *'], [' ***** ', '**    *', '**     ', ' ***** ', '     **', '*    **', ' ***** '], ['*******', '  **   ', '  **   ', '  **   ', '  **   ', '  **   ', '  **   '], ['**    *', '**    *', '**    *', '**    *', '**    *', '**    *', ' ***** '], ['**    *', '**    *', ' **  * ', ' **  * ', '  ***  ', '  ***  ', '   *   '], ['**    *', '**    *', '**    *', '** *  *', '*** * *', '**   **', '*     *'], ['**    *', ' **  * ', '  ***  ', '   *   ', '  ***  ', ' **  * ', '**    *'], ['**    *', ' **  * ', '  ***  ', '  **   ', '  **   ', '  **   ', '  **   '], ['*******', '    ** ', '   **  ', '  **   ', ' **    ', '**     ', '*******'], ['  ***  ', ' *   * ', '*   * *', '*  *  *', '* *   *', ' *   * ', '  ***  '], ['   *   ', '  **   ', ' * *   ', '   *   ', '   *   ', '   *   ', '*******'], [' ***** ', '*     *', '      *', '     * ', '   **  ', ' **    ', '*******'], [' ***** ', '*     *', '      *', '    ** ', '      *', '*     *', ' ***** '], ['    *  ', '   **  ', '  * *  ', ' *  *  ', '*******', '    *  ', '    *  '], ['*******', '*      ', '****** ', '      *', '      *', '*     *', ' ***** '], ['  **** ', ' *     ', '*      ', '****** ', '*     *', '*     *', ' ***** '], ['*******', '     * ', '    *  ', '   *   ', '  *    ', ' *     ', '*      '], [' ***** ', '*     *', '*     *', ' ***** ', '*     *', '*     *', ' ***** '], [' ***** ', '*     *', '*     *', ' ******', '      *', '     * ', ' ****  ']],
    };
    jQuery.fn.fpCaptcha                             = function(opts){
        if( !formsPlus.pluginCheck(this, "Forms Plus: captcha - Nothing selected.") ){
            return this;
        }
        jQuery(this).each(function(i, $el){
            $el                                     = jQuery($el);
            var options                             = {};
            
            jQuery.extend(options, opts || {}, formsPlus.getDataOptions( $el, 'captcha', ['length', 'regenerate', 'dot', 'hashName'] ));
            if( $el.data('captchaFormat') && jQuery.realperson.fpFormats[ $el.data('captchaFormat') ] ){
                options.dots                        = jQuery.realperson.fpFormats[ $el.data('captchaFormat') ];
            }
            if( $el.data('captchaNumbers') ){
                options.chars                       = jQuery.realperson.alphanumeric;
            }else if( $el.data('captchaNumbersOnly') ){
                options.chars                       = '0123456789';
                options.dots                        = (options.dots || jQuery.realperson.defaultDots).slice(-10);
            }

            $el.realperson(options);
        });
        return this;
    };
    // Add init function
    formsPlus.initFn.push(function($container){
        $container.find('[data-js-captcha]:not([type="hidden"])').fpCaptcha();
    });
}


// Image upload: shows file name and/or image.
jQuery.fn.fpImageupload                             = function(){
    if( !formsPlus.pluginCheck(this, "Forms Plus: imageupload - Nothing selected.") ){
        return this;
    }
    jQuery.each(this, function(i, $el){
        $el                                         = jQuery($el);
        var reader                                  = false;
        if( typeof(FileReader) !== 'undefined' ){
            /*
                IE 10 and above, and modern browsers

                Creates FileReader to load selected image and display it
            */
            reader = new FileReader();
            
            reader.onloadstart                      = function(){
                $el.removeClass('p-has-file'); //Hide old image
            };
            reader.onload = function (e) {
                //Show new image
                $el.find('.p-preview')
                    .empty()
                    .html('<img src="' + e.target.result + '" alt="" />');
                $el.addClass('p-has-preview');
            };
        }
        
        // Set change event, unset any previous
        $el.find('input[type="file"]').off('change.pImageUpload').on('change.pImageUpload', function(){
            var files   = this.files ? this.files : this.currentTarget.files;
            if(reader){
                // IE 10 and above, and modern browsers
                reader.readAsDataURL( files[0] );
            }else{
                // old browsers, that doesn't support FileReader: will display name of selected image
                $el.addClass('p-has-file');
            }
            $el.find('.p-preview-name').text( this.value );
        });
    });
    return this;
};



// Add init function
formsPlus.initFn.push(function($container){
    $container.find('.p-file-wrap [type="file"]')
        .off('change.pFile')
        .on('change.pFile', function(){
            jQuery(this).closest('.form-group').find('.form-control').val(this.value);
        })
    ;
    $container.find('[data-js-image-upload]').fpImageupload();
});