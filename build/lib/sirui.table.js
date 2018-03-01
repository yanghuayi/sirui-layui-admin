var siruiTable = {
  laypage: null,
  tableParams: {},
  initTableParams: {},
  tableData: [],
  tableConfig: {},
  tableID: '#sirui-table',
  url: '',
  init: function ($, tableParams, url, layer, laypage, form, tableConfig) {
    var self = this;
    this.tableConfig = tableConfig;
    this.laypage = laypage;
    this.initTableParams = tableParams;
    this.tableParams = tableParams;
    this.url = url;
    this.getData($, tableParams, url, function (data) {
      self.initTable(data);
      $('.sirui-loading').fadeOut();
    });
    /* 搜索展开 */
    $('.sirui-more-link').click(function () {
      $(this).parents('.sirui-filter').css('top','-' + $(this).parents('.sirui-filter').height() + 'px');
      $('.sirui-filter-all').addClass('show');
      $('.sirui-table-wrap').css('margin-top', ($('.sirui-filter-all').height() - $(this).parents('.sirui-filter').height() + 10) + 'px');
    });
    /* 搜索关闭 */
    $('.sirui-normal-link').click(function () {
      $(this).parents('.sirui-filter-all').removeClass('show');
      $('.sirui-filter').css('top', '0');
      $('.sirui-table-wrap').css('margin-top', '10px');
    });
    /* 初始化渲染筛选表单 */
    form.render(null, 'filter-normal-group');
    form.render(null, 'filter-advanced-group');
    /* 监听搜索提交 */
    form.on('submit(search)', function (data) {
      var filter = data.field;
      for (var i in self.tableParams) {
        if (filter[i]) {
          self.tableParams[i] = filter[i];
        }
      }
      $(self.tableID).datagrid('loading', true);
      self.getData($, self.tableParams, self.url, function (data) {
        $(self.tableID).datagrid('loadData', data.rows);
        $(self.tableID).datagrid('loaded', true);
        initPage(data);
      });
      return false;
    });

    // 重置搜索
    form.on('submit(reset)', function (data) {
      $(self.tableID).datagrid('loading', true);
      self.getData($, self.initTableParams, self.url, function(data) {
        $(self.tableID).datagrid('loadData', data.rows);
        $(self.tableID).datagrid('loaded', true);
        initPage(data);
      });
      return false;
    });
    // 新增打开事件
    form.on('submit(add)', function (data) {
      layer.open({
        type: 1,
        title: '新增设备',
        area: ['1000px', 'auto'],
        content: $('#addPage').html()
      });
      // 初始化渲染新增表单
      form.render(null, 'add-form-group');
      return false;
    });
  },
  getData: function ($, filterData, url, callback) {
    var self = this;
    $.ajax({
      type: 'POST',
      url: url,
      data: filterData,
      success: function (data) {
        if (data.result) {
          if (data.result.resultCode == 3) {
            window.parent.goLogin();
          }
          $('.ant-message').message({
            type: 'error',
            content: data.result.resultMessage
          });
          $(this.tableID).datagrid('loaded', true);
        } else {
          self.tableData = data.rows;
          callback(data);
        }
      },
      error: function (err) {
        $('.ant-message').message({type: 'error', content: '请求错误'});
        $(this.tableID).datagrid('loaded', true);
      }
    });
  },
  // 初始化表格
  initTable: function (data) {
    this.tableConfig.data = data;
    $(this.tableID).datagrid(this.tableConfig);
    this.initPage(data);
  },
  initPage: function (data) {
    const self = this;
    this.laypage.render({
      elem: 'table_laypage', //注意，这里的 test1 是 ID，不用加 # 号
      count: data.total, //数据总数，从服务端得到
      limit: this.tableParams.rows, //每页显示的条数
      limits: [10, 20, 30, 40, 50], //每页条数的选择项。如果 layout 参数开启了 limit，则会出现每页条数的select选择框
      layout: document.body.clientWidth > 768 ? ['limit', 'count', 'prev', 'page', 'next', 'skip'] : ['prev', 'next', 'skip'],
      jump: function(obj, first) {
        // obj包含了当前分页的所有参数，比如：
        // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
        // console.log(obj.limit); //得到每页显示的条数
        if (first) return false;
        self.tableParams.page = obj.curr;
        self.tableParams.rows = obj.limit;
        $(self.tableID).datagrid('loading', true);
        self.getData($, self.tableParams, self.url, function (data) {
          $(self.tableID).datagrid('loadData', data.rows);
          $(self.tableID).datagrid('loaded', true);
        });
        return false;
      }
    });
  }
}