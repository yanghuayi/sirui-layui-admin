(function ($) {
  $.fn.message = function (options) {
    var defaults = {
      type: 'info',
      content: '这是一个消息',
      time: 2000,
      onClose: function () {}
    };
    options = $.extend(defaults, options);
    if ($('.ant-message').length === 0) {
      $('body').append('<div class="ant-message"></div>');
    }
    var mes_length = $('.ant-message .ant-message-notice').length;
    var html = '<div id="ant-message-' + mes_length + '" class="ant-message-notice">\n' +
      '<div class="ant-message-notice-content">\n' +
      '<div class="ant-message-custom-content ant-message-' + options.type + '">\n' +
      '<i class="msg-icon msg-icon-' + options.type + '"></i><span>' + options.content + '</span>\n' +
      '</div>\n' +
      '</div>\n' +
      '</div>';
    $('.ant-message').append(html);
    setTimeout(function () {
      $('#ant-message-' + mes_length).addClass('show');
    }, 200);
    setTimeout(function () {
      $('#ant-message-' + mes_length).removeClass('show');
      setTimeout(function () {
        $('#ant-message-' + mes_length).remove();
        options.onClose();
      }, 500);
    }, options.time);
  }
})(jQuery);