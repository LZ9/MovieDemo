// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

var rp = require('request-promise');

// 云函数入口函数
exports.main = async(event, context) => {

  return rp(`http://api.douban.com/v2/movie/in_theaters?apikey=0df993c66c0c636e29ecbb5344252a4a&start=${event.start}&count=${event.count}`)
    .then(function(res) {
      console.log(res)
      return res
    })
    .catch(function(err) {
      console.error(err)
    });
}


// 由于最近API有变化，需要在请求API的url后面跟一个apikey参数：

// 电影列表API：http://api.douban.com/v2/movie/in_theaters?apikey=0df993c66c0c636e29ecbb5344252a4a&start=0&count=10

// 电影详情API：http://api.douban.com/v2/movie/subject/${event.movieid}?apikey=0df993c66c0c636e29ecbb5344252a4a

// 具体也可以参考课程主页右下角的课程源码。