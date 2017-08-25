/* global formsPlus */

// Multiupload
if(jQuery().fileupload){
    jQuery.fn.fpMultiupload                         = function(opts){
        if( !formsPlus.pluginCheck(this, "Forms Plus: multiupload - Nothing selected.") ){
            return this;
        }
        jQuery.each(this, function(i, $el){
            $el                                     = jQuery($el);
            var options                             = jQuery.extend({
                // Uncomment the following to send cross-domain cookies:
                //xhrFields                          : {withCredentials: true},
                pasteZone                           : $el,
                autoUpload                          : false,
                uploadTemplateId                    : 'p-form-template-upload',
                downloadTemplateId                  : 'p-form-template-download',
                filesContainer                      : $el.find('.p-files-blocks'),
                previewMaxWidth                     : 640,
                previewMaxHeight                    : 640
            }, opts);
            // Initialize the jQuery File Upload widget:
            $el.fileupload(options);
        });
        return this;
    };
    // Add init function
    formsPlus.initFn.push(function($container){
        $container.find('[data-js-multiupload]').fpMultiupload();
    });
}