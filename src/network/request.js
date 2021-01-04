import axios from "axios";

export function request(config){
  //1.创建一个axios实例
  const instance = axios.create({
    baseURL: 'http://152.136.185.210:7878/api/m5',
    timeout: 5000
  });

  //2.1 axios的拦截器
  // instance.interceptors.request.use(config => {
  //   // console.log(config);
  //   return config;
  // },err => {
  //   console.log(err);
  // });


  //2.2 响应拦截
  instance.interceptors.response.use(res => {
    //只去返回结果的data数据
    return res.data;
  },err => {
    console.log(err);
  });

  //3.发送真正的网络请求
  return instance(config)
}
