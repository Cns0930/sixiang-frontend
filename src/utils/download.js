import axios from 'axios'
import { Message } from 'element-ui';

// 批量下载
export function batchDownload(data, url) {
  axios({
    method: 'POST',
    url: `${process.env.VUE_APP_BASE_IP}${url}`,
    responseType: 'arraybuffer',
    xsrfHeaderName: 'Authorization',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('ticket')
    },
    data: data
  }).then((res) => {
    const blob = new Blob([res.data], {
      type: 'application/zip'
    })
    const objectUrl = window.URL.createObjectURL(blob)
    // window.location.href = objectUrl
    const a = document.createElement('a')
    a.href = objectUrl
    a.download = decodeURIComponent(res.headers["content-disposition"])
      .split(";")[1]
      .split("=")[1];
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }).catch(() => {
    Message.error('下载失败，请稍后重试！')
  })
}

// 单个下载
// application/application/vnd.openxmlformats-officedocument.wordprocessingml.document
// application/vnd.openxmlformats-officedocument.spreadsheetml.sheet

export function singleDownload(type, fileName) {
  let _type = ''
  axios({
    method: "GET",
    url: `${process.env.VUE_APP_BASE_IP}/dictionary-file/downloadTemplate`,
    responseType: "blob",
    headers: {
      "Content-Type": "application/octet-stream;charset=UTF-8",
      Authorization: sessionStorage.getItem("token"),
    },
  })
    .then((res) => {
      const blob = new Blob([res.data]);
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = (e) => {
        console.log(e.target);
        const a = document.createElement("a");
        a.download = 'demo.xlsx'
        a.href = e.target.result;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      };
    })
    .catch(() => {
      this.$message.error("下载失败，请稍后重试！");
    });
}
