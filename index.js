export default {
  async fetch(request) {
    const url = new URL(request.url);

    // 自动拼接豆包官方 API 地址（最简单写法）
    let targetUrl = 'https://ark.cn-beijing.volcengineapi.com' + url.pathname + url.search;

    // 同时兼容老的 ?url=xxx 写法
    const paramUrl = url.searchParams.get('url');
    if (paramUrl) targetUrl = paramUrl;

    // 转发请求
    const modifiedRequest = new Request(targetUrl, request);
    modifiedRequest.headers.delete('Origin');  // 防止某些头干扰

    let response = await fetch(modifiedRequest);

    // 添加 CORS 头，解决浏览器跨域
    const newHeaders = new Headers(response.headers);
    newHeaders.set('Access-Control-Allow-Origin', '*');
    newHeaders.set('Access-Control-Allow-Methods', '*');
    newHeaders.set('Access-Control-Allow-Headers', '*');

    // 处理预检请求
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: newHeaders });
    }

    return new Response(response.body, {
      status: response.status,
      headers: newHeaders
    });
  }
};