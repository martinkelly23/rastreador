/* global formsPlus */

formsPlus.css.template                              = 'js-template-block';
formsPlus.selectors.template                        = '.' + formsPlus.css.template;
formsPlus.selectors.block                           = '.p-block';
formsPlus.selectors.addBlockClosest                 = formsPlus.selectors.block + ', ' + formsPlus.selectors.formGroup;
formsPlus.selectors.removeBlockClosest              = '.p-block, ' + formsPlus.selectors.fieldWrap;
formsPlus.allowedPositions                          = ['append', 'before', 'after', 'prepend'];
formsPlus.createFromTemplate                        = function($parent, position, $template, $creator, groupName, max){
    //Don't add-block if no template found or it reached max number of copies
    if( max && groupName && jQuery('[data-js-block-group="' + groupName + '"]').length >= max ){
        return jQuery([]);
    }

    if( jQuery.inArray(position, formsPlus.allowedPositions) < 0 ){
        position                                    = formsPlus.allowedPositions[0];
    }

    var $block                                      = jQuery($template.html());

    $parent[position]( $block );
    $block                                          = $block
        .filter('*')
        .data({
            'jsCreator'                             : $creator
        })
        .addClass(formsPlus.css.template)
    ;
    if( groupName ){
        $block.attr('data-js-block-group', groupName);
    }
    $block.trigger('fpCreateBlock');
    return $block;
};
formsPlus.removeBlock                               = function($block){
    if( $block.data('jsCreator') && $block.data('jsBlockGroup') ){
        //Check if can remove block
        var
            $creator                                = $block.data('jsCreator'),
            min                                     = $creator.data('jsAddBlockMin') || false,
            groupName                               = $block.data('jsBlockGroup')
        ;
        if( min && jQuery('[data-js-block-group="' + groupName + '"]').length <= min ){
            return;
        }
    }
    $block.trigger('fpRemoveBlock').remove();
};
formsPlus.toggleBlockRelatedStatus                   = function($block, state){
    if( !($block.length || $block.data('jsBlock')) ){
        return $block;
    }
    var
        blockName                                   = $block.data('jsBlock'),
        dataAttrs                                   = [
            'data-js-related-block',
            'data-js-show-block',
            'data-js-hide-block',
            'data-js-toggle-block'
        ],
        selectors                                   = ':fp-has-attr-content("' + blockName + '",' + dataAttrs.join(',') + ')',
        $els                                        = jQuery( '[' + dataAttrs.join('],[') + ']' ).filter(selectors),
        $radios                                     = $els.filter('[type="radio"]'),
        $checked                                    = jQuery([])
    ;
    state                                           = typeof(state) === 'boolean' ? state : $block.is(':hidden');
    $els.each(function(i, $rBlock){
        $rBlock                                     = jQuery($rBlock);
        var
            shownClass                              = $rBlock.data('jsRelatedShownClass'),
            hiddenClass                             = $rBlock.data('jsRelatedHiddenClass'),
            toggledClass                            = $rBlock.data('jsRelatedToggledClass')
        ;
        if( toggledClass ){
            $rBlock.toggleClass(toggledClass, state);
        }
        if( shownClass ){
            $rBlock.toggleClass(shownClass, state);
        }
        if( hiddenClass ){
            $rBlock.toggleClass(hiddenClass, !state);
        }
        if( $rBlock.is('option, [type="checkbox"], [type="radio"]') && !$rBlock.is('[data-js-block-no-check]') ){
            if( $checked.filter($rBlock).length ){
                return;
            }
            var
                prop                                = $rBlock.is('option') ? 'selected' : 'checked',
                value                               = formsPlus.hasAttrContent($rBlock, blockName, ['data-js-hide-block']) ? !state : state
            ;
            if( $rBlock.prop( prop ) !== value ){
                if($rBlock.is('[type="radio"]')){
                    var $related                        = $rBlock.closest('form, body').find( $radios ).filter('[name="' + $rBlock.attr('name') +'"]');
                    $checked                            = $checked.add($related);
                    if( $related.length > 1 ){
                        var
                            $hRel                       = $related.filter(':fp-has-attr-content("' + blockName + '",data-js-hide-block)'),
                            $sRel                       = $related.filter(':fp-has-attr-content("' + blockName + '",data-js-show-block)')
                        ;
                        if((
                                state && ( $hRel.not(':checked').length || $sRel.filter(':checked').length )
                            ) || (
                                !state && ( $hRel.filter(':checked').length || $sRel.not(':checked').length )
                            )
                        ){
                            return;
                        }
                    }
                }
                $rBlock.prop( prop, value).fpTriggerChange();
            }
        }
    });
};
formsPlus.showBlock                                 = function($block){
    $block.show( $block.data('jsShowDuration') || $block.data('jsAnimationDuration') || 0 );
    formsPlus.toggleBlockRelatedStatus($block, true);
    $block.trigger('fpBlockShow');
    return $block;
};
formsPlus.hideBlock                                 = function($block){
    $block.hide( $block.data('jsHideDuration') || $block.data('jsAnimationDuration') || 0 );
    formsPlus.toggleBlockRelatedStatus($block, false);
    $block.trigger('fpBlockHide');
    return $block;
};
formsPlus.findBlock                                 = function(blockName){
    if( !blockName ){
        return jQuery([]);
    }
    var blocks                                      = blockName.split(';');
    if( blocks.length > 1 ){
        //if more than 1 block - run toggle for each block
        var
            $block,
            $blocks                                 = jQuery([])
        ;
        for (var i = 0; i < blocks.length; i++) {
            $block                                  = formsPlus.findBlock(blocks[i]);
            if( $block ){
                $blocks                             = $blocks.add( $block );
            }
        }
        return $blocks;
    }
    blockName                                       = blockName.split(':')[0];
    return jQuery('[data-js-block="' + blockName + '"]').eq(0);
};
formsPlus.toggleBlock                               = function($el, options, state){
    var $block;
    if( typeof(options) === 'string' ){
        var blocks                                  = options.split(';');
        if( blocks.length > 1 ){
            //if more than 1 block - run toggle for each block
            var $blocks                             = jQuery([]);
            for (var i = 0; i < blocks.length; i++) {
                $block                              = formsPlus.toggleBlock($el, blocks[i], state);
                if( $block ){
                    $blocks                         = $blocks.add( $block );
                }
            }
            return $blocks.length ? $blocks : false;
        }
        options                                     = options.split(':');
        options.blockName                           = options[0];
        options.templateName                        = options.length > 0 ? options[1] : false;
    }
    if( !options || !options.blockName ){
        return false;
    }

    $block                                          = jQuery('[data-js-block="' + options.blockName + '"]').eq(0);
    state                                           = typeof(state) === 'boolean' ? state : !$block.is(':visible');

    if($el.is('[type="radio"]')){
        var $related                        = $el.closest('form, body').find('[type="radio"][name="' + $el.attr('name') +'"]').not($el);
        if( $related.length > 0 ){
            var
                $hRel                       = $related.filter(':checked').filter(':fp-has-attr-content("' + options.blockName + '",data-js-hide-block)'),
                $sRel                       = $related.filter(':checked').filter(':fp-has-attr-content("' + options.blockName + '",data-js-show-block)')
            ;
            if((
                    !state && $sRel.length && formsPlus.hasAttrContent($el, options.blockName, ['data-js-show-block'])
                ) || (
                    state && $hRel.length && formsPlus.hasAttrContent($el, options.blockName, ['data-js-hide-block'])
                )
            ){
                return $block.length ? $block : false;
            }
        }
    }

    if( state ){
        if( !$block.is(':visible') ){
            if( options.templateName ){
                var
                    position                        = $el.data('jsInsertPosition') || options.position || 'append',
                    $template                       = jQuery('[data-js-template="' + options.templateName + '"]'),
                    $parent                         = formsPlus.find($el, formsPlus.selectors.block, 'closest')
                ;
                if( !$template.length ){
                    return;
                }
                $block                              = formsPlus.createFromTemplate($parent, position, $template, $el).fpInit();
                $block.attr('data-js-block', options.blockName);
            }

            if( $block.length ){
                formsPlus.showBlock( $block );

                if( $block.data('jsToggleGroup') ){
                    jQuery('[data-js-toggle-group="' + $block.data('jsToggleGroup') + '"]:visible')
                        .not($block)
                        .each(function(i, $hideBlock){
                            $hideBlock                  = jQuery($hideBlock);
                            if( $hideBlock.is( formsPlus.selectors.template ) ){
                                formsPlus.toggleBlockRelatedStatus($hideBlock, false);
                                formsPlus.removeBlock( $hideBlock );
                            }else{
                                formsPlus.hideBlock( $hideBlock );
                            }
                        })
                    ;
                }
            }else{
                return false;
            }
        }
        return $block.length ? $block : false;
    }
    if( $block.length ){
        if( options.templateName ){
            formsPlus.toggleBlockRelatedStatus($block, false);
            formsPlus.removeBlock( $block );
        }else{
            formsPlus.hideBlock( $block );
            return $block;
        }
    }

    return false;
};

formsPlus.triggerToggleBlock                        = function($el, blockName, value){
    var temp                                        = typeof(value) === 'undefined' ? true : value;
    if( $el.is('[type="checkbox"], [type="radio"]') ){
        formsPlus.toggleBlock($el, blockName, temp ? $el.is(':checked') : !$el.is(':checked'));
    }else if( $el.is('option') ){
        formsPlus.toggleBlock($el, blockName, temp ? $el.is(':selected') : !$el.is(':selected'));
    }else{
        formsPlus.toggleBlock($el, blockName, value );
    }
};

// Add init function
formsPlus.initFn.push(function($container){
    $container.find('[data-js-add-block]').each(function(i, $el){
        $el                                         = jQuery($el);
        if( !formsPlus.hasDataString($el, 'jsAddBlock') ){
            return;
        }
        var
            position                                = $el.data('jsInsertPosition'),
            $template                               = jQuery('[data-js-template="' + $el.data('jsAddBlock') + '"]'),
            addBlockGroup                           = $el.data('jsAddBlockGroup') || false,
            max                                     = $el.data('jsAddBlockMax') || false,
            min                                     = $el.data('jsAddBlockMin') || false,
            $toEl                                   = formsPlus.find($el, formsPlus.selectors.addBlockClosest, 'closest')
        ;
        if( !$template.length ){
            return;
        }
        
        if( !$toEl.length ){
            $toEl                                   = $el;
        }
        $el.off('.pAddBlock').off('.pAddBlock').on('fpChange.pAddBlock.pBlockForced', {
                preventOnlyLink     : true
            }, function(){
                formsPlus.createFromTemplate($toEl, position, $template, $el, addBlockGroup, max).fpInit();
                $toEl.trigger('fpAddBlock');
            }
        );
        if( min && addBlockGroup ){
            var
                count                               = jQuery('[data-js-block-group="' + addBlockGroup + '"]').length,
                $els                                = jQuery([])
            ;
            if( count < min ){
                for (var j = 0; j < min; j++) {
                    $els                            = $els.add( formsPlus.createFromTemplate($toEl, position, $template, $el, addBlockGroup, max) );
                }
                $els.fpInit();
                $toEl.trigger('fpAddBlock');
            }
            count = $els = null;
        }
    });

    $container.find('[data-js-remove-block]').off('.pRemoveBlock').on('fpChange.pRemoveBlock.pBlockForced', {
            preventOnlyLink     : true
        }, function(){
            var
                $el                                     = jQuery(this),
                $toRemoveBlock                          = formsPlus.find($el, formsPlus.selectors.removeBlockClosest, 'closest')
            ;
            if( !$toRemoveBlock.length ){
                return;
            }
            formsPlus.removeBlock($toRemoveBlock);
        }
    );

    $container.find('[data-js-show-block]').off('.pShowBlock').on('fpChange.pShowBlock.pBlockForced', {
            preventOnlyLink     : true
        }, function(){
            formsPlus.triggerToggleBlock(jQuery(this), jQuery(this).data('jsShowBlock'), true);
        }
    );

    $container.find('[data-js-hide-block]').off('.pHideBlock').on('fpChange.pHideBlock.pBlockForced', {
            preventOnlyLink     : true
        }, function(){
            formsPlus.triggerToggleBlock(jQuery(this), jQuery(this).data('jsHideBlock'), false);
        }
    );
    $container.find('[data-js-toggle-block]').off('.pToggleBlock').on('fpChange.pToggleBlock.pBlockForced', {
            preventOnlyLink     : true
        }, function(){
            formsPlus.triggerToggleBlock(jQuery(this), jQuery(this).data('jsToggleBlock'));
        }
    );

    $container.find('[data-js-hide-toggle-group]').off('.pHideToggleGroup').on('fpChange.pHideToggleGroup.pBlockForced', {
            preventOnlyLink     : true
        }, function(){
            var
                $el                                     = jQuery(this),
                name                                    = $el.data('jsHideToggleGroup')
            ;
            jQuery('[data-js-toggle-group="' + name + '"]:visible')
                .each(function(i, $hideBlock){
                    $hideBlock                          = jQuery($hideBlock);
                    if( $hideBlock.is( formsPlus.selectors.template ) ){
                        formsPlus.toggleBlockRelatedStatus($hideBlock, false);
                        formsPlus.removeBlock( $hideBlock );
                    }else{
                        formsPlus.hideBlock( $hideBlock );
                    }
                })
            ;
        }
    );

    $container.find('[data-js-force-block-action]').each(function(i, el){
        jQuery(el).triggerHandler('fpChange.pBlockForced');
    });
});