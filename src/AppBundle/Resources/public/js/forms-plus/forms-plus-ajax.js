/* global formsPlus */

if( jQuery().ajaxSubmit() ){
    var
        disableButtonsCss                           = 'p-ajax-disabled',
        getAjaxOptions                              = function($el, opts){
            var
                url                                 = $el.data('jsAjaxForm'),
                options                             = {
                    dataType                        : 'json',
                    url                             : url && typeof(url) === 'string' ? url : $el.attr('action')
                }
            ;
            return jQuery.extend(
                options,
                formsPlus.getDataOptions($el, 'fpAjax', ['clearForm', 'data', 'dataType', 'forceSync', 'iframe', 'iframeSrc', 'iframeTarget', 'replaceTarget', 'resetForm', 'semantic']),
                opts
            );
        },
        toggleAjaxBlocks                            = function($el, action){
            if( formsPlus.toggleBlock ){
                var dataName                        = 'jsAjax' + action.charAt(0).toUpperCase() + action.slice(1);
                if( $el.data(dataName + 'ShowBlock') ){
                    formsPlus.toggleBlock($el, $el.data(dataName + 'ShowBlock'), true);
                }
                if( $el.data(dataName + 'HideBlock') ){
                    formsPlus.toggleBlock($el, $el.data(dataName + 'HideBlock'), false);
                }
            }
        },
        addAjaxDataContent                          = function($form, data, action){
            if( formsPlus.findBlock && typeof(data) === 'object' && data.content ){
                var block                           = formsPlus.findBlock( data.block || $form.data('jsAjax' + action.charAt(0).toUpperCase() + action.slice(1) + 'ContentBlock') );
                if( block.length ){
                    block
                        .html(data.content)
                        .fpInit()
                        .show()
                    ; 
                }
            }
        },
        ajaxSuccessFn                               = function($form, jqXHR, status, data ){
            $form.trigger('fpAjaxDone', [jqXHR, status, data]);
            toggleAjaxBlocks($form, 'success');
            addAjaxDataContent($form, data.responseJSON, 'success');
        },
        ajaxFailFn                                  = function($form, jqXHR, status, data){
            $form.trigger('fpAjaxFail', [jqXHR, status, data]);
            toggleAjaxBlocks($form, 'fail');
            addAjaxDataContent($form, status === 'fpAjaxFail' ? data.errorData : {
                content : '<h4>Error - ' + status + '</h4>'
            }, 'fail');
        },
        bindAfterActions                            = function($form, jqXHR){
            $form.find('.' + formsPlus.css.removeAfterSendCss).remove();

            toggleAjaxBlocks( $form, 'before' );

            $form.find('.' + disableButtonsCss).prop('disabled', true);
            var dfd                                 = jQuery.Deferred();

            $form.off('fpGeneralCheck.fpAjax').on('fpGeneralCheck.fpAjax', function(e, dfds){
                dfds.push(dfd);
            });

            //Trigger events, if need some actions done use $<form>.on(<eventname>).
            jqXHR
                .done(function(data, status, xhr){
                    if( data.errorData ){
                        ajaxFailFn($form, xhr, 'fpAjaxFail', data);
                        dfd.reject(data.errorData);
                        return;
                    }
                    ajaxSuccessFn($form, data, status, xhr);
                    dfd.resolve('ajax');
                })
                .fail(function(xhr, status, data){
                    ajaxFailFn($form, data, status, xhr);
                    dfd.reject('ajax');
                })
                .always(function(){
                    $form.trigger('fpAjaxAlways', arguments);
                    toggleAjaxBlocks( $form, 'always' );
                    $form.find('.' + disableButtonsCss).prop('disabled', false);
                    dfd = jqXHR = null;
                })
            ;
        }
    ;

    /* sends just first form */
    jQuery.fn.fpAjaxSubmit                          = function(opts){
        if( !formsPlus.pluginCheck(this, "Forms Plus: ajaxSubmit - Nothing selected.") ){
            return this;
        }
        var $el                                     = jQuery(this).eq(0);
        if( !$el.is( 'form' ) ){
            $el                                     = $el.closest('form');
        }
        if( formsPlus.appendCaptchaHash ){
            formsPlus.appendCaptchaHash( $el );
        }

        $el.ajaxSubmit( getAjaxOptions($el, opts) );
        bindAfterActions($el, $el.data('jqxhr'));
        return this;
    };

    /* sends ajax on submit */
    jQuery.fn.fpAjaxForm                            = function(opts){
        if( !formsPlus.pluginCheck(this, "Forms Plus: ajaxForm - Nothing selected.") ){
            return this;
        }
        jQuery.each(this, function(i, $el){
            $el                                     = jQuery($el);
            jQuery($el)
                .ajaxForm( getAjaxOptions($el, opts) )
                .off('.fpAjaxForm')
                .on({
                    'form-pre-serialize.fpAjaxForm'     : function(){
                        if( formsPlus.appendCaptchaHash ){
                            formsPlus.appendCaptchaHash( jQuery(this) );
                        }
                    },
                    'form-submit-notify.fpAjaxForm'     : function(){
                        var $t          = jQuery(this);
                        bindAfterActions($t, $t.data('jqxhr'));
                    }
                })
            ;
        });
        return this;
    };

    // Add init function
    formsPlus.initFn.push(function($container){
        $container.find('[data-js-ajax-form]:not([data-js-validate])').fpAjaxForm();
    });
}