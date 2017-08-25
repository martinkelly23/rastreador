/* global formsPlus */

jQuery.fn.getCursorPosition = function() {
    var input = this.get(0);
    if (!input){
        return; // No (input) element found
    }
    if ('selectionStart' in input) {
        // Standard-compliant browsers
        return input.selectionStart;
    } else if (document.selection) {
        // IE
        input.focus();
        var sel = document.selection.createRange();
        var selLen = document.selection.createRange().text.length;
        sel.moveStart('character', -input.value.length);
        return sel.text.length - selLen;
    }
};

//Mask
if( jQuery().mask ){
    jQuery.mask.definitions['h']                    = "[A-Fa-f0-9]";
    jQuery.mask.definitions['~']                    = "[+-]";
    jQuery.fn.fpMask                                = function(opts){
        if( !formsPlus.pluginCheck(this, "Forms Plus: mask - Nothing selected.") ){
            return this;
        }
        for (var i = 0; i < this.length; i++) {
            var
                $el                                 = jQuery(this[i]),
                options                             = jQuery.extend({}, opts, formsPlus.getDataOptions( $el, 'js', ['mask', 'placeholder'] )),
                mask                                = options.mask + ''
            ;
            if( !mask ){
                continue;
            }else{
                delete options.mask;
            }
            $el.mask( mask, options );
        }
        return this;
    };
    // Add init function
    formsPlus.initFn.push(function($container){
        $container.find('input[data-js-mask]').fpMask();
    });
}

// Add init function
formsPlus.initFn.push(function($container){
    //Toggle type
    $container.find('[data-js-toggle-type]')
        .off('.pToggleType')
        .on('click.pToggleType', function(e){
            e.preventDefault();
            var $el                                 = jQuery(this);
            if( !formsPlus.hasDataString( $el, 'jsToggleType' ) ){
                return;
            }
            var
                $container                          = $el.closest( formsPlus.selectors.fieldWrap ),
                $field                              = $container.find('input.form-control'),
                $tContent                           = $container.find('[data-js-toggle-content]')
            ;
            
            if( $container.hasClass('p-field-toggled') ){
                $container.removeClass('p-field-toggled');
                $field.attr('type', $field.data('jsOriginalType') );
                $tContent.each(function(n, $t){
                    $t                              = jQuery($t);
                    $t.html($t.data('jsOriginalContent') );
                });
            }else{
                if( !$field.data('jsOriginalType') ){
                    $field.data('jsOriginalType', $field.attr('type'));
                }
                $container.addClass('p-field-toggled');
                $field.attr('type', $el.data('jsToggleType') );
                $tContent.each(function(n, $t){
                    $t                              = jQuery($t);
                    if( !$t.data('jsOriginalContent') ){
                        $t.data('jsOriginalContent', $t.html());
                    }
                    $t.html($t.data('jsToggleContent') );
                });
            }
        })
    ;
    
    //Toggle class
    $container.find('[data-js-toggle-class]')
        .off('.pToggleClass')
        .on('click.pToggleClass', function(e){
            e.preventDefault();
            var $el                                 = jQuery(this);
            if( !formsPlus.hasDataString( $el, 'jsToggleClass' ) ){
                return;
            }
            $el.closest( formsPlus.selectors.fieldWrap ).toggleClass( $el.data('jsToggleClass') );
        })
    ;


    //clickout
    $container.find('[data-js-clickout-remove-class], [data-js-clickout-add-class]')
        .off('.fpClickOut')
        .on('mousedown.fpClickOut', function(e){
            e.stopPropagation();
        })
    ;

    //check input
    $container.find('.p-check-input .input-group').find('input, select')
        .off('.fpCheckInput')
        .on('click.fpCheckInput keyup.fpCheckInput blur.fpCheckInput', function(){
            var $el                                 = jQuery(this).closest('.p-check-input').find('input.p-check-input');
            $el.prop('checked', $el.is(':checked') || !!this.value).fpTriggerChange();
        })
    ;
    //check group toggle
    $container.find('[data-js-toggle-check-group]')
        .off('.fpToggleCheckGroup')
        .on('click.fpToggleCheckGroup', function(){
            var $el                                 = jQuery(this);
            if( formsPlus.hasDataString( $el, 'jsToggleCheckGroup' ) ){
                jQuery('[data-js-check-group="' + $el.data('jsToggleCheckGroup') + '"]')
                    .filter('[type="checkbox"],[type="radio"]')
                    .prop('checked', $el.is(':checked'))
                    .fpTriggerChange()
                ;
            }
        })
    ;
    $container.find('[data-js-untoggle-check-group]')
        .off('.fpToggleCheckGroup')
        .on('click.fpUntoggleCheckGroup', function(){
            var $el                                 = jQuery(this);
            if( formsPlus.hasDataString( $el, 'jsUntoggleCheckGroup' ) ){
                jQuery('[data-js-check-group="' + $el.data('jsUntoggleCheckGroup') + '"]')
                    .filter('[type="checkbox"],[type="radio"]')
                    .prop('checked', !$el.is(':checked'))
                    .fpTriggerChange()
                ;
            }
        })
    ;
    $container.find('[data-js-check-group]')
        .off('.fpCheckGroup')
        .on('fpChange.fpCheckGroup', function(){
            var $el                                 = jQuery(this);
            if( formsPlus.hasDataString( $el, 'jsCheckGroup' ) ){
                var
                    group                           = $el.data('jsCheckGroup'),
                    $uncheck                        = jQuery([])
                ;
                if( $el.is(':checked') ){
                    $uncheck                        = $uncheck.add('[data-js-untoggle-check-group="' + group + '"]');
                    if( formsPlus.hasDataString( $el, 'jsCheckSubGroup' ) ){
                        $uncheck                    = $uncheck.add('[data-js-check-group="' + group + '"][data-js-check-sub-group!="' + $el.data('jsCheckSubGroup') + '"]');
                    }
                }else{
                    $uncheck                        = $uncheck.add('[data-js-toggle-check-group="' + group + '"]');
                }

                $uncheck
                    .filter('[type="checkbox"]')
                    .prop('checked', false)
                    .fpTriggerChange()
                ;
                
            }
        })
    ;
    //sub checkboxes
    $container.find('[data-js-sub-check]')
        .off('.fpSubCheck')
        .on('fpChange.fpSubCheck', function(){
            var $el                                 = jQuery(this);
            if( formsPlus.hasDataString( $el, 'jsSubCheck' ) && $el.is(':checked') ){
                jQuery('[data-js-check-name="' + $el.data('jsSubCheck') + '"]')
                    .filter('[type="checkbox"],[type="radio"]')
                    .prop('checked', true)
                    .fpTriggerChange()
                ;
            }
        })
    ;
    $container.find('[data-js-check-name]')
        .off('.fpCheckNameSub')
        .on({
            'fpChange.fpCheckNameSub'   : function(){
                var $el                                 = jQuery(this);
                if( formsPlus.hasDataString( $el, 'jsCheckName' ) && !$el.is(':checked')){
                    jQuery('[data-js-sub-check="' + $el.data('jsCheckName') + '"]')
                        .filter('[type="checkbox"],[type="radio"]')
                        .prop('checked', false)
                        .fpTriggerChange()
                    ;
                }
            },
            'click.fpCheckNameSub'      : function(){
                var $el                                 = jQuery(this);
                if( formsPlus.hasDataString( $el, 'jsCheckName' ) && $el.is(':checked')){
                    var $sub                            = jQuery('[data-js-sub-check="' + jQuery($el).data('jsCheckName') + '"]')
                        .filter('[type="checkbox"],[type="radio"]')
                    ;
                    if( !$sub.filter(':checked').length ){
                        $sub
                            .filter('[data-js-sub-default]')
                            .prop('checked', true)
                            .fpTriggerChange()
                        ;
                    }
                }
            }
        })
    ;
    $container.find('[data-js-input-group]')
        .off('.fpInputGroup')
        .on({
            'focus.fpInputGroup'        : function(){
                var
                    $el                             = jQuery(this),
                    $group                          = jQuery('[data-js-input-group="' + $el.data('jsInputGroup') + '"]'),
                    ind                             = $group.index($el),
                    $test                           = false
                ;
                $el.data('prevValue', $el.val());
                if( ind > 0 ){
                    for (var i = ind - 1; i >= 0; i--) {
                        $el                         = $group.eq(i);
                        if( $el.attr('maxlength') && formsPlus.toNumber($el.attr('maxlength')) > $el.val().length ){
                            $test                   = $el;
                        }else{
                            break;
                        }
                    }
                    if( $test ){
                        $test.focus();
                    }
                }
            },
            'keydown.fpInputGroup'      : function(e){
                var
                    $el                             = jQuery(this),
                    value                           = $el.val()
                ;
                if( e.which !== 8 || value ){
                    return;
                }
                var
                    $group                          = jQuery('[data-js-input-group="' + $el.data('jsInputGroup') + '"]'),
                    ind                             = $group.index($el) - 1
                ;
                $group.eq(ind).focus();
            },
            'keypress.fpInputGroup'     : function(e){
                var
                    $el                             = jQuery(this),
                    value                           = $el.val()
                ;

                if( !($el.attr('maxlength') && formsPlus.toNumber($el.attr('maxlength')) === value.length && e.charCode !== 0) ){
                    return;
                }
                var
                    character                       = String.fromCharCode(e.charCode),
                    $group                          = jQuery('[data-js-input-group="' + $el.data('jsInputGroup') + '"]'),
                    pos                             = $el.getCursorPosition(),
                    ind                             = $group.index($el) + 1
                ;
                if(pos === formsPlus.toNumber($el.attr('maxlength'))){
                    if( ind >= $group.length ){
                        return;
                    }
                    $el                             = $group.eq(ind).focus();
                    pos                             = 0;
                    value                           = $el.val();
                    if( value === '' ){
                        $el.val(character);
                        return;
                    }
                }
                $el.val(value.slice(0, pos) + character + value.slice(pos + 1));
                $el[0].setSelectionRange(pos+1,pos+1);
            }
        })
    ;

    formsPlus.inputReg                              = {
        number                                      : new RegExp("^(?:\\-)?([0-9]*)(?:\\.[0-9]*)?$"),
        letters                                     : new RegExp("^[a-zA-Z]?$")
    };

    $container.find('input[data-js-input-type]')
        .off('.fpInputType')
        .each(function(i, el){
            var $el                                 = jQuery(el),
                type                                = $el.data('jsInputType')
            ;
            if( formsPlus.inputReg[type] ){
                $el.data('jsInputType_reg', formsPlus.inputReg[type]);
                $el.on({
                    'keypress.fpInputType'          : function(e){
                        var $_el                    = jQuery(this),
                            reg                     = $el.data('jsInputType_reg')
                        ;

                        if( reg && e.charCode ){
                            var
                                value                   = $_el.val(),
                                character               = String.fromCharCode(e.charCode),
                                pos                     = $_el.getCursorPosition()
                            ;
                            if( character && !reg.test(value.slice(0, pos) + character + value.slice(pos + 1 )) ){
                                return false;
                            }
                        }
                    }
                });
            }
        })
    ;


    jQuery('body')
        .off('.fpClickOut')
        .on('mousedown', function(){
            jQuery('[data-js-clickout-remove-class], [data-js-clickout-add-class]').each(function(i, $el){
                $el                                 = jQuery($el);
                if( formsPlus.hasDataString( $el, 'jsClickoutRemoveClass' ) ){
                    $el.closest( formsPlus.selectors.fieldWrap ).removeClass( $el.data('jsClickoutRemoveClass') );
                }
                if( formsPlus.hasDataString( $el, 'jsClickoutAddClass' ) ){
                    $el.closest( formsPlus.selectors.fieldWrap ).addClass( $el.data('jsClickoutAddClass') );
                }
            });
        })
    ;
});