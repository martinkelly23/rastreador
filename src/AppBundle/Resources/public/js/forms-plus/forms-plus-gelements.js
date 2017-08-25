/* global formsPlus, google */

if( typeof(google) !== 'undefined' ){
    jQuery.fn.fpGAutocomplete                       = function(opts){
        if( !formsPlus.pluginCheck(this, "Forms Plus: autocomplete - Nothing selected.") ){
            return this;
        }
        jQuery(this).each(function(i, el){
            var $el                                 = jQuery(el),
                options                             = {},
                tmp, j
            ;
            
            jQuery.extend(options, opts || {}, formsPlus.getDataOptions( $el, 'gautocomplete', ['types', 'bounds', 'componentRestrictions'] ));
            if( options.bounds && typeof(options.bounds) === 'string' ){
                var isSet                           = false,
                    getLatLng                       = function(lat, lng){
                        lat                     = formsPlus.toNumber(jQuery.trim(lat));
                        lng                     = formsPlus.toNumber(jQuery.trim(lng));
                        if( lat !== null && lng !== null ){
                            return new google.maps.LatLng(lat, lng);
                        }
                        return false;
                    }
                ;
                tmp                                 = options.bounds.split(';');
                if( tmp.length === 2 ){
                    var coords                      = tmp[0].split(','),
                        pos1, pos2;
                    if( coords.length === 2 ){
                        pos1                        = getLatLng(coords[0], coords[1]);
                        if( pos1 ){
                            coords                  = tmp[1].split(',');
                            if( coords.length === 1 ){
                                pos2                = formsPlus.toNumber(coords[0]);
                                if( pos2 !== null && pos2 >= 0 ){
                                    options.bounds  = (new google.maps.Circle({
                                        center: pos1,
                                        radius: pos2
                                    })).getBounds();
                                    isSet           = true;
                                }
                            }else if( coords.length === 2 ){
                                pos2                = getLatLng(coords[0], coords[1]);
                                if( pos2 ){
                                    options.bounds  = new google.maps.LatLngBounds(pos1, pos2);
                                    isSet           = true;
                                }
                            }
                        }
                    }
                }

                if( !isSet ){
                    delete options.bounds;
                }
            }
            if( options.types && typeof(options.types) === 'string' ){
                tmp                                 = options.types.split(',');
                var list                            = [];
                for(j = 0; j < tmp.length; j++) {
                    list.push( jQuery.trim(tmp[j]) );
                }
                if( list.length ){
                    options.types                   = list;
                }else{
                    delete options.types;
                }
            }
            if( options.componentRestrictions ){
                if( typeof(options.componentRestrictions) === 'string' ){
                    options.componentRestrictions  = {country: options.componentRestrictions};
                }else{
                    delete options.componentRestrictions;
                }
            }

            $el.data('fpGAutocomplete', new google.maps.places.Autocomplete(el, options));
        });
        return this;
    };
    // Add init function
    formsPlus.initFn.push(function($container){
        $container.find('[data-js-gautocomplete]:not([type="hidden"])').fpGAutocomplete();
    });
}