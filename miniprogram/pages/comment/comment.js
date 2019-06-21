// pages/comment/comment.js

const dbTest = wx.cloud.database({
  env: "qiyue-test-7t6yq"
});

Page({

  /**
   * 页面的初始数据
   */
  data: {
    movieDetail: {},
    content: "", // 评价内容
    score: 5, // 分数
    images: [], //上传图片
    fileids: [],
    movieId: -1,
  },

  onContentChange: function(event) {
    this.setData({
      content: event.detail
    })
  },

  onScoreChange: function(event) {
    this.setData({
      score: event.detail
    })
  },

  onUploadImg: function() {
    // 选择图片
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        this.setData({
          images: this.data.images.concat(tempFilePaths)
        })
      }
    })
  },

  onClickSubmit: function() {
    wx.showLoading({
      title: '提交中',
    })
    console.log(this.data.content);
    console.log(this.data.score);

    // 上传图片到云存储
    let promiseArr = [];
    for (let i = 0; i < this.data.images.length; i++) {
      promiseArr.push(new Promise((reslove, reject) => {
        let item = this.data.images[i];
        let suffix = /\.\w+$/.exec(item)[0]; // 正则表达式，返回文件扩展名
        wx.cloud.uploadFile({
          cloudPath: new Date().getTime() + suffix, // 上传至云端的路径
          filePath: item, // 小程序临时文件路径
          success: res => {
            // 返回文件 ID
            console.log(res.fileID)
            this.setData({
              fileids: this.data.fileids.concat(res.fileID)
            });
            reslove();
          },
          fail: console.error
        })
      }));
    }

    Promise.all(promiseArr).then(res => {
      dbTest.collection("comment").add({
        data: {
          content: this.data.content,
          score: this.data.score,
          movieid: this.data.movieId,
          fileids: this.data.fileids,
        }
      }).then(dbRes => {
        wx.hideLoading();
        wx.showToast({
          title: '评价成功',
        })
      }).catch(dbErr => {
        wx.hideLoading()
        wx.showToast({
          title: '评价失败',
        })
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      movieId: options.movieid
    })
    console.log(options)
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
        name: "movie-detail",
        data: {
          movieid: options.movieid,
        }
      })
      .then(res => {
        console.log(res)
        this.setData({
          movieDetail: JSON.parse(res.result)
        })
        wx.hideLoading()
      })
      .catch(err => {
        console.error(err)
        wx.hideLoading()
        wx.showToast({
          title: '数据加载失败',
        })
      });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})