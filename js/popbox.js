(function(){

  $.fn.popbox = function(options){
    var settings = $.extend({
      element       : this,
      selector      : this.selector,
      open          : '.popbox-open',
      box           : '.popbox-box',
      close         : '.popbox-close',
      box_menu      : '.popbox-menu',
      box_menu_item : '.popbox-menu-item',
      width         : '250px'
    }, options);
    
    var methods = {
      open: function(event){
        event.preventDefault();

        var pop = $(this);
        var box = $(this).parent().find(settings['box']);

        if(box.css('display') == 'block'){
          methods.close();
        } else {
          methods.close();
          
          var box_align = $($(this).parent()).data('align');
          
          switch (box_align) { 
            case 'center':
              box.css({'display': 'block', 'top': 5, 'left': ((pop.parent().width()/2) -box.width()/2 )}); // center align
              break;
            case 'left':
              box.css({'display': 'block', 'top': 5, 'left': 0 }); // right left
              break;
            case 'right':
              box.css({'display': 'block', 'top': 5, 'right': 0 }); // right align
              break;
            default:
              box.css({'display': 'block', 'top': 5, 'left': 0 }); // right left
              break;
          }
        }
      },

      close: function(){
        $(settings['box']).fadeOut("fast");
      },
      
      init: function(e){
        var menu   = $(e).find(settings['box_menu']),
            target = menu.data('target'),
            target_id = '#' + target
            type   = menu.data('type')
            empty  = menu.data('empty')
            
        switch (type) {
          case 'radio':
            var value = $(target_id).val()
            if (value != '') {
              $(e).find('[data-value="' + value + '"]').addClass('selected')
            }
            break;
            
          case 'select':
            var value = $(target_id + ' option[selected="selected"]').val()
            if (value != '') {
              $(e).find('[data-value="' + value + '"]').addClass('selected')
            }
            if (!empty) {
              menu.children().first().addClass('selected')
              $(target_id).children().first().attr('selected', 'selected')
            }
            break;
          case 'multiselect':
            var value = $(target_id).val(),
                selected = $(target_id + ' option[selected="selected"]')
            if (selected.length > 0) {
              selected.each(function(i, v){
                menu.children().eq($(v).index()).addClass('selected')
              })
            } else {
              if (!empty) {
                menu.children().first().addClass('selected')
                $(target_id).children().first().attr('selected', 'selected')
              }
            }
            break;
          default:
            console.log('some is wrong')
            break;
        }
      },
      
      select: function(e) {
        var menu   = $(e).parent(),
            target = menu.data('target'),
            target_id = '#' + target
            target_option = target_id + ' option'
            type   = menu.data('type')
            
        switch (type) {
          case 'radio':
            var value = $(e).data('value');
            if ($(target_id).val() != value) {
              $(target_id).val(value);
            } else {
              $(target_id).val('');
            };
            break;
          ////////////////////////////////////
          case 'select':
            var index = $(e).index(),
                value = $(e).data('value')
                selected_index = $(target_option + '[selected="selected"]').index()
            
            if ($(target_id).find('[value="'+value+'"]').attr('selected') == undefined) {
              $(target_option + ':selected').removeAttr('selected')
              $(target_id).find('[value="'+value+'"]').attr('selected', 'selected')
            } else {
              $(target_option + ':selected').removeAttr('selected')
              $(e).removeClass('selected')
              console.log($(e).removeClass('selected'))
            }
            break;
          ////////////////////////////////////
          case 'multiselect':
            var index = $(e).index(),
                selected_index = $(target_option).eq(index).index()
            
            if (menu.data('empty') == false) {
              if ( $(target_option).eq(index - 1).attr('selected') == undefined ) {
                $(target_option).eq(index - 1).attr('selected', 'selected')
              } else {
                $(target_option).eq(selected_index -1).removeAttr('selected');
              }
            } else {
              if ( $(target_option).eq(index).attr('selected') == undefined ) {
                $(target_option).eq(index).attr('selected', 'selected')
              } else {
                $(target_option).eq(selected_index).removeAttr('selected');
              }
            }
            break;
          default:
            console.log('some is wrong')
            break;
        }
        if ($(e).parent().hasClass('multiselect')) {
          $(e).toggleClass('selected')
        } else {
          $(e).parent().find(settings['box_menu_item']).removeClass('selected')
          if (!$(e).hasClass('selected')) {
            $(e).toggleClass('selected')
          }
        }
      }
    };

    $(document).on('keyup', function(event){
      if(event.keyCode == 27){
        methods.close();
      }
    });

    $(document).on('click', function(event){
      if(!$(event.target).closest(settings['selector']).length){
        methods.close();
      }
    });
    
    $(document).on('click', settings['box_menu_item'], function() {
      methods.select(this)
      
    })
    
    return this.each(function(){
      var box_width = $(this).data('width');
      methods.init($(this))
      if (box_width) {
        $($(this).find(settings['box'])).css({'width': box_width});
      } else {
        $($(this).find(settings['box'])).css({'width': settings['width']});
      };
      
      $(settings['open'], this).on('click', methods.open);
      $(settings['open'], this).parent().find(settings['close']).bind('click', function(event){
        event.preventDefault();
        methods.close();
      });
    });
  }

}).call(this);
