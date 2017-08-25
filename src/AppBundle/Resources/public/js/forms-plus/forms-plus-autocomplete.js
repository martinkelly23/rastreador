/* global formsPlus */

// Slider
if( jQuery().autocomplete ){
    var optsSel                                     = '.fp-au-option';
    jQuery.fn.fpAutocomplete                        = function(opts){
        if( !formsPlus.pluginCheck(this, "Forms Plus: autocomplete - Nothing selected.") ){
            return this;
        }
        jQuery(this).each(function(i, el){
            var $el                                 = jQuery(el),
                source                              = $el.data('jsAutocomplete'),
                $rootEl, $els
            ;
            if( source && typeof(source) === 'string' ){
                switch( source.charAt(0) ){
                    case '!':
                        source                      = source.slice(1).split(',');
                        break;
                    case '#':
                        $rootEl                     = jQuery(source);
                        break;
                    case '*':
                        $rootEl                     = formsPlus.findBlock(source.slice(1));
                        break;
                    case '@':
                        source                      = source.slice(1);
                }

            }else if( typeof(source) !== 'object' ){
                $rootEl                             = $el.closest(formsPlus.selectors.fieldWrap);
            }
            if( $rootEl ){
                source                              = [];
                $els                                = $rootEl.find(optsSel);
                if( $els.length ){
                    $els.each( function(i, opt){
                        var $opt                    = jQuery(opt);
                        source.push({
                            label                   : $opt.data('label') || $opt.data('value'),
                            value                   : $opt.data('value')
                        });
                    });
                }
            }
            var options                             = jQuery.extend({
                appendTo                            : $el.closest(formsPlus.selectors.fieldWrap),
                source                              : source
            }, formsPlus.getDataOptions( $el, 'autocomplete', ['autoFocus', 'delay', 'disabled', 'minLength', 'position'] ), opts || {});
            $el.autocomplete(options);
        });
        return this;
    };
    // Add init function
    formsPlus.initFn.push(function($container){
        $container.find('[data-js-autocomplete]').fpAutocomplete();
    });
}