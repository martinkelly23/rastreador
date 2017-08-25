/* global formsPlus */
jQuery.extend(formsPlus, {
    /*
        @arguments
            str                                             - string to make calculations, can contain:
                by default it's simple calculations:
                    property1 + property2
                    quantity + 20
                    price + '$'
                    (property1 + property2) * 50

        @return function                                    - function that will return calculated value or null if any error
    */
    createCalcFunction                              : function(str){
        str                                         = str
            .replace(/([a-zA-Z][a-zA-Z0-9]*)*('[^']*')*("[^"]*")*/g, function(test, key) {
                if( key ){
                    return 'o.' + key;
                }else{
                    return test;
                }
            })
        ;
        try{
            /*jslint evil: true */
            var func                                    = new Function("o", "return " + str + ";");
            return function(o){
                try{
                    return func(o);
                }catch(e){
                    formsPlus.log(e);
                    return null;
                }
            };
        }catch(e){
            formsPlus.log(e);
            return function(){
                return null;
            };
        }
    },
    /*
        @arguments
            str                                                             - string to parce key object, can contain:
                <name>                                                      - force string
                <name>*                                                     - required value
                #<name>                                                     - force number
                #<precision>#<name>                                         - force float or integer(precision=0)
                @<name>                                                     - force date
                <name params>:<calculation>:<calculation>                   - calculate value
                :<calculation>                                              - output calculated value
                
                calculation - string with format
                    &<property>                                             - set to value
                    @<date format>                                          - parse date
                    [<min>,<max>]                                           - in range
                        [5]                                                 - greather or equal 5
                        [,10]                                               - less or equal 5
                        [5,10]                                              - in range 5..10
                    by default it's simple calculations, check 'createCalcFunction' method
            key                                                             - key object to extend

        @return
            {
                name                                                        - key name, string or false
                isNumber                                                    - convert tu number
                isDate                                                      - convert to date
                dateFormat                                                  - format of date
                func                                                        - function used when need some calculations
                inRange                                                     - [min, max] range array
            }
    */
    buildValueKey                                   : function(str, key){
        key                                         = jQuery.extend({}, key);
        var
            name                                    = str.split(':'),
            calc                                    = name.length > 1 ? name.slice(1) : false
        ;
        name                                        = jQuery.trim(name[0]);
        if( name.length ){
            switch( name.charAt(0) ){
                case '#'                                :
                    key.isNumber                        = true;
                    key.isDate                          = false;
                    var precision                       = false;
                    name                                = name
                        .replace(/#(?:([0-9]+))?(?:(\,))?#/g, function(_, prec, isCS) {
                            precision                   = formsPlus.toNumber(prec);
                            if( isCS ){
                                key.isCS                = true;
                            }
                            return "";
                        })
                    ;
                    if( precision === false ){
                        name                            = name.slice(1);
                    }
                    key.precision                       = precision;
                    break;
                case '@'                                :
                    key.isNumber                        = false;
                    key.isDate                          = true;
                    name                                = name.slice(1);
                    break;
            }
            if( name.charAt( name.length - 1 ) === '*' ){
                key.required                            = true;
                name                                    = name.slice(0, name.length - 1);
            }
        }
        key.name                                        = key.name || name || false;
        key.id                                          = key.name || '__' + formsPlus.randomId();
        if( calc ){
            for (var i = 0; i < calc.length; i++) {
                switch( calc[i].charAt(0) ){
                    case '['                            :
                        calc[i]                         = calc[i].slice(1, calc.length - 2).split(',');
                        var
                            min                         = formsPlus.toNumber(calc[i][0]),
                            max                         = (calc[i].length > 1 ? formsPlus.toNumber(calc[i][1]) : null)
                        ;
                        if( min !== null || max !== null ){
                            key.inRange                     = [min, max];
                        }
                        break;
                    case '&'                            :
                        key.prop                        = calc[i].slice(1);
                        break;
                    case '@'                            :
                        key.dateFormat                  = calc[i].slice(1);
                        break;
                    default                             :
                        if( key.isDate ){
                            //TODO date actions
                        }else{
                            key.func                    = formsPlus.createCalcFunction( calc[i] );
                        }
                        break;
                }
            }
        }
        return key;
    },
    getKeyValue                                     : function(key, value, obj){
        if( typeof(value) === 'undefined' ){
            //prefer property over user function/calculations
            if( key.prop && typeof(obj[key.prop]) !== 'undefined' ){
                value                               = obj[key.prop];
            }else if( key.func ){
                value                               = obj ? key.func(obj) : null;
            }
        }
        if( key.inRange ){
            value                                   = formsPlus.inRange(value, key.inRange[0], key.inRange[1]);
            if( !key.isNumber ){
                value                               = value === null ? '' : value + '';
            }
        }
        var str                                     = value + '';
        if( key.dateFormat ){
            value                                   = formsPlus.toDate(value, key.dateFormat);
            if( !key.isDate && value ){
                value = str                         = value.format( key.dateFormat || formsPlus.dateFormat );
            }
        }
        if( typeof(value) !== 'undefined' ){
            if( key.isDate ){
                value                               = formsPlus.toDate(value, key.dateFormat);
                str                                 = value ? value.format( key.dateFormat || formsPlus.dateFormat ) : '';
            }else if( key.isNumber ){
                value                               = formsPlus.toNumber(value);
                if( value ){
                    if( key.precision !== false ){
                        //because toFixed returns string - reparse numeric value
                        str                         = value.toFixed(key.precision || 0);
                        value                       = Number(str);
                    }
                    if( key.isCS ){
                        str                         = formsPlus.formatNumber(str);
                    }
                }
            }
        }
        if( key.required && !value ){
            return null;
        }
        return {
            value   : value,
            str     : str ? str + '' : ''
        };
    },
    getRegObj                                       : function(template) {
        template                                    = (template || '') + '';
        var
            ret                                     = {
                originalTemplate                    : template
            },
            keys = ret.keys                         = []
        ;
        ret.setTemplate                             = template
            .replace(/{([^}]+)}/g, function(_, key) {
                key                                 = formsPlus.buildValueKey(key);
                keys.push(key);
                return "{" + key.id + "}";
            })
        ;
        ret.getTemplate                             = new RegExp(
            "^" +
            template
                .replace(/[\-\[\]\/\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")
                .replace(/{([^}]+)}/g, "(.*)") +
            "$", ""
        );
        return ret;
    },
    fromRegObj                                      : function(value, regObj, ret) {
        ret                                         = jQuery.extend({}, ret);
        value                                       = value ? value.match(regObj.getTemplate) : false;
        if( value && value.length ){
            for (var i = 0; i < value.length; i++) {
                if( regObj.keys[i] && regObj.keys[i].id ){
                    ret[regObj.keys[i].id]          = value[i + 1];
                }
            }
        }
        for (var j = 0; j < regObj.keys.length; j++) {
            var tmp                                 = formsPlus.getKeyValue(regObj.keys[j], ret[regObj.keys[j].id], ret);
            if( !tmp ){
                ret['__failed']                     = true;
                continue;
            }else{
                ret[regObj.keys[j].id]              = tmp.value;
                ret[regObj.keys[j].id + '__string'] = tmp.str;
            }
        }
        return ret;
    },
    getElementRegObj                                : function($el, formatName, cacheName){
        var
            format                                  = $el.data(formatName),
            regObj                                  = cacheName ? $el.data(cacheName) : false
        ;
        if( !regObj && format ){
            regObj                                  = formsPlus.getRegObj( format );
            if( cacheName ){
                $el.data(cacheName, regObj);
            }
        }
        return regObj;
    },
    getValue                                        : function($el, asObject, check){
        $el                                         = jQuery($el);
        if( check && (($el.is('[type="radio"], [type="checkbox"]') && !$el.is(':checked')) || ($el.is('option') && !$el.is(':selected')) || $el.is('.p-calc-h-ignore:hidden')) ){
            return asObject ? {value: null} : '';
        }
        var
            value                                   = $el.is('input, textarea, select') ? $el.val() : $el.text(),
            min                                     = formsPlus.toNumber( formsPlus.getAttribute($el, 'min') ),
            max                                     = formsPlus.toNumber( formsPlus.getAttribute($el, 'max') )
        ;


        if( !asObject ){
            return formsPlus.inRange(value , min, max);
        }

        var
            cached                                  = $el.data('jsValueCache'),
            getRegObj                               = formsPlus.getElementRegObj($el, 'jsGetValueExtra', 'jsGetValueRegExp')
        ;
        //if value wasn't changed return cached
        if( cached && cached.value === value ){
            if( !cached.hasExtra && getRegObj ){
                cached.obj                          = formsPlus.fromRegObj(false, getRegObj, cached.obj);
                cached.hasExtra                     = true;
                $el.data('jsValueCache', cached);
            }
            return cached.obj;
        }

        var
            regObj                                  = formsPlus.getElementRegObj($el, 'jsValueFormat', 'jsValueRegExp'),
            obj                                     = {
                value                               : value
            }
        ;
        if( regObj ){
            obj                                     = formsPlus.fromRegObj(value, regObj);
            if( typeof(obj.value) === 'undefined' ){
                obj.value                           = value;
            }
        }
        obj.value                                   = formsPlus.inRange( obj.value, min, max);

        if( $el.data("DateTimePicker") ){
            obj.date                                = $el.data("DateTimePicker").date();
        }

        if( getRegObj ){
            obj                                     = formsPlus.fromRegObj(false, getRegObj, obj);
        }
        $el.data('jsValueCache', {
            value                                   : value,
            obj                                     : obj
        });
        
        return obj;
    },
    setValue                                        : function($el, value){
        $el                                         = jQuery($el);
        var
            min                                     = formsPlus.toNumber( formsPlus.getAttribute($el, 'min') ),
            max                                     = formsPlus.toNumber( formsPlus.getAttribute($el, 'max') ),
            sValue                                  = '',
            obj                                     = false
        ;
        if( typeof(value) === 'object'){
            var
                regObj                              = formsPlus.getElementRegObj($el, 'jsValueFormat', 'jsValueRegExp'),
                setRegObj                           = formsPlus.getElementRegObj($el, 'jsSetValueExtra', 'jsSetValueRegExp')
            ;
            obj                                     = jQuery.extend({}, value);
            if( regObj ){
                if( setRegObj ){
                    obj                             = formsPlus.fromRegObj(false, setRegObj, obj);
                }
                obj                                 = formsPlus.fromRegObj(false, regObj, obj);

                if( obj['__failed'] ){
                    sValue                          = '';
                }else{
                    sValue                          = regObj.setTemplate;
                    if( obj.value ){
                        obj.value                   = formsPlus.inRange(obj.value, min, max);
                    }
                    sValue                          = sValue.replace(/{(\w+)}/g, function(_, key) {
                        if( typeof(obj[key + '__string']) !== 'undefined' ){
                            return obj[key + '__string'];
                        }
                        if( typeof(obj[key]) !== 'undefined' ){
                            return obj[key];
                        }
                        return '';
                    });
                }
                
                $el.data('jsValueCache', {
                    value                                   : sValue || $el.data('jsEmptyValue') || '',
                    obj                                     : obj
                });
            }else{
                sValue                              = formsPlus.inRange(value.value , min, max);
            }
        }else{
            sValue                                  = formsPlus.inRange(value, min, max);
        }
        sValue                                      = jQuery.trim(sValue);
        if( $el.is('[data-js-empty-value-class]') ){
            var
                classes                             = $el.data('jsEmptyValueClass').split(' '),
                addClasses                          = [],
                removeClasses                       = [],
                checkValue                          = $el.is('[data-js-just-calculations]') && !$el.data('jsValueRegExp') && !obj['__failed'] ? 1 : sValue
            ;
            for (var i = 0; i < classes.length; i++) {
                classes[i]                          = classes[i].split(':');
                var add                             = false;
                if( classes[i].length > 1 ){
                    for (var j = 1; j < classes[i].length - 1; j++) {
                        if(!obj || !obj[classes[i][j]]){
                            add                     = true;
                            break;
                        }
                    }
                    classes[i]                      = classes[i][ classes[i].length - 1 ];
                }else{
                    if(!checkValue){
                        add                         = true;
                    }
                    classes[i]                      = classes[i][0];
                }
                if( add ){
                    addClasses.push(classes[i]);
                }else{
                    removeClasses.push(classes[i]);
                }
            }
            if( addClasses.length ){
                $el.addClass( addClasses.join(' ') );
            }
            if( removeClasses.length ){
                $el.removeClass( removeClasses.join(' ') );
            }
        }
        if( !sValue && $el.data('jsEmptyValue') ){
            sValue                                  = $el.data('jsEmptyValue');
        }
        sValue                                      += ''; // to be sure it's string

        if( $el.is('[data-js-just-calculations]') ){
            return $el;
        }
        if( $el.is('input, textarea, select') ){
            if( sValue !== $el.val() ){
                $el.val( sValue );
            }
            if( $el.is('select') && !$el.find(':selected').length && $el.find('[data-js-value-default]').length ){
                $el.val( $el.find('[data-js-value-default]').val() );
            }
        }else{
            if( sValue !== $el.text() ){
                $el.text( sValue );
            }
        }
        $el.trigger('fpSetValue');
        return $el;
    }
});

jQuery.fn.fpGetValue                                = function(asObject, check){
    if( !formsPlus.pluginCheck(this, "Forms Plus: getValue - Nothing selected.") ){
        return;
    }
    return formsPlus.getValue(this[0], asObject, check);
};

jQuery.fn.fpSetValue                                = function(value){
    if( !formsPlus.pluginCheck(this, "Forms Plus: setValue - Nothing selected.") ){
        return this;
    }
    jQuery.each(this, function(i, $el){
        formsPlus.setValue($el, value);
    });
    return this;
};

jQuery.fn.fpFromGroupValues                         = function(opts){
    if( !formsPlus.pluginCheck(this, "Forms Plus: from group values - Nothing selected.") ){
        return this;
    }
    jQuery.each(this, function(i, $el){
        $el                                         = jQuery($el);
        var options                                 = opts || $el.data('jsGroupValues');
        if( !options ){
            return;
        }

        if( typeof(options) === 'string' ){
            var cached                              = $el.data('jsCachedFGVOptions') || {};
            if( cached[options] ){
                options                             = cached[options];
            }else{
                var
                    params,
                    name                            = options,
                    groups                          = options.split(';')
                ;
                options                             = {};
                cached[name]                        = options;
                $el.data('jsCachedFGVOptions', cached);

                for (var j = 0; j < groups.length; j++) {
                    params                          = groups[j].split(':');
                    if( params.length < 2 ){
                        continue;
                    }
                    name                            = jQuery.trim(params[0]);
                    options[name]                   = [];
                    params                          = params[1].split(',');
                    for (var p = 0; p < params.length; p++) {
                        if( jQuery.trim( params[p] ).length > 0 ){
                            options[name].push( formsPlus.buildValueKey(params[p]) );
                        }
                    }
                }
            }
        }

        var obj                                     = {};
        jQuery.each(options, function(name, props){
            jQuery('[data-js-value-group="' + name + '"]').each(function(j, $rel){
                var value                           = jQuery($rel).fpGetValue(true, true);
                for (var p = 0; p < props.length; p++) {
                    if( value[ props[p].name ] ){
                        if( props[p].isNumber ){
                            obj[ props[p].name ]    = formsPlus.toNumber( typeof(obj[ props[p].name ]) === 'number' ?
                                obj[ props[p].name ] + value[ props[p].name ]
                                : value[ props[p].name ]
                            ) || 0;
                        }else{
                            obj[ props[p].name ]    = value[ props[p].name ];
                        }
                    }
                }
            });
            for (var p = 0; p < props.length; p++){
                if( !obj[ props[p].name ]){
                    if( props[p].required ){
                        obj                         = {'__failed': true};
                        continue;
                    }
                    if( !props[p].isDate ){
                        obj[ props[p].name ]        = props[p].isNumber ? 0 : '';
                    }
                }
            }
        });

        formsPlus.setValue($el, obj);
    });

    return this;
};

// Add init function
formsPlus.initFn.push(function($container){
    //watch value
    jQuery('body').find('[data-js-watch-value]').each(function(i, $el){
        $el                                         = jQuery($el);
        var groups                                  = $el.data('jsGroupValues').split(';');

        jQuery.each(groups, function(ing, group){
            group                                   = group.split(':')[0];
            $container.find('[data-js-value-group="' + group + '"]').each(function(j, $rel){
                $rel                                = jQuery($rel);
                $rel
                    .data('jsValueWatchers', ($rel.data('jsValueWatchers') || jQuery([])).add( $el ) )
                    .off('.pWatchedValue')
                    .on({
                        'fpSetValue.pWatchedValue'                  : function(){
                            jQuery(this).data('jsValueWatchers').fpFromGroupValues();
                        },
                        'destroyed.pWatchedValue'                   : function(){
                            var $els                                = $rel.data('jsValueWatchers');
                            jQuery(this).off('.pWatchedValue');
                            setTimeout(function(){
                                $els.fpFromGroupValues();
                            }, 0);
                        }
                    })
                ;
                var func                            = function(){
                    $rel.data('jsValueWatchers').fpFromGroupValues();
                };
                $rel.on('fpChange.pWatchedValue',{prev:true}, func);
            });

            $el.off('.pWatchValue').on('destroyed.pWatchValue', function(){
                jQuery('[data-js-value-group="' + groups[i] + '"]').each(function(j, $rel){
                    $rel                                            = jQuery($rel);
                    $rel.data('jsValueWatchers', ($rel.data('jsValueWatchers') || jQuery([])).not( $el ) );
                });
            });
        });
        $el.fpFromGroupValues();
    });
});